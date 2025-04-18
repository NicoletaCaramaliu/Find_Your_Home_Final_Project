using Find_Your_Home.Models;
using Find_Your_Home.Models.Users;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Find_Your_Home.Models.Users.DTO;
using Find_Your_Home.Services.UserService;
using Microsoft.IdentityModel.Tokens;

namespace Find_Your_Home.Services.AuthService
{
    public class AuthService : IAuthService
    {
        
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, IUserService userService, IMapper mapper)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _userService = userService;
            _mapper = mapper;
        }

        public async Task<User> Register(UserRegisterDto request)
        {
            var user = _mapper.Map<User>(request);
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.Email = request.Email;
            user.Username = request.Username;
            user.Password = passwordHash;
            user.Role = request.Role;

            if (await _userService.GetUserByEmail(request.Email) != null)
            {
                throw new UnauthorizedAccessException("User already exists.");
            }

            await _userService.CreateUser(user);
            return user;
        }

        public async Task<string> Login(UserLoginDto request)
        {
            var user = await _userService.GetUserByEmail(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Email sau parolă incorectă.");
            }

            string token = CreateToken(user);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken.Token;
            user.TokenCreated = refreshToken.Created;
            user.TokenExpires = refreshToken.Expires;

            await _userService.UpdateUser(user);
            SetRefreshTokenInCookie(refreshToken);

            return token;
        }

        private string CreateToken(User user)
        {
            Console.WriteLine("[DEBUG] Creez token JWT cu expirare 30 sec...");
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };
            
            var expires = DateTime.UtcNow.AddSeconds(30);
            Console.WriteLine("[DEBUG] Expiră la: " + expires.ToString("O"));
            
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);
            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomBytes),
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7)
            };
        }

        private void SetRefreshTokenInCookie(RefreshToken refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            };
            _httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        public async Task<object> RefreshToken()
        {
            Console.WriteLine("[DEBUG] RefreshToken controller called");

            var refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new UnauthorizedAccessException("Nu s-a găsit refreshToken în cookie.");
            }

            var user = await _userService.GetUserByRefreshToken(refreshToken);

            if (user == null || user.RefreshToken != refreshToken || user.TokenExpires < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Token invalid sau expirat.");
            }

            string newToken = CreateToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;

            await _userService.UpdateUser(user);
            SetRefreshTokenInCookie(newRefreshToken);

            return newToken ;
        }


        public async Task<string> Logout()
        {
            var email = _userService.GetMyEmail();
            var user = await _userService.GetUserByEmail(email);
            if (user == null) throw new UnauthorizedAccessException("User not found.");

            user.RefreshToken = "";
            user.TokenCreated = DateTime.MinValue;
            user.TokenExpires = DateTime.MinValue;
            await _userService.UpdateUser(user);

            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken");

            return "User logged out successfully.";
        }
    }
}

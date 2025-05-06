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
using Microsoft.AspNetCore.Http;
using Find_Your_Home.Exceptions;

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
            if (await _userService.GetUserByEmail(request.Email) != null)
            {
                throw new AppException("USER_ALREADY_EXISTS");
            }

            var user = _mapper.Map<User>(request);
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            await _userService.CreateUser(user);
            return user;
        }

        public async Task<string> Login(UserLoginDto request)
        {
            var user = await _userService.GetUserByEmail(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new AppException("INVALID_CREDENTIALS");
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

        public async Task<object> RefreshToken()
        {
            var refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new AppException("REFRESH_TOKEN_NOT_FOUND");
            }

            var user = await _userService.GetUserByRefreshToken(refreshToken);

            if (user == null || user.RefreshToken != refreshToken || user.TokenExpires < DateTime.UtcNow)
            {
                throw new AppException("INVALID_REFRESH_TOKEN");
            }

            string newToken = CreateToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;

            await _userService.UpdateUser(user);
            SetRefreshTokenInCookie(newRefreshToken);

            return newToken;
        }

        public async Task<string> Logout()
        {
            var email = _userService.GetMyEmail();
            var user = await _userService.GetUserByEmail(email);
            if (user == null)
            {
                throw new AppException("USER_NOT_FOUND");
            }

            user.RefreshToken = "";
            user.TokenCreated = DateTime.MinValue;
            user.TokenExpires = DateTime.MinValue;
            await _userService.UpdateUser(user);

            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken");

            return "LOGOUT_SUCCESS";
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };

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
        
        public async Task<(string token, User user)> LoginWithUser(UserLoginDto request)
        {
            var token = await Login(request);
            var user = await _userService.GetUserByEmail(request.Email);
    
            if (user == null)
                throw new AppException("INVALID_CREDENTIALS");

            return (token, user);
        }

    }
}

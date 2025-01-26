using Find_Your_Home.Models;
using Find_Your_Home.Models.User;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Find_Your_Home.Models.User.DTO;
using Find_Your_Home.Services.UserService;
using Microsoft.IdentityModel.Tokens;

namespace Find_Your_Home.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AuthService(IConfiguration configuration, IUserService userService, IMapper mapper)
        {
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
            _userService.CreateUser(user);
            return user;
        }

        public async Task<string> Login(UserLoginDto request)
        {
            var inputUser = _mapper.Map<User>(request);
            var user = await _userService.GetUserByEmail(inputUser.Email);
            
            
            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found. Invalid email.");
            }
            
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Wrong password.");
            }

            string token = CreateToken(inputUser);
            
            var newRefreshToken = GenerateRefreshToken();
            
            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = DateTime.Now;
            user.TokenExpires = newRefreshToken.Expires;
            
            await _userService.UpdateUser(user);
            
            return token;
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

         public RefreshToken GenerateRefreshToken()
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7)
            };
        }
    }
}

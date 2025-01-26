using Find_Your_Home.Models;
using Find_Your_Home.Models.User;
using Microsoft.Extensions.Configuration;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Find_Your_Home.Services.UserService
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private static User _user = new User(); // Acesta ar trebui să fie înlocuit cu un repository real de utilizatori

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public User Register(UserRegisterDto request)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            _user.Email = request.Email;
            _user.Username = request.Username;
            _user.Password = passwordHash;
            _user.Role = request.Role;

            return _user;
        }

        public string Login(UserLoginDto request)
        {
            if (_user.Email != request.Email)
            {
                throw new UnauthorizedAccessException("User not found. Invalid email.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, _user.Password))
            {
                throw new UnauthorizedAccessException("Wrong password.");
            }

            string token = CreateToken(_user);
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

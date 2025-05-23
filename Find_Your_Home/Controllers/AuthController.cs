﻿using System.Security.Claims;
using AutoMapper;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Models.Users.DTO;
using Find_Your_Home.Services.AuthService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public AuthController(IAuthService authService, IUserService userService, IMapper mapper, IEmailService emailService)
        {
            _emailService = emailService;
            _authService = authService;
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("me"), Authorize(Roles = "Admin")]
        public ActionResult<string> GetMyName()
        {
            var myName = _userService.GetMyName();
            return Ok(new { Username = myName });
        }

        [HttpGet("id"), Authorize]
        public ActionResult<string> GetMyId()
        {
            var myId = _userService.GetMyId();
            return Ok(new { Id = myId });
        }

        [HttpGet("email"), Authorize(Roles = "Admin")]
        public ActionResult<string> GetMyEmail()
        {
            var myEmail = _userService.GetMyEmail();
            return Ok(new { Email = myEmail });
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserRegisterDto request)
        {
            try
            {
                var user = await _authService.Register(request);
                return Ok(user);
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(UserLoginDto request)
        {
            try
            {
                var token = await _authService.Login(request);
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult> RefreshToken()
        {
            try
            {
                var token = await _authService.RefreshToken();
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }

        [HttpPost("logout"), Authorize]
        public async Task<ActionResult> Logout()
        {
            try
            {
                await _authService.Logout();
                return Ok(new { Message = "Logged out successfully." });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }
        
        //reset pass
        [HttpPost("request-password-reset")]
        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] string email)
        {
            var user = await _userService.GetUserByEmail(email);
            if (user == null) return BadRequest("Email inexistent");

            var token = Guid.NewGuid().ToString();
            user.ResetToken = token;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
            await _userService.UpdateUser(user);

            await _emailService.SendPasswordResetEmailAsync(email, token);

            return Ok("Email de resetare trimis.");
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _userService.GetUserByResetToken(request.Token);
            if (user == null || user.ResetTokenExpires < DateTime.UtcNow)
                return BadRequest("Token invalid sau expirat");

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpires = null;
            await _userService.UpdateUser(user);

            return Ok("Parola a fost resetată cu succes.");
        }
    }
}

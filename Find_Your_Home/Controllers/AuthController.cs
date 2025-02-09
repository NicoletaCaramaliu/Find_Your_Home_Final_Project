using AutoMapper;
using Find_Your_Home.Models.User;
using Find_Your_Home.Models.User.DTO;
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

        public AuthController(IAuthService authService, IUserService userService, IMapper mapper)
        {
            _authService = authService;
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("me"), Authorize]
        public ActionResult<string> GetMyName()
        {
            var myName = _userService.GetMyName();
            return Ok(new { Username = myName });
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
        public async Task<ActionResult<string>> Login(UserLoginDto request)
        {
            try
            {
                var token = await _authService.Login(request);
                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<string>> RefreshToken()
        {
            try
            {
                var token = _authService.GenerateRefreshToken();
                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }
        
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            try
            {
                var email = User.Identity.Name;
                await _authService.Logout(email);
                return Ok(new { Message = "Logged out successfully." });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }
    }
}

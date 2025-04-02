using AutoMapper;
using Find_Your_Home.Models.Users.DTO;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class UserController: ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        
        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
            
        }

        [HttpGet("getUser")]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserById(id);
            var userDto = _mapper.Map<UserDto>(user);
            
            return Ok(userDto);
        }
    }
}


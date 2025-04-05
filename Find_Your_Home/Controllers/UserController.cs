using AutoMapper;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Models.Users.DTO;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class UserController: ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IPropertyService _propertyService;
        
        public UserController(IUserService userService, IMapper mapper, IPropertyService propertyService)
        {
            _propertyService = propertyService;
            _userService = userService;
            _mapper = mapper;
            
        }

        [HttpGet("getUser"), Authorize]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserById(id);
            var userDto = _mapper.Map<UserDto>(user);
            
            return Ok(userDto);
        }
        
        [HttpGet("getLoggedUser"), Authorize]
        public async Task<ActionResult<UserDto>> GetLoggedUser()
        {
            var email = _userService.GetMyEmail();
            var user = await _userService.GetUserByEmail(email);
            var userDto = _mapper.Map<UserDto>(user);
            
            return Ok(userDto);
        }
        
                 
        [HttpGet("getAllMyProperties"), Authorize]
        public async Task<ActionResult<IEnumerable<PropertyResponse>>> GetAllMyProperties()
        {
            var userId = _userService.GetMyId();
            var properties = await _propertyService.GetAllPropertiesByUserId(userId);
            var propertiesDto = _mapper.Map<IEnumerable<PropertyResponse>>(properties);
            return Ok(propertiesDto);
        }
    }
}


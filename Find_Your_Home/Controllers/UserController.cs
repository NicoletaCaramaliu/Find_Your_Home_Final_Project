﻿using AutoMapper;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Models.Users.DTO;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Find_Your_Home.Exceptions;
using Find_Your_Home.Services.Files;
using Microsoft.EntityFrameworkCore;


namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
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
            if (user == null)
                throw new AppException("USER_NOT_FOUND");

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        [HttpGet("getLoggedUser"), Authorize]
        public async Task<ActionResult<UserDto>> GetLoggedUser()
        {
            var email = _userService.GetMyEmail();
            var user = await _userService.GetUserByEmail(email);
            if (user == null)
                throw new AppException("USER_NOT_FOUND");

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        [HttpGet("getAllMyProperties"), Authorize]
        public async Task<ActionResult<IEnumerable<PropertyResponse>>> GetAllMyProperties()
        {
            var userId = _userService.GetMyId();

            var propertiesQuery = await _propertyService.GetAllPropertiesByUserId(userId);
            var propertiesList = await propertiesQuery.ToListAsync(); 
            var propertiesDto = await _propertyService.MapPropertiesWithImagesAsync(propertiesList);
            return Ok(propertiesDto);
            
        }


        [HttpPut("updateMyInfo"), Authorize]
        public async Task<ActionResult<UserDto>> UpdateMyInfo([FromBody] UpdateUserRequest request)
        {
            var userId = _userService.GetMyId();
            var user = await _userService.GetUserById(userId);
            if (user == null)
                throw new AppException("USER_NOT_FOUND");

            user.Username = request.Username;
            user.ProfilePicture = request.ProfilePicture;

            var result = await _userService.UpdateUser(user);
            var userDto = _mapper.Map<UserDto>(result);
            return Ok(userDto);
        }

        [HttpPut("updateProfilePicture"), Authorize]
        public async Task<ActionResult<string>> UpdateProfilePicture(
            [FromForm] IFormFile file,
            [FromServices] FileService fileService)
        {
            if (file == null || file.Length == 0)
                throw new AppException("INVALID_FILE");

            var userId = _userService.GetMyId();
            var user = await _userService.GetUserById(userId);
            if (user == null)
                throw new AppException("USER_NOT_FOUND");

            var imageUrl = await fileService.SaveFileAsync(file, true);

            user.ProfilePicture = imageUrl;
            await _userService.UpdateUser(user);

            return Ok(imageUrl);
        }


        [HttpPut("changePassword"), Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = _userService.GetMyId();
            var user = await _userService.GetUserById(userId);
            if (user == null)
                throw new AppException("USER_NOT_FOUND");

            if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password))
                throw new AppException("OLD_PASSWORD_INVALID");

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _userService.UpdateUser(user);

            return Ok(new { message = "PASSWORD_CHANGED_SUCCESSFULLY" });
        }

        [HttpDelete("deleteMe"), Authorize]
        public async Task<IActionResult> DeleteMyAccount()
        {
            var userId = _userService.GetMyId();
            var result = await _userService.DeleteUserAndDependencies(userId);

            if (!result)
                throw new AppException("USER_NOT_FOUND");

            return Ok(new { message = "USER_DELETED_SUCCESSFULLY" });
        }

        [HttpGet("getAllUsers"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            if (users == null || !users.Any())
                throw new AppException("NO_USERS_FOUND");

            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
            return Ok(userDtos);
        }

        [HttpDelete("deleteUser"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser([FromQuery] Guid userId)
        {
            var result = await _userService.DeleteUserAndDependencies(userId);
            if (!result)
                throw new AppException("USER_NOT_FOUND");

            return Ok(new { message = "USER_DELETED_SUCCESSFULLY" });
        }
    }
}

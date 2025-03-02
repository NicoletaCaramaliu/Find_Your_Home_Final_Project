using System.Security.Claims;
using AutoMapper;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Repositories.PropertyImgRepository;
using Find_Your_Home.Services.PropertyImagesService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly IPropertyImgService _propertyImagesService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public PropertiesController(IPropertyService propertyService, IPropertyImgService propertyImagesService, IUserService userService,IMapper mapper)
        {
            _propertyService = propertyService;
            _propertyImagesService = propertyImagesService;
            _userService = userService;
            _mapper = mapper;
        }   
        
        [HttpPost("createProperty"), Authorize]
        public async Task<ActionResult<Property>> CreateProperty(PropertyRequest propertyRequest)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User not authenticated");
            }
            
            var user = await _userService.GetUserByEmail(userEmail);
            
            if (user == null)
            {
                return Unauthorized("User not found");
            }
            
            var newProperty = _mapper.Map<Property>(propertyRequest);
            newProperty.OwnerId = user.Id;
            
            var createdProperty = await _propertyService.CreateProperty(newProperty);
            
            var propertyDto = _mapper.Map<PropertyResponse>(createdProperty);
            return Ok(propertyDto);
        }
        
        [HttpGet] 
         public async Task<ActionResult<string>> GetPropertyImages(Guid propertyId)
        {
            var propertyImages = await _propertyImagesService.GetPropertyImages(propertyId);
            var imagesUrl = propertyImages.Select(img => img.ImageUrl).ToList();
            return Ok(imagesUrl);
        }
    }
}
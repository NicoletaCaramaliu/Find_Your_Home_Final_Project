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
        public async Task<ActionResult<PropertyResponse>> CreateProperty(
            [FromForm] PropertyRequest propertyRequest,
            [FromForm] List<IFormFile> images,
            [FromServices] ImageService imageService)
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
            
            //salvare imagini Azure
            if (images != null && images.Count > 0)
            {
                int order = 1;
                foreach (var image in images)
                {
                    var imageUrl = await imageService.SaveImageAsync(image);
                    var propertyImage = new PropertyImage
                    {
                        ImageUrl = imageUrl,
                        PropertyId = createdProperty.Id,
                        Order = order++
                        
                    };
                    await _propertyImagesService.AddImageToProperty(propertyImage);
                }
            }
            
            var propertyDto = _mapper.Map<PropertyResponse>(createdProperty);
            return Ok(propertyDto);
        }
        
        [HttpGet("getAllPropertyImages")] 
         public async Task<ActionResult<string>> GetPropertyImages(Guid propertyId)
        {
            var propertyImages = await _propertyImagesService.GetPropertyImages(propertyId);
            var imagesUrl = propertyImages.Select(img => img.ImageUrl).ToList();
            return Ok(imagesUrl);
        }
         
         [HttpGet("getAllProperties")]
         public async Task<ActionResult<IEnumerable<PropertyResponse>>> GetAllProperties()
         {
             var properties = await _propertyService.GetAllProperties();
             var propertiesDto = _mapper.Map<IEnumerable<PropertyResponse>>(properties);
             return Ok(propertiesDto);
         }
         
         //Filter properties
        [HttpGet("filterProperties")]
        public async Task<ActionResult<List<PropertyResponse>>> FilterProperties([FromQuery] FilterCriteria filterRequest)
        {
            var properties = await _propertyService.FilterProperties(filterRequest);
            var propertiesDto = _mapper.Map<List<PropertyResponse>>(properties);
            if (propertiesDto.Count == 0)
            {
                return NotFound("No properties found");
            }
            return Ok(propertiesDto);
        }
        
    }
}
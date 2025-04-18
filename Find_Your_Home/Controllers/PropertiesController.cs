using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using AutoMapper;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Services.PropertyImagesService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        
        [HttpPost("createProperty"), Authorize(Roles = "Admin, Agent, PropertyOwner")]
        public async Task<ActionResult<PropertyResponse>> CreateProperty(
            [FromForm] PropertyRequest propertyRequest,
            [FromForm] List<IFormFile> images,
            [FromServices] ImageService imageService,
            [FromServices] ImageHashService hashService)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User not authenticated");
            }
            
            var user = await _userService.GetUserByEmail(userEmail);
            
            
            var newProperty = _mapper.Map<Property>(propertyRequest);
            newProperty.OwnerId = user.Id;
            var createdProperty = await _propertyService.CreateProperty(newProperty);
            
            //salvare imagini Azure
            if ( images.Count > 0)
            {
                int order = 1;
                foreach (var image in images)
                {
                    var hash = await hashService.ComputeHashAsync(image);

                    bool alreadyExists = await _propertyImagesService.ImageHashExistsAsync(createdProperty.Id, hash);

                    if (alreadyExists)
                        continue;

                    var imageUrl = await imageService.SaveImageAsync(image);
                    var propertyImage = new PropertyImage
                    {
                        ImageUrl = imageUrl,
                        PropertyId = createdProperty.Id,
                        Hash = hash,  
                        Order = order++
                        
                    };
                    await _propertyImagesService.AddImageToProperty(propertyImage);
                }
            }
            
            var propertyDto = _mapper.Map<PropertyResponse>(createdProperty);
            return Ok(propertyDto);
        }
        
        [HttpGet("getAllPropertyImages"), Authorize] 
        public async Task<ActionResult<IEnumerable<object>>> GetPropertyImages(Guid propertyId)
        {
            var propertyImages = await _propertyImagesService.GetPropertyImages(propertyId);

            var result = propertyImages.Select(img => new
            {
                id = img.Id,
                imageUrl = img.ImageUrl
            });

            return Ok(result);
        }
         
        [HttpDelete("deletePropertyImage"), Authorize(Roles = "Admin, Agent, PropertyOwner")]
        public async Task<IActionResult> DeletePropertyImage(Guid imageId)
        {
            var userId = _userService.GetMyId();
            var image = await _propertyImagesService.GetImageById(imageId);

            var property = await _propertyService.GetPropertyByID(image.PropertyId);
            if (property.OwnerId != userId)
            {
                return Unauthorized("You are not authorized to delete this image");
            }

            await _propertyImagesService.DeleteImage(imageId);
            return Ok("Image deleted successfully");
        }

         
         [HttpGet("getAllProperties"), Authorize]
         public async Task<ActionResult<IEnumerable<PropertyResponse>>> GetAllProperties()
         {
             var properties = await _propertyService.GetAllProperties();
             var propertiesDto = _mapper.Map<IEnumerable<PropertyResponse>>(properties);
             return Ok(propertiesDto);
         }

         
         [HttpGet("getAllPropertiesByUserId"), Authorize]
         public async Task<ActionResult<IEnumerable<PropertyResponse>>> GetAllPropertiesByUserId(Guid userId)
         {
             var properties = await _propertyService.GetAllPropertiesByUserId(userId);
             var propertyIds = properties.Select(p => p.Id).ToList();


             var propertyImages = await _propertyImagesService.GetFirstPropertyImages(propertyIds);

             var propertiesDto = new List<PropertyResponse>();

             foreach (var property in properties)
             {
                 var propertyResponse = _mapper.Map<PropertyResponse>(property);
                 var propertyImage = propertyImages.FirstOrDefault(pi => pi.PropertyId == property.Id);
                 propertyResponse.FirstImageUrl = propertyImage?.ImageUrl;
                 propertiesDto.Add(propertyResponse);
             }

             return Ok(propertiesDto);
         }

         
         /*//Filter properties
         [HttpGet("filterProperties")]
         public async Task<ActionResult<PaginatedResponse<PropertyResponse>>> FilterProperties(
             [FromQuery] FilterCriteria filterRequest, int pageNumber = 1, int pageSize = 30)
         {
             if (pageNumber <= 0) pageNumber = 1;
             if (pageSize <= 0 || pageSize > 50) pageSize = 10;

             
             var (properties, totalCount) = await _propertyService.FilterPropertiesWithCount(filterRequest, pageNumber, pageSize);
    
             var propertiesDto = new List<PropertyResponse>();
             foreach (var property in properties)
             {
                 var propertyResponse = _mapper.Map<PropertyResponse>(property);
                 var propertyImages = await _propertyImagesService.GetPropertyImages(property.Id);
                 propertyResponse.FirstImageUrl = propertyImages.FirstOrDefault()?.ImageUrl;
                 propertiesDto.Add(propertyResponse);
             }

             
             return Ok(new PaginatedResponse<PropertyResponse>
             {
                 Items = propertiesDto,
                 TotalCount = totalCount
             });
         }*/

        
        //get property by id
        [HttpGet("{id}"), Authorize]

        public async Task<ActionResult<PropertyResponse>> GetPropertyById(Guid id)
        {
            var property = await _propertyService.GetPropertyByID(id);
            var propertyResponse = _mapper.Map<PropertyResponse>(property);
            return Ok(propertyResponse);
        }

        [HttpGet("sortProperties"), Authorize]
        public async Task<ActionResult<List<PropertyResponse>>> SortProperties([FromQuery] SortCriteria sortCriteria)
        {
            var properties = await _propertyService.SortProperties(sortCriteria);
            var propertiesDto = new List<PropertyResponse>();
            foreach (var property in properties)
            {
                var propertyResponse = _mapper.Map<PropertyResponse>(property);

                var propertyImages = await _propertyImagesService.GetPropertyImages(property.Id);
        
                propertyResponse.FirstImageUrl = propertyImages.FirstOrDefault()?.ImageUrl;

                propertiesDto.Add(propertyResponse);
            }

            return Ok(propertiesDto);
        }
        
       /* [HttpGet("searchProperties")]
        public async Task<ActionResult<List<PropertyResponse>>> SearchProperties([FromQuery] string searchText)
        {
            var properties = await _propertyService.SearchProperties(searchText);
            var propertiesDto = new List<PropertyResponse>();
            foreach (var property in properties)
            {
                var propertyResponse = _mapper.Map<PropertyResponse>(property);

                var propertyImages = await _propertyImagesService.GetPropertyImages(property.Id);
        
                propertyResponse.FirstImageUrl = propertyImages.FirstOrDefault()?.ImageUrl;

                propertiesDto.Add(propertyResponse);
            }

            return Ok(propertiesDto);
        }*/
        
       [HttpGet("filterAndSortProperties"), Authorize]
       public async Task<ActionResult<PaginatedResponse<PropertyResponse>>> FilterAndSortProperties(
           [FromQuery] FilterCriteria filterRequest,
           [FromQuery] SortCriteria sortCriteria,
           [FromQuery] string searchText = null,
           [FromQuery] int pageNumber = 1,
           [FromQuery] int pageSize = 30)
       {
           if (pageNumber <= 0) pageNumber = 1;
           if (pageSize <= 0 || pageSize > 50) pageSize = 10;

           var propertiesQuery = await _propertyService.GetAllAvailableProperties();

           if (!string.IsNullOrEmpty(searchText))
           {
               propertiesQuery = await _propertyService.SearchProperties(propertiesQuery, searchText);
           }

           propertiesQuery = await _propertyService.FilterProperties(propertiesQuery, filterRequest);
           propertiesQuery = await _propertyService.SortFilteredProperties(propertiesQuery, sortCriteria);

           var totalCount = await propertiesQuery.CountAsync();
           var propertiesFiltered = await propertiesQuery
               .Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
               .ToListAsync();

           var propertiesDto = await _propertyService.MapPropertiesWithImagesAsync(propertiesFiltered);

           return Ok(new PaginatedResponse<PropertyResponse>
           {
               Items = propertiesDto,
               TotalCount = totalCount
           });
       }



        
        [HttpPost("increaseViews"), Authorize]
        public async Task<ActionResult<PropertyResponse>> IncreaseViews(Guid propertyId)
        {
            var property = await _propertyService.GetPropertyByID(propertyId);
            //verify if the user authenticated is the owner of the property
            var userId = _userService.GetMyId();
            if (property.OwnerId == userId)
            {
                return Ok(property);
            }

            property.Views++;
            await _propertyService.UpdateProperty(property);

            var propertyResponse = _mapper.Map<PropertyResponse>(property);
            return Ok(propertyResponse);
        }

        [HttpPut("updateProperty"), Authorize(Roles = "Admin, Agent, PropertyOwner")]
        public async Task<ActionResult<object>> UpdateProperty(
            [FromForm] PropertyRequest propertyRequest,
            [FromForm] List<IFormFile> images,
            [FromServices] ImageService imageService,
            [FromServices] ImageHashService hashService)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail)) return Unauthorized("User not authenticated");

            var user = await _userService.GetUserByEmail(userEmail);
            var property = await _propertyService.GetPropertyByID(propertyRequest.Id);
            var userId = _userService.GetMyId();

            if (property.OwnerId != userId)
                return Unauthorized("You are not authorized to update this property");

            var updatedProperty = _mapper.Map(propertyRequest, property);

            List<string> duplicates = new();

            if (images.Count > 0)
            {
                var existingImages = await _propertyImagesService.GetPropertyImages(updatedProperty.Id);
                var existingHashes = existingImages
                    .Where(i => !string.IsNullOrEmpty(i.Hash))
                    .Select(i => i.Hash!)
                    .ToHashSet();

                int maxOrder = existingImages.Any() ? existingImages.Max(i => i.Order) : 0;

                foreach (var image in images)
                {
                    var hash = await hashService.ComputeHashAsync(image);

                    if (existingHashes.Contains(hash))
                    {
                        duplicates.Add(image.FileName);
                        continue;
                    }

                    var imageUrl = await imageService.SaveImageAsync(image);
                    var propertyImage = new PropertyImage
                    {
                        ImageUrl = imageUrl,
                        PropertyId = updatedProperty.Id,
                        Hash = hash,
                        Order = ++maxOrder
                    };
                    await _propertyImagesService.AddImageToProperty(propertyImage);
                }
            }

            await _propertyService.UpdateProperty(updatedProperty);
            var propertyDto = _mapper.Map<PropertyResponse>(updatedProperty);

            return Ok(new
            {
                Property = propertyDto,
                Duplicates = duplicates
            });
        }

        
        [HttpDelete("deleteProperty"), Authorize(Roles = "Admin, Agent, PropertyOwner, Moderator")]
        public async Task<ActionResult> DeleteProperty(Guid propertyId)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User not authenticated");
            }


            var property = await _propertyService.GetPropertyByID(propertyId);

            var userId = _userService.GetMyId();
            if (property.OwnerId != userId)
            {
                return Unauthorized("You are not authorized to delete this property");
            }

            await _propertyService.DeleteProperty(property.Id);
            return NoContent();
        }

    }
}
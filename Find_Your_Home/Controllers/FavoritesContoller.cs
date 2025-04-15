using AutoMapper;
using Find_Your_Home.Models.Favorites.DTO;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Services.FavoriteService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IPropertyService _propertyService;
        public FavoritesController(IFavoriteService favoriteService, IMapper mapper, IUserService userService, IPropertyService propertyService)
        {
            _favoriteService = favoriteService;
            _mapper = mapper;
            _userService = userService;
            _propertyService = propertyService;
        }
        
        [HttpPost("addToFavorites"), Authorize]
        public async Task<ActionResult<FavoriteResponse>> AddToFavorites(Guid propertyId)
        {
            var userId = _userService.GetMyId();
            var favoritedProperty = await _favoriteService.AddToFavorites(userId, propertyId);
            if (favoritedProperty == null)
            {
                return NotFound("Property not found");
            }
            var favoriteDto = _mapper.Map<FavoriteResponse>(favoritedProperty);
            return Ok(favoriteDto);

        }

        [HttpGet("getFavorites")]
        public async Task<ActionResult<IEnumerable<FavoriteResponse>>> GetAllFavorites()
        {
            var favorites = await _favoriteService.GetAllFavoritedProperties();
            if (!favorites.Any())
            {
                return NotFound("No favorites found");
            }

            var favoriteDtos = _mapper.Map<IEnumerable<FavoriteResponse>>(favorites);
            return Ok(favoriteDtos);
        }
        
        [HttpPost("addToMyFavorites"), Authorize]
        public async Task<ActionResult<FavoriteResponse>> AddToMyFavorites(Guid propertyId)
        {
            var userId = _userService.GetMyId();
            var property = await _propertyService.GetPropertyByID(propertyId);
    
            var favoritedProperty = await _favoriteService.AddToFavorites(userId, propertyId);

            if (favoritedProperty == null)
            {
                return Conflict(new { Message = "Proprietatea este deja în lista de favorite." });
            }

            var favoriteDto = _mapper.Map<FavoriteResponse>(favoritedProperty);
            return Ok(favoriteDto);
        }


        /*
        [HttpGet("getMyFavorites"), Authorize]
        public async Task<ActionResult<IEnumerable<FavoriteResponse>>> GetMyFavorites()
        {
            var userId = _userService.GetMyId();
            var favorites = await _favoriteService.GetFavoritesByUserId(userId);
            if (!favorites.Any())
            {
                return NotFound("No favorites found");
            }

            var favoriteDtos = _mapper.Map<IEnumerable<FavoriteResponse>>(favorites);
            return Ok(favoriteDtos);
        }
        */
        
        [HttpGet("getMyFavorites"), Authorize]
        public async Task<ActionResult<IEnumerable<PropertyResponse>>> GetMyFavorites()
        {
            var userId = _userService.GetMyId();
            var favorites = await _favoriteService.GetFavoritesByUserId(userId);

            var properties = favorites
                .Where(f => f.Property != null)
                .Select(f => f.Property)
                .ToList();

            var propertyDtos = await _propertyService.MapPropertiesWithImagesAsync(properties);

            return Ok(propertyDtos);
        }


        
        [HttpGet("isAlreadyFavorited"), Authorize]
        public async Task<ActionResult<bool>> IsAlreadyFavorited(Guid propertyId)
        {
            var userId = _userService.GetMyId();
            var isFavorited = await _favoriteService.IsAlreadyFavorited(userId, propertyId);
            return Ok(isFavorited);
        }
        
        [HttpDelete("removeFromFavorites"), Authorize]
        public async Task<ActionResult> RemoveFromFavorites(Guid propertyId)
        {
            var userId = _userService.GetMyId();
            var isFavorited = await _favoriteService.IsAlreadyFavorited(userId, propertyId);
            if (!isFavorited)
            {
                return NotFound("Property not found in favorites");
            }
            
            var result = await _favoriteService.RemoveFromFavorites(userId, propertyId);
            if (result)
            {
                return Ok("Property removed from favorites");
            }
            return BadRequest("Failed to remove property from favorites");
        }

    }
}
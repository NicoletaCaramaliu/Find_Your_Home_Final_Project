
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Repositories.FavoriteRepository;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.UnitOfWork;

namespace Find_Your_Home.Services.FavoriteService
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IPropertyRepository _propertyRepository;
        private readonly IUnitOfWork _unitOfWork;
        public FavoriteService(IFavoriteRepository favoriteRepository, IPropertyRepository propertyRepository, IUnitOfWork unitOfWork)
        {
            _favoriteRepository = favoriteRepository;
            _propertyRepository = propertyRepository;
            _unitOfWork = unitOfWork;
        }
        
        
        public async Task<Favorite> AddToFavorites(Guid userId, Guid propertyId)
        {
            var favorite = _favoriteRepository.CreateFavoriteForUser(userId, propertyId);

            return await favorite;
        }

        public async Task<IEnumerable<Favorite>> GetAllFavoritedProperties()
        {
            var favorites = await _favoriteRepository.GetAllAsync();
            if (favorites == null || !favorites.Any())
            {
                return null;
            }

            return favorites.ToList();
        }
    }
}
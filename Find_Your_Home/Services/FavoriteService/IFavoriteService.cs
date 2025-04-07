using Find_Your_Home.Models.Favorites;

namespace Find_Your_Home.Services.FavoriteService
{
    public interface IFavoriteService
    {
        Task<Favorite> AddToFavorites(Guid propertyId, Guid userId);
        Task<IEnumerable<Favorite>> GetAllFavoritedProperties();
        Task<IEnumerable<Favorite>> GetFavoritesByUserId(Guid userId);
        Task<bool> IsAlreadyFavorited(Guid userId, Guid propertyId);
        Task<bool> RemoveFromFavorites(Guid propertyId, Guid userId);
    }
}
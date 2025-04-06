using Find_Your_Home.Models.Favorites;

namespace Find_Your_Home.Services.FavoriteService
{
    public interface IFavoriteService
    {
        Task<Favorite> AddToFavorites(Guid propertyId, Guid userId);
        Task<IEnumerable<Favorite>> GetAllFavoritedProperties();
    }
}
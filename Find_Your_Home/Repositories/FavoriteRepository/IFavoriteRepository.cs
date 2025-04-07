using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.FavoriteRepository
{
    public interface IFavoriteRepository : IGenericRepository<Favorite>
    {
        Task<bool> IsFavoriteAsync(Guid userId, Guid propertyId);
        Task<Favorite> CreateFavoriteForUser(Guid userId, Guid propertyId);
        Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(Guid userId);
        Task<Favorite> GetFavoriteByUserIdAndPropertyIdAsync(Guid userId, Guid propertyId);
    }
}
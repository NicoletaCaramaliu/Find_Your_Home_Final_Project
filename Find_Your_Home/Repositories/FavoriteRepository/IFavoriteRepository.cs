using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.FavoriteRepository
{
    public interface IFavoriteRepository : IGenericRepository<Favorite>
    {
        Task<Favorite> CreateFavoriteForUser(Guid userId, Guid propertyId);
    }
}
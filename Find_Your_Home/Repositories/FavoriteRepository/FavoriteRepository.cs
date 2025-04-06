using Find_Your_Home.Data;
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.FavoriteRepository
{

    public class FavoriteRepository : GenericRepository<Favorite>, IFavoriteRepository
    {
        private readonly ApplicationDbContext _context;

        public FavoriteRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Favorite> CreateFavoriteForUser(Guid userId, Guid propertyId)
        {
            var favorite = new Favorite
            {
                UserId = userId,
                PropertyId = propertyId
            };

            await _context.Favorites.AddAsync(favorite);
            await _context.SaveChangesAsync();

            return favorite;
        }
    }
}
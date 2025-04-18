using Find_Your_Home.Data;
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.FavoriteRepository
{

    public class FavoriteRepository : GenericRepository<Favorite>, IFavoriteRepository
    {
        private readonly ApplicationDbContext _context;

        public FavoriteRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
        
        public async Task<bool> IsFavoriteAsync(Guid userId, Guid propertyId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);
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
        
        public async Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(Guid userId)
        {
            return await _context.Favorites
                .Include(f => f.Property)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }
        
        public async Task<Favorite> GetFavoriteByUserIdAndPropertyIdAsync(Guid userId, Guid propertyId)
        {
            return await _context.Favorites
                .Include(f => f.Property)
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);
        }
    }
}
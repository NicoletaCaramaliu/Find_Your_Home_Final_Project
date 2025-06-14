using Find_Your_Home.Data;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.UserRepository
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User> GetByEmail(string email)
        {
            return await FindSingleOrDefaultAsync(user => user.Email == email);
        }
        
        public async Task<User?> GetByRefreshToken(string refreshToken)
        {
            return await FindSingleOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }
        
        public async Task<User?> GetUserByResetTokenAsync(string token)
        {
            return await FindSingleOrDefaultAsync(u => u.ResetToken == token && u.ResetTokenExpires > DateTime.UtcNow);
        }
        
        public async Task<User?> GetUserWithDependencies(Guid userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Include(u => u.Properties)
                .ThenInclude(p => p.Images)
                .Include(u => u.Favorites)
                .FirstOrDefaultAsync();
        }
        
        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await FindSingleOrDefaultAsync(u => u.Username == username);
        }



    }
}
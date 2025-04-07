using Find_Your_Home.Data;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.UserRepository
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User> GetByEmail(string email)
        {
            return await FindSingleOrDefaultAsync(user => user.Email == email);
        }
        
        public async Task<User?> GetByRefreshToken(string refreshToken)
        {
            return await FindSingleOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }


    }
}
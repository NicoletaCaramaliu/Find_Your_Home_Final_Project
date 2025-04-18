using Find_Your_Home.Models.Users;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.UserRepository
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> GetByEmail(string email);
        Task<User?> GetByRefreshToken(string refreshToken);
        
        Task<User?> GetUserByResetTokenAsync(string token);
        Task<User?> GetUserWithDependencies(Guid userId);

    }
}
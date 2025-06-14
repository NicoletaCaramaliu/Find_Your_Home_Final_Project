using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Services.UserService
{
    public interface IUserService
    {
        string GetMyName();
        string GetMyEmail();
        Guid GetMyId();
        Task<User> GetUserById(Guid id);
        Task<User> GetUserByEmail(string email);
        Task CreateUser(User user);
        //Get all users
        Task<IEnumerable<User>> GetAllUsers();
        
        Task<User> UpdateUser(User user);
        Task<User?> GetUserByRefreshToken(string refreshToken);
        
        Task<User?> GetUserByResetToken(string token);
        
        Task<bool> DeleteUserAndDependencies(Guid userId);
        Task<User?> GetUserByUsername(string username);
        
    }
}

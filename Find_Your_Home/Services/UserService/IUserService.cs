using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Services.UserService
{
    public interface IUserService
    {
        string GetMyName();
        string GetMyEmail();
        Task<User> GetUserById(Guid id);
        Task<User> GetUserByEmail(string email);
        Task CreateUser(User user);
        //Get all users
        Task<IEnumerable<User>> GetAllUsers();
        
        Task<User> UpdateUser(User user);
    }
}

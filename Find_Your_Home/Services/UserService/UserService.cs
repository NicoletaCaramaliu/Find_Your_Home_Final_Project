using Find_Your_Home.Services.UserService;
using System.Security.Claims;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Repositories.UserRepository;

namespace Find_Your_Home.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserRepository _userRepository;

        public UserService(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _userRepository = userRepository;
        }
        public string GetMyName()
        {
            var result = string.Empty;
            if (_httpContextAccessor.HttpContext is not null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
            }
            return result;
        }
        
        public string GetMyEmail()
        {
            var result = string.Empty;
            if (_httpContextAccessor.HttpContext is not null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            }
            else 
                throw new Exception("HttpContext is null in Logout.");
            return result;
        }

        
        public async Task<User> GetUserByEmail(string email)
        {
            return await _userRepository.GetByEmail(email);
        }
        
        public async Task CreateUser(User user)
        {
            await _userRepository.CreateAsync(user);
            await _userRepository.SaveAsync();
        }
        
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _userRepository.GetAllAsync();
        }
        
        public async Task<User> UpdateUser(User user)
        {
            _userRepository.Update(user);
            await _userRepository.SaveAsync();
            return user;
        }
        
    }
}

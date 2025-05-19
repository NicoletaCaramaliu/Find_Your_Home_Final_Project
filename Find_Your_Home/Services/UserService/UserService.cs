using Find_Your_Home.Services.UserService;
using System.Security.Claims;
using Find_Your_Home.Data;
using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Repositories.UserRepository;

namespace Find_Your_Home.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDbContext _context;

        public UserService(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository, ApplicationDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _userRepository = userRepository;
            _context = context;
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

        public Guid GetMyId()
        {
            var result = Guid.Empty;
            if (_httpContextAccessor.HttpContext is not null)
            {
                var idString = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (idString != null)
                {
                    result = Guid.Parse(idString);
                }
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
        
        
        public async Task<User> GetUserById(Guid id)
        {
            return await _userRepository.FindByIdAsync(id);
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
        
        public async Task<User?> GetUserByRefreshToken(string refreshToken)
        {
            return await _userRepository.GetByRefreshToken(refreshToken);
        }

        public async Task<User?> GetUserByResetToken(string token)
        {
            return await _userRepository.GetUserByResetTokenAsync(token);
        }
        
        public async Task<bool> DeleteUserAndDependencies(Guid userId)
        {
            var user = await _userRepository.GetUserWithDependencies(userId);
            if (user == null)
                return false;

            var allImages = user.Properties
                .SelectMany(p => p.Images)
                .ToList();

            _context.PropertyImages.RemoveRange(allImages);

            _context.Properties.RemoveRange(user.Properties);

            _context.Favorites.RemoveRange(user.Favorites);

            _userRepository.Delete(user);

            await _context.SaveChangesAsync();

            return true;
        }
        

        
    }
}
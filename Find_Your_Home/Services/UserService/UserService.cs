using Find_Your_Home.Services.UserService;
using System.Security.Claims;
using Find_Your_Home.Data;
using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Repositories.UserRepository;
using Microsoft.EntityFrameworkCore;

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

            // rentals
            var rentals = await _context.Rentals
                .Where(r => r.OwnerId == userId || r.RenterId == userId)
                .ToListAsync();
            rentals.ForEach(r =>
            {
                r.Property.IsRented = false;
                _context.Properties.Update(r.Property);
            });
            _context.Rentals.RemoveRange(rentals);

            // bookings
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .ToListAsync();
            _context.Bookings.RemoveRange(bookings);

            // availability slots
            var slots = await _context.AvailabilitySlots
                .Where(s => user.Properties.Select(p => p.Id).Contains(s.PropertyId))
                .ToListAsync();
            _context.AvailabilitySlots.RemoveRange(slots);

            // reviews
            var reviewsGiven = await _context.Reviews.Where(r => r.ReviewerId == userId).ToListAsync();
            var reviewsReceived = await _context.Reviews.Where(r => r.TargetUserId == userId).ToListAsync();
            _context.Reviews.RemoveRange(reviewsGiven);
            _context.Reviews.RemoveRange(reviewsReceived);

            // conversations
            var conversations = await _context.Conversations
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .ToListAsync();
            var conversationIds = conversations.Select(c => c.Id).ToList();

            var messages = await _context.ChatMessages
                .Where(m => conversationIds.Contains(m.ConversationId))
                .ToListAsync();
            _context.ChatMessages.RemoveRange(messages);
            _context.Conversations.RemoveRange(conversations);

            // notifications
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId || n.SenderId == userId)
                .ToListAsync();
            _context.Notifications.RemoveRange(notifications);

            // favorites
            _context.Favorites.RemoveRange(user.Favorites);

            // properties
            var allImages = user.Properties.SelectMany(p => p.Images).ToList();
            _context.PropertyImages.RemoveRange(allImages);
            _context.Properties.RemoveRange(user.Properties);

            //user
            _userRepository.Delete(user);

            await _context.SaveChangesAsync();
            return true;
        }
        

        
    }
}
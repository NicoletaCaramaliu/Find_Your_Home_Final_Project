using Find_Your_Home.Data;
using Find_Your_Home.Models.Chat;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.ConversationRepository
{
    public class ConversationRepository : GenericRepository<Conversation>, IConversationRepository
    {
        private readonly ApplicationDbContext _context;

        public ConversationRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Conversation> GetConversationBetweenUsersAsync(Guid senderId, Guid receiverId)
        {
            return await _context.Conversations
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => 
                    (c.User1Id == senderId && c.User2Id == receiverId) || 
                    (c.User1Id == receiverId && c.User2Id == senderId));
        }
        
        public async Task<IEnumerable<Conversation>> GetConversationsByUserIdAsync(Guid userId)
        {
            return await _context.Conversations
                .Include(c => c.Messages)
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .ToListAsync();
        }
    }

}
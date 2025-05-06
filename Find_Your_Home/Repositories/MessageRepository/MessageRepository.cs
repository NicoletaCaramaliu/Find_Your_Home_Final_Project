using Find_Your_Home.Data;
using Find_Your_Home.Models.Chat;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.MessageRepository
{
    public class MessageRepository : GenericRepository<ChatMessage>, IMessageRepository
    {
        private readonly ApplicationDbContext _context;
        
        public MessageRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
        
        public async Task<List<ChatMessage>> GetMessagesByConversationIdAsync(Guid conversationId)
        {
            return await _context.ChatMessages
                .Where(m => m.ConversationId == conversationId)
                .ToListAsync();
        }
    }
}
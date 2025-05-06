using Find_Your_Home.Models.Chat;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.MessageRepository
{
    public interface IMessageRepository : IGenericRepository<ChatMessage>
    {
        Task<List<ChatMessage>> GetMessagesByConversationIdAsync(Guid conversationId);
    }
}
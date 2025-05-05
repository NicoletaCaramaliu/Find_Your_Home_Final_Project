using Find_Your_Home.Models.Chat;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.ConversationRepository
{
    public interface IConversationRepository : IGenericRepository<Conversation>
    {
        Task<Conversation> GetConversationBetweenUsersAsync(Guid senderId, Guid receiverId);
        Task<IEnumerable<Conversation>> GetConversationsByUserIdAsync(Guid userId);
    }
}
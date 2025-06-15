using Find_Your_Home.Models.Chat;
using Find_Your_Home.Models.Chat.DTO;

namespace Find_Your_Home.Services.ConversationService
{
    public interface IConversationService
    {
        Task<Guid> StartOrGetConversation(Guid currentUserId, Guid otherUserId);
        Task<List<ConversationPreviewDto>> GetMyConversationsAsync(Guid currentUserId);
    }
}
using Find_Your_Home.Models.Chat;
using Find_Your_Home.Models.Chat.DTO;

namespace Find_Your_Home.Services.MessageService
{
    public interface IMessageService
    {
        Task SendMessageAsync(Guid senderId, SendMessageRequest request);
        Task<List<ChatMessage>> GetMessagesByConversationIdAsync(Guid conversationId);
    }
}
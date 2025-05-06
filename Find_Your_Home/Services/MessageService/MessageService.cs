using Find_Your_Home.Hubs;
using Find_Your_Home.Models.Chat;
using Find_Your_Home.Models.Chat.DTO;
using Find_Your_Home.Repositories.MessageRepository;
using Microsoft.AspNetCore.SignalR;

namespace Find_Your_Home.Services.MessageService
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IHubContext<ChatHub> _hubContext;
        
        public MessageService(IMessageRepository messageRepository, IHubContext<ChatHub> hubContext)
        {
            _messageRepository = messageRepository;
            _hubContext = hubContext;
        }
        
        public async Task SendMessageAsync(Guid senderId, SendMessageRequest request)
        {
            var message = new ChatMessage
            {
                ConversationId = request.ConversationId,
                SenderId = senderId,
                Message = request.Message
            };

            await _messageRepository.CreateAsync(message);
            await _messageRepository.SaveAsync();

            await _hubContext.Clients.Group(request.ConversationId.ToString())
                .SendAsync("ReceiveMessage", new
                {
                    SenderId = senderId,
                    Message = request.Message,
                    Timestamp = message.CreatedAt
                });
        }
        
        public async Task<List<ChatMessage>> GetMessagesByConversationIdAsync(Guid conversationId)
        {
            return await _messageRepository.GetMessagesByConversationIdAsync(conversationId);
        }

    }
}
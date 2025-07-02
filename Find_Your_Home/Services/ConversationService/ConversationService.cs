using Find_Your_Home.Models.Chat;
using Find_Your_Home.Models.Chat.DTO;
using Find_Your_Home.Repositories.ConversationRepository;
using Find_Your_Home.Services.UserService;

namespace Find_Your_Home.Services.ConversationService
{
    public class ConversationService : IConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserService _userService;
        
        public ConversationService(IConversationRepository conversationRepository, IUserService userService)
        {
            _userService = userService;
            _conversationRepository = conversationRepository;
        }
        
        public async Task<Guid> StartOrGetConversation(Guid currentUserId, Guid otherUserId)
        {
            var existing = await _conversationRepository.GetConversationBetweenUsersAsync(currentUserId, otherUserId);
            if (existing != null) return existing.Id;
            
            var newConv = new Conversation
            {
                User1Id = currentUserId,
                User2Id = otherUserId
            };

            await _conversationRepository.CreateAsync(newConv);
            await _conversationRepository.SaveAsync(); 
            return newConv.Id;

        }

        public async Task<List<ConversationPreviewDto>> GetMyConversationsAsync(Guid currentUserId)
        {
            var conversations = await _conversationRepository.GetConversationsByUserIdAsync(currentUserId);
            var conversationPreviews = new List<ConversationPreviewDto>();

            foreach (var conversation in conversations)
            {
                var lastMessage = conversation.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
                var otherUserId = conversation.User1Id == currentUserId ? conversation.User2Id : conversation.User1Id;

                var otherUser = await _userService.GetUserById(otherUserId);
                if (otherUser == null) continue;

                conversationPreviews.Add(new ConversationPreviewDto
                {
                    ConversationId = conversation.Id,
                    OtherUserId = otherUserId,
                    OtherUserName = otherUser.Username, 
                    OtherUserProfilePictureUrl = otherUser.ProfilePicture,
                    LastMessage = lastMessage?.Message,
                    LastMessageDate = lastMessage?.CreatedAt ?? DateTime.UtcNow
                });
            }

            return conversationPreviews;
        }

    }
}
using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Chat
{
    public class ChatMessage : BaseEntity
    {
        public Guid ConversationId { get; set; }
        public Conversation? Conversation { get; set; }

        public Guid SenderId { get; set; }
        public string? Message { get; set; }
    }
}
using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Chat
{
    public class Conversation : BaseEntity
    {
        public Guid User1Id { get; set; }
        public Guid User2Id { get; set; }

        public ICollection<ChatMessage> Messages { get; set; }
    }
}
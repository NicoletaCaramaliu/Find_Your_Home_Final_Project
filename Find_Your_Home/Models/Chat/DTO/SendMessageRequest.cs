namespace Find_Your_Home.Models.Chat.DTO
{
    public class SendMessageRequest
    {
        public Guid ConversationId { get; set; }
        public string Message { get; set; }
    }
}
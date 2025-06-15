namespace Find_Your_Home.Models.Chat.DTO
{
    public class ConversationPreviewDto
    {
        public Guid ConversationId { get; set; }
        public Guid OtherUserId { get; set; }
        public string OtherUserName { get; set; }
        public string OtherUserProfilePictureUrl { get; set; }
        
        public string LastMessage { get; set; }
        public DateTime LastMessageDate { get; set; }
    }
}
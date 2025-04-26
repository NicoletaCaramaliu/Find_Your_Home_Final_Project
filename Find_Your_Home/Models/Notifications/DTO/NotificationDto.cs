namespace Find_Your_Home.Models.Notifications.DTO
{
    public class NotificationDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }

        public string SenderName { get; set; }
        public string SenderProfilePictureUrl { get; set; } 
    }
}
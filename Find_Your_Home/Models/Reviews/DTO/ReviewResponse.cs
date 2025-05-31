namespace Find_Your_Home.Models.Reviews.DTO
{
    public class ReviewResponse
    {
        public Guid Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string ReviewerUsername { get; set; } = string.Empty;
        public string ReviewerProfilePicture { get; set; } = string.Empty;
        public Guid ReviewerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
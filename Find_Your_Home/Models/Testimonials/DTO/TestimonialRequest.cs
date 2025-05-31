namespace Find_Your_Home.Models.Testimonials.DTO
{
    public class TestimonialRequest
    {
        public Guid UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        
    }
}
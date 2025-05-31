using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Models.Testimonials
{
    public class Testimonial : BaseEntity
    {
        public string Content { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public bool Posted { get; set; } = false;
    }
}
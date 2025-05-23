using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Models.Reviews
{
    public class Review : BaseEntity
    {
        public Guid ReviewerId { get; set; }
        public User Reviewer { get; set; } = null!;

        public Guid TargetUserId { get; set; }
        public User TargetUser { get; set; } = null!;

        public int Rating { get; set; } 
        public string Comment { get; set; } = string.Empty;

    }
}
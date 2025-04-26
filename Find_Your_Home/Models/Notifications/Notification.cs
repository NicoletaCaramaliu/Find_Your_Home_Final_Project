using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Models.Notifications
{
    public class Notification : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }  

        public Guid? SenderId { get; set; }

        [Required]
        public string Type { get; set; }  

        [Required]
        public string Title { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;

        [ForeignKey("UserId")]
        public virtual User User { get; set; }  

        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; } 
    }
}
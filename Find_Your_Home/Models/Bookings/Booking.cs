using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Models;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Models.Bookings
{
    public class Booking : BaseEntity
    {
        [Required]
        public Guid PropertyId { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        public Guid AvailabilitySlotId { get; set; }

        [ForeignKey("AvailabilitySlotId")]
        public AvailabilitySlot AvailabilitySlot { get; set; }

        [Required]
        public DateTime SlotDate { get; set; } 

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
    }
}
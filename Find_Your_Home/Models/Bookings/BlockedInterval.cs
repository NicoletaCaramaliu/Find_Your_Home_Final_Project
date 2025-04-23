using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Bookings
{
    public class BlockedInterval : BaseEntity
    {
        [Required]
        public Guid AvailabilitySlotId { get; set; }

        [ForeignKey("AvailabilitySlotId")]
        public AvailabilitySlot AvailabilitySlot { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        public string Reason { get; set; }
        
    }
}
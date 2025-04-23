using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Properties;

namespace Find_Your_Home.Models.Bookings
{
    public class AvailabilitySlot : BaseEntity
    {
        [Required]
        public Guid PropertyId { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public int VisitDurationInMinutes { get; set; }

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<BlockedInterval> BlockedIntervals { get; set; } = new List<BlockedInterval>();

    }
}
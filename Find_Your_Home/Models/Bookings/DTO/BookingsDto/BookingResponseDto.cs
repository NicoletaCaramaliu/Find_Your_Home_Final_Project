using Find_Your_Home.Models.Models;

namespace Find_Your_Home.Models.Bookings.DTO
{
    public class BookingResponseDto
    {
        public Guid Id { get; set; }

        public Guid PropertyId { get; set; }

        public string PropertyName { get; set; }
        public bool isRented { get; set; }
        public bool isSold { get; set; }
        public bool isForRent { get; set; }

        public Guid UserId { get; set; }

        public string UserName { get; set; }

        public DateTime SlotDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public BookingStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        
        //public AvailabilitySlotResponseDto? AvailabilitySlot { get; set; }
    }
}
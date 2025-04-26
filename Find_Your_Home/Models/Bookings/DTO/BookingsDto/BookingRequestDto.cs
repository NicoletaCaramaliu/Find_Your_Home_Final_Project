namespace Find_Your_Home.Models.Bookings.DTO
{
    public class BookingRequestDto
    {
        public Guid PropertyId { get; set; }
        public Guid AvailabilitySlotId { get; set; } 

        public DateTime SlotDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }
    }
}
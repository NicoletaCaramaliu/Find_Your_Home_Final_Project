namespace Find_Your_Home.Models.Bookings.DTO
{
    public class AvailabilitySlotResponseDto
    {
        public Guid Id { get; set; }

        public Guid PropertyId { get; set; }

        public DateTime Date { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int VisitDurationInMinutes { get; set; }

        public DateTime CreatedAt { get; set; }
        
        public List<BookingResponseDto>? Bookings { get; set; }
    }
}
namespace Find_Your_Home.Models.Bookings.DTO
{
    public class AvailabilitySlotDto
    {
        public Guid PropertyId { get; set; }

        public DateTime Date { get; set; } 

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int VisitDurationInMinutes { get; set; }
    }
}
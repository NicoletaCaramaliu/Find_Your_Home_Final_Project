namespace Find_Your_Home.Models.Bookings.DTO
{
    public class BlockedIntervalResponse
    {
        public Guid AvailabilitySlotId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Reason { get; set; }

    }
}
namespace Find_Your_Home.Models.Bookings.DTO
{   
    public class BlockedIntervalRequest
    {   
        public Guid AvailabilitySlotId { get; set; }
        public TimeSpan StartDate { get; set; }
        public TimeSpan EndDate { get; set; }
        public string Reason { get; set; }
    }
}
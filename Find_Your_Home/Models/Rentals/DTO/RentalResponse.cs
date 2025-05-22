namespace Find_Your_Home.Models.Rentals.DTO
{
    public class RentalResponse
    {
        public Guid Id { get; set; }
        public Guid PropertyId { get; set; }
        public Guid OwnerId { get; set; }
        public Guid RenterId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public string PropertyName { get; set; }
        public string OwnerName { get; set; }
        public string RenterName { get; set; }
        public Guid? ConversationId { get; set; }
    }
}
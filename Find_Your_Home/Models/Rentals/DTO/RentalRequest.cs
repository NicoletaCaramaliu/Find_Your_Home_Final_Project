namespace Find_Your_Home.Models.Rentals.DTO
{
    public class RentalRequest
    {
        public Guid PropertyId { get; set; }
        public DateTime StartDate { get; set; }
    }
}
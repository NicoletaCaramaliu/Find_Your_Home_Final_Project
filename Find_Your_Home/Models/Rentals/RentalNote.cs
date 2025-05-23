using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Rentals
{
    public class RentalNote : BaseEntity
    {
        public Guid RentalId { get; set; }
        public string Content { get; set; }

        public Rental Rental { get; set; }
    }
}
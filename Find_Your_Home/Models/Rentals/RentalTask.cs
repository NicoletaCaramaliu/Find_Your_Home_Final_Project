using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Rentals
{
    public class RentalTask : BaseEntity
    {
            public Guid RentalId { get; set; }
            public string Title { get; set; }
            public bool Completed { get; set; }

            public Rental Rental { get; set; }

    }
}
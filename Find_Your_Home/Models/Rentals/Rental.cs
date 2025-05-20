using System.ComponentModel.DataAnnotations;
using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Models.Rentals
{
    public class Rental : BaseEntity
    {
        public Guid PropertyId { get; set; }
        public Property Property { get; set; }

        public Guid OwnerId { get; set; }
        public User Owner { get; set; }

        public Guid RenterId { get; set; }
        public User Renter { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
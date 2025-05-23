using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Models.Properties
{
    public class Property : BaseEntity
    {
        public string Category { get; set; } //ap/casa/garsoniera
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public decimal Price { get; set; }
        
        public int Rooms { get; set; }
        public int Bathrooms { get; set; }
        public bool Garage { get; set; }
        public int Level { get; set; }
        public int SquareFeet { get; set; }
        public bool IsAvailable { get; set; }
        
        public int NumberOfKitchen { get; set; }
        public int NumberOfBalconies { get; set; }
        public bool HasGarden { get; set; }
        public bool ForRent { get; set; }
        public int Views { get; set; } = 0;
        public int YearOfConstruction { get; set; }
        public bool Furnished { get; set; }
        public bool PetFriendly { get; set; }

        public Guid OwnerId { get; set;  }
        public User Owner { get; set; }
        public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
        public ICollection<Favorite> FavoritedBy { get; set; } = new List<Favorite>();

        //for bookings
        public ICollection<AvailabilitySlot> AvailabilitySlots { get; set; } = new List<AvailabilitySlot>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        
        //for rental
        public bool IsRented { get; set; } = false;
        public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    }
}
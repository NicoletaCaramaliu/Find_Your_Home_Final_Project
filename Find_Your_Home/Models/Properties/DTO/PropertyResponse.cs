namespace Find_Your_Home.Models.Properties.DTO
{
    public class PropertyResponse
    {
        public Guid Id { get; set; }
        public string Category { get; set; }
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
        public int SquareFeet { get; set; }
        public int Level { get; set; }
        
        public int numberOfKitchen { get; set; }
        public int numberOfBalconies { get; set; }
        public bool hasGarden { get; set; }
        public bool forRent { get; set; }
        public int views { get; set; }
        public int yearOfConstruction { get; set; }
        public bool furnished { get; set; }
        public bool petFriendly { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        
        public string FirstImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsAvailable { get; set; } = true;
        public Guid OwnerId { get; set; }
        public string OwnerName { get; set; }
    }
}
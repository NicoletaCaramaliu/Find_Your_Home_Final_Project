namespace Find_Your_Home.Models.Properties.DTO
{
    public class PropertyResponse
    {
        public Guid Id { get; set; }
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
        public bool IsAvailable { get; set; } = true;
        public Guid OwnerId { get; set; }
    }
}
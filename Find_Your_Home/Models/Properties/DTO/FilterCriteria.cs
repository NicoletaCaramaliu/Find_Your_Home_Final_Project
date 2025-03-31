namespace Find_Your_Home.Models.Properties.DTO
{
    public class FilterCriteria
    {
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Rooms { get; set; }
        public int? Bathrooms { get; set; }
        public bool? Garage { get; set; }
        public int? SquareFeet { get; set; }
        
        public int? NumberOfKitchen { get; set; }
        public int? NumberOfBalconies { get; set; }
        public bool? HasGarden { get; set; }
        public bool? ForRent { get; set; }
        public int? Views { get; set; }
        public int? YearOfConstruction { get; set; }
        public bool? Furnished { get; set; }
    }
}
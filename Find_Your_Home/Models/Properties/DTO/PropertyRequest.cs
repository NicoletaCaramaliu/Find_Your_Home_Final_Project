using System.ComponentModel.DataAnnotations;

namespace Find_Your_Home.Models.Properties.DTO
{
    public class PropertyRequest
    {
        public Guid Id { get; set; } 
        
        [Required]
        public string Category { get; set; }
        
        [Required]
        public string Name { get; set; }

        [Required]
        [MaxLength(5000)]
        public string Description { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Invalid ZIP Code")]
        public string Zip { get; set; }

        [Required]
        [Range(100, 10000000, ErrorMessage = "Price must be realistic")]
        public decimal Price { get; set; }

        [Required]
        [Range(1, 20)]
        public int Rooms { get; set; }

        [Required]
        [Range(1, 10)]
        public int Bathrooms { get; set; }

        public bool Garage { get; set; }

        [Required]
        [Range(1, 100)]
        public int Level { get; set; }

        [Required]
        [Range(10, 10000)]
        public int SquareFeet { get; set; }
        
        [Required]
        public bool IsAvailable { get; set; } = true;
        
        [Required]
        public int numberOfKitchen { get; set; }
        [Required]
        public int numberOfBalconies { get; set; }
        [Required]
        public bool hasGarden { get; set; }
        [Required]
        public bool forRent { get; set; }
        [Required]
        public int yearOfConstruction { get; set; }
        [Required]
        public bool furnished { get; set; }
        [Required]
        public bool petFriendly { get; set; }
        [Required]
        public double Latitude { get; set; }
        [Required]
        public double Longitude { get; set; }
        
        // ????? eliminat
        public List<string> ImageUrls { get; set; } = new List<string>();
    }
}
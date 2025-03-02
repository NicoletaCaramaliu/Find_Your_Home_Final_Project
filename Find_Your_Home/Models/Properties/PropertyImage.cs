using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Properties
{
    public class PropertyImage : BaseEntity
    {
        public string ImageUrl { get; set; }
        
        public Guid PropertyId { get; set; }
        public int Order { get; set; } //ordinea imaginii in sortare
        public Property Property { get; set; }
    }
}
using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Rentals
{
    public class RentalDocument : BaseEntity
    {
        public Guid RentalId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public Guid UploadedByUserId { get; set; }

        public Rental Rental { get; set; }
    }
}
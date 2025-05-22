using Find_Your_Home.Models.Rentals;

namespace Find_Your_Home.Services.RentalService
{
    public interface IRentalService
    {
        Task<Rental> CreateRental(Rental rental);
        Task<List<Rental>> GetRentalsByUserId(Guid userId);
        Task EndRental(Guid rentalId, Guid userId);
        Task<Rental> GetActiveRentalByRenterId(Guid renterId);
        Task<List<Rental>> GetActiveRentalsByOwnerId(Guid ownerId);
        Task<Rental> GetRentalById(Guid rentalId);
    }
}
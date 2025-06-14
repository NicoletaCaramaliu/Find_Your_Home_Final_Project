using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.RentalRepository
{
    public interface IRentalRepository : IGenericRepository<Rental>
    {
        Task<Rental> CreateRentalAsync(Rental rental);
        Task<List<Rental>> GetRentalsByUserIdAsync(Guid userId);
        Task<Rental?> GetActiveRentalByUserId(Guid userId);
        Task<Rental?> GetRentalByIdAsync(Guid rentalId);
        Task UpdateRentalAsync(Rental rental);
        Task<List<Rental>> GetActiveRentalsByOwnerIdAsync(Guid ownerId);
        
    }
}
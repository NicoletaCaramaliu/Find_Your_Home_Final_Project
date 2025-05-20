using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.RentalRepository
{
    public interface IRentalRepository : IGenericRepository<Rental>
    {
        Task<Rental> CreateRentalAsync(Rental rental);
    }
}
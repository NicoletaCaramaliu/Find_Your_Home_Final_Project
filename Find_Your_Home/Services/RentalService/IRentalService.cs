using Find_Your_Home.Models.Rentals;

namespace Find_Your_Home.Services.RentalService
{
    public interface IRentalService
    {
        Task<Rental> CreateRental(Rental rental);
    }
}
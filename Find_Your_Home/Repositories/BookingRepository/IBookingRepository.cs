using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.BookingRepository
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<Booking> CreateBookingAsync(Booking booking, Guid userId);
        Task<bool> IsSlotAlreadyBooked(Guid propertyId, DateTime date, TimeSpan start, TimeSpan end);
        Task<List<Booking>> GetBookingsForSlot(Guid propertyId, DateTime date, TimeSpan start, TimeSpan end);
    }
}
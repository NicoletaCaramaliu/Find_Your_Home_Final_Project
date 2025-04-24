using Find_Your_Home.Models.Bookings;

namespace Find_Your_Home.Services.BookingService
{
    public interface IBookingService
    {
        Task<Booking> CreateBooking(Booking booking, Guid userId);
    }
}
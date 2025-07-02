using Find_Your_Home.Models.Bookings;

namespace Find_Your_Home.Services.BookingService
{
    public interface IBookingService
    {
        Task<Booking> CreateBooking(Booking booking, Guid userId);
        Task ConfirmBooking(Guid bookingId, Guid userId);
        Task<IEnumerable<Booking>> GetBookingsByPropertyId(Guid propertyId);
        Task<IEnumerable<Booking>> GetBookingsByOwnerId(Guid ownerId);
        Task RejectBooking(Guid bookingId, Guid userId);
        Task<IEnumerable<Booking>> GetBookingsByUserId(Guid userId);
        Task CancelBooking(Guid bookingId, Guid userId);
        Task<bool> HasBooking(Guid reviewerId, Guid targetUserId);
        Task<Booking> GetBookingByPropertyAndUserId(Guid PropertyId, Guid userId);
    }
}
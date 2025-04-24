using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Models;
using Find_Your_Home.Repositories.AvailabilitySlotRepository;
using Find_Your_Home.Repositories.BookingRepository;

namespace Find_Your_Home.Services.BookingService
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IAvailabilitySlotRepository _availabilitySlotRepository;
        public BookingService(IBookingRepository bookingRepository, IAvailabilitySlotRepository availabilitySlotRepository)
        {
            _availabilitySlotRepository = availabilitySlotRepository;
            _bookingRepository = bookingRepository;
        }
        public async Task<Booking> CreateBooking(Booking booking, Guid userId)
        {
            var overlap = await _bookingRepository.IsSlotAlreadyBooked(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);

            if (overlap)
                throw new AppException("Intervalul selectat este deja rezervat.");
            
            var isSlotAvailable = await _availabilitySlotRepository.slotExits(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);
            
            if (!isSlotAvailable)
                throw new AppException("Intervalul selectat nu este disponibil.");

            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;
            booking.CreatedAt = DateTime.UtcNow;

            await _bookingRepository.CreateAsync(booking);
            await _bookingRepository.SaveAsync();

            return booking;
        }

    }
}
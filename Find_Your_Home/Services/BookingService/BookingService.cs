using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Models;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Repositories.AvailabilitySlotRepository;
using Find_Your_Home.Repositories.BookingRepository;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.PropertyService;

namespace Find_Your_Home.Services.BookingService
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IAvailabilitySlotRepository _availabilitySlotRepository;
        private readonly IPropertyService _propertyService;
        private readonly INotificationService _notificationService;

        public BookingService(
            IBookingRepository bookingRepository,
            IAvailabilitySlotRepository availabilitySlotRepository,
            IPropertyService propertyService,
            INotificationService notificationService)
        {
            _bookingRepository = bookingRepository;
            _availabilitySlotRepository = availabilitySlotRepository;
            _propertyService = propertyService;
            _notificationService = notificationService;
        }

        public async Task<Booking> CreateBooking(Booking booking, Guid userId)
        {
            var existingBookings = await _bookingRepository.GetBookingsForSlot(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);

            if (existingBookings.Any(b => b.Status == BookingStatus.Confirmed))
                throw new AppException("TIME_SLOT_ALREADY_BOOKED");

            var isSlotAvailable = await _availabilitySlotRepository.slotExits(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);

            if (!isSlotAvailable)
                throw new AppException("TIME_SLOT_NOT_AVAILABLE");

            var property = await _propertyService.GetPropertyByID(booking.PropertyId);
            if (property == null)
                throw new AppException("PROPERTY_NOT_FOUND");

            if (property.OwnerId == userId)
                throw new AppException("CANNOT_BOOK_OWN_PROPERTY");

            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;
            booking.CreatedAt = DateTime.UtcNow;

            await _bookingRepository.CreateAsync(booking);
            await _bookingRepository.SaveAsync();

            await _notificationService.SendNotificationAsync(
                property.OwnerId.ToString(),
                NotificationMessage.CreateBookingRequest(booking, userId)
            );

            return booking;
        }
        
        public async Task<IEnumerable<Booking>> GetBookingsByPropertyId(Guid propertyId)
        {
            var bookings = await _bookingRepository.GetBookingsByPropertyIdAsync(propertyId);
            return bookings;
        }
        
        public async Task ConfirmBooking(Guid bookingId, Guid userId)
        {
            var booking = await _bookingRepository.GetBookingByIdAsync(bookingId);
            if (booking == null)
                throw new AppException("BOOKING_NOT_FOUND");

            if (booking.Property.OwnerId != userId)
                throw new AppException("NOT_OWNER_OF_PROPERTY");

            booking.Status = BookingStatus.Confirmed;
            
            var pendingBookings = await _bookingRepository.GetBookingsForSlot(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);

            foreach (var pending in pendingBookings.Where(b => b.Status == BookingStatus.Pending && b.Id != booking.Id))
            {
                pending.Status = BookingStatus.Cancelled;
            }
            
            _bookingRepository.Update(booking);
            await _bookingRepository.SaveAsync();

            await _notificationService.SendNotificationAsync(
                booking.UserId.ToString(),
                NotificationMessage.CreateBookingAccepted(booking, userId)
            );
        }
        
        
    }
}

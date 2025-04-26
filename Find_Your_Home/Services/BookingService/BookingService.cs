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
            var overlap = await _bookingRepository.IsSlotAlreadyBooked(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);

            if (overlap)
                throw new AppException("The selected time interval is already booked.");

            var isSlotAvailable = await _availabilitySlotRepository.slotExits(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);

            if (!isSlotAvailable)
                throw new AppException("The selected time interval is not available.");

            var property = await _propertyService.GetPropertyByID(booking.PropertyId);
            if (property == null)
                throw new AppException("The property does not exist.");

            if (property.OwnerId == userId)
                throw new AppException("You cannot book your own property.");

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
    }
}

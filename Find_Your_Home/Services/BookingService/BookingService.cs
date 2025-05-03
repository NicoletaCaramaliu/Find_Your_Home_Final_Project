using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Models;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Repositories.AvailabilitySlotRepository;
using Find_Your_Home.Repositories.BookingRepository;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;

namespace Find_Your_Home.Services.BookingService
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IAvailabilitySlotRepository _availabilitySlotRepository;
        private readonly IPropertyService _propertyService;
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;

        public BookingService(
            IBookingRepository bookingRepository,
            IAvailabilitySlotRepository availabilitySlotRepository,
            IPropertyService propertyService,
            INotificationService notificationService,
            IUserService userService)
        {
            _bookingRepository = bookingRepository;
            _availabilitySlotRepository = availabilitySlotRepository;
            _propertyService = propertyService;
            _notificationService = notificationService;
            _userService = userService;
        }

        public async Task<Booking> CreateBooking(Booking booking, Guid userId)
        {
            var existingBookings = await _bookingRepository.GetBookingsForSlot(
                booking.PropertyId, booking.SlotDate, booking.StartTime, booking.EndTime);

            if (existingBookings.Any(b => b.Status == BookingStatus.Confirmed))
                throw new AppException("TIME_SLOT_ALREADY_BOOKED");

            var slot = await _availabilitySlotRepository.GetAvailabilitySlotByIdAsync(booking.AvailabilitySlotId);

            if (slot == null || slot.PropertyId != booking.PropertyId)
                throw new AppException("INVALID_AVAILABILITY_SLOT");

            
            /*if (slot.Date.Date != booking.SlotDate.Date ||
                booking.StartTime < slot.StartTime ||
                booking.EndTime > slot.EndTime)
            {
                throw new AppException("BOOKING_OUTSIDE_SLOT_RANGE");
            }
            */


            var property = await _propertyService.GetPropertyByID(booking.PropertyId);
            if (property == null)
                throw new AppException("PROPERTY_NOT_FOUND");

            if (property.OwnerId == userId)
                throw new AppException("CANNOT_BOOK_OWN_PROPERTY");

            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;
            booking.CreatedAt = DateTime.UtcNow;
            booking.AvailabilitySlotId = slot.Id;

            await _bookingRepository.CreateAsync(booking);
            await _bookingRepository.SaveAsync();
            
            var user = await _userService.GetUserById(userId);

            await _notificationService.SendNotificationAsync(
                property.OwnerId.ToString(),
                NotificationMessage.CreateBookingRequest(booking, userId, user.Username)
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
            
            var owner = await _userService.GetUserById(userId);


            await _notificationService.SendNotificationAsync(
                booking.UserId.ToString(),
                NotificationMessage.CreateBookingAccepted(booking, userId, owner.Username)
            );
        }
        
        public async Task<IEnumerable<Booking>> GetBookingsByOwnerId(Guid ownerId)
        {
            var bookings = await _bookingRepository.GetBookingsByOwnerIdAsync(ownerId);
            return bookings;
        }
        
        public async Task RejectBooking(Guid bookingId, Guid userId)
        {
            var booking = await _bookingRepository.GetBookingByIdAsync(bookingId);
            if (booking == null)
                throw new AppException("BOOKING_NOT_FOUND");

            if (booking.Property.OwnerId != userId)
                throw new AppException("NOT_OWNER_OF_PROPERTY");

            booking.Status = BookingStatus.Cancelled;
            
            _bookingRepository.Update(booking);
            await _bookingRepository.SaveAsync();
            
            var owner = await _userService.GetUserById(userId);

            await _notificationService.SendNotificationAsync(
                booking.UserId.ToString(),
                NotificationMessage.CreateBookingRejected(booking, userId, owner.Username)
            );
        }
        
    }
}

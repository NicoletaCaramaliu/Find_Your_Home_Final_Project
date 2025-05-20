using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Repositories.BookingRepository;
using Find_Your_Home.Repositories.RentalRepository;
using Find_Your_Home.Services.BookingService;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.PropertyService;

namespace Find_Your_Home.Services.RentalService
{
    public class RentalService : IRentalService
    {
        private readonly IRentalRepository _rentalRepository;
        private readonly INotificationService _notificationService;
        private readonly IBookingService _bookingService;
        private readonly IPropertyService _propertyService;
        
        public RentalService(IRentalRepository rentalRepository, INotificationService notificationService, IBookingService bookingService, IPropertyService propertyService)
        {
            _propertyService = propertyService;
            _rentalRepository = rentalRepository;
            _notificationService = notificationService;
            _bookingService = bookingService;
        }

        public async Task<Rental> CreateRental(Rental rental)
        {
            //verify if the rental already exists
            //var existingRental = await _rentalRepository.GetRentalByIdAsync(rental.Id);
            //if (existingRental != null)
            //{
            //    throw new Exception("Rental already exists");
            //}
            
            //verify if there is an booking completed for this rental
            var existingBooking = await _bookingService.GetBookingByPropertyAndUserId(rental.PropertyId, rental.RenterId);

            if (existingBooking == null)
            {
                throw new AppException("NO_COMPLETED_BOOKING_FOUND_FOR_RENT");
            }
            
            var createdRental = await _rentalRepository.CreateRentalAsync(rental);
            var property = await _propertyService.GetPropertyByID(rental.PropertyId);
            property.IsRented = true;
            await _propertyService.UpdateProperty(property);
            //no notif yet
            return createdRental;
        }
        
    }
}
using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Repositories.BookingRepository;
using Find_Your_Home.Repositories.RentalRepository;
using Find_Your_Home.Services.AuthService;
using Find_Your_Home.Services.BookingService;
using Find_Your_Home.Services.ConversationService;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;

namespace Find_Your_Home.Services.RentalService
{
    public class RentalService : IRentalService
    {
        private readonly IRentalRepository _rentalRepository;
        private readonly INotificationService _notificationService;
        private readonly IBookingService _bookingService;
        private readonly IPropertyService _propertyService;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IConversationService _conversationService;
        
        public RentalService(IRentalRepository rentalRepository, INotificationService notificationService, IBookingService bookingService, 
            IPropertyService propertyService, IUserService userService, IEmailService emailService, IConversationService conversationService)
        {
            _rentalRepository = rentalRepository;
            _notificationService = notificationService;
            _bookingService = bookingService;
            _propertyService = propertyService;
            _userService = userService;
            _emailService = emailService;
            _conversationService = conversationService;
        }
        public async Task<Rental> CreateRental(Rental rental)
        {
            //verify if there is an booking completed for this rental
            var existingBooking = await _bookingService.GetBookingByPropertyAndUserId(rental.PropertyId, rental.RenterId);

            if (existingBooking == null)
            {
                throw new AppException("NO_COMPLETED_BOOKING_FOUND_FOR_RENT");
            }
            
            //verify if the property is already rented
            var existingProperty = await _propertyService.GetPropertyByID(rental.PropertyId);
            if (existingProperty == null)
            {
                throw new AppException("PROPERTY_NOT_FOUND");
            }
            if (existingProperty.IsRented)
            {
                throw new AppException("PROPERTY_ALREADY_RENTED");
            }
            
            //verify if the user has already rented any property
            var activeRental = await _rentalRepository.GetActiveRentalByUserId(rental.RenterId);
            if (activeRental != null)
            {
                throw new AppException("USER_ALREADY_HAS_ACTIVE_RENTAL");
            }
            var property = await _propertyService.GetPropertyByID(rental.PropertyId);
            property.IsRented = true;
            
            rental.OwnerId = property.OwnerId;
            
            var conversationId = await _conversationService.StartOrGetConversation(rental.OwnerId, rental.RenterId);
            rental.ConversationId = conversationId;
            
            var createdRental = await _rentalRepository.CreateRentalAsync(rental);
            
            await _propertyService.UpdateProperty(property);
            
            var renter = await _userService.GetUserById(rental.RenterId);
            
            await _notificationService.SendNotificationAsync(
                existingProperty.OwnerId.ToString(),
                NotificationMessage.CreateRentalInfo(createdRental.Id, renter.Username)
            );
            
            await _emailService.SendRentalConfirmationEmailAsync(
                property.Owner.Email,
                property.Owner.Username,
                property.Name,
                rental.Renter.Username,
                rental.StartDate
            );

            
            return createdRental;
        }

        public async Task<List<Rental>> GetRentalsByUserId(Guid userId)
        {
            var rentals = await _rentalRepository.GetRentalsByUserIdAsync(userId);
            if (rentals == null)
            {
                throw new AppException("NO_RENTAL_FOUND_FOR_USER");
            }

            return rentals;
        }

        public async Task EndRental(Guid rentalId, Guid userId)
        {
            var rental = await _rentalRepository.GetRentalByIdAsync(rentalId);
            if (rental == null)
            {
                throw new AppException("RENTAL_NOT_FOUND");
            }

            if (rental.RenterId != userId && rental.OwnerId != userId)
            {
                throw new AppException("NOT_AUTHORIZED_TO_END_RENTAL");
            }

            rental.EndDate = DateTime.UtcNow;
            rental.IsActive = false;
            await _rentalRepository.UpdateRentalAsync(rental);

            var property = await _propertyService.GetPropertyByID(rental.PropertyId);
            property.IsRented = false;
            await _propertyService.UpdateProperty(property);
        }
        
        public async Task<Rental> GetActiveRentalByRenterId(Guid renterId)
        {
            var rental = await _rentalRepository.GetActiveRentalByUserId(renterId);
            if (rental == null)
            {
                throw new AppException("NO_ACTIVE_RENTAL_FOUND_FOR_USER");
            }

            return rental;
        }

        public async Task<List<Rental>> GetActiveRentalsByOwnerId(Guid ownerId)
        {
            var rental = await _rentalRepository.GetActiveRentalsByOwnerIdAsync(ownerId);
            if (rental == null)
            {
                throw new AppException("NO_ACTIVE_RENTAL_FOUND_FOR_USER");
            }

            return rental;
        }
    }
}
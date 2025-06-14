using System;
using System.Threading.Tasks;
using Find_Your_Home.Exceptions;
using Xunit;
using Moq;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Services.RentalService;
using Find_Your_Home.Repositories.RentalRepository;
using Find_Your_Home.Services.BookingService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;
using Find_Your_Home.Services.ConversationService;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.AuthService;
using Find_Your_Home.Models.Notifications;

public class RentalServiceTests
{
    [Fact]
    public async Task CreateRental_ShouldThrow_WhenNoBookingExists()
    {
        var bookingService = new Mock<IBookingService>();
        bookingService.Setup(s => s.GetBookingByPropertyAndUserId(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync((Booking)null);

        var rentalService = BuildRentalService(bookingService: bookingService.Object);

        var rental = new Rental
        {
            PropertyId = Guid.NewGuid(),
            RenterId = Guid.NewGuid()
        };

        var ex = await Assert.ThrowsAsync<AppException>(() => rentalService.CreateRental(rental));
        Assert.Equal("NO_COMPLETED_BOOKING_FOUND_FOR_RENT", ex.Message);
    }

    [Fact]
    public async Task CreateRental_ShouldThrow_WhenPropertyAlreadyRented()
    {
        var bookingService = new Mock<IBookingService>();
        bookingService.Setup(s => s.GetBookingByPropertyAndUserId(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(new Booking());

        var propertyService = new Mock<IPropertyService>();
        propertyService.Setup(s => s.GetPropertyByID(It.IsAny<Guid>()))
            .ReturnsAsync(new Property { IsRented = true });

        var rentalService = BuildRentalService(
            bookingService: bookingService.Object,
            propertyService: propertyService.Object
        );

        var rental = new Rental
        {
            PropertyId = Guid.NewGuid(),
            RenterId = Guid.NewGuid()
        };

        var ex = await Assert.ThrowsAsync<AppException>(() => rentalService.CreateRental(rental));
        Assert.Equal("PROPERTY_ALREADY_RENTED", ex.Message);
    }
    
    [Fact]
    public async Task CreateRental_ShouldSucceed_AndSendEmail()
    {
        var rental = new Rental
        {
            PropertyId = Guid.NewGuid(),
            RenterId = Guid.NewGuid(),
            StartDate = DateTime.UtcNow
        };

        var ownerId = Guid.NewGuid();

        var mockBookingService = new Mock<IBookingService>();
        mockBookingService.Setup(s => s.GetBookingByPropertyAndUserId(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(new Booking());

        var mockOwner = new User
        {
            Id = ownerId,
            Email = "caramaliu.nicoleta@gmail.com",
            Username = "Nicoleta"
        };

        var mockProperty = new Property
        {
            Id = rental.PropertyId,
            OwnerId = ownerId,
            IsRented = false,
            Name = "Test Apartment",
            Owner = mockOwner
        };

        var mockPropertyService = new Mock<IPropertyService>();
        mockPropertyService.Setup(s => s.GetPropertyByID(It.IsAny<Guid>()))
            .ReturnsAsync(mockProperty);
        mockPropertyService.Setup(s => s.UpdateProperty(It.IsAny<Property>()))
            .ReturnsAsync(mockProperty);

        var mockRentalRepo = new Mock<IRentalRepository>();
        mockRentalRepo.Setup(r => r.GetActiveRentalByUserId(It.IsAny<Guid>()))
            .ReturnsAsync((Rental)null);
        mockRentalRepo.Setup(r => r.CreateRentalAsync(It.IsAny<Rental>()))
            .ReturnsAsync((Rental r) => r);

        var mockConversationService = new Mock<IConversationService>();
        mockConversationService.Setup(c => c.StartOrGetConversation(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(Guid.NewGuid());

        var renterUser = new User
        {
            Id = rental.RenterId,
            Username = "RenterUser",
            Email = "renter@email.com"
        };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(u => u.GetUserById(rental.RenterId))
            .ReturnsAsync(renterUser);
        mockUserService.Setup(u => u.GetUserById(ownerId))
            .ReturnsAsync(mockOwner); // adăugat pentru caz fallback în service

        var mockEmailService = new Mock<IEmailService>();
        mockEmailService.Setup(e => e.SendRentalConfirmationEmailAsync(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DateTime>()))
            .Returns(Task.CompletedTask);

        var mockNotificationService = new Mock<INotificationService>();
        mockNotificationService.Setup(n =>
            n.SendNotificationAsync(It.IsAny<string>(), It.IsAny<NotificationMessage>()))
            .Returns(Task.CompletedTask);

        var rentalService = BuildRentalService(
            bookingService: mockBookingService.Object,
            rentalRepository: mockRentalRepo.Object,
            propertyService: mockPropertyService.Object,
            conversationService: mockConversationService.Object,
            userService: mockUserService.Object,
            emailService: mockEmailService.Object,
            notificationService: mockNotificationService.Object
        );

        // Act
        var result = await rentalService.CreateRental(rental);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("caramaliu.nicoleta@gmail.com", mockProperty.Owner.Email);

        mockEmailService.Verify(e => e.SendRentalConfirmationEmailAsync(
            "caramaliu.nicoleta@gmail.com", "Nicoleta", "Test Apartment", "RenterUser", rental.StartDate), Times.Once);

        mockNotificationService.Verify(n =>
            n.SendNotificationAsync(It.IsAny<string>(), It.IsAny<NotificationMessage>()), Times.Once);
    }

    private RentalService BuildRentalService(
        IRentalRepository? rentalRepository = null,
        INotificationService? notificationService = null,
        IBookingService? bookingService = null,
        IPropertyService? propertyService = null,
        IUserService? userService = null,
        IEmailService? emailService = null,
        IConversationService? conversationService = null)
    {
        return new RentalService(
            rentalRepository ?? new Mock<IRentalRepository>().Object,
            notificationService ?? new Mock<INotificationService>().Object,
            bookingService ?? new Mock<IBookingService>().Object,
            propertyService ?? new Mock<IPropertyService>().Object,
            userService ?? new Mock<IUserService>().Object,
            emailService ?? new Mock<IEmailService>().Object,
            conversationService ?? new Mock<IConversationService>().Object
        );
    }
}

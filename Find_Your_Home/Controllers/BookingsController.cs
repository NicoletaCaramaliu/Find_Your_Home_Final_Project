using AutoMapper;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Bookings.DTO;
using Find_Your_Home.Services.AvailabilitySlotService;
using Find_Your_Home.Services.BookingService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IAvailabilitySlotService _availabilitySlotService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public BookingsController(IBookingService bookingService, IAvailabilitySlotService availabilitySlotService, IMapper mapper, IUserService userService)
        {
            _userService = userService;
            _bookingService = bookingService;
            _availabilitySlotService = availabilitySlotService;
            _mapper = mapper;
        }
        
        [HttpPost("bookSlot"), Authorize]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking([FromBody] BookingRequestDto bookingDto)
        {
            var userId = _userService.GetMyId();
            
            var booking = _mapper.Map<Booking>(bookingDto);
            var bookedVisit = await _bookingService.CreateBooking(booking, userId);
            var result = _mapper.Map<BookingResponseDto>(bookedVisit);
            return Ok(result);
        }
        
        [HttpGet("getBookings"), Authorize]
        public async Task<ActionResult<List<BookingResponseDto>>> GetBookingsForProperty(Guid propertyId)
        {
            var bookings = await _bookingService.GetBookingsByPropertyId(propertyId);
            var result = _mapper.Map<List<BookingResponseDto>>(bookings);
            return Ok(result);
        }
        
        [HttpPost("confirm/{bookingId}"), Authorize(Roles = "Admin, PropertyOwner, Agent")]
        public async Task<ActionResult> ConfirmBooking(Guid bookingId)
        {
            var userId = _userService.GetMyId();
            await _bookingService.ConfirmBooking(bookingId, userId);
            return Ok(new { message = "BOOKING_CONFIRMED" });
        }



        [HttpGet("getAllMyPropertiesBookings"), Authorize]
        public async Task<ActionResult<List<BookingResponseDto>>> GetBookingsForOwner()
        {
            var userId = _userService.GetMyId();
            var bookings = await _bookingService.GetBookingsByOwnerId(userId);
            var result = _mapper.Map<List<BookingResponseDto>>(bookings);
            return Ok(result);
        }
        
        [HttpGet("reject/{bookingId}"), Authorize(Roles = "Admin, PropertyOwner, Agent")]
        public async Task<ActionResult> RejectBooking(Guid bookingId)
        {
            var userId = _userService.GetMyId();
            await _bookingService.RejectBooking(bookingId, userId);
            return Ok(new { message = "BOOKING_REJECTED" });
        }

        [HttpGet("getMyBookings"), Authorize]
        public async Task<ActionResult<List<BookingResponseDto>>> GetMyBookings()
        {
            var userId = _userService.GetMyId();
            var bookings = await _bookingService.GetBookingsByUserId(userId);
            var result = _mapper.Map<List<BookingResponseDto>>(bookings);
            return Ok(result);
        }
        
        [HttpPost("cancel/{bookingId}"), Authorize(Roles = "Admin, PropertyOwner, Agent")]
        public async Task<ActionResult> CancelBooking(Guid bookingId)
        {
            var userId = _userService.GetMyId();
            await _bookingService.CancelBooking(bookingId, userId);
            return Ok(new { message = "BOOKING_CANCELLED" });
        }
    }
}
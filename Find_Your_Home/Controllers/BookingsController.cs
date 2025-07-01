using AutoMapper;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Bookings.DTO;
using Find_Your_Home.Services.BookingService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class BookingsController(
        IBookingService bookingService,
        IMapper mapper,
        IUserService userService)
        : ControllerBase
    {
        [HttpPost("bookSlot"), Authorize]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking([FromBody] BookingRequestDto bookingDto)
        {
            var userId = userService.GetMyId();
            
            var booking = mapper.Map<Booking>(bookingDto);
            var bookedVisit = await bookingService.CreateBooking(booking, userId);
            var result = mapper.Map<BookingResponseDto>(bookedVisit);
            return Ok(result);
        }
        
        [HttpGet("getBookings"), Authorize]
        public async Task<ActionResult<List<BookingResponseDto>>> GetBookingsForProperty(Guid propertyId)
        {
            var bookings = await bookingService.GetBookingsByPropertyId(propertyId);
            var result = mapper.Map<List<BookingResponseDto>>(bookings);
            return Ok(result);
        }
        
        [HttpPost("confirm/{bookingId}"), Authorize(Roles = "Admin, PropertyOwner, Agent")]
        public async Task<ActionResult> ConfirmBooking(Guid bookingId)
        {
            var userId = userService.GetMyId();
            await bookingService.ConfirmBooking(bookingId, userId);
            return Ok(new { message = "BOOKING_CONFIRMED" });
        }



        [HttpGet("getAllMyPropertiesBookings"), Authorize]
        public async Task<ActionResult<List<BookingResponseDto>>> GetBookingsForOwner()
        {
            var userId = userService.GetMyId();
            var bookings = await bookingService.GetBookingsByOwnerId(userId);
            var result = mapper.Map<List<BookingResponseDto>>(bookings);
            return Ok(result);
        }
        
        [HttpGet("reject/{bookingId}"), Authorize(Roles = "Admin, PropertyOwner")]
        public async Task<ActionResult> RejectBooking(Guid bookingId)
        {
            var userId = userService.GetMyId();
            await bookingService.RejectBooking(bookingId, userId);
            return Ok(new { message = "BOOKING_REJECTED" });
        }

        [HttpGet("getMyBookings"), Authorize]
        public async Task<ActionResult<List<BookingResponseDto>>> GetMyBookings()
        {
            var userId = userService.GetMyId();
            var bookings = await bookingService.GetBookingsByUserId(userId);
            var result = mapper.Map<List<BookingResponseDto>>(bookings);
            return Ok(result);
        }
        
        [HttpPost("cancel/{bookingId}"), Authorize(Roles = "Admin, PropertyOwner")]
        public async Task<ActionResult> CancelBooking(Guid bookingId)
        {
            var userId = userService.GetMyId();
            await bookingService.CancelBooking(bookingId, userId);
            return Ok(new { message = "BOOKING_CANCELLED" });
        }
    }
}
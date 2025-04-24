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
    }
}
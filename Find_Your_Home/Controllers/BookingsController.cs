using AutoMapper;
using Find_Your_Home.Services.AvailabilitySlotService;
using Find_Your_Home.Services.BookingService;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IAvailabilitySlotService _availabilitySlotService;
        private readonly IMapper _mapper;

        public BookingsController(IBookingService bookingService, IAvailabilitySlotService availabilitySlotService, IMapper mapper)
        {
            _mapper = mapper;
            _bookingService = bookingService;
            _availabilitySlotService = availabilitySlotService;
        }
    }
}
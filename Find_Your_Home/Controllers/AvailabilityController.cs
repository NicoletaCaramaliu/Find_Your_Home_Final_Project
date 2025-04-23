using AutoMapper;
using Find_Your_Home.Exceptions;
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
    public class AvailabilityController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IAvailabilitySlotService _availabilitySlotService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AvailabilityController(IBookingService bookingService, IAvailabilitySlotService availabilitySlotService, IMapper mapper, IUserService userService)
        {
            _userService = userService;
            _mapper = mapper;
            _bookingService = bookingService;
            _availabilitySlotService = availabilitySlotService;
        }
        
        [HttpPost("addSlot"),Authorize(Roles = "Admin, PropertyOwner, Agent")]
        public async Task<IActionResult> AddSlot([FromBody] AvailabilitySlotDto availabilitySlotDto)
        {
            var userId = _userService.GetMyId();

            bool isOwner = await _availabilitySlotService.IsUserOwnerOfProperty(availabilitySlotDto.PropertyId, userId);
            if (!isOwner)
            {
                throw new AppException("NOT_OWNER_OF_PROPERTY");
            }

            if (availabilitySlotDto.EndTime <= availabilitySlotDto.StartTime)
            {
                throw new AppException("INVALID_TIME_RANGE");
            }

            DateTime startDateTime = availabilitySlotDto.Date.Date + availabilitySlotDto.StartTime;
            DateTime endDateTime = availabilitySlotDto.Date.Date + availabilitySlotDto.EndTime;

            bool overlaps = await _availabilitySlotService.CheckSlotOverlap(
                availabilitySlotDto.PropertyId,
                availabilitySlotDto.Date,
                startDateTime,
                endDateTime
            );

            if (overlaps)
            {
                throw new AppException("SLOT_OVERLAP_EXISTS");
            }

            var slot = _mapper.Map<AvailabilitySlot>(availabilitySlotDto);

            var addedSlot = await _availabilitySlotService.AddAvailabilitySlot(slot);
            var addedSlotDto = _mapper.Map<AvailabilitySlotResponseDto>(addedSlot);
            return Ok(addedSlotDto);
        }

        [HttpGet("getSlots/{propertyId}")]
        public async Task<IActionResult> GetSlots(Guid propertyId)
        {
            var slots = await _availabilitySlotService.GetAvailabilitySlotsForPropertyId(propertyId);
            var slotsDto = _mapper.Map<List<AvailabilitySlotResponseDto>>(slots);
            return Ok(slotsDto);
        }
        
        [HttpDelete("deleteSlot/{slotId}"), Authorize(Roles = "Admin, PropertyOwner, Agent")]
        public async Task<IActionResult> DeleteSlot(Guid slotId)
        {
            var userId = _userService.GetMyId();
            var slot = await _availabilitySlotService.GetAvailabilitySlotById(slotId);
            if (slot == null)
            {
                throw new AppException("SLOT_NOT_FOUND");
            }

            var isOwner = await _availabilitySlotService.IsUserOwnerOfProperty(slot.PropertyId, userId);
            if (!isOwner)
            {
                throw new AppException("NOT_OWNER_OF_PROPERTY");
            }

            await _availabilitySlotService.DeleteAvailabilitySlot(slotId);
            return Ok(new { message = "Slot deleted successfully" });
        }

        [HttpGet("getSlot/{slotId}"), Authorize]
        public async Task<IActionResult> GetSlot(Guid slotId)
        {
            var slot = await _availabilitySlotService.GetAvailabilitySlotById(slotId);
            if (slot == null)
            {
                throw new AppException("SLOT_NOT_FOUND");
            }

            var slotDto = _mapper.Map<AvailabilitySlotResponseDto>(slot);
            return Ok(slotDto);
        }
        
        
    }
}
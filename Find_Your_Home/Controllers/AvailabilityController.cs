using AutoMapper;
using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Bookings.DTO;
using Find_Your_Home.Models.Models;
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

        public AvailabilityController(
            IBookingService bookingService,
            IAvailabilitySlotService availabilitySlotService,
            IMapper mapper,
            IUserService userService)
        {
            _bookingService = bookingService;
            _availabilitySlotService = availabilitySlotService;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost("addSlot"), Authorize(Roles = "Admin, PropertyOwner")]
        public async Task<ActionResult<AvailabilitySlotResponseDto>> AddSlot([FromBody] AvailabilitySlotDto dto)
        {
            var userId = _userService.GetMyId();

            if (!await _availabilitySlotService.IsUserOwnerOfProperty(dto.PropertyId, userId))
                throw new AppException("NOT_OWNER_OF_PROPERTY");

            if (dto.EndTime <= dto.StartTime)
                throw new AppException("INVALID_TIME_RANGE");

            dto.Date = dto.Date.Date; 

            var startDateTime = dto.Date + dto.StartTime;
            var endDateTime = dto.Date + dto.EndTime;

            if (await _availabilitySlotService.CheckSlotOverlap(dto.PropertyId, dto.Date, startDateTime, endDateTime))
                throw new AppException("SLOT_OVERLAP_EXISTS");

            var slotEntity = _mapper.Map<AvailabilitySlot>(dto);
            var addedSlot = await _availabilitySlotService.AddAvailabilitySlot(slotEntity);
            var resultDto = _mapper.Map<AvailabilitySlotResponseDto>(addedSlot);

            return Ok(resultDto);
        }


        [HttpGet("getSlots/{propertyId}"), Authorize]
        public async Task<ActionResult<List<AvailabilitySlotResponseDto>>> GetSlots(Guid propertyId)
        {
            var slots = await _availabilitySlotService.GetAvailabilitySlotsForPropertyId(propertyId);
            var slotsDto = _mapper.Map<List<AvailabilitySlotResponseDto>>(slots);
            return Ok(slotsDto);
        }

        [HttpGet("getSlot/{slotId}"), Authorize]
        public async Task<ActionResult<AvailabilitySlotResponseDto>> GetSlot(Guid slotId)
        {
            var slot = await _availabilitySlotService.GetAvailabilitySlotById(slotId);
            if (slot == null)
                throw new AppException("SLOT_NOT_FOUND");

            var slotDto = _mapper.Map<AvailabilitySlotResponseDto>(slot);
            return Ok(slotDto);
        }

        [HttpDelete("deleteSlot/{slotId}"), Authorize(Roles = "Admin, PropertyOwner")]
        public async Task<ActionResult> DeleteSlot(Guid slotId)
        {
            var userId = _userService.GetMyId();
            var slot = await _availabilitySlotService.GetAvailabilitySlotById(slotId);

            if (slot == null)
                throw new AppException("SLOT_NOT_FOUND");

            if (!await _availabilitySlotService.IsUserOwnerOfProperty(slot.PropertyId, userId))
                throw new AppException("NOT_OWNER_OF_PROPERTY");

            await _availabilitySlotService.DeleteAvailabilitySlot(slotId);
            return Ok(new { message = "SLOT_DELETED_SUCCESSFULLY" });
        }
        
        [HttpGet("getVisits/{propertyId}"), Authorize]
        public async Task<ActionResult<List<VisitsResponseDto>>> GetVisits(Guid propertyId)
        {
            var slots = await _availabilitySlotService.GetAvailabilitySlotsForPropertyId(propertyId);

            var visits = new List<VisitsResponseDto>();

            foreach (var slot in slots)
            {
                var baseDate = slot.Date.Date;
                var start = baseDate + slot.StartTime;
                var end = baseDate + slot.EndTime;

                while (start < end)
                {
                    var visitEnd = start.AddMinutes(slot.VisitDurationInMinutes);
                    if (visitEnd > end)
                        break;

                    var booking = slot.Bookings.FirstOrDefault(b =>
                        (baseDate + b.StartTime) == start &&
                        (baseDate + b.EndTime) == visitEnd &&
                        (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed));

                    string status;
                    if (booking == null)
                        status = "Available";
                    else
                        status = booking.Status.ToString(); 

                    visits.Add(new VisitsResponseDto
                    {
                        Start = start,
                        End = visitEnd,
                        Status = status,
                        AvailabilitySlotId = slot.Id
                    });

                    start = visitEnd;
                }
            }

            return Ok(visits);
        }

    }
}

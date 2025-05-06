using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Repositories.AvailabilitySlotRepository;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;

namespace Find_Your_Home.Services.AvailabilitySlotService
{
    public class AvailabilitySlotService : IAvailabilitySlotService
    {
        private readonly IUserService _userService;
        private readonly IPropertyService _propertyService;
        private readonly IAvailabilitySlotRepository _availabilitySlotRepository;

        public AvailabilitySlotService(IUserService userService, IAvailabilitySlotRepository availabilitySlotRepository, IPropertyService propertyService)
        {
            _userService = userService;
            _availabilitySlotRepository = availabilitySlotRepository;
            _propertyService = propertyService;
        }

        public async Task<bool> IsUserOwnerOfProperty(Guid propertyId, Guid userId)
        {
            var user = await _userService.GetUserById(userId);
            if (user == null)
                return false;

            var property = await _propertyService.GetPropertyByID(propertyId);
            if (property == null)
                return false;

            return property.OwnerId == user.Id;
        }

        public async Task<bool> CheckSlotOverlap(Guid propertyId, DateTime date, DateTime startDateTime, DateTime endDateTime)
        {
            var slots = await _availabilitySlotRepository.GetAvailabilitySlotsByPropertyId(propertyId);
            if (slots == null || !slots.Any())
                return false;

            foreach (var slot in slots)
            {
                DateTime slotStart = slot.Date.Date + slot.StartTime;
                DateTime slotEnd = slot.Date.Date + slot.EndTime;

                if (slot.Date.Date == date.Date &&
                    (startDateTime < slotEnd && endDateTime > slotStart))
                {
                    return true;
                }
            }

            return false;
        }

        public async Task<AvailabilitySlot> AddAvailabilitySlot(AvailabilitySlot availabilitySlot)
        {
            availabilitySlot.Date = availabilitySlot.Date.Date;
            var addedSlot = await _availabilitySlotRepository.AddAvailabilitySlotAsync(availabilitySlot);
            return addedSlot;
        }

        public async Task<IEnumerable<AvailabilitySlot>> GetAvailabilitySlotsForPropertyId(Guid propertyId)
        {
            var slots = await _availabilitySlotRepository.GetAvailabilitySlotsByPropertyId(propertyId);
            if (slots == null || !slots.Any())
                throw new AppException("NO_SLOTS_FOUND_FOR_PROPERTY");

            return slots;
        }

        public async Task<AvailabilitySlot> GetAvailabilitySlotById(Guid availabilitySlotId)
        {
            var slot = await _availabilitySlotRepository.GetAvailabilitySlotWithBookingsByIdAsync(availabilitySlotId);
            if (slot == null)
                throw new AppException("SLOT_NOT_FOUND");

            return slot;
        }

        public async Task DeleteAvailabilitySlot(Guid availabilitySlotId)
        {
            var slot = await _availabilitySlotRepository.GetAvailabilitySlotWithBookingsByIdAsync(availabilitySlotId);

            if (slot == null)
                throw new AppException("SLOT_NOT_FOUND");

            if (slot.Bookings.Any())
                throw new AppException("CANNOT_DELETE_SLOT_WITH_BOOKINGS");

            _availabilitySlotRepository.Delete(slot);
            await _availabilitySlotRepository.SaveAsync();
        }
    }
}

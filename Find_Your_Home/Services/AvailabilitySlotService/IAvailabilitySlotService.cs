using Find_Your_Home.Models.Bookings;

namespace Find_Your_Home.Services.AvailabilitySlotService
{
    public interface IAvailabilitySlotService
    {
        Task<bool> IsUserOwnerOfProperty(Guid propertyId, Guid userId);
        Task<bool> CheckSlotOverlap(Guid propertyId, DateTime date, DateTime startDateTime, DateTime endDateTime);
        Task<AvailabilitySlot> AddAvailabilitySlot(AvailabilitySlot availabilitySlot);
        Task<IEnumerable<AvailabilitySlot>>  GetAvailabilitySlotsForPropertyId(Guid propertyId);
        Task<AvailabilitySlot> GetAvailabilitySlotById(Guid availabilitySlotId);
        Task<bool> DeleteAvailabilitySlot(Guid availabilitySlotId);
    }
}
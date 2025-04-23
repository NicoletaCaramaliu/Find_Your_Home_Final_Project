using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.AvailabilitySlotRepository
{
    public interface IAvailabilitySlotRepository : IGenericRepository<AvailabilitySlot>
    {
        Task<IEnumerable<AvailabilitySlot>> GetAvailabilitySlotsByPropertyId(Guid propertyId);
        Task<AvailabilitySlot> AddAvailabilitySlotAsync(AvailabilitySlot availabilitySlot);
        Task<AvailabilitySlot> GetAvailabilitySlotByIdAsync(Guid availabilitySlotId);
        Task<AvailabilitySlot> GetAvailabilitySlotWithBookingsByIdAsync(Guid availabilitySlotId);
    }
}
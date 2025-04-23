using Find_Your_Home.Data;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.AvailabilitySlotRepository
{
    public class AvailabilitySlotRepository : GenericRepository<AvailabilitySlot>, IAvailabilitySlotRepository
    {
        private readonly ApplicationDbContext _context;
        public AvailabilitySlotRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<AvailabilitySlot>> GetAvailabilitySlotsByPropertyId(Guid propertyId)
        {
            return await _context.AvailabilitySlots
                .Where(slot => slot.PropertyId == propertyId)
                .ToListAsync();
        }
        
        public async Task<AvailabilitySlot> AddAvailabilitySlotAsync(AvailabilitySlot availabilitySlot)
        {
            await _context.AvailabilitySlots.AddAsync(availabilitySlot);
            await _context.SaveChangesAsync();
            return availabilitySlot;
        }

        public async Task<AvailabilitySlot> GetAvailabilitySlotByIdAsync(Guid availabilitySlotId)
        {
            return await _context.AvailabilitySlots
                .FirstOrDefaultAsync(slot => slot.Id == availabilitySlotId);
        }
        
        public async Task<AvailabilitySlot> GetAvailabilitySlotWithBookingsByIdAsync(Guid availabilitySlotId)
        {
            return await _context.AvailabilitySlots
                .Include(slot => slot.Bookings)
                .FirstOrDefaultAsync(slot => slot.Id == availabilitySlotId);
        }
    }
}

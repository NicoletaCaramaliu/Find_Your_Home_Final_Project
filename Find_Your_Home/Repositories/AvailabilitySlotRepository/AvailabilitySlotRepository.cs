using Find_Your_Home.Data;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.AvailabilitySlotRepository
{
    public class AvailabilitySlotRepository : GenericRepository<AvailabilitySlot>, IAvailabilitySlotRepository
    {
        public AvailabilitySlotRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}

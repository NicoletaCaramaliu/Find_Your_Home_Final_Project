using Find_Your_Home.Data;
using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.BookingRepository
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
        
        public async Task<Booking> CreateBookingAsync(Booking booking, Guid userId)
        {
            booking.UserId = userId;
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
            return booking;
        }
        
        public async Task<bool> IsSlotAlreadyBooked(Guid propertyId, DateTime date, TimeSpan start, TimeSpan end)
        {
            return await _context.Bookings.AnyAsync(b =>
                b.PropertyId == propertyId &&
                b.SlotDate.Date == date.Date &&
                (
                    (start >= b.StartTime && start < b.EndTime) ||
                    (end > b.StartTime && end <= b.EndTime) ||
                    (start <= b.StartTime && end >= b.EndTime)
                )
            );
        }
        
        
        public async Task<List<Booking>> GetBookingsForSlot(Guid propertyId, DateTime date, TimeSpan start, TimeSpan end)
        {
            return await _context.Bookings
                .Where(b => b.PropertyId == propertyId
                            && b.SlotDate.Date == date.Date
                            && b.StartTime == start
                            && b.EndTime == end)
                .ToListAsync();
        }

        public async Task<Booking> GetBookingByIdAsync(Guid bookingId)
        {
            return await _context.Bookings
                .Include(b => b.Property)
                .ThenInclude(p => p.Owner)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == bookingId);
        }
        
        public async Task<IEnumerable<Booking>> GetBookingsByPropertyIdAsync(Guid propertyId)
        {
            return await _context.Bookings
                .Include(b => b.Property)
                .Include(b => b.User)
                .Where(b => b.PropertyId == propertyId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByOwnerIdAsync(Guid userId)
        {
            return await _context.Bookings
                .Include(b => b.Property)
                .Include(b => b.User)
                .Where(b => b.Property.OwnerId == userId)
                .OrderByDescending(b => b.SlotDate).ThenBy(b => b.StartTime)
                .ToListAsync();
        }
    }
}
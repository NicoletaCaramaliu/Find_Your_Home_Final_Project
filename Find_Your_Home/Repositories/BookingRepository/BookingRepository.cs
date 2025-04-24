using Find_Your_Home.Data;
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

        

    }
}
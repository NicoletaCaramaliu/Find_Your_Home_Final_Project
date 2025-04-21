using Find_Your_Home.Data;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Repositories.GenericRepository; 

namespace Find_Your_Home.Repositories.BookingRepository
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(ApplicationDbContext context) : base(context) { }
    }
}
using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.RentalRepository
{
    public class RentalRepository : GenericRepository<Rental>, IRentalRepository
    {
        private readonly ApplicationDbContext _context;
        public RentalRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
        
        public async Task<Rental> CreateRentalAsync(Rental rental)
        {
            await _context.Rentals.AddAsync(rental);
            await _context.SaveChangesAsync();
            return rental;
        }
    }
}
using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

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

        public async Task<List<Rental>> GetRentalsByUserIdAsync(Guid userId)
        {
            return await _context.Rentals
                .Where(r => r.RenterId == userId)
                .Include(r => r.Owner)
                .Include(r => r.Renter)
                .Include(r => r.Property)
                .ToListAsync();
        }
        
        public async Task<Rental?> GetActiveRentalByUserId(Guid userId)
        {
            return await _context.Rentals
                .Include(r => r.Owner)
                .Include(r => r.Renter)
                .Include(r => r.Property)
                .FirstOrDefaultAsync(r => r.RenterId == userId && r.EndDate == null);
        }

        public async Task<Rental?> GetRentalByIdAsync(Guid rentalId)
        {
            return await _context.Rentals
                .Include(r => r.Renter)
                .Include(r => r.Owner)
                .Include(r => r.Property)
                .FirstOrDefaultAsync(r => r.Id == rentalId);
        }

        public async Task UpdateRentalAsync(Rental rental)
        {
            _context.Rentals.Update(rental);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Rental>> GetActiveRentalsByOwnerIdAsync(Guid ownerId)
        {
            return await _context.Rentals
                .Where(r => r.OwnerId == ownerId && r.EndDate == null)
                .Include(r => r.Owner)
                .Include(r => r.Renter)
                .Include(r => r.Property)
                .ToListAsync();
        }
    }
}
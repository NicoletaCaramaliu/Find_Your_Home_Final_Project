using System.Linq.Expressions;
using Find_Your_Home.Data;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.PropertyImgRepository
{
    public class PropertyImgRepository : GenericRepository<PropertyImage>, IPropertyImgRepository
    {
        private readonly ApplicationDbContext _context;
        public PropertyImgRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PropertyImage>> GetImages(Guid propertyId)
        {
            return await _context.PropertyImages
                .Where(img => img.PropertyId == propertyId)
                .ToListAsync();
        }
        
        public async Task<List<PropertyImage>> GetFirstImages(List<Guid> propertyIds)
        {
            return await _context.PropertyImages
                .Where(img => propertyIds.Contains(img.PropertyId))
                .GroupBy(img => img.PropertyId)
                .Select(group => group.OrderBy(img => img.Order).First())
                .ToListAsync();
        }
        
        public async Task<PropertyImage> GetByIdAsync(Guid id)
        {
            return await _context.PropertyImages
                .FirstOrDefaultAsync(img => img.Id == id);
        }
        
        public async Task DeleteImageAsync(Guid id)
        {
            var image = await GetByIdAsync(id);
            
            _context.PropertyImages.Remove(image);
            await _context.SaveChangesAsync();
            
        }
        
        public async Task<bool> AnyAsync(Expression<Func<PropertyImage, bool>> predicate)
        {
            return await _context.PropertyImages.AnyAsync(predicate);
        }

    }
}
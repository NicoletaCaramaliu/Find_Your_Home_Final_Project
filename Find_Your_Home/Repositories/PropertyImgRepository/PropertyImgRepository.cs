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

        public async Task<List<PropertyImage>> GetImages(Guid propertyId)
        {
            return await _context.PropertyImages
                .Where(img => img.PropertyId == propertyId)
                .ToListAsync();
        }
    }
}
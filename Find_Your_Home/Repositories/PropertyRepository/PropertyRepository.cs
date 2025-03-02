using Find_Your_Home.Data;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Repositories.PropertyRepository
{
    public class PropertyRepository : GenericRepository<Property>, IPropertyRepository
    {
        private readonly ApplicationDbContext _context;
        public PropertyRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }


    }
}
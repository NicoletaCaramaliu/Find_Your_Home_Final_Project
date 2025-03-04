using Find_Your_Home.Data;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
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
        //FilterPropertiesAsync(properties, filterCriteria);
        public async Task<IEnumerable<Property>> FilterPropertiesAsync(IQueryable<Property> properties, FilterCriteria filterCriteria)
        {
            if (!string.IsNullOrEmpty(filterCriteria.Category))
            {
                properties = properties.Where(p => p.Category == filterCriteria.Category);
            }
            if (!string.IsNullOrEmpty(filterCriteria.City))
            {
                properties = properties.Where(p => p.City == filterCriteria.City);
            }
            if (!string.IsNullOrEmpty(filterCriteria.State))
            {
                properties = properties.Where(p => p.State == filterCriteria.State);
            }
            if (!string.IsNullOrEmpty(filterCriteria.Zip))
            {
                properties = properties.Where(p => p.Zip == filterCriteria.Zip);
            }
            if (filterCriteria.MinPrice.HasValue)
            {
                properties = properties.Where(p => p.Price >= filterCriteria.MinPrice.Value);
            }
            if (filterCriteria.MaxPrice.HasValue)
            {
                properties = properties.Where(p => p.Price <= filterCriteria.MaxPrice.Value);
            }
            if (filterCriteria.Rooms.HasValue)
            {
                properties = properties.Where(p => p.Rooms == filterCriteria.Rooms.Value);
            }
            if (filterCriteria.Bathrooms.HasValue)
            {
                properties = properties.Where(p => p.Bathrooms == filterCriteria.Bathrooms.Value);
            }
            if (filterCriteria.Garage.HasValue)
            {
                properties = properties.Where(p => p.Garage == filterCriteria.Garage.Value);
            }
            if (filterCriteria.SquareFeet.HasValue)
            {
                properties = properties.Where(p => p.SquareFeet >= filterCriteria.SquareFeet.Value);
            }

            return await properties.ToListAsync();
        }

    }
}
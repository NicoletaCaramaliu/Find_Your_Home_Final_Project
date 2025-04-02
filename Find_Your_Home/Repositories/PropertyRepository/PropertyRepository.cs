using Find_Your_Home.Data;
using Find_Your_Home.Helpers;
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
        public async Task<IQueryable<Property>> FilterPropertiesAsync(IQueryable<Property> properties, FilterCriteria filterCriteria)
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

    if (filterCriteria.NumberOfKitchen.HasValue)
    {
        properties = properties.Where(p => p.NumberOfKitchen == filterCriteria.NumberOfKitchen.Value);
    }

    if (filterCriteria.NumberOfBalconies.HasValue)
    {
        properties = properties.Where(p => p.NumberOfBalconies == filterCriteria.NumberOfBalconies.Value);
    }

    if (filterCriteria.HasGarden.HasValue)
    {
        properties = properties.Where(p => p.HasGarden == filterCriteria.HasGarden.Value);
    }

    if (filterCriteria.ForRent.HasValue)
    {
        properties = properties.Where(p => p.ForRent == filterCriteria.ForRent.Value);
    }

    if (filterCriteria.Views.HasValue)
    {
        properties = properties.Where(p => p.Views <= filterCriteria.Views.Value);
    }

    if (filterCriteria.YearOfConstruction.HasValue)
    {
        properties = properties.Where(p => p.YearOfConstruction >= filterCriteria.YearOfConstruction.Value);
    }

    if (filterCriteria.Furnished.HasValue)
    {
        properties = properties.Where(p => p.Furnished == filterCriteria.Furnished.Value);
    }

    return properties;
}


        public async Task<IEnumerable<Property>> SortPropertiesAsync(IQueryable<Property> properties,
            SortCriteria sortCriteria)
        {
            if (string.IsNullOrWhiteSpace(sortCriteria.SortBy))
            {
                return await properties.ToListAsync();
            }

            var sortBy = sortCriteria.SortBy.Trim().ToLower();
            var sortOrder = sortCriteria.SortOrder?.Trim().ToLower() == "desc";

            properties = sortBy switch
            {
                "price" => sortOrder ? properties.OrderByDescending(p => p.Price) : properties.OrderBy(p => p.Price),
                "date" => sortOrder
                    ? properties.OrderByDescending(p => p.CreatedAt)
                    : properties.OrderBy(p => p.CreatedAt),
                _ => properties
            };

            return await properties.ToListAsync();
        }
        
        public async Task<IEnumerable<Property>> SearchPropertiesAsync(IQueryable<Property> properties, string searchText)
        {
            searchText = searchText.ToLower();

            var filteredProperties = properties.Where(p =>
                (p.Name != null && p.Name.ToLower().Contains(searchText)) ||
                (p.Description != null && p.Description.ToLower().Contains(searchText)) ||
                (p.Address != null && p.Address.ToLower().Contains(searchText)) ||
                (p.City != null && p.City.ToLower().Contains(searchText)) ||
                (p.State != null && p.State.ToLower().Contains(searchText)) 
            ).ToListAsync();
            
            return await filteredProperties;
        }
    }
}
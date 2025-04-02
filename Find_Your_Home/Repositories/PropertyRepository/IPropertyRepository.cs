using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.PropertyRepository
{
    public interface IPropertyRepository : IGenericRepository<Property>
    {
        Task<IQueryable<Property>> FilterPropertiesAsync(IQueryable<Property> properties, FilterCriteria filterCriteria);

        Task<IEnumerable<Property>> SortPropertiesAsync(IQueryable<Property> properties, SortCriteria sortCriteria);
        
        Task<IEnumerable<Property>> SearchPropertiesAsync(IQueryable<Property> properties, string searchText);
    }
}
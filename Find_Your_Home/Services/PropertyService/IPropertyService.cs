using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;

namespace Find_Your_Home.Services.PropertyService
{
    public interface IPropertyService
    {
        Task<Property> CreateProperty(Property property);
        Task<IQueryable<Property>> GetAllProperties();
        /*Task<IEnumerable<Property>> FilterProperties(FilterCriteria filterCriteria, int pageNumber, int pageSize);
        */
        Task<IQueryable<Property>> FilterProperties(IQueryable<Property> properties, FilterCriteria filterCriteria);
        Task<(List<Property>, int)> FilterPropertiesWithCount(IQueryable<Property> propertiesSorted, FilterCriteria filterCriteria, int pageNumber, int pageSize);

        Task<Property> GetPropertyByID(Guid id);
        
        Task<IQueryable<Property>> SortProperties(SortCriteria sortCriteria);
        
        Task<IQueryable<Property>> SortFilteredProperties(IQueryable<Property> properties, SortCriteria sortCriteria);

        Task<IQueryable<Property>> SearchProperties(IQueryable<Property> properties, string searchText);
        
        Task<IQueryable<Property>> GetAllPropertiesByUserId(Guid userId);
        
        Task<Property> UpdateProperty(Property property);
        
        Task<Property> DeleteProperty(Guid id);
    }
}
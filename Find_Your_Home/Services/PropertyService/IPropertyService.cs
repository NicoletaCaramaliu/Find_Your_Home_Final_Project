using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;

namespace Find_Your_Home.Services.PropertyService
{
    public interface IPropertyService
    {
        Task<Property> CreateProperty(Property property);
        Task<IEnumerable<Property>> GetAllProperties();
        /*
        Task<IEnumerable<Property>> FilterProperties(FilterCriteria filterCriteria, int pageNumber, int pageSize);
        */
        
        Task<(List<Property>, int)> FilterPropertiesWithCount(FilterCriteria filterCriteria, int pageNumber, int pageSize);

        Task<Property> GetPropertyByID(Guid id);
        
        Task<IEnumerable<Property>> SortProperties(SortCriteria sortCriteria);
        
        
        
        Task<IEnumerable<Property>> SearchProperties(string searchText);
    }
}
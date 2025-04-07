using Find_Your_Home.Helpers;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Services.PropertyService
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PropertyService(IPropertyRepository propertyRepository, IUnitOfWork unitOfWork)
        {
            _propertyRepository = propertyRepository;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<Property> CreateProperty(Property property)
        {
            await _propertyRepository.CreateAsync(property);
            await _unitOfWork.SaveAsync();
            return property;
        }
        
        public async Task<IQueryable<Property>> GetAllProperties()
        {
            var properties = await _propertyRepository.GetAllQueryableAsync();
            return properties;
        }
        
        public async Task<IQueryable<Property>> FilterProperties(IQueryable<Property> properties, FilterCriteria filterCriteria)
        {
            var filteredProperties = await _propertyRepository.FilterPropertiesAsync(properties, filterCriteria);
            return filteredProperties;
        }
        
        /*public async Task<IEnumerable<Property>> FilterProperties(FilterCriteria filterCriteria, int pageNumber, int pageSize)
        {
            var properties = await _propertyRepository.GetAllQueryableAsync();
            var filteredProperties = await _propertyRepository.FilterPropertiesAsync(properties, filterCriteria);
            return filteredProperties;
        }*/
        
        public async Task<(List<Property>, int)> FilterPropertiesWithCount(IQueryable<Property> propertiesSorted, FilterCriteria filterCriteria, int pageNumber, int pageSize)
        {
            var filteredProperties = await _propertyRepository.FilterPropertiesAsync(propertiesSorted, filterCriteria);
    
            var totalCount = await filteredProperties.CountAsync(); 
    
            
            var paginatedProperties = PaginationHelper.ApplyPagination(filteredProperties, pageNumber, pageSize);
    
            /*var paginatedProperties = filteredProperties
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
            return (await paginatedProperties.ToListAsync(), totalCount);*/
            
            
            return (await paginatedProperties.ToListAsync(), totalCount);
        }


        public async Task<Property> GetPropertyByID(Guid id)
        {
            return await _propertyRepository.FindByIdAsync(id);
        }

        public async Task<IQueryable<Property>> SortProperties(SortCriteria sortCriteria)
        {
            var properties = await _propertyRepository.GetAllQueryableAsync();
            var sortedProperties = await _propertyRepository.SortPropertiesAsync(properties, sortCriteria);
            return sortedProperties;
        }
        
        public async Task<IQueryable<Property>> SortFilteredProperties(IQueryable<Property> filteredProperties, SortCriteria sortCriteria)
        {
            var sortedProperties = await _propertyRepository.SortPropertiesAsync(filteredProperties, sortCriteria);
            return sortedProperties;
        }
        
        public async Task<IQueryable<Property>> SearchProperties(IQueryable<Property> properties, string searchText)
        {
            var searchedProperties = _propertyRepository.SearchPropertiesAsync(properties, searchText);
            return await searchedProperties;
        }
        
        public async Task<IQueryable<Property>> GetAllPropertiesByUserId(Guid userId)
        {
            var properties = await _propertyRepository.GetAllQueryableAsync();
            var filteredProperties = properties.Where(p => p.OwnerId == userId);
            return filteredProperties;
        }

        public async Task<Property> UpdateProperty(Property property)
        {
            var updatedProperty = _propertyRepository.Update(property);
            await _propertyRepository.SaveAsync();
            return updatedProperty;
        }

        public async Task<Property> DeleteProperty(Guid id)
        {
            var property = await _propertyRepository.FindByIdAsync(id);

            _propertyRepository.Delete(property);
            await _unitOfWork.SaveAsync();
            return property;
        }

    }
}
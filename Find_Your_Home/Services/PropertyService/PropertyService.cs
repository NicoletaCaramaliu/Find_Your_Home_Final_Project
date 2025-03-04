using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.UnitOfWork;

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
        
        public async Task<IEnumerable<Property>> GetAllProperties()
        {
            var properties = await _propertyRepository.GetAllAsync();
            return properties;
        }
        
        public async Task<IEnumerable<Property>> FilterProperties(FilterCriteria filterCriteria)
        {
            var properties = await _propertyRepository.GetAllQueryableAsync();
            var filteredProperties = await _propertyRepository.FilterPropertiesAsync(properties, filterCriteria);
            return filteredProperties;
        }
    }
}
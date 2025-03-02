using Find_Your_Home.Models.Properties;

namespace Find_Your_Home.Services.PropertyService
{
    public interface IPropertyService
    {
        Task<Property> CreateProperty(Property property);
    }
}
using Find_Your_Home.Models.Properties;

namespace Find_Your_Home.Services.PropertyImagesService
{
    public interface IPropertyImgService
    {
        Task<List<PropertyImage>> GetPropertyImages(Guid propertyId);
    }
}
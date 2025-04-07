using Find_Your_Home.Models.Properties;

namespace Find_Your_Home.Services.PropertyImagesService
{
    public interface IPropertyImgService
    {
        Task<IEnumerable<PropertyImage>> GetPropertyImages(Guid propertyId);
        Task AddImageToProperty(PropertyImage propertyImage);
        
        Task<List<PropertyImage>> GetFirstPropertyImages(List<Guid> propertyId);
        
        Task<PropertyImage> GetImageById(Guid id);
        Task DeleteImage(Guid id);
    }
}
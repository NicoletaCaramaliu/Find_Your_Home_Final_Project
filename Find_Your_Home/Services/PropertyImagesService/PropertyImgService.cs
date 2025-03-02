using Find_Your_Home.Models.Properties;
using Find_Your_Home.Repositories.PropertyImgRepository;

namespace Find_Your_Home.Services.PropertyImagesService
{
    public class PropertyImgService : IPropertyImgService
    {
        private readonly IPropertyImgRepository _propertyImgRepository;
        
        public PropertyImgService(IPropertyImgRepository propertyImgRepository)
        {
            _propertyImgRepository = propertyImgRepository;
        }
        
        public async Task<List<PropertyImage>> GetPropertyImages(Guid propertyId)
        {
            return await _propertyImgRepository.GetImages(propertyId);
        }
    }
}
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Repositories.PropertyImgRepository;
using Find_Your_Home.Repositories.UnitOfWork;

namespace Find_Your_Home.Services.PropertyImagesService
{
    public class PropertyImgService : IPropertyImgService
    {
        private readonly IPropertyImgRepository _propertyImgRepository;
        private readonly IUnitOfWork _unitOfWork;
        
        public PropertyImgService(IPropertyImgRepository propertyImgRepository, IUnitOfWork unitOfWork)
        {
            _propertyImgRepository = propertyImgRepository;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<IEnumerable<PropertyImage>> GetPropertyImages(Guid propertyId)
        {
            return await _propertyImgRepository.GetImages(propertyId);
        }
        
        public async Task AddImageToProperty(PropertyImage propertyImage)
        {
            await _propertyImgRepository.CreateAsync(propertyImage);
            await _unitOfWork.SaveAsync();
        }


        public async Task<List<PropertyImage>> GetFirstPropertyImages(List<Guid> propertyId)
        {
            return await _propertyImgRepository.GetFirstImages(propertyId);
        }

        public async Task<PropertyImage> GetImageById(Guid id)
        {
            return await _propertyImgRepository.GetByIdAsync(id);
        }

        public async Task DeleteImage(Guid id)
        {
            var image = await _propertyImgRepository.GetByIdAsync(id);
            
            await _propertyImgRepository.DeleteImageAsync(id); 
            await _unitOfWork.SaveAsync();
        }
    }
}
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.PropertyImgRepository
{
    public interface IPropertyImgRepository : IGenericRepository<PropertyImage>
    {
        Task<List<PropertyImage>> GetImages(Guid propertyId);
    }
}
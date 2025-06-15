using System.Linq.Expressions;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.PropertyImgRepository
{
    public interface IPropertyImgRepository : IGenericRepository<PropertyImage>
    {
        Task<IEnumerable<PropertyImage>> GetImages(Guid propertyId);
        
        Task<List<PropertyImage>> GetFirstImages(List<Guid> propertyId);
        
        Task<PropertyImage> GetByIdAsync(Guid id);
        
        Task DeleteImageAsync(Guid id);
        Task<bool> AnyAsync(Expression<Func<PropertyImage, bool>> predicate);
        Task UpdateImageOrderAsync(List<ImageOrderUpdate> updates);
    }
}
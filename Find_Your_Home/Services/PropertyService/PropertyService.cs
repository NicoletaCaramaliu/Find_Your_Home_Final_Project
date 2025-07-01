using AutoMapper;
using Find_Your_Home.Data;
using Find_Your_Home.Exceptions;
using Find_Your_Home.Helpers;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Data.UnitOfWork;
using Find_Your_Home.Services.PropertyImagesService;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Services.PropertyService
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IPropertyImgService _propertyImagesService;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _context;

        public PropertyService(IPropertyRepository propertyRepository, IUnitOfWork unitOfWork, IPropertyImgService propertyImagesService, IMapper mapper, ApplicationDbContext context)
        {
            _context = context;
            _mapper = mapper;
            _propertyRepository = propertyRepository;
            _unitOfWork = unitOfWork;
            _propertyImagesService = propertyImagesService;
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
        
        public async Task<IQueryable<Property>> GetAllAvailableProperties()
        {
            var properties = await _propertyRepository.GetAllQueryableAsync();
            var availableProperties = properties.Where(p => p.IsAvailable == true);
            return availableProperties;
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
            
            //get only properties that have isRented = false
            var availableProperties = paginatedProperties.Where(p => p.IsRented == false);
            
            /*var paginatedProperties = filteredProperties
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
            return (await paginatedProperties.ToListAsync(), totalCount);*/
            
            
            return (await availableProperties.ToListAsync(), totalCount);
        }


        public async Task<Property> GetPropertyByID(Guid id)
        {
            return await _propertyRepository.GetPropertyByIDAsync(id);
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
        
        
        public async Task<List<PropertyResponse>> MapPropertiesWithImagesAsync(List<Property> properties)
        {
            var propertyIds = properties.Select(p => p.Id).ToList();
            var propertyImages = await _propertyImagesService.GetFirstPropertyImages(propertyIds);

            var imageDict = propertyImages
                .GroupBy(img => img.PropertyId)
                .ToDictionary(g => g.Key, g => g.FirstOrDefault());

            var propertyDtos = properties.Select(property =>
            {
                var dto = _mapper.Map<PropertyResponse>(property);
                if (imageDict.TryGetValue(property.Id, out var image))
                {
                    dto.FirstImageUrl = image?.ImageUrl;
                }
                return dto;
            }).ToList();

            return propertyDtos;
        }
        
        public async Task<Property> DeletePropertyAndDependencies(Guid propertyId)
        {
            var property = await _propertyRepository
                .GetAllQueryable()
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == propertyId);

            if (property == null)
                throw new AppException("PROPERTY_NOT_FOUND");

            var images = await _context.PropertyImages
                .Where(img => img.PropertyId == propertyId)
                .ToListAsync();

            var favorites = await _context.Favorites
                .Where(f => f.PropertyId == propertyId)
                .ToListAsync();

            var bookings = await _context.Bookings
                .Where(b => b.PropertyId == propertyId)
                .ToListAsync();

            var slots = await _context.AvailabilitySlots
                .Where(s => s.PropertyId == propertyId)
                .ToListAsync();

            var rentals = await _context.Rentals
                .Where(r => r.PropertyId == propertyId)
                .ToListAsync();

            _context.PropertyImages.RemoveRange(images);
            _context.Favorites.RemoveRange(favorites);
            _context.Bookings.RemoveRange(bookings);
            _context.AvailabilitySlots.RemoveRange(slots);
            _context.Rentals.RemoveRange(rentals);


            var tracked = _context.ChangeTracker
                .Entries<Property>()
                .FirstOrDefault(e => e.Entity.Id == propertyId);

            if (tracked != null)
            {
                tracked.State = EntityState.Detached;
            }

            _propertyRepository.Delete(new Property { Id = propertyId });

            await _context.SaveChangesAsync();

            return property;
        }




    }
}
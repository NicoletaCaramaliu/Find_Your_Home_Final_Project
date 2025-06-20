﻿using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;

namespace Find_Your_Home.Services.PropertyImagesService
{
    public interface IPropertyImgService
    {
        Task<IEnumerable<PropertyImage>> GetPropertyImages(Guid propertyId);
        Task AddImageToProperty(PropertyImage propertyImage);
        
        Task<List<PropertyImage>> GetFirstPropertyImages(List<Guid> propertyId);
        
        Task<PropertyImage> GetImageById(Guid id);
        Task DeleteImage(Guid id);
        Task<bool> ImageHashExistsAsync(Guid propertyId, string hash);
        Task UpdateImageOrderAsync(List<ImageOrderUpdate> updates);

    }
}
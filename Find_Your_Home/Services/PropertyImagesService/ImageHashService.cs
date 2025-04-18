using System.Security.Cryptography;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace Find_Your_Home.Services.PropertyImagesService
{
    public class ImageHashService
    {
        public async Task<string> ComputeHashAsync(IFormFile image)
        {
            await using var imageStream = image.OpenReadStream();
            using var imageSharp = await Image.LoadAsync<Rgba32>(imageStream);

            using var ms = new MemoryStream();
            await imageSharp.SaveAsPngAsync(ms); 
            ms.Position = 0;

            using var sha256 = SHA256.Create();
            var hashBytes = await sha256.ComputeHashAsync(ms);

            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
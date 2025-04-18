using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.IO;
using System.Threading.Tasks;

public class ImageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;

    public ImageService(IConfiguration configuration)
    {
        var connectionString = configuration["AzureStorage:ConnectionString"];
        _blobServiceClient = new BlobServiceClient(connectionString);
        _containerName = configuration["AzureStorage:ContainerName"];
    }

    public async Task<string> SaveImageAsync(IFormFile file)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
        var blobClient = containerClient.GetBlobClient(uniqueFileName);

        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = file.ContentType,  // Setează tipul corect (ex: image/png, image/jpeg)
                CacheControl = "public, max-age=31536000" // Cache pentru performanță
            };

            await blobClient.UploadAsync(memoryStream, blobHttpHeaders);
        }

        return blobClient.Uri.ToString();
    }

}
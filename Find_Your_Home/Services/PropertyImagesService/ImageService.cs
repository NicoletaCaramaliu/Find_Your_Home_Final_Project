using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Find_Your_Home.Services.PropertyImagesService;

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

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        return blobClient.Uri.ToString();
    }
}
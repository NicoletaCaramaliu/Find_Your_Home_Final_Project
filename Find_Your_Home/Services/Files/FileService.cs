using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Find_Your_Home.Services.Files;

public class FileService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _imageContainer;
    private readonly string _documentContainer;

    public FileService(IConfiguration configuration)
    {
        _blobServiceClient = new BlobServiceClient(configuration["AzureStorage:ConnectionString"]);
        _imageContainer = configuration["AzureStorage:ImageContainer"];
        _documentContainer = configuration["AzureStorage:DocumentContainer"];
    }

    public async Task<string> SaveFileAsync(IFormFile file, bool isImage = true)
    {
        var containerName = isImage ? _imageContainer : _documentContainer;
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
        var blobClient = containerClient.GetBlobClient(uniqueFileName);

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        stream.Position = 0;

        var headers = new BlobHttpHeaders
        {
            ContentType = file.ContentType,
            CacheControl = "public, max-age=31536000"
        };

        await blobClient.UploadAsync(stream, headers);
        return blobClient.Uri.ToString();
    }
}

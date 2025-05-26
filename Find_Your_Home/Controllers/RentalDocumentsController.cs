using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalDocumentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public RentalDocumentsController(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        private async Task<bool> IsUserInRental(Guid rentalId, Guid userId)
        {
            var rental = await _context.Rentals.FindAsync(rentalId);
            return rental != null && (rental.OwnerId == userId || rental.RenterId == userId);
        }

        [HttpGet("{rentalId}"), Authorize]
        public async Task<IActionResult> GetDocuments(Guid rentalId)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId)) return Forbid();

            var docs = await _context.RentalDocuments.Where(d => d.RentalId == rentalId).ToListAsync();
            return Ok(docs);
        }

        [HttpPost("upload/{rentalId}"), Authorize]
        public async Task<IActionResult> UploadDocuments(Guid rentalId, [FromForm] IFormFileCollection files)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId)) return Forbid();

            var uploadDir = Path.Combine("Uploads", "RentalDocuments");
            Directory.CreateDirectory(uploadDir);

            foreach (var file in files)
            {
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadDir, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                var doc = new RentalDocument
                {
                    Id = Guid.NewGuid(),
                    RentalId = rentalId,
                    FileName = file.FileName,
                    FilePath = filePath,
                    UploadedByUserId = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.RentalDocuments.Add(doc);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("file/{id}"), Authorize]
        public async Task<IActionResult> Download(Guid id)
        {
            var doc = await _context.RentalDocuments.FindAsync(id);
            if (doc == null) return NotFound();

            var userId = _userService.GetMyId();
            if (!await IsUserInRental(doc.RentalId, userId)) return Forbid();

            if (!System.IO.File.Exists(doc.FilePath))
                return NotFound("Fișierul nu există pe disc.");

            var stream = new FileStream(doc.FilePath, FileMode.Open, FileAccess.Read);

            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(doc.FileName, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            return File(stream, contentType, doc.FileName);
        }

    }
}
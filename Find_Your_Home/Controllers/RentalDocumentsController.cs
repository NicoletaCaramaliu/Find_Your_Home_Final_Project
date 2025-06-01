using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Services.Files;
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
        private readonly FileService _fileService;  

        public RentalDocumentsController(ApplicationDbContext context, IUserService userService, FileService fileService)
        {
            _context = context;
            _userService = userService;
            _fileService = fileService;
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

            foreach (var file in files)
            {
                var fileUrl = await _fileService.SaveFileAsync(file, isImage: false);

                var doc = new RentalDocument
                {
                    Id = Guid.NewGuid(),
                    RentalId = rentalId,
                    FileName = file.FileName,
                    FilePath = fileUrl, 
                    UploadedByUserId = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.RentalDocuments.Add(doc);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Documents saved successfully." });
        }

        [HttpGet("file/{id}"), Authorize]
        public async Task<IActionResult> Download(Guid id)
        {
            var doc = await _context.RentalDocuments.FindAsync(id);
            if (doc == null) return NotFound();

            var userId = _userService.GetMyId();
            if (!await IsUserInRental(doc.RentalId, userId)) return Forbid();

            return Redirect(doc.FilePath);
        }
    }
    
}
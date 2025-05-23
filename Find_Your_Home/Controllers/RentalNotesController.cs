using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Models.Rentals.DTO;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalNotesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public RentalNotesController(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        private async Task<bool> IsUserInRental(Guid rentalId, Guid userId)
        {
            var rental = await _context.Rentals.FindAsync(rentalId);
            return rental != null && (rental.OwnerId == userId || rental.RenterId == userId);
        }

        [HttpGet("{rentalId}")]
        public async Task<IActionResult> GetNote(Guid rentalId)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId)) return Forbid();

            var note = await _context.RentalNotes.FirstOrDefaultAsync(n => n.RentalId == rentalId);
            return Ok(note?.Content ?? "");
        }

        [HttpPost("{rentalId}")]
        public async Task<IActionResult> SaveNote(Guid rentalId, [FromBody] NoteDto dto)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId)) return Forbid();

            var note = await _context.RentalNotes.FirstOrDefaultAsync(n => n.RentalId == rentalId);
            if (note == null)
            {
                note = new RentalNote
                {
                    Id = Guid.NewGuid(),
                    RentalId = rentalId,
                    Content = dto.Content,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.RentalNotes.Add(note);
            }
            else
            {
                note.Content = dto.Content;
                note.UpdatedAt = DateTime.UtcNow;
                _context.RentalNotes.Update(note);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }

}
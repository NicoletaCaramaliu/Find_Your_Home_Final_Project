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
    public class RentalTasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public RentalTasksController(ApplicationDbContext context, IUserService userService)
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
        public async Task<IActionResult> GetTasks(Guid rentalId)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId)) return Forbid();

            var tasks = await _context.RentalTasks.Where(t => t.RentalId == rentalId).ToListAsync();
            return Ok(tasks);
        }

        [HttpPost("toggle/{taskId}")]
        public async Task<IActionResult> ToggleTask(Guid taskId)
        {
            var userId = _userService.GetMyId();
            var task = await _context.RentalTasks.FindAsync(taskId);
            if (task == null || !await IsUserInRental(task.RentalId, userId)) return Forbid();

            task.Completed = !task.Completed;
            _context.RentalTasks.Update(task);
            await _context.SaveChangesAsync();

            return Ok();
        }
        
        [HttpPost("{rentalId}")]
        public async Task<IActionResult> AddTask(Guid rentalId, [FromBody] TaskDto dto)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId)) return Forbid();

            var task = new RentalTask
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Completed = false,
                RentalId = rentalId
            };

            _context.RentalTasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

    }
}
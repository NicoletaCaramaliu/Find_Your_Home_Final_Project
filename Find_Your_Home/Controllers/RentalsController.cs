using AutoMapper;
using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Models.Rentals.DTO;
using Find_Your_Home.Services.RentalService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalsController : ControllerBase
    {
        private readonly IRentalService _rentalService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        
        public RentalsController(IRentalService rentalService, IUserService userService, IMapper mapper, ApplicationDbContext context)
        {
            _context = context;
            _rentalService = rentalService;
            _userService = userService;
            _mapper = mapper;
        }
        
        [HttpPost("createRental"), Authorize]
        public async Task<ActionResult<RentalResponse>> CreateRental([FromBody] RentalRequest rentalRequest)
        {
            var renterId = _userService.GetMyId();
            var rental = _mapper.Map<Rental>(rentalRequest);
            rental.RenterId = renterId;

            var newRental = await _rentalService.CreateRental(rental);

            var rentalInfo = new RentalInfo
            {
                Id = Guid.NewGuid(),
                RentalId = newRental.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.RentalInfos.Add(rentalInfo);

            var rentalNote = new RentalNote
            {
                Id = Guid.NewGuid(),
                RentalId = newRental.Id,
                Content = "", 
                UpdatedAt = DateTime.UtcNow
            };
            _context.RentalNotes.Add(rentalNote);

            var initialTask = new RentalTask
            {
                Id = Guid.NewGuid(),
                RentalId = newRental.Id,
                Title = "Primul task - completează detaliile",
                Completed = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.RentalTasks.Add(initialTask);

            await _context.SaveChangesAsync();

            var newRentalResponse = _mapper.Map<RentalResponse>(newRental);
            return Ok(newRentalResponse);
        }

        
        [HttpGet("getUserRentals/{userId}")]
        public async Task<ActionResult<List<RentalResponse>>> GetUserRentals()
        {
            var userId = _userService.GetMyId();
            var rentals = await _rentalService.GetRentalsByUserId(userId);
            var rentalResponse = _mapper.Map<List<RentalResponse>>(rentals); 
            return Ok(rentalResponse);
        }
        
        [HttpPost("endRental/{rentalId}"), Authorize]
        public async Task<IActionResult> EndRental(Guid rentalId)
        {
            var userId = _userService.GetMyId();
            await _rentalService.EndRental(rentalId, userId);
            
            return Ok(new { message = "Rental ended successfully." });
        }

        [HttpGet("active/renter"), Authorize]
        public async Task<IActionResult> GetActiveRentalByRenter()
        {
            var userId = _userService.GetMyId();
            var rental = await _rentalService.GetActiveRentalByRenterId(userId);

            var rentalResponse = _mapper.Map<RentalResponse>(rental);
            return Ok(rentalResponse);
        }

        [HttpGet("active/owner"), Authorize]
        public async Task<IActionResult> GetActiveRentalsByOwner()
        {
            var userId = _userService.GetMyId();
            var rental = await _rentalService.GetActiveRentalsByOwnerId(userId);

            var rentalResponse = _mapper.Map<List<RentalResponse>>(rental);
            return Ok(rentalResponse);
        }
        
        [HttpGet("{rentalId}"), Authorize]
        public async Task<ActionResult<RentalResponse>> GetRentalById(Guid rentalId)
        {
            var userId = _userService.GetMyId();
            var rental = await _rentalService.GetRentalById(rentalId);

            if (rental == null || (rental.OwnerId != userId && rental.RenterId != userId))
                return Forbid();

            var rentalResponse = _mapper.Map<RentalResponse>(rental);
            return Ok(rentalResponse);
        }

    }
}
using AutoMapper;
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
        
        public RentalsController(IRentalService rentalService, IUserService userService, IMapper mapper)
        {
            _rentalService = rentalService;
            _userService = userService;
            _mapper = mapper;
        }
        
        [HttpPost("createRental"), Authorize]
        public async Task<ActionResult<RentalResponse>>  CreateRental([FromBody] RentalRequest rentalRequest)
        {
            var renterId = _userService.GetMyId();
            var rental = _mapper.Map<Rental>(rentalRequest);
            rental.RenterId = renterId;
            var newRental = await _rentalService.CreateRental(rental);
            var newRentalResponse = _mapper.Map<RentalResponse>(newRental);
            return Ok(newRentalResponse);
        }
        
    }
}
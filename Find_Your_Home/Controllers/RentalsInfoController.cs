using AutoMapper;
using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Models.Rentals.DTO;
using Find_Your_Home.Services.RentalService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]"), Authorize]
    public class RentalsInfoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public RentalsInfoController(ApplicationDbContext context, IUserService userService, IMapper mapper)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
        }
        
        private async Task<bool> IsUserInRental(Guid rentalId, Guid userId)
        {
            var rental = await _context.Rentals.FindAsync(rentalId);
            return rental != null && (rental.OwnerId == userId || rental.RenterId == userId);
        }
        
        [HttpGet("getRentalInfo/{rentalId}")]
        public async Task<IActionResult> GetRentalInfo(Guid rentalId)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId))
                return Forbid("Nu aveți permisiunea să accesați informațiile acestei închirieri.");
            
            var rentalInfo = await _context.RentalInfos
                .FirstOrDefaultAsync(ri => ri.RentalId == rentalId);

            if (rentalInfo == null)
                return NotFound("Informațiile pentru această închiriere nu există.");
            
            var rentalResponse = _mapper.Map<InfoDto>(rentalInfo);
            return Ok(rentalResponse);
        }
        
        [HttpPost("create")]
        public async Task<IActionResult> CreateRentalInfo([FromBody] RentalInfo rentalInfo)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalInfo.RentalId, userId))
                return Forbid("Nu aveți permisiunea să accesați informațiile acestei închirieri.");
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            rentalInfo.Id = Guid.NewGuid();
            _context.RentalInfos.Add(rentalInfo);
            await _context.SaveChangesAsync();

            return Ok(rentalInfo);
        }
        
        [HttpPut("update/{rentalId}")]
        public async Task<IActionResult> UpdateRentalInfo(Guid rentalId, [FromBody] InfoDto updatedInfo)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId))
                return Forbid("Nu aveți permisiunea să accesați informațiile acestei închirieri.");
            
            var existingInfo = await _context.RentalInfos.FirstOrDefaultAsync(ri => ri.RentalId == rentalId);
            if (existingInfo == null)
                return NotFound("Informațiile pentru această închiriere nu există.");
            
            existingInfo.RentPaymentDate = updatedInfo.RentPaymentDate;
            existingInfo.ElectricityPaymentDate = updatedInfo.ElectricityPaymentDate;
            existingInfo.WaterPaymentDate = updatedInfo.WaterPaymentDate;
            existingInfo.GasPaymentDate = updatedInfo.GasPaymentDate;
            existingInfo.InternetPaymentDate = updatedInfo.InternetPaymentDate;
            existingInfo.LandlordPhone = updatedInfo.LandlordPhone;
            existingInfo.PlumberPhone = updatedInfo.PlumberPhone;
            existingInfo.ElectricianPhone = updatedInfo.ElectricianPhone;
            existingInfo.GasServicePhone = updatedInfo.GasServicePhone;
            existingInfo.InternetProviderPhone = updatedInfo.InternetProviderPhone;
            existingInfo.ContractSigned = updatedInfo.ContractSigned;
            existingInfo.ContractStartDate = updatedInfo.ContractStartDate;
            existingInfo.ContractEndDate = updatedInfo.ContractEndDate;
            existingInfo.RentAmount = updatedInfo.RentAmount;
            existingInfo.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(existingInfo);
        }

        [HttpDelete("delete/{rentalId}")]
        public async Task<IActionResult> DeleteRentalInfo(Guid rentalId)
        {
            var existingInfo = await _context.RentalInfos.FirstOrDefaultAsync(ri => ri.RentalId == rentalId);
            if (existingInfo == null)
                return NotFound("Informațiile pentru această închiriere nu există.");

            _context.RentalInfos.Remove(existingInfo);
            await _context.SaveChangesAsync();
            return Ok("Informațiile au fost șterse cu succes.");
        }
        
        [HttpPut("updateField/{rentalId}")]
        public async Task<IActionResult> UpdateRentalField(Guid rentalId, [FromQuery] string fieldName, [FromQuery] DateTime value)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId))
                return Forbid("Nu aveți permisiunea să modificați această închiriere.");

            var existingInfo = await _context.RentalInfos.FirstOrDefaultAsync(ri => ri.RentalId == rentalId);
            if (existingInfo == null)
                return NotFound("Informațiile pentru această închiriere nu există.");

            switch (fieldName)
            {
                case "RentPaymentDate":
                    existingInfo.RentPaymentDate = value;
                    break;
                case "ElectricityPaymentDate":
                    existingInfo.ElectricityPaymentDate = value;
                    break;
                case "WaterPaymentDate":
                    existingInfo.WaterPaymentDate = value;
                    break;
                case "GasPaymentDate":
                    existingInfo.GasPaymentDate = value;
                    break;
                case "InternetPaymentDate":
                    existingInfo.InternetPaymentDate = value;
                    break;
                case "ContractStartDate":
                    existingInfo.ContractStartDate = value;
                    break;
                case "ContractEndDate":
                    existingInfo.ContractEndDate = value;
                    break;
                default:
                    return BadRequest("Câmp invalid.");
            }

            existingInfo.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok("Câmp actualizat cu succes!");
        }
        
    }
}
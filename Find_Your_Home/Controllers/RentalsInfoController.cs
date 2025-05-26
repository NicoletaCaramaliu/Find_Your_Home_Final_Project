using AutoMapper;
using Find_Your_Home.Data;
using Find_Your_Home.Models.Rentals;
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

        public RentalsInfoController(ApplicationDbContext context, IUserService userService)
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
        public async Task<IActionResult> GetRentalInfo(Guid rentalId)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId))
                return Forbid("Nu aveți permisiunea să accesați informațiile acestei închirieri.");
            
            var rentalInfo = await _context.RentalInfos
                .FirstOrDefaultAsync(ri => ri.RentalId == rentalId);

            if (rentalInfo == null)
                return NotFound("Informațiile pentru această închiriere nu există.");

            return Ok(rentalInfo);
        }
        
        [HttpPost]
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
        
        [HttpPut("{rentalId}")]
        public async Task<IActionResult> UpdateRentalInfo(Guid rentalId, [FromBody] RentalInfo updatedInfo)
        {
            var userId = _userService.GetMyId();
            if (!await IsUserInRental(rentalId, userId))
                return Forbid("Nu aveți permisiunea să accesați informațiile acestei închirieri.");
            
            var existingInfo = await _context.RentalInfos.FirstOrDefaultAsync(ri => ri.RentalId == rentalId);
            if (existingInfo == null)
                return NotFound("Informațiile pentru această închiriere nu există.");

            existingInfo.RentPaymentDay = updatedInfo.RentPaymentDay;
            existingInfo.ElectricityPaymentDay = updatedInfo.ElectricityPaymentDay;
            existingInfo.WaterPaymentDay = updatedInfo.WaterPaymentDay;
            existingInfo.GasPaymentDay = updatedInfo.GasPaymentDay;
            existingInfo.InternetPaymentDay = updatedInfo.InternetPaymentDay;
            existingInfo.LandlordPhone = updatedInfo.LandlordPhone;
            existingInfo.PlumberPhone = updatedInfo.PlumberPhone;
            existingInfo.ElectricianPhone = updatedInfo.ElectricianPhone;
            existingInfo.GasServicePhone = updatedInfo.GasServicePhone;
            existingInfo.InternetProviderPhone = updatedInfo.InternetProviderPhone;
            existingInfo.EmergencyContact = updatedInfo.EmergencyContact;
            existingInfo.ContractSigned = updatedInfo.ContractSigned;
            existingInfo.ContractStartDate = updatedInfo.ContractStartDate;
            existingInfo.ContractEndDate = updatedInfo.ContractEndDate;
            existingInfo.RentAmount = updatedInfo.RentAmount;

            await _context.SaveChangesAsync();
            return Ok(existingInfo);
        }

        [HttpDelete("{rentalId}")]
        public async Task<IActionResult> DeleteRentalInfo(Guid rentalId)
        {
            var existingInfo = await _context.RentalInfos.FirstOrDefaultAsync(ri => ri.RentalId == rentalId);
            if (existingInfo == null)
                return NotFound("Informațiile pentru această închiriere nu există.");

            _context.RentalInfos.Remove(existingInfo);
            await _context.SaveChangesAsync();
            return Ok("Informațiile au fost șterse cu succes.");
        }
    }
}
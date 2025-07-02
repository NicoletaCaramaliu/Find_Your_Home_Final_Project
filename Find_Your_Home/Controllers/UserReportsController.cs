using Find_Your_Home.Data;
using Find_Your_Home.Models.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("reportUser")]
        public async Task<IActionResult> ReportUser([FromBody] UserReport report)
        {
            if (report.ReporterUserId == report.ReportedUserId)
                return BadRequest("Nu poți raporta propriul cont.");

            var alreadyReported = await _context.UserReports.AnyAsync(r =>
                r.ReporterUserId == report.ReporterUserId &&
                r.ReportedUserId == report.ReportedUserId);

            if (alreadyReported)
                return BadRequest("Ai raportat deja acest utilizator.");

            report.Id = Guid.NewGuid();
            report.CreatedAt = DateTime.UtcNow;

            _context.UserReports.Add(report);
            await _context.SaveChangesAsync();

            return Ok("Utilizator raportat cu succes.");
        }

        [HttpGet("hasReported")]
        public async Task<IActionResult> HasReported([FromQuery] Guid reporterId, [FromQuery] Guid reportedId)
        {
            var hasReported = await _context.UserReports.AnyAsync(r =>
                r.ReporterUserId == reporterId && r.ReportedUserId == reportedId);

            return Ok(hasReported);
        }
        
        [HttpGet("reportsCount")]
        public async Task<IActionResult> GetReportsCountForAllUsers()
        {
            var reportCounts = await _context.UserReports
                .GroupBy(r => r.ReportedUserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return Ok(reportCounts);
        }
    }
}
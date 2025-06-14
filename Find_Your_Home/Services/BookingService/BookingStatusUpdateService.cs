using Find_Your_Home.Data;
using Find_Your_Home.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Services.BookingService
{
    public class BookingStatusUpdateService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<BookingStatusUpdateService> _logger;

        public BookingStatusUpdateService(IServiceScopeFactory scopeFactory, ILogger<BookingStatusUpdateService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("BookingStatusUpdateService started at {Time}", DateTime.UtcNow);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var now = DateTime.UtcNow;

                    var pendingToReject = (await db.Bookings
                            .Where(b => b.Status == BookingStatus.Pending)
                            .ToListAsync())
                        .Where(b => b.SlotDate.Add(b.EndTime) < now)
                        .ToList();

                    foreach (var booking in pendingToReject)
                        booking.Status = BookingStatus.Rejected;

                    var confirmedToComplete = (await db.Bookings
                            .Where(b => b.Status == BookingStatus.Confirmed)
                            .ToListAsync())
                        .Where(b => b.SlotDate.Add(b.EndTime) < now.AddHours(-24))
                        .ToList();

                    foreach (var booking in confirmedToComplete)
                        booking.Status = BookingStatus.Completed;

                    if (pendingToReject.Any() || confirmedToComplete.Any())
                    {
                        await db.SaveChangesAsync();
                        _logger.LogInformation("Booking statuses updated.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to update booking statuses.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); 
            }
        }
    }
}

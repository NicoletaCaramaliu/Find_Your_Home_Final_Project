using Find_Your_Home.Data;
using Find_Your_Home.Services.AuthService;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Services.RentalService
{
    public class PaymentReminderJob : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public PaymentReminderJob(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    var now = DateTime.UtcNow;
                    var targetTime = now.AddHours(12);

                    var upcomingPayments = await dbContext.RentalInfos
                        .Include(r => r.Rental)
                        .ThenInclude(r => r.Renter)
                        .Where(info =>
                            (info.RentPaymentDate.HasValue && info.RentPaymentDate.Value >= now && info.RentPaymentDate.Value <= targetTime && !info.RentPaymentReminderSent) ||
                            (info.ElectricityPaymentDate.HasValue && info.ElectricityPaymentDate.Value >= now && info.ElectricityPaymentDate.Value <= targetTime && !info.ElectricityPaymentReminderSent) ||
                            (info.WaterPaymentDate.HasValue && info.WaterPaymentDate.Value >= now && info.WaterPaymentDate.Value <= targetTime && !info.WaterPaymentReminderSent) ||
                            (info.GasPaymentDate.HasValue && info.GasPaymentDate.Value >= now && info.GasPaymentDate.Value <= targetTime && !info.GasPaymentReminderSent) ||
                            (info.InternetPaymentDate.HasValue && info.InternetPaymentDate.Value >= now && info.InternetPaymentDate.Value <= targetTime && !info.InternetPaymentReminderSent)
                        )
                        .ToListAsync(stoppingToken);

                    foreach (var payment in upcomingPayments)
                    {
                        var toEmail = payment.Rental?.Renter?.Email;
                        if (string.IsNullOrEmpty(toEmail)) continue; 

                        if (payment.RentPaymentDate.HasValue && payment.RentPaymentDate.Value >= now && payment.RentPaymentDate.Value <= targetTime && !payment.RentPaymentReminderSent)
                        {
                            await emailService.SendPaymentReminderEmailAsync(toEmail, "Chirie", payment.RentPaymentDate.Value);
                            payment.RentPaymentReminderSent = true;
                        }

                        if (payment.ElectricityPaymentDate.HasValue && payment.ElectricityPaymentDate.Value >= now && payment.ElectricityPaymentDate.Value <= targetTime && !payment.ElectricityPaymentReminderSent)
                        {
                            await emailService.SendPaymentReminderEmailAsync(toEmail, "Electricitate", payment.ElectricityPaymentDate.Value);
                            payment.ElectricityPaymentReminderSent = true;
                        }

                        if (payment.WaterPaymentDate.HasValue && payment.WaterPaymentDate.Value >= now && payment.WaterPaymentDate.Value <= targetTime && !payment.WaterPaymentReminderSent)
                        {
                            await emailService.SendPaymentReminderEmailAsync(toEmail, "Apă", payment.WaterPaymentDate.Value);
                            payment.WaterPaymentReminderSent = true;
                        }

                        if (payment.GasPaymentDate.HasValue && payment.GasPaymentDate.Value >= now && payment.GasPaymentDate.Value <= targetTime && !payment.GasPaymentReminderSent)
                        {
                            await emailService.SendPaymentReminderEmailAsync(toEmail, "Gaz", payment.GasPaymentDate.Value);
                            payment.GasPaymentReminderSent = true;
                        }

                        if (payment.InternetPaymentDate.HasValue && payment.InternetPaymentDate.Value >= now && payment.InternetPaymentDate.Value <= targetTime && !payment.InternetPaymentReminderSent)
                        {
                            await emailService.SendPaymentReminderEmailAsync(toEmail, "Internet", payment.InternetPaymentDate.Value);
                            payment.InternetPaymentReminderSent = true;
                        }
                    }

                    if (upcomingPayments.Any())
                    {
                        await dbContext.SaveChangesAsync(stoppingToken);
                    }
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}

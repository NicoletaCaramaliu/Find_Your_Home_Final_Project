namespace Find_Your_Home.Services.AuthService
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string toEmail, string resetLink);
        Task SendRentalConfirmationEmailAsync(string toEmail, string ownerName, string propertyName, string renterName, DateTime startDate);
        Task SendPaymentReminderEmailAsync(string toEmail, string paymentType, DateTime paymentDate);
    }
}
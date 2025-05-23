using System.Net;
using System.Net.Mail;

namespace Find_Your_Home.Services.AuthService;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string token)
    {
        var fromEmail = _config["EmailSettings:From"];

        var frontendUrl = _config["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
        var resetLink = $"{frontendUrl}/reset-password?token={token}";

        var smtpClient = new SmtpClient(_config["EmailSettings:Smtp"])
        {
            Port = int.Parse(_config["EmailSettings:Port"]!),
            Credentials = new NetworkCredential(
                _config["EmailSettings:Username"],
                _config["EmailSettings:Password"]
            ),
            EnableSsl = true,
        };

        var mailMessage = new MailMessage(fromEmail, toEmail)
        {
            Subject = "Resetare parolă",
            Body = $"Click pe link pentru a reseta parola: {resetLink}",
            IsBodyHtml = false,
        };

        await smtpClient.SendMailAsync(mailMessage);
    }
    
    public async Task SendRentalConfirmationEmailAsync(string toEmail, string ownerName, string propertyName, string renterName, DateTime startDate)
    {
        var fromEmail = _config["EmailSettings:From"];

        var smtpClient = new SmtpClient(_config["EmailSettings:Smtp"])
        {
            Port = int.Parse(_config["EmailSettings:Port"]!),
            Credentials = new NetworkCredential(
                _config["EmailSettings:Username"],
                _config["EmailSettings:Password"]
            ),
            EnableSsl = true,
        };

        var subject = "Proprietatea ta a fost închiriată!";
        var body = $@"
            Salut {ownerName},

            Proprietatea ta „{propertyName}” a fost închiriată de utilizatorul {renterName} începând cu data de {startDate:dd MMMM yyyy}.

            Poți vizualiza detaliile în platforma Find Your Home.

            Toate cele bune,
            Echipa Find Your Home";

        var mailMessage = new MailMessage(fromEmail, toEmail)
        {
            Subject = subject,
            Body = body,
            IsBodyHtml = false,
        };

        await smtpClient.SendMailAsync(mailMessage);
    }


}
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

}
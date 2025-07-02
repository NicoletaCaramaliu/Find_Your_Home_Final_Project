using Find_Your_Home.Models.Notifications.DTO;
using Find_Your_Home.Repositories.NotificationsRepository;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationRepository notificationRepository, IUserService userService, INotificationService notificationService)
        {
            _notificationService = notificationService;
            _notificationRepository = notificationRepository;
            _userService = userService;
        }

        [HttpGet("GetUserNotifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = _userService.GetMyId();
            var notifications = await _notificationRepository.GetUserNotificationsAsync(userId);

            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Type = n.Type,
                Title = n.Title,
                Message = n.Message,
                Timestamp = n.Timestamp,
                IsRead = n.IsRead,
                SenderName = n.Sender != null ? $"{n.Sender.Username}" : "System",
                SenderProfilePictureUrl = n.Sender?.ProfilePicture
            }).ToList();

            return Ok(notificationDtos);
        }

        [HttpPatch("mark-as-read", Name = "MarkNotificationsAsRead")]
        public async Task<IActionResult> MarkAsRead()
        {
            var userId = _userService.GetMyId();
            await _notificationRepository.MarkNotificationsAsReadAsync(userId);
            return NoContent();
        }
        
        [HttpPatch("mark-as-read/{notificationId}", Name = "MarkNotificationAsRead")]
        public async Task<IActionResult> MarkAsReadSingle(Guid notificationId)
        {
            await _notificationService.MarkNotificationAsReadByNotifId(notificationId);
            return NoContent();
        }

    }
}
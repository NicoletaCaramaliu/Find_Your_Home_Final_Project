using Find_Your_Home.Hubs;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Repositories.NotificationsRepository;
using Microsoft.AspNetCore.SignalR;

namespace Find_Your_Home.Services.NotificationsService
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(IHubContext<NotificationHub> hubContext, INotificationRepository notificationRepository)
        {
            _hubContext = hubContext;
            _notificationRepository = notificationRepository;
        }

        public async Task SendNotificationAsync(string userId, NotificationMessage notificationMessage)
        {
            var notification = new Notification
            {
                UserId = Guid.Parse(userId),
                SenderId = notificationMessage.SenderId, 
                Type = notificationMessage.Type,
                Title = notificationMessage.Title,
                Message = notificationMessage.Message,
                Timestamp = notificationMessage.Timestamp,
                IsRead = false
            };

            await _notificationRepository.CreateNotificationAsync(notification);

            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", notificationMessage);
        }
    }
}
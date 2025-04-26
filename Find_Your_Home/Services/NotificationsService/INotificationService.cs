using Find_Your_Home.Models.Notifications;

namespace Find_Your_Home.Services.NotificationsService
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string userId, NotificationMessage notification);
        Task MarkNotificationAsReadByNotifId(Guid notificationId);
    }
}
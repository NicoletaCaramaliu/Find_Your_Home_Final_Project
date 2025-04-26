using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.NotificationsRepository
{
    public interface INotificationRepository : IGenericRepository<Notification>
    {
        Task<List<Notification>> GetUserNotificationsAsync(Guid userId);
        Task MarkNotificationsAsReadAsync(Guid userId);
        Task CreateNotificationAsync(Notification notification);
        
    }
}
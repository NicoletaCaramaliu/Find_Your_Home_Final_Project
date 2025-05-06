using Find_Your_Home.Repositories.AvailabilitySlotRepository;
using Find_Your_Home.Repositories.BookingRepository;
using Find_Your_Home.Repositories.ConversationRepository;
using Find_Your_Home.Repositories.FavoriteRepository;
using Find_Your_Home.Repositories.MessageRepository;
using Find_Your_Home.Repositories.PropertyImgRepository;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.UnitOfWork;
using Find_Your_Home.Repositories.UserRepository;
using Find_Your_Home.Services.AuthService;
using Find_Your_Home.Services.AvailabilitySlotService;
using Find_Your_Home.Services.BookingService;
using Find_Your_Home.Services.ConversationService;
using Find_Your_Home.Services.FavoriteService;
using Find_Your_Home.Services.MessageService;
using Find_Your_Home.Services.PropertyImagesService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.UserService;

namespace Find_Your_Home.Helpers.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            //services.AddTransient<IRepository, Repository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IPropertyRepository, PropertyRepository>();
            services.AddTransient<IPropertyImgRepository, PropertyImgRepository>();
            services.AddTransient<IFavoriteRepository, Find_Your_Home.Repositories.FavoriteRepository.FavoriteRepository>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddTransient<IAvailabilitySlotRepository, AvailabilitySlotRepository>();
            services.AddTransient<IBookingRepository, BookingRepository>();
            services.AddTransient<IConversationRepository, ConversationRepository>();
            services.AddTransient<IMessageRepository, MessageRepository>();
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            //services.AddTransient<IService,Service>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IPropertyImgService, PropertyImgService>();
            services.AddTransient<IPropertyService, PropertyService>();
            services.AddTransient<IFavoriteService, FavoriteService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IAvailabilitySlotService, AvailabilitySlotService>();
            services.AddTransient<IBookingService, BookingService>();
            services.AddTransient<IConversationService, ConversationService>();
            services.AddTransient<IMessageService, MessageService>();
            return services;
        }
    }
    
}

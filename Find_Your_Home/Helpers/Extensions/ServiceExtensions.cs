
using Find_Your_Home.Repositories.FavoriteRepository;
using Find_Your_Home.Repositories.PropertyImgRepository;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.UnitOfWork;
using Find_Your_Home.Repositories.UserRepository;
using Find_Your_Home.Services.AuthService;
using Find_Your_Home.Services.FavoriteService;
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
            return services;
        }
    }

    public class FavoriteRepository
    {
    }
}

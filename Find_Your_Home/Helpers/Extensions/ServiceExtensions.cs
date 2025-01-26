using Find_Your_Home.Repositories.UserRepository;
using Find_Your_Home.Services.UserService;
using Find_Your_Home.Services.UserService;

namespace Find_Your_Home.Helpers.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            //services.AddTransient<IRepository, Repository>();
            services.AddTransient<IUserRepository, UserRepository>();
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            //services.AddTransient<IService,Service>();
            services.AddTransient<IUserService, UserService>();
            return services;
        }
    }
}

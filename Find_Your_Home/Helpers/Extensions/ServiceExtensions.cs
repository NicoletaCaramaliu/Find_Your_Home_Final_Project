using Microsoft.Extensions.DependencyInjection;

namespace Find_Your_Home.Helpers.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            //services.AddTransient<IRepository, Repository>();
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            //services.AddTransient<IService,Service>();
            return services;
        }
    }
}

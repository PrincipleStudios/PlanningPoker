namespace PrincipleStudios.PlanningPoker.Environment;

public static class EnvironmentServiceExtensions
{
    public static void AddEnvironment(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<BuildOptions>(configuration);
    }
}

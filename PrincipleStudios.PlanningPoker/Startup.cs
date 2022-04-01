using PrincipleStudios.PlanningPoker.Environment;

namespace PrincipleStudios.PlanningPoker;

public class Startup
{
    private readonly IConfiguration configuration;

    public Startup(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddOpenApiPlanningPokerApi<EnvironmentController>();

        services.AddEnvironment(configuration.GetSection("Build"));
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseDefaultFiles();

        app.UseStaticFiles();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

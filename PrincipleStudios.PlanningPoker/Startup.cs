using PrincipleStudios.PlanningPoker.Environment;

namespace PrincipleStudios.PlanningPoker;

public class Startup
{
    private readonly IWebHostEnvironment env;
    private readonly IConfiguration configuration;

    public Startup(IConfiguration configuration, IWebHostEnvironment env)
    {
        this.configuration = configuration;
        this.env = env;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddOpenApiPlanningPokerApi<EnvironmentController>();

        services.AddEnvironment(configuration.GetSection("Build"));
    }

    public void Configure(IApplicationBuilder app)
    {
        if (!env.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }

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

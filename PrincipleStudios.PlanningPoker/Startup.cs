using PrincipleStudios.PlanningPoker.Chat;
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
         
        var signalr = services.AddSignalR();
        if (!string.IsNullOrEmpty(configuration["Azure:SignalR:ConnectionString"]))
            signalr.AddAzureSignalR(configuration["Azure:SignalR:ConnectionString"]);
            
        services.AddReverseProxy().LoadFromConfig(configuration.GetSection("ReverseProxy"));
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
            endpoints.MapHub<ChatHub>("/api/chat");
            endpoints.MapControllers();
            endpoints.MapReverseProxy(); 
        });
    }
}

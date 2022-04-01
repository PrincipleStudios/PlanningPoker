using Microsoft.Extensions.Options;

namespace PrincipleStudios.PlanningPoker.Environment;

public class EnvironmentController : Api.EnvironmentControllerBase
{
    private readonly IOptionsMonitor<BuildOptions> buildOptions;
    public EnvironmentController(IOptionsMonitor<BuildOptions> buildOptions)
    {
        this.buildOptions = buildOptions;
    }

    protected override Task<GetInfoActionResult> GetInfo()
    {
        return Task.FromResult(GetInfoActionResult.Ok(new (
            GitHash: buildOptions.CurrentValue.GitHash
        )));
    }
}

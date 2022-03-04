using PrincipleStudios.PlanningPoker.Testing;
using Xunit;

namespace PrincipleStudios.PlanningPoker;

public class ApiShould : IClassFixture<ApiApplicationFactory>
{
    private readonly ApiApplicationFactory factory;

    public ApiShould(ApiApplicationFactory factory)
    {
        this.factory = factory;
    }

    [Fact]
    public async Task StartWithoutErrors()
    {
        // Arrange
        var client = factory.CreateClient();

        // Act
        using var response = await client.GetAsync(new Uri("/", UriKind.Relative)).ConfigureAwait(false);

        // Assert
        // Not asserting status code because we aren't testing a specific API call
        Assert.NotNull(response);
    }
}
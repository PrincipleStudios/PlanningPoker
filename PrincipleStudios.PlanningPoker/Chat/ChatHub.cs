using Microsoft.AspNetCore.SignalR;

namespace PrincipleStudios.PlanningPoker.Chat;

public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> logger;

    public ChatHub(ILogger<ChatHub> logger)
    {
        this.logger = logger;
    }

    public async Task SendMessage(string user, string message)
    {
        logger.LogInformation("SendMessage was called with {User} saying '{Message}'.", user, message);

        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

}

using Microsoft.AspNetCore.SignalR;

namespace Find_Your_Home.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            return base.OnConnectedAsync();
        }

        public async Task JoinConversation(string conversationId)
        {
            Console.WriteLine($"Client {Context.ConnectionId} joined conversation {conversationId}");
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        }

        public async Task LeaveConversation(string conversationId)
        {
            Console.WriteLine($"Client {Context.ConnectionId} left conversation {conversationId}");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
        }
    }

}
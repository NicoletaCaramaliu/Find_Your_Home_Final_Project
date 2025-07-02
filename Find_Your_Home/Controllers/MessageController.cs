using Find_Your_Home.Models.Chat.DTO;
using Find_Your_Home.Services.MessageService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IUserService _userService;

        public MessageController(IUserService userService, IMessageService messageService)
        {
            _userService = userService;
            _messageService = messageService;
        }
        
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var senderId = _userService.GetMyId();
            await _messageService.SendMessageAsync(senderId, request);
            return Ok();
        }
        
        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetMessages(Guid conversationId)
        {
            var messages = await _messageService.GetMessagesByConversationIdAsync(conversationId);
            return Ok(messages);
        }
    }

}
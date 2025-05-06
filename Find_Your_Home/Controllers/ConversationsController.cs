using Find_Your_Home.Models.Chat.DTO;
using Find_Your_Home.Services.ConversationService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConversationsController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly IUserService _userService;

        public ConversationsController(IConversationService conversationService, IUserService userService)
        {
            _conversationService = conversationService;
            _userService = userService;
        }

        [HttpPost("startOrGet"), Authorize]
        public async Task<ActionResult<Guid>> StartOrGet([FromBody] StartConversationRequest request)
        {
            var userId = _userService.GetMyId();
            var conversationId = await _conversationService.StartOrGetConversation(userId, request.OtherUserId);
            return Ok(conversationId);
        }

        [HttpGet("myConversations"), Authorize]
        public async Task<ActionResult<List<ConversationPreviewDto>>> GetMyConversations()
        {
            var userId = _userService.GetMyId();
            var result = await _conversationService.GetMyConversationsAsync(userId);
            return Ok(result);
        }
    }
}
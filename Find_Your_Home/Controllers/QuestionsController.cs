using Find_Your_Home.Data;
using Find_Your_Home.Models.Questions;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public QuestionsController(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet("getAllQuestions"), Authorize(Roles = "Admin")]
        public IActionResult GetMyQuestions()
        {
            var userId = _userService.GetMyId();
            var user = _context.Users.Find(userId);
            if (user.Role != 0)
            {
                return Unauthorized(new { message = "You are not authorized to view all questions." });
            }

            var questions = _context.Questions.ToList();
            return Ok(questions);
        }

        [HttpPost("addQuestion"), Authorize(Roles = "Admin")]
        public IActionResult AddQuestion(QuestionRequest questionRequest)
        {
            if (string.IsNullOrWhiteSpace(questionRequest.QuestionText))
            {
                return BadRequest(new { message = "Question text cannot be empty." });
            }

            var question = new Question
            {
                QuestionText = questionRequest.QuestionText,
                AnswerText = questionRequest.AnswerText
            };

            _context.Questions.Add(question);
            _context.SaveChanges();

            return Ok(new { message = "Question added successfully.", questionId = question.Id });
        }


        [HttpPatch("postQuestion"), Authorize(Roles = "Admin")]
        public IActionResult PostQuestion(Guid questionId)
        {
            var question = _context.Questions.Find(questionId);
            if (question == null)
            {
                return NotFound(new { message = "Question not found." });
            }
            if (question.Posted)
            {
                return BadRequest(new { message = "Question is already posted." });
            }
            
            question.Posted = true;
            _context.Questions.Update(question);
            _context.SaveChanges();
            return Ok(new { message = "Question posted successfully." });
        }
        
        [HttpPatch("unpostQuestion"), Authorize(Roles = "Admin")]
        public IActionResult UnpostQuestion(Guid questionId)
        {
            var question = _context.Questions.Find(questionId);
            if (question == null)
            {
                return NotFound(new { message = "Question not found." });
            }
            if (!question.Posted)
            {
                return BadRequest(new { message = "Question is not posted." });
            }
            
            question.Posted = false;
            _context.Questions.Update(question);
            _context.SaveChanges();
            return Ok(new { message = "Question unposted successfully." });
        }

        [HttpDelete("deleteQuestion/{questionId}"), Authorize(Roles = "Admin")]
        public IActionResult DeleteQuestion(Guid questionId)
        {
            var question = _context.Questions.Find(questionId);
            if (question == null)
            {
                return NotFound(new { message = "Question not found." });
            }

            _context.Questions.Remove(question);
            _context.SaveChanges();
            return Ok(new { message = "Question deleted successfully." });
        }

        [HttpGet("getPostedQuestions")]
        public async Task<IActionResult> GetPostedQuestions()
        {
            var questions = await _context.Questions
                .Where(q => q.Posted)
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound(new { message = "No posted questions found." });
            }

            return Ok(questions);
        }

    }
}
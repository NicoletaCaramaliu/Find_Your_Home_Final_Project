using Find_Your_Home.Data;
using Find_Your_Home.Exceptions;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestimonialsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        
        public TestimonialsController(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }
        
        [HttpGet("getAllTestimonials"), Authorize(Roles = "Admin")]
        public IActionResult GetAllTestimonials()
        {
            var testimonials = _context.Testimonials.ToList();
            return Ok(testimonials);
        }
        
        [HttpGet("getPostedTestimonials"), Authorize]
        public IActionResult GetPostedTestimonials()
        {
            var userId = _userService.GetMyId();
            var testimonials = _context.Testimonials.Where(t => t.Posted == true).ToList();
            return Ok(testimonials);
        }

        [HttpPost("addTestimonial"), Authorize(Roles = "User, PropertyOwner")]
        public async Task<IActionResult> AddTestimonial([FromBody] string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new AppException("CONTENT_EMPTY");
            }

            var userId = _userService.GetMyId();
            var user = await _userService.GetUserById(userId);
            
            //add only one testimonial per user
            var existingTestimonial = _context.Testimonials.FirstOrDefault(t => t.UserId == userId);
            if (existingTestimonial != null)
            {
                throw new AppException("ONE_TESTIMONIAL_PER_USER");
            }
            

            var testimonial = new Models.Testimonials.Testimonial
            {
                UserId = userId,
                AuthorName = user.Username,
                Content = content,
                Posted = false 
            };

            _context.Testimonials.Add(testimonial);
            _context.SaveChanges();

            return Ok(new { message = "Testimonial added successfully." });
        }

        [HttpPatch("postTestimonial"), Authorize(Roles = "Admin")]
        public IActionResult PostTestimonial(Guid testimonialId)
        {
            var testimonial = _context.Testimonials.FirstOrDefault(t => t.Id == testimonialId);
            if (testimonial == null)
            {
                throw new AppException("TESTIMONIAL_NOT_FOUND");
            }
            
            var postedTestimonialsCount = _context.Testimonials.Count(t => t.Posted == true);
            if (postedTestimonialsCount >= 3)
            {
                throw new AppException("MAX_THREE_POSTED_TESTIMONIALS");
            }

            testimonial.Posted = true;
            _context.SaveChanges();

            return Ok(new { message = "Testimonial posted successfully." });
        }
        
        [HttpPatch("unpostTestimonial"), Authorize(Roles = "Admin")]
        public IActionResult UnpostTestimonial(Guid testimonialId)
        {
            var testimonial = _context.Testimonials.FirstOrDefault(t => t.Id == testimonialId);
            if (testimonial == null)
            {
                throw new AppException("TESTIMONIAL_NOT_FOUND");
            }

            testimonial.Posted = false;
            _context.SaveChanges();

            return Ok(new { message = "Testimonial was deleted from home page." });
        }
        
        [HttpDelete("deleteTestimonial"), Authorize(Roles = "Admin")]
        public IActionResult DeleteTestimonial(Guid testimonialId)
        {
            var testimonial = _context.Testimonials.FirstOrDefault(t => t.Id == testimonialId);
            if (testimonial == null)
            {
                throw new AppException("TESTIMONIAL_NOT_FOUND");
            }

            _context.Testimonials.Remove(testimonial);
            _context.SaveChanges();

            return Ok(new { message = "Testimonial deleted successfully." });
        }
    }
}
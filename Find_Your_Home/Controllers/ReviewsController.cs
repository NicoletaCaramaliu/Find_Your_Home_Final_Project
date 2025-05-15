using AutoMapper;
using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Models.Reviews.DTO;
using Find_Your_Home.Services.ReviewService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Find_Your_Home.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        
        public ReviewsController(IReviewService reviewService, IUserService userService, IMapper mapper)
        {
            _mapper = mapper;
            _reviewService = reviewService;
            _userService = userService;
        }
        
        
        [HttpPost("addReview"), Authorize]
        public async Task<IActionResult> AddReview([FromBody] ReviewRequest reviewRequest)
        {
            var reviewerId = _userService.GetMyId();
            var reviewToAdd = _mapper.Map<Review>(reviewRequest);
            var review = await _reviewService.AddReview(reviewerId, reviewToAdd);
            var reviewResponse = _mapper.Map<ReviewResponse>(review);
            return Ok(reviewResponse);
        }

        [HttpGet("getReviews/{userId}")]
        public async Task<IActionResult> GetReviews(Guid userId)
        {
            var reviews = await _reviewService.GetReviewsByUserId(userId);
            var reviewResponse = _mapper.Map<List<ReviewResponse>>(reviews);
            return Ok(reviewResponse);
        }

    }
}
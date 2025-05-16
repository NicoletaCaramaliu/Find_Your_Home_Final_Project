using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Repositories.ReviewRepository;
using Find_Your_Home.Services.NotificationsService;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Services.ReviewService
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly INotificationService _notificationService;
        
        public ReviewService(IReviewRepository reviewRepository, INotificationService notificationService)
        {
            _notificationService = notificationService;
            _reviewRepository = reviewRepository;
        }
        public async Task<Review> AddReview(Guid reviewerId, Review review)
        {
            if (reviewerId == review.TargetUserId)
                throw new AppException("You cannot review yourself.");

            if (review.Rating < 1 || review.Rating > 5)
                throw new AppException("Rating must be between 1 and 5.");

            if (string.IsNullOrWhiteSpace(review.Comment))
                throw new AppException("Comment cannot be empty.");

            review.ReviewerId = reviewerId;

            await _reviewRepository.CreateAsync(review);
            await _reviewRepository.SaveAsync();

            var savedReview = await _reviewRepository
                .GetAllQueryable()
                .Include(r => r.Reviewer)
                .FirstOrDefaultAsync(r => r.Id == review.Id);

            if (savedReview != null)
            {
                var notification = NotificationMessage.CreateReviewNotification(
                    savedReview.ReviewerId,
                    savedReview.Reviewer.Username,
                    savedReview.Rating
                );

                await _notificationService.SendNotificationAsync(
                    savedReview.TargetUserId.ToString(),
                    notification
                );
            }

            return review;
        }

        
        public async Task<IEnumerable<Review>> GetReviewsByUserId(Guid targetedId)
        {
            var reviews = await _reviewRepository
                .GetAllQueryable()
                .Where(r => r.TargetUserId == targetedId)
                .Include(r => r.Reviewer)
                .ToListAsync();

            return reviews;
                
        }
    }
}
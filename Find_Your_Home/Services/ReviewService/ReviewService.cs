using Find_Your_Home.Exceptions;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Repositories.BookingRepository;
using Find_Your_Home.Repositories.ReviewRepository;
using Find_Your_Home.Services.NotificationsService;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Services.ReviewService
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly INotificationService _notificationService;
        private readonly IBookingRepository _bookingRepository;
        
        public ReviewService(IReviewRepository reviewRepository, INotificationService notificationService, IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
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

            var hasBooking = await _bookingRepository
                .GetAllQueryable()
                .Include(b => b.Property)
                .AnyAsync(b =>
                    (b.UserId == reviewerId && b.Property.OwnerId == review.TargetUserId) ||
                    (b.UserId == review.TargetUserId && b.Property.OwnerId == reviewerId));

            if (!hasBooking)
                throw new AppException("NO_REVIEW_PERMISSION");
            
             

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

        public async Task<IEnumerable<Review>> GetAllReviews()
        {
            var reviews = await _reviewRepository
                .GetAllQueryable()
                .Include(r => r.Reviewer)
                .ToListAsync();

            return reviews;
        }

        public async Task<bool> DeleteReview(Guid reviewId)
        {
            var review = await _reviewRepository.FindByIdAsync(reviewId);
            if (review == null)
                throw new AppException("REVIEW_NOT_FOUND");

            _reviewRepository.Delete(review);
            await _reviewRepository.SaveAsync();

            return true;
        }
    }
}
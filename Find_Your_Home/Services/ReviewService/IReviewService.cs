using Find_Your_Home.Models.Reviews;

namespace Find_Your_Home.Services.ReviewService
{
    public interface IReviewService
    {
        Task<Review> AddReview(Guid reviewerId, Review review);
        Task<IEnumerable<Review>> GetReviewsByUserId(Guid targetedId);
        Task<IEnumerable<Review>> GetAllReviews();
        Task<bool> DeleteReview(Guid reviewId);
    }
}
using Find_Your_Home.Data;
using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Repositories.GenericRepository;

namespace Find_Your_Home.Repositories.ReviewRepository
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        private readonly ApplicationDbContext _context;
        public ReviewRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        
    }
}
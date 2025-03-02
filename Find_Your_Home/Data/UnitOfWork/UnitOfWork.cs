using System.Threading.Tasks;
using Find_Your_Home.Data;
using Find_Your_Home.Repositories.PropertyImgRepository;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.UserRepository;

namespace Find_Your_Home.Repositories.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public IPropertyRepository PropertyRepository { get; set; }
        public IUserRepository UserRepository { get; set; }
        public IPropertyImgRepository PropertyImgRepository { get; set; }

        public UnitOfWork(ApplicationDbContext context, IPropertyRepository propertyRepository, IUserRepository userRepository, IPropertyImgRepository propertyImgRepository)
        {
            _context = context;
            PropertyRepository = propertyRepository;
            UserRepository = userRepository;
            PropertyImgRepository = propertyImgRepository;
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() != 0;
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Users;

namespace Find_Your_Home.Models.Favorites
{
    public class Favorite : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public Guid PropertyId { get; set; }
        public Property Property { get; set; } = null!;

    }
}
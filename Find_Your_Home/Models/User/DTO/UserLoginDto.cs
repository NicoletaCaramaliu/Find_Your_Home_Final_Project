using Find_Your_Home.Models.Models;

namespace Find_Your_Home.Models.User.DTO
{
    public class UserLoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }

    }
}

using Find_Your_Home.Models.Models;

namespace Find_Your_Home.Models.Users.DTO
{
    public class UserLoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }

    }
}

using Find_Your_Home.Models.Models;

namespace Find_Your_Home.Models.Users.DTO
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public Role Role { get; set; }
    }
}
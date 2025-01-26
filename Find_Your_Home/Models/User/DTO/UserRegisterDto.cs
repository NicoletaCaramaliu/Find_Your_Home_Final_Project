using Find_Your_Home.Models.Models;

namespace Find_Your_Home.Models.User.DTO;

public class UserRegisterDto
{
    public required string Email { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required Role Role { get; set; }
}
namespace Find_Your_Home.Models.Users.DTO
{
    public class UpdateUserRequest
    {
        public string Username { get; set; }
        public string? Password { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
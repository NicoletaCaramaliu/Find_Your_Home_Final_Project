using Find_Your_Home.Models;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Models.Users.DTO;

public interface IAuthService
{
    Task<User> Register(UserRegisterDto request);
    Task<string> Login(UserLoginDto request);
    public RefreshToken GenerateRefreshToken();

    //public Task<string> Logout(string email);
    public Task<string> Logout();
    Task<string> RefreshToken(); 
}
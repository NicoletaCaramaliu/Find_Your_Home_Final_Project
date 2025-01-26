using Find_Your_Home.Models;
using Find_Your_Home.Models.User;
using Find_Your_Home.Models.User.DTO;

public interface IAuthService
{
    Task<User> Register(UserRegisterDto request);
    Task<string> Login(UserLoginDto request);
    public RefreshToken GenerateRefreshToken();
}
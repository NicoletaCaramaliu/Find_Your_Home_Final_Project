using AutoMapper;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Models.Users.DTO;

namespace Find_Your_Home.Helpers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            // CreateMap<Source, Destination>();
            //Mapper for user
            CreateMap<User, UserLoginDto>();
            CreateMap<User, UserRegisterDto>();
            CreateMap<UserRegisterDto, User>();
            CreateMap<UserLoginDto, User>();
        }
    }
}

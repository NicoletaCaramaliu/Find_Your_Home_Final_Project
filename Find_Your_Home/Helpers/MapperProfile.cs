using AutoMapper;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Bookings.DTO;
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Models.Favorites.DTO;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Properties.DTO;
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
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            
            CreateMap<Property, PropertyRequest>();
            CreateMap<PropertyRequest, Property>();
            CreateMap<Property, PropertyResponse>();
            CreateMap<PropertyResponse, Property>();
            
            CreateMap<Favorite, FavoriteResponse>();
            CreateMap<FavoriteResponse, Favorite>();
            
            CreateMap<AvailabilitySlot, AvailabilitySlotDto>();
            CreateMap<AvailabilitySlotDto, AvailabilitySlot>();
            CreateMap<AvailabilitySlot, AvailabilitySlotResponseDto>();
            CreateMap<AvailabilitySlotResponseDto, AvailabilitySlot>();
            
            CreateMap<Booking, BookingRequestDto>();
            CreateMap<BookingRequestDto, Booking>();
            CreateMap<Booking, BookingResponseDto>();
            CreateMap<BookingResponseDto, Booking>();
        }
    }
}

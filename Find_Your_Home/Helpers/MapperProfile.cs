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
            // User
            CreateMap<User, UserLoginDto>();
            CreateMap<User, UserRegisterDto>();
            CreateMap<UserRegisterDto, User>();
            CreateMap<UserLoginDto, User>();
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

            // Property
            CreateMap<Property, PropertyRequest>();
            CreateMap<PropertyRequest, Property>();
            CreateMap<Property, PropertyResponse>();
            CreateMap<PropertyResponse, Property>();

            // Favorite
            CreateMap<Favorite, FavoriteResponse>();
            CreateMap<FavoriteResponse, Favorite>();

            // AvailabilitySlot
            CreateMap<AvailabilitySlot, AvailabilitySlotDto>();
            CreateMap<AvailabilitySlotDto, AvailabilitySlot>();
            
            CreateMap<AvailabilitySlot, AvailabilitySlotResponseDto>()
                .ForMember(dest => dest.Bookings, opt => opt.MapFrom(src => src.Bookings))
                .ForMember(dest => dest.BlockedIntervals, opt => opt.MapFrom(src => src.BlockedIntervals));

            CreateMap<AvailabilitySlotResponseDto, AvailabilitySlot>();

            // Booking
            CreateMap<Booking, BookingRequestDto>();
            CreateMap<BookingRequestDto, Booking>();

            CreateMap<Booking, BookingResponseDto>()
                .ForMember(dest => dest.PropertyName, opt => opt.MapFrom(src => src.Property.Name))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Username));
                //.ForMember(dest => dest.AvailabilitySlot, opt => opt.MapFrom(src => src.AvailabilitySlot));
            CreateMap<BookingResponseDto, Booking>();
            
            //BlockedInterval
            CreateMap<BlockedInterval, BlockedIntervalResponse>();
            CreateMap<BlockedIntervalResponse, BlockedInterval>();
            CreateMap<BlockedInterval, BlockedIntervalRequest>();
            CreateMap<BlockedIntervalRequest, BlockedInterval>();
            
        }
    }
}

using Find_Your_Home.Models.Base;
using Find_Your_Home.Models.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Reviews;
using Find_Your_Home.Models.Testimonials;

namespace Find_Your_Home.Models.Users
{
    public class User : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty;
        public Role Role { get; set; } = Role.User;
        
        //[JsonIgnore] - dto 
        public ICollection<Property>? Properties { get; set; } = new List<Property>();


        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; }
        public DateTime TokenExpires { get; set; }
        
        public string? ResetToken { get; set; } 
        
        public DateTime? ResetTokenExpires { get; set; }
        
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        
        //for bookings
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        
        public ICollection<Review> ReviewsGiven { get; set; } = new List<Review>();   // scrise de user
        public ICollection<Review> ReviewsReceived { get; set; } = new List<Review>();
    }
}

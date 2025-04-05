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
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Models.Properties;

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
        
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }
}

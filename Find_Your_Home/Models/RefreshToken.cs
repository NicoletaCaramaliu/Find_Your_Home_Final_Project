using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Find_Your_Home.Models
{
    public class RefreshToken
    {
        public required string Token { get; set; }

        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime Expires { get; set; }
    }
}

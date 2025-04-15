using System.ComponentModel.DataAnnotations;

namespace Find_Your_Home.Models.Users.DTO
{
    public class ChangePasswordRequest
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }

}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AltBet.Admin.Models
{
    public class UserViewModel
    {
       
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage = "User name is required")]
        [StringLength(128, MinimumLength = 3, ErrorMessage = "Please enter at least 3 characters")]
        public string User { get; set; }
       
        [Required(ErrorMessage = "Password is required")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Please enter at least 3 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
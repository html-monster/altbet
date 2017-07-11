using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using AltBet.Exchange;
using AltBet.Resources;
using AltBet.Model;

namespace  AltBet.Bet.Models
{
    public class UserViewModel
    {
        [Required(ErrorMessage = "User Name is required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Please enter at least 3-15 characters")]
        public string NickName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [RegularExpression("^([A-Za-z0-9_-]+.)*[A-Za-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$", ErrorMessage = "Incorrect Email address")]
        [StringLength(128, ErrorMessage = "Email can not exceed 128 characters")]
        public string Email { get; set; }

        //[Required(ErrorMessage = "First Name is required")]
        //[RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        //[StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        //public string FirstName { get; set; }

        //[Required(ErrorMessage = "Last Name is required")]
        //[RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        //[StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        //public string LastName { get; set; }

        [Required(ErrorMessage = "Date Of birth is required")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Country is required")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        [StringLength(128, MinimumLength = 2, ErrorMessage = "Please enter at least 3-50 characters")]
        public string Country { get; set; }

        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        [StringLength(128, MinimumLength = 2, ErrorMessage = "Please enter at least 3-50 characters")]
        public string State { get; set; }

        //[Required(ErrorMessage = "Address is required")]
        //[StringLength(200, MinimumLength = 3, ErrorMessage = "Please enter at least 3-50 characters")]
        //public string Address { get; set; }

        //[Required(ErrorMessage = "Phone is required")]
        //[RegularExpression(@"^[0-9]+$", ErrorMessage = "Not a valid phone number")]
        //[StringLength(30, MinimumLength = 4, ErrorMessage = "Please enter at least 4-30 characters")]
        //public string Phone { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Please enter at least 3 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        
        [Required(ErrorMessage = "Confirm Password  is required")]
        //[StringLength(20, MinimumLength = 3, ErrorMessage = "Confirm Password must be 3-20 characters")]
        [Compare("Password", ErrorMessage = "Password do not match")]
        [DataType(DataType.Password)]
        public string ComparePassword { get; set; }
    }


    public class UserRegistrationViewModel
    {
        [Required(ErrorMessage = "User Name is required")]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Please enter at least 3-15 characters")]
        public string NickName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [RegularExpression("^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$", ErrorMessage = "Incorrect Email address")]
        [StringLength(128, ErrorMessage = "Email can not exceed 128 characters")]
        public string Email { get; set; }

        //[Required(ErrorMessage = "First Name is required")]
        //[RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        //[StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        //public string FirstName { get; set; }

        //[Required(ErrorMessage = "Last Name is required")]
        //[RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        //[StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        //public string LastName { get; set; }

        [Required(ErrorMessage = "Date Of birth is required")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Country is required")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        [StringLength(128, MinimumLength = 3, ErrorMessage = "Please enter at least 3-50 characters")]
        public string Country { get; set; }

        //[Required(ErrorMessage = "Address is required")]
        //[StringLength(200, MinimumLength = 3, ErrorMessage = "Please enter at least 3-50 characters")]
        //public string Address { get; set; }

        //[Required(ErrorMessage = "Phone is required")]
        //[RegularExpression(@"^[0-9]+$", ErrorMessage = "Not a valid phone number")]
        //[StringLength(30, MinimumLength = 4, ErrorMessage = "Please enter at least 4-30 characters")]
        //public string Phone { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Please enter at least 3 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm Password  is required")]
        //[StringLength(20, MinimumLength = 3, ErrorMessage = "Confirm Password must be 3-20 characters")]
        [Compare("Password", ErrorMessage = "Password do not match")]
        [DataType(DataType.Password)]
        public string ComparePassword { get; set; }
    }


    public class LoginUserViewModel
    {
        //[Required]
        [Required(ErrorMessage = "E-mail or nickname is required")]
        //[RegularExpression("^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$", ErrorMessage = "Incorrect Email address")]
        [StringLength(128, MinimumLength = 3, ErrorMessage = "Please enter at least 3 characters")]
        public string UserIdentity { get; set; }

        //[Required]
        [Required(ErrorMessage = "Password is required")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Please enter at least 3 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }

    public class UserInfoViewModel
    {
        public string UserName { get; set; }

        public string Email { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Please enter at least 2-50 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Date Of birth is required")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Country is required")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Use letters only please")]
        [StringLength(128, MinimumLength = 2, ErrorMessage = "Please enter at least 3-128 characters")]
        public string Country { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Please enter at least 3-200 characters")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Phone is required")]
        [RegularExpression(@"^[0-9]+$", ErrorMessage = "Not a valid phone number")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Please enter at least 3-30 characters")]
        public string Phone { get; set; }

    }

    public class ChangePasswordViewModel
    {
        //[Required(ErrorMessage = "Old password is required")]
        //[StringLength(30, MinimumLength = 3, ErrorMessage = "Please enter at least 3-30 characters")]
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class AccountViewModel
    {
        public bool IsBettor { get; set; }
        public bool IsTrade { get; set; }
        public bool IsMode { get; set; }

        public bool MailNews { get; set; }
        public bool MailUpdates { get; set; }
        public bool MailActivity { get; set; }
        public string MailFrequency { get; set; }
        public bool SmsActivity { get; set; }


      
        //public string Theme { get; set; }
    }


    public class SettingsViewModel
    {
        public UserInfoViewModel UserInfo { get; set; }
        public AccountViewModel Account { get; set; }
        public ChangePasswordViewModel ChangePassword { get; set; }
        public UserAssets UserAssets { get; set; }

        public List<PaymentsHistory> PaymentsHistory {get;set;}
        public List<UploadedImageInfo> jsonImageInfo { get; set; }
    }

}
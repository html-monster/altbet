using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using AltBet.Admin.Models;
using AltBet.Exchange.Managers;
using AltBet.ExchangeServices.Services;

namespace AltBet.Admin.Controllers
{
    public class AccountController : Controller
    {
        //private readonly IUserManager _userManager = null;

        public AccountController()
        {
            //this._userManager = userManager;
        }
        
        // GET: /Account/

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginViewModel model)
        {
            var result = new Authorization { Error = "104", Message = "Some problems with auth controller" };
           
            if (ModelState.IsValid)
            {
                try
                {
                    using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                    {
                        result = userManagerClient.LoginAdmin(model.User, model.Password);
                    }

                    if (string.IsNullOrEmpty(result.UserName))
                        ModelState.AddModelError(string.Empty, new InvalidOperationException("Invalid user"));
                    else
                        FormsAuthentication.SetAuthCookie(result.UserName, true);
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }
            return Json(new { Error = result.Error, Param1 = result.Message });
        }

        [Authorize]
        public ActionResult Logout()
        {
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                userManagerClient.LogoutAdmin(User.Identity.Name);
            }
            FormsAuthentication.SignOut();

            return RedirectToAction("Login", "Account");
        }
    }
}

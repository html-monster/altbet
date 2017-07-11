using AltBet.Bet.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using AltBet.Bet;
using AltBet.Exchange;
using AltBet.Exchange.Managers;
using AltBet.ExchangeServices.Services;

namespace AltBet.Controllers
{
    public class _baseController : Controller
    {
        //private readonly IUserManager userManager = new UserService(); //WTF is going here???
        
        [Authorize]
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            if (User.Identity.IsAuthenticated == true)
            {
                //var user = userManager.GetUserInfo(User.Identity.Name);
                var user = new User();
                using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                {
                    user = userManagerClient.GetUserInfo(User.Identity.Name);
                }

                if (user.Accounts != null)
                {
                    var account = user.Accounts.FirstOrDefault();
                    if (account != null)
                    {
                        Session["Mode"] = account.Mode == Mode.Basic.ToString().ToLower();
                        Session["Theme"] = account.Theme;
                        Session["Bettor"] = account.Bettor;
                        Session["Trade"] = account.Trade;
                       
                    }
                }
            }
        }
    }
}

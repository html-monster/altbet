using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Hangfire.Dashboard;

namespace AltBet
{
    public class AuthConfig : IDashboardAuthorizationFilter

    {
        public bool Authorize(DashboardContext context)
        {
            var name = HttpContext.Current.User.Identity.Name;
            if (name == "vlad" || name == "jenay")
            {
                return true;
            }

            return false; 
        }
    }
}
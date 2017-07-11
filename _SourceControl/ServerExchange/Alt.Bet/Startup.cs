using System.Collections.Generic;
using System.Net;
using System.Web;
using AltBet;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
public class Startup
{
    //public class Forbidden : IAuthorizationFilter
    //{
    //    public bool Authorize(IDictionary<string, object> owinEnvironment)
    //    {
    //        return false;
    //    }
    //}
    public void Configuration(IAppBuilder app)
    {
        GlobalConfiguration.Configuration.UseSqlServerStorage("MyExchange");
       

        // Change `Back to site` link URL
        // var options = new DashboardOptions { AppPath = "http://your-app.net" };

        // Make `Back to site` link working for subfolder applications
        var options = new DashboardOptions
        {
            
            AppPath = VirtualPathUtility.ToAbsolute("~"),

            Authorization = new[] { new AuthConfig() }

            //AuthorizationFilters = new[]
            //{
            //    new AuthorizationFilter { Users = "vlad,jenay" }
                
            //}
        };

        
        app.UseHangfireDashboard("/hangfire", options);

        app.UseHangfireServer();
        app.UseHangfireDashboard();

    }
}
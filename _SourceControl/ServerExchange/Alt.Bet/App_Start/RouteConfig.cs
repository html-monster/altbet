using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AltBet
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {            
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //routes.IgnoreRoute("{Content}/{*pathInfo}");
            //routes.IgnoreRoute("{Scripts}/{*pathInfo}");
            //routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.ico(/.*)?" });

            routes.MapRoute(
                name: "Logo",
                url: "{culture}/home/index",
                defaults: new { culture = "eng", controller = "Home", action = "Index" },
                constraints: new { controller = "Home", action = "Index" }
            );

            routes.MapRoute(
                name: "Landing",
                url: "",
                defaults: new { controller = "Landing", action = "Index" },
                constraints: new { controller = "Landing", action = "Index" }
            );

            routes.MapRoute(
                name: "LandingCategories",
                url: "{culture}/home/{path}",
                defaults: new { culture = "eng", controller = "Home", action = "Index", path = UrlParameter.Optional },
                constraints: new { path = "fantasy-sport|e-sport" }
            );

            routes.MapRoute(
                name: "StaticPage",
                url: "{culture}/footer/{name}",
                defaults: new { culture = "eng", controller = "Home", action = "GetStaticPage", name = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Activity",
                url: "{culture}/home/activity/{name}",
                defaults: new { culture = "eng", controller = "Home", action = "MyAssets", name = UrlParameter.Optional },
                constraints: new { name = "open-entries|my-entries|history" }
                );
           
            routes.MapRoute(
                name: "Categories",
                url: "{culture}/home/{*path}",
                defaults: new { culture = "eng", controller = "Home", action = "Index" }
            );

            routes.MapRoute(
                name: "EventPage",
                url: "{culture}/event/{*category}",
                defaults: new { culture = "eng", controller = "Event", action = "Index" },
                constraints: new { controller = "Event" }
            );

            routes.MapRoute(
                name: "MainCulture",
                url: "{culture}/{controller}/{action}",
                defaults: new { culture = "eng", controller = "Home", action = "Index" },
                constraints: new { culture = "eng|ru" }
            );

            routes.MapRoute(
                name: "Main",
                url: "{controller}/{action}",
                defaults: new { controller = "Home", action = "Index" }
            );

           // routes.MapRoute(
           //    name: "Default",
           //    url: "{controller}/{action}",
           //    //url: "{culture}/{controller}/{action}",
           //    defaults: new { controller = "Home", action = "Index" }
           //);
        }
    }
}
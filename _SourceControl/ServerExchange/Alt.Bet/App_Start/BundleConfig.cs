using System.Web;
using System.Web.Optimization;

namespace AltBet
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery")
                //.Include("~/Scripts/jquery-{version}.js")
                //.Include("~/Scripts/jquery-{version}.min.js")
                //.Include("~/Scripts/jquery-ui-{version}.js")
                .Include("~/Scripts/jquery.unobtrusive-ajax.js")
                .Include("~/Scripts/jquery.validate*") );


            bundles.Add(new ScriptBundle("~/bundles/vendors")
                .Include("~/Scripts/js-assets/vendors-*")
                );

            bundles.Add(new ScriptBundle("~/bundles/alljs")
                .Include("~/Scripts/js-assets/all-*")
                );

            bundles.Add(new ScriptBundle("~/bundles/mobile")
                .Include("~/Scripts/all-mobile.js")
                .Include("~/Scripts/bundle-mobile.js")
                .Include("~/Scripts/bundlem-mobile.js")
                .Include("~/Scripts/bundler-mobile.js"));


            bundles.Add(new ScriptBundle("~/bundles/all")
                .Include("~/Scripts/js-assets/bundle-*")
                .Include("~/Scripts/js-assets/bundlem-*"));
            bundles.Add(new ScriptBundle("~/bundles/bundler")
                .Include("~/Scripts/js-assets/bundler-*"));

            bundles.Add(new ScriptBundle("~/localization/strings")
                .Include("~/Scripts/js-assets/localization/strings_us_us-*"));
//                .Include("~/Scripts/js-assets/localization/strings_us_global-*"));
                

            bundles.Add(new ScriptBundle("~/bundles/chart")
                .Include("~/Scripts/highstock.js")
                .Include("~/Scripts/highcharts-more.js")
//                .Include("~/Scripts/mainChartController.js")
                .Include("~/Scripts/dataController.js")
                //.Include("~/Scripts/eventChartController.js")
                //.Include("~/Scripts/webSocketManager.js")
                .Include("~/Scripts/categoryController.js"));

            bundles.Add(new ScriptBundle("~/bundles/landingPage")
                .Include("~/Scripts/js-assets/vendors-*")
                .Include("~/Scripts/js-assets/all-*")                
                .Include("~/Scripts/landingPage.js"));

            bundles.Add(new ScriptBundle("~/bundles/landingPageMobile")
              .Include("~/Scripts/js-assets/vendors-*")
              .Include("~/Scripts/all-mobile.js")
              .Include("~/Scripts/landingPage.js"));

            bundles.Add(new ScriptBundle("~/bundles/access").Include("~/Scripts/jQuery.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*") );

/*            bundles.Add(new StyleBundle("~/Content/css")
                            .Include("~/Content/css-assets/index_dark-*")
                            .Include("~/Content/css-assets/index_light-*")
                            .Include("~/Content/css-assets/index_dark_mobile.css")
                            .Include("~/Content/css-assets/index_light_mobile.css"));*/

            bundles.Add(new StyleBundle("~/Content/dark")
                            .Include("~/Content/css-assets/index_dark-*") );
            bundles.Add(new StyleBundle("~/Content/light")
                            .Include("~/Content/css-assets/index_light-*") );

            bundles.Add(new StyleBundle("~/Content/landing").
                            Include("~/Content/css-assets/index_landing-*"));
        }
    }
}
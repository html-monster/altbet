using System.Web;
using System.Web.Optimization;

namespace AltBet.Admin
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.IgnoreList.Clear();

            bundles.Add(new ScriptBundle("~/bundles/jquery")
                 .Include("~/Scripts/jquery-{version}.js")
                 .Include("~/Scripts/jquery-{version}.min.js")
                 .Include("~/Scripts/jquery-ui-{version}.js")
                 .Include("~/Scripts/jquery.unobtrusive-ajax.js")
                 .Include("~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/Scripts/admin").Include(
                       "~/Scripts/vendor/admin-lte/plugins/jQuery/jquery-2.2.3.min.js",
                       "~/Scripts/vendor/admin-lte/bootstrap/js/bootstrap.min.js",
                       "~/Scripts/vendor/admin-lte/plugins/sparkline/jquery.sparkline.min.js",
                       "~/Scripts/vendor/admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js",
                       "~/Scripts/vendor/admin-lte/plugins/jvectormap/jquery-jvectormap-world-mill-en.js",
                       "~/Scripts/vendor/admin-lte/plugins/knob/jquery.knob.js",
                       "~/Scripts/vendor/admin-lte/plugins/daterangepicker/daterangepicker.js",
                       "~/Scripts/vendor/admin-lte/plugins/datepicker/bootstrap-datepicker.js",
                       "~/Scripts/vendor/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js",
                       "~/Scripts/vendor/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js",
                       "~/Scripts/vendor/admin-lte/plugins/fastclick/fastclick.js",
                       "~/Scripts/vendor/admin-lte/dist/js/app.js",
                       "~/Scripts/vendor/admin-lte/dist/js/demo.js",
                       "~/Scripts/vendor/jstree/dist/jstree.js",
                       "~/Scripts/vendor/handlebars/handlebars.min.js",
                       "~/Scripts/vendor/iziToast/iziToast.min.js",
                       "~/Scripts/vendor/admin-lte/plugins/select2/select2.js"));

            bundles.Add(new ScriptBundle("~/bundles/admin").Include("~/Scripts/js-assets/bundle-adm-*"));


            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/css-assets/index-admin-*"));
            bundles.Add(new StyleBundle("~/Scripts/vendor").Include(
                        "~/Scripts/vendor/admin-lte/bootstrap/css/bootstrap.css",
                        "~/Scripts/vendor/admin-lte/plugins/select2/select2.css",
                        "~/Scripts/vendor/admin-lte/dist/css/AdminLTE.min.css",
                        "~/Scripts/vendor/admin-lte/dist/css/skins/skin-yellow-light.min.css",
                        "~/Scripts/vendor/admin-lte/plugins/iCheck/flat/blue.css",
                        "~/Scripts/vendor/admin-lte/plugins/morris/morris.css",
                        "~/Scripts/vendor/admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.css",
                        "~/Scripts/vendor/admin-lte/plugins/datepicker/datepicker3.css",
                        "~/Scripts/vendor/admin-lte/plugins/daterangepicker/daterangepicker.css",
                        "~/Scripts/vendor/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css",
                        "~/Scripts/vendor/jstree/dist/themes/default/style.min.css",
                        "~/Scripts/vendor/iziToast/iziToast.min.css",
                        "~/Content/react-select.min.css"
                        ));
        }
    }
}
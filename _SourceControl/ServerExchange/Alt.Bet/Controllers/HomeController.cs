using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Reflection;
using AltBet.Exchange.Managers;
using AltBet.Exchange;
using AltBet.Bet.Attributes;
using AltBet.App_Start;
using AltBet.Models;
using System.Net;
using System.IO;
using AltBet.Bet.Models;

namespace  AltBet.Controllers
{
    public class HomeController : _baseController
    {
        //private IUserManager userManager = null;
        //private IExchangeManager exchangeManager = null;
        //private IOrderManager orderManager = null;
       
        public HomeController()
        {
            //this.userManager = userManager;
            //this.exchangeManager = exchangeManager;
            //this.orderManager = orderManager;
        }
        

        [NoCache]
        public ActionResult Index()
        {
            //var currentCountry = userManager.GetLocation(HttpContext.Request.UserHostAddress);
            var currentCountry = string.Empty;
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                currentCountry = userManagerClient.GetLocation(HttpContext.Request.UserHostAddress);
            }
            ViewBag.CurrentCountry = currentCountry;

            if (Request.Browser.IsMobileDevice)
            {
                return View("Index.Mobile");
            }
            else
            {
                return View("Index");
            }
        }

        [ChildActionOnly]
        public ActionResult GetExchanges(string path = null, int Page = 1, string sort = "closingsoon")
        {
            //int itemsOnPage = exchangeManager.GetItemsOnPage();
            int itemsOnPage = 0;
            using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
            {
                itemsOnPage = exchangeManagerClient.GetItemsOnPage();
            }

            Pagination pagination = new Pagination
            {
                PageItemsAmount = itemsOnPage,
                CurrentPage = Page,
                ControllerName = "Home",
                ActionName = path == null ? "Index" : "",
                RouteParams = new Dictionary<string, object> { { "path", path } },
            };

            var result = new List<AllSymbolsAndOrders>();

            try
            {
                //result = exchangeManager.GetAllSymbolsAndOrders(sort, path);
                using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                {
                    result = exchangeManagerClient.GetAllSymbolsAndOrders(sort, path).ToList();
                }
            }
            catch (Exception ex) //TODO: need to specify exception type
            {
                ModelState.AddModelError(string.Empty, ex);
            }

            pagination.ItemsAmount = result.Count;
            pagination.Refresh();

            var paginatedResult = new List<AllSymbolsAndOrders>();
            for (int i = 0; i < result.Count; i++)
            {
                if (i >= (Page - 1) * itemsOnPage && i < (Page - 1) * itemsOnPage + itemsOnPage)
                {
                    paginatedResult.Add(result[i]);
                }
            }

            MainPageModel viewData = new MainPageModel { Data = paginatedResult, Pagination = pagination };

            if (Request.Browser.IsMobileDevice)
            {
                return PartialView("_GetExchangesMobile", viewData);
            }
            else
            {
                return PartialView("_GetExchanges", viewData);
            }
        }       

        [Authorize]
        [NoCache]
        public ActionResult MyAssets()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult GetOrdersPositionsHistory()
        {
            var result = new OrdersPositionsHistory();
            try
            {
                var request = new GetOrdersOrPositionsRequest { Username = User.Identity.Name};
                //result = orderManager.GetOrdersOrPositions(request);
                using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                {
                    result = orderManagerClient.GetOrdersOrPositions(request);
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex);
            }
            return PartialView(result);
        }

        [ChildActionOnly]
        public ActionResult GetOrdersPositions()
        {

            var result = new List<CurrentOrders>();
            try
            {
                //result = orderManager.GetCurrentOrders(User.Identity.Name);
                using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                {
                    result = orderManagerClient.GetCurrentOrders(User.Identity.Name).ToList();
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex);
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, 85, ex);
            }
            return PartialView("_OrderSidebar/_CurrentOrders", result);
        }

        [NoCache]
        public ActionResult GetStaticPage(string name)
        {
            return View(string.Format("_StaticPages/_{0}", name));
        }

        public ActionResult GetLoginHistory()
        {
            string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\SingIn\");
            string fileName = "SingInLog.txt";
            System.Web.HttpResponse response = System.Web.HttpContext.Current.Response;
            response.ClearContent();
            response.Clear();
            response.ContentType = "text/plain";
            response.AddHeader("Content-Disposition", "attachment; filename=" + fileName + ";");
            response.TransmitFile(logPath + fileName);
            response.Flush();
            response.End();
            return Redirect("Index");
        }
    }
}

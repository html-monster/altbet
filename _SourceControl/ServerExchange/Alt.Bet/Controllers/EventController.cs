using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AltBet.Bet.Models;
using AltBet.Controllers;
using AltBet.Exchange.Managers;
using AltBet.Exchange;
using AltBet.Bet.Attributes;

namespace AltBet.Bet.Controllers
{
    public class EventController : _baseController
    {
        //private readonly IExchangeManager _exchangeManager = null;
        //private readonly IOrderManager _orderManager = null;
        //private IUserManager userManager = null;
        public EventController(IOrderManager orderManager, IUserManager userManager)
        {
            //this._exchangeManager = exchangeManager;
            //this._orderManager = orderManager;
            //this.userManager = userManager;
        }

        [NoCache]
        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult Event(string category, string exchange, string reflection, string sort = "closingsoon")
        {
            var symbolsAndOrders = new AllSymbolsAndOrders();
            var ordersAndTicks = new GetOrdersResponse();

            try
            {
                var request = new GetSymbolsAndOrdersByUrlRequest { ExchangeUrl = exchange }; 
                //symbolsAndOrders = _exchangeManager.GetSymbolAndOrdersByUrl(request, sort);
                using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                {
                    symbolsAndOrders = exchangeManagerClient.GetSymbolAndOrdersByUrl(request, sort);
                }
                
                var data = new GetOrdersRequest
                {
                    Symbol = symbolsAndOrders.Symbol,
                    Reflection = reflection,
                    UserName = User.Identity.Name
                };
                //ordersAndTicks = _orderManager.GetOrders(data);
                using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                {
                    ordersAndTicks = orderManagerClient.GetOrders(data);
                }
            }
            catch (Exception ex) //TODO: need to specify exception type
            {
                ModelState.AddModelError(string.Empty, ex);
            }
           
            var model = new EventViewModel
            {
                SymbolsAndOrders = symbolsAndOrders,
                OrderResponse = ordersAndTicks,
                IsMirrorName = (reflection == "0") ? symbolsAndOrders.Symbol.HomeName : symbolsAndOrders.Symbol.AwayName,
                IsMirror = reflection != "0"
            };
            return PartialView(model);

        }

    }
}

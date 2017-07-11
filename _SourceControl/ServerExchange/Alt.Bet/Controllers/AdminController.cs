using AltBet.Bet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AltBet.Exchange.Managers;
using AltBet.Exchange;

namespace AltBet.Controllers
{
    public class AdminController : _baseController
    {
        //private IExchangeManager exchangeManager = null;

        public AdminController()
        {
            //this.exchangeManager = exchangeManager;
        }

        public ActionResult Index()
        {
            //var adminExchanges = exchangeManager.GetExchanges();
            var adminExchanges = new List<AdminExchange>();
            using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
            {
                adminExchanges = exchangeManagerClient.GetExchanges().ToList();
            }
            return View(new CommonModel { Exchanges = new ExchangeViewModel{ Exchanges = adminExchanges} });
        }

        [HttpPost]
        public ActionResult Index(CommonModel exchange)
        {
            if (ModelState.IsValid)
            {
                AddExchangeRequest createRequest = new AddExchangeRequest
                {
                    Exchange = new ExchangeSettings
                    {
                        CommonCurrency = false,
                        Name = exchange.Exchanges.ExchangeName,
                        Symbols = new List<Symbol>
                    {
                        new Symbol
                        {
                            Currency = "USD",
                            Exchange = exchange.Exchanges.ExchangeName,
                            Name = exchange.Exchanges.SymbolName
                        }
                    },
                        StartTime = new TimeSpan(0, 0, 001),
                        StartDate = DateTime.UtcNow,
                        EndTime = new TimeSpan(23, 59, 59),
                        EndDate = DateTime.UtcNow.AddMonths(1)
                    }
                };
                //exchangeManager.CreateExchange(createRequest);
                using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                {
                    exchangeManagerClient.CreateExchange(createRequest);
                }
            }
            //var adminExchanges = exchangeManager.GetExchanges();
            var adminExchanges = new List<AdminExchange>();
            using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
            {
                adminExchanges = exchangeManagerClient.GetExchanges().ToList();
            }
            return RedirectToAction("Index", "Home");
        }

        //public ActionResult Close(string exchangeName, int result)
        //{
        //    CloseExchangeRequest closeRequest = new CloseExchangeRequest
        //    {
        //        Result = result == 1 ? Result.Positive : Result.Negative,
        //        Exchange = new ExchangeSettings
        //        {
        //            Name = exchangeName,
        //            EndDate = DateTime.MaxValue,
        //            EndTime = TimeSpan.MaxValue,
        //            StartDate = DateTime.MaxValue,
        //            StartTime = TimeSpan.MaxValue
        //        }
        //    };
        //    exchangeManager.CloseExchange(closeRequest);
        //    return RedirectToAction("index");
        //}
        public ActionResult Close(string exchangeName, int result)
        {
            CloseExchangeRequest closeRequest = new CloseExchangeRequest
            {
                PositivePercent = result,
                ExchangeName = exchangeName,
                Winner = "Satans ov Hell"
            };
            //exchangeManager.CloseExchange(closeRequest);
            using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
            {
                exchangeManagerClient.CloseExchange(closeRequest);
            }
            return RedirectToAction("index");
        }
    }
}

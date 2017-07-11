using AltBet.Bet.Models;
using AltBet.Exchange.Managers;
using AltBet.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AltBet.Controllers
{
    public class ExchangeController : _baseController
    {
        //private IExchangeManager exchangeManager = null;

        public ExchangeController()
        {
            //this.exchangeManager = exchangeManager;
        }
        public ActionResult Index()
        {
            return View();
        }

    }
}

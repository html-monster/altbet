using AltBet.BusinessLogic;
using AltBet.BusinessLogic.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AltBet.Controllers
{
    public class HistoryController : _baseController
    {
        private IHistoryManager historyManager = null;

        public HistoryController(IHistoryManager historyManager)
        {
            this.historyManager = historyManager;
        }

        [HttpGet]
        public ActionResult History()
        {
            var request = new HistoryRequest
            {
                UserName = User.Identity.Name,
                Parameters = new HistoryParameters
                {
                    BarsCount = 50,
                    Currency = "USD",
                    Interval = 6,
                    Periodicity = 0,
                    Symbol = new AltBet.BusinessLogic.Symbol
                    {
                        Currency = "USD",
                        Exchange = "FIRST",
                        Name = "UAH/USD"
                    }
                }
            };
            HistoryResponse response = historyManager.GetHistory(request);
            return new JsonResult { 
                Data = response
            };
        }

    }
}

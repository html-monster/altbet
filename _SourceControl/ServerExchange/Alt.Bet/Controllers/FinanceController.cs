using AltBet.BusinessLogic.Managers;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AltBet.Controllers
{
    public class FinanceController : Controller
    {
        //
        // GET: /Finance/

        private IBalanceManager balanceManager = null;
        //private ILogger logger = null;
        public FinanceController(IBalanceManager balanceManager)
        //public FinanceController(ILogger logger, IBalanceManager balanceManager)
        {
            //this.logger = logger;
            this.balanceManager = balanceManager;
        }

        public ActionResult Index()
        {
            try
            {                
                balanceManager.Add();
                
            }
            catch (Exception)
            {
                //GenerateException(ex)
            }

            return View();
        }

    }
}

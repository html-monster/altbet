using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AltBet.Controllers
{
    public class LandingController : _baseController
    {
        //
        // GET: /Landing/

        public ActionResult Index()
        {
            if (Request.Browser.IsMobileDevice)
            {
                return View("IndexMobile");
            }
            else
            {
                return View("Index");
            }            
        }

    }
}

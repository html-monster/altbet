using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AltBet.Exchange;
using AltBet.Exchange.Managers;

namespace AltBet.Admin.Controllers
{
    [Authorize]
    public class MenuController : Controller
    {
        //private readonly ICategoryManager _categoryManager;
        
        public MenuController()
        {
           //_categoryManager = categoryManager;
        }

        //
        // GET: /AdminMenu/

        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult GetMenuAdmin()
        {
            var model = new List<CategoryItem>();

            try
            {
                using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                {
                    model = categoryManagerClient.GetAllCategoryItem().ToList();
                }
            }
            catch (Exception ex) //TODO: need to specify exception type
            {
                ModelState.AddModelError(string.Empty, ex);
            }

            return PartialView("_GetMenuAdmin", model);
        }
    }
}

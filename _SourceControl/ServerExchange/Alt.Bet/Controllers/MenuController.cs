using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AltBet.Bet.Models;
using AltBet.Controllers;
using AltBet.Exchange.Managers;
using AltBet.Exchange;

namespace AltBet.Bet.Controllers
{
    public class MenuController : _baseController
    {
        //private readonly IExchangeManager _exchangeManager = null;
        //private readonly ICategoryManager _categoryManager = null;

        public MenuController()
        {
            //this._exchangeManager = exchangeManager;
            //this._categoryManager = categoryManager;
        }

        //
        // GET: /Menu/

        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult GetMenu()
        {
            var menu = new List<CategoryItem>();
            var exchanges = new List<ExchangeMenuModel>();

            try
            {
                //menu = _categoryManager.GetAllCategoryItem();
                using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                {
                    menu = categoryManagerClient.GetAllCategoryItem().ToList();
                }

                //var result = _exchangeManager.GetAllSymbolsAndOrders("closingsoon");
                var result = new List<AllSymbolsAndOrders>();
                using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                {
                    result = exchangeManagerClient.GetAllSymbolsAndOrders("closingsoon", null).ToList();
                }

                exchanges = result.Select(c => new ExchangeMenuModel
                                  {
                                      ExchangeUrl = c.Symbol.UrlExchange,
                                      CategoryId = c.Symbol.CategoryId,
                                      FullName = c.Symbol.FullName,
                                      Status = c.Symbol.Status,
                                      CategoryUrl = c.CategoryChain
                                  }).ToList();
            }
            catch (Exception ex) //TODO: need to specify exception type
            {
                ModelState.AddModelError(string.Empty, ex);
            }

            var model = new MenuViewModel
            {
                Exchanges = exchanges,
                Menu = menu
            };
            
            return PartialView("_GetMenu", model);
        }






        //private List<MenuItemViewModel> BuildMenu(Guid item, List<CategoryItem> categories)
        //{
        //    var menuItems = new List<MenuItemViewModel>();

        //    categories.Where(x => x.CatParentId == item).OrderBy(n => n.Number).ThenBy(c => c.CatName).ToList().ForEach(x =>
        //    {
        //        menuItems.Add(new MenuItemViewModel
        //        {
        //            Id = x.CatId,
        //            Name = x.CatName,
        //            Url = x.CatUrl,
        //            Icon = x.CatIcon,
        //            UrlChain = x.CatUrlChain,
        //            SubItems = BuildMenu(x.CatId, categories)
        //        });
        //    });

        //    return menuItems;
        //}

        //public MenuViewModel GetModel(Func<AdminExchange, bool> predicate = null)
        //{
        //    var menu = new List<MenuItemViewModel>();
        //    var exchanges = new List<ExchangeMenuModel>();

        //    try
        //    {
        //        var list = _categoryManager.GetAllCategoryItem();

        //        menu = BuildMenu(Guid.Empty, list);

        //        var result = _exchangeManager.GetExchanges();
        //        exchanges = result.Where(predicate ?? (m => true))
        //                          .Select(c => new ExchangeMenuModel
        //                                {
        //                                    ExchangeUrl = c.Symbol.UrlExchange,
        //                                    CategoryId = c.Symbol.CategoryId,
        //                                    FullName = c.Symbol.FullName,
        //                                    Status = c.Symbol.Status,
        //                                    CategoryList = c.CategoryList
        //                                }).ToList();

        //    }
        //    catch (Exception ex) //TODO: need to specify exception type
        //    {
        //        ModelState.AddModelError(string.Empty, ex);
        //    }

        //    var model = new MenuViewModel
        //    {
        //        Exchanges = exchanges,
        //        Menu = menu
        //    };
        //    return model;
        //}

        //[ChildActionOnly]
        //public ActionResult GetInPlay()
        //{
        //    return PartialView("_GetMenu");
        //}

        //[ChildActionOnly]
        //public ActionResult GetInPlay()
        //{
        //    var model = GetModel(s => s.Symbol.Status != string.Empty && string.Join("/", Enum.GetValues(typeof(StatusInPlay)).Cast<StatusInPlay>()).Contains(s.Symbol.Status) && s.Symbol.StartDate > DateTime.UtcNow);
        //    if (Request.Browser.IsMobileDevice)
        //    {
        //        return PartialView("_GetMenuMobile", model);
        //    }
        //    else
        //    {
        //        return PartialView("_GetMenu", model);
        //    }
        //}

        //[ChildActionOnly]
        //public ActionResult GetMenu()
        //{
        //    var model = GetModel(null);
        //    if (Request.Browser.IsMobileDevice)
        //    {
        //        return PartialView("_GetMenuMobile", model);
        //    }
        //    else
        //    {
        //        return PartialView("_GetMenu", model);
        //    }
        //}       
    }
}

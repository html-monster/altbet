using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AltBet.Exchange;
using AltBet.Exchange.Managers;

namespace AltBet.Admin.Controllers
{

    public class XmlSportController : Controller
    {
        //private readonly XmlContext _db = new XmlContext();
        //private IExchangeManager exchangeManager = null;
        
        //public XmlSportController(IExchangeManager exchangeManager)
        //{
        //    this.exchangeManager = exchangeManager;
        //}

        ////
        //// GET: /XmlSport/

        //public ActionResult Index()
        //{
        //    var model = _db.XmlFeedData.Where(s => (s.StatusExchange != "settlement") && (s.StatusExchange != "cancel")).ToList();
        //    return View(model);
        //}

        //[HttpGet]
        //public ActionResult Edit(Guid? id)
        //{
        //    XmlFeedData xfd = _db.XmlFeedData.Find(id);            
        //    if (xfd == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(xfd);
        //}

        //[HttpPost]
        //public ActionResult Edit(XmlFeedData model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var exchangeName = string.Format("{0}-{1}-{2}", model.HomeAlias, model.AwayAlias, model.StartDate.Date.ToShortDateString().Replace("/", "")); 
        //        try
        //        {
        //            AddExchangeRequest createRequest = new AddExchangeRequest
        //            {
        //                Exchange = new ExchangeSettings
        //                {
        //                    CommonCurrency = false,
        //                    Name = exchangeName,
        //                    Symbols = new List<Symbol>
        //                    {
        //                        new Symbol
        //                        {
        //                            Currency = "USD",
        //                            Exchange = exchangeName,
        //                            Name = string.Format("{0}-{1}", model.HomeAlias, model.AwayAlias),
        //                            FullName = string.Format("{0}_vs_{1}", model.HomeName, model.AwayName),
        //                            HomeName = model.HomeName,
        //                            HomeAlias = model.HomeAlias,
        //                            AwayName = model.AwayName,
        //                            AwayAlias = model.AwayAlias,
        //                            Status = model.Status,
        //                            StartDate = model.StartDate,
        //                            CategoryId = Guid.Empty,//add category!!!!
        //                            LastPrice = 0m,
        //                            LastAsk = 1m,
        //                            LastBid = 0m,
        //                            LastSide = null,
        //                            HomePoints = model.HomePoints,
        //                            HomeHandicap = model.HomeHandicap,
        //                            AwayPoints = model.AwayPoints,
        //                            AwayHandicap = model.AwayHandicap
        //                        }
        //                    },
        //                    StartTime = TimeSpan.FromMilliseconds(1),
        //                    StartDate = DateTime.UtcNow,
        //                    EndTime = new TimeSpan(0, 23, 59, 59, 999),
        //                    EndDate = model.StartDate

        //                }
        //            };
        //            exchangeManager.CreateExchange(createRequest);

        //            XmlFeedData xfd = _db.XmlFeedData.Find(model.Id);

        //            if (xfd.StatusExchange == null && xfd.NameExchange == null && xfd.StartDate > DateTime.UtcNow)
        //            {
        //                string[] arr = { "Sport", model.Sport, model.League };
                        
        //                //feedManager.CreateCategory(arr);

        //                xfd.StatusExchange = "created";
        //                xfd.NameExchange = exchangeName;
        //                xfd.LastEditedDate = DateTime.UtcNow;
        //                _db.Entry(xfd).State = EntityState.Modified;
        //                _db.SaveChanges();
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
        //        }
        //     }
        //    return RedirectToAction("Index");
        //}

        //public ActionResult Settlement(Guid id, DateTime startDate, string ddl)
        //{
        //    Result results = (Result)Enum.Parse(typeof(Result), ddl, true);
        //    try
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            var xfd = _db.XmlFeedData.Find(id);
        //            xfd.StatusExchange = "settlement";
        //            xfd.LastEditedDate = DateTime.UtcNow;
        //            _db.Entry(xfd).State = EntityState.Modified;
        //            _db.SaveChanges();

        //            //var exchangeName = feedManager.GetNameExchange(id);                   
                    
        //            CloseExchangeRequest closeRequest = new CloseExchangeRequest
        //            {
        //                Result = results,
        //                Exchange = new ExchangeSettings
        //                {
        //                    //Name = exchangeName,
        //                    EndDate = startDate.Date,
        //                    EndTime = startDate.TimeOfDay,
        //                    StartDate = DateTime.UtcNow.Date,
        //                    StartTime = DateTime.UtcNow.TimeOfDay
        //                }
        //            };
        //            exchangeManager.CloseExchange(closeRequest);
                    
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
        //    }           

        //    return RedirectToAction("Index");
        //}

        //public ActionResult Cancel(Guid id, DateTime startDate)
        //{
        //    try
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            var xfd = _db.XmlFeedData.Find(id);
        //            xfd.StatusExchange = "cancel";
        //            xfd.LastEditedDate = DateTime.UtcNow;
        //            _db.Entry(xfd).State = EntityState.Modified;
        //            _db.SaveChanges();

        //            //var exchangeName = feedManager.GetNameExchange(id);                    

        //            CloseExchangeRequest closeRequest = new CloseExchangeRequest
        //            {
        //                Result = Result.Emergency,
        //                Exchange = new ExchangeSettings
        //                {
        //                    //Name = exchangeName,
        //                    EndDate = startDate.Date,
        //                    EndTime = startDate.TimeOfDay,
        //                    StartDate = DateTime.UtcNow.Date,
        //                    StartTime = DateTime.UtcNow.TimeOfDay
        //                }
        //            };
        //            exchangeManager.CloseExchange(closeRequest);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
        //    }
        //    return RedirectToAction("Index");
        //}

        //public ActionResult Details()
        //{
        //    return View();
        //}       
    }
}

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AltBet.Admin.Models;
using AltBet.Exchange;
using AltBet.Exchange.Managers;
using Newtonsoft.Json;
using System.Net;
using System.IO;
using System.Text;
using System.Net.Http;
using System.ServiceModel;

namespace AltBet.Admin.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        //private readonly IExchangeManager _exchangeManager;
        //private readonly ICategoryManager _categoryManager;

        public HomeController()
        {
        }

        //FILTER AND SORTING EXCHANGE
        public ActionResult Index(MainViewModel model, int? page)
        {
            var result = new MainViewModel();

            try
            {
                var exchangeSort = new List<AdminExchange>();
                using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                {
                    //sorting
                    exchangeSort = !string.IsNullOrEmpty(model.SortBy)
                        ? exchangeManagerClient.GetSortExchanges(model.SortBy, model.Status).ToList()
                        : exchangeManagerClient.GetExchanges().Where(s => s.Symbol.Status == (model.Status ?? StatusEvent.Approved)).ToList();
                }

                //filter
                if (!string.IsNullOrEmpty(model.Path))
                {
                    exchangeSort = exchangeSort.Where(es => es.CategoryExchange.Contains(model.Path)).ToList();
                }

                var pageSize = 5;
                var pageInfo = new PageInfo(exchangeSort.Count, page, pageSize);
                var exchanges = exchangeSort.Skip((pageInfo.CurrentPage - 1) * pageInfo.PageSize).Take(pageInfo.PageSize).ToList();

                //model
                result = new MainViewModel
                {
                    Exchanges = exchanges,
                    Status = model.Status,
                    Path = model.Path,
                    LastNode = model.LastNode,
                    OrderBy = model.OrderBy == "Desc" ? "Asc" : "Desc",
                    SortBy = model.SortBy,
                    NameSort = string.Format("FullName{0}", model.OrderBy),
                    StartDateSort = string.Format("StartDate{0}", model.OrderBy),
                    EndDateSort = string.Format("EndDate{0}", model.OrderBy),
                    TimeZone = JsonConvert.SerializeObject(TimeZoneInfo.GetSystemTimeZones()),
                    PageInfo = pageInfo
                };
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex);
            }

            return View(result);
        }
       
        [ChildActionOnly]
        public ActionResult NewExchange(string path)
        {
            ViewBag.Url = path;
            return PartialView("_NewExchange");
        }

        public ActionResult EditExchange(string exchange)
        {
            var result = new List<AdminExchange>();
            using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
            {
                result = exchangeManagerClient.GetExchanges().Where(e => e.Symbol.Exchange == exchange).ToList();
            }
            return Json((object)result);
        }

        //CREATE EXCHANGE
        [HttpPost]
        public ActionResult CreateExchange(ExchangeViewModel model)
        {
            var result = "100";
            var exchangeName = string.Empty;
            var fullName = string.Empty;

            if (ModelState.IsValid)
            {
                var categoryId = new Guid();
                using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                {
                    categoryId = categoryManagerClient.GetCategoryByUrlChain(model.Category).CatId;
                }

                var startDate = (model.StartDate != null && model.EndDate != null) ? model.StartDate : DateTime.UtcNow;
                var endDate = (model.StartDate != null && model.EndDate != null) ? model.EndDate : model.StartDate ?? model.EndDate;
                exchangeName = string.Format("{0}-{1}-{2}", model.HomeAlias.ToUpper().Trim(), model.AwayAlias.ToUpper().Trim(), endDate.Value.ToShortDateString().Replace("/", ""));
                fullName = model.TypeEvent == TypeEvent.Full ? model.FullName : string.Format("{0}_vs_{1}", model.HomeName, model.AwayName);
                TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById(model.TimeZone);

                try
                {
                    AddExchangeRequest createRequest = new AddExchangeRequest
                    {
                        Exchange = new ExchangeSettings
                        {
                            CommonCurrency = false,
                            Name = exchangeName,
                            Symbols = new List<Symbol>
                                {
                                    new Symbol
                                    {
                                        Currency = "USD",
                                        Exchange = exchangeName,
                                        Name = string.Format("{0}-{1}", model.HomeAlias.ToUpper(), model.AwayAlias.ToUpper()),
                                        FullName = fullName, 
                                        HomeName = model.HomeName,
                                        HomeAlias = model.HomeAlias.ToUpper(),
                                        AwayName = model.AwayName,
                                        AwayAlias = model.AwayAlias.ToUpper(),
                                        Status = StatusEvent.New,
                                        StatusEvent = "scheduled",
                                        StartDate = model.StartDate != null ? ConvertToUtc((DateTime)model.StartDate, tzInfo) : model.StartDate,
                                        EndDate = model.EndDate != null ? ConvertToUtc((DateTime)model.EndDate, tzInfo) : model.EndDate,
                                        CategoryId = categoryId,
                                        TypeEvent = model.TypeEvent,
                                        UrlExchange = string.Format("{0}-{1}", model.UrlExchange, endDate.Value.ToShortDateString().Replace("/", "")), 
                                        ResultExchange = null,
                                        LastPrice = 0m,
                                        LastAsk = 1m,
                                        LastBid = 0m,
                                        LastSide = null,
                                        HomePoints = model.HomePoints,
                                        HomeHandicap = model.HomeHandicap != null ? Convert.ToDecimal(model.HomeHandicap.Replace(",", ".")) as decimal? : null, // refactoring globalization 
                                        AwayPoints = model.AwayPoints,
                                        AwayHandicap = model.AwayHandicap != null ? Convert.ToDecimal(model.AwayHandicap.Replace(",", ".")) as decimal? : null, // refactoring globalization 
                                        DelayTime = model.DelayTime
                                    }
                                },
                            StartTime = TimeSpan.FromMilliseconds(1),
                            StartDate = ConvertToUtc((DateTime)startDate, tzInfo),
                            EndTime = new TimeSpan(0, 23, 59, 59, 999),
                            EndDate = ConvertToUtc((DateTime)endDate, tzInfo)
                        }
                    };

                    using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                    {
                        result = exchangeManagerClient.CreateExchange(createRequest);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }
            
            return result == "200" ? Json(new { Error = result, Param1 = string.Format("?path={0}&status=New&lastnode=last-node", model.Category), Param2 = fullName, Param3 = exchangeName }) : Json(new { Error = result });
        }

        //EDIT EXCHANGE
        public ActionResult ChangeExchange(ExchangeViewModel model)
        {
            var result = "100";
            EditExchangeRequest editRequest = null; 
            
            if (ModelState.IsValid)
            {
                var startDate = (model.StartDate != null && model.EndDate != null) ? model.StartDate : DateTime.UtcNow;
                var endDate = (model.StartDate != null && model.EndDate != null) ? model.EndDate : model.StartDate ?? model.EndDate;
                TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById(model.TimeZone);

                try
                {
                    if (endDate != null)
                        editRequest = new EditExchangeRequest
                        {
                            Exchange = new ExchangeSettings
                            {
                                Name = model.Exchange,
                                Symbols = new List<Symbol>
                                {
                                    new Symbol
                                    {
                                        Name = model.Exchange,
                                        FullName = model.TypeEvent == TypeEvent.Full ? model.FullName : string.Format("{0}_vs_{1}", model.HomeName, model.AwayName),
                                        HomeName = model.HomeName,
                                        AwayName = model.AwayName,
                                        StartDate = model.StartDate != null ? ConvertToUtc((DateTime)model.StartDate, tzInfo) : model.StartDate,
                                        StartDateStr = model.StartDate != null ? ConvertToUtc((DateTime)model.StartDate, tzInfo).ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'") : null,
                                        EndDate = model.EndDate != null ? ConvertToUtc((DateTime)model.EndDate, tzInfo) : model.EndDate,
                                        EndDateStr = model.EndDate != null ? ConvertToUtc((DateTime)model.EndDate, tzInfo).ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'") : null,
                                        TypeEvent = model.TypeEvent,
                                        UrlExchange = model.UrlExchange,
                                        HomeHandicap = model.HomeHandicap != null ? Convert.ToDecimal(model.HomeHandicap.Replace(",", ".")) as decimal? : null, 
                                        AwayHandicap = model.AwayHandicap != null ? Convert.ToDecimal(model.AwayHandicap.Replace(",", ".")) as decimal? : null,
                                        DelayTime = model.DelayTime
                                    }
                                },
                                StartDate = ConvertToUtc((DateTime)startDate, tzInfo), 
                                EndDate = ConvertToUtc((DateTime)endDate, tzInfo) 
                            }
                        };
                    using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                    {
                        result = exchangeManagerClient.EditExchange(editRequest);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }

            return result == "200" ? Json(new { Error = result, ParamObj = editRequest }) : Json(new { Error = result });
        }

        //DELETE EXCHANGE
        public ActionResult RemoveExchange(string exchange)
        {
            var result = "100";

            if (!string.IsNullOrEmpty(exchange))
            {
                try
                {
                    using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                    {

                        result = exchangeManagerClient.DeleteExchange(exchange);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }

            return result == "200" ? Json(new { Error = result, Param1 = exchange }) : Json(new { Error = result });
        }

        //DETAILS EXCHANGE
        public ActionResult Details(string exchange)
        {
            //code...

            return Json(new { Ask = "0.24", Bid = "0.22", LastPrice = "0.23", AllPosition = "317", AllTrades = "325", Trade24h = "0", ApprovedDate = "3/12/2017 3:00:00 AM", SettlementDate = "3/29/2017 5:00:00 AM" });
        }

        //APPROVE EXCHANGE
        public ActionResult Approved(string exchange)
        {
            var result = "100";

            try
            {
                using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                {
                    result = exchangeManagerClient.ChangeStatus(new StatusExchangeRequest { Exchange = exchange, Status = StatusEvent.Approved });
                }                
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
            }
            
            return result == "200" ? Json(new { Error = result, Param1 = exchange }) : Json(new { Error = result });
        }

        //COMPLETE EXCHANGE
        public ActionResult Completed(string exchange)
        {
            var result = "100";

            try
            {
                using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                {
                    result = exchangeManagerClient.ChangeStatus(new StatusExchangeRequest { Exchange = exchange, Status = StatusEvent.Completed });
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
            }

            return result == "200" ? Json(new { Error = result, Param1 = exchange }) : Json(new { Error = result });
        }

        //SETTLEMENT EXCHANGE
        public ActionResult Settlement(string exchange, int percent, string win)
        {
            var response = "100";
            
            try
            {
                if (ModelState.IsValid)
                {
                    CloseExchangeRequest closeExchange = new CloseExchangeRequest
                    {
                        ExchangeName = exchange,
                        PositivePercent = percent,
                        Winner = win
                    };

                    using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
                    {
                        response = exchangeManagerClient.CloseExchange(closeExchange);
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
            }

            return response == "200" ? Json(new { Error = response, Param1 = exchange }) : Json(new { Error = response });
        }

        //move to manager
        public DateTime ConvertToUtc(DateTime date, TimeZoneInfo tzInfo)
        {
           return TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(date, DateTimeKind.Unspecified), tzInfo);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using AltBet.Admin.Managers;
using AltBet.Admin.Models;
using AltBet.Model.FeedModel;
using AltBet.Exchange;

namespace AltBet.Admin.Controllers
{
    [Authorize]
    public class FeedController : Controller
    {
        private readonly FeedContext _db = new FeedContext();
        private readonly IFeedManager _feedManager;

        public FeedController(IFeedManager feedManager)
        {
            _feedManager = feedManager;
        }

        public ActionResult Index()
        {
            return View();
        }

        //FILTER AND SORTING EVENTS
        [HttpGet]
        public ActionResult GetEvents(EventsViewModel model, int? page)
        {
            var feedEvent = _feedManager.GetFilterEvents(model);
            var allSport = _feedManager.GetAllSport(feedEvent);
            var allLeague = !string.IsNullOrEmpty(model.Sport) ? _feedManager.GetAllLeague(feedEvent) : null;

            var pageSize = 15;
            var pageInfo = new PageInfo(feedEvent.Count, page, pageSize);
            var events = feedEvent.Skip((pageInfo.CurrentPage - 1) * pageInfo.PageSize).Take(pageInfo.PageSize).ToList();

            var result = new EventsViewModel
            {
                FeedEvents = events,
                AllSport = allSport,
                AllLeague = allLeague,
                Sport = model.Sport,
                League = model.League,
                Sort = model.Sort,
                CurrentOrderBy = model.OrderBy,
                OrderBy = model.OrderBy == "Desc" ? "Asc" : "Desc",
                StartDateSort = string.Format("StartDate{0}", model.OrderBy),
                PageInfo = pageInfo
            };

            if (Request.IsAjaxRequest())
            {
                return Json(new { Error = 200, Model = result }, JsonRequestBehavior.AllowGet);
            }

            return PartialView(result);
        }

        //VIEW FORM EXCHANGE
        public ActionResult NewFeedExchange(FantasyViewModel model)
        {
            var result = new FantasyViewModel();

            if (ModelState.IsValid)
            {
                //refactoring 
                var feedEvent = _db.FeedEvents.Find(model.EventId);
                
                if (feedEvent != null)
                {
                    var categories = new List<CategoryItem>();

                    using (var categoryManagerClient = new CategoryServiceReference.CategoryManagerClient("BasicHttpBinding_ICategoryManager"))
                    {
                        categories = categoryManagerClient.GetAllCategoryItem().ToList();
                    }

                    var sport = categories.FirstOrDefault(s => s.CatName == feedEvent.Sport);
                    var league = categories.Where(l => sport != null && l.CatParentId == sport.CatId)
                                           .Select(s=> new Categories{ CategoryId = s.CatId, Name = s.CatName, ParentId = s.CatParentId, ParentName = sport.CatName, IsCurrent = s.CatName.Contains(feedEvent.League) })
                                           .ToList();
                   
                    var timeEvents = _feedManager.GetTimeEvents(feedEvent.Id, model.Period);
                    var positions = _feedManager.GetPositions(feedEvent.League);
                    var team = _feedManager.GetPlayersByEvent(model.EventId);

                    result = new FantasyViewModel
                    {
                        ErrorCode = sport != null ? "200" : "100",
                        EventId = model.EventId,
                        TeamId = model.TeamId,
                        Event = feedEvent,
                        TimeEvent = timeEvents,
                        Players = team, 
                        Positions = positions,
                        Categories = league
                    };
                }
            }
            return View(result);
        }
        
        //VIEW FORM EDIT EXCHANGE
        public ActionResult EditFeedExchange()
        {
            return Json(string.Empty);
        }

        //CREATE EXCHANGE
        public ActionResult CreateFeedExchange(ExchangeViewModel model)
        {
            var result = "100";
            //var exchanges = new List<ExchangeSettings>();

            //if (ModelState.IsValid)
            //{
            //    var strDate = model.StartDate.Value.ToShortDateString().Replace("/", "");

            //    try
            //    {
            //        foreach (OptionExchange option in Enum.GetValues(typeof(OptionExchange)))
            //        {
            //            var optionName = Enum.GetName(typeof(OptionExchange), option);

            //            exchanges.Add(new ExchangeSettings
            //            {
            //                CommonCurrency = false,
            //                Symbols = new List<Symbol>
            //                {
            //                    new Symbol
            //                    {
            //                        Currency = "USD",
            //                        Exchange = string.Format("{0}-{1}-{2}-{3}", model.HomeAlias, model.AwayAlias, optionName, strDate),
            //                        Name = string.Format("{0}-{1}-{2}", model.HomeAlias, model.AwayAlias, optionName),
            //                        FullName = model.FullName,
            //                        HomeName = model.HomeName,
            //                        HomeAlias = model.HomeAlias,
            //                        AwayName = model.AwayName,
            //                        AwayAlias = model.AwayAlias,
            //                        Status = StatusEvent.New,
            //                        StatusEvent = "scheduled",
            //                        StartDate = model.StartDate ?? model.StartDate,
            //                        EndDate = model.EndDate ?? model.EndDate,
            //                        CategoryId = model.CategoryId,
            //                        TypeEvent = TypeEvent.Fantasy,
            //                        UrlExchange = string.Format("{0}-{1}-{2}", model.UrlExchange, optionName, strDate),
            //                        ResultExchange = null,
            //                        LastPrice = 0m,
            //                        LastAsk = 1m,
            //                        LastBid = 0m,
            //                        LastSide = null,
            //                        HomePoints = null,
            //                        HomeHandicap = null,
            //                        AwayPoints = null,
            //                        AwayHandicap = null,
            //                        DelayTime = model.DelayTime,
            //                        OptionExchange = option,
            //                        HomeTeamId = Guid.NewGuid(),//homeTeamId,
            //                        AwayTeamId = Guid.NewGuid(),//awayTeamId,
            //                        HomeTeam = new List<CustomPlayers>(),
            //                        AwayTeam = new List<CustomPlayers>(),
            //                        EventId = model.EventId
            //                    }
            //                },
            //                StartTime = TimeSpan.FromMilliseconds(1),
            //                StartDate = DateTime.UtcNow,
            //                EndTime = new TimeSpan(0, 23, 59, 59, 999),
            //                EndDate = model.StartDate.Value.AddYears(1)
            //            });
            //        }

            //        using (var exchangeManagerClient = new ExchangeServiceReference.ExchangeManagerClient("BasicHttpBinding_IExchangeManager"))
            //        {
            //            result = exchangeManagerClient.CreateExchange(new AddExchangeRequest { Exchange = exchanges });
            //        }
            //    }
            //    catch (Exception ex)
            //    {
            //        ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
            //    }
            //}

            return Json(result);
        }

        //EDIT EXCHANGE
        public ActionResult ChangeFeedExchange()
        {
            return Json(string.Empty);
        }

        //GET PLAYERS
        public JsonResult GetPlayers(FantasyViewModel model)
        {
            var result = _feedManager.GetPlayersByEvent(model.EventId);

            return Json(new { Error = 200, Players = result });
        }

        //GET TIME EVENT
        public JsonResult GetTimeEvent(Guid eventId, int period)
        {
            var result = _feedManager.GetTimeEvents(eventId, period);

            return Json(new { Error = 200, TimeEvent = result });
        }
    }
}

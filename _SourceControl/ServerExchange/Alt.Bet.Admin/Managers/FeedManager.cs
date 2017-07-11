using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using AltBet.Admin.Models;
using AltBet.Model.FeedModel;

namespace AltBet.Admin.Managers
{
    public class FeedManager : IFeedManager
    {
        private readonly FeedContext _db = new FeedContext();
        
        public List<Events> GetFilterEvents(EventsViewModel model)
        {
            var result = _db.FeedEvents.ToList().Select(s => new Events
            {
                EventId = s.Id,
                Sport = s.Sport,
                League = s.League,
                Status = s.Status,
                StartDate = s.StartDate.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'"),
                FullName = s.FullNameEvent
            }).ToList();

            if (model != null)
            {
                if (!string.IsNullOrEmpty(model.Sport))
                {
                    result = result.Where(s => s.Sport == model.Sport).ToList();

                    if (!string.IsNullOrEmpty(model.League))
                    {
                        result = result.Where(l => l.League == model.League).ToList();
                    }
                }

                if (!string.IsNullOrEmpty(model.Sort))
                {
                    result = model.Sort == "StartDateDesc" ? result.OrderByDescending(d => d.StartDate).ToList() : result.OrderBy(a => a.StartDate).ToList();
                }
            }

            return result;
        }

        public List<string> GetAllSport(List<Events> feedEvent)
        {
            return feedEvent.Select(s => s.Sport).Distinct().OrderBy(n => n).ToList();
        }

        public List<string> GetAllLeague(List<Events> feedEvent)
        {
            return feedEvent.Select(l => l.League).Distinct().OrderBy(n => n).ToList();
        }

        public List<Player> GetPlayersByEvent(Guid eventId)
        {
            var result = _db.FeedEvents.Where(x => x.Id == eventId)
                                         .SelectMany(t => t.HomeTeam.FeedPlayers.Union(t.AwayTeam.FeedPlayers))
                                         .Where(p => p.FeedPosition.Index != -1)
                                         .OrderBy(n => n.FeedPosition.Index)
                                         .Select(p => new Player { Id = p.Id, TeamId = p.Team_Id, Team = p.FeedTeam.Alias, Index = p.FeedPosition.Index, Position = p.FeedPosition.Name, Name = p.FullName, Status = p.Status })
                                         .ToList();
            return result;
        }

        public List<Position> GetPositions(string league)
        {
            var result = new List<Position>();

            var doc = XDocument.Load(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Positions.xml"));
            var element = doc.Element("positions").Elements("league");
            var isLeague = element.Any(x => x.Attribute("name").Value == league);

            if (!isLeague) return result;
            
            var elements = element.SingleOrDefault(x => x.Attribute("name").Value == league).Elements();
            elements.ToList().ForEach(position =>
            {
                var locks = new List<string>();
                if (position.Elements("locks").Any())
                    position.Element("locks").Elements().ToList().ForEach(pos => { locks.Add(pos.Value); });

                var positionObj = new Position
                {
                    Name = position.Attribute("name").Value,
                    Index = Convert.ToInt32(position.Element("index").Value),
                    Quantity = Convert.ToInt32(position.Element("quantity").Value),
                    Locks = locks
                };

                result.Add(positionObj);
            });

            return result;
        }

        public List<TimeEvent> GetTimeEvents(Guid eventId, int period)
        {
            var result = new List<TimeEvent>();

            var feedEvent = _db.FeedEvents.Find(eventId);

            if (feedEvent == null) return result;

            var filterByHour = period == 0
                ? feedEvent.StartDate.AddMinutes(1)
                : feedEvent.StartDate.AddHours(period);

            result = _db.FeedEvents.ToList().Where(d => d.StartDate >= feedEvent.StartDate && d.StartDate <= filterByHour)
                        .Select(t => new TimeEvent
                        {
                            EventId = t.Id,
                            HomeId = t.HomeTeam.Id,
                            AwayId = t.HomeTeam.Id,
                            HomeTeam = t.HomeTeam.Fullname,
                            AwayTeam = t.AwayTeam.Fullname,
                            StartDate = t.StartDate.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'")
                        }).ToList();

            return result;
        }
    }
}
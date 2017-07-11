using System;
using System.Collections.Generic;
using System.Linq;
using AltBet.Admin.Models;
using AltBet.Model.FeedModel;

namespace AltBet.Admin.Managers
{
    public interface IFeedManager
    {
        List<Events> GetFilterEvents(EventsViewModel model);
        List<string> GetAllSport(List<Events> feedEvents);
        List<string> GetAllLeague(List<Events> feedEvents);
        List<Player> GetPlayersByEvent(Guid eventId);
        List<Position> GetPositions(string league);
        List<TimeEvent> GetTimeEvents(Guid eventId, int period);
    }
}

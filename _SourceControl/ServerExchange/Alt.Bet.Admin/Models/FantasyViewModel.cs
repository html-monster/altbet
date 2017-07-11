using System;
using System.Collections.Generic;
using AltBet.Model.FeedModel;

namespace AltBet.Admin.Models
{
    public class FantasyViewModel
    {
        public string ErrorCode { get; set; }
        public Guid EventId { get; set; }
        public Guid? TeamId { get; set; }
        public FeedEvent Event { get; set; }
        public int Period { get; set; }
        public List<TimeEvent> TimeEvent { get; set; }
        public List<Player> Players { get; set; }
        public List<Position> Positions { get; set; }
        public List<Categories> Categories { get; set; }
    }

    public class TimeEvent
    {
        public Guid EventId { get; set; }
        public string StartDate{ get; set; }
        public Guid HomeId { get; set; }
        public Guid AwayId { get; set; }
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
    }

    public class Position
    {
        public string Name { get; set; }
        public int Index { get; set; }
        public int Quantity { get; set; }
        public List<string> Locks { get; set; }
    }

    public class Player
    {
        public Guid Id { get; set; }
        public string Position { get; set; }
        public int Index { get; set; }
        public Guid TeamId { get; set; }
        public string Team { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
    }

    public class Categories
    {
        public Guid CategoryId { get; set; }
        public string Name { get; set; }
        public Guid ParentId { get; set; }
        public string ParentName { get; set; }
        public bool IsCurrent { get; set; }

    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using AltBet.Exchange;

namespace AltBet.Admin.Models
{
    public enum EventStatus
    {
        //The game is scheduled to occur
        scheduled,

        //The game has been created and we have begun logging information
        created,

        //The game is in progress.
        inprogress,

        //The game is currently at halftime
        halftime,

        //The game is over, but stat validation is not complete
        complete,

        //The game is over and the stats have been validated.
        closed,

        //The game has been cancelled. 
        cancelled,

        //The start of the game is currently delayed or the game has gone from in progress to delayed for some reason
        delayed,

        //The game has been postponed, to be made up at another day and time.
        postponed,
        
        //The series game was scheduled to occur, but will not take place due to one teamclinching the series early.
        unnecessary,

        //The game has been scheduled, but a time has yet to be announced.
        timetbd,
    }

    public enum ViewSstatus
    {
        New,
        Approved,
        Settelment
    }

  

    [Table("XmlFeedData")]
    public class XmlFeedData
    {
        public Guid Id { get; set; }

        [StringLength(50)]
        public string Sport { get; set; }

        [StringLength(50)]
        public string League { get; set; }

        public DateTime StartDate { get; set; }

        [StringLength(50)]
        public string HomeName { get; set; }

        [StringLength(10)]
        public string HomeAlias { get; set; }

        public decimal? HomePoints { get; set; }

        public decimal? HomeHandicap { get; set; }

        [StringLength(50)]
        public string AwayName { get; set; }

        [StringLength(10)]
        public string AwayAlias { get; set; }

        public decimal? AwayPoints { get; set; }

        public decimal? AwayHandicap { get; set; }

        public Guid GameId { get; set; }

        [StringLength(20)]
        public string Status { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime LastEditedDate { get; set; }

        [StringLength(20)]
        public string StatusExchange { get; set; }

        [StringLength(50)]
        public string NameExchange { get; set; }

        [NotMapped]
        public string StatusExchangeView 
        {             
            get
            {
                if (NameExchange == null)
                {
                    return ViewSstatus.New.ToString("g");
                }
                else if (StatusExchange == "created" && Status == "closed")
                {
                    return ViewSstatus.Settelment.ToString("g");                    
                }
                else
                {
                    return ViewSstatus.Approved.ToString("g");
                }
            } 
        }
    }
}
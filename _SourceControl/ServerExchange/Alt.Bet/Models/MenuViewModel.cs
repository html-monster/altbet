using System;
using System.Collections.Generic;
using AltBet.Exchange;

namespace AltBet.Bet.Models
{
    //public enum StatusInPlay
    //{
    //    inprogress,
    //    halftime
    //}

    //public class MenuItemViewModel
    //{
    //    public Guid Id { get; set; }
    //    public string Name { get; set; }
    //    public int Number { get; set; }
    //    public string Url { get; set; }
    //    public string Icon { get; set; }
    //    public string UrlChain { get; set; }
    //    public List<MenuItemViewModel> SubItems { get; set; }
    //}

    public class ExchangeMenuModel
    {
        public Guid CategoryId { get; set; }
        public string FullName { get; set; }
        public string ExchangeUrl { get; set; }
        public string CategoryUrl { get; set; }
        public StatusEvent Status { get; set; }
    }

    public class MenuViewModel
    {
        public List<ExchangeMenuModel> Exchanges { get; set; }
        public List<AltBet.Exchange.CategoryItem> Menu { get; set; }
        //public List<MenuItemViewModel> Menu { get; set; }
    }

}
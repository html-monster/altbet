using AltBet.App_Start;
using AltBet.Exchange;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AltBet.Models
{
    public class MainPageModel
    {
        public Pagination Pagination { get; set; }
        public List<AllSymbolsAndOrders> Data { get; set; }
    }
}
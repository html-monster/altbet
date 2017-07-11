using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AltBet.Exchange;
using AltBet.Model;
using Symbol = AltBet.Exchange.Symbol;

namespace AltBet.Bet.Models
{
    public class EventViewModel
    {
        public AllSymbolsAndOrders SymbolsAndOrders { get; set; }
        public GetOrdersResponse OrderResponse { get; set; }
        public string IsMirrorName { get; set; }
        public long SumVolume { get; set; }
       
        public bool IsMirror { get; set; }
    }
}
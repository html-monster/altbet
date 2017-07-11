using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AltBet.Bet.Models
{
    public class OrderViewModel
    {
        public string Side { get; set; }
        public bool OrderType { get; set; }
        [Required]
        [Range(0,0.99)]
        public decimal LimitPrice { get; set; }
        [Required]
        [Range(0, 9999999999999999999)]
        public int Quantity { get; set; }
        public string Symbol { get; set; }
        public string isMirror { get; set; }
    }

    public class MarketOrderViewModel
    {
        public string Side { get; set; }
        [Required]
        [Range(0, 9999999999999999999)]
        public int Quantity { get; set; }
        public string Symbol { get; set; }
        public string isMirror { get; set; }
    }

    public class SpreaderViewModel
    {
        [Required]
        [Range(0, 0.99)]
        public decimal SellOrderLimitPrice { get; set; }
        [Required]
        [Range(0, 9999999999999999999)]
        public int SellOrderQuantity { get; set; }
        [Required]
        [Range(0, 0.99)]
        public decimal BuyOrderLimitPrice { get; set; }
        public int BuyOrderQuantity { get; set; }
        public string Symbol { get; set; }
        public string isMirror { get; set; }
    }

    public class EditOrderViewModel : OrderViewModel
    {
        public string ID { get; set; }
    }

    public class DragAndDropCancelOrders
    {
        public string UserName { get; set; }
        public string Symbol { get; set; }
        public string Side { get; set; }
        public decimal OldPrice { get; set; }
        public int isMirror { get; set; }
    }


}
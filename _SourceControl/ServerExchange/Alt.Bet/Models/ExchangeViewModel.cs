using AltBet.Exchange;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AltBet.Bet.Models
{
    public class ExchangeViewModel
    {
        [Required(ErrorMessage = "Exchange name is required field")]
        [RegularExpression("[A-Za-z0-9/]*", ErrorMessage = "Invalid exchange name")]
        public string ExchangeName { get; set; }

        [Required(ErrorMessage = "Symbol name is required field")]
        [RegularExpression("[A-Za-z0-9/]*", ErrorMessage = "Invalid symbol name")]
        public string SymbolName { get; set; }

        public List<AdminExchange> Exchanges { get; set; }
    }
}
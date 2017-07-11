using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AltBet.Exchange;

namespace AltBet.Admin.Models
{
    public class MainViewModel
    {
        public MainViewModel()
        {
            SortBy = "FullNameAsc";
            OrderBy = "Desc";
        }

        public List<AdminExchange> Exchanges { get; set; }
        public StatusEvent? Status { get; set; }
        public string Path { get; set; }
        public string LastNode { get; set; }
        public string NameSort { get; set; }
        public string StartDateSort { get; set; }
        public string EndDateSort { get; set; }
        public string SortBy { get; set; }
        public string OrderBy { get; set; }
        public string TimeZone { get; set; }
        public PageInfo PageInfo { get; set; }
    }
}
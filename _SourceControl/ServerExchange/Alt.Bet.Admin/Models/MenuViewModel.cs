using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AltBet.Exchange;

namespace AltBet.Admin.Models
{
    //public class MenuItemViewModel
    //{
    //    public Guid Id { get; set; }
    //    public string Name { get; set; }
    //    public int Number { get; set; }
    //    public List<MenuItemViewModel> SubItems { get; set; }
    //}

    public class ExchangeMenuModel
    {
        public Guid CategoryId { get; set; }
        public string FullName { get; set; }
        public string Exchange { get; set; }
        public string CategoryList { get; set; }
        public string Status { get; set; }
    }

    public class MenuViewModel
    {
        public List<ExchangeMenuModel> Exchanges { get; set; }
        public List<CategoryItem> Menu { get; set; }
    }
}
using AltBet.Exchange;
using AltBet.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AltBet.Bet.Models
{
    public class CommonModel
    {
        private static CommonModel instance;

        //public AltBet.Model.User User { get; set; }
        public UserViewModel NewUser { get; set; }

        public LoginUserViewModel LoginUser { get; set; }

        public OrderViewModel NewOrder { get; set; }
        
        public GetOrdersResponse Orders { get; set; }

        public ExchangeViewModel Exchanges { get; set; }

        public static CommonModel Instance
        {
            get
            {
                if(instance == null)
                {
                    instance = new CommonModel();
                }
                return instance;
            }
        }


    }
}
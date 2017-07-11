using AltBet.Exchange;
using AltBet.Exchange.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace AltBet.ExchangeServices.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "BalanceService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select BalanceService.svc or BalanceService.svc.cs at the Solution Explorer and start debugging.
    public class BalanceService : IBalanceManager
    {
        private UserAssets _userAssets = new UserAssets();

        public UserAssets GetCurrentUserAssets(string userName)
        {
            return CommonManager.Server.GetUserBalanceRequestMethod(new GetUserBalanceRequest { UserName = userName });
        }
    }
}

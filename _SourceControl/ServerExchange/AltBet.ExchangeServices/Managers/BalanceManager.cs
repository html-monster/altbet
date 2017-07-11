//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace AltBet.Exchange.Managers
//{
//    public class BalanceManager : IBalanceManager
//    {
//        private UserAssets _userAssets = new UserAssets();

//        public UserAssets GetCurrentUserAssets(string userName)
//        {
//            return CommonManager.Server.GetUserBalanceRequestMethod(new GetUserBalanceRequest { UserName = userName });
//        }
//    }
//}

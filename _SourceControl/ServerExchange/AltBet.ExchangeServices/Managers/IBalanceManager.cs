using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;

namespace AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface IBalanceManager
    {
        [OperationContract]
        UserAssets GetCurrentUserAssets(string userName);
    }
}

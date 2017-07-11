using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AltBet.Model;
using AltBet.Model.Finances.NetellerModels;
using AltBet.Model.Finances.SkrillModels;
using System.ServiceModel;

namespace AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface IPaymentManager
    {
        [OperationContract]
        Payment NetellerOut(TransferOut model);

        [OperationContract]
        Payment NetellerIn(TransferIn model);

        [OperationContract]
        SkrillAnswer SkrillStatus(SkrillStatus model);

        [OperationContract]
        SkrillOutResponse SkrillOut(SkrillOutRequest model);

        [OperationContract]
        SkrillAnswer SkrillIn(SkrillInRequest model);

        [OperationContract]
        SkrillAnswer SkrillOtherIn (SkrillInRequest model);

        [OperationContract]
        bool SkrillCancel(string id);

        [OperationContract]
        bool ChangeBalance(string username, decimal amount, byte addOrGet);

        [OperationContract]
        bool InsertHistory(decimal amount, string systemtype, DateTime date, string direction, string userId, string transactId,string status);

        [OperationContract]
        bool UpdateHistory(decimal amount, DateTime date, string transactId, string status);

        [OperationContract]
        string GetUsernameFromTransactId(string transactionId);

    }

}

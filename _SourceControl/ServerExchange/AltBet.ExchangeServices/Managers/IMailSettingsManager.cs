using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AltBet.Model;
using System.ServiceModel;

namespace AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface IMailSettingsManager
    {
        [OperationContract]
        void MailChimpSubscribe(string email);

        [OperationContract]
        void MailChimpUnsubscribe(string email);

        [OperationContract]
        void MailChimpSettings(string email,Model.User settings);

        [OperationContract]
        string GetLinkForForm();
    }
}

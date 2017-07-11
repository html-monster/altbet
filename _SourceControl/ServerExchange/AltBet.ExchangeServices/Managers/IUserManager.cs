using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AltBet.Model;
using System.ServiceModel;
using AltBet.ExchangeServices.Services;
using GIDX.SDK.Models;
using GIDX.SDK.Models.WebReg;
using GIDX.SDK.Models.WebCashier;

namespace  AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface IUserManager
    {
        [OperationContract]
        Registration Register(Model.User user);

        [OperationContract]
        UserNewHashCodeResponse GenerateNewConfirmationHash(string userName, string confirmationCode, bool trustedUser);

        [OperationContract]
        Authorization Login(string userName, string password, string currentPage, string browser, string ip);

        [OperationContract]
        void Logout(string user, string browser, string ip);

        [OperationContract]
        UserConfirmationResponse Confirm(string userName, string confirmationCode, bool trustedUser);

        [OperationContract]
        User GetUserInfo(string userName);

        [OperationContract]
        User GetUserInfoByEmail(string email);

        [OperationContract]
        string EditUserInfo(Model.User user);

        [OperationContract]
        string EditPreferences(Model.User user);

        [OperationContract]
        string EditUserTheme(string userName, string theme);

        [OperationContract]
        ResultObj ChangePassword(string userName, string oldPassword, string newPassword);

        [OperationContract]
        Authorization LoginAdmin(string userName, string password);

        [OperationContract]
        void LogoutAdmin(string user);

        [OperationContract]
        string GetLocation(string ip);

        [OperationContract]
        void UnsubscribeMail(string name, string type, string id);
        
        [OperationContract]
        void PushSubscribe(PushSettings model);

        [OperationContract]
        GIDX.SDK.Models.WebReg.CreateSessionResponse GidxCreateSession(string user, string ip);   
        
        [OperationContract]
        GIDX.SDK.Models.WebCashier.CreateSessionResponse GidxCreateWebCashier(string user, string ipAddr, PayActionCode payCode, decimal? amount);

        [OperationContract]
        GIDX.SDK.Models.WebReg.SessionStatusCallbackResponse GidxCallbackResponse(string str);
        
        [OperationContract]
        GIDX.SDK.Models.WebCashier.SessionStatusCallbackResponse GidxCallbackWebCashier(string callback);

        //[OperationContract]
        //GIDX.SDK.Models.WebCashier.PaymentDetailResponse GidxPaymentDetail(string userName);

        [OperationContract]
        GIDX.SDK.Models.WebReg.RegistrationStatusResponse GidxGetSessionStatus(string user);

        [OperationContract]
        bool GidxNotification(GidxNotification data);
        
        [OperationContract]
        GIDX.SDK.Models.WebReg.CustomerRegistrationResponse GidxCustomerRegistration(string userName);

        [OperationContract]
        string GidxUploadDocument(string userName, string urlToFile);

        [OperationContract]
        bool IsUserVerified(string username);

        [OperationContract]
        CreateSessionWebWalletResponse GidxWebWallet(string userName);

    }
}

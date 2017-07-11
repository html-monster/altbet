//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Net;
//using System.Security.Cryptography;
//using System.Text;
//using System.Threading.Tasks;
//using System.Web;
//using System.Xml;
//using AltBet.ExchangeServices.Utils.FinanceServices.Neteller;
//using AltBet.ExchangeServices.Utils.FinanceServices.Skrill;
//using AltBet.Model.Finances.NetellerModels;
//using AltBet.Model.Finances.SkrillModels;

//namespace AltBet.Exchange.Managers
//{
//    public class PaymentManager:IPaymentManager
//    {

//        //string Endpoint { get { return "https://www.skrill.com/app/pay.pl"; } }
//        string LogoPath { get {return "Images/logofskrill.svg";}}

//        private string EmailSkrill { get { return SkrillConfiguration.Paytoemail; } }

//        private string Endpoint { get { return SkrillConfiguration.Endpoint; } }

//        private string EndpointForTransferOut { get { return SkrillConfiguration.EndpointForTransferOut; } }

//        private string Return_url { get { return string.Empty; } }


//        //public PaymentManager(HttpContext context)
//        //{
//        //    Path = new UriBuilder(context.Request.Url.Scheme, context.Request.Url.Host, -1, context.Request.ApplicationPath).Uri.AbsoluteUri;
//        //}



//        public SkrillAnswer SkrillIn(SkrillInRequest model)
//        {
//            SkrillAnswer url = null;
//            string _guid = Guid.NewGuid().ToString();
//            string returnUrl = String.Format("{0}/{1}", model.Path, "Account");
//            string statusUrl = String.Format("{0}/{1}", model.Path, "Payment/SkrillStatus");
//            string cancelUrl = String.Format("{0}/{1}?id={2}", model.Path, "Payment/SkrillCancel", _guid);
//            var logo = String.Format("{0}/{1}", model.Path, "Images/logofskrill.svg");
            
//            string data = String.Format( //&payment_methods=NTL
//                "pay_to_email={0}&language=EN&amount={1}&currency=USD&detail1_description=desciption&detail1_text=detailed text123&transaction_id={2}&pay_from_email={3}&status_url={4}&cancel_url={5}&return_url={6}&logo_url={7}"
//                , EmailSkrill, model.Sum, _guid, model.ClientId, statusUrl, cancelUrl, returnUrl, logo);

//            try
//            {
//                var response = SkrillPostRequest(data);

//                var req = new HttpWebResponseResult();

//                url = req.GetUrlForRedirect(response);

//                Log.WritePaymentInfo(
//                    String.Format("SKRILL REQUEST IN  ---> transaction_id = {0}| amount: {1} | Skrill Name: {2}", _guid,
//                        model.Sum, model.ClientId), model.Name);
//                bool addFirstStepHistory = InsertHistory(model.Sum, "Skrill", DateTime.Now, "Deposit", model.Name, _guid,
//                    "Waiting");
               
//            }
//            catch (Exception ex)
//            {
//                //if the account used is not a merchant a bad request exception is thrown
//                Log.WritePaymentInfo(String.Format("SKRILL REQUEST IN  ERROR ---> error:{0} transaction_id = {1}| amount: {2} | Skrill Name: {3}", ex, _guid, model.Sum, model.ClientId), model.Name);
//                return new SkrillAnswer { Code = "404", Message = "error while getting response from Skrill" };
//            }

//            return url;
//        }


//        public SkrillAnswer SkrillOtherIn(SkrillInRequest model)
//        {
//            SkrillAnswer url = null;
//            string _guid = Guid.NewGuid().ToString();
//            string returnUrl = String.Format("{0}/{1}", model.Path, "Account");
//            string statusUrl = String.Format("{0}/{1}", model.Path, "Payment/SkrillStatus");
//            string cancelUrl = String.Format("{0}/{1}?id={2}", model.Path, "Payment/SkrillCancel", _guid);
//            var logo = String.Format("{0}/{1}", model.Path, "Images/logofskrill.svg");

//            //замена названия типа валюты для записи в Хистори
//            Dictionary<string, string> paymentTypes = new Dictionary<string, string>
//            {
//                {"ACC","CreditCardSkrill"},
//                {"VSA","VisaSkrill"},
//                {"MSC","MasterCardSkrill"},
//                {"VSE","VisaElectronSkrill"},
//                {"BTC","BitPaySkrill"},
//            };

//            string inputPaymentType = model.PaymentType;
//            var outputPaymentType = new StringBuilder(inputPaymentType);

//            foreach (var re in paymentTypes)
//            {
//                outputPaymentType.Replace(re.Key, re.Value);
//            }
//            var replacedPaymentType = outputPaymentType.ToString();


//            string data =
//              string.Format(
//                   "pay_to_email={0}&payment_methods={1}&language=EN&amount={2}&currency=USD&detail1_description=desciption&detail1_text=detailed text&transaction_id={3}&pay_from_email={4}&status_url={5}&cancel_url={6}&return_url={7}"
//                   , EmailSkrill, model.PaymentType, model.Sum.ToString(), _guid, model.ClientId, statusUrl, cancelUrl, returnUrl);
//            try
//            {
//                var response = SkrillPostRequest(data);
//                var req = new HttpWebResponseResult();
//                url = req.GetUrlForRedirect(response);

//                Log.WritePaymentInfo(String.Format("SKRILL Other ({0}) REQUEST IN  ---> transaction_id = {1} | amount: {2} | OtherPaymentSkrill Name: {3}",model.PaymentType, _guid, model.Sum, model.ClientId), model.Name);
//                InsertHistory(model.Sum, replacedPaymentType, DateTime.Now, "Deposit", model.Name, _guid, "Waiting");
//            }
//            catch (Exception ex)
//            {
//                Log.WritePaymentInfo(String.Format("SKRILL Other ({0}) REQUEST IN  ERROR ---> error:{1} transaction_id = {2}| amount: {3} | Skrill Name: {4}",model.PaymentType , ex, _guid, model.Sum, model.ClientId), model.Name);
//                return new SkrillAnswer { Code = "404", Message = "error while getting response from Skrill" };
//            }
            
                
//            return url;

          
//           // return new SkrillAnswer();
//        }




//        public SkrillOutResponse SkrillOut(SkrillOutRequest model)
//        {
//            SkrillOutResponse result = null;
//            BalanceManager balance = new BalanceManager();
//            var currentBalance = balance.GetCurrentUserAssets(model.Name);

//            if (currentBalance.CurrentBalance < model.Sum)
//            {
//                Log.WritePaymentInfo("SKRILL OUT  ---> code 556, You don`t have enough money in your Alt.bet account", model.Name);
//                return (new SkrillOutResponse
//                {
//                    SkrillAnswer = new SkrillAnswer
//                    {
//                        Code = "556",
//                        Message = "You don`t have enough money in your Alt.bet account"
//                    }

//                });
//            }

//              string apiPassword = StringToMD5(SkrillConfiguration.Password);
//              string amount = model.Sum.ToString();
//              string email = model.EmailTo;

//              string data = String.Format("action=prepare&email={0}&password={1}&amount={2}&currency=USD&bnf_email={3}&subject=Money From ALTBET&note=some_note", EmailSkrill, apiPassword, amount, email);
                
//              //Response Handler
//                ResultXml sidRequest = GetSID(data, model.Name);
//                if (sidRequest.error != null)
//                {
//                    Log.WritePaymentInfo("SKRILL OUT --> error while getting SID: " + sidRequest.error, model.Name);
//                    result = new SkrillOutResponse { error = "error while getting SID: " + sidRequest.error };
//                    return result;
//                }
               
//                    var transferData = string.Format("action=transfer&sid={0}", sidRequest.sid);
//                    result = MakeTransfer(transferData, model.Name);

//                    if (result.status == "2" || result.status == "1")
//                    {
//                        decimal price = result.amount;

//                        PaymentManager paymentManager = new PaymentManager();
//                        bool addResult = paymentManager.ChangeBalance(model.Name, price, 1);
//                        if (addResult == false)
//                        {
//                            throw new ApplicationException("Invalid withdraw money operation");
//                        }

//                        bool addFirstStepHistory = paymentManager.InsertHistory(result.amount, "Skrill", DateTime.Now, "Withdraw", model.Name, result.transactionId, "Processed");

//                        if (addFirstStepHistory == false)
//                        {
//                            throw new ApplicationException("Invalid withdraw paymentHistory OUT operation");
//                        }

//                    }
            
//                    Log.WritePaymentInfo("SKRILL OUT --> id: " + result.transactionId + " | amount: " + result.amount + " | status msg: " + result.status_msg, model.Name);
//                    return result;
 
//        }

//        public SkrillAnswer SkrillStatus(SkrillStatus model)
//        {
//            string username = GetUsernameFromTransactId(model.transaction_id);

//            //validate the Skrill signature
//            var concat = String.Concat(model.merchant_id, model.transaction_id,
//                StringToMD5(SkrillConfiguration.SecretWord), model.mb_amount, model.mb_currency,
//                model.status);

//            if (!model.md5sig.Equals(StringToMD5(concat)))
//            {
//                var error = String.Format("SKRILL --> md5sig is not equal with another side! concat={0}, md5Sig={1}",
//                    concat, model.md5sig);
//                Log.WritePaymentInfo(error, username);

//                return new SkrillAnswer{Code = "400"};
//            }

//            //check ANSWER status
//            var answer = "";

//            switch (Convert.ToInt32(model.status))
//            {
//                case 2:
//                    answer = "Processed";
//                    // add Money to Account
//                    bool addResult = ChangeBalance(username, Convert.ToDecimal(model.mb_amount), 0);
//                        // 0 - deposit , 1 - withdraw 
//                    if (addResult == false)
//                    {
//                        throw new ApplicationException("Invalid add money operation");
//                    }

//                    break;
//                case 0:
//                    answer = "Pending";
//                    break;
//                case -1:
//                    answer = "Cancelled";
//                    break;
//                case -2:
//                    answer = "Failed";
//                    break;
//                case -3:
//                    answer = "Chargeback";
//                    break;
//            }


//            Log.WritePaymentInfo(
//                String.Format("SKRILL RESPONSE  ---> transaction_id = {0} | Code is: {1}", model.transaction_id,
//                    model.status), username);

//            UpdateHistory(Convert.ToDecimal(model.mb_amount), DateTime.Now, model.transaction_id, answer);

//            return new SkrillAnswer(){Code = "200"};

//        }

//        public bool SkrillCancel(string id)
//        {
//            var username = GetUsernameFromTransactId(id);
//            var result = UpdateHistory(0,DateTime.Now , id, "Cancelled");
//            if (result == true) { Log.WritePaymentInfo(String.Format("The payment (id: {0}) was CANCELLED by User",id),username );}
//            return result;
//        }

//        //--------------Neteller---------------------------


//        public Payment NetellerIn(TransferIn model)
//        {
//            NetellerApi netellerApi = new NetellerApi(NetellerEnvironment.Test);

//            var result = netellerApi.TransferIn(model);
            
//                        if (result.Answer.code == "200")
//                        {
//                            var fee = result.Transaction.fees.FirstOrDefault() != null ? result.Transaction.fees.FirstOrDefault().FeeAmount : 0;

//                            var price = (Convert.ToDecimal(result.Transaction.amount) / 100 ) - (Convert.ToDecimal(fee) / 100);

//                            bool addResult = ChangeBalance(model.name, price, 0); //0 - deposit , 1 - withdraw 
//                            if (addResult == false)
//                            {
//                                throw new ApplicationException("Invalid add money operation");
//                            }
                            
//                            bool addHistory = InsertHistory(price, "Neteller", Convert.ToDateTime(result.Transaction.createDate), "Deposit", model.name, result.Transaction.id, "Processed");
                                
//                                if (addHistory == false)
//                                {
//                                    Log.WritePaymentInfo("Neteller Add History ERROR",model.name);
//                                    throw new ApplicationException("Invalid add paymentHistory IN operation");
//                                }
//                        }
//            return result;
//        }


//        public Payment NetellerOut(TransferOut model)
//        {
//            NetellerApi netellerApi = new NetellerApi(NetellerEnvironment.Test);
//            BalanceManager balance = new BalanceManager();
            

//            var currentBalance = balance.GetCurrentUserAssets(model.name);

//            if (currentBalance.CurrentBalance < (Convert.ToDecimal(model.transaction.amount) / 100))
//            {
//                Log.WritePaymentInfo("Neteller OUT  ---> code 556, You don`t have enough money in your Alt.bet account", model.name);
//                return new Payment
//                {
//                    Answer = new Answer
//                    {
//                        code = "556",
//                        message = "You don`t have enough money in your Alt.bet account"
//                    }

//                };
//            }

//            var result = netellerApi.TransferOut(model);
//            if (result.Answer.code == "200")
//            {
//                decimal price = Convert.ToDecimal(result.Transaction.amount)/100;
//                bool addResult = ChangeBalance(model.name, price, 1);
//                if (addResult == false)
//                {
//                    throw new ApplicationException("Invalid add money operation");
//                }

//                bool addHistory = InsertHistory(price, "Neteller", Convert.ToDateTime(result.Transaction.createDate), "Withdraw", model.name, result.Transaction.id, "Processed");
//                if (addHistory == false)
//                {
//                    throw new ApplicationException("Invalid add paymentHistory OUT operation");
//                }
//            }

//            return result;
//        }


//        //---------------------------------------------------------
//        private ResultXml GetSID(string data, string name)
//        {
//            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(EndpointForTransferOut);

//            httpRequest.Method = "POST";
//            httpRequest.ContentType = "application/x-www-form-urlencoded";
            
//            using (StreamWriter writer = new StreamWriter(httpRequest.GetRequestStream()))
//            {
//                writer.Write(data);
//                writer.Close();
//            }
//            using (HttpWebResponse response = (HttpWebResponse)httpRequest.GetResponse())
//            {
//                XmlDocument doc = new XmlDocument();
//                doc.Load(new StreamReader(response.GetResponseStream(), Encoding.UTF8));



//                if (doc.ChildNodes[1].FirstChild.Name != "error")
//                {
//                    string answ = doc.ChildNodes[1].FirstChild.InnerText;
//                    return new ResultXml { sid = answ };
//                }
//                else
//                {
//                    string error = doc.ChildNodes[1].FirstChild.InnerText;
//                    return new ResultXml { error = error };
//                }
//            }
//        }

//        private HttpWebResponse SkrillPostRequest(string data)
//        {
//            HttpWebResponse response = null;
//            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(Endpoint);

//            httpRequest.Method = "POST";
//            httpRequest.ContentType = "application/x-www-form-urlencoded";

//            using (StreamWriter writer = new StreamWriter(httpRequest.GetRequestStream()))
//            {
//                writer.Write(data);
//                writer.Close();
//            }

//            try
//            {
//                response = (HttpWebResponse)httpRequest.GetResponse();
//            }
//            catch (Exception e)
//            {
//                throw new Exception("Error GetResponse from skrill: " + e);
//            }

//            return response;
//        }
//        public SkrillOutResponse MakeTransfer(string data, string name)
//        {
//            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(EndpointForTransferOut);

//            httpRequest.Method = "POST";
//            httpRequest.ContentType = "application/x-www-form-urlencoded";



//            using (StreamWriter writer = new StreamWriter(httpRequest.GetRequestStream()))
//            {
//                writer.Write(data);
//                writer.Close();
//            }
//            using (HttpWebResponse response = (HttpWebResponse)httpRequest.GetResponse())
//            {
//                XmlDocument doc = new XmlDocument();
//                doc.Load(new StreamReader(response.GetResponseStream(), Encoding.UTF8));

//                string amount = doc.GetElementsByTagName("amount")[0].InnerXml;
//                string currency = doc.GetElementsByTagName("currency")[0].InnerXml;
//                string id = doc.GetElementsByTagName("id")[0].InnerXml;
//                string status = doc.GetElementsByTagName("status")[0].InnerXml;
//                string status_msg = doc.GetElementsByTagName("status_msg")[0].InnerXml;

//                if (doc.ChildNodes[1].FirstChild.Name != "error")
//                {

//                    //string amount = doc.GetElementsByTagName("amount")[0].InnerXml;
//                    //string currency = doc.GetElementsByTagName("currency")[0].InnerXml;
//                    //string id = doc.GetElementsByTagName("id")[0].InnerXml;
//                    //string status = doc.GetElementsByTagName("status")[0].InnerXml;
//                    //string status_msg = doc.GetElementsByTagName("status_msg")[0].InnerXml;

//                    return new SkrillOutResponse
//                    {
//                        status = status,
//                        amount = Convert.ToDecimal(amount),
//                        currency = currency,
//                        SkrillAnswer = new SkrillAnswer
//                        {
//                            Code = "200",
//                            Message = "OK"
//                        },
//                        status_msg = status_msg,
//                        transactionId = id
//                    };
//                }
//                else
//                {
//                    string error = doc.ChildNodes[1].FirstChild.InnerText;
//                    Log.WritePaymentInfo("SKRILL OUT Error --> " + error, name);
//                    return new SkrillOutResponse { transactionId = id, amount = Convert.ToDecimal(amount), SkrillAnswer = new SkrillAnswer { Code = error } };
//                }
//            }
//        }




//        private void GetStatus(SkrillStatus data)
//        {
//            var res = data;

//        }

//        private static string StringToMD5(string str)
//        {
//            var cryptHandler = new MD5CryptoServiceProvider();
//            byte[] ba = cryptHandler.ComputeHash(Encoding.UTF8.GetBytes(str));

//            var hex = new StringBuilder(ba.Length * 2);

//            foreach (byte b in ba)
//                hex.AppendFormat("{0:X2}", b);

//            return hex.ToString();
//        }




        
//        //operations with db
//        public bool ChangeBalance(string username, decimal amount, byte addOrGet)
//        {
//            return CommonManager.Server.AddMoneyMethod(username, amount, addOrGet);
//        }

//        public bool InsertHistory(decimal amount, string systemtype, DateTime date, string direction, string userId, string transactId,string status)
//        {
//            return CommonManager.Server.InsertHistoryMethod(amount, systemtype, date, direction, userId,transactId,status);
//        }

//        public bool UpdateHistory(decimal amount, DateTime date, string transactId,string status)
//        {
//            return CommonManager.Server.UpdateHistoryMethod(amount, date, transactId, status);
//        }

//        public string GetUsernameFromTransactId(string transactionId)
//        {
        
//            return CommonManager.Server.GetUsernameFromTransactId(transactionId);
//        }




//    }
//}


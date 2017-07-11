using AltBet.Exchange;
using AltBet.Exchange.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web;
using AltBet.Exchange.Serializator;
using AltBet.Exchange.Utils;
using AltBet.ExchangeServices.Utils.Mailing.NotificationTypes;
using AltBet.ExchangeServices.Utils.Mailing;
using AltBet.ExchangeServices.Utils;
using AltBet.ExchangeServices.Utils.Gidx;
using AltBet.Model;
using GIDX.SDK;
using GIDX.SDK.Models;
using GIDX.SDK.Models.CustomerIdentity;
using GIDX.SDK.Models.DocumentLibrary;
using GIDX.SDK.Models.WebReg;
using GIDX.SDK.Models.WebCashier;
using User = AltBet.Exchange.User;

namespace AltBet.ExchangeServices.Services
{
    public class ResultEntity
    {
        public string UserName { get; set; }
        public string Error { get; set; }
        public int ErrorCode { get; set; }
    }

    public class Authorization : ResultEntity
    {
        public string Mode { get; set; }
        public string Bettor { get; set; }
        public string Trade { get; set; }
        public string Theme { get; set; }
        public string Message { get; set; }
    }

    public class Registration : ResultEntity
    {
        public string ConfirmationCode { get; set; }
    }


    public class UserService : IUserManager
    {
        private User User;
        private Authorization UserLogin = new Authorization();

        public UserNewHashCodeResponse GenerateNewConfirmationHash(string userName, string confirmationCode, bool trustedUser)
        {
            var newConfirmationExpiredDate = DateTime.UtcNow.AddDays(3);
            var newConfirmationCode = PasswordManager.CreatePasswordHash(userName, string.Format("CONFIRM{0}", newConfirmationExpiredDate.ToString()));

            return CommonManager.Server.GenerateNewConfirmationHashMethod(userName, confirmationCode, newConfirmationCode, newConfirmationExpiredDate, trustedUser);
        }

        public Registration Register(Model.User user)
        {
            var confirmationExpiredDate = DateTime.UtcNow.AddDays(3);
            var confirmationCode = PasswordManager.CreatePasswordHash(user.NickName, string.Format("CONFIRM{0}", confirmationExpiredDate.ToString()));

            var result = CommonManager.Server.AddUserRequestMethod(new AddUserRequest
            {
                User = new User
                {
                    UserName = user.NickName,
                    NickName = user.NickName,
                    Password = PasswordManager.CreatePasswordHash(user.NickName, user.Password),
                    Email = user.Email,
                    //FirstName = user.FirstName,
                    //LastName = user.LastName,
                    DateOfBirth = user.DateOfBirth,
                    Country = user.Country,
                    ConfirmationCode = confirmationCode,
                    ConfirmationExpired = confirmationExpiredDate,
                    UserType = UserType.Registered,
                    //Address = user.Address,
                    //Phone = user.Phone,
                    Accounts = new List<Account>
                    {
                        new Account
                        {
                            Name = user.NickName,
                            Email = user.Email,
                            Balance = 0,
                            Currency = "USD",
                            Mode = Mode.Basic.ToString().ToLower(),
                            Bettor = false.ToString().ToLower(),
                            Trade = false.ToString().ToLower(),
                            Theme = "dark",
                            MailNews = true.ToString().ToLower(),
                            MailUpdates = true.ToString().ToLower(),
                            MailActivity = true.ToString().ToLower(),
                            MailFrequency = MailFrequency.Daily.ToString().ToLower(), 
                            SmsActivity = false.ToString().ToLower(),
                            //Currency = ManagementResources.DefaultAccountCurrency
                            TariffPlan = new TariffPlan
                            {
                                BeginTime = DateTime.UtcNow,
                                Name = "empty",
                                Quantity = 0
                            }
                        }
                    }
                }
            });

            if (string.IsNullOrEmpty(result))
            {
                return new Registration
                {
                    ConfirmationCode = confirmationCode,
                    UserName = user.NickName,
                    Error = string.Empty,
                    ErrorCode = 200
                };
            }
            else
            {
                return new Registration
                {
                    ConfirmationCode = confirmationCode,
                    UserName = user.NickName,
                    Error = result,
                    ErrorCode = 100
                };
            }
        }

        public UserConfirmationResponse Confirm(string userName, string confirmationCode, bool trustedUser)
        {
            return CommonManager.Server.ConfirmMethod(userName, confirmationCode);
        }

        public string GetLocation(string ip)
        {
            var ipAddress = IPAddress.None;
            var parseResult = IPAddress.TryParse(ip, out ipAddress);

            var result = string.Empty;

            if (parseResult)
            {
                var city = GeoFromIp.GetCityFromIp(ipAddress);

                result = city == null ? string.Empty : city.Country.IsoCode;

                if (result == "US" || result == "CA")
                    result = string.Format("{0}-{1}", result, city.Subdivisions.First().IsoCode);
            }

            return result;
        }

        public Authorization Login(string identity, string password, string currentPage, string browser, string ip)
        {
            var response = CommonManager.Server.LoginRequestMethod(new LoginRequest
            {
                Email = identity.Contains("@") ? identity : string.Empty,
                UserName = identity.Contains("@") ? string.Empty : identity,
                Password = PasswordManager.CreatePasswordHash(identity, password),
                UserBrowser = browser,
                UserIp = ip,
                Url = currentPage
            });

            if (response != null)
            {
                var account = response.Accounts.FirstOrDefault();

                switch (response.LoginResult)
                {
                    case LoginResult.OK:
                        UserLogin = new Authorization
                        {
                            UserName = account.Name,
                            Error = "",
                            ErrorCode = 200,
                            Mode = account.Mode,
                            Bettor = account.Bettor,
                            Trade = account.Trade,
                            Theme = account.Theme
                        };
                        break;
                    case LoginResult.InvalidCredentials:
                        UserLogin = new Authorization { UserName = "", ErrorCode = 101, Error = "Invalid password or username" };
                        break;
                    case LoginResult.AlreadyLogged:
                        UserLogin = new Authorization { UserName = "", ErrorCode = 102, Error = "This user has already logged in" };
                        break;
                    case LoginResult.InternalError:
                        UserLogin = new Authorization { UserName = "", ErrorCode = 100, Error = "Internal error" };
                        break;
                }
            }
            return UserLogin;
        }

        public void Logout(string username, string browser, string ip)
        {
            CommonManager.Server.LogoutRequestMethod(new LogoutRequest
            {
                UserName = username,
                UserBrowser = browser,
                UserIp = ip
            });
        }

        public User GetUserInfo(string userName)
        {
            return CommonManager.Server.GetUserInfoRequestMethod(new GetUserInfoRequest
            {
                UserName = userName
            });
        }

        public User GetUserInfoByEmail(string email)
        {
            return CommonManager.Server.GetUserInfoRequestMethod(new GetUserInfoRequest
                {
                    Email = email
                });
        }

        public string EditUserTheme(string userName, string theme)
        {
            return CommonManager.Server.EditUserThemeRequestMethod(userName, theme);
        }

        public string EditUserInfo(Model.User user)
        {
            return CommonManager.Server.EditUserInfoRequestMethod(new EditUserRequest
            {
                User = new User
                {
                    UserName = user.NickName,
                    Password = "",
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DateOfBirth = user.DateOfBirth,
                    Country = user.Country,
                    Address = user.Address,
                    Phone = user.Phone,
                    LastEditedDate = DateTime.UtcNow,
                    Accounts = new List<Account>
                    {
                        new Account
                        {
                            Name = "",
                            Email = "",
                            Balance = 0,
                            Currency = "",
                            TariffPlan = new TariffPlan
                            {
                                BeginTime = DateTime.UtcNow,
                                Name = "empty",
                                Quantity = 0
                            },
                            Mode = user.Mode,
                            Bettor = user.Bettor,
                            Trade = user.Trade,
                            Theme = user.Theme
                        }
                    }
                }
            });

        }

        public string EditPreferences(Model.User user)
        {
            return CommonManager.Server.EditUserPreferencesRequestMethod(new EditUserRequest
            {
                User = new User
                {
                    UserName = user.NickName,
                    Password = "",
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DateOfBirth = user.DateOfBirth,
                    Country = user.Country,
                    Address = user.Address,
                    Phone = user.Phone,
                    LastEditedDate = DateTime.UtcNow,
                    Accounts = new List<Account>
                    {
                        new Account
                        {
                            Name = "",
                            Email = "",
                            Balance = 0,
                            Currency = "",
                            TariffPlan = new TariffPlan
                            {
                                BeginTime = DateTime.UtcNow,
                                Name = "empty",
                                Quantity = 0
                            },
                            Mode = user.Mode,
                            Bettor = user.Bettor,
                            Trade = user.Trade,
                            Theme = user.Theme,
                            MailNews = user.MailNews,
                            MailUpdates = user.MailUpdates,
                            MailActivity = user.MailActivity,
                            MailFrequency = user.MailFrequency,
                            SmsActivity = user.SmsActivity

                        }
                    }
                }
            });
        }

        public ResultObj ChangePassword(string userName, string oldPassword, string newPassword)
        {
            return CommonManager.Server.ChangePasswordRequestMethod(new ChangePasswordRequest
            {
                UserName = userName,
                OldPassword = PasswordManager.CreatePasswordHash(userName, oldPassword),
                NewPassword = PasswordManager.CreatePasswordHash(userName, newPassword)
            });
        }

        public Authorization LoginAdmin(string userName, string password)
        {
            var response = CommonManager.Server.LoginAdminRequestMethod(new LoginRequest
            {
                UserName = userName,
                Password = password
            });

            if (response != null)
            {
                switch (response.AdminLoginResult)
                {
                    case LoginResult.OK:
                        UserLogin = new Authorization
                        {
                            UserName = response.User,
                            Error = "200"
                        };
                        break;
                    case LoginResult.InvalidCredentials:
                        UserLogin = new Authorization { UserName = "", ErrorCode = 101, Error = "Invalid password or username" };
                        break;
                    case LoginResult.AlreadyLogged:
                        UserLogin = new Authorization { UserName = "", ErrorCode = 102, Error = "This user has already logged in" };
                        break;
                    case LoginResult.InternalError:
                        UserLogin = new Authorization { UserName = "", ErrorCode = 100, Error = "Internal error" };
                        break;
                }
            }
            return UserLogin;
        }

        public void LogoutAdmin(string username)
        {
            CommonManager.Server.LogoutAdminRequestMethod(new LogoutRequest
            {
                UserName = username
            });
        }

        public void UnsubscribeMail(string name, string type, string id)
        {
            var password = PasswordManager.CreatePasswordHash(name, type.ToUpper());
            if (type == NotificationType.Updates.ToString())
            {
                if (id.Equals(password))
                {
                    EditPreferences(new Model.User { NickName = name, MailUpdates = false.ToString().ToLower() });
                }
            }
            if (type == NotificationType.Activity.ToString())
            {
                if (id.Equals(password))
                {
                    EditPreferences(new Model.User { NickName = name, MailFrequency = MailFrequency.Never.ToString().ToLower() });
                }
            }
            if (type == NotificationType.News.ToString())
            {
                EditPreferences(new Model.User { NickName = name, MailNews = false.ToString().ToLower() });
            }



        }

        public void PushSubscribe(PushSettings model)
        {
            CommonManager.Server.PushSubscribeMethod(model);
        }

        public GIDX.SDK.Models.WebReg.CreateSessionResponse GidxCreateSession(string user, string ipAddr)
        {

            var userInfo = GetUserInfo(user);
            // var credentials = GidxConfiguration.GetCredentials();
            var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
            var ip = IPAddress.None;
            var parseResult = IPAddress.TryParse(ipAddr, out ip);

            if (!parseResult)
            {
                Log.WriteGIDXInfo(string.Format("GidxCustomerRegistration ip is EMPTY: {0}", ip), userInfo.UserName);
            }
            var request = new GIDX.SDK.Models.WebReg.CreateSessionRequest
            {
                MerchantCustomerID = userInfo.Accounts.FirstOrDefault().GIDX_CustomerId ?? String.Format("{0}_{1}", user, Guid.NewGuid().ToString("N")),
                // MerchantCustomerID = "12345",

                // MerchantSessionID = "GIDXSB_556",  // - for emulate CallBacks
                MerchantSessionID = Guid.NewGuid().ToString("N"),
                CallbackURL = GidxConfiguration.WebRegCallBack,
                FirstName = userInfo.FirstName,
                LastName = userInfo.LastName,
                EmailAddress = userInfo.Email,
                MobilePhoneNumber = userInfo.Phone,
                AddressLine1 = userInfo.Address,
                CustomerIpAddress = "37.57.0.212" //ip TODO:change for server

            };
            var response = gidxClient.WebReg.CreateSession(request);

            if (response.IsSuccess)
            {

                //var result = HttpUtility.UrlDecode(response.SessionURL);
                CommonManager.Server.GidxRegisterMethod(request, user);
                Log.WriteGIDXInfo(string.Format("CustomerRegistration | CustomerId: {0} | MerchantSessionId: {1} | ResponseMessage: {2}", request.MerchantCustomerID, response.MerchantSessionID, response.ResponseMessage), userInfo.UserName);
                return response;

            }
            return response;
        }

        public RegistrationStatusResponse GidxGetSessionStatus(string user)
        {
            var userInfo = GetUserInfo(user);
            var credentials = GidxConfiguration.GetCredentials();
            var gidxClient = new GIDXClient(credentials);
            var response = gidxClient.WebReg.RegistrationStatus(userInfo.Accounts.FirstOrDefault().GIDX_SessionId);
            return response;
        }


        //private GIDX.SDK.Models.WebReg.CustomerRegistrationResponse GidxGetCutomerRegistrationStatus(string customerId)
        //{
        //    var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
        //    var username = GidxGetUserNameFromCustomerId(customerId);
        //    var userInfo = GetUserInfo(username);
        //    var customerRegistration = gidxClient.WebReg.CustomerRegistration(new GIDX.SDK.Models.WebReg.CustomerRegistrationRequest()
        //    {
        //        MerchantCustomerID = customerId,
        //        MerchantSessionID = userInfo.Accounts.FirstOrDefault().GIDX_SessionId
        //    });
        //    return customerRegistration;
        //}


        private string GidxGetUserNameFromCustomerId(string customerId)
        {
            var name = CommonManager.Server.GidxGetCustomerNameMethod(customerId);
            return name;
        }

        public GIDX.SDK.Models.WebCashier.CreateSessionResponse GidxCreateWebCashier(string user, string ipAddr, PayActionCode payCode, decimal? amount)
        {
            var userInfo = GetUserInfo(user);
            var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
            var ip = IPAddress.None;
            var parseResult = IPAddress.TryParse(ipAddr, out ip);
            CashierPaymentAmount cashierPayment = null;
            if (!parseResult)
            {
                Log.WriteGIDXInfo(string.Format("GidxCustomerRegistration ip is EMPTY: {0}", ip), userInfo.UserName);
            }

                if (payCode == PayActionCode.Payout)
                {
                    cashierPayment = new CashierPaymentAmount() { PaymentAmount = amount };
                }

            var request = new GIDX.SDK.Models.WebCashier.CreateSessionRequest()
            {
                MerchantCustomerID = userInfo.Accounts.FirstOrDefault().GIDX_CustomerId ?? String.Format("{0}_{1}", user, Guid.NewGuid().ToString("N")),
                MerchantSessionID = Guid.NewGuid().ToString("N"), //GIDXSB_123
                MerchantOrderID = "111",
                MerchantTransactionID = Guid.NewGuid().ToString("N"),
                CallbackURL = GidxConfiguration.WebCashCallBack,
                CustomerIpAddress = "37.57.0.212", //ip TODO:change for server
                PayActionCode = payCode, //PayActionCode.Pay,
                CashierPaymentAmount = cashierPayment
            };

            var response = gidxClient.WebCashier.CreateSession(request);

            if (response.IsSuccess)
            {
                var direction = payCode == PayActionCode.Pay ? "Deposit" : "Withdraw";
                
                CommonManager.Server.GidxWebCashierMethod(request, userInfo.Email, direction); //store transactId to PaymentsHistory And update accounts
               
                Log.WriteGIDXInfo(string.Format("WebCashierCustomerRegistration | CustomerId: {0} | MerchantSessionId: {1} | TransactionId: {2} |  ResponseMessage: {3}", request.MerchantCustomerID, response.MerchantSessionID, request.MerchantTransactionID, response.ResponseMessage), userInfo.UserName);
                return response;
            }
            return response;
        }

        public GIDX.SDK.Models.WebCashier.SessionStatusCallbackResponse GidxCallbackWebCashier(string str)
        {

            var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
            var callback = gidxClient.WebCashier.ParseCallback(str);
            var customer = CommonManager.Server.GidxGetCustomerMethod(callback.MerchantSessionID);
            
            byte direction=0;
            var amountType = PaymentAmountType.Credit;

            //if (customer.TransactionId == null) { throw new ApplicationException("Can't find customer "); }

            var user = GetUserInfo(customer.Name);
            if (callback.StatusCode == SessionStatusCode.Complete)
            {
                var paymentDetails = gidxClient.WebCashier.PaymentDetail(new PaymentDetailRequest()         //requestPaymentDetails from GIDX
                {
                    MerchantTransactionID = callback.MerchantTransactionID,
                    MerchantSessionID = callback.MerchantSessionID
                });

                if (paymentDetails.IsSuccess)
                {
                    var details = paymentDetails.PaymentDetails.FirstOrDefault();
                    
                    if (details != null)
                    {
                        if (details.PaymentStatusCode == PaymentStatusCode.Complete)
                        {
                            //var payDetails = paymentDetails.PaymentDetails.ToList();

                            if (paymentDetails.PaymentDetails.FirstOrDefault().PaymentAmountType == PaymentAmountType.Debit) // is payout
                            {
                                direction=1;
                                amountType = PaymentAmountType.Debit;
                            }

                            var amountFull = paymentDetails.PaymentDetails.FindAll(c => c.PaymentAmountType == amountType).Sum(item => item.PaymentAmount);
                           
                            var depositResult = CommonManager.Server.AddMoneyMethod(user.UserName, amountFull, direction);
                            
                            var paymentSystem = String.Format("{0}_{1}", details.PaymentMethodType, details.PaymentMethodAccount);
                            
                            CommonManager.Server.UpdateHistoryMethod(amountFull, paymentSystem, details.PaymentProcessDateTime, callback.MerchantTransactionID, details.PaymentStatusCode.ToString());

                            if (depositResult == false)
                            {
                                throw new ApplicationException("Invalid add money operation");
                            }

                            Log.WriteGIDXInfo(String.Format("Deposit Funds: CustomerID: {0} | SessionID: {1} | TramsactID: {2} | Amount: {3} ", customer.CustomerId, callback.MerchantSessionID, callback.MerchantTransactionID, amountFull), user.UserName);
                        }
                    }
                }
            }

            var callbackResponse = new GIDX.SDK.Models.WebCashier.SessionStatusCallbackResponse
            {
                MerchantID = gidxClient.Credentials.MerchantID,
                SessionStatus = callback.StatusCode.ToString(),
                MerchantTransactionID = callback.MerchantTransactionID
                // CustomerID = customer.CustomerId
            };
            Log.WriteGIDXInfo(String.Format("WebCashier CallBack status : {0}  for customer {1}", callback.StatusMessage, customer.CustomerId), user.UserName);

            return callbackResponse;
        }

        //public PaymentDetailResponse GidxPaymentDetail(string userName)
        //{
        //    var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
        //    var user = GetUserInfo(userName);
        //    var transactionId = CommonManager.Server.GidxGetCustomerMethod(userName);
        //    var response = gidxClient.WebCashier.PaymentDetail(user.PaymentsHistory.FirstOrDefault().TransactionId);

        //    return response;
        //}

        public GIDX.SDK.Models.WebReg.SessionStatusCallbackResponse GidxCallbackResponse(string str)
        {

            var credentials = GidxConfiguration.GetCredentials();
            var gidxClient = new GIDXClient(credentials);
            var callback = gidxClient.WebReg.ParseCallback(str);
            var customer = CommonManager.Server.GidxGetCustomerMethod(callback.MerchantSessionID);
            var user = GetUserInfo(customer.Name);

            if (callback.ReasonCodes.Exists((x) => x == "ID-VERIFIED"))
            {
                user.UserType = UserType.Verified;
                Log.WriteGIDXInfo(String.Format("user VERIFIED! | CustomerID: {0}", customer.CustomerId), user.UserName);
                CommonManager.Server.EditUserInfoRequestMethod(new EditUserRequest() { User = user });
            }

            Log.WriteGIDXInfo(String.Format("Response to Callback: CustomerID: {0} | SessionID: {1} | StatusCode: {2} ", customer.CustomerId, callback.MerchantSessionID, callback.StatusCode.ToString()), user.UserName);

            var callbackResponse = new GIDX.SDK.Models.WebReg.SessionStatusCallbackResponse
            {
                MerchantID = gidxClient.Credentials.MerchantID,
                SessionStatus = callback.StatusCode.ToString(),
                CustomerID = customer.CustomerId
            };

            var customerRegistration = gidxClient.WebReg.CustomerRegistration(new GIDX.SDK.Models.WebReg.CustomerRegistrationRequest()
                {
                    MerchantCustomerID = customer.CustomerId,
                    MerchantSessionID = callback.SessionID
                });

            Log.WriteGIDXInfo(String.Format("CustomerRegistration info: {0}", customerRegistration.RegistrationLocation.Altitude), user.UserName);

            return callbackResponse;
        }

        public GIDX.SDK.Models.WebReg.CustomerRegistrationResponse GidxCustomerRegistration(string userName)
        {
            var user = GetUserInfo(userName);
            var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
            var account = user.Accounts.FirstOrDefault();

            var customerRegistration = gidxClient.WebReg.CustomerRegistration(new GIDX.SDK.Models.WebReg.CustomerRegistrationRequest()
            {
                MerchantCustomerID = account.GIDX_CustomerId,
                MerchantSessionID = account.GIDX_SessionId
            });
            return customerRegistration;
        }

        // для обновления данных о пользователе (если админ поменял статус пользователя на панели управления) 
        // сохранить статус...
        public bool GidxNotification(GidxNotification data)
        {
            var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
            var username = GidxGetUserNameFromCustomerId(data.MerchantCustomerID);
            var userInfo = GetUserInfo(username);
            var result = false;
            var customerData = gidxClient.WebReg.CustomerRegistration(new GIDX.SDK.Models.WebReg.CustomerRegistrationRequest()
            {
                MerchantCustomerID = data.MerchantCustomerID,
                MerchantSessionID = userInfo.Accounts.FirstOrDefault().GIDX_SessionId
            });

            userInfo.UserType = UserType.Confirmed;

            if (customerData.IsSuccess)
            {
                if (customerData.ReasonCodes.Exists((x) => x == "ID-VERIFIED"))
                {
                    userInfo.UserType = UserType.Verified;
                }

                CommonManager.Server.EditUserInfoRequestMethod(new EditUserRequest() { User = userInfo });

                Log.WriteGIDXInfo(String.Format("Change user type to: {0} | CustomerID: {1}", userInfo.UserType, data.MerchantCustomerID), username);

                result = true;
            }
            return result;

        }

        public CreateSessionWebWalletResponse GidxWebWallet(string userName)
        {
            var userInfo = GetUserInfo(userName);
            var request = new CreateSessionWebWalletRequest
            {
                MerchantCustomerID = userInfo.Accounts.FirstOrDefault().GIDX_CustomerId,
                MerchantSessionID = userInfo.Accounts.FirstOrDefault().GIDX_SessionId,
                CustomerIpAddress = "37.57.0.212"
            };

            var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
            var result = gidxClient.WebCashier.CreateSessionWebWallet(request);

            return result;

        }

        public string GidxUploadDocument(string userName, string urlToFile)
        {
            var userInfo = GetUserInfo(userName);
            var request = new DocumentRegistrationRequest
                {
                    MerchantCustomerID = userInfo.Accounts.FirstOrDefault().GIDX_CustomerId,
                    MerchantSessionID = userInfo.Accounts.FirstOrDefault().GIDX_SessionId,
                    CategoryType = CategoryType.Other,
                    DocumentStatus = DocumentStatus.ReviewComplete
                };

            var gidxClient = new GIDXClient(GidxConfiguration.GetCredentials());
            var result = gidxClient.DocumentLibrary.DocumentRegistration(request, urlToFile);

            return "asdf";
        }

        public bool IsUserVerified(string username)
        {
            var result = false;
            result = CommonManager.Server.IsUserVerified(username);
            return result;
        }


    }
}

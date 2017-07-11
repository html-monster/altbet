using AltBet.Exchange.Managers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using AltBet.Bet.Models;
using AltBet.Exchange;
using System.IO;
using System.Net;
using Newtonsoft.Json.Linq;
using AltBet.Exchange.Serializator;
using AltBet.Exchange;
using AltBet.Model;
using AltBet.ExchangeServices.Services;
using AltBet.Exchange.Utils;
using AltBet.ExchangeServices.Utils.Mailing;
using AltBet.Exchange.Utils.Mailing;
using AltBet.ExchangeServices.Utils.Mailing.NotificationTypes;
using AltBet.Model.Finances.GidxModels;
using GIDX.SDK;
using GIDX.SDK.Models;
using GIDX.SDK.Models.WebReg;
using GIDX.SDK.Models.WebCashier;
using Newtonsoft.Json;
using WebGrease.Css.Ast.Selectors;
using Authorization = AltBet.ExchangeServices.Services.Authorization;

namespace AltBet.Controllers
{
    public class AccountController : _baseController
    {
        //private IUserManager  userManager = null;   ----------Skandinav--------------
        //private IBalanceManager balanceManager = null;   ----------Skandinav--------------
        //private IFileManager fileManager = null;   ----------Skandinav----------
        //private IMailSettingsManager mailSettingsManager = null;   ----------Skandinav-----------

        public AccountController()
        {
            //this.userManager = userManager;   ----------Skandinav--------------
            //this.balanceManager = balanceManager;   ----------Skandinav--------------
            //this.fileManager = fileManager;   -----------Skandinav-----------
            //this.mailSettingsManager = mailSettingsManager;   ----------Skandinav-----------
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MailUnsubscribe()
        {
            var name = Request.QueryString["name"];
            var type = Request.QueryString["type"];
            var id = Request.QueryString["id"];

            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                userManagerClient.UnsubscribeMail(name, type, id);
            }

            return View();
        }

        [HttpPost]
        public void MailChimpWebHook()
        {

            var mail = Request.Form["data[email]"] == null ? "" : Convert.ToString(Request.Form["data[email]"]);
            var listId = Request.Form["data[list_id]"] == null ? "" : Convert.ToString(Request.Form["data[list_id]"]);
            var type = Request.Form["type"] == null ? "" : Convert.ToString(Request.Form["type"]);

            var name = CommonManager.Server.GetNickNameFromEmailMethod(mail);
            if (type == "unsubscribe")
            {
                using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                {
                    userManagerClient.UnsubscribeMail(name, "News", "");
                }
            }


        }

        [HttpPost]
        public void PushSubscribe(PushSubscribe model)
        {
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                userManagerClient.PushSubscribe(new PushSettings()
                {
                    Id = model.Id,
                    Name = model.Name,
                    SubscribeOrUnsubscribe = 1
                });
            }
        }

        [ChildActionOnly]
        public ActionResult getBalance()
        {
            //var result = balanceManager.GetCurrentUserAssets(User.Identity.Name);   -------Skandinav--------
            var result = new AltBet.Exchange.UserAssets();
            using (var balanceManagerClient = new BalanceServiceReference.BalanceManagerClient("BasicHttpBinding_IBalanceManager"))
            {
                result = balanceManagerClient.GetCurrentUserAssets(User.Identity.Name);
            }

            if (Request.Browser.IsMobileDevice)
            {
                return PartialView("UserAssetsMobile", result);
            }
            else
            {
                return PartialView("UserAssets", result);
            }
        }

        public List<UploadedImageInfo> UsersImages()
        {
            new JObject();
            string dirpath = Server.MapPath(string.Format("~\\Files\\{0}", User.Identity.Name));
            string urlTemplate = string.Format("http://{0}{1}/Files/{2}/", Request.Url.Host, Request.ApplicationPath == "/" ? "" : Request.ApplicationPath, User.Identity.Name);

            var image = new List<UploadedImageInfo>();
            using (var fileManagerClient = new FileServiceReference.FileManagerClient("BasicHttpBinding_IFileManager"))
            {
                image = fileManagerClient.UsersImages(dirpath, urlTemplate).ToList();
            }

            //return fileManager.UsersImages(dirpath, urlTemplate);   ---------------Skandinav--------------
            return image;
        }

        [Authorize]
        public JsonResult UploadImage(HttpPostedFileBase file)
        {
            string filename = string.Format("{1}__{0}{2}", Guid.NewGuid().ToString(), User.Identity.Name, file.FileName);

            string url = string.Format("http://{0}{1}/Files/{2}/{3}", Request.Url.Host, Request.ApplicationPath == "/" ? "" : Request.ApplicationPath, User.Identity.Name, filename);
            string dirpath = Server.MapPath(string.Format("~\\Files\\{0}", User.Identity.Name));
            if (Directory.Exists(dirpath) != true)
            {
                Directory.CreateDirectory(dirpath);
            }

            string filepath = string.Format("{0}\\{1}", dirpath, filename);
            //UploadedImageInfo info = fileManager.SaveImage(file, filepath, filename, url);   ---------Skandinav-----------
            var info = new UploadedImageInfo();
            using (var fileManagerClient = new FileServiceReference.FileManagerClient("BasicHttpBinding_IFileManager"))
            {
                info = fileManagerClient.SaveImage(file, filepath, filename, url);
            }
            return Json((object)info);
        }

        [Authorize]
        public JsonResult DeleteImage(string Name)
        {
            string filePath = Server.MapPath(string.Format("~\\Files\\{0}\\{1}", User.Identity.Name, Name));
            //int result = fileManager.DeleteImage(filePath);   -----------Skandinav---------
            int result = 0;
            using (var fileManagerClient = new FileServiceReference.FileManagerClient("BasicHttpBinding_IFileManager"))
            {
                result = fileManagerClient.DeleteImage(filePath);
            }

            return Json((object)result);
        }

        [Authorize]
        public ActionResult GenerateNewConfirmationHash(string userName, string confirmationCode)
        {
            var calculatedUserName = userName;
            var trustedUser = false;
            if (string.IsNullOrEmpty(calculatedUserName))
            {
                calculatedUserName = User.Identity.Name;
                trustedUser = true;
            }

            //var confirmationResult = userManager.GenerateNewConfirmationHash(userName, confirmationCode, trustedUser);  ----------Skandinav--------------

            var confirmationResult = new UserNewHashCodeResponse();
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                confirmationResult = userManagerClient.GenerateNewConfirmationHash(userName, confirmationCode, trustedUser);
            }

            if (confirmationResult.ErrorCode == 200)
            {
                var user = new AltBet.Exchange.User();
                using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                {
                    user = userManagerClient.GetUserInfo(userName);
                }
                //var user = userManager.GetUserInfo(userName);   ----------Skandinav--------------

                MailManager.MailNowOne(user.Email, "Alt.Bet confirmation email", "Use the link below for confirmation your Alt.bet account", new ConfirmNotificationType(System.Web.HttpContext.Current, confirmationResult.Result));
            }

            return Json(confirmationResult);
        }

        public ActionResult Confirm(string userName, string confirmationCode)
        {
            var resultUserName = userName;
            var trustedUser = false;

            var confirmationResult = new UserConfirmationResponse
            {
                ErrorCode = 100,
                Result = false,
                ErrorMessage = "User need to be confirmed"
            };

            if (User.Identity.IsAuthenticated && User.Identity.Name != userName)
            {
                confirmationResult.ErrorCode = 110;
                confirmationResult.ErrorMessage = "Please logout current user and try confirmation link again";

                return View(confirmationResult);
            }

            if (string.IsNullOrEmpty(resultUserName))
            {
                resultUserName = User.Identity.Name;
                trustedUser = true;
            }

            if (string.IsNullOrEmpty(resultUserName)) return View("Index");

            if (!string.IsNullOrEmpty(confirmationCode))
                using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                {
                    confirmationResult = userManagerClient.Confirm(userName, confirmationCode, trustedUser);
                }
            //confirmationResult = userManager.Confirm(userName, confirmationCode, trustedUser);  ----------Skandinav------------

            return View(confirmationResult);
            //return Json(userManager.Confirm(userName, confirmationCode));
        }

        [HttpPost]
        public ActionResult Register(UserViewModel newUser)
        {
            var result = new Registration
            {
                ErrorCode = 100,
                Error = "Some problems with registration. Please try later..."
            };

            if (ModelState.IsValid)
            {
                var regInfo = new Model.User
                {
                    NickName = newUser.NickName,
                    Password = newUser.Password,
                    ComparePassword = newUser.ComparePassword,
                    Email = newUser.Email,
                    //FirstName = newUser.FirstName,
                    //LastName = newUser.LastName,
                    DateOfBirth = newUser.DateOfBirth.Date,
                    Country = newUser.Country,
                    //Address = newUser.Address,
                    //Phone = newUser.Phone
                };

                try
                {
                    //result = userManager.Register(regInfo);  ----------Skandinav--------------
                    using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                    {
                        result = userManagerClient.Register(regInfo);
                    }

                    if (result.ErrorCode != 200) throw new Exception(result.Error);

                    //mailSettingsManager.MailChimpSubscribe(regInfo.Email);   -------------Skandinav-----------
                    using (var mailSettingsManagerClient = new MailSettingsServiceReference.MailSettingsManagerClient("BasicHttpBinding_IMailSettingsManager"))
                    {
                        mailSettingsManagerClient.MailChimpSubscribe(regInfo.Email);
                    }
                    MailManager.MailNowOne(regInfo.Email, "Alt.Bet confirmation email", "Use the link below for confirmation your Alt.bet account", new ConfirmNotificationType(System.Web.HttpContext.Current, result.ConfirmationCode));

                    return Login(new LoginUserViewModel
                    {
                        UserIdentity = newUser.NickName,
                        Password = newUser.Password
                    });
                    //RedirectToAction("Index", "Home");
                }
                catch (Exception ex)
                {
                    //ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                    result.ErrorCode = 100;
                    result.Error = ex.Message;
                    return Json(result);
                }

            }
            else
            {
                ModelState.Values.ToList().ForEach(x =>
                {
                    if (x.Errors.Any())
                        result.Error = x.Errors.First().ErrorMessage;
                });
            }


            return Json(result);

            //return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public ActionResult Login(LoginUserViewModel loginUser)
        {
            var result = new Authorization { Error = "Some problems with authorization. Please try later..." };
            if (ModelState.IsValid)
            {
                try
                {
                    if (loginUser.UserIdentity.Contains('@'))
                    {
                        using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                        {
                            loginUser.UserIdentity = userManagerClient.GetUserInfoByEmail(loginUser.UserIdentity).UserName;
                        }
                    }
                    //result = userManager.Login(loginUser.UserIdentity, loginUser.Password, HttpContext.Request.UrlReferrer.AbsoluteUri, HttpContext.Request.UserAgent, HttpContext.Request.UserHostAddress);   --------Skandinav---------
                    using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                    {
                        result = userManagerClient.Login(loginUser.UserIdentity, loginUser.Password, HttpContext.Request.UrlReferrer.AbsoluteUri, HttpContext.Request.UserAgent, HttpContext.Request.UserHostAddress);
                    }

                    if (string.IsNullOrEmpty(result.UserName))
                        ModelState.AddModelError(string.Empty, new InvalidOperationException("Invalid user"));
                    else
                        FormsAuthentication.SetAuthCookie(result.UserName, true);
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }

            return Json((object)result);
            //return RedirectToAction("Index", "Home");
        }

        [Authorize]
        public ActionResult Logout()
        {
            //userManager.Logout(User.Identity.Name, HttpContext.Request.UserAgent, HttpContext.Request.UserHostAddress);   ----------Skandinav-----------
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                userManagerClient.Logout(User.Identity.Name, HttpContext.Request.UserAgent, HttpContext.Request.UserHostAddress);
            }

            FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Landing");
        }

        [Authorize]
        [ChildActionOnly]
        public ActionResult Account()
        {
            var userAssets = new UserAssets();
            using (var balanceManagerClient = new BalanceServiceReference.BalanceManagerClient("BasicHttpBinding_IBalanceManager"))
            {
                userAssets = balanceManagerClient.GetCurrentUserAssets(User.Identity.Name);
            }

            var result = new AltBet.Exchange.User();
            var model = new SettingsViewModel();
            var modelPaymentsHistory = new List<PaymentsHistory>();
            try
            {
                //var result = userManager.GetUserInfo(User.Identity.Name);   --------Skandinav----------
                using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                {
                    result = userManagerClient.GetUserInfo(User.Identity.Name);
                }

                var account = result.Accounts.FirstOrDefault();

                modelPaymentsHistory = result.PaymentsHistory.Select(s => new PaymentsHistory
                {
                    amount = s.amount,
                    date = s.date,
                    direction = s.direction,
                    system = s.system,
                    status = s.status
                }).ToList();
                modelPaymentsHistory.Reverse();
                model = new SettingsViewModel
                {
                    UserInfo = new UserInfoViewModel
                    {
                        UserName = result.UserName,
                        Email = result.Email,
                        FirstName = result.FirstName,
                        LastName = result.LastName,
                        DateOfBirth = result.DateOfBirth.Date,
                        Country = result.Country,
                        Address = result.Address,
                        Phone = result.Phone
                    },
                    Account = new AccountViewModel
                    {
                        IsBettor = Convert.ToBoolean(account.Bettor),
                        IsTrade = Convert.ToBoolean(account.Trade),
                        IsMode = Convert.ToBoolean(account.Mode == Mode.Expert.ToString().ToLower()),
                        MailNews = Convert.ToBoolean(account.MailNews),
                        MailUpdates = Convert.ToBoolean(account.MailUpdates),
                        MailActivity = Convert.ToBoolean(account.MailActivity),
                        MailFrequency = account.MailFrequency,
                        SmsActivity = Convert.ToBoolean(account.SmsActivity)

                    },
                    ChangePassword = new ChangePasswordViewModel(),
                    //UserAssets = balanceManager.GetCurrentUserAssets(User.Identity.Name),   ----------Skandianv------------
                    UserAssets = userAssets,
                    PaymentsHistory = modelPaymentsHistory,
                    jsonImageInfo = UsersImages()
                };
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
            }

            return PartialView(model);
        }

        [Authorize]
        public ActionResult EditUserInfo(UserInfoViewModel editUser)
        {
            var result = string.Empty;

            var model = new Model.User
            {
                NickName = User.Identity.Name,
                FirstName = editUser.FirstName,
                LastName = editUser.LastName,
                Country = editUser.Country,
                DateOfBirth = editUser.DateOfBirth.Date,
                Address = editUser.Address,
                Phone = editUser.Phone
            };

            if (ModelState.IsValid)
            {
                try
                {
                    //result = userManager.EditUserInfo(model);   ---------Skandinav--------
                    using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                    {
                        result = userManagerClient.EditUserInfo(model);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }
            return Json((object)result);
        }

        [Authorize]
        public ActionResult EditPreferences(AccountViewModel editPreferences)
        {
            editPreferences = new AccountViewModel
            {
                IsBettor = editPreferences.IsBettor,
                IsMode = editPreferences.IsMode,
                IsTrade = editPreferences.IsTrade,
                MailNews = editPreferences.MailNews,
                MailUpdates = editPreferences.MailUpdates,
                MailActivity = editPreferences.MailActivity,
                MailFrequency = editPreferences.MailFrequency,
                SmsActivity = editPreferences.SmsActivity

            };

            var result = string.Empty;

            var model = new Model.User
            {
                NickName = User.Identity.Name,
                Bettor = editPreferences.IsBettor.ToString().ToLower(),
                Trade = editPreferences.IsTrade.ToString().ToLower(),
                Mode = (editPreferences.IsMode == false ? Mode.Basic : Mode.Expert).ToString().ToLower(),
                MailNews = editPreferences.MailNews.ToString().ToLower(),
                MailUpdates = editPreferences.MailUpdates.ToString().ToLower(),
                MailActivity = editPreferences.MailActivity.ToString().ToLower(),
                MailFrequency = editPreferences.MailActivity == false ? MailFrequency.Never.ToString().ToLower() : editPreferences.MailFrequency,
                SmsActivity = editPreferences.SmsActivity.ToString().ToLower()
            };

            var userInfo = new AltBet.Exchange.User();
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                userInfo = userManagerClient.GetUserInfo(User.Identity.Name);
            }

            if (ModelState.IsValid)
            {
                try
                {
                    //mailSettingsManager.MailChimpSettings(userInfo.Email, model);   ----------Skandinav-----------
                    using (var mailSettingsManagerClient = new MailSettingsServiceReference.MailSettingsManagerClient("BasicHttpBinding_IMailSettingsManager"))
                    {
                        mailSettingsManagerClient.MailChimpSettings(userInfo.Email, model);
                    }
                    //result = userManager.EditPreferences(model);   ------Skandinav-------
                    using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                    {
                        result = userManagerClient.EditPreferences(model);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                    //var link = mailSettingsManager.GetLinkForForm();   ------------Skandinav---------
                    var link = string.Empty;
                    using (var mailSettingsManagerClient = new MailSettingsServiceReference.MailSettingsManagerClient("BasicHttpBinding_IMailSettingsManager"))
                    {
                        link = mailSettingsManagerClient.GetLinkForForm();
                    }
                    return Json(new MailChimpAnswer { Code = ex.Message, Link = link });
                }
            }
            return Json((object)result);
        }

        [Authorize]
        public ActionResult EditTheme(string theme)
        {
            var result = string.Empty;
            //var result = userManager.EditUserTheme(User.Identity.Name, theme);   ----------Skandinav------------
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                result = userManagerClient.EditUserTheme(User.Identity.Name, theme);
            }

            return Json((object)result);
        }

        [Authorize]
        public ActionResult ChangePassword(string oldPassword, string newPassword)
        {
            var result = new ResultObj();

            if (ModelState.IsValid)
            {
                try
                {
                    //result = userManager.ChangePassword(User.Identity.Name, oldPassword, newPassword);   ----------Skandinav----------
                    using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
                    {
                        result = userManagerClient.ChangePassword(User.Identity.Name, oldPassword, newPassword);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }
            return Json((object)result);
        }

        [Authorize]
        public ActionResult Gidx()
        {
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                var result = userManagerClient.IsUserVerified(User.Identity.Name);
               
                if (!result)
                {
                   return RedirectToAction("GidxVerificationRegister");
                }
              
            }
            return View("GidxDeposit");
            //return RedirectToAction("GidxWebCashierRegister");
        }

        //[Authorize]
        //public ActionResult GidxPayment()
        //{
        //    return View("GidxDeposit");
        //}


        [Authorize]
        public ActionResult GidxVerificationRegister()
        {
            var result = new GIDX.SDK.Models.WebReg.CreateSessionResponse();
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                result = userManagerClient.GidxCreateSession(User.Identity.Name,
                    HttpContext.Request.UserHostAddress);
                 if (result.IsSuccess)
                 {
                     ViewBag.code = HttpUtility.UrlDecode(result.SessionURL);
                     return View("GidxPage");
                 }
            }
            
            return Json(result);
        }

        [Authorize]
        [HttpGet]
        public ActionResult GidxWebCashierRegister(Transfer model) // TODO: change for server
        {
            
          // var model = new Transfer(){Direction = true, Amount = 13};  //true=deposit

            var result = new GIDX.SDK.Models.WebCashier.CreateSessionResponse();
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {

                var payDirection = model.Direction ? PayActionCode.Pay : PayActionCode.Payout; 
               
                result = userManagerClient.GidxCreateWebCashier(User.Identity.Name, HttpContext.Request.UserHostAddress, payDirection,model.Amount);
                //result = userManagerClient.GidxCreateWebCashier("vlad", HttpContext.Request.UserHostAddress, payDirection,model.Amount);
                if (result.IsSuccess)
                {
                    ViewBag.code = HttpUtility.UrlDecode(result.SessionURL);
                    return View("GidxPage");
                    
                }


            }
            
            return Json(result,JsonRequestBehavior.AllowGet);

        }

        public ActionResult GidxGetIdentityStatus()
        {
            var result = new RegistrationStatusResponse();
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                result = userManagerClient.GidxGetSessionStatus(User.Identity.Name);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public ActionResult GidxRegCallBack()
        {
            var callback = Request.Form["result"];
            GIDX.SDK.Models.WebReg.SessionStatusCallbackResponse result = null;
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                 result = userManagerClient.GidxCallbackResponse(callback);
            }

            return Json(result);
        }
        
        public ActionResult GidxWebCashierCallBack()
        {
            var callback = Request.Form["result"];
            var result = new GIDX.SDK.Models.WebCashier.SessionStatusCallbackResponse();
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                result = userManagerClient.GidxCallbackWebCashier(callback);
            }
            return Json(result);
        }

        //public ActionResult GidxPaymentDetail()
        //{
        //    var result = new GIDX.SDK.Models.WebCashier.PaymentDetailResponse();
        //    using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
        //    {
        //        result = userManagerClient.GidxPaymentDetail(User.Identity.Name);
        //    }
        //    return Json(result);
        //}

        public ActionResult GidxNotification(GidxNotif data)
        {
            var notification = new GidxNotification()
            {
                MerchantCustomerID = data.MerchantCustomerID,
                NotificationType = data.NotificationType
            };
           
            var result = false;
            
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                result = userManagerClient.GidxNotification(notification);
            }

            return Json(new GidxNotifResponse{Accepted = result});

        }

        public ActionResult GidxWebWallet()
        {
            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {


                var result = userManagerClient.GidxWebWallet(User.Identity.Name);
                if (result.IsSuccess)
                {
                    ViewBag.code = HttpUtility.UrlDecode(result.SessionURL);
                    return View("GidxPage");
                }
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GidxUploadFile()
        {
            var result = String.Empty;

            using (var userManagerClient = new UserServiceReference.UserManagerClient("BasicHttpBinding_IUserManager"))
            {
                result = userManagerClient.GidxUploadDocument("vlad","#");//User.Identity.Name);
            }

            return Json("asdf");
        }
    }
}

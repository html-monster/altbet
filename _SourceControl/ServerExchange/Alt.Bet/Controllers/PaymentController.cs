using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using AltBet.Bet.Models;
using AltBet.Exchange;
using AltBet.Exchange.Utils;
using AltBet.Exchange.Managers;
using System.Net;
using System.Text;
using System.Xml;
using AltBet.ExchangeServices.Utils;
using User = AltBet.Model.User;
using AltBet.Exchange.Utils.Mailing;
using AltBet.ExchangeServices.Utils.FinanceServices.Neteller;
using AltBet.ExchangeServices.Utils.FinanceServices.Skrill;
using AltBet.ExchangeServices.Utils.Mailing.NotificationTypes;
using AltBet.ExchangeServices.Utils.PushNotifications;
using AltBet.ExchangeServices.Utils.Twitter;
using AltBet.Model.Finances.NetellerModels;
using AltBet.Model.Finances.SkrillModels;


namespace AltBet.Controllers
{
    public class PaymentController : _baseController
    {
        private IPaymentManager paymentManager = null;
        private IUserManager userManager = null;
       

        public PaymentController(IPaymentManager pm, IUserManager usermanager)
        {
            this.paymentManager = pm;
            this.userManager = usermanager;
        }

        private string Name { get { return User.Identity.Name; } }

        private string Path { get { return  new UriBuilder(Request.Url.Scheme, Request.Url.Host, -1, Request.ApplicationPath).Uri.AbsoluteUri;} }

        public ActionResult Index()
        {
            return View();
        }


        
        [Authorize]
        public ActionResult NetellerIn(NetellerInViewModel model)
        {
            int amount = Convert.ToInt32(model.sum * 100); //amount must be in cents in int
            var rez = new Payment {Answer = new Answer {code = "500", message = "BadRequest"}};
            if (ModelState.IsValid)
            {
                try
                {
                    rez = paymentManager.NetellerIn( new TransferIn
                        {
                          paymentMethod = new PaymentMethod
                          {
                          type = "neteller", 
                          value = model.clientId.Trim()
                          },//"netellertest_USD@neteller.com"
                            
                          transaction = new Transaction
                          {
                          currency = "USD",
                          amount = amount,
                          merchantRefId = Guid.NewGuid().ToString()
                          },
                          verificationCode = model.secureId.Trim(), //"270955"
                          name = Name
                       });
                  
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }

                return Json(rez);
            }
            return RedirectToAction("Index", "Account");
        }

        [Authorize]
        public ActionResult NetellerOut(PaymentOutViewModel payment)
        {
            int amount = Convert.ToInt32(payment.sum * 100);
            var rez = new Payment { Answer = new Answer { code = "500", message = "BadRequest" } };
            if (ModelState.IsValid)
            {
                try
                {
                        // NetellerApi rest = new NetellerApi(NetellerEnvironment.Test);

                        rez = paymentManager.NetellerOut(new TransferOut
                        {
                            message = "from Alt.bet",
                            payeeProfile = new PayeeProfile { email = payment.email },
                            transaction = new Transaction
                            {

                                amount = amount,
                                createDate = DateTime.Now.ToString(),
                                currency = "USD",
                                merchantRefId = Guid.NewGuid().ToString()
                            },
                            name = Name
                        });

                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }

                return Json(rez);
            }

            return RedirectToAction("Index", "Account");
        }


        [Authorize]
        public ActionResult SkrillOut(SkrillOutViewModel model)
        {
            var result = new SkrillOutResponse()
            {
                SkrillAnswer = new SkrillAnswer {Code = "500", Message = "BadRequest"}
            };

            if (ModelState.IsValid)
            {
                try
                {
                    result = paymentManager.SkrillOut(new SkrillOutRequest
                    {
                        Name = Name,
                        EmailTo = model.email,
                        Sum = model.sum,
                    });
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }

            return Json(result);
        }

        [Authorize]
        public ActionResult SkrillIn(SkrillInViewModel model)
        {
            var result = new SkrillAnswer {Code = "500", Message = "BadRequest"};
          
            if (ModelState.IsValid)
            {
                try
                {
                    result = paymentManager.SkrillIn(new SkrillInRequest
                    {
                        ClientId = model.ClientId,
                        Name = Name,
                        Sum = model.Sum,
                        Path = Path
                    });
                }

                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }

            return Json(result);
        }
        
        [Authorize]
        public ActionResult OtherPaymentsIn(OtherPaymentsInViewModel model)
        {
            var result = new SkrillAnswer { Code = "500", Message = "BadRequest" };

            if (ModelState.IsValid)
            {
                try
                {
                    result = paymentManager.SkrillOtherIn(new SkrillInRequest
                     {
                        ClientId = String.Empty,
                        Name = Name,
                        Sum = model.Sum,
                        Path = Path,
                        PaymentType = model.PaymentType
                     });
                }

                 catch (Exception ex)
                 {
                      ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                 }

            }

            return Json(result);
        }

        [HttpPost]
        public ActionResult SkrillStatus(SkrillStatus model)
        {
            var result = paymentManager.SkrillStatus(model);
            if (result.Code == "200") { return new HttpStatusCodeResult(HttpStatusCode.OK); }
            
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        public ActionResult SkrillCancel()
        {
            var id = Request.QueryString[0];
            var result = paymentManager.SkrillCancel(id);
            if (result == false)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            
            return RedirectToAction("Index", "Account");
            
        }


        public void Export2CSV()
        {
            var modelPaymentsHistory = new List<PaymentsHistory>();
            
            var rel = userManager.GetUserInfo(User.Identity.Name);
            modelPaymentsHistory = rel.PaymentsHistory.Select(s => new PaymentsHistory
               {
                   amount = s.amount,
                   date = s.date,
                   direction = s.direction,
                   system = s.system,
                   status = s.status
               }).ToList();
            modelPaymentsHistory.Reverse();
            StringWriter sw = new StringWriter();
            sw.WriteLine("\"Amount\",\"Date\",\"Deposit/Withdraw\",\"system\",\"status\"");
            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachement; filename = ExportedHistory.csv");
            Response.ContentType = "text/csv";

            foreach (var item in modelPaymentsHistory)
            {
                sw.WriteLine(string.Format("{0},{1},{2},{3},{4}",

                    item.amount,
                    item.date,
                    item.direction,
                    item.system,
                    item.status
                    ));

            }

            Response.Write(sw.ToString());
            Response.End();

        }

        public string Mailing()
        {

            List<Exchange.UserForMail> _Recepients = new List<Exchange.UserForMail>
            {
                new Exchange.UserForMail
                {
                    Accounts = new List<Account>
                    {
                        new Account{MailUpdates = "true",MailActivity = "daily"}
                    },
                Data = new List<string>
                    {
                        "Данные для petrov.vladyslav 1","Данные для petrov.vladyslav 2","Данные для petrov.vladyslav 3"
                    },
                Email = "petrov.vladyslav@gmail.com",
                FirstName = "Коля"
                },
               // new Exchange.UserForMail{Accounts = new List<Account>{new Account{MailUpdates = "true"}},Data = new List<string> {"Данные для heithvaldr@ukr.net 1","Данные для heithvaldr@ukr.net 2","Данные для heithvaldr@ukr.net 3"},Email = "heithvaldr@ukr.net",FirstName = "Пэтя"},
            };


           // SmsManager.SendSms("+15613060430","altbetest");
            
            // MailManager.MailQueueMany(_Recepients,"SUBJECT","Some data from Controller",NotificationType.Updates);
            //MailManager.MailQueueMany(_Recepients, "Activity", "Custom body", new ActivityNotificationType(System.Web.HttpContext.Current));
           
            
            //PushNotificationManager.CreateNotification("Hello there from API");
            
           // TwitIt.PostMessageToTwitter("Message2");

           var c = SmsManager.GetCode();
           
            return c;

            // return GeoFromIp.GetCityFromIp("8.8.8.8");
        }

    }
}

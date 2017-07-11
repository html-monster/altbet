using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Configuration;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Hangfire;
using HtmlAgilityPack;
using AltBet.ExchangeServices.Utils.Mailing.NotificationTypes;
using AltBet.ExchangeServices.Utils.Mailing;

namespace AltBet.Exchange.Utils.Mailing
{
    public class MailManager
    {
        private static string templatesPath = "bin\\Utils\\Mailing\\MailTemplates";

        public static void MailNowOne(string to, string subject, string body, DefaultNotificationType type)
        {
            var newBody = type.GetBodyFromTemplate(to, body);

            BackgroundJob.Enqueue(() => Send(to, subject, newBody));

        }

        public static void MailQueueMany(List<UserForMail> users, string subject, string body, DefaultNotificationType type)
        {
            DateTime daily = DateTime.Today;
            DateTime weekly = DateTime.Now.StartOfWeek(DayOfWeek.Friday).AddHours(18);
            DateTime monthly = DateTime.Now.StartNextMonth();


            if (type.Type == NotificationType.Activity)
            {
                foreach (var u in users)
                {
                    foreach (var a in u.Accounts)
                    {
                        var newBody = type.GetBodyFromTemplate(u.Email, body);
                        if (a.MailFrequency == MailFrequency.Daily.ToString().ToLower())
                        {
                            BackgroundJob.Schedule(() => Send(u.Email, subject, newBody), daily);
                        }
                        if (a.MailFrequency == MailFrequency.Weelky.ToString().ToLower())
                        {
                            BackgroundJob.Schedule(() => Send(u.Email, subject, newBody), weekly);
                        }
                        if (a.MailFrequency == MailFrequency.Monthly.ToString().ToLower())
                        {
                            BackgroundJob.Schedule(() => Send(u.Email, subject, newBody), monthly);
                        }

                    }
                }
            }
            if (type.Type == NotificationType.Updates)
            {
                foreach (var u in users)
                {
                    foreach (var a in u.Accounts)
                    {
                        var newBody = type.GetBodyFromTemplate(u.Email, body);
                        if (a.MailUpdates == true.ToString().ToLower())
                            BackgroundJob.Enqueue(() => Send(u.Email, subject, newBody));
                    }
                }
            }
            else
            {
                foreach (var u in users)
                {
                    foreach (var a in u.Accounts)
                    {
                        var newBody = type.GetBodyFromTemplate(u.Email, body);
                        BackgroundJob.Enqueue(() => Send(u.Email, subject, newBody));
                    }
                }
            }
        }


        /*
        static string GetBodyFromTemplate(string to, string body, DefaultNotificationType type)
        {
            using (var sr = new StreamReader(Path.Combine(HttpContext.Current.Server.MapPath("~"), String.Format("{0}\\{1}Email.htm", templatesPath, type.Type))))
            {
                var oldContent = sr.ReadToEnd();
                HtmlDocument doc = new HtmlDocument();
                doc.LoadHtml(oldContent);

                var divData = doc.DocumentNode.SelectSingleNode("//div[@id='custom']");
                var divUnsub = doc.DocumentNode.SelectSingleNode("//div[@id='unsubscribe']");

                if (divData != null)
                {
                    HtmlNode newContent = HtmlNode.CreateNode(body);
                    divData.PrependChild(newContent);


                    var unsubscribeLink = String.Format("<a href =\"{0}\">unsubscribe</a>", type.GetLink(to));
                    HtmlNode unsubscribeNode = HtmlNode.CreateNode(unsubscribeLink);
                    divUnsub.PrependChild(unsubscribeNode);
                    string newBody = doc.DocumentNode.InnerHtml;
                    return newBody;
                }
                return "";
            }


        }
         */
         

        public static void Send(string to, string subject, string body)
        {
            SmtpClient smtpClient = new SmtpClient();
            var smtpSection = (SmtpSection)ConfigurationManager.GetSection("system.net/mailSettings/smtp");
            string from = smtpSection.From;
            MailMessage msg = new MailMessage(from, to);
            msg.IsBodyHtml = true;
            msg.Body = body;
            msg.Subject = subject;
            smtpClient.Send(msg);
        }




    }

    public static class DateTimeExtensions
    {
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = startOfWeek - dt.DayOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return dt.AddDays(diff).Date;
        }

        public static DateTime StartNextMonth(this DateTime dt)
        {

            DateTime nn = new DateTime(DateTime.Now.AddMonths(1).Year, DateTime.Now.AddMonths(1).Month, 1);

            return nn;
        }
    }
}

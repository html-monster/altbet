using AltBet.Exchange;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace AltBet.ExchangeServices.Utils.Mailing.NotificationTypes
{
    public class DefaultNotificationType
    {
        private string templatesPath = "bin\\Utils\\Mailing\\MailTemplates";

        protected virtual string ActionPath { get { return "account/mailunsubscribe"; } }

        protected virtual string Caption { get { return "Unsubscribe"; } }
        
        public virtual NotificationType Type { get { return NotificationType.Default; } }


        private Uri address = null;
        protected Uri Address 
        { 
            get 
            {
                return address;
            }
            private set 
            {
                address = value;
            }
        }

        public DefaultNotificationType(HttpContext context)
        {
            var builder = new UriBuilder(context.Request.Url.Scheme, context.Request.Url.Host, -1, string.Format("{0}/{1}", context.Request.ApplicationPath, ActionPath));

            Address = builder.Uri;
        }

        protected virtual string GetLink(string mail)
        {
            var nickname = CommonManager.Server.GetNickNameFromEmailMethod(mail);
            var password = PasswordManager.CreatePasswordHash(nickname, Enum.GetName(typeof(NotificationType), Type).ToUpper());

            UriBuilder uri = new UriBuilder(Address.AbsoluteUri);

            var query = HttpUtility.ParseQueryString(uri.Query);
            query["name"] = nickname;
            query["type"] = Enum.GetName(typeof(NotificationType), Type);
            query["id"] = password;
            uri.Query = query.ToString();

            return uri.Uri.ToString();

        }

        public virtual string GetBodyFromTemplate(string to, string body) //, DefaultNotificationType type)
        {
            using (var sr = new StreamReader(Path.Combine(HttpContext.Current.Server.MapPath("~"), String.Format("{0}\\{1}Email.htm", templatesPath, Type))))
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


                    var unsubscribeLink = String.Format("<a href =\"{0}\">{1}</a>", GetLink(to), Caption);
                    HtmlNode unsubscribeNode = HtmlNode.CreateNode(unsubscribeLink);
                    divUnsub.PrependChild(unsubscribeNode);
                    string newBody = doc.DocumentNode.InnerHtml;
                    return newBody;
                }
                return "";
            }


        }

    }
}
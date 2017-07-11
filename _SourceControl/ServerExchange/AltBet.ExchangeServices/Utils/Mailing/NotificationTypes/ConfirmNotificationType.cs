using AltBet.Exchange;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AltBet.ExchangeServices.Utils.Mailing.NotificationTypes
{
    public class ConfirmNotificationType : DefaultNotificationType
    {
        protected override string Caption { get { return "Confirmation link"; } }

        protected override string ActionPath { get { return string.Format("account/confirm", confirmationCode); } }

        public override NotificationType Type { get { return NotificationType.Confirm; } }

        private string confirmationCode = string.Empty;

        public ConfirmNotificationType(HttpContext context, string confirmationCode) : base(context)
        {
            this.confirmationCode = confirmationCode;
        }

        protected override string GetLink(string mail)
        {
            var nickname = CommonManager.Server.GetNickNameFromEmailMethod(mail);
            UriBuilder uri = new UriBuilder(Address.AbsoluteUri);

            var query = HttpUtility.ParseQueryString(uri.Query);
            query["userName"] = nickname;            
            query["confirmationCode"] = confirmationCode;
            uri.Query = query.ToString();

            return uri.Uri.ToString();

        }

    }
}
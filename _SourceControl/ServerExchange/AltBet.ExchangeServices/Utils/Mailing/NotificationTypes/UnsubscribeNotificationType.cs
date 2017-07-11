using AltBet.Exchange;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AltBet.ExchangeServices.Utils.Mailing.NotificationTypes
{
    public class UnsubscribeNotificationType : DefaultNotificationType
    {
        protected override string ActionPath { get { return "account/mailunsubscribe"; } }

        public UnsubscribeNotificationType(HttpContext context) : base(context) { }

        public override NotificationType Type { get { return NotificationType.Unsubscribe; } }
    }
}
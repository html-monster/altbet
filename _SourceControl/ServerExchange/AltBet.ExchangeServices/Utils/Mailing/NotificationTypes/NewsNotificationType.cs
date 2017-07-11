using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AltBet.ExchangeServices.Utils.Mailing.NotificationTypes
{
    public class NewsNotificationType : DefaultNotificationType
    {
        public override NotificationType Type { get { return NotificationType.News; } }

        public NewsNotificationType(HttpContext context) : base(context) { }
    }
}
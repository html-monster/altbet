using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AltBet.ExchangeServices.Utils.Mailing.NotificationTypes
{
    public class ActivityNotificationType : UnsubscribeNotificationType
    {
        public ActivityNotificationType(HttpContext context) : base(context) { }

        public override NotificationType Type { get { return NotificationType.Activity; } }

    }
}
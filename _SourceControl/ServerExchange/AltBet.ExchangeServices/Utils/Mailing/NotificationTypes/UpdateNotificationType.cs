using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AltBet.ExchangeServices.Utils.Mailing.NotificationTypes
{
    public class UpdateNotificationType : UnsubscribeNotificationType
    {
        public UpdateNotificationType(HttpContext context) : base(context) { }

        public override NotificationType Type { get { return NotificationType.Updates; } }

    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AltBet.Exchange.WebSocketSender
{
    public enum WebSocketMessageCode
    {
        MarkedClosed,
        LogIn,
        LogOut,
        HeartBeat,
        Notification,
        Execution,
        Account
    }
}

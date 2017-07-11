using AltBet.Exchange.Serializator;
using SuperWebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AltBet.Exchange.WebSocketSender
{
    class WebSocketSender
    {
        private ISerializer serializator = null;

        public WebSocketSender(ISerializer serializator)
        {
            this.serializator = serializator;
        }

        public void SendBySession<T>(WebSocketSession session, T data, WebSocketMessageCode code, WebSocketMessageType type, string message = "") where T : WebSocketMessage
        {
            if (serializator == null) throw new NullReferenceException("Please initialize serializator at first.");

            SendData<T>(session, data, code, type, message);
        }

        public void SendByUser<T>(IEnumerable<UserSession> userSessions, string userName, T data, WebSocketMessageCode code, WebSocketMessageType type, string message = "") where T : WebSocketMessage
        {
            if (serializator == null) return;  //throw new NullReferenceException("Please initialize serializator at first.");
            if (userSessions == null) return; // throw new NullReferenceException("User Session cannot be null.");            

            userSessions.Where(u => u.UserName == userName).ToList().ForEach(u =>
            {
                if (u.SessionPage != null)
                {
                    u.SessionPage.ToList().ForEach(s =>
                    {
                        var session = s.Key as WebSocketSession;

                        SendData<T>(session, data, code, type, message);
                    });
                }
            });
        }

        private void SendData<T>(WebSocketSession session, T data, WebSocketMessageCode code, WebSocketMessageType type, string message) where T : WebSocketMessage
        {
            if (session == null) throw new NullReferenceException("Web socket session cannot be null.");

            data.Code = code;
            data.Message = message;
            data.Type = type;

            session.Send(serializator.Serialize<T>(data));
        }

        public void SendByBrowser<T>(List<UserSession> userSessions, string userName, string userBrowser, string userIp, T data, WebSocketMessageCode code, WebSocketMessageType type, string message = "") where T : WebSocketMessage
        {
            if (userSessions == null) throw new NullReferenceException("Doed not have any user sessions.");

            if (string.IsNullOrEmpty(userBrowser)) return;

            SendByUser<T>(userSessions.Where(x => x.UserName == userName && x.UserBrowser == userBrowser && x.UserIp == userIp), userName, data, code, type, message);
        }
    }
}

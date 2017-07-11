using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace AltBet.Exchange.WebSocketSender
{
    [DataContract]
    [KnownType(typeof(WebSoketOrdersResponse))]
    [KnownType(typeof(MessageResponse))]
    [KnownType(typeof(Execution))]
    [KnownType(typeof(Account))]       
    public class WebSocketMessage
    {
        public WebSocketMessageCode Code { get; set; }

        [DataMember(Name = "Code")]
        public string CodeValue
        {
            get
            {
                return Enum.GetName(typeof(WebSocketMessageCode), Code);
            }
            set
            {
                Code = (WebSocketMessageCode)Enum.Parse(typeof(WebSocketMessageCode), value, true);
            }
        }

        public WebSocketMessageType Type { get; set; }

        [DataMember(Name = "Type")]
        public string MessageValue
        {
            get
            {
                return Enum.GetName(typeof(WebSocketMessageType), Type);
            }
            set
            {
                Type = (WebSocketMessageType)Enum.Parse(typeof(WebSocketMessageType), value, true);
            }
        }

        [DataMember]
        public string Message { get; set; }

    }
}

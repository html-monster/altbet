using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AltBet.Exchange.Serializator
{
    interface ISerializer
    {
        string Serialize<T>(T obj);

        T Deserialize<T>(string data);
    }
}

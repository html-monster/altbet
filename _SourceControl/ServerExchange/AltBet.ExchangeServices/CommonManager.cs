using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AltBet.Exchange
{
    public static class CommonManager
    {
        private static Server _server;
        public static Server Server
        {
            get
            {
                if (_server == null)
                    Start();
                return _server;
            }
        }


        private static bool _started;

        public static void Start()
        {
            if (!_started)
            {
                _server = new Server();
                string error = _server.Start();
                if(string.IsNullOrEmpty(error))
                {
                    _started = true;
                }
            }
        }

        public static void Stop()
        {
            _server.Stop();
            _started = false;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;

namespace AltBet.ExchangeServices.Utils.FinanceServices.Skrill
{
    public class SkrillConfiguration
    {

        public SkrillConfiguration()
        {

        }
        public static string Paytoemail { get { return GetSettings("Paytoemail", "Skrill"); } }
        public static string Password { get { return GetSettings("Password", "Skrill"); } }
        public static string Endpoint { get { return GetSettings("Endpoint", "Skrill"); } }
        public static string EndpointForTransferOut { get { return GetSettings("EndpointForTransferOut", "Skrill"); } }
        public static string SecretWord { get { return GetSettings("SecretWord", "Skrill"); } }


        private static string GetSettings(string key, string sectionName = "appSettings")
        {
            NameValueCollection settings = (NameValueCollection)ConfigurationManager.GetSection(sectionName);

            if (settings == null) throw new Exception(string.Format("{0}/{1} missing from config file in assembly (DOUBLE CHECK THIS PATH): {2}", sectionName, key, ExecutingAssembly));

            if (settings[key] == null) throw new Exception(string.Format("{0}/{1} can't find a key: {2}", sectionName, key, ExecutingAssembly));
                
            return settings[key];
        }

        public static string ExecutingAssembly
        {
            get
            {
                string codeBase = Assembly.GetExecutingAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return new FileInfo(path).FullName;
            }
        }
    }
}
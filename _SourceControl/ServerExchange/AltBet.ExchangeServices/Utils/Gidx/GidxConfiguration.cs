using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.ServiceModel.Description;
using System.Web;
using GIDX.SDK.Models;

namespace AltBet.ExchangeServices.Utils.Gidx
{
    public class GidxConfiguration
    {
        public GidxConfiguration()
        {
        }

        public static string MerchantId { get { return GetSettings("MerchantID", "Gidx"); } }

        public static string ApiKey { get { return GetSettings("ApiKey", "Gidx"); } }

        public static string ProductTypeId { get { return GetSettings("ProductTypeID", "Gidx"); } }

        public static string DeviceTypeId { get { return GetSettings("DeviceTypeID", "Gidx"); } }
       
        public static string ActivityTypeId { get { return GetSettings("ActivityTypeID", "Gidx"); } }

        public static string WebRegCallBack { get { return GetSettings("WebRegCallBack", "Gidx"); } }
        
        public static string WebCashCallBack { get { return GetSettings("WebCashCallBack", "Gidx"); } }

       
        //http://stackoverflow.com/a/283917
        public static string AssemblyDirectory
        {
            get
            {
                string codeBase = Assembly.GetExecutingAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
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

        private static string GetSettings(string key, string sectionName = "appSettings")
        {
            NameValueCollection settings = (NameValueCollection)ConfigurationManager.GetSection(sectionName);

            if (settings != null)
                if (settings[key] != null)
                    return settings[key];
            throw new Exception(sectionName + "/" + key + " missing from config file in assembly (DOUBLE CHECK THIS PATH): " + ExecutingAssembly);
        }

        /// <summary>
        /// Get an appsetting but does NOT throw an error if settings does not exist.
        /// </summary>
        public static bool TryGetSettings(string key, out string value)
        {
            try
            {
                value = GetSettings(key);
                return true;
            }
            catch
            {
                value = "";
                return false;
            }
        }

        public static MerchantCredentials GetCredentials()
        {
            return new MerchantCredentials()
            {
                MerchantID = MerchantId,
                ApiKey = ApiKey,
                ActivityTypeID = ActivityTypeId,
                DeviceTypeID = DeviceTypeId,
                ProductTypeID = ProductTypeId
            };
        }
    }
}
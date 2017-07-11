using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using AltBet.Exchange;
using AltBet.Model;

namespace AltBet.ExchangeServices.Utils.PushNotifications
{
    public class PushNotificationManager
    {


        public static void NewCreateNotification(PushSubscribe model)
        {
             var req = new RestRequest("/v1/transferOut", Method.POST)
            {
                RequestFormat = DataFormat.Json
            };
            req.AddBody(model);

        }



        public static void CreateNotification(string note)
        {
           



            var request = WebRequest.Create("https://onesignal.com/api/v1/notifications") as HttpWebRequest;

            request.KeepAlive = true;
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";

            request.Headers.Add("authorization", "Basic NmMzMGM1NDctYTEwMi00Mjg5LWI2MTQtZmFiNWJlNDUwNGU0");

            var serializer = new JavaScriptSerializer();
            var obj = new { app_id = "0730dc3f-a40a-4893-ae28-29b5e2455865",
                           contents = new { en = note },
                           included_segments = new string[] {"All"} };
            var param = serializer.Serialize(obj);
            byte[] byteArray = Encoding.UTF8.GetBytes(param);

            string responseContent = null;
         

            try {
                using (var writer = request.GetRequestStream()) {
                    writer.Write(byteArray, 0, byteArray.Length);
                }

                using (var response = request.GetResponse() as HttpWebResponse) {
                    using (var reader = new StreamReader(response.GetResponseStream())) {
                        responseContent = reader.ReadToEnd();
                    }
                }
            }
            catch (WebException ex) {
                System.Diagnostics.Debug.WriteLine(ex.Message);
                System.Diagnostics.Debug.WriteLine(new StreamReader(ex.Response.GetResponseStream()).ReadToEnd());
            }

            System.Diagnostics.Debug.WriteLine(responseContent);

        }

    }
}
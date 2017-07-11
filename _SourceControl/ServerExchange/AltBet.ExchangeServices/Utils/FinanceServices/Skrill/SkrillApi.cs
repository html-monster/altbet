using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Xml;
using AltBet.Exchange;
using AltBet.Model.Finance.SkrillModel;

namespace AltBet.ExchangeServices.Utils.FinanceServices.Skrill
{
    public class SkrillApi
    {
        string Endpoint { get { return "https://www.skrill.com/app/pay.pl"; } }


        public SkrillOutResponse SkrillOut(string data, string name)
        {
            //Response Handler
            ResultXml sidRequest = GetSID(data, name);
            if (sidRequest.error != null)
            {
                Log.WritePaymentInfo("SKRILL OUT --> error while getting SID: " + sidRequest.error, name);
                var result = new SkrillOutResponse { error = "error while getting SID: " + sidRequest.error };
                return result;
            }
            else
            {
                data = string.Format("action=transfer&sid={0}", sidRequest.sid);
                var result = MakeTransfer(data, name);
                Log.WritePaymentInfo("SKRILL OUT --> id: " + result.transactionId + " | amount: " + result.amount + " | status msg: " + result.status_msg, name);
                return result;
            }

        }

        public ResultXml GetSID(string data, string name)
        {
            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(Endpoint);

            httpRequest.Method = "POST";
            httpRequest.ContentType = "application/x-www-form-urlencoded";



            using (StreamWriter writer = new StreamWriter(httpRequest.GetRequestStream()))
            {
                writer.Write(data);
                writer.Close();
            }
            using (HttpWebResponse response = (HttpWebResponse)httpRequest.GetResponse())
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(new StreamReader(response.GetResponseStream(), Encoding.UTF8));



                if (doc.ChildNodes[1].FirstChild.Name != "error")
                {
                    string answ = doc.ChildNodes[1].FirstChild.InnerText;
                    return new ResultXml { sid = answ };
                }
                else
                {
                    string error = doc.ChildNodes[1].FirstChild.InnerText;
                    return new ResultXml { error = error };
                }
            }
        }


        public SkrillOutResponse MakeTransfer(string data, string name)
        {
            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(Endpoint);

            httpRequest.Method = "POST";
            httpRequest.ContentType = "application/x-www-form-urlencoded";



            using (StreamWriter writer = new StreamWriter(httpRequest.GetRequestStream()))
            {
                writer.Write(data);
                writer.Close();
            }
            using (HttpWebResponse response = (HttpWebResponse)httpRequest.GetResponse())
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(new StreamReader(response.GetResponseStream(), Encoding.UTF8));

                string amount = doc.GetElementsByTagName("amount")[0].InnerXml;
                string currency = doc.GetElementsByTagName("currency")[0].InnerXml;
                string id = doc.GetElementsByTagName("id")[0].InnerXml;
                string status = doc.GetElementsByTagName("status")[0].InnerXml;
                string status_msg = doc.GetElementsByTagName("status_msg")[0].InnerXml;

                if (doc.ChildNodes[1].FirstChild.Name != "error")
                {

                    //string amount = doc.GetElementsByTagName("amount")[0].InnerXml;
                    //string currency = doc.GetElementsByTagName("currency")[0].InnerXml;
                    //string id = doc.GetElementsByTagName("id")[0].InnerXml;
                    //string status = doc.GetElementsByTagName("status")[0].InnerXml;
                    //string status_msg = doc.GetElementsByTagName("status_msg")[0].InnerXml;

                    return new SkrillOutResponse
                    {
                        status = status,
                        amount = Convert.ToDecimal(amount),
                        currency = currency,
                        SkrillAnswer = new SkrillAnswer
                        {
                            Code = "200",
                            Message = "OK"
                        },
                        status_msg = status_msg,
                        transactionId = id
                    };
                }
                else
                {
                    string error = doc.ChildNodes[1].FirstChild.InnerText;
                    Log.WritePaymentInfo("SKRILL OUT Error --> " + error, name);
                    return new SkrillOutResponse { transactionId = id, amount = Convert.ToDecimal(amount), SkrillAnswer = new SkrillAnswer { Code = error } };
                }
            }
        }




        public void GetStatus(SkrillStatus data)
        {
            var res = data;

        }

        public static string StringToMD5(string str)
        {
            var cryptHandler = new MD5CryptoServiceProvider();
            byte[] ba = cryptHandler.ComputeHash(Encoding.UTF8.GetBytes(str));

            var hex = new StringBuilder(ba.Length * 2);

            foreach (byte b in ba)
                hex.AppendFormat("{0:X2}", b);

            return hex.ToString();
        }



    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Hangfire;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace AltBet.ExchangeServices.Utils
{
    public class SmsManager
    {
        private static string _Sid = "AC953453d155f1ac6043ae789ed5be3358";
        private static string _Token = "88105e117f36e3105f34db6da531b708";

        public static void SendSms(string number, string text)
        {
          BackgroundJob.Enqueue(()=>Send(number, text));
        }

        public static void Send(string number, string text)
        {
            TwilioClient.Init(_Sid, _Token);

            var message = MessageResource.Create(
                new PhoneNumber(number),
                from: new PhoneNumber("+19175127573"),
                body: text
            );
            var c = message.Sid;
        }


        public static string GetCode()
        {
            string num = "0123456789";
            int len = num.Length;
            string otp = string.Empty;

            int otpdigit = 5;
            string finaldigit;
            int getindex;

            for (int i = 0; i < otpdigit; i++)
            {
                do
                {
                    getindex = new Random().Next(0, len);
                    finaldigit = num.ToCharArray()[getindex].ToString();
                } while (otp.IndexOf(finaldigit) != -1);
                otp += finaldigit;
            }
            return otp;
        }
        
    }
}
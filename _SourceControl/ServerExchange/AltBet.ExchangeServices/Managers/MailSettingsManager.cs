//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using MailChimp;
//using MailChimp.Helper;
//using AltBet.Model;
//using MailChimp.Lists;

//namespace AltBet.Exchange.Managers
//{
//    public class MailSettingsManager:IMailSettingsManager
//    {
//        MailChimpManager mc = new MailChimpManager("9954ac5c80a42cf64a01432b1909d8b1-us15");
//        string list_id = "966c54e7bf";
//        public void MailChimpSubscribe(string email)
//        {
//            mc.Subscribe(list_id, new EmailParameter { Email = email });
//        }

//        public void MailChimpUnsubscribe(string email)
//        {
//            mc.Unsubscribe(list_id, new EmailParameter { Email = email }, true);
//        }

//        public void MailChimpSettings(string email, Model.User settings)
//        {
//            if (settings.MailNews == true.ToString().ToLower())
//            {
//                MailChimpSubscribe(email);
//            }
//            else { MailChimpUnsubscribe(email);}
//        }

//        public string GetLinkForForm()
//        {
//            var request = mc.GetLists(new ListFilter {ListId = list_id});
//            if (request != null)
//            {
//                return request.Data[0].SubscribeUrlShort;
//            }

//            return null;
//        }


//    }
//}

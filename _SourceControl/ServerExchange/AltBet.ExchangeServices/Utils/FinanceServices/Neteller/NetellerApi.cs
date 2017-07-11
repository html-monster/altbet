using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using AltBet.Exchange;
using AltBet.Model.Finances.NetellerModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using RestSharp.Authenticators;

namespace AltBet.ExchangeServices.Utils.FinanceServices.Neteller
{
    public class NetellerApi
    {

        static string EndpointProduction = "https://api.neteller.com";
        static string EndpointTest = "https://test.api.neteller.com";

        //private static NLog.Logger logger = LogManager.GetCurrentClassLogger();

        private NetellerEnvironment _netellerEnvironment;
        public NetellerEnvironment NetellerEnvironment { get { return _netellerEnvironment; } }

        public string EncodedAuthString { get; private set; }

        public NetellerApi(NetellerEnvironment e)
        {
            _netellerEnvironment = e;
            try
            {
                EncodedAuthString = GetEncodedAuthString(ClientID, ClientSecret);
                //EncodedAuthString = GetEncodedAuthString("AAABWEpzVlf0cUgR", "0.4glVrL2Ws_wHFgS9Lg53Ovxefs8u3EzkC-iMzEWKRoo.vjfoLRa-q0MR4PHWEJMCDzXhxck");
            }
            catch (Exception ex)
            {
                throw new Exception("Could not initialize Neteller API. Missing ClientID and ClientSecret, check Neteller.config file and create it from Neteller.config.sample if missing. Exception: " + ex.Message);
            }
        }


        public static string GetEncodedAuthString(string clientId, string clientSecret)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(clientId + ":" + clientSecret));
        }

        public string Endpoint
        {
            get
            {
                if (_netellerEnvironment == NetellerEnvironment.Production)
                    return EndpointProduction;
                else
                    return EndpointTest;
            }
        }

        public string RedirectUrl
        {
            get
            {
                if (_netellerEnvironment == NetellerEnvironment.Production)
                    return Configuration.RedirectUrl;
                else
                    return Configuration.RedirectUrlTest;
            }
        }

        public string ClientID
        {
            get
            {
                if (_netellerEnvironment == NetellerEnvironment.Production)
                    return Configuration.ClientID;
                else
                    return Configuration.ClientIDTest;
            }
        }

        public string ClientSecret
        {
            get
            {
                if (_netellerEnvironment == NetellerEnvironment.Production)
                    return Configuration.ClientSecret;
                else
                    return Configuration.ClientSecretTest;
            }
        }

        /// <summary>
        /// Execute a Requst using default accessToken
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="request"></param>
        /// <returns></returns>

        //my try to make transferIn

        public Payment TransferIn(TransferIn model)
        {
           // var requestData = new TransferIn(){verificationCode = model.verificationCode, transaction = new Transaction(){amount = model.transaction.amount,}}; 

            var req = new RestRequest("/v1/transferIn", Method.POST)
            {
                RequestFormat = DataFormat.Json
            };

            req.AddBody(model);

            Log.WritePaymentInfo(String.Format("NETELLER REQUEST IN---> RefId: {0} | amount: {1}(in cents)| neteller_name: {2}", model.transaction.merchantRefId, model.transaction.amount, model.paymentMethod.value), model.name);


            var resp = Execute(req, model.name);

            return resp;
        }


        public Payment TransferOut(TransferOut model)
        {
            var req = new RestRequest("/v1/transferOut", Method.POST)
            {
                RequestFormat = DataFormat.Json
            };
            req.AddBody(model);

            Log.WritePaymentInfo(String.Format("NETELLER REQUEST OUT---> RefId: {0} | amount: {1} | neteller_name: {2}", model.transaction.merchantRefId, model.transaction.amount, model.payeeProfile.email), model.name);

            var resp = Execute(req, model.name);

            return resp;

        }



        private Payment Execute(RestRequest request, string name)
        {
            try
            {
                return Execute(request, GetAccessToken(), name);
            }
            catch (Exception ex)
            {

                Log.WritePaymentInfo(ex.Message, name);
                return new Payment { Answer = new Answer { code = "555", message = "Fatal Error while Executing" } };

            }

        }

        private Payment Execute(RestRequest request, string accessToken, string name)
        {
            var client = new RestClient(this.Endpoint);

            request.AddHeader("Content-Type", "application/json");
            //request.AddHeader("Content-Type", "application/json;charset=UTF-8");

            request.RequestFormat = DataFormat.Json;

            //all dates from Neteller are formatted using this format, and in UTC
            //will turn all parsed dates into LOCAL TIME, adjusting the hours accordingly.
            //request.DateFormat = Format.DateTimeUTC;

            client.Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(accessToken, "Bearer");


            //Log.WritePaymentInfo("Using accessToken " + accessToken,name);
            var response = client.Execute<Payment>(request);


            //Log.WritePaymentInfo(string.Format("NetellerAPI response: {0} {1}\n{2}", request.Method, request.Resource, response.Content),name);

            if (response.StatusCode != HttpStatusCode.OK)
            {

                string netellerMsg = response.Content.Replace("\n", "").Replace("  ", " ");
                try
                {
                    netellerMsg = GetErrorMessage(response.Content);
                }
                catch { } //if message is missing, send the entire content

                string message = string.Format("NetellerAPI {0} {1} response failed with status {2}. Message:\n{3}", request.Method, request.Resource, response.StatusCode, netellerMsg);

                Payment err = GetErr(response);

                Log.WritePaymentInfo("NETELLER RESPONSE   ---> Error Code: " + netellerMsg, name);
                return err;

            }

            if (response.ErrorException != null)
            {
                const string message = "Error retrieving response.  Check inner details for more info.";

                Log.WritePaymentInfo(message + "\n" + response.ErrorException.ToString(), name);

                throw new NetellerException(message, response.ErrorException, response);
            }

            response.Data.Answer = new Answer { code = "200", message = "OK" };
            Log.WritePaymentInfo(String.Format("NETELLER RESPONSE   ---> RefId: {0} | Code is : 200 OK | transactionID: {1}", response.Data.Transaction.merchantRefId, response.Data.Transaction.id), name);

            return response.Data;
        }

        private string GetRequestDescription(RestRequest request)
        {
            string parameterString = string.Join("\n", request.Parameters.Select(p => p.Name + "=" + p.Value));
            return string.Format("Neteller request: {0}\nParameters: {1}", request.Resource, parameterString);
        }

        private string GetErrorMessage(string content)
        {
            dynamic parsedJson = JsonConvert.DeserializeObject(content);
            return JsonConvert.SerializeObject(parsedJson, Formatting.Indented);
        }


        public string GetAccessToken()
        {
            string na;
            return GetAccessToken(GrantType.client_credentials, null, out na);
        }

        /// Get a new access token (not expecting a refresh token)

        public string GetAccessToken(GrantType grantType, string token)
        {
            string na;
            return GetAccessToken(grantType, token, out na);
        }

        /// <summary>
        /// Get a new access token (and possibly refresh token)
        /// </summary>
        public string GetAccessToken(GrantType grantType, string token, out string refreshToken)
        {
            try
            {
                var client = new RestClient(this.Endpoint);
                var request = new RestRequest("v1/oauth2/token", Method.POST);
                refreshToken = "";

                //there should be an easier way of sending basic auth? similar to oauth v1:
                //client.Authenticator = OAuth1Authenticator.ForRequestToken(consumerKey, consumerSecret);

                request.AddHeader("Authorization", "Basic " + EncodedAuthString);

                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Cache-Control", "no-cache");

                switch (grantType)
                {
                    case GrantType.client_credentials:
                        request.AddParameter("grant_type", "client_credentials");
                        break;
                    case GrantType.refresh_token:
                        request.AddParameter("grant_type", "refresh_token");
                        request.AddParameter("refresh_token", token);
                        break;
                    case GrantType.authorization_code:
                        request.AddParameter("grant_type", "authorization_code");
                        request.AddParameter("code", token);
                        request.AddParameter("redirect_url", RedirectUrl);
                        break;
                }

                var response = client.Execute(request);

                string result = response.Content;
                if (

                    result.Contains("error") ||
                    result.Contains("invalid_request") ||
                    result.Contains("invalid_client") ||
                    result.Contains("invalid_grant") ||
                    result.Contains("invalid") ||
                    result.Contains("unauthorized_client") ||
                    result.Contains("unsupported_grant_type") ||
                    result.Contains("invalid_scope")
                )
                {
                    string msg = "Error getting access token from Neteller: " + response.Content;

                    throw new Exception(msg + response.Content);
                }

                return GetAccessTokenAndRefreshToken(response.Content, out refreshToken);

            }
            catch (Exception ex)
            {
                throw new Exception("NETELLER FATAL ERROR ---> Error Getting accesstoken from Neteller : " + ex.Message);
            }
        }

        private string GetAccessToken(string content)
        {
            dynamic obj = JObject.Parse(content);
            string accessToken = (string)obj["accessToken"];
            return accessToken;
        }

        private string GetAccessTokenAndRefreshToken(string content, out string refreshToken)
        {
            dynamic obj = JObject.Parse(content);
            if (obj["refreshToken"] != null)
                refreshToken = (string)obj["refreshToken"];
            else
            {
                refreshToken = "";
            }
            return (string)obj["accessToken"];
        }




        private Payment GetErr(IRestResponse res)
        {
            string content = res.Content;
            string code = "";
            string errorMessage = "";
            GetErrorCodeAndMessage(content, out code, out errorMessage);

            return new Payment
            {
                Answer = new Answer
                {
                    code = code,
                    message = errorMessage
                }
            };
        }

        public void GetErrorCodeAndMessage(string content, out string code, out string errorMessage)
        {
            code = "";
            errorMessage = "";

            try
            {
                dynamic obj = JObject.Parse(content);
                dynamic error = obj["error"];

                if (error != null)
                {
                    if (error["code"] != null)
                        code = (string)error["code"];
                    if (error["message"] != null)
                        errorMessage = (string)error["message"];
                }
            }
            catch
            {
                //	logger.Fatal("Could not extract code and message from Neteller exception: " + content);
            }
        }



    }
}
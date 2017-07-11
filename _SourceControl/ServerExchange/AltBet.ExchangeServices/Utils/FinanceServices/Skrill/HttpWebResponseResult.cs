using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using AltBet.Model.Finances.SkrillModels;


namespace AltBet.ExchangeServices.Utils.FinanceServices.Skrill
{
    public class HttpWebResponseResult : ActionResult
    {
        private HttpWebResponse _response;
        private ActionResult _innerResult;

        /// <summary>
        /// Relays an HttpWebResponse as verbatim as possible.
        /// Source:  http://www.wiliam.com.au/wiliam-blog/web-design-sydney-relaying-an-httpwebresponse-in-asp-net-mvc
        /// </summary>
        /// <param name="responseToRelay">The HTTP response to relay</param>
        //public HttpWebResponseResult(HttpWebResponse responseToRelay)
        //{
        //    if (responseToRelay == null)
        //    {
        //        throw new ArgumentNullException("response");
        //    }

        //    _response = responseToRelay;

        //    Stream contentStream;
        //    if (responseToRelay.ContentEncoding.Contains("gzip"))
        //    {
        //        contentStream = new GZipStream(responseToRelay.GetResponseStream(), CompressionMode.Decompress);
        //    }
        //    else if (responseToRelay.ContentEncoding.Contains("deflate"))
        //    {
        //        contentStream = new DeflateStream(responseToRelay.GetResponseStream(), CompressionMode.Decompress);
        //    }
        //    else
        //    {
        //        contentStream = responseToRelay.GetResponseStream();
        //    }


        //    if (string.IsNullOrEmpty(responseToRelay.CharacterSet))
        //    {
        //        // File result
        //        _innerResult = new FileStreamResult(contentStream, responseToRelay.ContentType);
        //    }
        //    else
        //    {
        //        // Text result
        //        var contentResult = new ContentResult();
        //        contentResult = new ContentResult();
        //        contentResult.Content = new StreamReader(contentStream).ReadToEnd();
        //        _innerResult = contentResult;
        //    }
        //}

        //Method returns string "url" for send it to frontEnd
        public SkrillAnswer GetUrlForRedirect(HttpWebResponse responseToRelay)
        {
            _response = responseToRelay;

            Stream contentStream;
            if (responseToRelay.ContentEncoding.Contains("gzip"))
            {
                contentStream = new GZipStream(responseToRelay.GetResponseStream(), CompressionMode.Decompress);
            }
            else if (responseToRelay.ContentEncoding.Contains("deflate"))
            {
                contentStream = new DeflateStream(responseToRelay.GetResponseStream(), CompressionMode.Decompress);
            }
            else
            {
                contentStream = responseToRelay.GetResponseStream();
            }


            if (string.IsNullOrEmpty(responseToRelay.CharacterSet))
            {
                // File result
                _innerResult = new FileStreamResult(contentStream, responseToRelay.ContentType);
            }
            else
            {
                // Text result
                var contentResult = new ContentResult();
                contentResult = new ContentResult();
                var res = contentResult.Content = new StreamReader(contentStream).ReadToEnd();
                string url = getBetween(res, "url=", "\">");
                return (new SkrillAnswer { Code = "200", Message = url });

            }
            return (new SkrillAnswer { Code = "500", Message = "error while getting URL from response" });
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var clientResponse = context.HttpContext.Response;
            clientResponse.StatusCode = (int)_response.StatusCode;

            foreach (var headerKey in _response.Headers.AllKeys)
            {
                switch (headerKey)
                {
                    case "Content-Length":
                    case "Transfer-Encoding":
                    case "Content-Encoding":
                        // Handled by IIS
                        break;

                    default:
                        clientResponse.AddHeader(headerKey, _response.Headers[headerKey]);
                        break;
                }
            }

            //  _innerResult.ExecuteResult(context);
        }

        public static string getBetween(string strSource, string strStart, string strEnd)
        {
            int Start, End;
            if (strSource.Contains(strStart) && strSource.Contains(strEnd))
            {
                Start = strSource.IndexOf(strStart, 0) + strStart.Length;
                End = strSource.IndexOf(strEnd, Start);
                return strSource.Substring(Start, End - Start);
            }
            else
            {
                return "";
            }
        }
    }
}
using AltBet.Exchange;
using AltBet.Exchange.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace AltBet.ExchangeServices.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "ExchangeService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select ExchangeService.svc or ExchangeService.svc.cs at the Solution Explorer and start debugging.
    public class ExchangeService : IExchangeManager
    {
        private string allSymbolsAndOrdersSerialized = null;

        public List<AdminExchange> GetExchanges()
        {
            return CommonManager.Server.GetExchangesRequestMethod(new GetExchangesRequest());
        }

        public List<AllSymbolsAndOrders> GetAllSymbolsAndOrders(string sort, string path = null)
        {
            return CommonManager.Server.GetAllSymbolsAndOrdersRequestMethod(sort, path);
        }

        public AllSymbolsAndOrders GetSymbolAndOrdersByUrl(GetSymbolsAndOrdersByUrlRequest request, string sort)
        {
            return CommonManager.Server.GetSymbolsAndOrdersByUrlRequestMethod(request, sort);
        }

        public int GetItemsOnPage()
        {
            return CommonManager.Server.GetItemsOnPage();
        }

        public string CreateExchange(AddExchangeRequest request)
        {
            return CommonManager.Server.AddExchangeRequestMethod(request);
        }

        public string EditExchange(EditExchangeRequest request)
        {
            return CommonManager.Server.EditExchangeRequestMethod(request);
        }

        public string CloseExchange(CloseExchangeRequest request)
        {
            return CommonManager.Server.CloseExchangeRequestMethod(request);
        }

        public string DeleteExchange(string exchange)
        {
            return CommonManager.Server.DeleteExchangeRequestMethod(exchange);
        }

        public string ChangeStatus(StatusExchangeRequest request)
        {
            return CommonManager.Server.ChangeStatusRequestMethod(request);
        }

        public List<AdminExchange> GetSortExchanges(string sortBy, StatusEvent? status)
        {
            var exchanges = GetExchanges().Where(s => s.Symbol.Status == (status ?? StatusEvent.Approved)).ToList();
            List<AdminExchange> exchangeSort;

            switch (sortBy)
            {
                case "FullNameAsc":
                    exchangeSort = exchanges.OrderBy(e => e.Symbol.FullName).ToList();
                    break;
                case "FullNameDesc":
                    exchangeSort = exchanges.OrderByDescending(e => e.Symbol.FullName).ToList();
                    break;
                case "StartDateAsc":
                    exchangeSort = exchanges.OrderBy(e => e.Symbol.StartDate ?? DateTime.MaxValue).ToList();
                    break;
                case "StartDateDesc":
                    exchangeSort = exchanges.OrderByDescending(e => e.Symbol.StartDate).ToList();
                    break;
                case "EndDateAsc":
                    exchangeSort = exchanges.OrderBy(e => e.Symbol.EndDate ?? DateTime.MaxValue).ToList();
                    break;
                case "EndDateDesc":
                    exchangeSort = exchanges.OrderByDescending(e => e.Symbol.EndDate).ToList();
                    break;
                default:
                    exchangeSort = exchanges.OrderBy(e => e.Symbol.FullName).ToList();
                    break;
            }
            return exchangeSort;
        }
    }
}

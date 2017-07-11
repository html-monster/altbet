using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface IExchangeManager
    {
        [OperationContract]
        List<AllSymbolsAndOrders> GetAllSymbolsAndOrders(string sort, string path = null);

        [OperationContract]
        List<AdminExchange> GetExchanges();

        [OperationContract]
        string CreateExchange(AddExchangeRequest request);

        [OperationContract]
        string EditExchange(EditExchangeRequest request);

        [OperationContract]
        string DeleteExchange(string exchange);

        [OperationContract]
        string ChangeStatus(StatusExchangeRequest request);

        [OperationContract]
        string CloseExchange(CloseExchangeRequest request);

        [OperationContract]
        AllSymbolsAndOrders GetSymbolAndOrdersByUrl(GetSymbolsAndOrdersByUrlRequest request, string sort);

        [OperationContract]
        List<AdminExchange> GetSortExchanges(string sortBy, StatusEvent? status);

        [OperationContract]
        int GetItemsOnPage();
    }
}

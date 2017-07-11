using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AltBet.Model;
using System.ServiceModel;

namespace AltBet.Exchange.Managers
{
    [ServiceContract]
    public interface IOrderManager
    {
        [OperationContract]
        void Add(Order order);

        [OperationContract]
        bool Cancel(Order order);

        [OperationContract]
        GetOrdersResponse GetOrders(GetOrdersRequest symbol);

        [OperationContract]
        OrdersPositionsHistory GetOrdersOrPositions(GetOrdersOrPositionsRequest request);

        [OperationContract]
        List<CurrentOrders> GetCurrentOrders(string userName);

        [OperationContract]
        void CancelAll(string symbol, string name);

        [OperationContract]
        void CloseOut(string symbol, string name);

        [OperationContract]
        void Reverse(string symbol, string name);

        [OperationContract]
        void GetOrderAndCancel(Order order);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AltBet.Model;

namespace AltBet.Exchange.Managers
{
    public class OrderManager : IOrderManager
    {
        //1. CURRENT ORDERS
        public List<CurrentOrders> GetCurrentOrders(string userName)
        {
            return CommonManager.Server.GetCurrentOrdersRequestMethod(userName);
        }

        //2. ORDERS POSITIONS HISTORY
        public OrdersPositionsHistory GetOrdersOrPositions(GetOrdersOrPositionsRequest request)
        {
            return CommonManager.Server.GetOrdersOrPositionsRequestMethod(request);
        }

        //3. ACTIVE ORDERS AND TICKS
        public GetOrdersResponse GetOrders(GetOrdersRequest request)
        {
            return CommonManager.Server.GetOrdersRequestMethod(request);
        }

        //4. CANCEL RESULT
        public bool Cancel(Order order)
        {
            return CommonManager.Server.CancelOrderRequestMethod(new CancelOrderRequest { ID = order.ID });
        }

        //5. ORDER
        public void Add(Order order)
        {
            CommonManager.Server.NewOrderRequestMethod(new NewOrderRequest
            {
                ID = order.ID,
                Symbol = new Symbol
                {
                    Currency = order.Symbol.Currency.Name,
                    Exchange = order.Symbol.Exchange.Name,
                    Name = order.Symbol.Name,
                    FullName = "",
                    HomeName = "",
                    HomeAlias = "",
                    AwayName = "",
                    AwayAlias = "",
                    StartDate = null,
                    EndDate = null,
                    Status = StatusEvent.New,
                    CategoryId = Guid.Empty,
                    TypeEvent = TypeEvent.Short,
                    UrlExchange = "",
                    ResultExchange = "",
                    ApprovedDate = null,
                    SettlementDate = null,
                    LastPrice = 0m,
                    LastSide = null,
                    LastAsk = 1m,
                    LastBid = 0m,
                    HomePoints = null,
                    HomeHandicap = null,
                    AwayPoints = null,
                    AwayHandicap = null,
                    SortingData = new List<ExchangeSortData>(),
                    StatusEvent = string.Empty,
                    PriceChangeDirection = 0,
                    DelayTime = 0
                },
                Time = order.Time,
                ActivationTime = order.ActivationTime,
                Account = order.AccountID,
                Side = (Side)Enum.Parse(typeof(Side), order.Side.ToString()),
                OrderType = (Type)Enum.Parse(typeof(Type), order.OrderType.ToString()),
                LimitPrice = order.LimitPrice,
                StopPrice = order.StopPrice,
                Quantity = order.Quantity,
                TimeInForce = (TimeInForce)Enum.Parse(typeof(TimeInForce), order.TimeInForce.ToString()),
                ExpirationDate = order.ExpirationDate,
                IsMirror = order.isMirror
            });
        }

        //6. CANCEL ALL
        public void CancelAll(string symbol, string name)
        {
            CommonManager.Server.CancelAllMethod(symbol, name);
        }

        //7. CLOSE OUT
        public void CloseOut(string symbol, string name)
        {
            CommonManager.Server.CloseOutReverseMethod(symbol, name, false);
        }

        //8. REVERSE
        public void Reverse(string symbol, string name)
        {
            CommonManager.Server.CloseOutReverseMethod(symbol, name, true);
        }

        //9. DRAG AND DROP CANCEL
        public void GetOrderAndCancel(Order order)
        {
            CommonManager.Server.CloseMultiple(order);
        }

    }
}

using AltBet.Exchange.WebSocketSender;
using SuperWebSocket;
using System;
using System.Collections.Generic;
using System.Net;
using System.Runtime.Serialization;
using System.Text;

namespace AltBet.Exchange
{
    public enum Sort
    {
        New,
        ClosingSoon,
        Popular,
        Movers
    }
    public enum LoginResult
    {
        OK,
        InvalidCredentials,
        AlreadyLogged,
        InternalError,
    }
    //historical request periodicity 
    public enum Periodicity
    {
        Tick = 0,
        Secondly = 1,
        Minutely = 2,
        Hourly = 3,
        Daily = 4,
        Weekly = 5,
        Monthly = 6,
        Yearly = 7
    }

    public enum Result
    {
        Positive,
        Negative,
        Draw,
        Undefined,
        Emergency
    }

    //order duration
    public enum TimeInForce
    {
        DAY,
        GTC,
        GTD,
        FOK,
        AON,
        IOC
    }

    //order type
    public enum Type
    {
        Market,
        Stop,
        Limit,
        StopLimit
    }

    //order side
    public enum Side
    {
        Buy,
        Sell
    }

    //order status
    public enum Status
    {    
        Opened,
        Activated ,
        PartialFilled,
        Filled,
        Done,
        Rejected,
        Cancelled,
        Expiried,
        OpenedPosition,
        PartialFilledPosition,
        FilledPosition,
        VirtualPosition,
        VirtualOrder
    }

    public enum Mode
    {
        Basic,
        Expert
    }

    public enum TypeEvent
    {
        Short = 1,
        Full = 2
    }

    public enum StatusEvent
    {
        New = 0,
        Approved = 1,
        Completed = 2,
        Settlement = 3,
        Suspended = 4
    }
    [DataContract]
    public class UserSubscriptions : UserSessionBase
    {
        [DataMember]
        public string User { get; set; }
        [DataMember]
        public string PageName { get; set; }
        [DataMember]
        public string PaginationNumber { get; set; }
        [DataMember]
        public string Sort { get; set; }
        [DataMember]
        public string ExchangeName { get; set; }
        [DataMember]
        public string CategoryPath { get; set; }
        [DataMember]
        public string ActiveTrader { get; set; }
        [DataMember]
        public string CurrentOrders { get; set; }
        [DataMember]
        public string MainPageChartsSymbol { get; set; }
    }

    [DataContract]
    public class GetUserBalanceRequest
    {
        [DataMember]
        public string UserName;
    }

    [DataContract]
    public class UserAssets
    {
        [DataMember]
        public decimal CurrentBalance;
        [DataMember]
        public decimal Invested;
        [DataMember]
        public decimal GainLost;
        [DataMember]
        public Account Account;
    }

    [DataContract]
    public class AdminLoginResponse
    {
        [DataMember]
        public LoginResult AdminLoginResult;
        [DataMember]
        public string User;
        //[DataMember]
        //public List<ExchangeSettings> Exchanges;
        //[DataMember]
        //public List<Currency> Currencies;
    }

    [DataContract]
    public class GetExchangesRequest
    {
    }

    [DataContract]
    public class GetExchangesResponse
    {
        [DataMember]
        public List<AdminExchange> Exchanges;
    }

    [DataContract]
    public class AdminExchange
    {
        [DataMember]
        public string Name;
        [DataMember]
        public DateTime StartDate;
        [DataMember]
        public DateTime EndDate;
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public string CategoryExchange;
        //[DataMember]
        //public bool isRunBot;
    }

    [DataContract]
    public partial class ExchangeSettings
    {
        [DataMember]
        public string Name;
        [DataMember]
        public TimeSpan StartTime;
        [DataMember]
        public TimeSpan EndTime;
        [DataMember]
        public List<Symbol> Symbols;
        [DataMember]
        public bool CommonCurrency;
        [DataMember]
        public DateTime StartDate;
        [DataMember]
        public DateTime EndDate;
    }

    [DataContract]
    public class AddUserRequest
    {
        [DataMember]
        public User User;
    }

    [DataContract]
    public class EditUserRequest
    {
        [DataMember]
        public User User;
    }

    [DataContract]
    public class DeleteUserRequest
    {
        [DataMember]
        public string UserName;
    }

    [DataContract]
    public class GetUserInfoRequest
    {
        [DataMember]
        public string UserName;

        [DataMember]
        public string Email;
    }

    [DataContract]
    public class ResultObj
    {
        [DataMember]
        public string Error;
        [DataMember]
        public string Param1;
        [DataMember]
        public string Param2;
        [DataMember]
        public string Param3;
    }

    [DataContract]
    public class AddExchangeRequest
    {
        [DataMember]
        public ExchangeSettings Exchange;
    }

    [DataContract]
    public class EditExchangeRequest
    {
        [DataMember]
        public ExchangeSettings Exchange;
    }

    [DataContract]
    public class StatusExchangeRequest
    {
        [DataMember]
        public string Exchange;
        [DataMember]
        public StatusEvent Status;
    }

    [DataContract]
    public class CloseExchangeRequestOld
    {
        [DataMember]
        public ExchangeSettings Exchange;
        [DataMember]
        public Result Result;
        [DataMember]
        public string Winner;
    }

    [DataContract]
    public class CloseExchangeRequest
    {
        [DataMember]
        public string ExchangeName;
        [DataMember]
        public int PositivePercent;
        [DataMember]
        public string Winner;
    }

    [DataContract]
    public class CloseExchangeResponse
    {
        [DataMember]
        public List<string> Result;
    }

    [DataContract]
    public class DeleteExchangeRequest
    {
        [DataMember]
        public string ExchangeName;
    }

    [DataContract]
    public class SetCurrenciesRequest
    {
        [DataMember]
        public List<Currency> Currencies;
    }

    [DataContract]
    public class ChangePasswordRequest
    {
        [DataMember]
        public string UserName;
        [DataMember]
        public string OldPassword;
        [DataMember]
        public string NewPassword;
    }

    [DataContract]
    public class LoginRequest : UserSessionBase
    {
        [DataMember]
        public string Email;
        [DataMember]
        public string UserName;
        [DataMember]
        public string Password;
        [DataMember]
        public string Url;
    }

    [DataContract]
    public class UserLoginResponse : WebSocketMessage
    {
        [DataMember]
        public LoginResult LoginResult;
        [DataMember]
        public List<Symbol> Symbols;
        [DataMember]
        public List<string> Currencies;
        [DataMember]
        public List<Account> Accounts;
        [DataMember]
        public List<NewOrderRequest> Orders;
        [DataMember]
        public List<Execution> Executions;
    }

    [DataContract]
    public class UserConfirmationResponse
    {
        [DataMember]
        public bool Result;
        [DataMember]
        public int ErrorCode;
        [DataMember]
        public string ErrorMessage;
    }

    [DataContract]
    public class UserNewHashCodeResponse
    {
        [DataMember]
        public string Result;
        [DataMember]
        public int ErrorCode;
        [DataMember]
        public string ErrorMessage;
    }


    [DataContract]
    public class SubscribeRequest
    {
        [DataMember]
        public string UserName;
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public string Currency;
        [DataMember]
        public bool Subscribe;
    }

    [DataContract]
    public partial class Symbol
    {
        [DataMember]
        public string Name;
        [DataMember]
        public string Exchange;
        [DataMember]
        public string Currency;
        [DataMember]
        public string FullName;
        [DataMember]
        public string HomeName;
        [DataMember]
        public string HomeAlias;
        [DataMember]
        public string AwayName;
        [DataMember]
        public string AwayAlias;
        [DataMember]
        public StatusEvent Status;
        [DataMember]
        public string StatusEvent;
        [DataMember]
        public DateTime? StartDate;
        [DataMember]
        public DateTime? EndDate;
        [DataMember]
        public string StartDateStr;
        [DataMember]
        public string EndDateStr;
        [DataMember]
        public Guid CategoryId;
        [DataMember]
        public TypeEvent TypeEvent;
        [DataMember]
        public string UrlExchange;
        [DataMember]
        public string ResultExchange;
        [DataMember]
        public DateTime? ApprovedDate;
        [DataMember]
        public DateTime? SettlementDate;
        [DataMember]
        public decimal LastPrice;
        [DataMember]
        public Side? LastSide;
        [DataMember]
        public decimal LastAsk;
        [DataMember]
        public decimal LastBid;
        [DataMember]
        public decimal? HomePoints;
        [DataMember]
        public decimal? HomeHandicap;
        [DataMember]
        public decimal? AwayPoints;
        [DataMember]
        public decimal? AwayHandicap;
        [DataMember]
        public List<ExchangeSortData> SortingData;
        [DataMember]
        public int PriceChangeDirection;
        [DataMember]
        public int DelayTime;

        public int OrderBy;

        public override string ToString()
        {
            return string.Format("{0}_{1}_{2}", Exchange, Name, Currency);
        }
    }

    [DataContract]
    public class ExchangeSortData
    {
        [DataMember]
        public string ID;
        [DataMember]
        public decimal Price;
        [DataMember]
        public long Quantity;
        [DataMember]
        public DateTime Date;
    }

    public enum SubscribeEnum
    {
        MainPage,
        EventPage,
        OrderPage
    }

    [DataContract]
    public class UploadedImageInfo
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public int Length { get; set; }
        [DataMember]
        public string Url { get; set; }
        [DataMember]
        public string ContentType { get; set; }
        [DataMember]
        public string ErrorMessage { get; set; }
        [DataMember]
        public int ErrorCode { get; set; }
    }

    public class UserSession : UserSessionBase
    {
        public string UserName { get; set; }
        public Dictionary<IWebSocketSession, KeyValuePair<SubscribeEnum, string[]>> SessionPage { get; set; }

        public bool isAuthUser = true;
    }

    public enum UserType
    {
        Registered,
        Confirmed,
        Verified
    }


    [DataContract]
    public class User
    {
        [DataMember]
        public string UserName;
        [DataMember]
        public string NickName;
        [DataMember]
        public string Password;
        [DataMember]
        public string Email;
        [DataMember]
        public string FirstName;
        [DataMember]
        public string LastName;
        [DataMember]
        public DateTime DateOfBirth;
        [DataMember]
        public string Country;
        [DataMember]
        public string Address;
        [DataMember]
        public string Phone;
        [DataMember]
        public string ConfirmationCode;
        [DataMember]
        public DateTime ConfirmationExpired;
        [DataMember]
        public UserType UserType;
        [DataMember]
        public DateTime InsertedDate;
        [DataMember]
        public DateTime LastEditedDate;
        [DataMember]
        public List<Account> Accounts;
        [DataMember]
        public List<PaymentsHistory> PaymentsHistory;
    }

    [DataContract]
    public class UserForMail
    {
        [DataMember]
        public string UserName;
        [DataMember]
        public string NickName;
        [DataMember]
        public string Email;
        [DataMember]
        public string FirstName;
        [DataMember]
        public string LastName;
        [DataMember]
        public List<Account> Accounts;
        [DataMember]
        public List<string> Data;
    }

    [DataContract]

    public class MailChimpAnswer
    {
        [DataMember]
        public string Code;
        [DataMember]
        public string Link;

    }

    [DataContract]
    public partial class Currency
    {
        [DataMember]
        public string Name;
        [DataMember]
        public decimal Multiplier;
    }

    [DataContract]
    public class Account : WebSocketMessage
    {
        [DataMember]
        public string Name;
        [DataMember]
        public string Email;
        [DataMember]
        public decimal Balance;
        [DataMember]
        public string Currency;
        [DataMember]
        public TariffPlan TariffPlan;
        [DataMember]
        public string Mode;
        [DataMember]
        public string Bettor;
        [DataMember]
        public string Trade;
        [DataMember]
        public string Theme;
        [DataMember]
        public string MailNews;
        [DataMember]
        public string MailUpdates;
        [DataMember]
        public string MailActivity;
        [DataMember]
        public string MailFrequency;
        [DataMember]
        public string SmsActivity;
        [DataMember]
        public string GIDX_CustomerId;
        [DataMember]
        public string GIDX_SessionId;
        
    }

    [DataContract]
    public class TariffPlan
    {
        [DataMember]
        public string Name;
        [DataMember]
        public int Quantity;
        [DataMember]
        public DateTime BeginTime;
    }

    [DataContract]
    public static class Fee
    {
        [DataMember]
        public static decimal TakerFee;
        [DataMember]
        public static decimal MakerFee;
    }

    [DataContract]
    public class HistoryParameters
    {
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public string Currency;
        [DataMember]
        public Periodicity Periodicity;
        [DataMember]
        public int Interval;
        [DataMember]
        public int BarsCount;
    }

    [DataContract]
    public partial class NewOrderRequest : ICloneable
    {
        [DataMember]
        public string ID;
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public DateTime Time;
        [DataMember]
        public DateTime ActivationTime;
        [DataMember]
        public string Account;
        [DataMember]
        public Side Side;
        [DataMember]
        public Type OrderType;
        [DataMember]
        public decimal LimitPrice;
        [DataMember]
        public decimal StopPrice;
        [DataMember]
        public long Quantity;
        [DataMember]
        public TimeInForce TimeInForce;
        [DataMember]
        public DateTime ExpirationDate;
        [DataMember]
        public int IsMirror;
    }

    [DataContract]
    public class ModifyOrderRequest
    {
        [DataMember]
        public string ID;
        [DataMember]
        public long Quantity;
        [DataMember]
        public Type OrderType;
        [DataMember]
        public decimal LimitPrice;
        [DataMember]
        public decimal StopPrice;
        [DataMember]
        public TimeInForce TimeInForce;
        [DataMember]
        public DateTime ExpirationDate;
    }

    [DataContract]
    public class CancelOrderRequest
    {
        [DataMember]
        public string ID;
    }

    [DataContract]
    public class CancelOrderResponse
    {
        [DataMember]
        public bool isCanceled;
    }

    [DataContract]
    public class GetOrdersResponse
    {
        [DataMember]
        public List<ActiveOrder> ActiveOrders;
        [DataMember]
        public List<Tick> Ticks;
    }

    [DataContract]
    public class GetOrdersRequest
    {
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public string Reflection;
        [DataMember]
        public string UserName;
    }

    [DataContract]
    public class GetAllSymbolsAndOrdersRequest
    {
    }
    
    [DataContract]
    public class GraphData
    {
        [DataMember]
        public List<GraphDataItem> Values;
    }

    [DataContract]
    public class GraphDataItem
    {
        [DataMember]
        public string Symbol;
        [DataMember]
        public List<ExchangeItem> ExchangeData;
    }

    [DataContract]
    public class ExchangeItem
    {
        [DataMember]
        public DateTime Time;
        [DataMember]
        public long Volume;
        [DataMember]
        public decimal StartPrice;
        [DataMember]
        public decimal HighPrice;
        [DataMember]
        public decimal LowPrice;
        [DataMember]
        public decimal CurrentPrice;
    }

    [DataContract]
    public class GetAllSymbolsAndOrdersResponse
    {
        [DataMember]
        public IList<AllSymbolsAndOrders> Result;
    }

    [DataContract]
    public class GetSymbolsAndOrdersByUrlRequest
    {
        [DataMember]
        public string ExchangeUrl;
    }

    [DataContract]
    public class CurrentOrders
    {
        [DataMember]
        public string ID;
        [DataMember]
        public string Symbol;
        [DataMember]
        public long Positions;
        [DataMember]
        public Side? LastSide;
        [DataMember]
        public decimal LastPrice;
        [DataMember]
        public List<OrderOrPosition> Orders;
    }

    [DataContract]
    public class GetCurrentOrdersRequest
    {
        [DataMember]
        public string Username;
    }

    [DataContract]
    public class GetCurrentOrdersResponse
    {
        [DataMember]
        public List<CurrentOrders> CurrentOrders;
    }

    [DataContract]
    public class GetOrdersOrPositionsRequest
    {
        [DataMember]
        public string Username;
    }

    [DataContract]
    public class GetOrdersOrPositionsResponse
    {
        [DataMember]
        public OrdersPositionsHistory ordersPositionsHistory;
    }

    [DataContract]
    public class OrdersPositionsHistory
    {
        [DataMember]
        public List<OrderOrPosition> OrdersOrPositions;
        [DataMember]
        public List<GroupPosition> Positions;
        [DataMember]
        public List<HistoryTradeItem> HistoryTradeItems;
    }

    [DataContract]
    public class OpenedPosition
    {
        [DataMember]
        public string ID;
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public DateTime Time;
        [DataMember]
        public decimal Price;
        [DataMember]
        public long Volume;
        [DataMember]
        public Side Side;
        [DataMember]
        public string Category;
        [DataMember]
        public int isMirror;
        [DataMember]
        public decimal ProfitLoss;
    }

    [DataContract]
    public class SubPosition
    {
        [DataMember]
        public string ID;
        [DataMember]
        public string EventName;
        [DataMember]
        public string EventHandicap;
        [DataMember]
        public decimal AvgPrice;
        [DataMember]
        public long CommonVolume;
        [DataMember]
        public decimal CommonProfitLoss;
        [DataMember]
        public Side Side;
        [DataMember]
        public int IsMirror;

        
    }

    [DataContract]
    public class GroupPosition
    {
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public string Category;
        [DataMember]
        public long CommonSymbolVolume;
        [DataMember]
        public decimal CommonSymbolProfitLoss;
        [DataMember]
        public List<SubPosition> SubPositions; 
    }

    [DataContract]
    public class HistoryTradeItem
    {
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public DateTime Time;
        [DataMember]
        public Side Side;
        [DataMember]
        public int IsMaker;
        [DataMember]
        public decimal Fees;
        [DataMember]
        public decimal Price;
        [DataMember]
        public long Quantity;
        [DataMember]
        public int IsMirror;
    }

    [DataContract]
    public class OrderOrPosition
    {
        [DataMember]
        public string ID;
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public DateTime Time;
        [DataMember]
        public decimal Price;
        [DataMember]
        public long Volume;
        [DataMember]
        public Side Side;
        [DataMember]
        public string Category;
        [DataMember]
        public int isPosition;
        [DataMember]
        public int isMirror;
    }

    [DataContract]
    public class AllSymbolsAndOrders
    {
        [DataMember]
        public List<ActiveOrder> Orders;
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public long Positions;
        [DataMember]
        public decimal GainLoss;
        [DataMember]
        public decimal Invested;
        [DataMember]
        public string CategoryUrl;
        [DataMember]
        public string CategoryChain;
        [DataMember]
        public string CategoryIcon;
        [DataMember]
        public List<CategoryItem> CategoryBreadcrumbs;
        [DataMember]
        public TimeSpan TimeRemains;
    }

    [DataContract]
    public class SummaryPositionPrice
    {
        [DataMember]
        public decimal Price;
        [DataMember]
        public long Quantity;
        [DataMember]
        public long ParticularUserQuantity;
    }

    [DataContract]
    public class ActiveOrder
    {
        [DataMember]
        public List<SummaryPositionPrice> SummaryPositionPrice;
        [DataMember]
        public Side Side;
    }

    [DataContract]
    public class WebSoketOrdersResponse : WebSocketMessage
    {
        [DataMember]
        public string UserName;
        [DataMember]
        public List<SortedTicks> Ticks;
        [DataMember]
        public List<GraphBars> Bars;
        [DataMember]
        public List<AllSymbolsAndOrders> ActiveOrders;//Event page and Active Trader data
        [DataMember]
        public GetAllSymbolsAndOrdersResponse SymbolsAndOrders;//Main Page data
        [DataMember]
        public UserMoneyData AccountData;
        [DataMember]
        public OrdersPositionsHistory OrdersPositionsHistory;
        [DataMember]
        public List<CurrentOrders> CurrentOrders;
    }

    [DataContract]
    public class UserMoneyData
    {
        [DataMember]
        public decimal Profitlost;
        [DataMember]
        public decimal Exposure;
        [DataMember]
        public decimal Available;
    }

    [DataContract]
    public class SortedTicks
    {
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public List<Tick> Ticks;
    }

    [DataContract]
    public class GraphBars
    {
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public List<Bar> Ticks;
    }

    [DataContract]
    public partial class Tick : ICloneable
    {
        [DataMember]
        public Symbol Symbol;
        [DataMember]
        public string Currency;
        [DataMember]
        public DateTime Time;
        [DataMember]
        public decimal Bid;
        [DataMember]
        public long BidSize;
        [DataMember]
        public decimal Ask;
        [DataMember]
        public long AskSize;
        [DataMember]
        public decimal Price;
        [DataMember]
        public long Volume;
        [DataMember]
        public bool Side;
    }

    [DataContract]
    public partial class Bar
    {
        [DataMember]
        public DateTime Time;
        [DataMember]
        public decimal Open;
        [DataMember]
        public decimal High;
        [DataMember]
        public decimal Low;
        [DataMember]
        public decimal Close;
        [DataMember]
        public long Volume;
        [DataMember]
        public bool Side;
        [DataMember]
        public DateTime EndDate;
    }

    [DataContract]
    public partial class Execution : WebSocketMessage
    {
        [DataMember]
        public string OrderID;
        [DataMember]
        public DateTime Time;
        [DataMember]
        public Status Status;
        [DataMember]
        public decimal LastPrice;
        [DataMember]
        public long PaidUpQuantity;
        [DataMember]
        public long ClosedQuantity;
        [DataMember]
        public long LastQuantity;
        [DataMember]
        public long FilledQuantity;
        [DataMember]
        public long LeaveQuantity;
        [DataMember]
        public long CancelledQuantity;
        [DataMember]
        public decimal AverrageFillPrice;
        [DataMember]
        public string Message;

        public Execution(string orderID, DateTime time, Status status, decimal lastPrice, long lastQuantity, long filledQuantity, long leaveQuantity, long cancelledQuantity, long closedQuantity, long paidUpQuantity, string message)
            : base()
        {
            OrderID = orderID;
            Time = time;
            Status = status;
            LastPrice = lastPrice;
            LastQuantity = lastQuantity;
            FilledQuantity = filledQuantity;
            LeaveQuantity = leaveQuantity;
            AverrageFillPrice = lastPrice;
            Message = message;
            CancelledQuantity = cancelledQuantity;
            ClosedQuantity = closedQuantity;
            PaidUpQuantity = paidUpQuantity;
        }
        public Execution()
        {

        }
    }

    [DataContract]
    public abstract class UserSessionBase
    {
        private string userIp = string.Empty;

        [DataMember]
        public string UserBrowser { get; set; }

        [DataMember]
        public string UserIp
        {
            get { return userIp; }
            set { userIp = value == "::1" ? "127.0.0.1" : IPAddress.Parse(value).MapToIPv4().ToString(); }
        }

    }

    [DataContract]
    public class LogoutRequest : UserSessionBase
    {
        [DataMember]
        public string UserName;
        [DataMember]
        public string Email;
    }

    [DataContract]
    public class MessageResponse : WebSocketMessage
    {
        [DataMember]
        public string Result;
        [DataMember]
        public string UserName;
    }

    [DataContract]
    public class ServerInfoMessage
    {
        [DataMember]
        public string Info;
        [DataMember]
        public bool Exit;
    }

    [DataContract]
    public class CategoryRequest
    {
        [DataMember]
        public Guid Id;
        [DataMember]
        public string Name;
        [DataMember]
        public Guid ParentId;
        [DataMember]
        public string Url;
        [DataMember]
        public string Icon;
        [DataMember]
        public int Level;
        [DataMember]
        public int Position;
    }

    [DataContract]
    public class CategoryResponse
    {
        [DataMember]
        public List<CategoryItem> CategorierList;
    }

    [DataContract]
    public class CategoryItem
    {
        [DataMember]
        public Guid CatId;
        [DataMember]
        public string CatName;
        [DataMember]
        public Guid CatParentId;
        [DataMember]
        public string CatUrl;
        [DataMember]
        public string CatIcon;
        [DataMember]
        public int CatPosition;
        [DataMember]
        public string CatUrlChain;
    }

    [DataContract]
    public class Message
    {
        [DataMember]
        public string MessageType;
        [DataMember]
        public string MessageID = Guid.NewGuid().ToString();
    }

    [DataContract]
    public class PaymentsHistory
    {
        [DataMember] 
        public decimal amount;
        [DataMember] 
        public DateTime date;
        [DataMember]
        public string direction;
        [DataMember]
        public string system;
        [DataMember]
        public string status;
        [DataMember]
        public string TransactionId;

    }

    [DataContract]

    public class PushSettings
    {
        [DataMember] 
        public string Name;
        [DataMember] 
        public string Id;
        [DataMember]
        public byte SubscribeOrUnsubscribe;

    }

    [DataContract]

    public class GidxUser
    {
        [DataMember]
        public string Name;
        [DataMember]
        public string CustomerId;
        [DataMember]
        public string TransactionId;

    }

     [DataContract]
    public class GidxNotification
    {
        [DataMember]
        public string MerchantCustomerID;
        [DataMember]
        public string NotificationType;
       
    }

}

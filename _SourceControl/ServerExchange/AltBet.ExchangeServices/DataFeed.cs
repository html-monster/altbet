/* WARNING! This program and source code is owned and licensed by 
   Modulus Financial Engineering, Inc. http://www.modulusfe.com
   Viewing or use this code requires your acceptance of the license
   agreement found at http://www.modulusfe.com/support/license.pdf
   Removal of this comment is a violation of the license agreement.
   Copyright 2002-2016 by Modulus Financial Engineering, Inc. */

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using AltBet.Model;
using GIDX.SDK.Models.WebReg;
using GIDX.SDK.Models.WebCashier;
using log4net;
using MaxMind.Db;

namespace AltBet.Exchange
{       
    public class DataFeed
    {
       //internal class for total or partial order execution 
        private class PartialExecution : SingleExecution
        {
            public DateTime Time { get; set; }
            public string MakerAccount { get; set; }
            public string TakerAccount { get; set; }
        }
        private class SingleExecution
        {
            //new received order ID
            public string NewOrderID { get; set; }
            //previously received order ID
            public string ExistingOrderID { get; set; }
            //filled price
            public decimal Price { get; set; }
            //filled quantity
            public long Quantity { get; set; }
        }

        public event Action<Tick> OnTick;
        public event Action<string, Execution> OnExecution;
        public event Action<string, Account> OnAccountInfo;
        public event Action<string, string, string> OnMessageResponse;
        public event Action<Symbol, List<ActiveOrder>, List<Tick>> OnGetOrders;
        public event Action<bool> OnCancelOrder;
        public event Action<string, string> OnNotificationInfo;

        private List<Account> processedAccounts;
        private List<User> _users = new List<User>();
        public List<User> Users { get { return _users; } }
        //current market and limit orders  
        private List<NewOrderRequest> _activeOrders = new List<NewOrderRequest>();
        //public List<NewOrderRequest> ActiveOrders { get { return _activeOrders; } }
        //current stop orders 
        private List<NewOrderRequest> _stopOorders = new List<NewOrderRequest>();
        //activated by current execution stop orders
        private Queue<NewOrderRequest> _activatedStopOrders = new Queue<NewOrderRequest>();
        //current orders executions
        private List<Execution> _executions = new List<Execution>();
        //public List<Execution> Executions { get { return _executions; } } 
        //current opened positions
        private List<NewOrderRequest> _openPositions = new List<NewOrderRequest>();

        private List<Tick> _ticks = new List<Tick>();

        private List<PartialExecution> _partialExecutions = new List<PartialExecution>();
        private object _tradingLocker = new object();
        //users requests queue
        private Queue<object> _requests = new Queue<object>();
        //indicates is system ready to handle user requests
        private bool _started = false;
        //system event to process market and limit orders
        private ManualResetEvent _processOrdersEvent = new ManualResetEvent(false);
        //thread to process market and limit orders
        private Thread _processOrdersThread = null;
        //thread to process virtual orders and position and chenge its' status when delay time is expired
        private Thread _processVirtualOrdersThread = null;
        //thread to process end of current day trading session
        private Thread _processExchangeSessionThread = null;

        private int itemsOnPage = 8;

        private int filterTime = 5;//minutes

        //private Thread _processOrderBotThread = null;

        private string _connectionString = ConfigurationManager.ConnectionStrings["MyExchange"].ConnectionString;
        //available exchanges
        private List<ExchangeSettingsEx> _exchanges = new List<ExchangeSettingsEx>();
        public List<ExchangeSettingsEx> Exchnages { get { return _exchanges; } }
        //available currencies
        private List<Currency> _currencies = new List<Currency>();
        //historical data cache
        private Cache _cache = null;
        //initial date used for order duration processing
        private DateTime _UNIX_START = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        //available categories
        private List<CategoryItem> _categories = new List<CategoryItem>();
        private List<string> categoriesUrl = new List<string>();

        private List<ExchangeSettingsEx> _exchangeBotList = new List<ExchangeSettingsEx>();

        //start exchange engine
        public string Start()
        {
            Log.WriteApplicationInfo("************ DATAFEED START ************");
            string result = "";
            SqlConnection connection = new SqlConnection(_connectionString);
            SqlTransaction transaction = null;
            SqlDataReader reader = null;
            try
            {
                connection.Open();
                transaction = connection.BeginTransaction();
                SqlCommand command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT u.[UserName], u.[Password], u.[Email], u.[FirstName], u.[LastName], u.[DateOfBirth], u.[Country], u.[Address], u.[Phone], a.[UserName], a.[Balance], a.[Currency], a.[TariffPlan], a.[BeginOfTP], a.[Mode], a.[Bettor], a.[Trade], a.[Theme], t.[Quantity],a.[GIDX_CustomerId], a.[GIDX_SessionId], u.[Type] FROM [Users] u, [Accounts] a, [TariffPlans] t WHERE u.[UserName] = a.[UserName] AND a.[TariffPlan] = t.[Name] ORDER BY u.[UserName], a.[Name]";
                reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    //retreive users account data from DB
                    lock (_tradingLocker)
                    {
                        while (reader.Read())
                        {
                            string userName = reader.GetString(0);
                            if (_users.FirstOrDefault(item => item.UserName == userName) == null)
                            {
                                _users.Add(new User()
                                {
                                    UserName = userName,
                                    Password = reader.GetString(1),
                                    Email = reader.GetString(2),
                                    FirstName = reader.GetValue(3) == DBNull.Value ? null : reader.GetString(3),
                                    LastName = reader.GetValue(4) == DBNull.Value ? null : reader.GetString(4),
                                    DateOfBirth = reader.GetDateTime(5),
                                    Country = reader.GetString(6),
                                    Address = reader.GetValue(7) == DBNull.Value ? null : reader.GetString(7),
                                    Phone = reader.GetValue(8) == DBNull.Value ? null : reader.GetString(8),
                                    UserType = (UserType)Enum.Parse(typeof(UserType), reader.GetString(21)),
                                    
                                    Accounts = new List<Account>()
                                });
                            }
                            _users.First(item => item.UserName == userName).Accounts.Add(new Account()
                            {
                                Name = reader.GetString(9),
                                Email = reader.GetString(2),
                                Balance = reader.GetDecimal(10),
                                Currency = reader.GetString(11),
                                TariffPlan = new TariffPlan
                                {
                                    Name = reader.GetString(12),
                                    Quantity = reader.GetInt32(18),
                                    BeginTime = reader.GetDateTime(13)
                                },
                                Mode = reader.GetString(14),
                                Bettor = reader.GetBoolean(15).ToString().ToLower(),
                                Trade = reader.GetBoolean(16).ToString().ToLower(),
                                Theme = reader.GetString(17),
                                GIDX_CustomerId = reader.GetValue(19) == DBNull.Value ? null : reader.GetString(19),
                                GIDX_SessionId = reader.GetValue(20) == DBNull.Value ? null : reader.GetString(20),
                                //Type = reader.GetValue(21) == DBNull.Value ? null : reader.GetString(21)
                            });
                        }
                    }
                }
                reader.Close();

                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT e.[Name], e.[StartTime], e.[EndTime], e.[CommonCurrency], e.[StartDate], e.[EndDate], s.[ID], s.[Name], s.[Exchange], s.[Currency], s.[FullName], s.[HomeName], s.[HomeAlias], s.[AwayName], s.[AwayAlias], s.[Status], s.[StartDate], s.[EndDate], s.[CategoryId], s.[TypeEvent], s.[Url], s.[Result], s.[ApprovedDate], s.[SettlementDate], s.[LastPrice], s.[Side], s.[LastAsk], s.[LastBid], s.[HomePoints], s.[HomeHandicap], s.[AwayPoints], s.[AwayHandicap], s.[StatusEvent], s.[PriceChangeDirection], s.[DelayTime] FROM [Exchanges] e, [Symbols] s  WHERE e.[Name] = s.[Exchange] AND [isActive] = 1 ORDER BY e.[Name]";
                reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    //retreive exchanges data from DB
                    while (reader.Read())
                    {
                        string exchangeName = reader.GetString(0);
                        if (_exchanges.FirstOrDefault(item => item.Name == exchangeName) == null)
                        {
                            _exchanges.Add(new ExchangeSettingsEx() {
                                Name = reader.GetString(0),
                                StartTime = reader.GetTimeSpan(1),
                                EndTime = reader.GetTimeSpan(2),
                                CommonCurrency = reader.GetBoolean(3),
                                StartDate = reader.GetDateTime(4),
                                EndDate = reader.GetDateTime(5),
                                Symbols = new List<ExchangeSymbol>(), 
                            });
                            Log.WriteApplicationInfo("Create ExchangeSettings");
                        }
                        
                        Side? lastside = null;
                        if(!reader.IsDBNull(25))
                        {
                            lastside = reader.GetByte(25) == 0 ? Side.Buy : Side.Sell;
                        }
                        _exchanges.First(item => item.Name == exchangeName).Symbols.Add(new ExchangeSymbol()
                        {
                            ID = reader.GetString(6),
                            Symbol = new Symbol()
                            {
                                Name = reader.GetString(7),
                                Exchange = reader.GetString(8),
                                Currency = reader.GetString(9),
                                FullName = reader.GetString(10),
                                HomeName = reader.GetString(11),
                                HomeAlias = reader.GetString(12),
                                AwayName = reader.GetString(13),
                                AwayAlias = reader.GetString(14),
                                Status = (StatusEvent)reader.GetByte(15),
                                StartDate = reader.IsDBNull(16) ? null : (reader.GetDateTime(16) as DateTime?),
                                EndDate = reader.IsDBNull(17) ? null : (reader.GetDateTime(17) as DateTime?),
                                CategoryId = reader.GetGuid(18),
                                TypeEvent = (TypeEvent)reader.GetByte(19),
                                UrlExchange = reader.GetString(20),
                                ResultExchange = reader.IsDBNull(21) ? null : reader.GetString(21),
                                ApprovedDate = reader.IsDBNull(22) ? null : (reader.GetDateTime(22) as DateTime?),
                                SettlementDate = reader.IsDBNull(23) ? null : (reader.GetDateTime(23) as DateTime?),
                                LastPrice = reader.GetDecimal(24),
                                LastSide = lastside,
                                LastAsk = reader.GetDecimal(26),
                                LastBid = reader.GetDecimal(27),
                                HomePoints = reader.IsDBNull(28) ? null : (reader.GetDecimal(28) as decimal?),
                                HomeHandicap = reader.IsDBNull(29) ? null : (reader.GetDecimal(29) as decimal?),
                                AwayPoints = reader.IsDBNull(30) ? null : (reader.GetDecimal(30) as decimal?),
                                AwayHandicap = reader.IsDBNull(31) ? null : (reader.GetDecimal(31) as decimal?),
                                SortingData = new List<ExchangeSortData>(),
                                StatusEvent = reader.GetString(32),
                                PriceChangeDirection = reader.GetInt32(33),
                                DelayTime = reader.GetInt32(34)
                            }
                        });
                    }
                }
                reader.Close();

                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT f.[TakerFee], f.[MakerFee] FROM [Fees] f";
                reader = command.ExecuteReader();
                if(reader.HasRows)
                {
                    while(reader.Read())
                    {
                        Fee.TakerFee = reader.GetDecimal(0);
                        Fee.MakerFee = reader.GetDecimal(1);
                    }
                }
                reader.Close();

                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT [SymbolID], [Time], [Price], [Volume], [Side] FROM [Tick] WHERE [isDeleted] = 0";
                reader = command.ExecuteReader();
                if(reader.HasRows)
                {
                    while(reader.Read())
                    {
                        string SymbolId = reader.GetString(0);
                        DateTime Time = reader.GetDateTime(1);
                        decimal Price = reader.GetDecimal(2);                        
                        long Volume = reader.GetInt64(3);
                        var Side = reader.GetBoolean(4);
                        _ticks.Add(new Tick
                        {
                            Symbol = _exchanges.Where(e => e.Symbols.Single().ID == SymbolId).Single().Symbols.Single().Symbol,
                            Time = Time,
                            Price = Price,
                            Volume = Volume,
                            Side = Side,
                            Currency = _exchanges.Where(e => e.Symbols.Single().ID == SymbolId).Single().Symbols.Single().Symbol.Currency
                        });
                    }
                }
                reader.Close();

                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT * FROM [Currencies]";
                reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    //retreive currencies data from DB
                    while (reader.Read())
                    {
                        _currencies.Add(new Currency() { Name = reader.GetString(0), Multiplier = reader.GetDecimal(1)});
                    }
                }
                reader.Close();
                //_exchanges.ForEach(exchange => exchange.Init());
                List<NewOrderRequest> orderRequests = new List<NewOrderRequest>();
                List<Execution> expiriedExecutions = new List<Execution>();
                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT o.[ID], o.[AccountID], o.[SymbolID], o.[Time], o.[ActivationTime], o.[Side], o.[OrderType], o.[LimitPrice], o.[StopPrice], o.[Quantity], o.[TimeInForce], o.[ExpirationDate], e.[Time], e.[Status], e.[LastPrice], e.[LastQuantity], e.[FilledQuantity], e.[LeaveQuantity], e.[AverrageFillPrice], o.[IsMirror], e.[ClosedQuantity], e.[PaidUpQuantity], e.[InProcess] FROM [Orders] o, [Executions] e WHERE o.ID = e.[OrderID] ";
                reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    //retreive orders and executions data from DB
                    DateTime utcNow = DateTime.UtcNow;
                    while (reader.Read())
                    {
                        string orderID = reader.GetString(0);
                        string orderAccount = reader.GetString(1);
                        string orderSymbolID = reader.GetString(2);                                                
                        DateTime orderTime = reader.GetDateTime(3);
                        orderTime = DateTime.SpecifyKind(orderTime, DateTimeKind.Utc);
                        DateTime orderActivationTime = DateTime.MinValue;
                        if(!reader.IsDBNull(4))
                        {
                            orderActivationTime = reader.GetDateTime(4);
                            orderActivationTime = DateTime.SpecifyKind(orderActivationTime, DateTimeKind.Utc);
                        }
                        Side orderSide = (Side)((byte)reader.GetByte(5));
                        Type orderType = (Type)((byte)reader.GetByte(6));
                        decimal orderLimitPrice = reader.GetDecimal(7);
                        decimal orderStopPrice = reader.GetDecimal(8);
                        long orderQuantity = reader.GetInt64(9);
                        TimeInForce orderTimeInforce = (TimeInForce)((byte)reader.GetByte(10));
                        DateTime orderExpirationDate = reader.GetDateTime(11);
                        orderExpirationDate = DateTime.SpecifyKind(orderExpirationDate, DateTimeKind.Utc);
                        DateTime executionDate = reader.GetDateTime(12);
                        executionDate = DateTime.SpecifyKind(executionDate, DateTimeKind.Utc);
                        Status executionStatus = (Status)((byte)reader.GetByte(13));
                        decimal executionLastPrice = reader.GetDecimal(14);
                        long executionLastQuantity = reader.GetInt64(15);
                        long executionFilledQuantity = reader.GetInt64(16);
                        long executionLeaveQuantity = reader.GetInt64(17);
                        decimal executionAverrageFillPrice = reader.GetDecimal(18);
                        int orderIsMirror = reader.GetByte(19);
                        long executionClosedQuantity = reader.GetInt64(20);
                        long executionPaidUpQuantity = reader.GetInt64(21);
                        bool executionInProcess = reader.GetBoolean(22);
                        if (executionStatus == Status.VirtualOrder ||
                            executionStatus == Status.VirtualPosition ||
                            executionStatus == Status.Opened ||
                            executionStatus == Status.PartialFilled ||
                            executionStatus == Status.Activated ||
                            (executionStatus == Status.Filled && !(executionLeaveQuantity == 0 && executionPaidUpQuantity == executionFilledQuantity)) ||
                            executionStatus == Status.OpenedPosition ||
                            executionStatus == Status.PartialFilledPosition
                            )
                        {
                            var symbol = _exchanges.SelectMany(e => e.Symbols).Where(s => s.ID == orderSymbolID).FirstOrDefault();
                            if (symbol != null)
                            {
                                //split orders/executions to active and expiried collections
                                if ((orderTimeInforce == TimeInForce.GTD || orderTimeInforce == TimeInForce.DAY) && orderExpirationDate < utcNow)
                                {
                                    expiriedExecutions.Add(new Execution(orderID, executionDate, Status.Expiried, executionLastPrice, executionLastQuantity, executionFilledQuantity, 0, executionLeaveQuantity, executionClosedQuantity, executionPaidUpQuantity, ""));
                                }
                                else
                                {
                                    if (executionInProcess == true)
                                    {
                                        orderRequests.Add(new NewOrderRequest() { ID = orderID, Account = orderAccount, Symbol = symbol.Symbol, Time = orderTime, ActivationTime = orderActivationTime, Side = orderSide, OrderType = orderType, LimitPrice = orderLimitPrice, StopPrice = orderStopPrice, Quantity = orderQuantity, TimeInForce = orderTimeInforce, ExpirationDate = orderExpirationDate, IsMirror = orderIsMirror });
                                    }
                                    lock (_tradingLocker)
                                    {
                                        if (orderActivationTime != DateTime.MinValue)
                                        {
                                            _activeOrders.Add(new NewOrderRequest() { ID = orderID, Account = orderAccount, Symbol = symbol.Symbol, Time = orderTime, ActivationTime = orderActivationTime, Side = orderSide, OrderType = orderType, LimitPrice = orderLimitPrice, StopPrice = orderStopPrice, Quantity = orderQuantity, TimeInForce = orderTimeInforce, ExpirationDate = orderExpirationDate, IsMirror = orderIsMirror });
                                        }
                                        else
                                        {
                                            _stopOorders.Add(new NewOrderRequest() { ID = orderID, Account = orderAccount, Symbol = symbol.Symbol, Time = orderTime, ActivationTime = orderActivationTime, Side = orderSide, OrderType = orderType, LimitPrice = orderLimitPrice, StopPrice = orderStopPrice, Quantity = orderQuantity, TimeInForce = orderTimeInforce, ExpirationDate = orderExpirationDate, IsMirror = orderIsMirror });
                                        }
                                        _executions.Add(new Execution(orderID, executionDate, executionStatus, executionLastPrice, executionLastQuantity, executionFilledQuantity, executionLeaveQuantity, 0, executionClosedQuantity, executionPaidUpQuantity, ""));
                                    }
                                }
                            }
                        }
                    }
                }
                reader.Close();
                //cancel expiried orders
                expiriedExecutions.ForEach(item => 
                {
                    command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText = "UPDATE [Executions] SET [Status] = @Status, [LeaveQuantity] = 0, [CancelledQuantity] = @CancelledQuantity WHERE [OrderID] = @OrderID";
                    command.Parameters.AddWithValue("Status", item.Status);
                    command.Parameters.AddWithValue("OrderID", item.OrderID);
                    command.Parameters.AddWithValue("CancelledQuantity", item.CancelledQuantity);
                    command.ExecuteNonQuery();
                });

                _partialExecutions = new List<PartialExecution>();
                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT [Time] ,[ExistingOrder], [MakerAccount], [NewOrder], [TakerAccount], [Price], [Quantity] FROM [PartialExecutions]";
                reader = command.ExecuteReader();
                if(reader.HasRows)
                {
                    while(reader.Read())
                    {
                        if (_activeOrders.Any(ao => ao.ID == reader.GetString(1) || ao.ID == reader.GetString(3)))
                        {
                            lock (_partialExecutions)
                            {
                                _partialExecutions.Add(new PartialExecution
                                {
                                    Time = reader.GetDateTime(0),
                                    ExistingOrderID = reader.GetString(1),
                                    MakerAccount = reader.GetString(2),
                                    NewOrderID = reader.GetString(3),
                                    TakerAccount = reader.GetString(4),
                                    Price = reader.GetDecimal(5),
                                    Quantity = reader.GetInt64(6)
                                });
                            }
                        }
                    } 
                }
                reader.Close();

                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "SELECT [Id], [Name], [Parent_Id], [Url], [Icon], [Position] FROM [Category] WHERE [IsDeleted] = 0";
                reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    //retreive categories from DB
                    while (reader.Read())
                    {
                        _categories.Add(new CategoryItem
                        {
                            CatId = reader.GetGuid(0),
                            CatName = reader.GetString(1),
                            CatParentId = reader.IsDBNull(2) ? Guid.Empty : reader.GetGuid(2),
                            CatUrl = reader.GetString(3),
                            CatIcon = reader.IsDBNull(4) ? null : reader.GetString(4),
                            CatPosition = reader.GetInt32(5)
                        });
                    }
                }
                reader.Close();


                transaction.Commit();
                _cache = new Cache(_exchanges, _connectionString);

                _processOrdersThread = new Thread(ProcessRequestHandler);
                _processVirtualOrdersThread = new Thread(ProcessVirtualOrdersHandler);
                _processExchangeSessionThread = new Thread(ProcessExchangeSession);
                //_processOrderBotThread = new Thread(OrderCreateBotHandler);
                _started = true;
                _processOrdersThread.Start();                           
                _processVirtualOrdersThread.Start();               
                _processExchangeSessionThread.Start();
                //_processOrderBotThread.Start();
                orderRequests.ForEach(o => ProcessOrderRequest(o));
            }
            catch(Exception ex)
            {
                if (reader != null)
                {
                    reader.Close();
                }
                if (transaction != null)
                {
                    try
                    {
                        transaction.Rollback();
                    }
                    catch(Exception e)
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), e);
                    }
                }
                Stop();
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                result = ex.Message;
            }
            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            return result;
        }

        public List<UserSession> GetActiveUsers()
        {
            var result = new List<UserSession>();

            var connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                var command = connection.CreateCommand();                                
                command.CommandText = "SELECT [UserName], [UserBrowser], [UserIp] FROM [UserSessions] WHERE [EndSession] IS NULL";
                
                var reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    //retreive orders and executions data from DB
                    DateTime utcNow = DateTime.UtcNow;
                    while (reader.Read())
                    {
                        var userName = reader.GetString(0);

                        var guidParseResult = Guid.Empty;
                        var isAuthorizedUser = !Guid.TryParse(userName, out guidParseResult);

                        result.Add(new UserSession
                        {
                            UserName = userName,
                            UserBrowser = reader.GetString(1),
                            UserIp = reader.GetString(2),
                            isAuthUser = isAuthorizedUser                        
                        });
                        //result.Add(reader.GetString(0));
                    }
                }
            }
            catch (SqlException ex)
            {
                //Log error here
                throw new ApplicationException(string.Format("Can't get active users {0}", ex.Message));
            }
            finally
            {
                connection.Close();
            }

            return result;
        }

        //stop exchange engine
        public void Stop()
        {            
            _started = false;
            if (_processOrdersThread != null)
            {
                try
                {
                    _processOrdersThread.Abort();
                }
                catch { }
            }
            //if (_processOrderBotThread != null)
            //{
            //    try
            //    {
            //        _processOrderBotThread.Abort();
            //    }
            //    catch { }
            //}
            if (_processVirtualOrdersThread != null)
            {
                try
                {
                    _processVirtualOrdersThread.Abort();
                }
                catch { }
            }
            try
            {
                _processExchangeSessionThread.Abort();
            }
            catch { }
            lock (_tradingLocker)
            {
                _users.Clear();
                _activeOrders.Clear();
                _executions.Clear();
            }
            lock (_exchanges)
            {
                _exchanges.Clear();
            }
            _cache = null;            
        }

        public bool PaymentsMethod(string username, decimal amount, byte addOrGet)
        {
            bool result = true;
            var user = _users.FirstOrDefault(u => u.UserName == username);
            if (user != null && (addOrGet == 1 || addOrGet == 0))
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    if (addOrGet == 0)
                    {
                        command.CommandText = "UPDATE [Accounts] SET [Balance] = [Balance] + @Balance WHERE [UserName] = @Username";
                    }
                    if (addOrGet == 1)
                    {
                        command.CommandText = "UPDATE [Accounts] SET [Balance] = [Balance] - @Balance WHERE [UserName] = @Username";
                    }
                    
                    command.Parameters.AddWithValue("@Username", user.UserName);
                    command.Parameters.AddWithValue("@Balance", amount);
                    command.ExecuteNonQuery();                    
                }
                catch (Exception ex)
                {
                    result = false;
                    Log.WritePaymentInfo("Error while updating database : amount=" + amount.ToString() + ", addOrGet=" + addOrGet.ToString(), username);
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
                finally
                {
                    connection.Close();
                }
                if(result == true)
                {
                    if (addOrGet == 0)
                    {
                        user.Accounts.First().Balance += amount;
                    }
                    if (addOrGet == 1)
                    {
                        user.Accounts.First().Balance -= amount;
                    }
                    
                }
            }
            else
            {
                throw new ApplicationException("Can't find existing user");
            }
            return result;
        }

        public bool PaymentHistoryMethod(decimal amount, string systemtype, DateTime date, string direction,string userId,string transactId,string status)
        {
            bool res = true;
            var user = _users.FirstOrDefault(u => u.UserName == userId);
            if (user != null)
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText =
                        "INSERT INTO [PaymentsHistory] VALUES (@amount,@systemtype,@date,@direction,@userId,@transactId,@status)";
                    command.Parameters.AddWithValue("@amount", amount);
                    command.Parameters.AddWithValue("@systemtype", systemtype);
                    command.Parameters.AddWithValue("@date", date);
                    command.Parameters.AddWithValue("@direction", direction);
                    command.Parameters.AddWithValue("@userId", user.Email);
                    command.Parameters.AddWithValue("@transactId", transactId);
                    command.Parameters.AddWithValue("@status", status);
                    command.ExecuteNonQuery();

                }
                catch (Exception ex)
                {

                    res = false;
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
                        MethodBase.GetCurrentMethod().Name,
                        new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

                }
                finally
                {
                    connection.Close();
                }
                
            }
            else
            {
                throw new ApplicationException("Can't find existing user");
            }
            return res;
        }

        public bool PaymentHistoryUpdate(decimal amount,string systemtype, DateTime date, string transactId, string status)
        {
            bool result = true;
            SqlConnection connection = new SqlConnection(_connectionString);
                 try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText =
                        "UPDATE [PaymentsHistory] SET [Amount]=@amount,[System]=@systemtype, [Status]=@status WHERE [TransactId]=@transactId";
                    command.Parameters.AddWithValue("@amount", amount);
                    command.Parameters.AddWithValue("@systemtype", systemtype);
                    command.Parameters.AddWithValue("@date", date);
                    command.Parameters.AddWithValue("@transactId", transactId);
                    command.Parameters.AddWithValue("@status", status);
                    command.ExecuteNonQuery();

                }
                catch (Exception ex)
                {

                    result = false;
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
                        MethodBase.GetCurrentMethod().Name,
                        new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

                }
                finally
                {
                    connection.Close();
                }
            return result;
        }

        public bool PushSubscribeMethod(PushSettings settings)
        {
            bool result = true;
            SqlConnection connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText =
                    "UPDATE [Accounts] SET [PushId]=@oneSignalId WHERE [UserName]=@username";
                command.Parameters.AddWithValue("@oneSignalId", settings.Id);
                command.Parameters.AddWithValue("@username", settings.Name);
                command.ExecuteNonQuery();

            }
            catch (Exception ex)
            {

                result = false;
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
                    MethodBase.GetCurrentMethod().Name,
                    new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

            }
            finally
            {
                connection.Close();
            }
            return result;
        }

        public string GetUsernameFromTransactId(string transactId)
        {
            string username = string.Empty;
            var connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT u.[UserName] FROM [PaymentsHistory] p INNER JOIN [Users] u ON p.[UserId]=u.[Email] WHERE p.[TransactId] =@transactId";
                command.Parameters.AddWithValue("@transactId", transactId);
                var reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        username = reader.GetString(0);
                    }
                }
            }
            catch (SqlException ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            finally
            {
                connection.Close();
            }
            return username;
        }


        public string GetUserNameFromEmail(string email)
        {
            string username = string.Empty;
            var connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT [UserName] FROM [Users] WHERE [Email] = @Email";
                command.Parameters.AddWithValue("Email", email);
                var reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        username = reader.GetString(0);
                    }
                }
            }
            catch(SqlException ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            finally
            {
                connection.Close();
            }
            return username;
        }


        public string GetNickNameFromEmail(string email)
        {
            string nickname = string.Empty;
            var connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT [NickName] FROM [Users] WHERE [Email] = @Email";
                command.Parameters.AddWithValue("Email", email);
                var reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        nickname = reader.GetString(0);
                    }
                }
            }
            catch (SqlException ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            finally
            {
                connection.Close();
            }
            return nickname;
        }
        //GIDX MEthods
        public bool GidxRegister(GIDX.SDK.Models.WebReg.CreateSessionRequest request, string user)
        {
            bool result = true;
            var userInfo = _users.FirstOrDefault(u => u.UserName == user);
            if (userInfo != null)
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText =
                        "UPDATE [Accounts] SET [GIDX_CustomerId]=@customerId, [GIDX_SessionId]=@sessionId WHERE [UserName]=@username";
                    command.Parameters.AddWithValue("@customerId", request.MerchantCustomerID);
                    command.Parameters.AddWithValue("@sessionId", request.MerchantSessionID);
                    command.Parameters.AddWithValue("@username", user);

                    command.ExecuteNonQuery();

                }
                catch (Exception ex)
                {

                    result = false;
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
                        MethodBase.GetCurrentMethod().Name,
                        new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

                }
                finally
                {
                    connection.Close();
                }
                if (result)
                {
                    userInfo.Accounts.First().GIDX_CustomerId = request.MerchantCustomerID;
                    userInfo.Accounts.First().GIDX_SessionId = request.MerchantSessionID;

                }
            }
            else
            {
                throw new ApplicationException("Can't find existing user");
            }

            return result;
        } 
        
        public bool GidxWebCashRegister(GIDX.SDK.Models.WebCashier.CreateSessionRequest request, string usermail, string direction )
        {
            bool result = true;
            var userInfo = _users.FirstOrDefault(u => u.Email == usermail);
            if (userInfo != null)
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                SqlTransaction transaction = null;
                try
                {
                    connection.Open();
                    transaction = connection.BeginTransaction();
                    SqlCommand command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText =
                        "UPDATE [Accounts]  SET [GIDX_CustomerId]=@customerId, [GIDX_SessionId]=@sessionId  WHERE  [Email]=@usermail";
                    command.Parameters.AddWithValue("@customerId", request.MerchantCustomerID);
                    command.Parameters.AddWithValue("@sessionId", request.MerchantSessionID);
                    command.Parameters.AddWithValue("@usermail", usermail);
                    command.ExecuteNonQuery();

                    command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText =
                        "INSERT INTO [PaymentsHistory] ([System],[DateOfPayment],[Direction],[UserId],[TransactId],[Status]) VALUES (@systemtype,@date,@direction,@userId,@transactId,@status)";
                    command.Parameters.AddWithValue("@systemtype", "GidxPayments");
                    command.Parameters.AddWithValue("@date", DateTime.Now);
                    command.Parameters.AddWithValue("@direction", direction);
                    command.Parameters.AddWithValue("@userId", usermail);
                    command.Parameters.AddWithValue("@transactId", request.MerchantTransactionID);
                    command.Parameters.AddWithValue("@status", PaymentStatusCode.Processing.ToString());
                    command.ExecuteNonQuery();
                    transaction.Commit();

                }
                catch (Exception ex)
                {

                    result = false;
                    if (transaction != null)
                    {
                        transaction.Rollback();
                    }
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
                        MethodBase.GetCurrentMethod().Name,
                        new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

                }
                finally
                {
                    connection.Close();
                }

                if (result)
                {
                    userInfo.Accounts.First().GIDX_CustomerId = request.MerchantCustomerID;
                    userInfo.Accounts.First().GIDX_SessionId = request.MerchantSessionID;
                }
            }
            else
            {
                throw new ApplicationException("Can't find existing user");
            }
            return result;
        }

        

        public GidxUser GidxGetCustomer(string sessionId)
        {
            
            var userInfo = _users.SelectMany(a=>a.Accounts).Single(s => s.GIDX_SessionId == sessionId);
            var customerId = userInfo.GIDX_CustomerId;
            var name = userInfo.Name;
          
            return new GidxUser(){CustomerId = customerId, Name=name};
            
        }


        public string GidxGetCustomerName(string customerId)
        {
            var name = _users.SelectMany(a => a.Accounts).Single(s => s.GIDX_CustomerId == customerId).Name;
            

            //string sessionId = string.Empty;
            //string name = string.Empty;
            //SqlConnection connection = new SqlConnection(_connectionString);
            //try
            //{
            //    connection.Open();
            //    SqlCommand command = connection.CreateCommand();
            //    command.CommandText =
            //        "SELECT [UserName] FROM [Accounts] WHERE [GIDX_CustomerId] = @customerId";
            //    command.Parameters.AddWithValue("@customerId", customerId);
            //    var reader = command.ExecuteReader();
            //    if (reader.HasRows)
            //    {
            //        while (reader.Read())
            //        {
            //            name = reader.GetString(0);
            //        }
            //    }

            //}
            //catch (Exception ex)
            //{
            //    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
            //        MethodBase.GetCurrentMethod().Name,
            //        new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

            //}
            //finally
            //{
            //    connection.Close();
            //}
            return name;

        }


        public GidxUser GidxWebcashGetCustomer(string sessionId, string userEmail)
        {
            
            string customerId = string.Empty;
            string name = string.Empty;
            string transactionId = string.Empty;
            SqlConnection connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText =
                   
                    "SELECT a.[GIDX_CustomerId], a.[Name], p.[TransactionId] FROM [Accounts] a, [PaymentsHistory] p  WHERE a.[GIDX_SessionId] = @sessionId AND p.[UserId]=@userEmail";

                command.Parameters.AddWithValue("@sessionId", sessionId);
                command.Parameters.AddWithValue("@userEmail", userEmail);
                var reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        customerId = reader.GetString(0);
                        name = reader.GetString(1);
                        transactionId = reader.IsDBNull(2) ? null : reader.GetString(2);
                    }
                }

            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
                    MethodBase.GetCurrentMethod().Name,
                    new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

            }
            finally
            {
                connection.Close();
            }
            return new GidxUser() { CustomerId = customerId, Name = name,TransactionId = transactionId};

        }

        public bool GidxUpdatePayments(GIDX.SDK.Models.WebCashier.SessionStatusCallback callback, string usermail)  
        {
            bool result = true;
            SqlConnection connection = new SqlConnection(_connectionString);
           
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText =
                   
                    "UPDATE [PaymentsHistory] SET [Status]=@status WHERE [TransactId]=@transactId";

                //command.Parameters.AddWithValue("@amount", callback.TransactionStatusCode.);
                command.Parameters.AddWithValue("@status", callback.TransactionStatusCode);
                command.Parameters.AddWithValue("@transactId", callback.MerchantTransactionID);

                command.ExecuteNonQuery();


            }
            catch (Exception ex)
            {

                result = false;
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
                    MethodBase.GetCurrentMethod().Name,
                    new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

            }
            finally
            {
                connection.Close();
            }
            return result;
        }

        public bool IsUserVerified(string username)    // ОТКУДА БЕРЕТСЯ TYPE??????
        {
            bool result = false;

            var type = _users.Single(s => s.UserName == username).UserType;

            if (UserType.Verified == type)
            {
                result = true;
            }

            //bool result = true;
            //var type = String.Empty;
            //var userInfo = _users.FirstOrDefault(u => u.UserName == username);
            //if (userInfo != null)
            //{
            //    SqlConnection connection = new SqlConnection(_connectionString);
            //    try
            //    {
            //        connection.Open();
            //        SqlCommand command = connection.CreateCommand();
            //        command.CommandText =
            //            "SELECT [Type] FROM [Users] WHERE [UserName] = @username";
            //        command.Parameters.AddWithValue("@username", username);
            //        var reader = command.ExecuteReader();
            //        if (reader.HasRows)
            //        {
            //            while (reader.Read())
            //            {
            //                type = reader.GetString(0);
            //            }
            //        }

            //    }
            //    catch (Exception ex)
            //    {
            //        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name,
            //            MethodBase.GetCurrentMethod().Name,
            //            new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

            //    }
            //    finally
            //    {
            //        connection.Close();
            //    }

            //    if (type != UserType.Verified.ToString())
            //    {
            //        result = false;
            //    }

            //}
            //else
            //{
            //    throw new ApplicationException("Can't find existing user");
            //}

            return result;

        }

        public UserLoginResponse Login(LoginRequest request)
        {
            UserLoginResponse result = new UserLoginResponse() { LoginResult = LoginResult.InternalError, Currencies = new List<string>(), Symbols = new List<Symbol>(), Accounts = new List<Account>(), Executions = new List<Execution>(), Orders = new List<NewOrderRequest>() };
            SqlConnection connection = new SqlConnection(_connectionString);
            try
            {
                //retreive user account data from DB
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText = string.Format("SELECT u.[UserName], u.[Password], a.[UserName], a.[Balance], a.[Currency], a.[Mode], a.[Bettor], a.[Trade], a.[Theme],a.[MailNews], a.[MailUpdates], a.[MailActivity] FROM [Users] u, [Accounts] a WHERE u.[{0}] = {1} AND u.[Password] = @Password AND u.[UserName] = a.[UserName] ORDER BY u.[UserName], a.[Name]",
                    request.Email == string.Empty ? "UserName" : "Email",
                    request.Email == string.Empty ? "@UserName" : "@Email");
                command.Parameters.AddWithValue(request.Email == string.Empty ? "UserName" : "Email", request.Email == string.Empty ? request.UserName : request.Email);
                command.Parameters.AddWithValue("Password", request.Password);
                var reader = command.ExecuteReader();
                if (reader.HasRows)
                {                    
                    while (reader.Read())
                    {
                        result.Accounts.Add(new Account() {
                            Name = reader.GetString(2),
                            Balance = reader.GetDecimal(3),
                            Currency = reader.GetString(4),
                            Mode = reader.GetString(5),
                            Bettor = reader.GetBoolean(6).ToString().ToLower(),
                            Trade = reader.GetBoolean(7).ToString().ToLower(),
                            Theme = reader.GetString(8),
                            MailNews = reader.GetBoolean(9).ToString().ToLower(),
                            MailUpdates = reader.GetBoolean(10).ToString().ToLower(),
                            MailFrequency = reader.GetString(11)
                        });
                    }                         
                    reader.Close();
                    //retreive exchanges data from DB
                    command = connection.CreateCommand();
                    command.CommandText = "SELECT * FROM [Symbols]";
                    reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                       
                        while (reader.Read())
                        {
                            result.Symbols.Add(new Symbol()
                            {
                                Name = reader.GetString(1),
                                Exchange = reader.GetString(2),
                                Currency = reader.GetString(3),
                                FullName = reader.GetString(5),
                                HomeName = reader.GetString(6),
                                HomeAlias = reader.GetString(7),
                                AwayName = reader.GetString(8),
                                AwayAlias = reader.GetString(9),
                                Status =  (StatusEvent)reader.GetByte(10),
                                StatusEvent = reader.GetString(11),
                                StartDate = reader.IsDBNull(12) ? null : (reader.GetDateTime(12) as DateTime?),
                                EndDate = reader.IsDBNull(13) ? null : (reader.GetDateTime(13) as DateTime?),
                                CategoryId = reader.GetGuid(14),
                                TypeEvent = (TypeEvent)reader.GetByte(15),
                                UrlExchange = reader.GetString(16),
                                ResultExchange = reader.IsDBNull(17) ? null : reader.GetString(17),
                                ApprovedDate = reader.IsDBNull(18) ? null : (reader.GetDateTime(18) as DateTime?),
                                SettlementDate = reader.IsDBNull(19) ? null : (reader.GetDateTime(19) as DateTime?),
                                LastPrice = 0m,
                                LastBid = 0m,
                                LastAsk = 1m,
                                LastSide = null,
                                HomePoints = reader.IsDBNull(24) ? null : (reader.GetDecimal(24) as decimal?),
                                HomeHandicap = reader.IsDBNull(25) ? null : (reader.GetDecimal(25) as decimal?),
                                AwayPoints = reader.IsDBNull(26) ? null : (reader.GetDecimal(26) as decimal?),
                                AwayHandicap = reader.IsDBNull(27) ? null : (reader.GetDecimal(27) as decimal?),
                                SortingData = new List<ExchangeSortData>(),
                                PriceChangeDirection = reader.GetInt32(28),
                                DelayTime = reader.GetInt32(29)
                            });
                        }
                    }
                    reader.Close();
                    //get currencies
                    command = connection.CreateCommand();
                    command.CommandText = "SELECT [Name] FROM [Currencies]";
                    reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Currencies.Add(reader.GetString(0));
                        }
                    }
                    reader.Close();
                    //retreive user orders and executions data from DB
                    command = connection.CreateCommand();
                    command.CommandText = string.Format("SELECT o.[ID], o.[AccountID], o.[SymbolID], o.[Time], o.[Side], o.[OrderType], o.[LimitPrice], o.[StopPrice], o.[Quantity], o.[TimeInForce], o.[ExpirationDate], e.[Time], e.[Status], e.[LastPrice], e.[LastQuantity], e.[FilledQuantity], e.[LeaveQuantity], e.[CancelledQuantity], e.[AverrageFillPrice], o.[IsMirror], e.[ClosedQuantity], e.[PaidUpQuantity] FROM [Executions] e INNER JOIN [Orders] o ON e.[OrderID] = o.[ID] INNER JOIN [Accounts] a ON o.[AccountID] = a.[Name] INNER JOIN [Users] u ON u.[UserName] = a.[UserName] WHERE a.[{0}] = {1}",
                        request.Email == string.Empty ? "UserName" : "Email",
                        request.Email == string.Empty ? "@UserName" : "@Email");
                    command.Parameters.AddWithValue(request.Email == string.Empty ? "UserName" : "Email", request.Email == string.Empty ? request.UserName : request.Email);
                    reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {                        
                        DateTime utcNow = DateTime.UtcNow;
                        while (reader.Read())
                        {
                            string orderID = reader.GetString(0);
                            string orderAccount = reader.GetString(1);
                            string orderSymbolID = reader.GetString(2);  
                            DateTime orderTime = reader.GetDateTime(3);
                            orderTime = DateTime.SpecifyKind(orderTime, DateTimeKind.Utc);
                            Side orderSide = (Side)((byte)reader.GetByte(4));
                            Type orderType = (Type)((byte)reader.GetByte(5));
                            decimal orderLimitPrice = reader.GetDecimal(6);
                            decimal orderStopPrice = reader.GetDecimal(7);
                            long orderQuantity = reader.GetInt64(8);
                            TimeInForce orderTimeInforce = (TimeInForce)((byte)reader.GetByte(9));
                            DateTime orderExpirationDate = reader.GetDateTime(10);
                            orderExpirationDate = DateTime.SpecifyKind(orderExpirationDate, DateTimeKind.Utc);
                            DateTime executionDate = reader.GetDateTime(11);
                            executionDate = DateTime.SpecifyKind(executionDate, DateTimeKind.Utc);
                            Status executionStatus = (Status)((byte)reader.GetByte(12));
                            decimal executionLastPrice = reader.GetDecimal(13);
                            long executionLastQuantity = reader.GetInt64(14);
                            long executionFilledQuantity = reader.GetInt64(15);
                            long executionLeaveQuantity = reader.GetInt64(16);
                            long executionCancelledQuantity = reader.GetInt64(17);
                            decimal executionAverrageFillPrice = reader.GetDecimal(18);
                            byte orderIsMirror = reader.GetByte(19);
                            long executionClosedQuantity = reader.GetInt64(20);
                            long executionPaidUpQuantity = reader.GetInt64(21);
                            var symbol = _exchanges.SelectMany(e => e.Symbols).Where(s => s.ID == orderSymbolID).FirstOrDefault();
                            if (symbol != null)
                            {
                                result.Orders.Add(new NewOrderRequest() { ID = orderID, Account = orderAccount, Symbol = symbol.Symbol, Time = orderTime, Side = orderSide, OrderType = orderType, LimitPrice = orderLimitPrice, StopPrice = orderStopPrice, Quantity = orderQuantity, TimeInForce = orderTimeInforce, ExpirationDate = orderExpirationDate, IsMirror = orderIsMirror });
                                result.Executions.Add(new Execution(orderID, executionDate, executionStatus, executionLastPrice, executionLastQuantity, executionFilledQuantity, executionLeaveQuantity, executionCancelledQuantity, executionClosedQuantity, executionPaidUpQuantity, ""));                                    
                            }
                        }                        
                    }
                    reader.Close();

                    command = connection.CreateCommand();
                    command.CommandText = string.Format("UPDATE [Accounts] SET [IsActive] = 1 WHERE [{0}] = {1}",
                        request.Email == string.Empty ? "UserName" : "Email",
                        request.Email == string.Empty ? "@UserName" : "@Email");
                    command.Parameters.AddWithValue(request.Email == string.Empty ? "UserName" : "Email", request.Email == string.Empty ? request.UserName : request.Email);
                    command.ExecuteNonQuery();

                    result.LoginResult = LoginResult.OK;

                    Log.WriteApplicationInfo("The user is login", request.UserName);
                    Log.WriteApplicationSingIn("The user is login", request.UserName);
                }
                else
                {
                    reader.Close();
                    result.LoginResult = LoginResult.InvalidCredentials;
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, request.UserName);
                result.LoginResult = LoginResult.InternalError;                
                result.Symbols.Clear();
                result.Accounts.Clear();
                result.Orders.Clear();
                result.Executions.Clear();
            }
            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }            
            return result;
        }

        public void Logout(string username)
        {
            var connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "UPDATE [Accounts] SET [IsActive] = 0 WHERE [UserName] = @UserName";
                command.Parameters.AddWithValue("UserName", username);
                command.ExecuteNonQuery();
                Log.WriteApplicationInfo("The user is logout", username);
                Log.WriteApplicationSingIn("The user is logout", username);
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, username);
            }
            finally
            {
                connection.Close();
            }
        }

        public AdminLoginResponse LoginAdmin(LoginRequest request)
        {
            var result = new AdminLoginResponse{ AdminLoginResult = LoginResult.InternalError, User = string.Empty};
           
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "SELECT [UserName], [Password] FROM [Admins] WHERE [UserName] = @UserName AND [Password] = @Password";
                    command.Parameters.AddWithValue("UserName", request.UserName);
                    command.Parameters.AddWithValue("Password", request.Password);
                    var reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.User = reader.GetString(0);
                        }
                        reader.Close();

                        command = connection.CreateCommand();
                        command.CommandText = "UPDATE [Admins] SET [IsActive] = 1 WHERE [UserName] = @UserName";
                        command.Parameters.AddWithValue("UserName", request.UserName);
                        command.ExecuteNonQuery();

                        result.AdminLoginResult = LoginResult.OK;
                        Log.WriteApplicationSingIn("The admin user is login", request.UserName);
                    }
                    else
                    {
                        reader.Close();
                        result.AdminLoginResult = LoginResult.InvalidCredentials;
                    }
                }
                catch (Exception ex)
                {
                    result.AdminLoginResult = LoginResult.InternalError;
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
            }

            return result;
        }

        public void RemoveSession(UserSession session)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "UPDATE [UserSessions] SET [EndSession] = @EndSession WHERE [UserName] = @UserName AND [UserBrowser] = @UserBrowser AND [UserIp] = @UserIp AND [EndSession] IS NULL";

                    command.Parameters.AddWithValue("UserName", session.UserName);
                    command.Parameters.AddWithValue("UserBrowser", session.UserBrowser);
                    command.Parameters.AddWithValue("UserIp", session.UserIp);
                    command.Parameters.AddWithValue("EndSession", DateTime.UtcNow);

                    var rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected != 1)
                        Log.WriteApplicationInfo(string.Format("WARNING!!! A few sessions have been removed. Count of sessions = {0}", rowsAffected), session.UserName);

                    Log.WriteApplicationInfo(string.Format("Session has been closed {0}", session.UserIp), session.UserName);
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, session.UserName);
                }
            }
        }

        public void AddSession(UserSession session)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "INSERT INTO [UserSessions] ([UserName], [UserBrowser], [UserIp], [StartSession], [EndSession]) VALUES (@UserName, @UserBrowser, @UserIp, @StartSession, @EndSession)";
                    
                    command.Parameters.AddWithValue("UserName", session.UserName);
                    command.Parameters.AddWithValue("UserBrowser", session.UserBrowser);
                    command.Parameters.AddWithValue("UserIp", session.UserIp);
                    command.Parameters.AddWithValue("StartSession", DateTime.UtcNow);
                    command.Parameters.AddWithValue("EndSession", DBNull.Value);

                    command.ExecuteNonQuery();
                    Log.WriteApplicationInfo(string.Format("New session added from {0}", session.UserIp), session.UserName);
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, session.UserName);
                }
            }
        }

        public void LogoutAdmin(string username)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                 try
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "UPDATE [Admins] SET [IsActive] = 0 WHERE [UserName] = @UserName";
                    command.Parameters.AddWithValue("UserName", username);
                    command.ExecuteNonQuery();
                    Log.WriteApplicationSingIn("The admin user is logout", username);
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, username);
                }
            }
        }

        public void AddUser(User user)
        {
            lock (_tradingLocker)
            {
                _users.Add(user);
            }
        }

        public void EditUserName(string previousUserName, User user)
        {
            lock (_tradingLocker)
            {
                var previousUser = _users.FirstOrDefault(u => u.UserName == previousUserName);
                if (previousUser != null)
                {
                    //find and remove orders and executions of no longer available accounts
                    var accounts = previousUser.Accounts.Except(user.Accounts, new AccountComparer()).Select(a => a.Name).ToList();
                    var orders = _activeOrders.Where(o => accounts.Contains(o.Account)).Concat(_stopOorders.Where(o => accounts.Contains(o.Account))).Select(o => o.ID).ToList();
                    var executions = _executions.Where(e => orders.Contains(e.OrderID)).ToList();
                    _executions.RemoveAll(e => orders.Contains(e.OrderID));
                    _activeOrders.RemoveAll(o => accounts.Contains(o.Account));
                    _stopOorders.RemoveAll(o => accounts.Contains(o.Account));
                    //edit user data 
                    previousUser.UserName = user.UserName;
                    previousUser.Password = user.Password;
                    previousUser.Accounts = user.Accounts;
                }
                else
                {
                    Log.WriteApplicationInfo("Can't find user to edit in datafeed");
                    _users.Add(user);
                }
            }
        }

        public User GetUserInfo(string userName)
        {
            var result = new User();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText = "SELECT u.[UserName], u.[Email], u.[FirstName], u.[LastName], u.[DateOfBirth], u.[Country], u.[Address], u.[Phone], u.[ConfirmationCode], u.[ConfirmationExpired], u.[Type] FROM [Users] u WHERE u.[UserName] = @UserName AND u.[IsDeleted] = 0";
                   // command.CommandText = "SELECT u.[UserName], u.[Email], u.[FirstName], u.[LastName], u.[DateOfBirth], u.[Country], u.[Address], u.[Phone], p.[Amount], p.[System],p.[DateOfPayment],p.[Direction] FROM [Users] u INNER JOIN[PaymentsHistory] p ON u.[Email]=p.[UserId] WHERE u.[UserName] = @UserName";
                    command.Parameters.AddWithValue("UserName", userName);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result = new User
                            {
                                UserName = reader.GetString(0),
                                Email = reader.GetString(1),
                                FirstName = reader.GetValue(2) == DBNull.Value ? null : reader.GetString(2),
                                LastName = reader.GetValue(3) == DBNull.Value ? null : reader.GetString(3),
                                DateOfBirth = reader.GetDateTime(4),
                                Country = reader.GetString(5),
                                Address = reader.GetValue(6) == DBNull.Value ? null : reader.GetString(6),
                                Phone = reader.GetValue(7) == DBNull.Value ? null : reader.GetString(7),
                                ConfirmationCode = reader.GetValue(8) == DBNull.Value ? null : reader.GetString(8),
                                ConfirmationExpired = reader.GetDateTime(9),
                                UserType = (UserType)Enum.Parse(typeof(UserType), reader.GetString(10)),
                                PaymentsHistory = new List<PaymentsHistory>(),

                                Accounts = new List<Account>()
                            };
                        }
                        reader.Close();

                        command = connection.CreateCommand();
                        command.CommandText = "SELECT a.[Balance], a.[Mode], a.[Bettor], a.[Trade], a.[Theme], a.[MailNews], a.[MailUpdates], a.[MailActivity], a.[SmsActivity], a.[GIDX_CustomerId], a.[GIDX_SessionId] FROM [dbo].[Accounts] a WHERE a.[UserName] = @UserName";
                        command.Parameters.AddWithValue("UserName", userName);
                        reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                result.Accounts.Add(new Account
                                         {
                                             Balance = reader.GetDecimal(0),
                                             Mode = reader.GetString(1),
                                             Bettor = reader.GetBoolean(2).ToString().ToLower(),
                                             Trade = reader.GetBoolean(3).ToString().ToLower(),
                                             Theme = reader.GetString(4),
                                             MailNews = reader.GetBoolean(5).ToString().ToLower(),
                                             MailUpdates = reader.GetBoolean(6).ToString().ToLower(),
                                             MailFrequency = reader.GetString(7),
                                             MailActivity = (reader.GetString(7) == "never" ?  false.ToString().ToLower() : true.ToString().ToLower()),
                                             SmsActivity = reader.GetBoolean(8).ToString().ToLower(),
                                             GIDX_CustomerId = !reader.IsDBNull(reader.GetOrdinal("GIDX_CustomerId"))? reader.GetString(9) : null,
                                             GIDX_SessionId = !reader.IsDBNull(reader.GetOrdinal("GIDX_SessionId")) ? reader.GetString(10) : null,
                                 
                                         });
                            }
                        }
                        reader.Close();

                        //get HistoryPayments

                        command = connection.CreateCommand();
                        command.CommandText = "SELECT u.[UserName], p.[Amount], p.[System],p.[DateOfPayment],p.[Direction],p.[Status] FROM [Users] u INNER JOIN[PaymentsHistory] p ON u.[Email]=p.[UserId]  WHERE u.[UserName] = @UserName";
                        command.Parameters.AddWithValue("UserName", userName);
                        reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                result.PaymentsHistory.Add(new PaymentsHistory
                                {
                                    amount = reader.GetDecimal(1),
                                    system = reader.GetString(2),
                                    date = reader.GetDateTime(3),
                                    direction = reader.GetString(4),
                                    status = reader.GetString(5)
                                    
                                });
                            }
                        }
                        reader.Close();
                    }
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, userName);
                }
            }

            return result;
        }

        public User GetUserInfoByEmail(string email)
        {
            var result = new User();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText = "SELECT u.[UserName] FROM [Users] u WHERE u.[Email] = @Email AND u.[IsDeleted] = 0";
                    command.Parameters.AddWithValue("Email", email);
                    var reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result = new User
                            {
                                UserName = reader.GetString(0)
                            };
                        }
                        reader.Close();
                    }
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, email);
                }
            }

            return result;
        }

        public string EditUserInfo(User user)
        {
            string error = string.Empty;

            var users = _users.FirstOrDefault(u => u.UserName == user.UserName);
            
            if (users != null)
            {
                //update users info 
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    try
                    {
                        connection.Open();
                        SqlCommand command;

                        var paramDictionary = new Dictionary<string, string>
                        {
                            {"FirstName", user.FirstName != users.FirstName ? user.FirstName : null},
                            {"LastName", user.LastName != users.LastName ? user.LastName : null},
                            {"Country", user.Country != users.Country ? user.Country : null},
                            {"Address", user.Address != users.Address ? user.Address : null},
                            {"Phone", user.Phone != users.Phone ? user.Phone : null},
                            {"ConfirmationCode", user.ConfirmationCode != users.ConfirmationCode ? user.ConfirmationCode : null},
                            {"ConfirmationExpired", user.ConfirmationExpired != users.ConfirmationExpired ? user.ConfirmationExpired.ToString() : null},
                            {"Type", user.UserType != users.UserType ? user.UserType.ToString() : null}
                        }
                        .Where(m => !string.IsNullOrEmpty(m.Value))
                        .ToList();

                        if (paramDictionary.Count > 0)
                        {
                            command = connection.CreateCommand();

                            var stringAccountCommand = new StringBuilder();

                            stringAccountCommand.Append("UPDATE [Users] SET ");

                            stringAccountCommand.Append(string.Join(", ", paramDictionary.Select(m => string.Format("[{0}] = @{1}", m.Key, m.Key))));
                            paramDictionary.ForEach(m => command.Parameters.AddWithValue(m.Key, m.Value));

                            stringAccountCommand.Append(", [LastEditedDate] = @LastEditedDate WHERE [UserName] = @UserName AND [IsDeleted] != @IsDelete");
                            command.Parameters.AddWithValue("UserName", user.UserName);
                            command.Parameters.AddWithValue("LastEditedDate", DateTime.UtcNow);
                            command.Parameters.AddWithValue("IsDelete", true);

                            command.CommandText = stringAccountCommand.ToString();
                            command.ExecuteNonQuery();
                            
                            //update user info for _users 
                            _users.Where(n => n.UserName == user.UserName).ToList().ForEach(u =>
                            {
                                u.FirstName = user.FirstName;
                                u.LastName = user.LastName;
                                u.Country = user.Country;
                                u.Address = user.Address;
                                u.Phone = user.Phone;
                                u.UserType = user.UserType;
                            });
                        }
                        
                        if (user.DateOfBirth != users.DateOfBirth)
                        {
                            command = connection.CreateCommand();
                            command.CommandText = "UPDATE [Users] SET [DateOfBirth] = @DateOfBirth, [LastEditedDate] = @LastEditedDate WHERE [UserName] = @UserName AND [IsDeleted] != @IsDelete";
                            command.Parameters.AddWithValue("UserName", user.UserName);
                            command.Parameters.AddWithValue("DateOfBirth", user.DateOfBirth);
                            command.Parameters.AddWithValue("LastEditedDate", DateTime.UtcNow);
                            command.Parameters.AddWithValue("IsDelete", true);
                            command.ExecuteNonQuery();

                            _users.Find(u => u.UserName == user.UserName).DateOfBirth = user.DateOfBirth;
                        }
                    }
                    catch (Exception ex)
                    {
                        error = "Some problems with update user info";
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, user.UserName);
                    }
                }
            }
            else
            {
                error = string.Format("Can not find {0} user to edit in datafeed", user.UserName);
                Log.WriteApplicationInfo(error);
            }

            return error;
        }

        public string EditUserPreferences(User user)
        {
            string error = string.Empty;
            var users = _users.FirstOrDefault(u => u.UserName == user.UserName);
            
            if (users != null)
            {
                //update users preferences
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    try
                    {
                        connection.Open();
                        //account model
                        var account = user.Accounts.FirstOrDefault();
                        //account _users collection
                        var accounts = users.Accounts.FirstOrDefault();

                        if (account != null)
                        {
                            if (accounts != null)
                            {
                                var paramDictionary = new Dictionary<string, string>
                                {
                                    {"Mode", account.Mode != accounts.Mode ? account.Mode : null},
                                    {"Bettor", account.Bettor != accounts.Bettor ? account.Bettor : null},
                                    {"Trade", account.Trade != accounts.Trade ? account.Trade : null},
                                    {"MailNews",account.MailNews !=accounts.MailNews ? account.MailNews : null},
                                    {"MailUpdates",account.MailUpdates != accounts.MailUpdates ? account.MailUpdates : null},
                                    {"MailActivity",account.MailFrequency != accounts.MailFrequency ? account.MailFrequency.ToString() : null},
                                    {"SmsActivity",account.SmsActivity !=accounts.SmsActivity ? account.SmsActivity:null}
                                }
                                .Where(m => !string.IsNullOrEmpty(m.Value))
                                .ToList();

                                if (paramDictionary.Count > 0)
                                {
                                    var command = connection.CreateCommand();

                                    var stringAccountCommand = new StringBuilder();

                                    stringAccountCommand.Append("UPDATE [Accounts] SET ");

                                    stringAccountCommand.Append(string.Join(", ", paramDictionary.Select(m => string.Format("[{0}] = @{1}", m.Key, m.Key))));
                                    paramDictionary.ForEach(m => command.Parameters.AddWithValue(m.Key, m.Value));

                                    stringAccountCommand.Append(" WHERE [UserName] = @UserName AND [IsDeleted] != @IsDelete");
                                    command.Parameters.AddWithValue("UserName", user.UserName);
                                    command.Parameters.AddWithValue("IsDelete", true);

                                    command.CommandText = stringAccountCommand.ToString();
                                    command.ExecuteNonQuery();

                                    //update accounts for _users 
                                    _users.Find(u => u.UserName == user.UserName).Accounts.ForEach(a =>
                                    {
                                        a.Mode = account.Mode;
                                        a.Bettor = account.Bettor;
                                        a.Trade = account.Trade;
                                        a.MailNews = account.MailNews;
                                        a.MailUpdates = account.MailUpdates;
                                        a.MailActivity = account.MailActivity;
                                        a.MailFrequency = account.MailFrequency;
                                    });
                                }
                            }
                            else
                            {
                                error = string.Format("Can not find account for {0} user to edit in datafeed", user.UserName);
                                Log.WriteApplicationInfo(error, user.UserName);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        error = "Some problems with update user info";
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, user.UserName);
                    }
                }
            }
            else
            {
                error = string.Format("Can't find {0} user to update info", user.UserName);
                Log.WriteApplicationInfo(error);
            }

            return error;
        }

       

        public string EditUserTheme(string userName, string theme)
        {
            var error = string.Empty;
            var users = _users.FirstOrDefault(u => u.UserName == userName);

            if (users != null)
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    try
                    {
                        connection.Open();

                        var command = connection.CreateCommand();
                        command.CommandText = "UPDATE [Accounts] SET [Theme] = @Theme WHERE [UserName] = @UserName AND [IsDeleted] != @IsDeleted";
                        command.Parameters.AddWithValue("UserName", userName);
                        command.Parameters.AddWithValue("Theme", theme);
                        command.Parameters.AddWithValue("IsDeleted", true);
                        command.ExecuteNonQuery();

                        _users.Find(u => u.UserName == userName).Accounts.First().Theme = theme;
                    }
                    catch (Exception ex)
                    {
                        error = string.Format("Can't change theme for {0} user", userName);
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, userName);
                    }
                }
            }
            else
            {
                error = string.Format("Can not find {0} user to edit in datafeed", userName);
                Log.WriteApplicationInfo(error);
            }
            return error;
        }
        public ResultObj ChangePasswordUser(string userName, string oldPassword, string newPassword)
        {
            var error = new ResultObj();
            var user = _users.FirstOrDefault(u => u.UserName == userName);

            if (user != null)
            {
                var userPassword = user.Password;
                if (oldPassword != newPassword)
                {
                    if (oldPassword == userPassword)
                    {
                        //change password from User
                        using (SqlConnection connection = new SqlConnection(_connectionString))
                        {
                            try
                            {
                                connection.Open();

                                var command = connection.CreateCommand();
                                command.CommandText = "UPDATE [Users] SET [Password] = @Password, [LastEditedDate] = @LastEditedDate  WHERE [UserName] = @UserName AND [IsDeleted] != @IsDeleted";
                                command.Parameters.AddWithValue("UserName", userName);
                                command.Parameters.AddWithValue("Password", newPassword);
                                command.Parameters.AddWithValue("LastEditedDate", DateTime.UtcNow);
                                command.Parameters.AddWithValue("IsDeleted", true);
                                command.ExecuteNonQuery();

                                _users.Find(u => u.UserName == userName).Password = newPassword;

                                Log.WriteApplicationInfo("The user changed his password", userName);
                            }
                            catch (Exception ex)
                            {
                                error = new ResultObj { Param1 = string.Format("Can't change password for {0} user", userName) };
                                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex, userName);
                            }
                        }
                    }
                    else
                    {
                        error = new ResultObj { Error = "Current password does not match" };
                        Log.WriteApplicationInfo(error.ToString(), userName);
                    }
                }
                else
                {
                    error = new ResultObj { Error = "Current password coincides with a new password" };
                    Log.WriteApplicationInfo(error.ToString(), userName);
                }
            }
            else
            {
                error = new ResultObj { Error = string.Format("Can't find {0} user to change password", userName) };
                Log.WriteApplicationInfo(error.ToString());
            }

            return error;
        }

        public void DeleteUser(string userName)
        {
            lock (_tradingLocker)
            {
                var previousUser = _users.FirstOrDefault(u => u.UserName == userName);
                if (previousUser != null)
                {
                    //find and remove orders and executions of no longer available accounts
                    var accounts = previousUser.Accounts.Select(a => a.Name).ToList();
                    var orders = _activeOrders.Where(o => accounts.Contains(o.Account)).Concat(_stopOorders.Where(o => accounts.Contains(o.Account))).Select(o => o.ID).ToList();
                    var executions = _executions.Where(e => orders.Contains(e.OrderID));                    
                    _executions.RemoveAll(e => orders.Contains(e.OrderID));
                    _activeOrders.RemoveAll(o => accounts.Contains(o.Account));
                    _stopOorders.RemoveAll(o => accounts.Contains(o.Account));
                    //remove user from users collection
                    _users.RemoveAll(u => u.UserName == userName);
                }
                else
                {
                    Log.WriteApplicationInfo("Can't find user to delete in datafeed");
                }
            }
        }

        //public void AddExchange(ExchangeSettingsEx exchange)
        //{
        //    lock (_exchanges)
        //    {
        //        exchange.Init();
        //        _exchanges.Add(exchange);
        //    }
        //}

        public string AddExchange(AddExchangeRequest request)
        {
            var result = string.Empty;

            if (request != null)
            {
                lock (_exchanges)
                {
                    ExchangeSettingsEx exchange = new ExchangeSettingsEx(request.Exchange);
                    if (exchange.StartDate < exchange.EndDate)
                    {
                        //check unique Name, URL
                        if (_exchanges.All(e => e.Name != request.Exchange.Name))
                        {
                            if (_exchanges.All(e => e.Symbols.First().Symbol.UrlExchange != request.Exchange.Symbols.First().UrlExchange))
                            {
                                SqlTransaction transaction = null;
                                SqlConnection connection = new SqlConnection(_connectionString);
                                try
                                {
                                    connection.Open();
                                    transaction = connection.BeginTransaction();
                                    SqlCommand command = connection.CreateCommand();
                                    command.Transaction = transaction;
                                    List<string> currencies = new List<string>();
                                    command.CommandText = "SELECT [Name] FROM [Currencies]";
                                    var reader = command.ExecuteReader();
                                    if (reader.HasRows)
                                    {
                                        while (reader.Read())
                                        {
                                            currencies.Add(reader.GetString(0));
                                        }
                                    }
                                    reader.Close();
                                    command = connection.CreateCommand();
                                    command.Transaction = transaction;
                                    command.CommandText = "INSERT INTO [Exchanges] VALUES (@Name, @StartTime, @EndTime, @CommonCurrency, @StartDate, @EndDate, 1, 0)";
                                    command.Parameters.AddWithValue("Name", request.Exchange.Name);
                                    command.Parameters.AddWithValue("StartTime", request.Exchange.StartTime);
                                    command.Parameters.AddWithValue("EndTime", request.Exchange.EndTime);
                                    command.Parameters.AddWithValue("CommonCurrency", request.Exchange.CommonCurrency);
                                    command.Parameters.AddWithValue("StartDate", request.Exchange.StartDate);
                                    command.Parameters.AddWithValue("EndDate", request.Exchange.EndDate);
                                    command.ExecuteNonQuery();
                                    DataTable table = new DataTable();
                                    table.Columns.Add("ID", typeof(string));
                                    table.Columns.Add("Name", typeof(string));
                                    table.Columns.Add("Exchange", typeof(string));
                                    table.Columns.Add("Currency", typeof(string));
                                    table.Columns.Add("IsDeleted", typeof(byte));
                                    table.Columns.Add("FullName", typeof(string));
                                    table.Columns.Add("HomeName", typeof(string));
                                    table.Columns.Add("HomeAlias", typeof(string));
                                    table.Columns.Add("AwayName", typeof(string));
                                    table.Columns.Add("AwayAlias", typeof(string));
                                    table.Columns.Add("Status", typeof(byte));
                                    table.Columns.Add("StatusEvent", typeof(string));
                                    table.Columns.Add("StartDate", typeof(DateTime));
                                    table.Columns.Add("EndDate", typeof(DateTime));
                                    table.Columns.Add("CategoryId", typeof(Guid));
                                    table.Columns.Add("TypeEvent", typeof(byte));
                                    table.Columns.Add("Url", typeof(string));
                                    table.Columns.Add("Result", typeof(string));
                                    table.Columns.Add("ApprovedDate", typeof(DateTime));
                                    table.Columns.Add("SettlementDate", typeof(DateTime));
                                    table.Columns.Add("LastPrice", typeof(decimal));
                                    table.Columns.Add("Side", typeof(byte));
                                    table.Columns.Add("LastAsk", typeof(decimal));
                                    table.Columns.Add("LastBid", typeof(decimal));
                                    table.Columns.Add("HomePoints", typeof(decimal));
                                    table.Columns.Add("HomeHandicap", typeof(decimal));
                                    table.Columns.Add("AwayPoints", typeof(decimal));
                                    table.Columns.Add("AwayHandicap", typeof(decimal));
                                    table.Columns.Add("PriceChangeDirection", typeof(int));
                                    table.Columns.Add("DelayTime", typeof(int));
                                    if (request.Exchange.CommonCurrency)
                                    {
                                        if (currencies.Contains("BASE"))
                                        {
                                            ExchangeSymbol symbol = new ExchangeSymbol() { ID = Guid.NewGuid().ToString(), Symbol = new Symbol() { Name = "BTC", Exchange = request.Exchange.Name, Currency = "BASE" } };
                                            table.Rows.Add(symbol.ID, symbol.Symbol.Name, symbol.Symbol.Exchange, symbol.Symbol.Currency);
                                            exchange.Symbols.Add(symbol);
                                        }
                                    }
                                    else
                                    {
                                        request.Exchange.Symbols.ForEach(item =>
                                        {
                                            if (currencies.Contains(item.Currency))
                                            {
                                                ExchangeSymbol symbol = new ExchangeSymbol() { ID = Guid.NewGuid().ToString(), Symbol = new Symbol() { Name = item.Name, Exchange = item.Exchange, Currency = item.Currency, FullName = item.FullName, HomeName = item.HomeName, HomeAlias = item.HomeAlias, AwayName = item.AwayName, AwayAlias = item.AwayAlias, Status = item.Status, StartDate = item.StartDate, EndDate = item.EndDate, CategoryId = item.CategoryId, TypeEvent = item.TypeEvent, UrlExchange = item.UrlExchange, ResultExchange = item.ResultExchange, ApprovedDate = item.ApprovedDate, SettlementDate = item.SettlementDate, LastPrice = item.LastPrice, LastSide = item.LastSide, LastAsk = item.LastAsk, LastBid = item.LastBid, HomePoints = item.HomePoints, HomeHandicap = item.HomeHandicap, AwayPoints = item.AwayPoints, AwayHandicap = item.AwayHandicap, StatusEvent = item.StatusEvent, PriceChangeDirection =  item.PriceChangeDirection, DelayTime = item.DelayTime} };
                                                table.Rows.Add(symbol.ID, symbol.Symbol.Name, symbol.Symbol.Exchange, symbol.Symbol.Currency, 0, symbol.Symbol.FullName, symbol.Symbol.HomeName, symbol.Symbol.HomeAlias, symbol.Symbol.AwayName, symbol.Symbol.AwayAlias, symbol.Symbol.Status, symbol.Symbol.StatusEvent, symbol.Symbol.StartDate, symbol.Symbol.EndDate, symbol.Symbol.CategoryId, symbol.Symbol.TypeEvent, symbol.Symbol.UrlExchange, symbol.Symbol.ResultExchange, symbol.Symbol.ApprovedDate, symbol.Symbol.SettlementDate, symbol.Symbol.LastPrice, symbol.Symbol.LastSide, symbol.Symbol.LastAsk, symbol.Symbol.LastBid, symbol.Symbol.HomePoints, symbol.Symbol.HomeHandicap, symbol.Symbol.AwayPoints, symbol.Symbol.AwayHandicap, symbol.Symbol.PriceChangeDirection, symbol.Symbol.DelayTime);
                                                exchange.Symbols.Add(symbol);
                                            }
                                        });
                                    }
                                    if (table.Rows.Count > 0)
                                    {
                                        SqlBulkCopy copy = new SqlBulkCopy(connection, SqlBulkCopyOptions.KeepIdentity | SqlBulkCopyOptions.CheckConstraints | SqlBulkCopyOptions.TableLock, transaction);
                                        copy.DestinationTableName = "Symbols";
                                        copy.WriteToServer(table);
                                        transaction.Commit();
                                    }
                                    else
                                    {
                                        //invalid symbols
                                        result = "100";
                                    }
                                }
                                catch (Exception ex)
                                {
                                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                                    if (transaction != null)
                                    {
                                        transaction.Rollback();
                                    }
                                    //ex.Message
                                    result = "100";
                                }
                                if (connection.State == System.Data.ConnectionState.Open)
                                {
                                    connection.Close();
                                }
                            }
                            else
                            {
                                //not unique exchange url
                                result = "102";
                            }
                        }
                        else
                        {
                            //not unique exchange name
                            result = "101";
                        }
                    }
                    else
                    {
                        //Invalid exchange session time. Start time must be less then end time.
                        result = "103";
                    }

                    if (string.IsNullOrEmpty(result))
                    {
                        //update exchanges in order matching engine 
                        _exchanges.Add(exchange);
                        result = "200";
                    }
                }
            }
            return result;
        }

        public string EditExchange(EditExchangeRequest request)
        {
            string result;

            lock (_exchanges)
            {
                var symbol = request.Exchange.Symbols.First();
                var exchange = _exchanges.Find(n => n.Name == request.Exchange.Name);

                if (request.Exchange.StartDate < request.Exchange.EndDate)
                {
                    if (_exchanges.Where(d => d.Name != request.Exchange.Name).All(e => e.Symbols.First().Symbol.UrlExchange != symbol.UrlExchange))
                    {
                        SqlTransaction transaction = null;
                        SqlConnection connection = new SqlConnection(_connectionString);
                        try
                        {
                            SqlCommand command;
                            connection.Open();
                            transaction = connection.BeginTransaction();

                            if (request.Exchange.EndDate != exchange.EndDate)
                            {
                                command = connection.CreateCommand();
                                command.Transaction = transaction;
                                command.CommandText = "UPDATE [Exchanges] SET [EndDate] = @EndDate WHERE [Name] = @Name";
                                command.Parameters.AddWithValue("Name", request.Exchange.Name);
                                command.Parameters.AddWithValue("EndDate", request.Exchange.EndDate);
                                command.ExecuteNonQuery();

                                _exchanges.Find(e => e.Name == request.Exchange.Name).EndDate = request.Exchange.EndDate;
                            }

                            command = connection.CreateCommand();
                            command.Transaction = transaction;
                            command.CommandText = "UPDATE [Symbols] SET [FullName] = @FullName, [HomeName] = @HomeName, [AwayName] = @AwayName, [StartDate] = @StartDate, [EndDate] = @EndDate, [TypeEvent] = @TypeEvent, [Url] = @Url, [HomeHandicap] = @HomeHandicap, [AwayHandicap] = @AwayHandicap  WHERE [Exchange] = @Exchange";
                            command.Parameters.AddWithValue("Exchange", symbol.Name);
                            command.Parameters.AddWithValue("FullName", symbol.FullName);
                            command.Parameters.AddWithValue("HomeName", symbol.HomeName);
                            command.Parameters.AddWithValue("AwayName", symbol.AwayName);
                            command.Parameters.AddWithValue("TypeEvent", (byte)symbol.TypeEvent);
                            command.Parameters.AddWithValue("Url", symbol.UrlExchange);
                            if (symbol.StartDate != null)
                            {
                                command.Parameters.AddWithValue("StartDate", symbol.StartDate);
                            }
                            else
                            {
                                command.Parameters.AddWithValue("StartDate", DBNull.Value);
                            }
                            if (symbol.EndDate != null)
                            {
                                command.Parameters.AddWithValue("EndDate", symbol.EndDate);
                            }
                            else
                            {
                                command.Parameters.AddWithValue("EndDate", DBNull.Value);
                            }
                            if (symbol.HomeHandicap != null)
                            {
                                command.Parameters.AddWithValue("HomeHandicap", symbol.HomeHandicap);
                            }
                            else
                            {
                                command.Parameters.AddWithValue("HomeHandicap", DBNull.Value);
                            }
                            if (symbol.AwayHandicap != null)
                            {
                                command.Parameters.AddWithValue("AwayHandicap", symbol.AwayHandicap);
                            }
                            else
                            {
                                command.Parameters.AddWithValue("AwayHandicap", DBNull.Value);
                            }
                            command.ExecuteNonQuery();
                            
                            _exchanges.Find(n => n.Name == request.Exchange.Name).Symbols.ForEach(s =>
                            {
                                s.Symbol.FullName = symbol.FullName;
                                s.Symbol.HomeName = symbol.HomeName;
                                s.Symbol.AwayName = symbol.AwayName;
                                s.Symbol.StartDate = symbol.StartDate;
                                s.Symbol.EndDate = symbol.EndDate;
                                s.Symbol.TypeEvent = symbol.TypeEvent;
                                s.Symbol.UrlExchange = symbol.UrlExchange;
                                s.Symbol.HomeHandicap = symbol.HomeHandicap;
                                s.Symbol.AwayHandicap = symbol.AwayHandicap;
                            });
                            transaction.Commit();

                            result = "200";
                        }
                        catch (Exception ex)
                        {
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                            if (transaction != null)
                            {
                                transaction.Rollback();
                            }
                            //ex.Message
                            result = "100";
                        }
                        if (connection.State == ConnectionState.Open)
                        {
                            connection.Close();
                        }
                    }
                    else
                    {
                        //not unique exchange url
                        result = "102";
                    }
                }
                else
                {
                    //Invalid exchange session time. Start time must be less then end time.
                    result = "103";
                }
            }

            return result;
        }

        public string ChangeStatusExchange(StatusExchangeRequest request)
        {
            string result;
            
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    lock (_exchanges)
                    {
                        SqlCommand command;
                        connection.Open();
                   
                        if (request.Status == StatusEvent.Approved)
                        {
                            command = connection.CreateCommand();
                            command.CommandText = "UPDATE [Symbols] SET [Status] = @Status, [ApprovedDate] = @ApprovedDate WHERE [Exchange] = @Exchange"; ;
                            command.Parameters.AddWithValue("Exchange", request.Exchange);
                            command.Parameters.AddWithValue("Status", (byte)request.Status);
                            command.Parameters.AddWithValue("ApprovedDate", DateTime.UtcNow);
                            command.ExecuteNonQuery();

                            _exchanges.Find(e => e.Name == request.Exchange).Symbols.ForEach(s => 
                                {
                                    s.Symbol.Status = request.Status;
                                    s.Symbol.ApprovedDate = DateTime.UtcNow;
                                });
                        }
                        else
                        {
                            command = connection.CreateCommand();
                            command.CommandText = "UPDATE [Symbols] SET [Status] = @Status WHERE [Exchange] = @Exchange"; ;
                            command.Parameters.AddWithValue("Exchange", request.Exchange);
                            command.Parameters.AddWithValue("Status", (byte)request.Status);
                            command.ExecuteNonQuery();

                            _exchanges.Find(e => e.Name == request.Exchange).Symbols.First().Symbol.Status = request.Status;
                        }

                        result = "200";
                    }
                }
                catch (Exception ex)
                {
                    result = "100";
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
            }

            return result;
        }

        public void OrderCreateBotHandler()
        {
            while(_started)
            {
                if (_exchangeBotList.Count > 0)
                {
                    foreach(var e in _exchangeBotList.ToList())
                    {
                        var rand = new Random();
                        var order = new NewOrderRequest
                        {
                            Account = "Bot",
                            ActivationTime = DateTime.UtcNow,
                            ExpirationDate = DateTime.UtcNow.AddYears(100),
                            IsMirror = 0,
                            LimitPrice = (decimal)rand.Next(1, 100) / 100,
                            OrderType = (Type)Enum.Parse(typeof(Type), "Limit"),
                            Quantity = rand.Next(5, 100),
                            Side = (Side)Enum.Parse(typeof(Side), rand.Next(0, 2) == 0 ? Side.Buy.ToString() : Side.Sell.ToString()),
                            StopPrice = 0,
                            Symbol = e.Symbols.Single().Symbol,
                            Time = DateTime.UtcNow,
                            TimeInForce = (TimeInForce)Enum.Parse(typeof(TimeInForce), TimeInForce.DAY.ToString()),
                            ID = Guid.NewGuid().ToString()
                        };

                        Thread.Sleep(5000);

                        ProcessRequest(order);
                    };
                }
            }
        }

        class Estimation
        {
            public string UserName { get; set; }
            public string Account { get; set;}
            public decimal Balance { get; set; }
            public List<string> OrdersToDone { get; set; }
        }

        //public string CloseExchangeOld(object req)
        //{
        //    var request = req as CloseExchangeRequest;
        //    var exchangeName = request.Exchange.Name;
        //    var result = request.Result;
            
        //    List<Estimation> estimations = new List<Estimation>();
        //    string error = string.Empty;
        //    decimal gainLoss = 0m;
        //    string SymbolID = string.Empty;
        //    string SymbolName = string.Empty;

        //    var connection = new SqlConnection(_connectionString);
        //    SqlTransaction transaction = null;
        //    connection.Open();
        //    SqlCommand command = connection.CreateCommand();
        //    command.CommandText = "SELECT [ID], [Name] FROM [Symbols] WHERE [Exchange] = @Exchange";
        //    command.Parameters.AddWithValue("Exchange", exchangeName);
        //    var reader = command.ExecuteReader();
        //    if (reader.HasRows)
        //    {
        //        int count = 0;
        //        while (reader.Read())
        //        {
        //            if (count > 0)
        //            {
        //                //error = "Invalid Exchange";
        //                error = "101";
        //            }
        //            SymbolID = reader.GetString(0);
        //            SymbolName = reader.GetString(1);
        //            count++;
        //        }
        //    }
        //    reader.Close();

        //    if (result == Result.Undefined)
        //    {
        //        //error = "Undefined result";
        //        error = "102";
        //        command = connection.CreateCommand();
        //        command.CommandText = "UPDATE [Exchanges] SET [isActive] = 0 WHERE [Name] = @Name";
        //        command.Parameters.AddWithValue("Name", exchangeName);
        //        command.ExecuteNonQuery();
        //    }
        //    if(!error.Any())
        //    {
        //        try
        //        {
        //            transaction = connection.BeginTransaction();
        //            command = connection.CreateCommand();
        //            command.Transaction = transaction;
        //            command.CommandText = "UPDATE [Exchanges] SET [isActive] = 0, [isDeleted] = 1 WHERE [Name] = @Name";
        //            command.Parameters.AddWithValue("Name", exchangeName);
        //            command.ExecuteNonQuery();

        //            _executions.FindAll(exe => _activeOrders.First(ao => ao.ID == exe.OrderID).Symbol.Name == SymbolName && (exe.Status == Status.Filled || exe.Status == Status.PartialFilled)).ForEach(exe =>
        //            {
        //                var currentActiveOrder = _activeOrders.First(ao => ao.ID == exe.OrderID);
        //                gainLoss = 0m;
        //                if (result != Result.Emergency)
        //                {
        //                    if (result == Result.Positive && currentActiveOrder.Side == Side.Buy || result == Result.Negative && currentActiveOrder.Side == Side.Sell)
        //                    {
        //                        gainLoss = exe.FilledQuantity - exe.PaidUpQuantity +
        //                            ((currentActiveOrder.Side == Side.Buy) ? exe.LeaveQuantity * currentActiveOrder.LimitPrice : (exe.LeaveQuantity * (1 - currentActiveOrder.LimitPrice)));
        //                    }
        //                    else
        //                    {
        //                        gainLoss = (currentActiveOrder.Side == Side.Buy) ? exe.LeaveQuantity * currentActiveOrder.LimitPrice : (exe.LeaveQuantity * (1 - currentActiveOrder.LimitPrice));
        //                    }
        //                }
        //                else
        //                {
        //                    if (exe.LeaveQuantity > 0)
        //                    {
        //                        gainLoss += currentActiveOrder.Side == Side.Buy ? exe.LeaveQuantity * currentActiveOrder.LimitPrice : exe.LeaveQuantity * (1 - currentActiveOrder.LimitPrice);
        //                    }
        //                    if (exe.FilledQuantity > 0 && exe.FilledQuantity - exe.PaidUpQuantity != 0)
        //                    {
        //                        command = connection.CreateCommand();
        //                        command.Transaction = transaction;
        //                        command.CommandText = "SELECT [Price], [Quantity], [Time] FROM [PartialExecutions] WHERE [ExistingOrder] = @OrderID OR [NewOrder] = @OrderID ORDER BY [Time] DESC";
        //                        command.Parameters.AddWithValue("OrderID", exe.OrderID);
        //                        reader = command.ExecuteReader();
        //                        if (reader.HasRows)
        //                        {
        //                            var returnQuantity = exe.FilledQuantity - exe.PaidUpQuantity;

        //                            while (reader.Read())
        //                            {
        //                                var price = reader.GetDecimal(0);
        //                                var quantity = reader.GetInt64(1);
        //                                var time = reader.GetDateTime(2);

        //                                if(returnQuantity != 0)
        //                                {
        //                                    gainLoss += ((currentActiveOrder.Side == Side.Buy) ? Math.Min(quantity, returnQuantity) * price : (Math.Min(quantity, returnQuantity) * (1 - price)));
        //                                }
        //                                returnQuantity -= Math.Min(quantity, returnQuantity);
        //                            }
        //                        }
        //                        reader.Close();
        //                    }
        //                }

        //                var account = estimations.FirstOrDefault(e => e.Account == currentActiveOrder.Account);
        //                if (account == null)
        //                {
        //                    estimations.Add(new Estimation { Account = currentActiveOrder.Account, Balance = Users.Find(u => u.Email == currentActiveOrder.Account).Accounts.First().Balance 
        //                        + gainLoss, OrdersToDone = new List<string> { exe.OrderID } });
        //                }
        //                else
        //                {
        //                    account.Balance = account.Balance + gainLoss;
        //                    account.OrdersToDone.Add(exe.OrderID);
        //                }
        //            });
                    
        //            foreach(var account in estimations)
        //            {
        //                command = connection.CreateCommand();
        //                command.Transaction = transaction;
        //                command.CommandText = "UPDATE [Accounts] SET [Balance] = @Balance WHERE [Name] = @AccountName";
        //                command.Parameters.AddWithValue("Balance", account.Balance);
        //                command.Parameters.AddWithValue("AccountName", account.Account);
        //                command.ExecuteNonQuery();
        //                foreach(var order in account.OrdersToDone)
        //                {
        //                    command = connection.CreateCommand();
        //                    command.Transaction = transaction;
        //                    command.CommandText = "UPDATE [Executions] SET [Status] = @Status WHERE [OrderID] = @OrderID";
        //                    command.Parameters.AddWithValue("Status", (byte)4);
        //                    command.Parameters.AddWithValue("OrderID", order);
        //                    command.ExecuteNonQuery();
        //                }
        //            }

        //            command = connection.CreateCommand();
        //            command.Transaction = transaction;
        //            command.CommandText = "UPDATE [Tick] SET [isDeleted] = 1 WHERE [SymbolID] = @SymbolID";
        //            command.Parameters.AddWithValue("SymbolID", SymbolID);
        //            command.ExecuteNonQuery();

        //            command = connection.CreateCommand();
        //            command.Transaction = transaction;
        //            command.CommandText = "UPDATE [Symbols] SET [Status] = @Status, [Result] = @Result, [SettlementDate] = @SettlementDate, [isDeleted] = 1 WHERE [ID] = @SymbolID";
        //            command.Parameters.AddWithValue("SymbolID", SymbolID);
        //            command.Parameters.AddWithValue("Status", (byte)StatusEvent.Settlement);
        //            command.Parameters.AddWithValue("Result", request.Winner);
        //            command.Parameters.AddWithValue("SettlementDate", DateTime.UtcNow);
        //            command.ExecuteNonQuery();

        //            transaction.Commit();

        //            foreach(var est in estimations)
        //            {
        //                lock(_tradingLocker)
        //                {
        //                    _users.First(u => u.Accounts.First().Name == est.Account).Accounts.First(a => a.Name == est.Account).Balance = est.Balance;
        //                    _activeOrders.RemoveAll(x => est.OrdersToDone.Contains(x.ID));
        //                    _stopOorders.RemoveAll(x => est.OrdersToDone.Contains(x.ID));
        //                }
        //            }
        //            _exchanges.Remove(_exchanges.Where(e => e.Name == exchangeName).FirstOrDefault());

        //            error = "200";
        //        }
        //        catch (SqlException ex)
        //        {
        //            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
        //            if (transaction != null)
        //            {
        //                transaction.Rollback();
        //                //error = string.Format("Internal server error - {0}", ex.Message);
        //                error = "100";
        //            }
        //        }
        //        //OnMessageResponse("admin", "close exchange", error);
        //    }
        //    connection.Close();

        //    return error;
        //}

        public string CloseExchange(object req)
        {
            CloseExchangeRequest request = req as CloseExchangeRequest;
            ExchangeSettingsEx exchange = null;
            int positivePercentage = request.PositivePercent;
            bool isEmergency = positivePercentage == -1 ? true : false;
            string state = string.Empty;

            lock(_exchanges)
            {
                exchange = _exchanges.FirstOrDefault(e => e.Name == request.ExchangeName);
                if(exchange != null)
                {
                    exchange.Closed = true;
                }
            }
            if (exchange != null)
            {
                ExchangeSymbol Symbol = exchange.Symbols.First();
                string SymbolID = Symbol.ID;
                string SymbolName = Symbol.Symbol.Name;

                List<Execution> executionsBySymbol = null;
                lock (_tradingLocker)
                {
                    executionsBySymbol = _executions.Where(e => _activeOrders.First(ao => ao.ID == e.OrderID).Symbol.Name == SymbolName).ToList();
                }

                List<Estimation> userBalanceChanges = UserBalanceChanges(executionsBySymbol, positivePercentage);
                SqlConnection connection = new SqlConnection(_connectionString);
                SqlTransaction transaction = null;
                SqlCommand command = null;
                try
                {
                    connection.Open();
                    transaction = connection.BeginTransaction();

                    userBalanceChanges.ForEach(account =>
                    {
                        command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "UPDATE [Accounts] SET [Balance] = [Balance] + @Balance WHERE [Name] = @AccountName";
                        command.Parameters.AddWithValue("Balance", account.Balance);
                        command.Parameters.AddWithValue("AccountName", account.Account);
                        command.ExecuteNonQuery();
                        account.OrdersToDone.ForEach(order =>
                        {
                            command = connection.CreateCommand();
                            command.Transaction = transaction;
                            command.CommandText = "UPDATE [Executions] SET [Status] = @Status WHERE [OrderID] = @OrderID";
                            command.Parameters.AddWithValue("Status", (byte)4);
                            command.Parameters.AddWithValue("OrderID", order);
                            command.ExecuteNonQuery();
                        });
                    });

                    command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText = "UPDATE [Tick] SET [isDeleted] = 1 WHERE [SymbolID] = @SymbolID";
                    command.Parameters.AddWithValue("SymbolID", SymbolID);
                    command.ExecuteNonQuery();

                    command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText = "UPDATE [Symbols] SET [Status] = @Status, [Result] = @Result, [SettlementDate] = @SettlementDate, [isDeleted] = 1 WHERE [ID] = @SymbolID";
                    command.Parameters.AddWithValue("SymbolID", SymbolID);
                    command.Parameters.AddWithValue("Status", (byte)StatusEvent.Settlement);
                    command.Parameters.AddWithValue("Result", positivePercentage != -1 ? string.Format("{0}/{1}", positivePercentage, (100-positivePercentage)) : "Emergency"); 
                    command.Parameters.AddWithValue("SettlementDate", DateTime.UtcNow);
                    command.ExecuteNonQuery();

                    command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText = "UPDATE [Exchanges] SET [isActive] = 0, [isDeleted] = 1 WHERE [Name] = @Name";
                    command.Parameters.AddWithValue("Name", request.ExchangeName);
                    command.ExecuteNonQuery();

                    transaction.Commit();

                    userBalanceChanges.ForEach(x =>
                    {
                        lock (_tradingLocker)
                        {
                            _users.FirstOrDefault(u => u.UserName == x.Account).Accounts.First().Balance += x.Balance;
                            _activeOrders.RemoveAll(y => x.OrdersToDone.Contains(y.ID));
                            _executions.RemoveAll(y => x.OrdersToDone.Contains(y.OrderID));
                            _stopOorders.RemoveAll(y => x.OrdersToDone.Contains(y.ID));
                        }
                    });
                    lock(_ticks)
                    {
                        _ticks.RemoveAll(y => y.Symbol.Exchange == request.ExchangeName);
                    }

                    lock (_exchanges)
                    {
                        _exchanges.Remove(_exchanges.Where(e => e.Name == request.ExchangeName).FirstOrDefault());
                    }
                    state = "200";

                }
                catch (Exception ex)
                {
                    state = "100";
                }
                finally
                {
                    connection.Close();
                }
            }
            return state;
        }

        private List<Estimation> UserBalanceChanges(List<Execution> executionsBySymbol, int positivePercentage)
        {
            List<Estimation> estimations = new List<Estimation>();
            decimal gainLoss;
            executionsBySymbol.ForEach(exe =>
            {
                var currentActiveOrder = _activeOrders.First(ao => ao.ID == exe.OrderID);
                gainLoss = 0m;
                if (positivePercentage != -1)
                {
                    decimal LeaveQuantityOrdersAssets = currentActiveOrder.Side == Side.Buy ?
                                                        exe.LeaveQuantity * currentActiveOrder.LimitPrice :
                                                        exe.LeaveQuantity * (1 - currentActiveOrder.LimitPrice);
                    decimal NotPaidPositions = exe.FilledQuantity - exe.PaidUpQuantity;

                    if ((positivePercentage >= 50 && positivePercentage <= 100 && currentActiveOrder.Side == Side.Buy) || (positivePercentage < 50 && positivePercentage >= 0 && currentActiveOrder.Side == Side.Sell))
                    {
                        //winner
                        if(positivePercentage >= 50)
                        {
                            gainLoss = NotPaidPositions * positivePercentage / 100 + LeaveQuantityOrdersAssets;
                        }
                        else
                        {
                            gainLoss = NotPaidPositions * (100 - positivePercentage) / 100 + LeaveQuantityOrdersAssets;
                        }
                        
                    }
                    else
                    {
                        //loser
                        if (positivePercentage < 50)
                        {
                            gainLoss = NotPaidPositions * positivePercentage / 100 + LeaveQuantityOrdersAssets;
                        }
                        else
                        {
                            gainLoss = NotPaidPositions * (100 - positivePercentage) / 100 + LeaveQuantityOrdersAssets;
                        }
                    }
                }
                else //emergency close exchange
                {
                    if (exe.LeaveQuantity > 0)
                    {
                        gainLoss += currentActiveOrder.Side == Side.Buy ? exe.LeaveQuantity * currentActiveOrder.LimitPrice : exe.LeaveQuantity * (1 - currentActiveOrder.LimitPrice);
                    }
                    if (exe.FilledQuantity > 0 && exe.FilledQuantity - exe.PaidUpQuantity != 0)
                    {
                        List<PartialExecution> currentPartial = null;
                        lock(_partialExecutions)
                        {
                            currentPartial = _partialExecutions.Where(e => e.ExistingOrderID == exe.OrderID || e.NewOrderID == exe.OrderID).ToList();
                        }

                        var returnQuantity = exe.FilledQuantity - exe.PaidUpQuantity;

                        currentPartial.ForEach(e =>
                        {
                            gainLoss += (currentActiveOrder.Side == Side.Buy) ? Math.Min(e.Quantity, returnQuantity) * e.Price : (Math.Min(e.Quantity, returnQuantity) * (1 - e.Price));
                            returnQuantity -= Math.Min(e.Quantity, returnQuantity);
                        });
                    }
                }

                var account = estimations.FirstOrDefault(e => e.Account == currentActiveOrder.Account);
                if (account == null)
                {
                    estimations.Add(new Estimation
                    {
                        Account = currentActiveOrder.Account,
                        Balance = gainLoss,
                        OrdersToDone = new List<string> { exe.OrderID }
                    });
                }
                else
                {
                    account.Balance += gainLoss;
                    account.OrdersToDone.Add(exe.OrderID);
                }
            });
            return estimations;
        }

        public string DeleteExchange(string exchange)
        {
            string result = "100";

            lock (_exchanges)
            {
                if (_exchanges.Find(e => e.Name == exchange).Symbols.First().Symbol.Status == StatusEvent.New)
                {
                    SqlTransaction transaction = null;

                    using (SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        try
                        {
                            connection.Open();
                            transaction = connection.BeginTransaction();

                            var command = connection.CreateCommand();
                            command.Transaction = transaction;
                            command.CommandText = "UPDATE [Exchanges] SET [isActive] = 0, [isDeleted] = 1 WHERE [Name] = @Name";
                            //command.CommandText = "DELETE FROM [Exchanges] WHERE [Name] = @Name";
                            command.Parameters.AddWithValue("Name", exchange);
                            command.ExecuteNonQuery();

                            command = connection.CreateCommand();
                            command.Transaction = transaction;
                            command.CommandText = "UPDATE [Symbols] SET [isDeleted] = 1 WHERE [Exchange] = @Exchange";
                            //command.CommandText = "DELETE FROM [Symbols] WHERE [Exchange] = @Exchange";
                            command.Parameters.AddWithValue("Exchange", exchange);
                            command.ExecuteNonQuery();

                            _exchanges.RemoveAll(e => e.Name == exchange);
                            
                            transaction.Commit();
                            result = "200";
                        }
                        catch (Exception ex)
                        {
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                            if (transaction != null)
                            {
                                transaction.Rollback();
                                result = "100";
                            }
                        }
                    }
                }
                else
                {
                    result = "101";
                }
            }

            return result;
        }

        public void SetCurrencies(List<Currency> currencies)
        {
            lock (_tradingLocker)
            {
                var oldCurrenies = _currencies.Where(oc => currencies.FirstOrDefault(c => c.Name == oc.Name) == null).Select(c => c.Name);
                var existingCurrenies = _currencies.Where(oc => currencies.FirstOrDefault(c => c.Name == oc.Name) != null).Select(c => c.Name);
                _currencies.RemoveAll(c => oldCurrenies.Contains(c.Name));
                currencies.ForEach(c =>
                {
                    if (!existingCurrenies.Contains(c.Name))
                    {
                        _currencies.Add(c);
                    }
                });
            }
        }                

        public Tick GetLastTick(Symbol symbol, string currency = "")
        {
            var lastTick = _cache == null ? null : _cache.GetLastTick(symbol);
            var result = new Tick(symbol, DateTime.MinValue, 0, 0, false) { Currency = currency };
            if (lastTick != null)
            {
                result.Time = lastTick.Time;
                result.Bid = lastTick.Bid;
                result.BidSize = lastTick.BidSize;
                result.Ask = lastTick.Ask;
                result.AskSize= lastTick.AskSize;
                result.Price = lastTick.Price;
                result.Volume = lastTick.Volume;
                result.Side = lastTick.Side;
                if (!string.IsNullOrEmpty(currency))
                {
                    var currencyMultiplier = GetCurrencyMultiplier(currency);
                    var baseMultiplier = GetCurrencyMultiplier(symbol.Currency);
                    if (currencyMultiplier != 0 && baseMultiplier != 0)
                    {
                        var multiplier = baseMultiplier / currencyMultiplier;
                        result.Bid *= multiplier;
                        result.Ask *= multiplier;
                        result.Price *= multiplier;
                    }
                    else
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Currency {0} or {1} does not exist", symbol.Currency, currency)));
                    }
                }
            }
            return result;
        }

        public List<Bar> GetHistory(HistoryParameters request)
        {
            var result = _cache.GetHistory(request);
            if (!string.IsNullOrEmpty(request.Currency))
            {
                var currencyMultiplier = GetCurrencyMultiplier(request.Currency);
                var baseMultiplier = GetCurrencyMultiplier(request.Symbol.Currency);
                if (currencyMultiplier != 0 && baseMultiplier != 0)
                {
                    var multiplier = baseMultiplier / currencyMultiplier;
                    result.ForEach(b =>
                    {
                        b.Open *= multiplier;
                        b.High *= multiplier;
                        b.Low *= multiplier;
                        b.Close *= multiplier;
                    });
                }
                else
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Currency {0} or {1} does not exist", request.Symbol.Currency, request.Currency)));
                }
            }           
            return result;
        }
                               
        public void ProcessRequest(object request)
        {
            //add user request to queue and set event to process current events queue
            lock(_requests)
            {
                _requests.Enqueue(request);
            }
            _processOrdersEvent.Set();
        }

        private decimal GetCurrencyMultiplier(string convertedCurrency)
        {
            decimal result = 0;
            lock (_currencies)
            {
                var currency = _currencies.FirstOrDefault(c => c.Name == convertedCurrency);
                if (currency != null)
                {
                    result = currency.Multiplier;
                }
            }
            return result;
        }
               
        private void ProcessRequestHandler()
        {
            while(_started)
            {
                _processOrdersEvent.WaitOne();
                _processOrdersEvent.Reset();
                while(_requests.Count > 0)
                {
                    object request = null;
                    lock(_requests)
                    {
                        request = _requests.Dequeue();
                    }
                    if(request != null)
                    {
                        //process new order request
                        if(request as NewOrderRequest != null)
                        {
                            NewOrderRequest orderRequest = (NewOrderRequest)request;
                            DateTime transactionTime = DateTime.UtcNow;
                           
                            //validate order parameters
                            string error = ValidateNewOrderRequest(orderRequest);

                            if (string.IsNullOrEmpty(error))
                            {
                                ExchangeSymbol symbol = null;
                                lock (_exchanges)
                                {
                                    var exchangeSettings = _exchanges.FirstOrDefault(e => e.Name == orderRequest.Symbol.Exchange);
                                    if (exchangeSettings != null)
                                    {
                                        //set order expiration date acording to order TimeInForce and ExpirationDate
                                        if (orderRequest.TimeInForce == TimeInForce.DAY || orderRequest.TimeInForce == TimeInForce.AON)
                                        {
                                            orderRequest.ExpirationDate = exchangeSettings.EndDate;
                                        }
                                        else if (orderRequest.TimeInForce == TimeInForce.GTC)
                                        {
                                            orderRequest.ExpirationDate = _UNIX_START;
                                        }
                                        symbol = exchangeSettings.Symbols.FirstOrDefault(s => s.Symbol.Equals(orderRequest.Symbol));
                                        if (symbol == null)
                                        {
                                            error = "Invalid symbol";
                                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Invalid exchange, ID {0}", orderRequest.ID)));
                                        }
                                    }
                                    else
                                    {
                                        error = "Internal error on server";
                                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Invalid symbol, ID {0}", orderRequest.ID)));
                                    }
                                }

                                var positionExecutions = _executions.Where(e =>
                                        (e.Status == Status.Filled ||
                                        e.Status == Status.PartialFilled) &&
                                        e.ClosedQuantity < e.FilledQuantity &&
                                        _activeOrders.FirstOrDefault(ao => ao.ID == e.OrderID).Symbol.Equals(orderRequest.Symbol) &&
                                        _activeOrders.FirstOrDefault(ao => ao.ID == e.OrderID).Side != orderRequest.Side &&
                                        _activeOrders.FirstOrDefault(ao => ao.ID == e.OrderID).Account == orderRequest.Account
                                    ).OrderBy(e => _activeOrders.FirstOrDefault(ao => ao.ID == e.OrderID).Time).ToList();

                                long totalPositionQuantity = 0;
                                long positionOrderQuantity = 0;

                                if (positionExecutions != null)
                                {
                                    totalPositionQuantity = positionExecutions.Sum(po => po.FilledQuantity) - positionExecutions.Sum(po => po.ClosedQuantity);//total opened positions quantity according current 
                                    positionOrderQuantity = Math.Min(totalPositionQuantity, orderRequest.Quantity);//opened positions for trading
                                    orderRequest.Quantity -= positionOrderQuantity;//remaining quantity to create new order     
                                }

                                error = CheckAccountBalanceForCreateNewOrder(orderRequest, positionOrderQuantity);

                                if (string.IsNullOrEmpty(error))
                                {
                                    if (orderRequest.OrderType == Type.Market || orderRequest.OrderType == Type.Limit)
                                    {
                                        orderRequest.ActivationTime = transactionTime;
                                    }
                                    orderRequest.ExpirationDate = orderRequest.ExpirationDate.ToUniversalTime();
                                    //save order and execution in DB in a single transaction

                                    NewOrderRequest activePosition = null;
                                    Execution executionPosition = null;

                                    SqlConnection connection = new SqlConnection(_connectionString);
                                    SqlTransaction transaction = null;
                                    try
                                    {
                                        connection.Open();
                                        transaction = connection.BeginTransaction();
                                        SqlCommand command = null;

                                        if (positionOrderQuantity > 0)
                                        {
                                            string positionID = Guid.NewGuid().ToString();

                                            command = connection.CreateCommand();
                                            command.Transaction = transaction;
                                            command.CommandText = "INSERT INTO [Orders] VALUES (@ID, @AccountID, @SymbolID, @Time, @ActivationTime, @Side, @OrderType, @LimitPrice, @StopPrice, @Quantity, @TimeInForce, @ExpirationDate, @IsMirror)";
                                            command.Parameters.AddWithValue("ID", positionID);
                                            command.Parameters.AddWithValue("AccountID", orderRequest.Account);
                                            command.Parameters.AddWithValue("SymbolID", symbol.ID);
                                            command.Parameters.AddWithValue("Time", transactionTime);
                                            if (orderRequest.ActivationTime == DateTime.MinValue)
                                            {
                                                command.Parameters.AddWithValue("ActivationTime", DBNull.Value);
                                            }
                                            else
                                            {
                                                command.Parameters.AddWithValue("ActivationTime", orderRequest.ActivationTime);
                                            }
                                            command.Parameters.AddWithValue("Side", (byte)orderRequest.Side);
                                            command.Parameters.AddWithValue("OrderType", (byte)orderRequest.OrderType);
                                            command.Parameters.AddWithValue("LimitPrice", orderRequest.LimitPrice);
                                            command.Parameters.AddWithValue("StopPrice", orderRequest.StopPrice);
                                            command.Parameters.AddWithValue("Quantity", positionOrderQuantity);
                                            command.Parameters.AddWithValue("TimeInForce", orderRequest.TimeInForce);
                                            command.Parameters.AddWithValue("ExpirationDate", orderRequest.ExpirationDate);
                                            command.Parameters.AddWithValue("IsMirror", orderRequest.IsMirror);
                                            command.ExecuteNonQuery();

                                            activePosition = new NewOrderRequest { 
                                                ID = positionID,
                                                Account = orderRequest.Account,
                                                ActivationTime = orderRequest.ActivationTime,
                                                ExpirationDate = orderRequest.ExpirationDate,
                                                LimitPrice = orderRequest.LimitPrice,
                                                OrderType = orderRequest.OrderType,
                                                Quantity = positionOrderQuantity,
                                                Side = orderRequest.Side,
                                                StopPrice = orderRequest.StopPrice,
                                                Symbol = _exchanges.First(e => e.Symbols.FirstOrDefault().ID == symbol.ID).Symbols.FirstOrDefault().Symbol,
                                                Time = transactionTime,
                                                TimeInForce = orderRequest.TimeInForce,
                                                IsMirror = orderRequest.IsMirror
                                            }; 
                                            
                                            command = connection.CreateCommand();
                                            command.Transaction = transaction;
                                            command.CommandText = "INSERT INTO [Executions] VALUES (@OrderID, @Time, @Status, 0, 0, 0, 0, 0, @LeaveQuantity, 0, 0, @InProcess)";
                                            command.Parameters.AddWithValue("OrderID", positionID);
                                            command.Parameters.AddWithValue("Time", transactionTime);
                                            command.Parameters.AddWithValue("Status", (byte)Status.VirtualPosition);//OpenedPosition changed to VirtualPosition
                                            command.Parameters.AddWithValue("LeaveQuantity", positionOrderQuantity);
                                            command.Parameters.AddWithValue("InProcess", true);
                                            command.ExecuteNonQuery();

                                            executionPosition = new Execution {
                                                OrderID = positionID,
                                                Time = transactionTime,
                                                Status = Status.VirtualPosition,//OpenedPosition changed to VirtualPosition
                                                LeaveQuantity = positionOrderQuantity,
                                            };


                                            positionExecutions.ForEach(po =>
                                            {
                                                if (positionOrderQuantity > 0)
                                                {
                                                    var avaliliableQuantityToClose = po.FilledQuantity - po.ClosedQuantity;
                                                    po.ClosedQuantity += Math.Min(avaliliableQuantityToClose, positionOrderQuantity);
                                                    positionOrderQuantity -= Math.Min(avaliliableQuantityToClose, positionOrderQuantity);
                                                    command = connection.CreateCommand();
                                                    command.Transaction = transaction;
                                                    command.CommandText = "UPDATE [Executions] SET [Time] = @Time, [ClosedQuantity] = @ClosedQuantity WHERE [OrderID] = @ID";
                                                    command.Parameters.AddWithValue("ID", po.OrderID);
                                                    command.Parameters.AddWithValue("Time", transactionTime);
                                                    command.Parameters.AddWithValue("ClosedQuantity", po.ClosedQuantity);
                                                    command.ExecuteNonQuery();
                                                }
                                            });
                                        }

                                        if(orderRequest.Quantity > 0)
                                        {
                                            command = connection.CreateCommand();
                                            command.Transaction = transaction;
                                            command.CommandText = "INSERT INTO [Orders] VALUES (@ID, @AccountID, @SymbolID, @Time, @ActivationTime, @Side, @OrderType, @LimitPrice, @StopPrice, @Quantity, @TimeInForce, @ExpirationDate, @IsMirror)";
                                            command.Parameters.AddWithValue("ID", orderRequest.ID);
                                            command.Parameters.AddWithValue("AccountID", orderRequest.Account);
                                            command.Parameters.AddWithValue("SymbolID", symbol.ID);
                                            command.Parameters.AddWithValue("Time", transactionTime);
                                            if (orderRequest.ActivationTime == DateTime.MinValue)
                                            {
                                                command.Parameters.AddWithValue("ActivationTime", DBNull.Value);
                                            }
                                            else
                                            {
                                                command.Parameters.AddWithValue("ActivationTime", orderRequest.ActivationTime);
                                            }
                                            command.Parameters.AddWithValue("Side", (byte)orderRequest.Side);
                                            command.Parameters.AddWithValue("OrderType", (byte)orderRequest.OrderType);
                                            command.Parameters.AddWithValue("LimitPrice", orderRequest.LimitPrice);
                                            command.Parameters.AddWithValue("StopPrice", orderRequest.StopPrice);
                                            command.Parameters.AddWithValue("Quantity", orderRequest.Quantity);
                                            command.Parameters.AddWithValue("TimeInForce", orderRequest.TimeInForce);
                                            command.Parameters.AddWithValue("ExpirationDate", orderRequest.ExpirationDate);
                                            command.Parameters.AddWithValue("IsMirror", orderRequest.IsMirror);
                                            command.ExecuteNonQuery();

                                            command = connection.CreateCommand();
                                            command.Transaction = transaction;
                                            command.CommandText = "INSERT INTO [Executions] VALUES (@OrderID, @Time, @Status, 0, 0, 0, 0, 0, @LeaveQuantity, 0, 0, @InProcess)";
                                            command.Parameters.AddWithValue("OrderID", orderRequest.ID);
                                            command.Parameters.AddWithValue("Time", transactionTime);
                                            command.Parameters.AddWithValue("Status", (byte)Status.VirtualOrder);//Opened changed to VirtualOrder
                                            command.Parameters.AddWithValue("LeaveQuantity", orderRequest.Quantity);
                                            command.Parameters.AddWithValue("InProcess", true);

                                            command.ExecuteNonQuery();
                                        }

                                        transaction.Commit();
                                    }
                                    catch (Exception ex)
                                    {
                                        if (transaction != null)
                                        {
                                            transaction.Rollback();
                                        }
                                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                                        error = "Internal error on server";
                                    }
                                    if (connection.State == System.Data.ConnectionState.Open)
                                    {
                                        connection.Close();
                                    }
                                    if (string.IsNullOrEmpty(error))
                                    {
                                        if(activePosition != null)
                                        {
                                            lock(_tradingLocker)
                                            {
                                                //store execution in local collection
                                                _executions.Add(executionPosition);
                                                //store order in local collection
                                                _activeOrders.Add(activePosition);
                                            }
                                            //if (orderRequest.ActivationTime != DateTime.MinValue)
                                            //{
                                            //    //process request according to matching rules
                                            //    ProcessOrderRequest(activePosition);
                                            //}
                                            
                                        }
                                        if(orderRequest.Quantity > 0)
                                        {
                                            var execution = new Execution(orderRequest.ID, transactionTime, Status.VirtualOrder, 0, 0, 0, orderRequest.Quantity, 0, 0, 0, error);//Status changed to VirtualOrder
                                            lock (_tradingLocker)
                                            {
                                                //store execution in local collection
                                                _executions.Add(execution);
                                                //store order in local collection
                                                _activeOrders.Add(orderRequest);
                                            }
                                            //if (orderRequest.ActivationTime != DateTime.MinValue)
                                            //{
                                            //    //process request according to matching rules
                                                //ProcessOrderRequest(orderRequest);
                                            //}
                                        }

                                        //processedAccounts.ForEach(account =>
                                        //{
                                        //    CloseMatchedPositionsAccordingParticularUser(account.Name, orderRequest.Symbol);
                                        //});

                                        //processedAccounts = null;
                                        //remove filled orders/executions from local collection
                                        //lock(_tradingLocker)
                                        //{
                                        //    _executions.FindAll(e => e.LeaveQuantity == 0 && e.FilledQuantity == e.PaidUpQuantity).ForEach(e => _activeOrders.RemoveAll(o => o.ID == e.OrderID));
                                        //    _executions.RemoveAll(e => e.LeaveQuantity == 0 && e.FilledQuantity == e.PaidUpQuantity);
                                        //}

                                        UpdateAskBid(orderRequest.Symbol);

                                        //lock (_partialExecutions)
                                        //{
                                        //    _partialExecutions.RemoveAll(pe => !_activeOrders.Any(ao => ao.ID == pe.NewOrderID || ao.ID == pe.ExistingOrderID));
                                        //}
                                    }
                                }
                            }
                            if (!string.IsNullOrEmpty(error))
                            {
                                //some error occurred, send message to user
                                OnNotificationInfo(orderRequest.Account, string.Format(error));
                            }
                        }
                        else if (request as CancelOrderRequest != null)
                        {
                            //process cancel order
                            CancelOrder(request as CancelOrderRequest);
                        }
                        else
                        {
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception("Unsupported message type received"));
                        }
                    }
                }
            }
        }

        public List<AdminExchange> GetAdminExchanges()
        {
            var adminExchanges = new List<AdminExchange>();
            var exchanges = new List<ExchangeSettingsEx>();

            SqlConnection connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText = "SELECT e.[Name], e.[StartTime], e.[EndTime], e.[CommonCurrency], e.[StartDate], e.[EndDate], s.[ID], s.[Name], s.[Exchange], s.[Currency], s.[FullName], s.[HomeName], s.[HomeAlias], s.[AwayName], s.[AwayAlias], s.[Status], s.[StartDate], s.[EndDate], s.[CategoryId], s.[TypeEvent], s.[Url], s.[Result], s.[ApprovedDate], s.[SettlementDate], s.[LastPrice], s.[Side], s.[LastAsk], s.[LastBid], s.[HomePoints], s.[HomeHandicap], s.[AwayPoints], s.[AwayHandicap], s.[StatusEvent], s.[PriceChangeDirection], s.[DelayTime] FROM [Exchanges] e, [Symbols] s WHERE e.[Name] = s.[Exchange] AND NOT(s.[IsDeleted] = 1 AND s.[Status] = 0) ORDER BY s.[FullName]";
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    //retreive exchanges data from DB
                    while (reader.Read())
                    {
                        string exchangeName = reader.GetString(0);
                        exchanges.Add(new ExchangeSettingsEx()
                        {
                            Name = reader.GetString(0),
                            StartTime = reader.GetTimeSpan(1),
                            EndTime = reader.GetTimeSpan(2),
                            CommonCurrency = reader.GetBoolean(3),
                            StartDate = reader.GetDateTime(4),
                            EndDate = reader.GetDateTime(5),
                            Symbols = new List<ExchangeSymbol>(),
                        });

                        exchanges.First(item => item.Name == exchangeName).Symbols.Add(new ExchangeSymbol()
                        {
                            ID = reader.GetString(6),
                            Symbol = new Symbol()
                            {
                                Name = reader.GetString(7),
                                Exchange = reader.GetString(8),
                                Currency = reader.GetString(9),
                                FullName = reader.GetString(10),
                                HomeName = reader.GetString(11),
                                HomeAlias = reader.GetString(12),
                                AwayName = reader.GetString(13),
                                AwayAlias = reader.GetString(14),
                                Status = (StatusEvent)reader.GetByte(15),
                                StartDate = reader.IsDBNull(16) ? null : (reader.GetDateTime(16) as DateTime?),
                                EndDate = reader.IsDBNull(17) ? null : (reader.GetDateTime(17) as DateTime?),
                                StartDateStr = reader.IsDBNull(16) ? null : reader.GetDateTime(16).ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'"),
                                EndDateStr = reader.IsDBNull(17) ? null : reader.GetDateTime(17).ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'"),
                                CategoryId = reader.GetGuid(18),
                                TypeEvent = (TypeEvent)reader.GetByte(19),
                                UrlExchange = reader.GetString(20),
                                ResultExchange = reader.IsDBNull(21) ? null : reader.GetString(21),
                                ApprovedDate = reader.IsDBNull(22) ? null : (reader.GetDateTime(22) as DateTime?),
                                SettlementDate = reader.IsDBNull(23) ? null : (reader.GetDateTime(23) as DateTime?),
                                LastPrice = reader.GetDecimal(24),
                                LastSide = reader.IsDBNull(25) ? null : ((Side)reader.GetByte(25) as Side?), 
                                LastAsk = reader.GetDecimal(26),
                                LastBid = reader.GetDecimal(27),
                                HomePoints = reader.IsDBNull(28) ? null : (reader.GetDecimal(28) as decimal?),
                                HomeHandicap = reader.IsDBNull(29) ? null : (reader.GetDecimal(29) as decimal?),
                                AwayPoints = reader.IsDBNull(30) ? null : (reader.GetDecimal(30) as decimal?),
                                AwayHandicap = reader.IsDBNull(31) ? null : (reader.GetDecimal(31) as decimal?),
                                SortingData = new List<ExchangeSortData>(),
                                StatusEvent = reader.GetString(32),
                                PriceChangeDirection = reader.GetInt32(33),
                                DelayTime = reader.GetInt32(34)
                            }
                        });
                    }
                }
                reader.Close();

                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
                
                exchanges.ForEach(e =>
                {
                    var categoryChain = string.Join("/", CategoryUrlChain(e.Symbols.Single().Symbol.CategoryId, true));

                    adminExchanges.Add(new AdminExchange
                    {
                        Name = e.Name,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        Symbol = e.Symbols.Single().Symbol,
                        CategoryExchange = string.Format("{0}/{1}", categoryChain, e.Symbols.Single().Symbol.UrlExchange)
                    });
                });
                
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }

            return adminExchanges;
        }

        public GetOrdersResponse GetOrders(GetOrdersRequest request)
        {
            GetOrdersResponse result = new GetOrdersResponse();
            try
            {
                lock (_tradingLocker)
                {
                    var activeOrders = _activeOrders.Where(ao => ao.Symbol.Name == request.Symbol.Name && _executions.Single(e => e.OrderID == ao.ID).LeaveQuantity != 0).ToList().Clone();
                    if (request.Reflection == "1")
                    {
                        activeOrders.ForEach(ao =>
                        {
                            ao.Quantity = _executions.Where(e => e.OrderID == ao.ID).Single().LeaveQuantity;
                            ao.LimitPrice = 1 - ao.LimitPrice;
                            ao.Side = 1 - ao.Side;
                        });
                    }
                    else
                    {
                        activeOrders.ForEach(ao => ao.Quantity = _executions.Where(e => e.OrderID == ao.ID).Single().LeaveQuantity);
                    }
                    var ordersToWiew = activeOrders.GroupBy(ao => ao.Side).Select(y => new ActiveOrder
                    {
                        SummaryPositionPrice = (y.First().Side == Side.Buy)
                            ? y.OrderByDescending(x1 => x1.LimitPrice).OrderBy(x1 => x1.LimitPrice).GroupBy(x1 => x1.LimitPrice).Select(x1 => new SummaryPositionPrice { Price = x1.First().LimitPrice, Quantity = x1.Sum(x2 => x2.Quantity) }).ToList()
                            : y.OrderBy(x1 => x1.LimitPrice).GroupBy(x1 => x1.LimitPrice).Select(x1 => new SummaryPositionPrice { Price = x1.First().LimitPrice, Quantity = x1.Sum(x2 => x2.Quantity) }).ToList(),
                        Side = y.First().Side,
                    }).ToList();


                    var ticks = _ticks.Where(t => t.Symbol.Name == request.Symbol.Name).ToList().Clone();
                    if (request.Reflection == "1")
                    {
                        ticks.ForEach(t => t.Price = 1 - t.Price);
                    }

                    result = new GetOrdersResponse { ActiveOrders = ordersToWiew, Ticks = ticks };
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            
            return result;
        }

        public decimal GetUserBalance(string userName)
        {
            decimal result = 0m;
            try
            {
                lock(_tradingLocker)
                {
                    var user = _users.FirstOrDefault(u => u.UserName == userName);
                    if(user != null)
                    {
                        result = user.Accounts.FirstOrDefault().Balance;
                    }
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return result;
        }

        private decimal CommonCurrentOrderPrice(Execution currentExecution, bool isOrder)
        {
            decimal result = 0m;
            try
            {
                List<PartialExecution> currentPartialExecution = null;
                lock (_partialExecutions)
                {
                    currentPartialExecution = _partialExecutions.Where(pe => pe.ExistingOrderID == currentExecution.OrderID || pe.NewOrderID == currentExecution.OrderID).OrderBy(pe => pe.Time).ToList();
                }
                if(currentPartialExecution != null)
                {
                    var ignoreQuantity = currentExecution.PaidUpQuantity;
                    var priceQuantity = currentExecution.FilledQuantity - ignoreQuantity;

                    currentPartialExecution.ForEach(pe =>
                    {
                        var currentQuantity = pe.Quantity;
                        if (ignoreQuantity > 0)
                        {
                            var quantityToClose = Math.Min(currentQuantity, ignoreQuantity);
                            ignoreQuantity -= quantityToClose;
                            currentQuantity -= Math.Min(currentQuantity, ignoreQuantity);
                        }
                        if (currentQuantity > 0)
                        {
                            var quantityToClose = Math.Min(priceQuantity, currentQuantity);
                            priceQuantity -= quantityToClose;
                            if (isOrder == true)
                            {
                                result += quantityToClose * (_activeOrders.First(ao => ao.ID == currentExecution.OrderID).Side == Side.Buy ? pe.Price : 1 - pe.Price);
                            }
                            else
                            {
                                result += quantityToClose * pe.Price;
                            }

                        }
                    });

                    if (isOrder == true)
                    {
                        result += currentExecution.LeaveQuantity * (_activeOrders.First(ao => ao.ID == currentExecution.OrderID).Side == Side.Buy ?
                                                                _activeOrders.First(ao => ao.ID == currentExecution.OrderID).LimitPrice :
                                                                1 - _activeOrders.First(ao => ao.ID == currentExecution.OrderID).LimitPrice);
                    }
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return result;
        }

        public decimal GetUserInvested(string userName)
        {
            decimal result = 0m;
            try
            {
                lock (_tradingLocker)
                {
                    var user = _users.FirstOrDefault(u => u.UserName == userName);
                    if (user != null)
                    {
                        var currenrExecutions = _executions.Where(e => _activeOrders.First(_ao => _ao.ID == e.OrderID).Account == userName &&
                            (e.Status == Status.Opened || e.Status == Status.PartialFilled || e.Status == Status.Filled) &&
                            (e.FilledQuantity != 0 ? (e.FilledQuantity + e.LeaveQuantity) > e.PaidUpQuantity : true)).ToList();
                        if(currenrExecutions.Any())
                        {
                            result = currenrExecutions.Sum(e => CommonCurrentOrderPrice(e, true));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return result;
        }

        public decimal GetUserGainLost(string userName)
        {
            decimal result = 0m;
            try
            {
                lock (_tradingLocker)
                {
                    var user = _users.FirstOrDefault(u => u.UserName == userName);
                    if (user != null)
                    {
                        var userPositions = AllUserPositions(userName);
                        userPositions.ForEach(userPosition =>
                        {
                            Symbol currentSymbol = _exchanges.FirstOrDefault(e => e.Symbols.First().Symbol.Name == userPosition.Symbol.Name).Symbols.First().Symbol;
                            Execution currentExecution = _executions.FirstOrDefault(e => e.OrderID == userPosition.ID);
                            long positionQuantity = currentExecution.FilledQuantity - currentExecution.PaidUpQuantity;
                            decimal positionPrice = CommonCurrentOrderPrice(currentExecution, false);

                            if(userPosition.Side == Side.Buy)
                            {
                                result += currentSymbol.LastBid * positionQuantity - positionPrice;
                            }
                            else
                            {
                                result += positionPrice - currentSymbol.LastAsk * positionQuantity;
                            }
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return result;
        }

        public void CloseOutReverse(string symbol, string userName, bool isReverse)
        {
            CancelAll(symbol, userName);
            var allUserPositions = new List<NewOrderRequest>();
            lock (_tradingLocker)
            {
                allUserPositions = AllUserPositions(userName).Where(x => x.Symbol.ToString() == symbol).ToList();
            }
            if(allUserPositions.Any())
            {
                long quantity = allUserPositions.Sum(x => _executions.First(y => y.OrderID == x.ID).FilledQuantity);
                Side side = allUserPositions.FirstOrDefault().Side;
                ProcessRequest(new NewOrderRequest
                {
                    Account = userName,
                    ActivationTime = DateTime.UtcNow,
                    ExpirationDate = DateTime.UtcNow.AddDays(365),
                    ID = Guid.NewGuid().ToString(),
                    LimitPrice = 0m,
                    OrderType = Type.Market,
                    Quantity = isReverse == true ? quantity * 2 : quantity,
                    Side = side == Side.Buy ? Side.Sell : Side.Buy,
                    StopPrice = 0,
                    Symbol = _exchanges.First(e => e.Symbols.First().Symbol.ToString() == symbol).Symbols.First().Symbol,
                    Time = DateTime.UtcNow,
                    TimeInForce = 0,
                    IsMirror = 0
                });
            }
        }

        public void CancelAll(string symbol, string userName)
        {
            var ordersForCancel = new List<NewOrderRequest>();
            lock (_tradingLocker)
            {
                ordersForCancel = _activeOrders.Where(ao => ao.Symbol.ToString() == symbol && ao.Account == userName &&
                                                                (_executions.First(e => e.OrderID == ao.ID).Status == Status.Opened ||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilled ||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.OpenedPosition ||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilledPosition)
                                                                ).ToList();
            }
            ordersForCancel.ForEach(o =>
            {
                ProcessRequest(new CancelOrderRequest { ID = o.ID });
            });
        }

        private void CancelOrder(CancelOrderRequest request, bool validate = true)
        {
            string account = "";
            //get order account
            lock (_tradingLocker)
            {
                var orderToCancel = _activeOrders.FirstOrDefault(o => o.ID == request.ID);
                if (orderToCancel == null)
                {
                    orderToCancel = _stopOorders.FirstOrDefault(o => o.ID == request.ID);
                }
                if (orderToCancel != null)
                {
                    account = orderToCancel.Account;
                    
                }
            }
            DateTime transactionTime = DateTime.UtcNow;
            //validate order parameters if order is canceled by user, not by exchange
            string error = validate ? ValidateCancelOrderRequest(request) : "";
            if (string.IsNullOrEmpty(error))
            {
                lock (_tradingLocker)
                {
                    NewOrderRequest order = _activeOrders.FirstOrDefault(o => o.ID == request.ID);
                    if (order == null)
                    {
                        order = _stopOorders.FirstOrDefault(o => o.ID == request.ID);
                    }
                    if (order != null)
                    {                        
                        var execution = _executions.FirstOrDefault(e => e.OrderID == request.ID);
                        if (execution != null)
                        {
                            Account pendingOrderUserAccount = null;
                            bool convertToCommonCurrency = _exchanges.First(e => e.Name == order.Symbol.Exchange).CommonCurrency;
                            pendingOrderUserAccount = _users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name == order.Account) != null).Accounts.FirstOrDefault(a => a.Name == order.Account);
                            if (order.OrderType != Type.Market &&
                                (execution.Status == Status.PartialFilled ||
                                execution.Status == Status.Opened))
                            {
                                if (convertToCommonCurrency)
                                {
                                    pendingOrderUserAccount.Balance += order.Side == Side.Buy ?
                                     (execution.LeaveQuantity * order.LimitPrice / GetCurrencyMultiplier(pendingOrderUserAccount.Currency)) :
                                     (execution.LeaveQuantity * (1 - order.LimitPrice) / GetCurrencyMultiplier(pendingOrderUserAccount.Currency));
                                }
                                else
                                {
                                    pendingOrderUserAccount.Balance += order.Side == Side.Buy ?
                                     (execution.LeaveQuantity * order.LimitPrice) * (GetCurrencyMultiplier(order.Symbol.Currency) / GetCurrencyMultiplier(pendingOrderUserAccount.Currency)) :
                                     (execution.LeaveQuantity * (1 - order.LimitPrice)) * (GetCurrencyMultiplier(order.Symbol.Currency) / GetCurrencyMultiplier(pendingOrderUserAccount.Currency));
                                }
                            }

                            List<Execution> currentExecutions = null;
                            if (order.OrderType != Type.Market &&
                                (execution.Status == Status.OpenedPosition ||
                                execution.Status == Status.PartialFilledPosition))
                            {
                                currentExecutions = _executions.Where(e =>  _activeOrders.First(ao => ao.ID == e.OrderID).Account == account &&
                                                                                _activeOrders.First(ao => ao.ID == e.OrderID).Symbol.Name == order.Symbol.Name &&
                                                                                _activeOrders.First(ao => ao.ID == e.OrderID).Side != order.Side &&
                                                                                (e.Status == Status.Filled || e.Status == Status.PartialFilled) &&
                                                                                e.ClosedQuantity != 0 &&
                                                                                e.ClosedQuantity != e.PaidUpQuantity).
                                                        OrderByDescending(e => _activeOrders.First(ao => ao.ID == e.OrderID).Time).ToList();
                            }

                            account = order.Account;
                            //update execution in database
                            SqlConnection connection = new SqlConnection(_connectionString);
                            SqlTransaction transaction = null;
                            try
                            {
                                connection.Open();
                                transaction = connection.BeginTransaction();

                                SqlCommand command = connection.CreateCommand();
                                command.Transaction = transaction;
                                command.CommandText = "UPDATE [Executions] SET [LeaveQuantity] = 0, [CancelledQuantity] = @CancelledQuantity, [Status] = 6 WHERE [OrderID] = @ID";
                                command.Parameters.AddWithValue("ID", request.ID);
                                command.Parameters.AddWithValue("CancelledQuantity", execution.LeaveQuantity);
                                command.ExecuteNonQuery();

                                command = connection.CreateCommand();
                                command.Transaction = transaction;
                                command.CommandText = "UPDATE [Accounts] SET [Balance] = @Balance WHERE [Name] = @AccountName";
                                command.Parameters.AddWithValue("Balance", pendingOrderUserAccount.Balance);
                                command.Parameters.AddWithValue("AccountName", account);
                                command.ExecuteNonQuery();

                                if(currentExecutions != null)
                                {
                                    long quantityToCloseCommon = execution.LeaveQuantity;
                                    currentExecutions.ForEach(ce =>
                                    {
                                        if(quantityToCloseCommon != 0)
                                        {
                                            long currentAvailableQuantity = ce.ClosedQuantity - ce.PaidUpQuantity;
                                            long currentCloseCurrent = Math.Min(currentAvailableQuantity, quantityToCloseCommon);
                                            quantityToCloseCommon -= currentCloseCurrent;

                                            command = connection.CreateCommand();
                                            command.Transaction = transaction;
                                            command.CommandText = "UPDATE [Executions] SET [ClosedQuantity] = [ClosedQuantity] - @ClosedQuantity WHERE [OrderID] = @ID";
                                            command.Parameters.AddWithValue("ID", ce.OrderID);
                                            command.Parameters.AddWithValue("ClosedQuantity", currentCloseCurrent);
                                            command.ExecuteNonQuery();
                                        }
                                    });
                                }

                                transaction.Commit();
                            }
                            catch (Exception ex)
                            {
                                if(transaction != null)
                                {
                                    transaction.Rollback();
                                }
                                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                                error = ex.Message;
                            }
                            if (connection.State == System.Data.ConnectionState.Open)
                            {
                                connection.Close();
                            }
                            if (string.IsNullOrEmpty(error))
                            {   
                                //Update positions in current collection
                                if (currentExecutions != null)
                                {
                                    long quantityToCloseCommon = execution.LeaveQuantity;
                                    currentExecutions.ForEach(ce =>
                                    {
                                        if (quantityToCloseCommon != 0)
                                        {
                                            long currentAvailableQuantity = ce.ClosedQuantity - ce.PaidUpQuantity;
                                            long currentCloseCurrent = Math.Min(currentAvailableQuantity, quantityToCloseCommon);
                                            ce.ClosedQuantity -= currentCloseCurrent;
                                            quantityToCloseCommon -= currentCloseCurrent;
                                        }
                                    });
                                }

                                execution.CancelledQuantity = execution.LeaveQuantity;
                                execution.LeaveQuantity = 0;

                                //remove order and execution from local collection
                                if(execution.FilledQuantity - execution.PaidUpQuantity == 0)
                                {
                                    _activeOrders.Remove(order);
                                    _executions.Remove(execution);
                                }
                                //RecreateOrderAccordingNewPosition(order.Account, order.Symbol);//NEED TESTING
                                UpdateAskBid(order.Symbol);
                                OnCancelOrder(true);
                            }
                        }
                        else
                        {
                            error = "Internal error on server";
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Execution for order does not exist, ID {0}", request.ID)));
                        }                        
                    }
                    else
                    {
                        error = "Internal error on server";
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Invalid order ID, ID {0}", request.ID)));
                    }
                }
            }  
        }

        //Check user balance to create new order according required amount
        public string CheckAccountBalanceForCreateNewOrder(NewOrderRequest orderRequest,long positionQuantity)
        {
            Account orderRequestUserAccount = _users.FirstOrDefault(u => u.Accounts.FirstOrDefault().Name == orderRequest.Account).Accounts.First();
            long leaveMarketQuantity = 0;
            long remainFreeOrders = 0;
            decimal requiredAmount = 0;
            decimal currentBalance = orderRequestUserAccount.Balance;
            long totalQuantity = orderRequest.Quantity + positionQuantity;
            List<Execution> executionsForMarket = null;
            string error = string.Empty;

            //Add all fees
            if (orderRequestUserAccount.TariffPlan.BeginTime.AddDays(30) > DateTime.UtcNow)
            {
                remainFreeOrders = orderRequestUserAccount.TariffPlan.Quantity;
            }
            long feesOrders = totalQuantity - Math.Min(totalQuantity, remainFreeOrders);
            requiredAmount += feesOrders * Fee.TakerFee;

            if(orderRequest.OrderType == Type.Market)
            {
                executionsForMarket = _executions.FindAll(e => _activeOrders.FirstOrDefault(ao => ao.ID == e.OrderID).Side != orderRequest.Side &&
                        _activeOrders.FirstOrDefault(ao => ao.ID == e.OrderID).Symbol.Name == orderRequest.Symbol.Name &&
                        (e.Status == Status.Opened ||
                        e.Status == Status.PartialFilled ||
                        e.Status == Status.OpenedPosition ||
                        e.Status == Status.PartialFilledPosition));
                var result = totalQuantity - executionsForMarket.Sum(e => e.LeaveQuantity);
                if (result > 0)
                {
                    error = string.Format("There is not enough orders to match market order. Lack of {0} orders", result);
                    Log.WriteApplicationInfo(error, orderRequestUserAccount.Name); 
                }
            }
            if (orderRequest.Quantity > 0)
            {
                if (orderRequest.OrderType == Type.Limit)
                {
                        decimal price = (orderRequest.Side == Side.Buy) ? orderRequest.LimitPrice : (1 - orderRequest.LimitPrice);
                        //currentBalance -= requiredAmount;
                        long maxQuantity = (long)(currentBalance / price);
                        if(orderRequest.Quantity - maxQuantity > 0)
                        {
                            error = string.Format("You don't have money enough to create new orde. {0} orders is availiable", maxQuantity);
                            Log.WriteApplicationInfo(error, orderRequestUserAccount.Name); 
                        }
                }
                else if (orderRequest.OrderType == Type.Market)
                {
                    leaveMarketQuantity = orderRequest.Quantity;
                    //string result = "";
                    //currentBalance -= requiredAmount;
                    executionsForMarket.ForEach(efm =>
                    {
                        if(leaveMarketQuantity > 0)
                        {
                            decimal price = (orderRequest.Side == Side.Buy) ? _activeOrders.FirstOrDefault(ao => ao.ID == efm.OrderID).LimitPrice : 1 - _activeOrders.FirstOrDefault(ao => ao.ID == efm.OrderID).LimitPrice;
                            var maxQuantity = (int)(currentBalance / price);
                            if(leaveMarketQuantity - maxQuantity > 0)
                            {
                                error = string.Format("You don't have money enough to create new order. {0} contracts is avilable", maxQuantity);
                                Log.WriteApplicationInfo(error, orderRequestUserAccount.Name); 
                            }
                            if (error == string.Empty)
                            {
                                currentBalance -= price * Math.Min(leaveMarketQuantity, efm.LeaveQuantity);
                                leaveMarketQuantity -= Math.Min(leaveMarketQuantity, efm.LeaveQuantity);
                            }
                        }
                    });
                    if(!string.IsNullOrEmpty(error))
                    {
                        return error;
                    }
                }
            }
            else
            {
                if(currentBalance - requiredAmount < 0)
                {
                    error = "You don't have money enough to create new order";
                    Log.WriteApplicationInfo(error, orderRequestUserAccount.Name);  
                }
            }
            return error;
        }

        private string ValidateNewOrderRequest(NewOrderRequest request)
        {
            string error = "";
            //check is order id unique
            SqlConnection connection = new SqlConnection(_connectionString);
            SqlDataReader reader = null;
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM [Orders] WHERE [ID] = @ID";
                command.Parameters.AddWithValue("ID", request.ID);
                reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    error = "Invalid order ID. Must be unique.";
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                error = "Internal error on server";
            }
            if (reader != null)
            {
                reader.Close();
            }
            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            if (string.IsNullOrEmpty(error))
            {
                ExchangeSettingsEx exchangeSettings = null;
                lock (_exchanges)
                {
                    //check order exchange
                    exchangeSettings = _exchanges.FirstOrDefault(e => e.Name == request.Symbol.Exchange);
                }
                if (exchangeSettings != null)
                {
                    DateTime utcNow = DateTime.UtcNow;
                    //check is an order sent in exchange trading hours
                    if (utcNow >= exchangeSettings.StartDate && utcNow < exchangeSettings.EndDate && exchangeSettings.Closed == false)
                    {
                        if (!string.IsNullOrEmpty(request.ID))
                        {
                            lock (_tradingLocker)
                            {
                                //find user in local collection
                                if (_users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name.ToUpper() == request.Account.ToUpper()) != null) != null)
                                {
                                    //check is the symbol valid
                                    if (exchangeSettings.Symbols.FirstOrDefault(item => item.Symbol.Equals(request.Symbol)) != null)
                                    {
                                        //check order stop/limit price according to order type
                                        if ((request.OrderType == Type.Market && request.LimitPrice == 0 && request.StopPrice == 0)
                                            || (request.OrderType == Type.Limit && request.LimitPrice != 0 && request.StopPrice == 0)
                                            || (request.OrderType == Type.Stop && request.StopPrice != 0 && request.LimitPrice == 0)
                                            || (request.OrderType == Type.StopLimit && request.StopPrice != 0 && request.LimitPrice != 0))
                                        {
                                            //check order quantity
                                            if (request.Quantity > 0)
                                            {
                                                //check order TimeInForce and expiration date
                                                if (!(request.TimeInForce == TimeInForce.GTD && (request.ExpirationDate == DateTime.MinValue || request.ExpirationDate.ToUniversalTime() <= DateTime.UtcNow)))
                                                {
                                                    var userAccount = _users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name == request.Account) != null).Accounts.FirstOrDefault(a => a.Name == request.Account);
                                                    //check order user/account
                                                    if (userAccount != null)
                                                    {
                                                        if (_currencies.FirstOrDefault(item => item.Name == userAccount.Currency) != null)
                                                        {
                                                            Tick lastTick = GetLastTick(request.Symbol);
                                                            decimal stopPrice = 0;
                                                            decimal limitPrice = 0;
                                                            if (exchangeSettings.CommonCurrency)
                                                            {
                                                                limitPrice = request.LimitPrice * GetCurrencyMultiplier(userAccount.Currency);
                                                                stopPrice = request.StopPrice * GetCurrencyMultiplier(userAccount.Currency);
                                                            }
                                                            else
                                                            {
                                                                limitPrice = request.LimitPrice;
                                                                stopPrice = request.StopPrice;
                                                            }
                                                            //check stop order price value
                                                            if (lastTick.Price > 0 && (request.OrderType == Type.Stop || request.OrderType == Type.StopLimit))
                                                            {
                                                                if ((request.Side == Side.Buy && stopPrice <= lastTick.Price) || (request.Side == Side.Sell && stopPrice >= lastTick.Price))
                                                                {
                                                                    error = string.Format("Invalid order stop price, ID {0}", request.ID);
                                                                    Log.WriteApplicationInfo(error);
                                                                }
                                                            }
                                                            //if (string.IsNullOrEmpty(error))
                                                            //{                                                                    
                                                            //    //check user balance for buy orders
                                                            //    error = CheckBalance(exchangeSettings.CommonCurrency, userAccount, request, lastTick, stopPrice, limitPrice);
                                                            //    //if (request.Side == Side.Buy)
                                                            //    //{
                                                            //    //    error = CheckBalance(exchangeSettings.CommonCurrency, userAccount, request, lastTick, stopPrice, limitPrice);
                                                            //    //}
                                                            //}
                                                        }
                                                        else
                                                        {
                                                            error = string.Format("Invalid currency, ID {0}", request.ID);
                                                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
                                                        }
                                                    }
                                                    else
                                                    {
                                                        error = string.Format("Invalid order account for order, ID {0}", request.ID);
                                                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
                                                    }
                                                }
                                                else
                                                {
                                                    error = string.Format("Invalid order expiration date, ID {0}", request.ID);
                                                    Log.WriteApplicationInfo(error);
                                                }
                                            }
                                            else
                                            {
                                                error = string.Format("Invalid order quantity, ID {0}", request.ID);
                                                Log.WriteApplicationInfo(error);
                                            }
                                        }
                                        else
                                        {
                                            error = string.Format("Invalid order price, ID {0}", request.ID);
                                            Log.WriteApplicationInfo(error);
                                        }
                                    }
                                    else
                                    {
                                        error = string.Format("Invalid symbol, ID {0}", request.ID);
                                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
                                    }
                                }
                                else
                                {
                                    error = string.Format("Invalid account, ID {0}", request.ID);
                                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
                                }
                            }
                        }
                        else
                        {
                            error = string.Format("Invalid order ID, ID {0}", request.ID);
                            Log.WriteApplicationInfo(error);
                        }
                    }
                    else
                    {
                        error = string.Format("Exchange is closed, ID {0}", request.ID);
                        Log.WriteApplicationInfo(error);
                    }
                }
                else
                {
                    error = string.Format("Invalid exchange, ID {0}", request.ID);
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
                }
            }
            return error;
        }

        private string ValidateCancelOrderRequest(CancelOrderRequest request)
        {
            string error = "";
            NewOrderRequest order = null;
            lock (_tradingLocker)
            {
                //find order to cancel in local collection
                order = _activeOrders.FirstOrDefault(o => o.ID == request.ID);
                if (order == null)
                {
                    order = _stopOorders.FirstOrDefault(o => o.ID == request.ID);
                }
            }
            if (order != null)
            {
                var execution = _executions.FirstOrDefault(e => e.OrderID == request.ID);
                if (execution != null)
                {
                    lock (_exchanges)
                    {
                        var exchangeSettings = _exchanges.FirstOrDefault(e => e.Name == order.Symbol.Exchange);
                        if (exchangeSettings != null)
                        {
                            DateTime utcNow = DateTime.UtcNow;
                            if (utcNow < exchangeSettings.StartDate || utcNow >= exchangeSettings.EndDate)
                            {
                                error = string.Format("Exchange is closed, ID {0}", request.ID);
                                Log.WriteApplicationInfo(error);
                            }
                        }
                        else
                        {
                            error = string.Format("Invalid exchange, ID {0}", request.ID);
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
                        }
                    }
                }
                else
                {
                    error = string.Format("Execution for order does not exist, ID {0}", request.ID);
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
                }
            }
            else
            {
                error = string.Format("Invalid order ID, ID {0}", request.ID);
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(error));
            }           
            return error;
        }

        private void ProcessOrderRequest(NewOrderRequest pendingOrder)
        {
            processedAccounts = new List<Account>();
            bool convertToCommonCurrency = _exchanges.First(e => e.Name == pendingOrder.Symbol.Exchange).CommonCurrency;
            //list of current order internal executions
            List<SingleExecution> executions = new List<SingleExecution>();
            try
            {
                lock (_tradingLocker)
                {
                    //find new order user account
                    var pendingOrderUserAccount = _users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name == pendingOrder.Account) != null).Accounts.FirstOrDefault(a => a.Name == pendingOrder.Account);                    
                    if (pendingOrderUserAccount != null)
                    {
                        processedAccounts.Add(pendingOrderUserAccount);
                        //find new order execution
                        var pendingOrderExecution = _executions.FirstOrDefault(e => e.OrderID == pendingOrder.ID);
                        if (pendingOrderExecution != null)
                        {
                            List<NewOrderRequest> acceptedOrders = null;
                            //find orders with opposite side in local orders collection 
                            if (pendingOrder.Side == Side.Buy)
                            {
                                acceptedOrders = _activeOrders.Where(o => 
                                        o.Symbol.Equals(pendingOrder.Symbol) &&
                                        (_executions.First(e => e.OrderID == o.ID).Status == Status.Opened ||
                                        _executions.First(e => e.OrderID == o.ID).Status == Status.PartialFilled ||
                                        _executions.First(e => e.OrderID == o.ID).Status == Status.OpenedPosition ||
                                        _executions.First(e => e.OrderID == o.ID).Status == Status.PartialFilledPosition) &&
                                        o.Side == Side.Sell).OrderBy(o => o.LimitPrice).OrderBy(o => o.Time).OrderByDescending(o => _executions.First(e => e.OrderID == o.ID).Status).ToList();
                            }
                            else
                            {
                                acceptedOrders = _activeOrders.Where(o =>
                                        o.Symbol.Equals(pendingOrder.Symbol) &&
                                        (_executions.First(e => e.OrderID == o.ID).Status == Status.Opened ||
                                        _executions.First(e => e.OrderID == o.ID).Status == Status.PartialFilled ||
                                        _executions.First(e => e.OrderID == o.ID).Status == Status.OpenedPosition ||
                                        _executions.First(e => e.OrderID == o.ID).Status == Status.PartialFilledPosition) &&
                                        o.Side == Side.Buy).OrderByDescending(o => o.LimitPrice).OrderBy(o => o.Time).OrderByDescending(o => _executions.First(e => e.OrderID == o.ID).Status).ToList();
                            }
                            //needed quantity to fill of new order
                            long remainingPendingOrderQuantity = pendingOrderExecution.LeaveQuantity;
                            //pending order limit price converted to currency multiplier
                            decimal pendingOrderLimitPrice = 0;
                            if (convertToCommonCurrency)
                            {
                                pendingOrderLimitPrice = pendingOrder.LimitPrice * GetCurrencyMultiplier(pendingOrderUserAccount.Currency);
                            }
                            else
                            {
                                pendingOrderLimitPrice = pendingOrder.LimitPrice;
                            }
                            acceptedOrders.ForEach(ao =>
                            {
                                var acceptedOrderExecution = _executions.FirstOrDefault(e => e.OrderID == ao.ID);
                                if (acceptedOrderExecution != null)
                                {
                                    //find existing order user account
                                    var acceptedOrderUserAccount = _users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name == ao.Account) != null).Accounts.FirstOrDefault(a => a.Name == ao.Account);
                                    if (acceptedOrderUserAccount != null)
                                    {
                                        //needed quantity to fill of existing order
                                        long remainingAcceptedOrderQuantity = acceptedOrderExecution.LeaveQuantity;
                                        if (remainingAcceptedOrderQuantity > 0 && remainingPendingOrderQuantity > 0)
                                        {
                                            //accepted order limit price converted to currency multiplier
                                            decimal acceptedOrderLimitPrice = 0;
                                            if (convertToCommonCurrency)
                                            {
                                                acceptedOrderLimitPrice = ao.LimitPrice * GetCurrencyMultiplier(acceptedOrderUserAccount.Currency);
                                            }
                                            else
                                            {
                                                acceptedOrderLimitPrice = ao.LimitPrice;
                                            }
                                            //fill price
                                            decimal price = 0;
                                            //fill quantity
                                            long quantity = 0;
                                            if (pendingOrder.Side == Side.Buy) 
                                            {
                                                //first check market and activated stop orders
                                                if (pendingOrder.OrderType == Type.Market || pendingOrder.OrderType == Type.Stop)
                                                {
                                                    //fill price defined by limit price
                                                    //fill quantity is a minimum value of remaining quantity of 2 orders
                                                    if (ao.OrderType == Type.Limit || ao.OrderType == Type.StopLimit)
                                                    {
                                                        price = acceptedOrderLimitPrice;
                                                        quantity = Math.Min(remainingPendingOrderQuantity, remainingAcceptedOrderQuantity);
                                                    }
                                                }
                                                //second check limit and activated stop limit orders
                                                else if (pendingOrder.OrderType == Type.Limit || pendingOrder.OrderType == Type.StopLimit)
                                                {
                                                    //fill price defined by limit price
                                                    //fill quantity is a minimum value of remaining quantity of 2 orders
                                                    if (ao.OrderType == Type.Market || ao.OrderType == Type.Stop)
                                                    {
                                                        price = pendingOrderLimitPrice;
                                                        quantity = Math.Min(remainingPendingOrderQuantity, remainingAcceptedOrderQuantity);
                                                    }
                                                    //fill price depends on both orders limit by limit price
                                                    //fill quantity is a minimum value of remaining quantity of 2 orders
                                                    else if ((ao.OrderType == Type.Limit || ao.OrderType == Type.StopLimit) && (acceptedOrderLimitPrice <= pendingOrderLimitPrice))
                                                    {
                                                        price = acceptedOrderLimitPrice;
                                                        quantity = Math.Min(remainingPendingOrderQuantity, remainingAcceptedOrderQuantity);
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                //first check market and activated stop orders
                                                if (pendingOrder.OrderType == Type.Market || pendingOrder.OrderType == Type.Stop)
                                                {
                                                    //fill price defined by limit price
                                                    //fill quantity is a minimum value of remaining quantity of 2 orders
                                                    if (ao.OrderType == Type.Limit || ao.OrderType == Type.StopLimit)
                                                    {
                                                        price = acceptedOrderLimitPrice;
                                                        quantity = Math.Min(remainingPendingOrderQuantity, remainingAcceptedOrderQuantity);
                                                    }
                                                }
                                                //second check limit and activated stop limit orders
                                                else if (pendingOrder.OrderType == Type.Limit || pendingOrder.OrderType == Type.StopLimit)
                                                {
                                                    //fill price defined by limit price
                                                    //fill quantity is a minimum value of remaining quantity of 2 orders
                                                    if (ao.OrderType == Type.Market || ao.OrderType == Type.Stop)
                                                    {
                                                        price = pendingOrderLimitPrice;
                                                        quantity = Math.Min(remainingPendingOrderQuantity, remainingAcceptedOrderQuantity);
                                                    }
                                                    //fill price depends on both orders limit by limit price
                                                    //fill quantity is a minimum value of remaining quantity of 2 orders
                                                    else if ((ao.OrderType == Type.Limit || ao.OrderType == Type.StopLimit) && (acceptedOrderLimitPrice >= pendingOrderLimitPrice))
                                                    {
                                                        price = acceptedOrderLimitPrice;
                                                        quantity = Math.Min(remainingPendingOrderQuantity, remainingAcceptedOrderQuantity);
                                                    }
                                                }
                                            }
                                            if (quantity > 0)
                                            {
                                                long pendingOrderQuantity = quantity;
                                                if (pendingOrder.Side == Side.Buy)
                                                {
                                                    //check user balance for buy order converted to user account currency
                                                    if (convertToCommonCurrency)
                                                    {
                                                        pendingOrderQuantity = Math.Min((long)(pendingOrderUserAccount.Balance / (price / GetCurrencyMultiplier(pendingOrderUserAccount.Currency))), pendingOrderQuantity);
                                                    }
                                                    else
                                                    {
                                                        pendingOrderQuantity = Math.Min((long)(pendingOrderUserAccount.Balance / (price * (GetCurrencyMultiplier(pendingOrder.Symbol.Currency) / GetCurrencyMultiplier(pendingOrderUserAccount.Currency)))), pendingOrderQuantity);
                                                    }
                                                }
                                                long acceptedOrderQuantity = quantity;
                                                if (ao.Side == Side.Buy)
                                                {
                                                    //check user balance for buy order  converted to user account currency
                                                    if (convertToCommonCurrency)
                                                    {
                                                        acceptedOrderQuantity = Math.Min((long)(acceptedOrderUserAccount.Balance / (price / GetCurrencyMultiplier(acceptedOrderUserAccount.Currency))), acceptedOrderQuantity);
                                                    }
                                                    else
                                                    {
                                                        acceptedOrderQuantity = Math.Min((long)(acceptedOrderUserAccount.Balance / (price * (GetCurrencyMultiplier(pendingOrder.Symbol.Currency) / GetCurrencyMultiplier(acceptedOrderUserAccount.Currency)))), acceptedOrderQuantity);
                                                    }
                                                }
                                                //check filled quantity for AON order
                                                if ((pendingOrderQuantity > 0) && (acceptedOrderQuantity > 0) && ((ao.TimeInForce != TimeInForce.AON) || (ao.TimeInForce == TimeInForce.AON && quantity == ao.Quantity)))
                                                {
                                                    executions.Add(new SingleExecution() { NewOrderID = pendingOrder.ID, ExistingOrderID = ao.ID, Price = price, Quantity = Math.Min(pendingOrderQuantity, acceptedOrderQuantity) });
                                                    remainingPendingOrderQuantity -= Math.Min(pendingOrderQuantity, acceptedOrderQuantity);
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Account for order {0} does not exist", ao.ID)));
                                    }
                                }
                                else
                                {
                                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Execution for order {0} does not exist", ao.ID)));
                                }
                            });
                            //check fill quantity for FOK order
                            if (pendingOrder.TimeInForce == TimeInForce.FOK && executions.Sum(e => e.Quantity) < pendingOrder.Quantity)
                            {
                                CancelOrder(new CancelOrderRequest() { ID = pendingOrder.ID }, false);
                            }
                            else if ((pendingOrder.TimeInForce != TimeInForce.AON) || (pendingOrder.TimeInForce == TimeInForce.AON && executions.Sum(e => e.Quantity) == pendingOrder.Quantity))
                            {
                                DateTime matchTime = DateTime.UtcNow;
                                var lastQuote = GetLastTick(pendingOrder.Symbol);
                                
                                #region update bid/ask values and send tick - NOT USED
                                //update bid/ask values and send tick
                                if (pendingOrder.OrderType == Type.Limit)
                                {
                                    //if (pendingOrder.Side == Side.Buy)
                                    if (pendingOrder.Side == Side.Sell)
                                    {
                                        lastQuote.Ask = pendingOrderLimitPrice;
                                        lastQuote.AskSize = pendingOrder.Quantity;
                                    }
                                    else
                                    {
                                        lastQuote.Bid = pendingOrderLimitPrice;
                                        lastQuote.BidSize = pendingOrder.Quantity;
                                    }
                                    lastQuote.Time = matchTime;
                                    //BrodcastTick(lastQuote, false);
                                }
                                #endregion

                                List<NewOrderRequest> activatedOrders = new List<NewOrderRequest>();
                                bool catched = false;

                                executions.ForEach(e =>
                                {
                                    decimal paymentAltBet = 0;
                                    //find existing order user account
                                    var acceptedOrderUserAccount = _activeOrders.Where(o => o.ID == e.ExistingOrderID).Select(o => _users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name == o.Account) != null).Accounts.FirstOrDefault(a => a.Name == o.Account)).FirstOrDefault();
                                    if (acceptedOrderUserAccount != null)
                                    {
                                        processedAccounts.Add(acceptedOrderUserAccount);

                                        UpdatePriceDirection(pendingOrder.Symbol, e.Price);
                                        UpdateLastPrice(pendingOrder.Symbol, pendingOrder.Side, e.Price);

                                        decimal gainPendingUser = 0;
                                        List<Execution> pendingFilledExecutions = null;
                                        //get pending user fees
                                        long pendingUserRemainFreeOrders = 0;
                                        if (pendingOrderUserAccount.TariffPlan.BeginTime.AddDays(30) > DateTime.UtcNow)
                                        {
                                            pendingUserRemainFreeOrders = pendingOrderUserAccount.TariffPlan.Quantity;
                                        }
                                        long pendingFeesOrders = e.Quantity - Math.Min(e.Quantity, pendingUserRemainFreeOrders);
                                        pendingOrderUserAccount.TariffPlan.Quantity -= (int)Math.Min(e.Quantity, pendingUserRemainFreeOrders);
                                        if (pendingFeesOrders > 0)
                                        {
                                            //gainPendingUser -= pendingFeesOrders * Fee.TakerFee;
                                            //paymentAltBet += pendingFeesOrders * Fee.TakerFee;
                                        }

                                        //get pending user opened positions and count gain/loss
                                        if (pendingOrderExecution.Status == Status.OpenedPosition || pendingOrderExecution.Status == Status.PartialFilledPosition)
                                        {
                                            var quantityForFilled = e.Quantity;

                                            pendingFilledExecutions = _executions.FindAll(ex =>
                                                (ex.Status == Status.Filled || ex.Status == Status.PartialFilled) &&
                                                ex.ClosedQuantity > ex.PaidUpQuantity &&
                                                _activeOrders.First(ao => ao.ID == ex.OrderID).Account == pendingOrderUserAccount.Name &&
                                                _activeOrders.First(ao => ao.ID == ex.OrderID).Side != pendingOrder.Side).OrderBy(ex => _activeOrders.First(ao => ao.ID == ex.OrderID).Time).ToList();

                                            pendingFilledExecutions.ForEach(fe =>
                                            {
                                                var currentOrderRequiredQuantity = fe.ClosedQuantity - fe.PaidUpQuantity;
                                                fe.PaidUpQuantity += Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                pendingOrderExecution.PaidUpQuantity += Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                if (pendingOrder.Side == Side.Sell)
                                                {
                                                    gainPendingUser += e.Price * Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                }
                                                else
                                                {
                                                    gainPendingUser += (1 - e.Price) * Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                }
                                                quantityForFilled -= Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                            });
                                        }

                                        if (pendingOrderExecution.Status == Status.Opened || pendingOrderExecution.Status == Status.PartialFilled)
                                        {
                                            gainPendingUser -= pendingOrder.Side == Side.Buy ? e.Quantity * e.Price : e.Quantity * (1 - e.Price);
                                        }

                                        pendingOrderUserAccount.Balance += gainPendingUser;
                                        //update new order execution in local collection
                                        pendingOrderExecution.Time = matchTime;
                                        pendingOrderExecution.LastPrice = e.Price;
                                        pendingOrderExecution.AverrageFillPrice = 0m;
                                        pendingOrderExecution.LastQuantity = e.Quantity;
                                        pendingOrderExecution.FilledQuantity += e.Quantity;
                                        pendingOrderExecution.LeaveQuantity -= e.Quantity;

                                        if (pendingOrderExecution.Status == Status.OpenedPosition || pendingOrderExecution.Status == Status.PartialFilledPosition)
                                        {
                                            pendingOrderExecution.Status = pendingOrderExecution.LeaveQuantity == 0 ? Status.FilledPosition : Status.PartialFilledPosition;
                                        }
                                        else
                                        {
                                            pendingOrderExecution.Status = pendingOrderExecution.LeaveQuantity == 0 ? Status.Filled : Status.PartialFilled;
                                        }

                                        //update existing order execution in local collection
                                        var acceptedOrderExecution = _executions.First(execution => execution.OrderID == e.ExistingOrderID);
                                        decimal gainAcceptedUser = 0;
                                        List<Execution> acceptedFilledExecutions = null;
                                        //get accepted user fees
                                        long acceptedUserRemainFreeOrders = 0;
                                        if (acceptedOrderUserAccount.TariffPlan.BeginTime.AddDays(30) > DateTime.UtcNow)
                                        {
                                            acceptedUserRemainFreeOrders = acceptedOrderUserAccount.TariffPlan.Quantity;
                                        }
                                        long acceptedFeesOrders = e.Quantity - Math.Min(e.Quantity, acceptedUserRemainFreeOrders);
                                        acceptedOrderUserAccount.TariffPlan.Quantity -= (int)Math.Min(e.Quantity, acceptedUserRemainFreeOrders);
                                        if (acceptedFeesOrders > 0)
                                        {
                                            //gainAcceptedUser += acceptedFeesOrders * Fee.MakerFee;
                                            //paymentAltBet -= acceptedFeesOrders * Fee.MakerFee;
                                        }

                                        //get accepted user opened positions and count gain/loss
                                        if (acceptedOrderExecution.Status == Status.OpenedPosition || acceptedOrderExecution.Status == Status.PartialFilledPosition)
                                        {
                                            var quantityForFilled = e.Quantity;

                                            acceptedFilledExecutions = _executions.FindAll(ex =>
                                                (ex.Status == Status.Filled || ex.Status == Status.PartialFilled) &&
                                                ex.ClosedQuantity > ex.PaidUpQuantity &&
                                                _activeOrders.First(ao => ao.ID == ex.OrderID).Account == acceptedOrderUserAccount.Name &&
                                                _activeOrders.First(ao => ao.ID == ex.OrderID).Side != _activeOrders.First(ao => ao.ID == e.ExistingOrderID).Side
                                                ).OrderBy(ex => _activeOrders.First(ao => ao.ID == ex.OrderID).Time).ToList();

                                            acceptedFilledExecutions.ForEach(fe =>
                                            {
                                                var currentOrderRequiredQuantity = fe.ClosedQuantity - fe.PaidUpQuantity;
                                                fe.PaidUpQuantity += Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                acceptedOrderExecution.PaidUpQuantity += Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                if (_activeOrders.First(ao => ao.ID == e.ExistingOrderID).Side == Side.Sell)
                                                {
                                                    gainAcceptedUser += e.Price * Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                }
                                                else
                                                {
                                                    gainAcceptedUser += (1 - e.Price) * Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                                }
                                                quantityForFilled -= Math.Min(currentOrderRequiredQuantity, quantityForFilled);
                                            });
                                        }
                                        acceptedOrderUserAccount.Balance += gainAcceptedUser;

                                        acceptedOrderExecution.Time = matchTime;
                                        acceptedOrderExecution.LastPrice = e.Price;
                                        acceptedOrderExecution.AverrageFillPrice = 0m;
                                        acceptedOrderExecution.LastQuantity = e.Quantity;
                                        acceptedOrderExecution.FilledQuantity += e.Quantity;
                                        acceptedOrderExecution.LeaveQuantity -= e.Quantity;

                                        if (acceptedOrderExecution.Status == Status.OpenedPosition || acceptedOrderExecution.Status == Status.PartialFilledPosition)
                                        {
                                            acceptedOrderExecution.Status = acceptedOrderExecution.LeaveQuantity == 0 ? Status.FilledPosition : Status.PartialFilledPosition;
                                        }
                                        else
                                        {
                                            acceptedOrderExecution.Status = acceptedOrderExecution.LeaveQuantity == 0 ? Status.Filled : Status.PartialFilled;
                                        }

                                        _users.FirstOrDefault(u => u.Email == "payments@alt.bet").Accounts.First().Balance += paymentAltBet;

                                        //update last price/quantity values and send tick
                                        lastQuote = GetLastTick(pendingOrder.Symbol);
                                        lastQuote.Time = matchTime;
                                        lastQuote.Price = e.Price;
                                        lastQuote.Volume = e.Quantity;
                                        lastQuote.Side = Convert.ToBoolean(pendingOrder.Side);
                                        BrodcastTick(new Tick(pendingOrder.Symbol, lastQuote.Time, lastQuote.Price, lastQuote.Volume, lastQuote.Bid, lastQuote.BidSize, lastQuote.Ask, lastQuote.AskSize, lastQuote.Side), true);
                                        bool savedChanges = false;
                                        //save executions and accounts changes in DB in single transaction
                                        using (SqlConnection connection = new SqlConnection(_connectionString))
                                        {
                                            SqlTransaction transaction = null;
                                            try
                                            {
                                                connection.Open();
                                                //update new order execution in DB
                                                transaction = connection.BeginTransaction();
                                                SqlCommand command = connection.CreateCommand();
                                                command.Transaction = transaction;
                                                command.CommandText = "UPDATE [Executions] SET [Time] = @Time, [PaidUpQuantity] = @PaidUpQuantity, [LastPrice] = @LastPrice, [LastQuantity] = @LastQuantity, [FilledQuantity] = @FilledQuantity, [AverrageFillPrice] = @AverrageFillPrice, [LeaveQuantity] = @LeaveQuantity, [Status] = @Status WHERE [OrderID] = @OrderID";
                                                command.Parameters.AddWithValue("OrderID", pendingOrderExecution.OrderID);
                                                command.Parameters.AddWithValue("Time", pendingOrderExecution.Time);
                                                command.Parameters.AddWithValue("PaidUpQuantity", pendingOrderExecution.PaidUpQuantity);
                                                command.Parameters.AddWithValue("LastPrice", pendingOrderExecution.LastPrice);
                                                command.Parameters.AddWithValue("LastQuantity", pendingOrderExecution.LastQuantity);
                                                command.Parameters.AddWithValue("FilledQuantity", pendingOrderExecution.FilledQuantity);
                                                command.Parameters.AddWithValue("AverrageFillPrice", pendingOrderExecution.AverrageFillPrice);
                                                command.Parameters.AddWithValue("LeaveQuantity", pendingOrderExecution.LeaveQuantity);
                                                command.Parameters.AddWithValue("Status", (byte)pendingOrderExecution.Status);
                                                command.ExecuteNonQuery();
                                                //update existing order execution in DB
                                                command = connection.CreateCommand();
                                                command.Transaction = transaction;
                                                command.CommandText = "UPDATE [Executions] SET [Time] = @Time, [PaidUpQuantity] = @PaidUpQuantity, [LastPrice] = @LastPrice, [LastQuantity] = @LastQuantity, [FilledQuantity] = @FilledQuantity, [AverrageFillPrice] = @AverrageFillPrice, [LeaveQuantity] = @LeaveQuantity, [Status] = @Status WHERE [OrderID] = @OrderID";
                                                command.Parameters.AddWithValue("OrderID", acceptedOrderExecution.OrderID);
                                                command.Parameters.AddWithValue("Time", acceptedOrderExecution.Time);
                                                command.Parameters.AddWithValue("PaidUpQuantity", acceptedOrderExecution.PaidUpQuantity);
                                                command.Parameters.AddWithValue("LastPrice", acceptedOrderExecution.LastPrice);
                                                command.Parameters.AddWithValue("LastQuantity", acceptedOrderExecution.LastQuantity);
                                                command.Parameters.AddWithValue("FilledQuantity", acceptedOrderExecution.FilledQuantity);
                                                command.Parameters.AddWithValue("AverrageFillPrice", acceptedOrderExecution.AverrageFillPrice);
                                                command.Parameters.AddWithValue("LeaveQuantity", acceptedOrderExecution.LeaveQuantity);
                                                command.Parameters.AddWithValue("Status", (byte)acceptedOrderExecution.Status);
                                                command.ExecuteNonQuery();
                                                if (pendingFilledExecutions != null)
                                                {
                                                    pendingFilledExecutions.ForEach(x =>
                                                    {
                                                        command = connection.CreateCommand();
                                                        command.Transaction = transaction;
                                                        command.CommandText = "UPDATE [Executions] SET [Time] = @Time, [PaidUpQuantity] = @PaidUpQuantity, [LastPrice] = @LastPrice, [LastQuantity] = @LastQuantity, [FilledQuantity] = @FilledQuantity, [AverrageFillPrice] = @AverrageFillPrice, [LeaveQuantity] = @LeaveQuantity, [Status] = @Status WHERE [OrderID] = @OrderID";
                                                        command.Parameters.AddWithValue("OrderID", x.OrderID);
                                                        command.Parameters.AddWithValue("Time", x.Time);
                                                        command.Parameters.AddWithValue("PaidUpQuantity", x.PaidUpQuantity);
                                                        command.Parameters.AddWithValue("LastPrice", x.LastPrice);
                                                        command.Parameters.AddWithValue("LastQuantity", x.LastQuantity);
                                                        command.Parameters.AddWithValue("FilledQuantity", x.FilledQuantity);
                                                        command.Parameters.AddWithValue("AverrageFillPrice", x.AverrageFillPrice);
                                                        command.Parameters.AddWithValue("LeaveQuantity", x.LeaveQuantity);
                                                        command.Parameters.AddWithValue("Status", (byte)x.Status);
                                                        command.ExecuteNonQuery();
                                                    });
                                                }
                                                if (acceptedFilledExecutions != null)
                                                {
                                                    acceptedFilledExecutions.ForEach(x =>
                                                    {
                                                        command = connection.CreateCommand();
                                                        command.Transaction = transaction;
                                                        command.CommandText = "UPDATE [Executions] SET [Time] = @Time, [PaidUpQuantity] = @PaidUpQuantity, [LastPrice] = @LastPrice, [LastQuantity] = @LastQuantity, [FilledQuantity] = @FilledQuantity, [AverrageFillPrice] = @AverrageFillPrice, [LeaveQuantity] = @LeaveQuantity, [Status] = @Status WHERE [OrderID] = @OrderID";
                                                        command.Parameters.AddWithValue("OrderID", x.OrderID);
                                                        command.Parameters.AddWithValue("Time", x.Time);
                                                        command.Parameters.AddWithValue("PaidUpQuantity", x.PaidUpQuantity);
                                                        command.Parameters.AddWithValue("LastPrice", x.LastPrice);
                                                        command.Parameters.AddWithValue("LastQuantity", x.LastQuantity);
                                                        command.Parameters.AddWithValue("FilledQuantity", x.FilledQuantity);
                                                        command.Parameters.AddWithValue("AverrageFillPrice", x.AverrageFillPrice);
                                                        command.Parameters.AddWithValue("LeaveQuantity", x.LeaveQuantity);
                                                        command.Parameters.AddWithValue("Status", (byte)x.Status);
                                                        command.ExecuteNonQuery();
                                                    });
                                                }

                                                //update new order account balance in DB
                                                command = connection.CreateCommand();
                                                command.Transaction = transaction;
                                                command.CommandText = "UPDATE [Accounts] SET [Balance] = @Balance WHERE [Name] = @Name";
                                                command.Parameters.AddWithValue("Name", pendingOrderUserAccount.Name);
                                                command.Parameters.AddWithValue("Balance", pendingOrderUserAccount.Balance);
                                                command.ExecuteNonQuery();

                                                //update existing order account balance in DB
                                                command = connection.CreateCommand();
                                                command.Transaction = transaction;
                                                command.CommandText = "UPDATE [Accounts] SET [Balance] = @Balance WHERE [Name] = @Name";
                                                command.Parameters.AddWithValue("Name", acceptedOrderUserAccount.Name);
                                                command.Parameters.AddWithValue("Balance", acceptedOrderUserAccount.Balance);
                                                command.ExecuteNonQuery();

                                                //update alt.bet payments balance in DB
                                                command = connection.CreateCommand();
                                                command.Transaction = transaction;
                                                command.CommandText = "UPDATE [Accounts] SET [Balance] = [Balance] + @Balance WHERE [Name] = @Name";
                                                command.Parameters.AddWithValue("Name", "payments");
                                                command.Parameters.AddWithValue("Balance", paymentAltBet);
                                                command.ExecuteNonQuery();

                                                //insert execution
                                                command = connection.CreateCommand();
                                                command.Transaction = transaction;
                                                command.CommandText = "INSERT INTO [PartialExecutions] VALUES (@ID, @Time, @ExistingOrder, @MakerAccount, @NewOrder, @TakerAccount, @Price, @Quantity)";
                                                command.Parameters.AddWithValue("ID", Guid.NewGuid());
                                                command.Parameters.AddWithValue("Time", DateTime.UtcNow);
                                                command.Parameters.AddWithValue("ExistingOrder", e.ExistingOrderID);
                                                command.Parameters.AddWithValue("MakerAccount", acceptedOrderUserAccount.Name);
                                                command.Parameters.AddWithValue("NewOrder", e.NewOrderID);
                                                command.Parameters.AddWithValue("TakerAccount", pendingOrderUserAccount.Name);
                                                command.Parameters.AddWithValue("Price", e.Price);
                                                command.Parameters.AddWithValue("Quantity", e.Quantity);
                                                command.ExecuteNonQuery();

                                                transaction.Commit();
                                                savedChanges = true;
                                            }
                                            catch (Exception ex)
                                            {
                                                catched = true;
                                                if (transaction != null)
                                                {
                                                    transaction.Rollback();
                                                }
                                                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);

                                            }
                                            if (connection.State == System.Data.ConnectionState.Open)
                                            {
                                                connection.Close();
                                            }
                                        }
                                        if (savedChanges)
                                        {
                                            //send executions and accounts modification notification
                                            Log.WriteMatchExecutions(pendingOrder, _activeOrders.First(ao=>ao.ID == acceptedOrderExecution.OrderID),pendingOrderExecution, acceptedOrderExecution, acceptedOrderUserAccount.Name);
                                            Log.WriteMatchExecutions(pendingOrder, _activeOrders.First(ao => ao.ID == acceptedOrderExecution.OrderID), pendingOrderExecution, acceptedOrderExecution, pendingOrderUserAccount.Name);
                                            AddLocalPartialExecution(e, pendingOrderUserAccount.Name, acceptedOrderUserAccount.Name);
                                            AddDataForSortModule(pendingOrder.Symbol, e);
                                        }
                                    }
                                });
                                if (!catched)
                                {
                                    using (SqlConnection connection = new SqlConnection(_connectionString))
                                    {
                                        connection.Open();
                                        SqlCommand command = connection.CreateCommand();
                                        command.CommandText = "UPDATE [Executions] SET [InProcess] = @InProcess WHERE [OrderID] = @OrderID";
                                        command.Parameters.AddWithValue("OrderID", pendingOrder.ID);
                                        command.Parameters.AddWithValue("InProcess", false);
                                        command.ExecuteNonQuery();

                                        if (remainingPendingOrderQuantity > 0 && (pendingOrderExecution.Status == Status.Opened || pendingOrderExecution.Status == Status.PartialFilled))
                                        {
                                            pendingOrderUserAccount.Balance -= pendingOrder.Side == Side.Buy ? pendingOrder.LimitPrice * remainingPendingOrderQuantity : (1 - pendingOrder.LimitPrice) * remainingPendingOrderQuantity;
                                            command = connection.CreateCommand();
                                            command.CommandText = "UPDATE [Accounts] SET [Balance] = @Balance WHERE [Name] = @Name";
                                            command.Parameters.AddWithValue("Name", pendingOrderUserAccount.Name);
                                            command.Parameters.AddWithValue("Balance", pendingOrderUserAccount.Balance);
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }

                                processedAccounts.ForEach(account =>
                                {
                                    CloseMatchedPositionsAccordingParticularUser(account.Name, pendingOrder.Symbol);
                                });

                                processedAccounts = null;

                                lock (_tradingLocker)
                                {
                                    _executions.FindAll(e => e.LeaveQuantity == 0 && e.FilledQuantity == e.PaidUpQuantity).ForEach(e => _activeOrders.RemoveAll(o => o.ID == e.OrderID));
                                    _executions.RemoveAll(e => e.LeaveQuantity == 0 && e.FilledQuantity == e.PaidUpQuantity);
                                }

                                UpdateAskBid(pendingOrder.Symbol);

                                lock (_partialExecutions)
                                {
                                    _partialExecutions.RemoveAll(pe => !_activeOrders.Any(ao => ao.ID == pe.NewOrderID || ao.ID == pe.ExistingOrderID));
                                }
                            }
                        }
                        else
                        {
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Execution for order {0} does not exist", pendingOrder.ID)));
                        }
                    }
                    else
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Account for order {0} does not exist", pendingOrder.ID)));
                    }                    
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
        }

        private void AddDataForSortModule(Symbol symbol, SingleExecution execution)
        {
            try
            {
                var exchangeSettings = _exchanges.ToList().FirstOrDefault(e => e.Name == symbol.Exchange);
                List<ExchangeSortData> sortData = exchangeSettings.Symbols.First().Symbol.SortingData;
                ExchangeSortData currentSortData = new ExchangeSortData
                        {
                            ID = Guid.NewGuid().ToString(),
                            Date = DateTime.UtcNow,
                            Price = execution.Price,
                            Quantity = execution.Quantity
                        };
                if(sortData == null)
                {
                    sortData = new List<ExchangeSortData> { currentSortData };
                }
                else
                {
                    sortData.Add(currentSortData);
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
        }

        private void RecreateOrderAccordingNewPositionBACKUP(string userName, Symbol symbol)
        {
            List<NewOrderRequest> positionsBySymbol = new List<NewOrderRequest>();
            lock (_tradingLocker)
            {
                positionsBySymbol = _activeOrders.Where(ao => ao.Account == userName &&
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.Filled &&
                                                            _executions.First(e => e.OrderID == ao.ID).FilledQuantity - _executions.First(e => e.OrderID == ao.ID).PaidUpQuantity > 0 &&
                                                            ao.Symbol.Name == symbol.Name
                                                            ).ToList();
            }

            long openedQuantityForPositionOrder = positionsBySymbol.Sum(ao => _executions.First(e => e.OrderID == ao.ID).FilledQuantity - _executions.First(e => e.OrderID == ao.ID).ClosedQuantity);

            if (openedQuantityForPositionOrder > 0)
            {
                List<NewOrderRequest> ordersBySymbol = new List<NewOrderRequest>();
                lock (_tradingLocker)
                {
                    ordersBySymbol = _activeOrders.Where(x => x.Account == userName &&
                                                                    (_executions.First(e => x.ID == e.OrderID).Status == Status.Opened ||
                                                                    _executions.First(e => x.ID == e.OrderID).Status == Status.PartialFilled) &&
                                                                x.Symbol.Name == symbol.Name &&
                                                                x.Side != positionsBySymbol.FirstOrDefault().Side
                                                                ).OrderByDescending(x => x.Time).ToList();
                }
                if (ordersBySymbol.Sum(o => _executions.First(e => e.OrderID == o.ID).LeaveQuantity) > 0)
                {
                    ordersBySymbol.ForEach(o =>
                    {
                        Execution currentExecution = _executions.First(e => e.OrderID == o.ID);
                        long quantitiyToClose = Math.Min(currentExecution.LeaveQuantity, openedQuantityForPositionOrder);
                        if (currentExecution.Status == Status.PartialFilled)
                        {
                            var id = Guid.NewGuid().ToString();
                            var orderPos = new NewOrderRequest
                            {
                                Account = userName,
                                ActivationTime = o.ActivationTime,
                                ExpirationDate = o.ExpirationDate,
                                ID = id,
                                IsMirror = o.IsMirror,
                                LimitPrice = o.LimitPrice,
                                OrderType = o.OrderType,
                                Quantity = quantitiyToClose,
                                Side = o.Side,
                                StopPrice = o.StopPrice,
                                Symbol = o.Symbol,
                                Time = o.Time,
                                TimeInForce = o.TimeInForce
                            };
                            var executionPos = new Execution
                            {
                                AverrageFillPrice = 0,
                                CancelledQuantity = 0,
                                ClosedQuantity = 0,
                                FilledQuantity = 0,
                                LastPrice = 0,
                                LastQuantity = 0,
                                LeaveQuantity = quantitiyToClose,
                                Message = "",
                                OrderID = id,
                                PaidUpQuantity = 0,
                                Status = Status.OpenedPosition,
                                Time = o.ActivationTime
                            };
                            lock (_tradingLocker)
                            {
                                _activeOrders.Add(orderPos);
                                _executions.Add(executionPos);
                                _users.FirstOrDefault(u => u.UserName == userName).Accounts.First().Balance += o.Side == Side.Buy ? quantitiyToClose * o.LimitPrice : (1 - quantitiyToClose) * o.LimitPrice;
                            }
                            var leaveQuantityForNewOrder = currentExecution.LeaveQuantity - quantitiyToClose;
                            if (leaveQuantityForNewOrder > 0)
                            {
                                var OrderLeaveID = Guid.NewGuid().ToString();
                                var orderOrd = new NewOrderRequest
                                {
                                    Account = userName,
                                    ActivationTime = o.ActivationTime,
                                    ExpirationDate = o.ExpirationDate,
                                    ID = OrderLeaveID,
                                    IsMirror = o.IsMirror,
                                    LimitPrice = o.LimitPrice,
                                    OrderType = o.OrderType,
                                    Quantity = leaveQuantityForNewOrder,
                                    Side = o.Side,
                                    StopPrice = o.StopPrice,
                                    Symbol = o.Symbol,
                                    Time = o.Time,
                                    TimeInForce = o.TimeInForce
                                };
                                var executionOrd = new Execution
                                {
                                    AverrageFillPrice = 0,
                                    CancelledQuantity = 0,
                                    ClosedQuantity = 0,
                                    FilledQuantity = 0,
                                    LastPrice = 0,
                                    LastQuantity = 0,
                                    LeaveQuantity = leaveQuantityForNewOrder,
                                    Message = "",
                                    OrderID = OrderLeaveID,
                                    PaidUpQuantity = 0,
                                    Status = Status.Opened,
                                    Time = o.ActivationTime
                                };
                                lock (_tradingLocker)
                                {
                                    _activeOrders.Add(orderOrd);
                                    _executions.Add(executionOrd);
                                }
                            }
                            currentExecution.Status = Status.Filled;
                            currentExecution.LeaveQuantity = 0;
                        }
                        if (currentExecution.Status == Status.Opened)
                        {
                            var newOrderQuantity = currentExecution.LeaveQuantity - quantitiyToClose;
                            currentExecution.Status = Status.OpenedPosition;
                            currentExecution.LeaveQuantity = quantitiyToClose;
                            _users.FirstOrDefault(u => u.UserName == userName).Accounts.First().Balance += o.Side == Side.Buy ? quantitiyToClose * o.LimitPrice : (1 - quantitiyToClose) * o.LimitPrice;
                            openedQuantityForPositionOrder -= quantitiyToClose;
                            if (newOrderQuantity > 0)
                            {
                                var NewID = Guid.NewGuid().ToString();
                                var newOrderOrd = new NewOrderRequest
                                {
                                    Account = userName,
                                    ActivationTime = o.ActivationTime,
                                    ExpirationDate = o.ExpirationDate,
                                    ID = NewID,
                                    IsMirror = o.IsMirror,
                                    LimitPrice = o.LimitPrice,
                                    OrderType = o.OrderType,
                                    Quantity = newOrderQuantity,
                                    Side = o.Side,
                                    StopPrice = o.StopPrice,
                                    Symbol = o.Symbol,
                                    Time = o.Time,
                                    TimeInForce = o.TimeInForce
                                };
                                var newExecutionOrd = new Execution
                                {
                                    AverrageFillPrice = 0,
                                    CancelledQuantity = 0,
                                    ClosedQuantity = 0,
                                    FilledQuantity = 0,
                                    LastPrice = 0,
                                    LastQuantity = 0,
                                    LeaveQuantity = newOrderQuantity,
                                    Message = "",
                                    OrderID = NewID,
                                    PaidUpQuantity = 0,
                                    Status = Status.Opened,
                                    Time = o.ActivationTime
                                };
                                lock (_tradingLocker)
                                {
                                    _activeOrders.Add(newOrderOrd);
                                    _executions.Add(newExecutionOrd);
                                }
                            }
                        }
                    });
                    var totalPositionsQuantityToClose = positionsBySymbol.Sum(ao => _executions.First(e => e.OrderID == ao.ID).FilledQuantity - _executions.First(e => e.OrderID == ao.ID).ClosedQuantity) - openedQuantityForPositionOrder;
                    positionsBySymbol.ForEach(x =>
                    {
                        if (totalPositionsQuantityToClose > 0)
                        {
                            var currentExecution = _executions.First(e => e.OrderID == x.ID);
                            var quantityToClose = Math.Min(totalPositionsQuantityToClose, currentExecution.FilledQuantity - currentExecution.ClosedQuantity);
                            currentExecution.ClosedQuantity += quantityToClose;
                            totalPositionsQuantityToClose -= quantityToClose;
                        }
                    });
                }
            }
        }

        private void ProcessEveryOrder(NewOrderRequest o, string userName, ref long openedQuantityForPositionOrder)
        {
            Execution currentExecution = _executions.First(e => e.OrderID == o.ID);
            long quantitiyToClose = Math.Min(currentExecution.LeaveQuantity, openedQuantityForPositionOrder);

            var newOrderQuantity = currentExecution.LeaveQuantity - quantitiyToClose;

            SqlConnection connection = new SqlConnection(_connectionString);
            SqlTransaction transaction = null;
            try
            {
                connection.Open();
                transaction = connection.BeginTransaction();
                SqlCommand command = null;

                if (currentExecution.Status == Status.PartialFilled)
                {
                    if (currentExecution.PaidUpQuantity > 0)
                    {
                        var iD1 = Guid.NewGuid().ToString();

                        command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "INSERT INTO [Orders] VALUES (@ID, @AccountID, @SymbolID, @Time, @ActivationTime, @Side, @OrderType, @LimitPrice, @StopPrice, @Quantity, @TimeInForce, @ExpirationDate, @IsMirror)";
                        command.Parameters.AddWithValue("ID", iD1);
                        command.Parameters.AddWithValue("AccountID", o.Account);
                        command.Parameters.AddWithValue("SymbolID", _exchanges.FirstOrDefault(e => e.Symbols.First().Symbol.Name == o.Symbol.Name).Symbols.First().ID);
                        command.Parameters.AddWithValue("Time", o.Time);

                        command.Parameters.AddWithValue("ActivationTime", o.ActivationTime);

                        command.Parameters.AddWithValue("Side", (byte)o.Side);
                        command.Parameters.AddWithValue("OrderType", (byte)o.OrderType);
                        command.Parameters.AddWithValue("LimitPrice", o.LimitPrice);
                        command.Parameters.AddWithValue("StopPrice", o.StopPrice);
                        command.Parameters.AddWithValue("Quantity", currentExecution.PaidUpQuantity);
                        command.Parameters.AddWithValue("TimeInForce", o.TimeInForce);
                        command.Parameters.AddWithValue("ExpirationDate", o.ExpirationDate);
                        command.Parameters.AddWithValue("IsMirror", o.IsMirror);
                        command.ExecuteNonQuery();

                        command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "INSERT INTO [Executions] VALUES (@OrderID, @Time, @Status, 0, @PaidUpQuantity, @ClosedQuantity, 0, @FilledQuantity, @LeaveQuantity, 0, 0, @InProcess)";
                        command.Parameters.AddWithValue("OrderID", iD1);
                        command.Parameters.AddWithValue("Time", o.Time);
                        command.Parameters.AddWithValue("Status", (byte)Status.Filled);
                        command.Parameters.AddWithValue("PaidUpQuantity", currentExecution.PaidUpQuantity);
                        command.Parameters.AddWithValue("ClosedQuantity", currentExecution.PaidUpQuantity);
                        command.Parameters.AddWithValue("FilledQuantity", currentExecution.PaidUpQuantity);
                        command.Parameters.AddWithValue("LeaveQuantity", 0);
                        command.Parameters.AddWithValue("InProcess", false);

                        command.ExecuteNonQuery();

                        currentExecution.Status = Status.Opened;
                        currentExecution.ClosedQuantity -= currentExecution.PaidUpQuantity;
                        currentExecution.FilledQuantity -= currentExecution.PaidUpQuantity;
                        currentExecution.PaidUpQuantity = 0;

                    }
                    if(currentExecution.FilledQuantity > 0)
                    {
                        var iD = Guid.NewGuid().ToString();
                        var positionOrder = new NewOrderRequest
                        {
                            Account = userName,
                            ActivationTime = o.ActivationTime,
                            ExpirationDate = o.ExpirationDate,
                            ID = iD,
                            IsMirror = o.IsMirror,
                            LimitPrice = o.LimitPrice,
                            OrderType = o.OrderType,
                            Quantity = currentExecution.FilledQuantity,
                            Side = o.Side,
                            StopPrice = o.StopPrice,
                            Symbol = o.Symbol,
                            Time = o.Time,
                            TimeInForce = o.TimeInForce
                        };
                        var positionExecution = new Execution
                        {
                            AverrageFillPrice = 0,
                            CancelledQuantity = 0,
                            ClosedQuantity = currentExecution.ClosedQuantity,
                            FilledQuantity = currentExecution.FilledQuantity,
                            LastPrice = 0,
                            LastQuantity = 0,
                            LeaveQuantity = 0,
                            Message = "",
                            OrderID = iD,
                            PaidUpQuantity = 0,
                            Status = Status.Filled,
                            Time = o.ActivationTime
                        };
                        command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "INSERT INTO [Orders] VALUES (@ID, @AccountID, @SymbolID, @Time, @ActivationTime, @Side, @OrderType, @LimitPrice, @StopPrice, @Quantity, @TimeInForce, @ExpirationDate, @IsMirror)";
                        command.Parameters.AddWithValue("ID", iD);
                        command.Parameters.AddWithValue("AccountID", o.Account);
                        command.Parameters.AddWithValue("SymbolID", _exchanges.FirstOrDefault(e => e.Symbols.First().Symbol.Name == o.Symbol.Name).Symbols.First().ID);
                        command.Parameters.AddWithValue("Time", o.Time);
                        command.Parameters.AddWithValue("ActivationTime", o.ActivationTime);
                        command.Parameters.AddWithValue("Side", (byte)o.Side);
                        command.Parameters.AddWithValue("OrderType", (byte)o.OrderType);
                        command.Parameters.AddWithValue("LimitPrice", o.LimitPrice);
                        command.Parameters.AddWithValue("StopPrice", o.StopPrice);
                        command.Parameters.AddWithValue("Quantity", currentExecution.FilledQuantity);
                        command.Parameters.AddWithValue("TimeInForce", o.TimeInForce);
                        command.Parameters.AddWithValue("ExpirationDate", o.ExpirationDate);
                        command.Parameters.AddWithValue("IsMirror", o.IsMirror);
                        command.ExecuteNonQuery();

                        command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "INSERT INTO [Executions] VALUES (@OrderID, @Time, @Status, 0, @PaidUpQuantity, @ClosedQuantity, 0, @FilledQuantity, @LeaveQuantity, 0, 0,@InProcess)";
                        command.Parameters.AddWithValue("OrderID", iD);
                        command.Parameters.AddWithValue("Time", o.Time);
                        command.Parameters.AddWithValue("Status", (byte)Status.Filled);
                        command.Parameters.AddWithValue("PaidUpQuantity", 0);
                        command.Parameters.AddWithValue("ClosedQuantity", currentExecution.ClosedQuantity);
                        command.Parameters.AddWithValue("FilledQuantity", currentExecution.FilledQuantity);
                        command.Parameters.AddWithValue("LeaveQuantity", 0);
                        command.Parameters.AddWithValue("InProcess", false);

                        command.ExecuteNonQuery();
                        lock(_tradingLocker)
                        {
                            _activeOrders.Add(positionOrder);
                            _executions.Add(positionExecution);
                        }

                        currentExecution.ClosedQuantity = 0;
                        currentExecution.FilledQuantity = 0;
                    }
                }

                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "UPDATE [Executions] SET [LeaveQuantity] = @LeaveQuantity, [PaidUpQuantity] = @PaidUpQuantity, [ClosedQuantity] = @ClosedQuantity, [Status] = @Status WHERE [OrderID] = @OrderID";
                command.Parameters.AddWithValue("PaidUpQuantity", 0);
                command.Parameters.AddWithValue("ClosedQuantity", 0);
                command.Parameters.AddWithValue("LeaveQuantity", quantitiyToClose);
                command.Parameters.AddWithValue("Status", (byte)Status.OpenedPosition);
                command.Parameters.AddWithValue("OrderID", o.ID);
                command.ExecuteNonQuery();

                currentExecution.Status = Status.OpenedPosition;
                currentExecution.LeaveQuantity = quantitiyToClose;

                var balanceChanges = o.Side == Side.Buy ? quantitiyToClose * o.LimitPrice : quantitiyToClose * (1 - o.LimitPrice);
                _users.FirstOrDefault(u => u.UserName == userName).Accounts.First().Balance += balanceChanges;

                command = connection.CreateCommand();
                command.Transaction = transaction;
                command.CommandText = "UPDATE [Accounts] SET [Balance] = [Balance] + @Balance WHERE [Name] = @Name";
                command.Parameters.AddWithValue("Name", userName);
                command.Parameters.AddWithValue("Balance", balanceChanges);
                command.ExecuteNonQuery();

                openedQuantityForPositionOrder -= quantitiyToClose;
                if (newOrderQuantity > 0)
                {
                    var NewID = Guid.NewGuid().ToString();
                    var newOrderOrd = new NewOrderRequest
                    {
                        Account = userName,
                        ActivationTime = o.ActivationTime,
                        ExpirationDate = o.ExpirationDate,
                        ID = NewID,
                        IsMirror = o.IsMirror,
                        LimitPrice = o.LimitPrice,
                        OrderType = o.OrderType,
                        Quantity = newOrderQuantity,
                        Side = o.Side,
                        StopPrice = o.StopPrice,
                        Symbol = o.Symbol,
                        Time = o.Time,
                        TimeInForce = o.TimeInForce
                    };
                    var newExecutionOrd = new Execution
                    {
                        AverrageFillPrice = 0,
                        CancelledQuantity = 0,
                        ClosedQuantity = 0,
                        FilledQuantity = 0,
                        LastPrice = 0,
                        LastQuantity = 0,
                        LeaveQuantity = newOrderQuantity,
                        Message = "",
                        OrderID = NewID,
                        PaidUpQuantity = 0,
                        Status = Status.Opened,
                        Time = o.ActivationTime
                    };
                    lock (_tradingLocker)
                    {
                        _activeOrders.Add(newOrderOrd);
                        _executions.Add(newExecutionOrd);
                    }

                    command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText = "INSERT INTO [Orders] VALUES (@ID, @AccountID, @SymbolID, @Time, @ActivationTime, @Side, @OrderType, @LimitPrice, @StopPrice, @Quantity, @TimeInForce, @ExpirationDate, @IsMirror)";
                    command.Parameters.AddWithValue("ID", newOrderOrd.ID);
                    command.Parameters.AddWithValue("AccountID", newOrderOrd.Account);
                    command.Parameters.AddWithValue("SymbolID", _exchanges.FirstOrDefault(e => e.Symbols.First().Symbol.Name == o.Symbol.Name).Symbols.First().ID);
                    command.Parameters.AddWithValue("Time", newOrderOrd.Time);

                    command.Parameters.AddWithValue("ActivationTime", newOrderOrd.ActivationTime);

                    command.Parameters.AddWithValue("Side", (byte)newOrderOrd.Side);
                    command.Parameters.AddWithValue("OrderType", (byte)newOrderOrd.OrderType);
                    command.Parameters.AddWithValue("LimitPrice", newOrderOrd.LimitPrice);
                    command.Parameters.AddWithValue("StopPrice", newOrderOrd.StopPrice);
                    command.Parameters.AddWithValue("Quantity", newOrderOrd.Quantity);
                    command.Parameters.AddWithValue("TimeInForce", newOrderOrd.TimeInForce);
                    command.Parameters.AddWithValue("ExpirationDate", newOrderOrd.ExpirationDate);
                    command.Parameters.AddWithValue("IsMirror", newOrderOrd.IsMirror);
                    command.ExecuteNonQuery();

                    command = connection.CreateCommand();
                    command.Transaction = transaction;
                    command.CommandText = "INSERT INTO [Executions] VALUES (@OrderID, @Time, @Status, 0, 0, 0, 0, 0, @LeaveQuantity, 0, 0, @InProcess)";
                    command.Parameters.AddWithValue("OrderID", newExecutionOrd.OrderID);
                    command.Parameters.AddWithValue("Time", newExecutionOrd.Time);
                    command.Parameters.AddWithValue("Status", (byte)newExecutionOrd.Status);
                    command.Parameters.AddWithValue("LeaveQuantity", newExecutionOrd.LeaveQuantity);
                    command.Parameters.AddWithValue("InProcess", false);

                    command.ExecuteNonQuery();
                    transaction.Commit();
                }
            }
            catch(Exception ex)
            {
                if(transaction != null)
                {
                    transaction.Rollback();
                }
            }
            finally
            {
                connection.Close();
            }
        }

        private void RecreateOrderAccordingNewPosition(string userName, Symbol symbol)
        {
            List<NewOrderRequest> positionsBySymbol = new List<NewOrderRequest>();
            lock (_tradingLocker)
            {
                positionsBySymbol = AllUserPositions(userName).Where(x => x.Symbol.Name == symbol.Name).ToList();
            }

            long openedQuantityForPositionOrder = positionsBySymbol.Sum(ao => _executions.First(e => e.OrderID == ao.ID).FilledQuantity - _executions.First(e => e.OrderID == ao.ID).ClosedQuantity);

            if (openedQuantityForPositionOrder > 0)
            {
                List<NewOrderRequest> ordersBySymbol = new List<NewOrderRequest>();
                lock (_tradingLocker)
                {
                    ordersBySymbol = _activeOrders.Where(x => x.Account == userName &&
                                                                    (_executions.First(e => x.ID == e.OrderID).Status == Status.Opened ||
                                                                    _executions.First(e => x.ID == e.OrderID).Status == Status.PartialFilled) &&
                                                                x.Symbol.Name == symbol.Name &&
                                                                x.Side != positionsBySymbol.FirstOrDefault().Side
                                                                ).OrderByDescending(x => x.Time).ToList();
                }
                if (ordersBySymbol.Sum(o => _executions.First(e => e.OrderID == o.ID).LeaveQuantity) > 0)
                {
                    ordersBySymbol.ForEach(o =>
                    {
                        if(openedQuantityForPositionOrder > 0)
                        {
                            ProcessEveryOrder(o, userName, ref openedQuantityForPositionOrder);
                        }
                    });
                    var totalPositionsQuantityToClose = positionsBySymbol.Sum(ao => _executions.First(e => e.OrderID == ao.ID).FilledQuantity - _executions.First(e => e.OrderID == ao.ID).ClosedQuantity) - openedQuantityForPositionOrder;
                    positionsBySymbol.ForEach(x =>
                    {
                        if (totalPositionsQuantityToClose > 0)
                        {
                            var currentExecution = _executions.First(e => e.OrderID == x.ID);
                            var quantityToClose = Math.Min(totalPositionsQuantityToClose, currentExecution.FilledQuantity - currentExecution.ClosedQuantity);
                            currentExecution.ClosedQuantity += quantityToClose;
                            totalPositionsQuantityToClose -= quantityToClose;

                            SqlConnection connection = new SqlConnection(_connectionString);
                            connection.Open();
                            SqlCommand command = connection.CreateCommand();
                            command.CommandText = "UPDATE [Executions] SET [ClosedQuantity] = @ClosedQuantity WHERE [OrderID] = @OrderID";
                            command.Parameters.AddWithValue("ClosedQuantity", currentExecution.ClosedQuantity);
                            command.Parameters.AddWithValue("OrderID", currentExecution.OrderID);
                            command.ExecuteNonQuery();
                            connection.Close();
                        }
                    });
                }
            }
        }

        private void AddLocalPartialExecution(SingleExecution e, string takerAccount, string makerAccount)
        {
            lock (_partialExecutions)
            {
                _partialExecutions.Add(new PartialExecution
                {
                    ExistingOrderID = e.ExistingOrderID,
                    MakerAccount = makerAccount,
                    NewOrderID = e.NewOrderID,
                    TakerAccount = takerAccount,
                    Quantity = e.Quantity,
                    Price = e.Price,
                    Time = DateTime.UtcNow
                });
            }
        }

        private void UpdateAskBid(Symbol symbol)
        {
            lock(_tradingLocker)
            {
                var bidOrder = _activeOrders.FindAll(ao => ao.Symbol.Name == symbol.Name &&
                                                            ao.Side == Side.Buy &&
                                                            (_executions.First(e => e.OrderID == ao.ID).Status == Status.VirtualOrder ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.Opened ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilled ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.VirtualPosition ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.OpenedPosition ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilledPosition)
                                                            ).OrderByDescending(ao => ao.LimitPrice).FirstOrDefault();
                var ascOrder = _activeOrders.FindAll(ao => ao.Symbol.Name == symbol.Name &&
                                                            ao.Side == Side.Sell &&
                                                            (_executions.First(e => e.OrderID == ao.ID).Status == Status.VirtualOrder ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.Opened ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilled ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.VirtualPosition ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.OpenedPosition ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilledPosition)
                                                            ).OrderBy(ao => ao.LimitPrice).FirstOrDefault();

                var bidPrice = 0m;
                var ascPrice = 1m;

                if (bidOrder != null)
                {
                    bidPrice = bidOrder.LimitPrice;
                }
                if (ascOrder != null)
                {
                    ascPrice = ascOrder.LimitPrice;
                }

                Symbol currentSymbol = null;
                lock(_exchanges)
                {
                    currentSymbol = _exchanges.Where(e => e.Symbols.First().Symbol.Equals(symbol)).First().Symbols.First().Symbol;
                }
                currentSymbol.LastBid = bidPrice;
                currentSymbol.LastAsk = ascPrice;

                SqlConnection connection = new SqlConnection(_connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText = "UPDATE [Symbols] SET [LastAsk] = @LastAsk, [LastBid] = @LastBid WHERE [Name] = @SymbolName";
                    command.Parameters.AddWithValue("LastAsk", ascPrice);
                    command.Parameters.AddWithValue("LastBid", bidPrice);
                    command.Parameters.AddWithValue("SymbolName", currentSymbol.Name);
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        private void CloseMatchedPositionsAccordingParticularUser(string user, Symbol symbol)
        {
            lock (_tradingLocker)
            {
                List<Execution> sellPositions = _executions.Where(e => _activeOrders.First(ao => ao.ID == e.OrderID).Symbol.Name == symbol.Name &&
                                                                        (e.Status == Status.Filled || e.Status == Status.PartialFilled) &&
                                                                        e.FilledQuantity != e.PaidUpQuantity &&
                                                                        _activeOrders.First(ao => ao.ID == e.OrderID).Side == Side.Sell &&
                                                                        _activeOrders.First(ao => ao.ID == e.OrderID).Account == user
                                                                        ).OrderBy(e => _activeOrders.First(ao => ao.ID == e.OrderID).Time).ToList();

                List<Execution> sellPositionsBuyOrders = _executions.Where(e => _activeOrders.First(ao => ao.ID == e.OrderID).Symbol.Name == symbol.Name &&
                                                                                ((e.Status == Status.OpenedPosition || e.Status == Status.PartialFilledPosition) &&
                                                                                 !(e.LeaveQuantity == 0 && e.FilledQuantity == e.PaidUpQuantity)) &&
                                                                                _activeOrders.First(ao => ao.ID == e.OrderID).Side == Side.Buy &&
                                                                                _activeOrders.First(ao => ao.ID == e.OrderID).Account == user
                                                                                ).OrderBy(e => _activeOrders.First(ao => ao.ID == e.OrderID).Time).ToList();

                List<Execution> buyPositions = _executions.Where(e => _activeOrders.First(ao => ao.ID == e.OrderID).Symbol.Name == symbol.Name &&
                                                                        (e.Status == Status.Filled || e.Status == Status.PartialFilled) &&
                                                                        e.FilledQuantity != e.PaidUpQuantity &&
                                                                        _activeOrders.First(ao => ao.ID == e.OrderID).Side == Side.Buy &&
                                                                        _activeOrders.First(ao => ao.ID == e.OrderID).Account == user
                                                                        ).OrderBy(e => _activeOrders.First(ao => ao.ID == e.OrderID).Time).ToList();

                List<Execution> buyPositionsSellOrders = _executions.Where(e => _activeOrders.First(ao => ao.ID == e.OrderID).Symbol.Name == symbol.Name &&
                                                                                ((e.Status == Status.OpenedPosition || e.Status == Status.PartialFilledPosition) &&
                                                                                 !(e.LeaveQuantity == 0 && e.FilledQuantity == e.PaidUpQuantity)) &&
                                                                                _activeOrders.First(ao => ao.ID == e.OrderID).Side == Side.Sell &&
                                                                                _activeOrders.First(ao => ao.ID == e.OrderID).Account == user
                                                                                ).OrderBy(e => _activeOrders.First(ao => ao.ID == e.OrderID).Time).ToList();

                if (sellPositions.Any() && buyPositions.Any())
                {
                    long sellQuantity = sellPositions.Sum(p => p.FilledQuantity - p.PaidUpQuantity);
                    long buyQuantity = buyPositions.Sum(p => p.FilledQuantity - p.PaidUpQuantity);
                    var closeQuantity = Math.Min(sellQuantity, buyQuantity);
                    SqlConnection connection = new SqlConnection(_connectionString);
                    SqlTransaction transaction = null;
                    try
                    {
                        connection.Open();
                        transaction = connection.BeginTransaction();

                        ProcessMatchedPositionsForSale(sellPositionsBuyOrders, closeQuantity, connection, transaction);
                        ProcessMatchedPositionsForSale(buyPositionsSellOrders, closeQuantity, connection, transaction);

                        var profit = ProcessMatchedPositions(sellPositions, closeQuantity, connection, transaction);
                        ProcessMatchedPositions(buyPositions, closeQuantity, connection, transaction);

                        SqlCommand command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "UPDATE [Accounts] SET [Balance] = [Balance] + @Balance WHERE [Name] = @Name";
                        command.Parameters.AddWithValue("Name", user);
                        command.Parameters.AddWithValue("Balance", profit);
                        command.ExecuteNonQuery();
                        transaction.Commit();
                        _users.FirstOrDefault(u => u.UserName == user).Accounts.First().Balance += profit;
                    }
                    catch (Exception ex)
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                        if (transaction != null)
                        {
                            transaction.Rollback();
                        }
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
            }
        }

        private decimal ProcessMatchedPositions(List<Execution> currentPositions, long closeQuantity, SqlConnection connection, SqlTransaction transaction)
        {
            long remainingQuantity = closeQuantity;
            decimal totalPriceOfPosition = 0;
            currentPositions.ForEach(x =>
            {
                if (remainingQuantity > 0)
                {
                    var catched = false;
                    long currentQantity = x.FilledQuantity - x.PaidUpQuantity;
                    long quantityToClose = Math.Min(currentQantity, remainingQuantity);

                    SqlCommand command = connection.CreateCommand();

                    var closedQuantity = Math.Max(x.ClosedQuantity, x.PaidUpQuantity + quantityToClose);
                    try
                    {
                        command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "UPDATE [Executions] SET [Time] = @Time, [PaidUpQuantity] = [PaidUpQuantity] + @PaidUpQuantity, [ClosedQuantity] = @ClosedQuantity WHERE [OrderID] = @OrderID";
                        command.Parameters.AddWithValue("OrderID", x.OrderID);
                        command.Parameters.AddWithValue("Time", DateTime.UtcNow);
                        command.Parameters.AddWithValue("PaidUpQuantity", quantityToClose);
                        command.Parameters.AddWithValue("ClosedQuantity", closedQuantity);
                        command.ExecuteNonQuery();
                    }
                    catch(Exception ex)
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                        catched = true;
                    }
                    if(catched != true)
                    {
                        totalPriceOfPosition += quantityToClose;
                        x.PaidUpQuantity += quantityToClose;
                        x.ClosedQuantity = Math.Max(x.ClosedQuantity, x.PaidUpQuantity);
                        remainingQuantity -= quantityToClose;
                    }
                }
            });
            return totalPriceOfPosition;
        }

        private void ProcessMatchedPositionsForSale(List<Execution> positionsForSale, long closeQuantity, SqlConnection connection, SqlTransaction transaction)
        {
            long remainingQuantity = closeQuantity;

            positionsForSale.ForEach(x =>
            {
                if(remainingQuantity > 0)
                {
                    var catched = false;

                    long quantityToClose = Math.Min(x.LeaveQuantity, remainingQuantity);
                    try
                    {
                        SqlCommand command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "UPDATE [Executions] SET [Time] = @Time, [PaidUpQuantity] = [PaidUpQuantity] + @QuantityToClose, [FilledQuantity] = [FilledQuantity] + @QuantityToClose, [LeaveQuantity] = [LeaveQuantity] - @QuantityToClose WHERE [OrderID] = @OrderID";
                        command.Parameters.AddWithValue("OrderID", x.OrderID);
                        command.Parameters.AddWithValue("Time", DateTime.UtcNow);
                        command.Parameters.AddWithValue("QuantityToClose", quantityToClose);
                        command.ExecuteNonQuery();
                    }
                    catch(Exception ex)
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                        catched = true;
                    }
                    if(catched == false)
                    {
                        x.LeaveQuantity -= quantityToClose;
                        x.FilledQuantity += quantityToClose;
                        x.PaidUpQuantity += quantityToClose;
                        remainingQuantity -= quantityToClose;
                    }
                }
            });
        }
                
        private void ProcessVirtualOrdersHandler()//Method that change order status when delay time is expired
        {
            while (_started)
            {
                //virtual orders which delay time is expirred
                List<NewOrderRequest> expiredVirtualOrders = _activeOrders
                    .Where(ao => 
                        {
                            Execution execution = _executions.First(e => e.OrderID == ao.ID);

                            Symbol currentSymbol = _exchanges.First(e => e.Symbols.First().Symbol.ToString() == ao.Symbol.ToString()).Symbols.First().Symbol;
                            int delayTime = currentSymbol.StartDate < DateTime.UtcNow ? currentSymbol.DelayTime : 0;
                            bool orderStatus = (execution.Status == Status.VirtualOrder || execution.Status == Status.VirtualPosition) && (DateTime.UtcNow > ao.Time.AddSeconds(delayTime));
                            return orderStatus;
                        })
                    .OrderBy(ao => ao.Time).OrderBy(x => _executions.First(e => e.OrderID == x.ID).Status).ToList();

                if (expiredVirtualOrders.Any())
                {
                    SqlConnection connection = new SqlConnection(_connectionString);
                    try
                    {
                        connection.Open();
                        expiredVirtualOrders.ForEach(evo =>
                        {
                            Execution currentExecution = _executions.First(e => e.OrderID == evo.ID);
                            SqlCommand command = connection.CreateCommand();
                            command.CommandText = "UPDATE [Executions] SET [Status] = @Status WHERE [OrderID] = @OrderId";
                            if (currentExecution.Status == Status.VirtualOrder)
                            {
                                command.Parameters.AddWithValue("Status", Status.Opened);
                            }
                            else if (currentExecution.Status == Status.VirtualPosition)
                            {
                                command.Parameters.AddWithValue("Status", Status.OpenedPosition);
                            }
                            command.Parameters.AddWithValue("OrderId", evo.ID);
                            command.ExecuteNonQuery();

                            if (currentExecution.Status == Status.VirtualOrder)
                            {
                                currentExecution.Status = Status.Opened;
                            }
                            else if (currentExecution.Status == Status.VirtualPosition)
                            {
                                currentExecution.Status = Status.OpenedPosition;
                            }
                            ProcessOrderRequest(evo);
                        });
                    }
                    catch (Exception ex)
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
                Thread.Sleep(1000);
            }
        }
               
        private void ProcessExchangeSession()
        {
            while (true)
            {
                DateTime utcNow = DateTime.UtcNow;
                List<string> orderIDs;
                lock (_tradingLocker)
                {   
                    orderIDs = _activeOrders.Where(o => (o.TimeInForce == TimeInForce.GTD || o.TimeInForce == TimeInForce.DAY || o.TimeInForce == TimeInForce.AON) && o.ExpirationDate <= utcNow).Select(o => o.ID).ToList();
                }
                //cancel expiried market and limit orders
                orderIDs.ForEach(id => CancelOrder(new CancelOrderRequest() { ID = id }, false));
                lock (_tradingLocker)
                {
                    orderIDs = _stopOorders.Where(o => (o.TimeInForce == TimeInForce.GTD || o.TimeInForce == TimeInForce.DAY || o.TimeInForce == TimeInForce.AON) && o.ExpirationDate <= utcNow).Select(o => o.ID).ToList();
                }
                //cancel expiried stop orders
                orderIDs.ForEach(id => CancelOrder(new CancelOrderRequest() { ID = id }, false));
                lock (_exchanges)
                {
                    _exchanges.ForEach(exchange =>
                    {
                        var sortingData = exchange.Symbols.First().Symbol.SortingData;
                        if(sortingData != null)
                        {
                            sortingData.RemoveAll(x => x.Date.AddMinutes(filterTime) < DateTime.UtcNow);
                        }
                        

                        if (utcNow > exchange.EndDate)
                        {
                            //update exchange current day trading hours
                            //exchange.UpdateDateTime();
                            //CloseExchange(exchange.Name, Result.Undefined);
                            _cache.ProcessExchangeSession(exchange.Name);
                        }
                    });
                }                
                Thread.Sleep(1000);
            }
        }
        
        //fires order update notification
        private void FireExecution(string account, Execution execution)
        {
            User user = _users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name == account) != null);
            if (user != null && OnExecution != null)
            {
                OnExecution(user.UserName, execution);
            }
            else
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception("Invalid user"));
            }
        }

        //fires account update notification
        private void FireAccountInfo(Account account)
        {
            User user = _users.FirstOrDefault(u => u.Accounts.FirstOrDefault(a => a.Name == account.Name) != null);
            if (user != null && OnAccountInfo != null)
            {
                OnAccountInfo(user.UserName, account);
            }
            else
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception("Invalid user"));
            }
        }

        //add tick to cache and fires tick update notification
        private void BrodcastTick(Tick tick, bool save)
        {
            #region Base Broadcast
            //_cache.AppendTick(tick, save);
            //if (OnTick != null)
            //{
            //    var baseMultiplier = GetCurrencyMultiplier(tick.Symbol.Currency);
            //    _currencies.ForEach(c =>
            //    {
            //        if (baseMultiplier != 0)
            //        {
            //            var multiplier = baseMultiplier / c.Multiplier;
            //            OnTick(new Tick() { Symbol = tick.Symbol, Currency = c.Name, Time = tick.Time, Price = tick.Price * multiplier, Bid = tick.Bid * multiplier, BidSize = tick.BidSize, Ask = tick.Ask * multiplier, AskSize = tick.AskSize, Volume = tick.Volume });
            //        }
            //        else
            //        {
            //            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), new Exception(string.Format("Currency {0} does not exist", tick.Symbol.Currency)));
            //        }
            //    });
            //    OnTick(tick);
            //}

            //TODO: nail code!
            //tick.Time = DateTime.SpecifyKind(tick.Time, DateTimeKind.Local);
            #endregion

            _cache.AppendTick(tick, save);
            var ticToAdd = new Tick() { Symbol = tick.Symbol, Currency = "USD", Time = tick.Time, Price = tick.Price, Volume = tick.Volume, Side = tick.Side };
            _ticks.Add(ticToAdd);
        }


        private string CheckBalance(bool isCommonCurrency, Account userAccount, NewOrderRequest request, Tick lastTick, decimal stopPrice, decimal limitPrice)
        {
            decimal balance = 0;
            var error = string.Empty;
            if (isCommonCurrency)
            {
                balance = userAccount.Balance * GetCurrencyMultiplier(userAccount.Currency);
            }
            else
            {
                balance = userAccount.Balance * (GetCurrencyMultiplier(userAccount.Currency) / (GetCurrencyMultiplier(request.Symbol.Currency)));
            }
            if (request.OrderType == Type.Market)
            {
                if (lastTick != null)
                {
                    balance -= (lastTick.Price * request.Quantity);
                }
            }
            else if (request.OrderType == Type.Limit)
            {
                balance -= (limitPrice * request.Quantity);
            }
            else if (request.OrderType == Type.Stop)
            {
                balance -= (stopPrice * request.Quantity);
            }
            else if (request.OrderType == Type.StopLimit)
            {
                balance -= (limitPrice * request.Quantity);
            }
            if (balance < 0)
            {
                error = string.Format("There is no enought funds to place order, ID {0}", request.ID);
                Log.WriteApplicationInfo(error, userAccount.Name);
            }

            return error;
        }

        public void UpdatePriceDirection(Symbol symbol, decimal price)
        {
            Symbol currentSymbol = null;
            lock (_exchanges)
            {
                currentSymbol = _exchanges.Where(e => e.Symbols.First().Symbol.Equals(symbol)).First().Symbols.First().Symbol;
            }
            if (currentSymbol != null)
            {
                if (price - currentSymbol.LastPrice > 0)
                {
                    currentSymbol.PriceChangeDirection = 1;//increase price
                }
                else if (price - currentSymbol.LastPrice < 0)
                {
                    currentSymbol.PriceChangeDirection = -1;//decrease price
                }

                SqlConnection connection = new SqlConnection(_connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText = "UPDATE [Symbols] SET [PriceChangeDirection] = @PriceChangeDirection WHERE [Name] = @SymbolName";
                    command.Parameters.AddWithValue("SymbolName", currentSymbol.Name);
                    command.Parameters.AddWithValue("PriceChangeDirection", currentSymbol.PriceChangeDirection);
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
                finally
                {
                    connection.Close();
                }
            }
            else
            {
                Log.WriteApplicationInfo("There is invalid symbol: " + symbol.ToString());
            }
        }

        public void UpdateLastPrice(Symbol symbol, Side lastSide, decimal price)
        {
            Symbol currentSymbol = null;
            lock(_exchanges)
            {
                currentSymbol = _exchanges.Where(e => e.Symbols.First().Symbol.Equals(symbol)).First().Symbols.First().Symbol;
            }
            if(currentSymbol != null)
            {
                currentSymbol.LastPrice = price;
                currentSymbol.LastSide = lastSide;

                SqlConnection connection = new SqlConnection(_connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText = "UPDATE [Symbols] SET [LastPrice] = @LastPrice, [Side] = @Side WHERE [Name] = @SymbolName";
                    command.Parameters.AddWithValue("LastPrice", price);
                    command.Parameters.AddWithValue("Side", lastSide);
                    command.Parameters.AddWithValue("SymbolName", currentSymbol.Name);
                    command.ExecuteNonQuery();
                }
                catch(Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
                finally
                {
                    connection.Close();
                }
            }
            else
            {
                Log.WriteApplicationInfo("There is invalid symbol: " + symbol.ToString());
            }
        }

        public List<OrderOrPosition> GetOrdersOrPositions(string UserName)
        {
            var ordersOrPositionsList = new List<OrderOrPosition>();
            try
            {
                lock (_tradingLocker)
                {
                    var userOrders = _activeOrders.Where(ao =>   ao.Account == UserName &&
                                                                (_executions.First(e => e.OrderID == ao.ID).Status == Status.Opened||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilled ||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.OpenedPosition ||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilledPosition ||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.VirtualOrder ||
                                                                _executions.First(e => e.OrderID == ao.ID).Status == Status.VirtualPosition
                                                                )).ToList();

                    userOrders.ForEach(o =>
                    {
                        Category category = new Category();
                        category.Initialize();
                        var currentExecution = _executions.First(e => e.OrderID == o.ID);
                        ordersOrPositionsList.Add(new OrderOrPosition
                        {
                            ID = o.ID,
                            Symbol = _exchanges.ToList().First(e => e.Symbols.First().Symbol.Equals(o.Symbol)).Symbols.First().Symbol,
                            Time = o.Time,
                            Price = o.LimitPrice,
                            Volume = currentExecution.LeaveQuantity,
                            Side = o.Side,
                            Category = category.GetCategoryChain(_exchanges.ToList().First(e => e.Symbols.First().Symbol.Equals(o.Symbol)).Symbols.First().Symbol.CategoryId).Last().Value,
                            isPosition = (currentExecution.Status == Status.OpenedPosition || currentExecution.Status == Status.PartialFilledPosition) ? 1 : 0,
                            isMirror = o.IsMirror
                        });
                        category.Remove();
                    });
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            
            return ordersOrPositionsList.Where(x => x.Volume > 0).OrderByDescending(x => x.Time).ToList();
        }

        public List<OpenedPosition> GetCurrentPositions(string UserName)
        {
            var currentPositions = new List<OpenedPosition>();
            try
            {
                lock (_tradingLocker)
                {
                    var userPositions = AllUserPositions(UserName);
                    userPositions.ForEach(o =>
                    {
                        Category category = new Category();
                        category.Initialize();

                        var currentExecution = _executions.First(e => e.OrderID == o.ID);
                        var currentAvgPrice = GetAvaragePositionPrice(o);
                        var currentSymbol = _exchanges.ToList().First(e => e.Symbols.First().Symbol.Equals(o.Symbol)).Symbols.First().Symbol;
                        var currentVolume = currentExecution.FilledQuantity - currentExecution.PaidUpQuantity;
                        var currentProfitLoss = Side.Buy == o.Side ? Math.Round((currentSymbol.LastBid - currentAvgPrice) * currentVolume, 2) : Math.Round((currentAvgPrice - currentSymbol.LastAsk) * currentVolume, 2);
                        
                        currentPositions.Add(new OpenedPosition
                        {
                            ID = o.ID,
                            Symbol = currentSymbol,
                            Time = o.Time,
                            Price = o.IsMirror == 0 ? currentAvgPrice : 1 - currentAvgPrice,
                            Volume = currentVolume,
                            Side = o.IsMirror == 0 ? (o.Side == Side.Buy ? Side.Buy : Side.Sell) : (o.Side == Side.Buy ? Side.Sell : Side.Buy),
                            Category = category.GetCategoryChain(_exchanges.ToList().First(e => e.Symbols.First().Symbol.Equals(o.Symbol)).Symbols.First().Symbol.CategoryId).Last().Value,
                            isMirror = o.IsMirror,
                            ProfitLoss = currentProfitLoss
                        });
                        category.Remove();
                    });
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return currentPositions.Where(x => x.Volume > 0).OrderByDescending(x => x.Time).ToList();
        }

        public List<GroupPosition> GetGroupCurrentPositions(string UserName)
        {
            var groupPositions = new List<GroupPosition>();
            List<OpenedPosition> currentNonGroupPositions = GetCurrentPositions(UserName);

            groupPositions = currentNonGroupPositions.GroupBy(x => x.Symbol.Name).Select(x => new GroupPosition
            {
                Symbol = x.FirstOrDefault().Symbol,
                CommonSymbolProfitLoss = x.Sum(y => y.ProfitLoss),
                CommonSymbolVolume = x.Sum(y => y.Volume),
                Category = x.FirstOrDefault().Category,
                SubPositions = x.GroupBy(y => y.isMirror).Select(y => new SubPosition
                {
                    ID = x.FirstOrDefault().Symbol.ToString(),
                    EventName = y.FirstOrDefault().isMirror == 0 ? x.FirstOrDefault().Symbol.HomeName : x.FirstOrDefault().Symbol.AwayName,
                    EventHandicap = y.FirstOrDefault().isMirror == 0 ? x.FirstOrDefault().Symbol.HomeHandicap.ToString() : x.FirstOrDefault().Symbol.AwayHandicap.ToString(),
                    Side = y.FirstOrDefault().Side,
                    AvgPrice = y.Sum(z => z.Price * z.Volume) / y.Sum(z => z.Volume),
                    CommonVolume = y.Sum(z => z.Volume),
                    CommonProfitLoss = y.Sum(z => z.ProfitLoss),
                    IsMirror = y.FirstOrDefault().isMirror
                }).OrderBy(y => y.IsMirror).ToList()
            }).ToList();

            return groupPositions;
        }

        private decimal GetAvaragePositionPrice(NewOrderRequest position)
        {
            List<PartialExecution> partialPositions = new List<PartialExecution>();
            SqlConnection connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText = "SELECT [Time], [Price], [Quantity] FROM [PartialExecutions] WHERE [ExistingOrder] = @orderId OR [NewOrder] = @orderId ORDER BY [Time] ASC";
                command.Parameters.AddWithValue("orderId", position.ID);
                SqlDataReader reader = command.ExecuteReader();
                while(reader.Read())
                {
                    partialPositions.Add(new PartialExecution { Time = reader.GetDateTime(0), Price = reader.GetDecimal(1), Quantity = reader.GetInt64(2)});
                }
                reader.Close();

            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            finally
            {
                connection.Close();
            }

            Execution currentExecution = _executions.First(e => e.OrderID == position.ID);
            long currentPaidUp = currentExecution.PaidUpQuantity;

            decimal totalPrice = 0m;
            long totalQuantity = 0L;
            decimal averagePrice = 0m;

            partialPositions.ForEach(x =>
            {
                var localPaidUp = Math.Min(x.Quantity, currentPaidUp);
                currentPaidUp -= localPaidUp;
                if(currentPaidUp == 0)
                {
                    totalQuantity = x.Quantity - localPaidUp;
                    totalPrice = totalQuantity * x.Price;
                }
            });
            if(totalQuantity != 0)
            {
                averagePrice = totalPrice / totalQuantity;
            }
            return averagePrice;
        }

        public List<HistoryTradeItem> GetHistoryTradeItems(string UserName)
        {
            List<HistoryTradeItem> tradeItems = new List<HistoryTradeItem>();
            List<PartialExecution> userPartialExecutions = new List<PartialExecution>();
            SqlConnection connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText = "SELECT [Time], [ExistingOrder], [MakerAccount], [NewOrder], [TakerAccount], [Price], [Quantity] FROM [PartialExecutions] WHERE [MakerAccount] = @Account OR [TakerAccount] = @Account ORDER BY [Time] ASC";
                command.Parameters.AddWithValue("Account", UserName);
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    userPartialExecutions.Add(new PartialExecution{ Time = reader.GetDateTime(0),
                                                                    ExistingOrderID = reader.GetString(1),
                                                                    MakerAccount = reader.GetString(2),
                                                                    NewOrderID = reader.GetString(3),
                                                                    TakerAccount = reader.GetString(4),
                                                                    Price = reader.GetDecimal(5),
                                                                    Quantity = reader.GetInt64(6)
                                                                    });
                }
                reader.Close();

                userPartialExecutions.ForEach(x =>
                {
                    string fullOrderID = x.MakerAccount == UserName ? x.ExistingOrderID : x.NewOrderID;
                    var currentOrder = _activeOrders.FirstOrDefault(ao => ao.ID == fullOrderID);
                    if(currentOrder == null)
                    {
                        command = connection.CreateCommand();
                        command.CommandText = "SELECT [SymbolID], [Side], [IsMirror] FROM [Orders] WHERE [ID] = @Id";
                        command.Parameters.AddWithValue("Id", fullOrderID);
                        reader = command.ExecuteReader();
                        while(reader.Read())
                        {
                            currentOrder = new NewOrderRequest
                            {
                                Symbol = _exchanges.First(e => e.Symbols.First().ID == reader.GetString(0)).Symbols.First().Symbol,
                                Side = reader.GetByte(1) == 0 ? Side.Buy : Side.Sell,
                                IsMirror = reader.GetByte(2)
                            };
                        }
                        reader.Close();
                    }
                    tradeItems.Add(new HistoryTradeItem
                    {
                        Symbol = _exchanges.Find(e => e.Symbols.First().Symbol.Equals(currentOrder.Symbol)).Symbols.First().Symbol,
                        Time = x.Time.ToUniversalTime(),
                        Side = currentOrder.Side,
                        IsMaker = x.MakerAccount == UserName && x.MakerAccount != x.TakerAccount ? 1 : 0,
                        //Fees = x.MakerAccount == x.TakerAccount ? x.Quantity * (Fee.TakerFee - Fee.MakerFee) : (x.MakerAccount == UserName ? x.Quantity * Fee.MakerFee : x.Quantity * Fee.TakerFee),
                        Price = x.Price,
                        Quantity = x.Quantity,
                        IsMirror = currentOrder.IsMirror
                    });
                });
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            finally
            {
                connection.Close();
            }

            return tradeItems.OrderByDescending(x => x.Time).ToList();
        }

        public List<CurrentOrders> TransformToCurrentOrdersModel(List<OrderOrPosition> orders)
        {
            lock(_tradingLocker)
            {
                var straightOrders = orders.GroupBy(x => x.Symbol.Name).Select(x => new CurrentOrders
                {
                    ID = x.First().Symbol.ToString(),
                    Symbol = x.First().Symbol.HomeName,
                    LastPrice = _exchanges.ToList().First(e => e.Symbols.First().Symbol.Name == x.First().Symbol.Name).Symbols.First().Symbol.LastPrice,
                    LastSide = _exchanges.ToList().First(e => e.Symbols.First().Symbol.Name == x.First().Symbol.Name).Symbols.First().Symbol.LastSide,
                    Positions = orders.Where(y => y.Symbol.Name == x.First().Symbol.Name && y.isPosition == 1 && y.isMirror == 0).Sum(z => z.Volume),
                    Orders = orders.Where(y => y.Symbol.Name == x.First().Symbol.Name && y.isMirror == 0).ToList()
                }).Where(x => x.Orders.Count != 0).ToList();
                var mirrorOrders = orders.GroupBy(x => x.Symbol.Name).Select(x => new CurrentOrders
                {
                    ID = string.Format(x.First().Symbol.ToString() + "_mirror"),
                    Symbol = x.First().Symbol.AwayName,
                    LastPrice = 1 - _exchanges.ToList().First(e => e.Symbols.First().Symbol.Name == x.First().Symbol.Name).Symbols.First().Symbol.LastPrice,
                    LastSide = _exchanges.ToList().First(e => e.Symbols.First().Symbol.Name == x.First().Symbol.Name).Symbols.First().Symbol.LastSide == Side.Buy ? Side.Sell : Side.Buy,
                    Positions = orders.Where(y => y.Symbol.Name == x.First().Symbol.Name && y.isPosition == 1 && y.isMirror == 1).Sum(z => z.Volume),
                    Orders = orders.Where(y => y.Symbol.Name == x.First().Symbol.Name && y.isMirror == 1).ToList()
                }).Where(x => x.Orders.Count != 0).ToList();
                straightOrders.AddRange(mirrorOrders);

                return straightOrders;
            }
        }

        private List<NewOrderRequest> AllUserPositions(string userName)
        {
            lock(_tradingLocker)
            {
                return _activeOrders.Where(ao => ao.Account == userName &&
                                                            (_executions.First(e => e.OrderID == ao.ID).Status == Status.Filled ||
                                                            _executions.First(e => e.OrderID == ao.ID).Status == Status.PartialFilled) &&
                                                            _executions.First(e => e.OrderID == ao.ID).FilledQuantity - _executions.First(e => e.OrderID == ao.ID).PaidUpQuantity > 0
                                                            ).ToList();
            }
        }

        internal long NumberOfUsersPositionBySymbol(string userName, Symbol symbol)
        {
            lock(_tradingLocker)
            {
                var userPositions = AllUserPositions(userName).Where(x => x.Symbol.Name == symbol.Name).ToList();
                var result = userPositions.Sum(u => _executions.First(e => e.OrderID == u.ID).FilledQuantity - _executions.First(e => e.OrderID == u.ID).PaidUpQuantity);
                return result;
            }
        }

        internal decimal GainLossUserBySymbol(string userName, Symbol symbol)
        {
            decimal result = 0m;
            try
            {
                lock (_tradingLocker)
                {
                    var user = _users.FirstOrDefault(u => u.UserName == userName);
                    if (user != null)
                    {
                        var userPositions = AllUserPositions(userName);
                        userPositions.Where(x => x.Symbol.Name == symbol.Name).ToList().ForEach(userPosition =>
                        {
                            Symbol currentSymbol = _exchanges.ToList().FirstOrDefault(e => e.Symbols.First().Symbol.Name == userPosition.Symbol.Name).Symbols.First().Symbol;
                            Execution currentExecution = _executions.FirstOrDefault(e => e.OrderID == userPosition.ID);
                            long positionQuantity = currentExecution.FilledQuantity - currentExecution.PaidUpQuantity;
                            decimal positionPrice = CommonCurrentOrderPrice(currentExecution, false);

                            if (userPosition.Side == Side.Buy)
                            {
                                result += currentSymbol.LastBid * positionQuantity - positionPrice;
                            }
                            else
                            {
                                result += positionPrice - currentSymbol.LastAsk * positionQuantity;
                            }
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return result;
        }

        internal decimal UserExposureBySymbol(string userName, Symbol symbol)
        {
            decimal result = 0m;
            try
            {
                lock (_tradingLocker)
                {
                    var user = _users.FirstOrDefault(u => u.UserName == userName);
                    if (user != null)
                    {
                        var currenrExecutions = _executions.Where(e => _activeOrders.First(_ao => _ao.ID == e.OrderID).Account == userName &&
                            _activeOrders.First(_ao => _ao.ID == e.OrderID).Symbol.Name == symbol.Name &&
                            (e.Status == Status.Opened || e.Status == Status.PartialFilled || e.Status == Status.Filled) &&
                            (e.FilledQuantity != 0 ? (e.FilledQuantity + e.LeaveQuantity) > e.PaidUpQuantity : true)).ToList();
                        if (currenrExecutions.Any())
                        {
                            result = currenrExecutions.Sum(e => CommonCurrentOrderPrice(e, true));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return result;
        }

        public UserMoneyData HeartBeatAccountData(string username)
        {
            return new UserMoneyData
            {
                Available = GetUserBalance(username),
                Exposure = GetUserInvested(username),
                Profitlost = GetUserGainLost(username)
            };
        }

        public List<AllSymbolsAndOrders> HeartBeatActiveOders(string username, string symbol = null)//Active trader
        {
            var result = new List<AllSymbolsAndOrders>();
            try
            {
                lock(_tradingLocker)
                {
                    var orders = _activeOrders.Join(_executions, ao => ao.ID, e => e.OrderID, (ao, e) => new { ActiveOrders = ao, Executions = e }).ToList();

                    result = orders.GroupBy(ao => ao.ActiveOrders.Symbol.Name).Select(ao => new AllSymbolsAndOrders
                                {
                                    Symbol = _exchanges.ToList().First(e => e.Symbols.First().Symbol.Name == ao.First().ActiveOrders.Symbol.Name).Symbols.First().Symbol,
                                    Orders = ao.
                                    Where(x => x.Executions.LeaveQuantity != 0 && x.Executions.Status != Status.VirtualOrder && x.Executions.Status != Status.VirtualPosition).
                                    GroupBy(x1 => x1.ActiveOrders.Side).
                                    Select(x1 => new ActiveOrder
                                    {
                                        Side = x1.First().ActiveOrders.Side,
                                        SummaryPositionPrice = x1.OrderBy(x2 => x2.ActiveOrders.LimitPrice).GroupBy(y => y.ActiveOrders.LimitPrice).Select(y => new SummaryPositionPrice
                                        {
                                            Price = y.First().ActiveOrders.LimitPrice,
                                            Quantity = y.Sum(z => z.Executions.LeaveQuantity),
                                            ParticularUserQuantity = y.Where(z => z.ActiveOrders.Account == username).Sum(z => z.Executions.LeaveQuantity)
                                        }).ToList(),
                                    }).ToList(),
                                    Positions = NumberOfUsersPositionBySymbol(username, ao.First().ActiveOrders.Symbol),
                                    GainLoss = GainLossUserBySymbol(username, ao.First().ActiveOrders.Symbol),
                                    Invested = UserExposureBySymbol(username, ao.First().ActiveOrders.Symbol)
                                }).ToList();
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }

            if(symbol != null)//remove waste data
            {
                result = result.Where(r => r.Symbol.Exchange == symbol).ToList();
            }

            return result;
        }
        
        public List<GraphBars> HeartBeatBars(string symbol = null)
        {
            var result = new List<GraphBars>();
            try
            {
                lock(_exchanges)
                {
                    //result = _exchanges.Where(e => e.Symbols.First().Symbol.Exchange == symbol).Select(exchange => exchange.Symbols.First()).Select(s => new GraphBars
                    result = _exchanges.Select(exchange => exchange.Symbols.First()).Select(s => new GraphBars
                                {
                                    Symbol = s.Symbol,
                                    Ticks = GetHistory(new HistoryParameters
                                    {
                                        Symbol = s.Symbol,
                                        BarsCount = 9999,
                                        Currency = "USD",
                                        Interval = 1,
                                        Periodicity = Periodicity.Secondly
                                    })
                                }).ToList();
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }

            //if (symbol != null)//remove waste data
            //{
            //    result = result.Where(r => r.Symbol.Exchange == symbol).ToList();
            //}

            return result;
        }

        public List<GraphBars> HeartBeatEventData()
        {
            var result = new List<GraphBars>();
            try
            {
                lock(_exchanges)
                {
                    result = _exchanges.Select(exchange => exchange.Symbols.First()).Select(symbol => new GraphBars
                    {
                        Symbol = symbol.Symbol,
                        Ticks = GetHistory(new HistoryParameters
                        {
                            Symbol = symbol.Symbol,
                            BarsCount = 9999,
                            Currency = "USD",
                            Interval = 1,
                            Periodicity = Periodicity.Minutely
                        })
                    }).ToList();
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }

            return result;
        }

        public List<AllSymbolsAndOrders> GetAllSymbolsAndExchanges(string userName = null, string pageNumber = null, string path = null, string sortType = "closingsoon")//main page orders
        {
            List<AllSymbolsAndOrders> result = new List<AllSymbolsAndOrders>();
            try
            {
                lock (_tradingLocker)
                {
                    var ordersAndExecutions = _activeOrders.Join(_executions, ao => ao.ID, e => e.OrderID, (ao, e) => new { ActiveOrders = ao, Executions = e }).ToList();

                    result = _exchanges.ToList().Select(e => new AllSymbolsAndOrders
                    {
                        Orders = ordersAndExecutions.
                            Where(ao => ao.ActiveOrders.Symbol.Name == e.Symbols.Single().Symbol.Name &&
                                ao.Executions.LeaveQuantity != 0 &&
                                ao.Executions.Status != Status.VirtualOrder &&
                                ao.Executions.Status != Status.VirtualPosition).
                            GroupBy(y => y.ActiveOrders.Side).Select(y => new ActiveOrder
                            {
                                SummaryPositionPrice = (y.First().ActiveOrders.Side == Side.Buy)
                                    ? y.OrderByDescending(x1 => x1.ActiveOrders.LimitPrice).GroupBy(x1 => x1.ActiveOrders.LimitPrice).Select(x1 => new SummaryPositionPrice { Price = x1.First().ActiveOrders.LimitPrice, Quantity = x1.Sum(x2 => x2.Executions.LeaveQuantity) }).Take(3).OrderBy(x1 => x1.Price).ToList()
                                    : y.OrderBy(x1 => x1.ActiveOrders.LimitPrice).GroupBy(x1 => x1.ActiveOrders.LimitPrice).Select(x1 => new SummaryPositionPrice { Price = x1.First().ActiveOrders.LimitPrice, Quantity = x1.Sum(x2 => x2.Executions.LeaveQuantity) }).Take(3).ToList(),
                                Side = y.First().ActiveOrders.Side
                            }).ToList(),
                        Symbol = e.Symbols.Single().Symbol,
                        Positions = userName == null ? 0 : NumberOfUsersPositionBySymbol(userName, e.Symbols.Single().Symbol),
                        GainLoss = userName == null ? 0m : GainLossUserBySymbol(userName, e.Symbols.Single().Symbol),
                        Invested = userName == null ? 0m : UserExposureBySymbol(userName, e.Symbols.Single().Symbol),
                        CategoryUrl = string.Format("/eng/event/{0}?exchange={1}&reflection=", string.Join("/", CategoryUrlChain(e.Symbols.Single().Symbol.CategoryId, true)), e.Symbols.Single().Symbol.UrlExchange),
                        CategoryChain = string.Join("/", CategoryUrlChain(e.Symbols.Single().Symbol.CategoryId, true)),
                        CategoryIcon = GetExchangeIconById(e.Symbols.Single().Symbol.CategoryId),
                        CategoryBreadcrumbs = CategoryBreadcrumbs(path),
                        TimeRemains = e.EndDate - DateTime.UtcNow
                    }).Where(s => s.Symbol.Status != StatusEvent.New && s.Symbol.Status != StatusEvent.Settlement).ToList();
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }

            result = CommonSortMethod(result, sortType);

            if(!string.IsNullOrEmpty(path))
            {
                result = result.Where(r => r.CategoryUrl.Contains(path)).ToList();
            }

            if(pageNumber != "0" && pageNumber != null && int.Parse(pageNumber).GetType() == typeof(int))
            {
                int Page = int.Parse(pageNumber);

                var paginatedResult = new List<AllSymbolsAndOrders>();
                for (int i = 0; i < result.Count; i++)
                {
                    if (i >= (Page - 1) * itemsOnPage && i < (Page - 1) * itemsOnPage + itemsOnPage)
                    {
                        paginatedResult.Add(result[i]);
                    }
                }
                return paginatedResult;
            }
            
            return result;
        }

        private List<AllSymbolsAndOrders> CommonSortMethod(List<AllSymbolsAndOrders> data, string sortType)
        {
            List<AllSymbolsAndOrders> result = null;
            Sort sortTypeEnum = Sort.ClosingSoon;
            if(sortType != null)
            {
                sortTypeEnum = (Sort)Enum.Parse(typeof(Sort), sortType, true);
            }
            
            switch (sortTypeEnum)
            {
                case Sort.Movers:
                    result = MoversSort(data);
                    break;
                case Sort.New:
                    result = NewSort(data);
                    break;
                case Sort.Popular:
                    result = PopularSort(data);
                    break;
                default:
                    result = ClosingSoonSort(data);
                    break;
            }
            return result;
        }

        private List<AllSymbolsAndOrders> PopularSort(List<AllSymbolsAndOrders> result)
        {
            return result.OrderByDescending(x => x.Symbol.SortingData.Count != 0 ? x.Symbol.SortingData.Sum(y => y.Quantity) : 0).ToList();
        }

        private List<AllSymbolsAndOrders> NewSort(List<AllSymbolsAndOrders> result)
        {
            return result.OrderByDescending(x => x.Symbol.ApprovedDate).ToList();
        }

        private List<AllSymbolsAndOrders> MoversSort(List<AllSymbolsAndOrders> result)
        {
            return result.OrderByDescending(x => x.Symbol.SortingData.Count != 0 ? x.Symbol.SortingData.Max(y => y.Price) - x.Symbol.SortingData.Min(y => y.Price) : 0).ToList();
        }

        private List<AllSymbolsAndOrders> ClosingSoonSort(List<AllSymbolsAndOrders> result)
        {
            return result.OrderBy(x => x.Symbol.StartDate).ToList();
        }

        public int GetItemsOnPage()
        {
            return itemsOnPage;
        }

        public List<string> CategoryUrlChain(Guid id, bool flag)
        {
            if (flag) categoriesUrl.Clear();
            var currentCategory = _categories.First(c => c.CatId == id);

            if (currentCategory.CatParentId != Guid.Empty)
            {
                categoriesUrl.Add(currentCategory.CatUrl);
                CategoryUrlChain(currentCategory.CatParentId, false);
            }
            else
            {
                categoriesUrl.Add(currentCategory.CatUrl);
                categoriesUrl.Reverse();
            }
           
            return categoriesUrl;
        }

        public List<CategoryItem> CategoryBreadcrumbs(string path)
        {
            var categories = new List<CategoryItem>();

            if (path == null) return categories;

            var arrUrl = path.Split('/');
            categories.AddRange(arrUrl.Select(item => GetAllCategories().FirstOrDefault(c => c.CatUrl == item)));

            return categories;
        }
        
        public string GetExchangeIconById(Guid id)
        {
            while (true)
            {
                var currentCategory = _categories.First(c => c.CatId == id);

                if (currentCategory.CatIcon != null)
                    return currentCategory.CatIcon;

                id = currentCategory.CatParentId;
            }
        }

        public List<CategoryItem> GetAllCategories()
        {
            var result = new List<CategoryItem>();

            try
            {
                result = _categories.ToList().Select(c => new CategoryItem
                {
                    CatId = c.CatId,
                    CatName = c.CatName,
                    CatParentId = c.CatParentId,
                    CatUrl = c.CatUrl,
                    CatIcon = c.CatIcon,
                    CatPosition = c.CatPosition,
                    CatUrlChain = string.Join("/", CategoryUrlChain(c.CatId, true))
                }).ToList();
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            
            return result;
        }

        public string AddCategory(CategoryRequest request)
        {
            string result;
            
            lock (_exchanges)
            {
                //check events
                if (_exchanges.All(e => e.Symbols.First().Symbol.CategoryId != request.ParentId))
                {
                    //check unique Name, URL
                    if (_categories.All(c => c.CatName != request.Name))
                    {
                        if (_categories.All(u => u.CatUrl != request.Url))
                        {
                            using (SqlConnection connection = new SqlConnection(_connectionString))
                            {
                                try
                                {
                                    //refactoring
                                    var position = _categories.Where(d => d.CatParentId == request.ParentId).Select(p => p.CatPosition).DefaultIfEmpty(0).Max() + 1;

                                    connection.Open();
                                    var command = connection.CreateCommand();
                                    command.CommandText = "INSERT INTO [Category] VALUES (@Id, @Name, @Parent_Id, @Url, @Icon, @Position, 0)";
                                    command.Parameters.AddWithValue("Id", request.Id);
                                    command.Parameters.AddWithValue("Name", request.Name);
                                    if (request.ParentId != Guid.Empty)
                                    {
                                        command.Parameters.AddWithValue("Parent_Id", request.ParentId);
                                    }
                                    else
                                    {
                                        command.Parameters.AddWithValue("Parent_Id", DBNull.Value);
                                    }
                                    command.Parameters.AddWithValue("Url", request.Url);
                                    command.Parameters.AddWithValue("Icon", request.Icon ?? (object) DBNull.Value);
                                    command.Parameters.AddWithValue("Position", position);
                                    command.ExecuteNonQuery();

                                    _categories.Add(new CategoryItem
                                    {
                                        CatId = request.Id,
                                        CatName = request.Name,
                                        CatParentId = request.ParentId,
                                        CatUrl = request.Url,
                                        CatIcon = request.Icon,
                                        CatPosition = position
                                    });

                                    result = "200";
                                }
                                catch (Exception ex)
                                {
                                    result = "100";
                                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                                }
                            }
                        }
                        else
                        {
                            result = "102";
                        }
                    }
                    else
                    {
                        result = "101";
                    }
                }
                else
                {
                    result = "103";
                }
            }

            return result; 
        }

        public string EditCategory(CategoryRequest request)
        {
            string result;
            
            //check unique Name, URL
            if (_categories.Where(d => d.CatId != request.Id).All(c => c.CatName != request.Name))
            {
                if (_categories.Where(d => d.CatId != request.Id).All(c => c.CatUrl != request.Url))
                {
                    using (SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        try
                        {
                            connection.Open();
                            var command = connection.CreateCommand();
                            command.CommandText = "UPDATE [Category] SET [Name] = @Name, [Url] = @Url, [Icon] = @Icon WHERE [Id] = @Id";
                            command.Parameters.AddWithValue("Id", request.Id);
                            command.Parameters.AddWithValue("Name", request.Name);
                            command.Parameters.AddWithValue("Url", request.Url);
                            command.Parameters.AddWithValue("Icon", request.Icon ?? (object) DBNull.Value);
                            command.ExecuteNonQuery();

                            _categories.Where(c => c.CatId == request.Id).ToList().ForEach(item =>
                            {
                                item.CatName = request.Name;
                                item.CatUrl = request.Url;
                                item.CatIcon = request.Icon;
                            });

                            result = "200";
                        }
                        catch (Exception ex)
                        {
                            result = "100";
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                        }
                    }
                }
                else
                {
                    result = "102";
                }
            }
            else
            {
                result = "101";
            }
            return result; 
        }

        public string DeleteCategory(Guid id)
        {
            string result;

            lock (_exchanges)
            {
                //check events
                if (_exchanges.All(e => e.Symbols.First().Symbol.CategoryId != id))
                {
                    using (SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        try
                        {
                            connection.Open();
                            var command = connection.CreateCommand();
                            command.CommandText = "UPDATE [Category] SET [isDeleted] = 1 WHERE [Id] = @Id";
                            command.Parameters.AddWithValue("Id", id);
                            command.ExecuteNonQuery();

                            _categories.RemoveAll(c => c.CatId == id);
                            
                            result = "200";
                        }
                        catch (Exception ex)
                        {
                            result = "100";
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                        }
                    }
                }
                else
                {
                    result = "103";
                }
            }
            return result;
        }

        public string MoveCategory(Guid id, int position)
        {
            string result = "100";

            if (position > 0)
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    try
                    {
                        connection.Open();
                        var transaction = connection.BeginTransaction();
                        SqlCommand command;
                        lock (_categories)
                        {
                            var currentCategory = _categories.FirstOrDefault(c => c.CatId == id);

                            if (currentCategory != null)
                            {
                                var categories = currentCategory.CatPosition > position
                                    ? _categories.Where(c =>
                                            c.CatParentId == currentCategory.CatParentId && c.CatPosition >= position &&
                                            c.CatPosition < currentCategory.CatPosition).OrderBy(p => p.CatPosition).ToList()
                                    : _categories.Where(c =>
                                            c.CatParentId == currentCategory.CatParentId && c.CatPosition <= position &&
                                            c.CatPosition > currentCategory.CatPosition).OrderBy(p => p.CatPosition).ToList();

                                categories.ForEach(item =>
                                {
                                    command = connection.CreateCommand();
                                    command.Transaction = transaction;
                                    command.CommandText = "UPDATE [Category] SET [Position] = @Position WHERE [Id] = @Id";
                                    command.Parameters.AddWithValue("Id", item.CatId);
                                    command.Parameters.AddWithValue("Position", currentCategory.CatPosition > position ? ++item.CatPosition : --item.CatPosition);
                                    command.ExecuteNonQuery();

                                    _categories.First(c => c.CatId == item.CatId).CatPosition = item.CatPosition;
                                });

                                command = connection.CreateCommand();
                                command.Transaction = transaction;
                                command.CommandText = "UPDATE [Category] SET [Position] = @Position WHERE [Id] = @Id";
                                command.Parameters.AddWithValue("Id", id);
                                command.Parameters.AddWithValue("Position", position);
                                command.ExecuteNonQuery();

                                _categories.First(c => c.CatId == id).CatPosition = position;

                                transaction.Commit();
                                result = "200";
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        result = "100";
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                    }
                }
            }

            return result;
        }

        public void CancelationMultipleOrder(Model.Order order)
        {
            Side ordersSide = order.Side == 0 ? Side.Buy : Side.Sell;

            var ordersToCancel = _activeOrders.Where(ao => ao.Account == order.AccountID && ao.Symbol.Name == order.Symbol.Name && ao.LimitPrice == order.LimitPrice && ao.Side == ordersSide).ToList();
            ordersToCancel.ForEach(x => 
            {
                ProcessRequest(new CancelOrderRequest { ID = x.ID});
            });
        }

        ~DataFeed()
        {
            Log.WriteApplicationInfo("destructor");
        }
    }   
}
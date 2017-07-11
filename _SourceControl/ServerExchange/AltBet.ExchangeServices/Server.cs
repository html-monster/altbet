
/* WARNING! This program and source code is owned and licensed by 
   Modulus Financial Engineering, Inc. http://www.modulusfe.com
   Viewing or use this code requires your acceptance of the license
   agreement found at http://www.modulusfe.com/support/license.pdf
   Removal of this comment is a violation of the license agreement.
   Copyright 2002-2016 by Modulus Financial Engineering, Inc. */

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using SuperSocket.SocketBase;
using SuperWebSocket;
using System.Data;
using System.Threading;
using System.IO;
using System.Runtime.Serialization.Json;
using System.ServiceModel.Syndication;
using SuperSocket.SocketBase.Config;
using AltBet.Exchange.WebSocketSender;
using AltBet.Exchange.Serializator;
using System.Diagnostics;
using System.Net;
using System.Runtime.Serialization;
using AltBet.Model;
using GIDX.SDK.Models.CustomerIdentity;
using GIDX.SDK.Models.WebReg;
using GIDX.SDK.Models.WebCashier;

namespace AltBet.Exchange
{
    //messages exchange class
    public class Server
    {
        private class AdminSession
        {
            public string UserName;
            public WebSocketSession Session;
        }

        private class SubscribedSymbol
        {
            public Symbol Symbol;
        }

        private string _connectionString = ConfigurationManager.ConnectionStrings["MyExchange"].ConnectionString;

        private List<AdminSession> _admins = new List<AdminSession>();

        private DataFeed _dataFeed = null;
        private WebSocketServer _wsServer = null;
        private List<UserSession> _connectedUsers = new List<UserSession>();

        private bool _started;

        public static string ErrorServer;

        //start web socket listeners for admin and user sessions
        public string Start()
        {
            _started = false;
            string result = "";
            
            _dataFeed = new DataFeed();
            result = _dataFeed.Start();                    
            if (!string.IsNullOrEmpty(result))
            {
                _dataFeed.Stop();
            }
            else
            {
                lock (_connectedUsers)
                {
                    _connectedUsers = _dataFeed.GetActiveUsers();
                    //.Select(x => new UserSession
                    //{
                        //UserName = x
                    //}).ToList();
                }
                _dataFeed.OnNotificationInfo += DataFeed_OnNotificationInfo;
                _dataFeed.OnExecution += DataFeed_OnExecution;
                _dataFeed.OnAccountInfo += DataFeed_OnAccountInfo;
                _dataFeed.OnCancelOrder += OnCancelOrderRequestMethod;
                _started = true;
                Thread heartBeat = new Thread(HeartBeatMethod);
                heartBeat.Start();
            }
            
            _wsServer = new WebSocketServer();
            bool wsServerSetupResult = _wsServer.Setup((new ServerConfig() { Port = 2001, MaxRequestLength = short.MaxValue, MaxConnectionNumber = short.MaxValue, ClearIdleSession = false, KeepAliveInterval = 10 }));
            if (wsServerSetupResult)
            {
                _wsServer.NewMessageReceived += wsServer_NewMessageReceived;
                _wsServer.SessionClosed += wsServer_SessionClosed;
                bool serverStartResult = _wsServer.Start();
                if (!serverStartResult)
                {
                    result = "Server has not been started after start attempt";
                }
            }
            else
            {
                result = "Server has not been started, invalid server config";
            }

            return result;
        }

        public void Stop()
        {
            _started = false;

            _dataFeed.OnNotificationInfo -= DataFeed_OnNotificationInfo;
            _dataFeed.OnExecution -= DataFeed_OnExecution;
            _dataFeed.OnAccountInfo -= DataFeed_OnAccountInfo;
            _dataFeed.OnCancelOrder -= OnCancelOrderRequestMethod;
            _dataFeed.Stop();
            _dataFeed = null;

            _wsServer.Stop();
            _wsServer = null;
        }

        protected bool InProgress { get; set; }
        protected void Wait()
        {
            DateTime start = DateTime.UtcNow;

            while (InProgress)
            {
                if ((DateTime.UtcNow - start).Seconds > 4)
                {
                    InProgress = false;
                }
            }
        }

        private void wsServer_SessionClosed(WebSocketSession session, SuperSocket.SocketBase.CloseReason value)
        {
            try
            {
                UserSession user = null;
                lock (_connectedUsers)
                {
                   // user = _connectedUsers.Where(x => x.SessionPage != null).FirstOrDefault(x => x.SessionPage.FirstOrDefault(y => y.Key.SessionID == session.SessionID).Key.SessionID == session.SessionID);

                    _connectedUsers.Where(x => x.SessionPage != null).ToList().ForEach(u =>
                        {
                            var sessionPages = u.SessionPage;
                            foreach (var sesPage in sessionPages)
                            {
                                if (sesPage.Key.SessionID == session.SessionID)
                                {
                                    user = u;
                                    break;
                                }
                            }
                        });
                }

                //if(user == null)
                //{
                //    throw new ApplicationException("User cannot be null");
                //}

                //if(user.isAuthUser == false)
                //{
                //    _connectedUsers.Remove(user);
                //}
                //else
                //{
                //    user.SessionPage.Remove(session);
                //}
                if (user != null)
                {
                    if (user.isAuthUser == false)
                    {
                        _connectedUsers.Remove(user);
                        _dataFeed.RemoveSession(new UserSession
                        {
                            UserName = user.UserName,
                            UserBrowser = user.UserBrowser,
                            UserIp = user.UserIp
                        });

                    }
                    else
                    {
                        user.SessionPage.Remove(session);
                    }
                }
                if (value != CloseReason.ClientClosing)
                {
                    throw new ApplicationException("Close reason: " + value.ToString());
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            
            
        }
        private void wsServer_NewMessageReceived(WebSocketSession session, string value)
        {
            var jsonSerializer = new JsonSerializer();
            UserSubscriptions userSubscriptions = jsonSerializer.Deserialize<UserSubscriptions>(value);
            userSubscriptions.UserIp = session.RemoteEndPoint.Address.MapToIPv4().ToString();

            try
            {
                if (userSubscriptions != null && userSubscriptions.PageName != null)
                {
                    var pageName = (SubscribeEnum)Enum.Parse(typeof(SubscribeEnum), userSubscriptions.PageName, true);
                    lock (_connectedUsers)
                    {
                        UserSession connectedUser = _connectedUsers.FirstOrDefault(x => x.UserName == userSubscriptions.User && x.UserBrowser == userSubscriptions.UserBrowser && x.UserIp == userSubscriptions.UserIp);
                        if (connectedUser != null)
                        {
                            if (connectedUser.SessionPage != null && connectedUser.SessionPage.Any())//session exists
                            {
                                var existingSession = connectedUser.SessionPage.FirstOrDefault(x => x.Key.SessionID == session.SessionID);
                                if (existingSession.Key != null)//page exists
                                {
                                    if (existingSession.Value.Key == pageName)
                                    {
                                        string[] pageParams = existingSession.Value.Value;
                                        pageParams[0] = pageName == SubscribeEnum.MainPage ? userSubscriptions.PaginationNumber : null;
                                        pageParams[1] = userSubscriptions.ExchangeName;
                                        pageParams[2] = userSubscriptions.ActiveTrader;
                                        pageParams[3] = userSubscriptions.CurrentOrders;
                                        pageParams[4] = pageName == SubscribeEnum.MainPage ? userSubscriptions.CategoryPath : null;
                                        pageParams[5] = pageName == SubscribeEnum.MainPage ? userSubscriptions.Sort : null;
                                        pageParams[6] = pageName == SubscribeEnum.MainPage ? userSubscriptions.MainPageChartsSymbol : null;
                                    }
                                    else
                                    {
                                        throw new ApplicationException("The same session with different pages");
                                    }
                                }
                                else//session absent
                                {
                                    connectedUser.SessionPage.Add(session, new KeyValuePair<SubscribeEnum, string[]>(pageName, new string[] {
                                    pageName == SubscribeEnum.MainPage ? userSubscriptions.PaginationNumber : null,
                                    userSubscriptions.ExchangeName,
                                    userSubscriptions.ActiveTrader,
                                    userSubscriptions.CurrentOrders,
                                    pageName == SubscribeEnum.MainPage ? userSubscriptions.CategoryPath : null,
                                    pageName == SubscribeEnum.MainPage ? userSubscriptions.Sort : null,
                                    pageName == SubscribeEnum.MainPage ? userSubscriptions.MainPageChartsSymbol : null
                                    }));
                                }
                            }
                            else
                            {
                                connectedUser.SessionPage = new Dictionary<IWebSocketSession, KeyValuePair<SubscribeEnum, string[]>>
                                { 
                                    { 
                                        session, new KeyValuePair<SubscribeEnum, string[]>(pageName, new string[]{
                                            pageName == SubscribeEnum.MainPage ? userSubscriptions.PaginationNumber : null,
                                            userSubscriptions.ExchangeName,
                                            userSubscriptions.ActiveTrader,
                                            userSubscriptions.CurrentOrders,
                                            pageName == SubscribeEnum.MainPage ? userSubscriptions.CategoryPath : null,
                                            pageName == SubscribeEnum.MainPage ? userSubscriptions.Sort : null,
                                            pageName == SubscribeEnum.MainPage ? userSubscriptions.MainPageChartsSymbol : null
                                        })
                                    }
                                };
                            }
                        }
                        else
                        {
                            UserSession existingSession = _connectedUsers.Where(x => x.SessionPage != null).FirstOrDefault(x => x.SessionPage.FirstOrDefault().Key == session);
                            if (existingSession != null)
                            {
                                if (existingSession.SessionPage.First().Value.Key == pageName)
                                {
                                    string[] pageParams = existingSession.SessionPage.First().Value.Value;
                                    pageParams[0] = pageName == SubscribeEnum.MainPage ? userSubscriptions.PaginationNumber : null;
                                    pageParams[1] = userSubscriptions.ExchangeName;
                                    pageParams[2] = userSubscriptions.ActiveTrader;
                                    pageParams[3] = userSubscriptions.CurrentOrders;
                                    pageParams[4] = pageName == SubscribeEnum.MainPage ? userSubscriptions.CategoryPath : null;
                                    pageParams[5] = pageName == SubscribeEnum.MainPage ? userSubscriptions.Sort : null;
                                    pageParams[6] = pageName == SubscribeEnum.MainPage ? userSubscriptions.MainPageChartsSymbol : null;
                                }
                                else
                                {
                                    throw new ApplicationException("The same session with different pages");
                                }
                            }
                            else
                            {
                                UserSession newUserSession = new UserSession
                                {
                                    UserName = Guid.NewGuid().ToString(),
                                    isAuthUser = false,
                                    UserBrowser = userSubscriptions.UserBrowser,
                                    UserIp = userSubscriptions.UserIp,
                                    SessionPage = new Dictionary<IWebSocketSession, KeyValuePair<SubscribeEnum, string[]>>
                                    {
                                        {
                                            session, new KeyValuePair<SubscribeEnum, string[]>(pageName, new string[]{
                                                pageName == SubscribeEnum.MainPage ? userSubscriptions.PaginationNumber : null,
                                                userSubscriptions.ExchangeName,
                                                userSubscriptions.ActiveTrader,
                                                userSubscriptions.CurrentOrders,
                                                pageName == SubscribeEnum.MainPage ? userSubscriptions.CategoryPath : null,
                                                pageName == SubscribeEnum.MainPage ? userSubscriptions.Sort : null,
                                                pageName == SubscribeEnum.MainPage ? userSubscriptions.MainPageChartsSymbol : null
                                            })
                                        }
                                    }
                                };
                                if (_connectedUsers.Any() == false)
                                {
                                    _connectedUsers = new List<UserSession> { { newUserSession } };
                                }
                                else
                                {
                                    _connectedUsers.Add(newUserSession);
                                    _dataFeed.AddSession(newUserSession);
                                }
                            }
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
        }



        private void DataFeed_OnNotificationInfo(string userName, string error)
        {
            lock (_connectedUsers)
            {
                //var us = _connectedUsers.Where(u => u.UserName == userName);

                var webSocketSender = new WebSocketSender.WebSocketSender(new JsonSerializer());
                webSocketSender.SendByUser<MessageResponse>(_connectedUsers, userName, new MessageResponse() { UserName = userName, Result = error }, WebSocketMessageCode.Notification, WebSocketMessageType.Error, error);

                /*
                if (us != null && us.SessionPage != null)
                {
                    foreach (var particularUserPage in us.SessionPage)
                    {
                        var session = particularUserPage.Key as WebSocketSession;
                        session.Send(Serialize(new MessageResponse() { UserName = userName, Result = error }));
                    }
                }
                */
            }
        }
        //send oder update notification for user
        private void DataFeed_OnExecution(string userName, Execution execution)
        {
            lock (_connectedUsers)
            {
                //var us = _connectedUsers.Where(u => u.UserName == userName);

                var webSocketSender = new WebSocketSender.WebSocketSender(new JsonSerializer());
                webSocketSender.SendByUser<Execution>(_connectedUsers, userName, execution, WebSocketMessageCode.Execution, WebSocketMessageType.Info, execution.Message);
            } 
        }

        //send account update notification for user
        private void DataFeed_OnAccountInfo(string userName, Account account)
        {
            lock (_connectedUsers)
            {
                //var us = _connectedUsers.Where(u => u.UserName == userName);

                var webSocketSender = new WebSocketSender.WebSocketSender(new JsonSerializer());
                webSocketSender.SendByUser<Account>(_connectedUsers, userName, account, WebSocketMessageCode.Account, WebSocketMessageType.Info, account.Message);
            }
        }

        private void DataFeed_OnMessageResponse(string userName, string messageId, string error)
        {
            lock (_connectedUsers)
            {
                //var us = _connectedUsers.Where(u => u.UserName == userName);

                var webSocketSender = new WebSocketSender.WebSocketSender(new JsonSerializer());
                webSocketSender.SendByUser<MessageResponse>(_connectedUsers, userName, new MessageResponse() { Result = error }, WebSocketMessageCode.Notification, WebSocketMessageType.Error, error);

                /*
                if (us != null && us.SessionPage != null)
                {
                    foreach (var particularUserPage in us.SessionPage)
                    {
                        var session = particularUserPage.Key as WebSocketSession;
                        session.Send(Serialize(new MessageResponse() { Result = error }));
                    }
                }
                */
            }
        }

        //admin session closed notification
        private void AdminServerOnSessionClosed(WebSocketSession session, CloseReason r)
        {
            lock (_admins)
            {
                _admins.RemoveAll(a => a.Session == session);
            }
        }

        public bool AddMoneyMethod(string userName, decimal amount, byte addOrGet)
        {
            return _dataFeed.PaymentsMethod(userName, amount, addOrGet);
        }


        public bool InsertHistoryMethod(decimal amount, string systemtype, DateTime date, string direction, string userId, string transactId,string status)
        {
            return _dataFeed.PaymentHistoryMethod(amount,systemtype,date,direction,userId,transactId,status);
        }

        public bool UpdateHistoryMethod(decimal amount,string systemtype, DateTime date, string transactId, string status)
        {
            return _dataFeed.PaymentHistoryUpdate(amount,systemtype,date,transactId,status);
        }
        
        public bool PushSubscribeMethod(PushSettings model)
        {
            return _dataFeed.PushSubscribeMethod(model);
        }


        public string GetUsernameFromTransactId(string transactId)
        {
            return _dataFeed.GetUsernameFromTransactId(transactId);
        }


        public bool GidxRegisterMethod(GIDX.SDK.Models.WebReg.CreateSessionRequest request, string user)
        {
            return _dataFeed.GidxRegister(request, user);
        }
        
        public bool GidxWebCashierMethod(GIDX.SDK.Models.WebCashier.CreateSessionRequest request, string usermail, string direction)
        {
            return _dataFeed.GidxWebCashRegister(request, usermail,direction);
        }

        public GidxUser GidxGetCustomerMethod(string sessionId)
        {
            return _dataFeed.GidxGetCustomer(sessionId);
        }

        public string GidxGetCustomerNameMethod(string customerId)
        {
            return _dataFeed.GidxGetCustomerName(customerId);
        }

        public GidxUser GidxWebcashGetCustomerMethod(string sessionId, string userEmail)
        {
            return _dataFeed.GidxWebcashGetCustomer(sessionId,userEmail);
        }

        public bool IsUserVerified(string username)
        {
            return _dataFeed.IsUserVerified(username);
        }

        //public void GidxUpdatePaymentsHistory(GIDX.SDK.Models.WebCashier.SessionStatusCallback callback, string userEmail)
        //{
        //   // return _dataFeed.
        //}



        //public void Gidx(GIDX.SDK.Models.WebReg.SessionStatusCallback callback, User user)
        //{
        //    _dataFeed.EditUserInfo(user);
        //    //var customer = GidxGetCustomerMethod(callback.MerchantSessionID);

        //}

        public void HeartBeatMethod()
        {
            //pageParams[0] = PaginationNumber
            //pageParams[1] = ExchangeName;
            //pageParams[2] = ActiveTrader
            //pageParams[3] = CurrentOrders
            //pageParams[4] = CategoryPath
            //pageParams[5] = Sort
            //pageParams[6] = MainPageChartsSymbol


            while (_started)
            {
                try
                {
                    _connectedUsers.ToList().ForEach(user =>
                    {
                        var ordersPositions = _dataFeed.GetOrdersOrPositions(user.UserName);
                        if(user.SessionPage != null)
                        {
                            foreach (KeyValuePair<IWebSocketSession, KeyValuePair<SubscribeEnum, string[]>> particularSession in user.SessionPage.ToList())
                            {
                                WebSocketSession session = particularSession.Key as WebSocketSession;
                                SubscribeEnum page = particularSession.Value.Key;
                                string[] pageParameters = particularSession.Value.Value;

                                WebSoketOrdersResponse wsOrderResponse = new WebSoketOrdersResponse();
                                wsOrderResponse.UserName = user.UserName;
                                wsOrderResponse.AccountData = _dataFeed.HeartBeatAccountData(user.UserName);

                                if (pageParameters[2] == "1")
                                {
                                    wsOrderResponse.ActiveOrders = _dataFeed.HeartBeatActiveOders(user.UserName, pageParameters[1]);
                                }
                                if (pageParameters[3] == "1")
                                {
                                    wsOrderResponse.CurrentOrders = GetCurrentOrdersRequestMethod(user.UserName, ordersPositions);
                                }
                                if (page == SubscribeEnum.MainPage)
                                {
                                    wsOrderResponse.SymbolsAndOrders = new GetAllSymbolsAndOrdersResponse { Result = _dataFeed.GetAllSymbolsAndExchanges(user.UserName, pageParameters[0], pageParameters[4], pageParameters[5]) };
                                    if(pageParameters[6] != string.Empty)
                                    {
                                        //wsOrderResponse.ActiveOrders = _dataFeed.HeartBeatActiveOders(user.UserName, pageParameters[1]);
                                        wsOrderResponse.Bars = _dataFeed.HeartBeatBars(pageParameters[6]);// [6] - MainPageChartsSymbol
                                    }
                                }
                                else if (page == SubscribeEnum.OrderPage)
                                {
                                    wsOrderResponse.OrdersPositionsHistory = new OrdersPositionsHistory
                                    {
                                        OrdersOrPositions = ordersPositions,
                                        Positions = _dataFeed.GetGroupCurrentPositions(user.UserName),
                                        HistoryTradeItems = _dataFeed.GetHistoryTradeItems(user.UserName)
                                    };
                                }
                                else if (page == SubscribeEnum.EventPage)
                                {
                                    wsOrderResponse.Bars = _dataFeed.HeartBeatBars(pageParameters[1]);
                                }

                                var webSocketSender = new WebSocketSender.WebSocketSender(new JsonSerializer());
                                webSocketSender.SendBySession<WebSoketOrdersResponse>(session, wsOrderResponse, WebSocketMessageCode.HeartBeat, WebSocketMessageType.Info);

                                //if (session != null)
                                //{
                                    //session.Send(Serialize<WebSoketOrdersResponse>(wsOrderResponse));
                                //}
                            }
                        }
                    });
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
                Thread.Sleep(1000);
            }
        }

        public void NewOrderRequestMethod(NewOrderRequest request)
        {
            if (request != null)
            {
                _dataFeed.ProcessRequest(request);
            }
        }
        
        private bool CancelOrderResult;
        public bool CancelOrderRequestMethod(CancelOrderRequest request)
        {
            InProgress = true;
            CancelOrderResult = false;
            if (request != null)
            {
                _dataFeed.ProcessRequest(request);
            }
            return true;
        }
        public void OnCancelOrderRequestMethod(bool result)
        {
            CancelOrderResult = result;
            InProgress = false;
        }

        public void CancelAllMethod(string symbol, string userName)
        {
            _dataFeed.CancelAll(symbol, userName);
        }

        public void CloseOutReverseMethod(string symbol, string userName, bool isReverse)
        {
            _dataFeed.CloseOutReverse(symbol, userName, isReverse);
        }

        public void CloseMultiple(Order order)
        {
            _dataFeed.CancelationMultipleOrder(order);
        }

        public GetOrdersResponse GetOrdersRequestMethod(GetOrdersRequest request)
        {
            GetOrdersResponse response = null;
            if (request != null)
            {
                try
                {
                    response = _dataFeed.GetOrders(request);
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
            }
            return response;
        }

        public OrdersPositionsHistory GetOrdersOrPositionsRequestMethod(GetOrdersOrPositionsRequest request)
        {
            OrdersPositionsHistory oph = null;
            if (request != null)
            {
                try
                {
                    oph = new OrdersPositionsHistory
                    {
                        OrdersOrPositions = _dataFeed.GetOrdersOrPositions(request.Username),
                        Positions = _dataFeed.GetGroupCurrentPositions(request.Username),
                        HistoryTradeItems = _dataFeed.GetHistoryTradeItems(request.Username)
                    };
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
            }
            return oph;
        }

        public List<CurrentOrders> GetCurrentOrdersRequestMethod(string userName)
        {
            List<CurrentOrders> currentOrders = null;
            try
            {
                var orders = _dataFeed.GetOrdersOrPositions(userName);
                return GetCurrentOrdersRequestMethod(userName, orders);                
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return currentOrders;
        }

        public List<CurrentOrders> GetCurrentOrdersRequestMethod(string userName, List<OrderOrPosition> orders)
        {
            List<CurrentOrders> currentOrders = null;
            try
            {
                currentOrders = _dataFeed.TransformToCurrentOrdersModel(orders);
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return currentOrders;
        }

        public UserNewHashCodeResponse GenerateNewConfirmationHashMethod(string userName, string confirmationCode, string newConfirmationCode, DateTime expirationDate, bool trustedUser)
        {
            var result = new UserNewHashCodeResponse
            {
                Result = newConfirmationCode,
                ErrorCode = 200,
                ErrorMessage = string.Empty
            };

            lock (_connectedUsers)
            {
                var user = _dataFeed.GetUserInfo(userName);

                if (string.IsNullOrEmpty(user.UserName))
                {
                    result.Result = string.Empty;
                    result.ErrorMessage = "User does not exist";
                    result.ErrorCode = 101;

                    return result;
                }
                if (user.UserType != UserType.Registered)
                {
                    result.Result = string.Empty;
                    result.ErrorMessage = "User has been already confirmed";
                    result.ErrorCode = 102;

                    return result;
                }

                if (!trustedUser && (user.ConfirmationCode != confirmationCode))
                {
                    result.Result = string.Empty;
                    result.ErrorMessage = "Confirmation code does not match";
                    result.ErrorCode = 103;

                    return result;
                }


                user.ConfirmationCode = newConfirmationCode;
                user.ConfirmationExpired = expirationDate;

                _dataFeed.EditUserInfo(user);
            }

            return result;
        }

        public UserConfirmationResponse ConfirmMethod(string userName, string confirmationCode)
        {
            var result = new UserConfirmationResponse
            {
                Result = true,
                ErrorCode = 200,
                ErrorMessage = string.Empty
            };

            lock (_connectedUsers)
            {
                var user = _dataFeed.GetUserInfo(userName);

                if (string.IsNullOrEmpty(user.UserName))
                {
                    result.Result = false;
                    result.ErrorMessage = "User does not exist";
                    result.ErrorCode = 101;

                    return result;
                } 
                if (user.UserType != UserType.Registered)
                {
                    result.Result = false;
                    result.ErrorMessage = "User has been already confirmed";
                    result.ErrorCode = 102;

                    return result;
                }

                if (user.ConfirmationCode != confirmationCode)
                {
                    result.Result = false;
                    result.ErrorMessage = "Confirmation code does not match";
                    result.ErrorCode = 103;

                    return result;
                }

                if (user.ConfirmationExpired < DateTime.UtcNow)
                {
                    result.Result = false;
                    result.ErrorMessage = "Confirmation code has been expired";
                    result.ErrorCode = 104;

                    return result;
                }

                user.UserType = UserType.Confirmed;

                _dataFeed.EditUserInfo(user);

            }

            return result;
        }

        public UserLoginResponse LoginRequestMethod(LoginRequest request)
        {
            UserLoginResponse result = null;
            if (request != null)
            {
                result = new UserLoginResponse() { LoginResult = LoginResult.InternalError, Symbols = new List<Symbol>(), Currencies = new List<string>(), Accounts = new List<Account>(), Orders = new List<NewOrderRequest>(), Executions = new List<Execution>() };
                lock (_connectedUsers)
                {                    
                    //if (user != null)
                    //{
                        //result = _dataFeed.Login(request);
                        //result.LoginResult = LoginResult.OK;
                    //}
                    //else
                    //{
                        result = _dataFeed.Login(request);
                        if (result.LoginResult == LoginResult.OK)
                        {
                            var session = new UserSession() 
                            { 
                                UserName = request.UserName,
                                UserBrowser = request.UserBrowser,
                                UserIp = request.UserIp
                            };

                            _connectedUsers.Add(session);

                            _dataFeed.AddSession(session);
                        }

                        var users = _connectedUsers.Where(u => u.UserName == request.UserName);                        

                        var webSocketSender = new WebSocketSender.WebSocketSender(new JsonSerializer());
                        webSocketSender.SendByUser<UserLoginResponse>(_connectedUsers, request.UserName, result, WebSocketMessageCode.LogIn, WebSocketMessageType.Info, 
                            string.Format("User {0} has been logged in.", request.UserName));
                    //}

                    Debug.WriteLine("-------- User has been logged in - " + request.UserName + " " + request.UserIp + " " + request.UserBrowser + " " + "--------");
                }
            }

            return result;
        }

        public void LogoutRequestMethod(LogoutRequest request)
        {
            if (request != null)
            {


                if (_connectedUsers.Count(u => u.UserName == request.UserName) == 1)
                    _dataFeed.Logout(request.UserName);

                var message = string.Format("User {0} has been logged out.", request.UserName);

                var webSocketSender = new WebSocketSender.WebSocketSender(new JsonSerializer());
                webSocketSender.SendByBrowser<MessageResponse>(_connectedUsers, request.UserName, request.UserBrowser, request.UserIp, new MessageResponse() { UserName = request.UserName, Result = message }, 
                    WebSocketMessageCode.LogIn, WebSocketMessageType.Info, message);

                lock (_connectedUsers)
                {
                    _connectedUsers.Remove(_connectedUsers.FirstOrDefault(u => u.UserName == request.UserName && u.UserIp == request.UserIp && u.UserBrowser == request.UserBrowser));
                    _dataFeed.RemoveSession(new UserSession
                    {
                        UserName = request.UserName,
                        UserBrowser = request.UserBrowser,
                        UserIp = request.UserIp
                    });
                }

                Debug.WriteLine("-------- User has been logged out - " + request.UserName + " " + request.UserIp + " " + request.UserBrowser + " " +"--------");
            }
        }

        public AdminLoginResponse LoginAdminRequestMethod(LoginRequest request)
        {
            AdminLoginResponse result = null;
            if (request != null)
            {
                result = new AdminLoginResponse {AdminLoginResult = LoginResult.InternalError, User = string.Empty };
                lock (_admins)
                {
                    AdminSession user = _admins.FirstOrDefault(u => u.UserName == request.UserName);
                    if (user != null)
                    {
                        _admins.Remove(user);
                        _dataFeed.LogoutAdmin(request.UserName);
                        result.AdminLoginResult = LoginResult.AlreadyLogged;
                    }
                    else
                    {
                        result = _dataFeed.LoginAdmin(request);
                        if (result.AdminLoginResult == LoginResult.OK)
                        {
                            _admins.Add(new AdminSession { UserName = request.UserName });
                        }
                    }
                }
            }
            return result;
        }
        
        public void LogoutAdminRequestMethod(LogoutRequest request)
        {
            if (request != null)
            {
                _dataFeed.LogoutAdmin(request.UserName);
                lock (_admins)
                {
                    _admins.Remove(_admins.FirstOrDefault(u => u.UserName == request.UserName));
                }
            }
        }

        public UserAssets GetUserBalanceRequestMethod(GetUserBalanceRequest request)
        {
            UserAssets response = null;
            if (request != null)
            {
                var balance = _dataFeed.GetUserBalance(request.UserName);
                var invested = _dataFeed.GetUserInvested(request.UserName);
                var gainLost = _dataFeed.GetUserGainLost(request.UserName);
                //response = new UserAssets { CurrentBalance = balance, Invested = invested, GainLost = gainLost };

                var user = _dataFeed.GetUserInfo(request.UserName);
                if (user.Accounts == null) return new UserAssets { CurrentBalance = balance, Invested = invested, GainLost = gainLost, Account = null };
                var account = user.Accounts.FirstOrDefault();
                if (account != null)
                    response = new UserAssets { CurrentBalance = balance, Invested = invested, GainLost = gainLost, Account = new Account { Bettor = account.Bettor, Trade = account.Trade, Theme = account.Theme, Mode = account.Mode == Mode.Basic.ToString().ToLower() ? "true" : "false" ,MailNews = account.MailNews, MailUpdates = account.MailUpdates, MailActivity = account.MailActivity, MailFrequency = account.MailFrequency} };
            }
            return response;
        }

        public string AddUserRequestMethod(AddUserRequest request)
        {
            //string result = "Some error";
            string result = string.Empty;
            if (request != null)
            {
                if (request.User.Accounts.Count > 0)
                {
                    SqlConnection connection = new SqlConnection(_connectionString);
                    SqlTransaction transaction = null;
                    try
                    {
                        connection.Open();
                        transaction = connection.BeginTransaction();
                        SqlCommand command = connection.CreateCommand();
                        command.Transaction = transaction;
                        command.CommandText = "INSERT INTO [Users] VALUES (@UserName, @NickName, @Password, @Email, @FirstName, @LastName, @DateOfBirth, @Country, @Address, @Phone, @InsertedDate, @LastEditedDate, 0, @ConfirmationCode, @ConfirmationExpired, @Type)";
                        command.Parameters.AddWithValue("UserName", request.User.UserName);
                        command.Parameters.AddWithValue("NickName", request.User.NickName);
                        command.Parameters.AddWithValue("Password", request.User.Password);
                        command.Parameters.AddWithValue("Email", request.User.Email);
                        command.Parameters.AddWithValue("FirstName",  DBNull.Value);
                        command.Parameters.AddWithValue("LastName", DBNull.Value);
                        command.Parameters.AddWithValue("DateOfBirth", request.User.DateOfBirth);
                        command.Parameters.AddWithValue("Country", request.User.Country);
                        command.Parameters.AddWithValue("Address", DBNull.Value);
                        command.Parameters.AddWithValue("Phone", DBNull.Value);
                        command.Parameters.AddWithValue("InsertedDate", DateTime.UtcNow);
                        command.Parameters.AddWithValue("LastEditedDate", DateTime.UtcNow);
                        command.Parameters.AddWithValue("ConfirmationCode", request.User.ConfirmationCode);
                        command.Parameters.AddWithValue("ConfirmationExpired", request.User.ConfirmationExpired);
                        command.Parameters.AddWithValue("Type", request.User.UserType.ToString());
                        command.ExecuteNonQuery();
                        foreach (var account in request.User.Accounts)
                        {
                            command = connection.CreateCommand();
                            command.Transaction = transaction;
                            command.CommandText = "INSERT [Accounts] VALUES (@UserName, @Email, @Name, @Balance, @Currency, 'empty', @BeginOfTP, @Mode, 0, 0, @Theme, 0, 0, @MailNews, @MailUpdates, @MailActivity, @SmsActivity,NULL,NULL,NULL)";
                            command.Parameters.AddWithValue("UserName", request.User.UserName);
                            command.Parameters.AddWithValue("Email", request.User.Email);
                            command.Parameters.AddWithValue("Name", account.Name);
                            command.Parameters.AddWithValue("Balance", account.Balance);
                            command.Parameters.AddWithValue("Currency", account.Currency);
                            command.Parameters.AddWithValue("BeginOfTP", DateTime.UtcNow);
                            command.Parameters.AddWithValue("Mode", account.Mode);
                            command.Parameters.AddWithValue("Theme", account.Theme);
                            command.Parameters.AddWithValue("MailNews", account.MailNews);
                            command.Parameters.AddWithValue("MailUpdates", account.MailUpdates);
                            command.Parameters.AddWithValue("MailActivity", account.MailFrequency);
                            command.Parameters.AddWithValue("SmsActivity", account.SmsActivity);
                            
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
                        if (ex.Message.IndexOf("PRIMARY KEY") != -1)
                            result = "User already exists";
                        else
                            result = ex.Message;
                    }
                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        connection.Close();
                    }
                }
                else
                {
                    result = "Invalid accounts";
                }
                if (string.IsNullOrEmpty(result))
                {
                    _dataFeed.AddUser(request.User);
                }
            }
            return result;
        }

        public string EditUserInfoRequestMethod(EditUserRequest request)
        {
            var result = string.Empty;
            if (request != null)
            {
                result = _dataFeed.EditUserInfo(request.User);
            }
            return result;
        }

        public string EditUserPreferencesRequestMethod(EditUserRequest request)
        {
            var result = string.Empty;
            if (request != null)
            {
                result = _dataFeed.EditUserPreferences(request.User);
            }
            return result;
        }

        public string EditUserThemeRequestMethod(string userName, string theme)
        {
            var result = string.Empty;
            if (!string.IsNullOrEmpty(theme))
            {
                result = _dataFeed.EditUserTheme(userName, theme);
            }
            return result;
        }

        public User GetUserInfoRequestMethod(GetUserInfoRequest request)
        {
            if (request == null) return new User();

            return request.Email == null
                ? _dataFeed.GetUserInfo(request.UserName)
                : _dataFeed.GetUserInfoByEmail(request.Email);
        }

        public ResultObj ChangePasswordRequestMethod(ChangePasswordRequest request)
        {
            ResultObj result = null;
            if (request != null)
            {
                result = _dataFeed.ChangePasswordUser(request.UserName, request.OldPassword, request.NewPassword);
            }
            return result;
        }

        public List<AdminExchange> GetExchangesRequestMethod(GetExchangesRequest request)
        {
            List<AdminExchange> response = null;
            if (request != null)
            {
                response = _dataFeed.GetAdminExchanges();
            }
            return response;
        }

        public List<AllSymbolsAndOrders> GetAllSymbolsAndOrdersRequestMethod(string sort, string path = null)
        {
            List<AllSymbolsAndOrders> response = null;
            try
            {
                response = _dataFeed.GetAllSymbolsAndExchanges(null, null, path, sort);
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return response;
        }

        public int GetItemsOnPage()
        {
            return _dataFeed.GetItemsOnPage();
        }

        public AllSymbolsAndOrders GetSymbolsAndOrdersByUrlRequestMethod(GetSymbolsAndOrdersByUrlRequest request, string sort)
        {
            return GetAllSymbolsAndOrdersRequestMethod(sort).First(x => x.Symbol.UrlExchange == request.ExchangeUrl);
        }

        public string AddExchangeRequestMethod(AddExchangeRequest request)
        {
            var result = "100";
            if (request != null)
            {
                result = _dataFeed.AddExchange(request);
            }
            return result;
        }
        
        public string CloseExchangeRequestMethod(CloseExchangeRequest request)
        {
            var result = "100";

            if (request != null)
            {
                Func<object, string> del = _dataFeed.CloseExchange;
                IAsyncResult response = del.BeginInvoke(request, null, null);
                result = del.EndInvoke(response);
            }
            return result;
        }

        public string EditExchangeRequestMethod(EditExchangeRequest request)
        {
            var result = "100";
            if (request != null)
            {
               result =_dataFeed.EditExchange(request);
            }
            return result;
        }

        public string DeleteExchangeRequestMethod(string exchange)
        {
            var result = "100";
            if (exchange != null)
            {
                result = _dataFeed.DeleteExchange(exchange);
            }
            return result;
        }

        public string ChangeStatusRequestMethod(StatusExchangeRequest request)
        {
            var result = "100";
            if (request != null)
            {
                result = _dataFeed.ChangeStatusExchange(request);
            }
            return result;
        }

        public List<CategoryItem> GetAllCategoryRequestMethod()
        {
            var response = _dataFeed.GetAllCategories();

            return response;
        }

        public string CreateCategoryRequestMethod(CategoryRequest request)
        {
            var response = "100";

            if (request != null)
            {
                response = _dataFeed.AddCategory(request);
            }
            return response; 
        }

        public string EditCategoryRequestMethod(CategoryRequest request)
        {
            var response = "100";

            if (request != null)
            {
                response = _dataFeed.EditCategory(request);
            }
            return response; 
        }

        public string DeleteCategoryRequestMethod(Guid id)
        {
            var response = "100";

            if (id != Guid.Empty)
            {
               response = _dataFeed.DeleteCategory(id);
            }
            return response;
        }

        public string MoveCategoryRequestMethod(Guid id, int position)
        {
            var response = "100";

            if (id != Guid.Empty)
            {
                response = _dataFeed.MoveCategory(id, position);
            }
            return response;
        }

        public string GetUserNameFromEmailMethod(string email)
        {
            var result = _dataFeed.GetUserNameFromEmail(email);
            return result;
        }


        public string GetNickNameFromEmailMethod(string email)
        {
            var result = _dataFeed.GetNickNameFromEmail(email);
            return result;
        }

        /*
        //helper function to serialize network protocl messages
        private string Serialize<T>(T obj)
        {
            string result = "";
            var memoryStream = new MemoryStream();
            var serializer = new DataContractJsonSerializer(obj.GetType());
            try
            {
                serializer.WriteObject(memoryStream, obj);
                memoryStream.Position = 0;
                var streamReader = new StreamReader(memoryStream);
                result = streamReader.ReadToEnd();
                streamReader.Dispose();
            }
            catch (Exception ex)
                { 
                }
            memoryStream.Dispose();
            return result;
        }

        private T Deserialize<T>(string data)
        {
            T result = default(T);
            var memoryStream = new MemoryStream();
            var streamWriter = new StreamWriter(memoryStream);
            try
            {
                streamWriter.Write(data);
                streamWriter.Flush();
                memoryStream.Position = 0;
                var ser = new DataContractJsonSerializer(typeof(T));
                result = (T)ser.ReadObject(memoryStream);
            }
            catch { }
            memoryStream.Dispose();
            streamWriter.Dispose();
            return result;
        }
        */
    }

}
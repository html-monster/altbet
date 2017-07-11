using AltBet.Bet.Models;
using AltBet.Exchange.Managers;
using AltBet.Exchange;
using AltBet.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Reflection;

namespace AltBet.Controllers
{
    public class OrderController : _baseController
    {
        Random randomInt = new Random();

        //private IOrderManager orderManager = null;

        public OrderController()
        {
            //this.orderManager = orderManager;
        }

        //CREATE ORDER
        [Authorize]
        public ActionResult Create(OrderViewModel newOrder)
        {
            try
            {
                var symbolSplit = newOrder.Symbol.Split('_');

                AltBet.Model.Symbol currentSymbol = new AltBet.Model.Symbol
                {
                    Currency = new AltBet.Model.Currency { Name = symbolSplit[2] },
                    Exchange = new AltBet.Model.Exchange { Name = symbolSplit[0] },
                    Name = symbolSplit[1]
                };
                int currentSide = newOrder.isMirror.ToLower() == "1" ?
                    1 - (int)Enum.Parse(typeof(Side), newOrder.Side) :
                    (int)Enum.Parse(typeof(Side), newOrder.Side);
                if (ModelState.IsValid)
                {
                    try
                    {
                        Order order = new Order
                        {
                            AccountID = User.Identity.Name,
                            ActivationTime = DateTime.UtcNow,
                            ExpirationDate = DateTime.UtcNow.AddDays(365),
                            ID = Guid.NewGuid().ToString(),
                            LimitPrice = newOrder.OrderType ? (newOrder.isMirror.ToLower() == "1" ? 1 - newOrder.LimitPrice : newOrder.LimitPrice) : 0m,
                            OrderType = newOrder.OrderType ? 2 : 0,
                            Quantity = newOrder.Quantity,
                            Side = currentSide,
                            StopPrice = 0,
                            Symbol = currentSymbol,
                            Time = DateTime.UtcNow,
                            TimeInForce = 0,
                            isMirror = newOrder.isMirror.ToLower() == "1" ? 1 : 0
                        };

                        //orderManager.Add(order);
                        using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                        {
                            orderManagerClient.Add(order);
                        }
                    }
                    catch (Exception ex) //TODO: need to specify
                    {
                        ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                    }
                }
            }
            catch(Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            return Json((object)(newOrder.Symbol + "/" + ((int)Enum.Parse(typeof(Side), newOrder.Side)).ToString() + "/" + newOrder.isMirror.ToString()));
        }

        //EDIT ORDER
        [Authorize]
        public ActionResult Edit(EditOrderViewModel request)
        {
            var symbolSplit = request.Symbol.Split('_');

            Order orderCreate = new Order { ID = "Some error in controller" };

            AltBet.Model.Symbol currentSymbol = new AltBet.Model.Symbol
            {
                Currency = new AltBet.Model.Currency { Name = symbolSplit[2] },
                Exchange = new AltBet.Model.Exchange { Name = symbolSplit[0] },
                Name = symbolSplit[1]
            };
            int currentSide = request.isMirror.ToLower() == "1" ?
                1 - (int)Enum.Parse(typeof(Side), request.Side) :
                (int)Enum.Parse(typeof(Side), request.Side);

            if (ModelState.IsValid)
            {
                try
                {
                    Order order = new Order
                    {
                        ID = request.ID
                    };

                    //bool cancelResult = orderManager.Cancel(order);
                    var cancelResult = false;
                    using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                    {
                       cancelResult = orderManagerClient.Cancel(order);
                    }

                    if (cancelResult)
                    {
                        orderCreate = new Order
                        {
                            AccountID = User.Identity.Name,
                            ActivationTime = DateTime.UtcNow,
                            ExpirationDate = DateTime.UtcNow.AddDays(365),
                            ID = Guid.NewGuid().ToString(),
                            LimitPrice = request.OrderType ? (request.isMirror.ToLower() == "1" ? 1 - request.LimitPrice : request.LimitPrice) : 0m,
                            OrderType = request.OrderType ? 2 : 0,
                            Quantity = request.Quantity,
                            Side = currentSide,
                            StopPrice = 0,
                            Symbol = currentSymbol,
                            Time = DateTime.UtcNow,
                            TimeInForce = 0,
                            isMirror = request.isMirror.ToLower() == "1" ? 1 : 0
                        };

                        //orderManager.Add(orderCreate);
                        using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                        {
                            orderManagerClient.Add(orderCreate);
                        }
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }
            return Json((object)request.ID + "/" + ((int)Enum.Parse(typeof(Side), request.Side)).ToString() + "/" + request.isMirror.ToString());
        }

        //CANCEL ORDER
        [Authorize]
        public ActionResult Cancel(string id)
        {
            Order order = new Order
            {
                ID = id
            };
            //bool result = orderManager.Cancel(order);
            var result = false;
            using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
            {
                result = orderManagerClient.Cancel(order);
            }
            return Json((object)(string.Format(id + "_" + result)));
        }

        //ACTIVE TRADER MARKET ORDERS
        [Authorize]
        public ActionResult MarketTrading(MarketOrderViewModel newOrder)
        {
            var symbolSplit = newOrder.Symbol.Split('_');

            AltBet.Model.Symbol currentSymbol = new AltBet.Model.Symbol
            {
                Currency = new AltBet.Model.Currency { Name = symbolSplit[2] },
                Exchange = new AltBet.Model.Exchange { Name = symbolSplit[0] },
                Name = symbolSplit[1]
            };
            int currentSide = newOrder.isMirror.ToLower() == "1" ?
                1 - (int)Enum.Parse(typeof(Side), newOrder.Side) :
                (int)Enum.Parse(typeof(Side), newOrder.Side);
            if (ModelState.IsValid)
            {
                try
                {
                    Order order = new Order
                    {
                        AccountID = User.Identity.Name,
                        ActivationTime = DateTime.UtcNow,
                        ExpirationDate = DateTime.UtcNow.AddDays(365),
                        ID = Guid.NewGuid().ToString(),
                        LimitPrice = 0m,
                        OrderType = 0,
                        Quantity = newOrder.Quantity,
                        Side = currentSide,
                        StopPrice = 0,
                        Symbol = currentSymbol,
                        Time = DateTime.UtcNow,
                        TimeInForce = 0,
                        isMirror = newOrder.isMirror.ToLower() == "1" ? 1 : 0
                    };
                    //orderManager.Add(order);
                    using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                    {
                        orderManagerClient.Add(order);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }

            return Json((object)(newOrder.Symbol + "/" + ((int)Enum.Parse(typeof(Side), newOrder.Side)).ToString() + "/" + newOrder.isMirror.ToString()));
        }

        //ACTIVE TRADER SPREADER
        [Authorize]
        public ActionResult Spreader(SpreaderViewModel orders)
        {
            var symbolSplit = orders.Symbol.Split('_');

            AltBet.Model.Symbol currentSymbol = new AltBet.Model.Symbol
            {
                Currency = new AltBet.Model.Currency { Name = symbolSplit[2] },
                Exchange = new AltBet.Model.Exchange { Name = symbolSplit[0] },
                Name = symbolSplit[1]
            };

            if (ModelState.IsValid)
            {
                try
                {
                    Order orderSell = new Order
                    {
                        AccountID = User.Identity.Name,
                        ActivationTime = DateTime.UtcNow,
                        ExpirationDate = DateTime.UtcNow.AddDays(365),
                        ID = Guid.NewGuid().ToString(),
                        LimitPrice = orders.isMirror.ToLower() == "1" ? 1 - orders.SellOrderLimitPrice : orders.SellOrderLimitPrice,
                        OrderType = 2,
                        Quantity = orders.SellOrderQuantity,
                        Side = (orders.isMirror.ToLower() == "1" ? 0 : 1),
                        StopPrice = 0,
                        Symbol = currentSymbol,
                        Time = DateTime.UtcNow,
                        TimeInForce = 0,
                        isMirror = orders.isMirror.ToLower() == "1" ? 1 : 0
                    };
                    Order orderBuy = new Order
                    {
                        AccountID = User.Identity.Name,
                        ActivationTime = DateTime.UtcNow,
                        ExpirationDate = DateTime.UtcNow.AddDays(365),
                        ID = Guid.NewGuid().ToString(),
                        LimitPrice = orders.isMirror.ToLower() == "1" ? 1 - orders.BuyOrderLimitPrice : orders.BuyOrderLimitPrice,
                        OrderType = 2,
                        Quantity = orders.BuyOrderQuantity,
                        Side = (orders.isMirror.ToLower() == "1" ? 1 : 0),
                        StopPrice = 0,
                        Symbol = currentSymbol,
                        Time = DateTime.UtcNow,
                        TimeInForce = 0,
                        isMirror = orders.isMirror.ToLower() == "1" ? 1 : 0
                    };
                    //orderManager.Add(orderSell);
                    //orderManager.Add(orderBuy);
                    using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                    {
                        orderManagerClient.Add(orderSell);
                    }

                    using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
                    {
                        orderManagerClient.Add(orderBuy);
                    }

                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, new InvalidOperationException(ex.Message));
                }
            }
            return Json((object)(orders.Symbol + "/" + orders.isMirror.ToString()));
        }

        //CANCEL ALL
        [Authorize]
        public ActionResult CancelAll(string symbol)
        {
            //orderManager.CancelAll(symbol, User.Identity.Name);
            using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
            {
                orderManagerClient.CancelAll(symbol, User.Identity.Name);
            }
            return Json("success");
        }

        //CLOSE OUT
        [Authorize]
        public ActionResult CloseOut(string symbol)
        {
            //orderManager.CloseOut(symbol, User.Identity.Name);
            using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
            {
                orderManagerClient.CloseOut(symbol, User.Identity.Name);
            }
            return Json("success");
        }

        //REVERSE ALL
        [Authorize]
        public ActionResult ReverseAll(string symbol)
        {
            //orderManager.Reverse(symbol, User.Identity.Name);
            using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
            {
                orderManagerClient.Reverse(symbol, User.Identity.Name);
            }
            return Json("success");
        }

        //DRAG'N'DROP CANCEL
        [Authorize]
        public JsonResult DragAndDropCancel(DragAndDropCancelOrders orderData)
        {
            int currentSide = orderData.isMirror.ToString() == "1" ?
                1 - (int)Enum.Parse(typeof(Side), orderData.Side) :
                (int)Enum.Parse(typeof(Side), orderData.Side);

            decimal price = orderData.isMirror.ToString() == "1" ? 1 - orderData.OldPrice : orderData.OldPrice;

            var symbolSplit = orderData.Symbol.Split('_');

            AltBet.Model.Symbol currentSymbol = new AltBet.Model.Symbol
            {
                Currency = new AltBet.Model.Currency { Name = symbolSplit[2] },
                Exchange = new AltBet.Model.Exchange { Name = symbolSplit[0] },
                Name = symbolSplit[1]
            };

            //orderManager.GetOrderAndCancel(new Order
            //{
            //    AccountID = User.Identity.Name,
            //    Side = currentSide,
            //    LimitPrice = price,
            //    Symbol = currentSymbol
            //});
            using (var orderManagerClient = new OrderServiceReference.OrderManagerClient("BasicHttpBinding_IOrderManager"))
            {
                orderManagerClient.GetOrderAndCancel(new Order
                    {
                        AccountID = User.Identity.Name,
                        Side = currentSide,
                        LimitPrice = price,
                        Symbol = currentSymbol
                    });
            }
            return Json("success");
        }


        //[HttpGet]
        //public ActionResult Subscribe()
        //{
        //    var subscribeObject = new SubscribeRequest
        //    {
        //       UserName = User.Identity.Name,
        //       Symbol = new AltBet.Exchange.Symbol
        //       {
        //           Currency = "USD" ,
        //           Exchange = "FIRST" ,
        //           Name = "UAH/USD"
        //       },
        //       Currency = "USD",
        //       Subscribe = true
        //    };

        //    orderManager.Subscribe(subscribeObject);

        //    return View();
        //}

        //public ActionResult GetOrdersBySymbol(string id, string reflection = null)
        //{
        //    //string symbolStr = "FIRST_UAH/USD_USD";
        //    string[] split = id.Split('_');

        //    var data = new GetOrdersRequest
        //    {
        //        Symbol = new AltBet.Exchange.Symbol
        //        {
        //            Currency = split[2],
        //            Exchange = split[0],
        //            Name = split[1]
        //        },
        //        Reflection = reflection,
        //    };
        //    ViewBag.Exchange = id;

        //    var ordersAndTicks = orderManager.GetOrders(data);

        //    return View(
        //        new CommonModel
        //        {
        //            Orders = ordersAndTicks
        //        });
        //}

        //public ActionResult Process()
        //{
        //    //this.isStop = isStop;
        //    var dateTime = DateTime.UtcNow;
        //    var count = 0;

        //    while(true)
        //    {
        //        if ((DateTime.UtcNow - dateTime).Seconds > 1)
        //        {
        //            count++;
        //            if(count > 10)
        //            {
        //                break;
        //            }
        //            dateTime = DateTime.UtcNow;
        //            CreateOrder();
        //        }
        //    }

        //    return View();
        //}

        //private void CreateOrder()
        //{
        //    var user = User.Identity.Name;
        //    // "market";
        //    //1.	Список реализованных ордеров testing@test.ua
        //    //2.	Топовые значения цен всех ордеров
        //    //3.	Топовое значение цены реализованных ордеров
        //    Order order = new Order
        //    {
        //        AccountID = (user == "seller") ? "seller" : "buyer",
        //        ActivationTime = DateTime.Now,
        //        ExpirationDate = new DateTime(2017, 8, 15),
        //        ID = Guid.NewGuid().ToString(),
        //        LimitPrice = (decimal)randomInt.Next(1, 99) / 100,
        //        OrderType = 2, //(int)Enum.Parse(typeof(AltBet.Exchange.Type), "Market"),
        //        Quantity = 10,
        //        Side = (user == "seller") ? 1 : 0, //sell-1, buy-0
        //        StopPrice = 0,
        //        Symbol = new AltBet.Model.Symbol
        //        {
        //            Currency = new Currency { Name = "USD" },
        //            Exchange = new Exchange { Name = "LPMU-10-17-2016" },
        //            Name = "Liverpool-ManchesterUnited"
        //        },
        //        Time = DateTime.Now,
        //        TimeInForce = 0
        //    };
        //    //if (ModelState.IsValid)
        //    //{
        //    //    var result = orderManager.Add(order);
        //    //}
        //    //try
        //    //{
        //    //    orderManager.Add(order);
        //    //}
        //    //catch (Exception ex)
        //    //{

        //    //}
        //    orderManager.Add(order);
        //}

        //public ActionResult Index()
        //{
        //    return View();
        //}

        // DEBUG ACTION
        public ActionResult TestAction()
        {
            return Json(new { ErrorCode = "200" }, JsonRequestBehavior.AllowGet);
        }
    }
}

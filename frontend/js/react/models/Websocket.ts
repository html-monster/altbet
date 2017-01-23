/**
 * Socket model for creating a socket connection
 *
 * Created by Vlasakh on 19.12.2016.
 */

/// <reference path="./../../.d/common.d.ts" />

import { SocketSubscribe } from "./SocketSubscribe";
// import {globalData} from "../../ts/index";


// старт подписок
export class WebsocketModel
{
    public static CALLBACK_MAINPAGE_EXCHANGES = "CMPE1";      // a main page receive data callback
    public static CALLBACK_EVENTPAGE_ORDERS = "CEPO2";      // a event page receive data callback

    private noSupportMessage = "Your browser cannot support WebSocket!";
    private connectionString = "ws://localhost:2001/";
    // private connectionString = "ws://54.171.212.235:2001/";    // IP

    private ws = null;
    private SocketSubscribe = null;
    private callbacks = {};
    public socketData: any; // must be private, only for debug !!!!!!!!!!!!!
    private lastErrorSendObj = null;    // save send object if socket not connected
    private lastSendObj = null;         // save send last object


    public connectSocketServer()
    {
        let self = this;

        if( !this.SocketSubscribe ) this.SocketSubscribe = new SocketSubscribe();

        let support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

        if (support == null) {
            //appendMessage("* " + noSupportMessage + "<br/>");
            return;
        }

        //appendMessage("* Connecting to server ..<br/>");
        // create a new websocket and connect
        self.ws = new WebSocket(this.connectionString);

        //self.ws.

        //window.setInterval(function () {
            //console.log(ws.readyState);
            //if (ws.readyState != 1)
                //ws = new window[support]('ws://localhost:2001/');
        //}, 1000);

        //console.log(ws.readyState);

        // when data is comming from the server, this metod is called
        self.ws.onmessage = (evt) => this.onMessage(evt);


        // when the connection is established, this method is called
        self.ws.onopen = () => this.onOpen();


        // when the connection is closed, this method is called
        self.ws.onclose = () => this.onClose();
    };


    /**
     * Public debug only !!!!!!!!!!!!!!!
     * @private
     * @param props
     */
    public sendMessage(props)
    {
        let self = this;

        if(__DEV__)
        {
            console.groupCollapsed("Socket send props");
            console.info(props);
            console.groupEnd();
        }

        if (self.ws) {
            try {
                self.ws.send(JSON.stringify(props));
                this.lastSendObj = props;
            } catch (e) {
                this.lastErrorSendObj = props;
            }
        }
    }


    public changeUser(userName) {
        this.ws.send(userName);
    };


    public connectWebSocket() {
        this.connectSocketServer();
    };



    /**
     * subscribe for data recieving
     * @param callback
     * @param type
     */
    public subscribe(callback, type) {
        this.callbacks[type] = callback;
    };



    /**
     * send subscribe data for socket
     * @param data Object
     */
    public sendSubscribe(inData, inType)
    {
        let params = this.SocketSubscribe.subscribe({data: inData, type: inType, lastObj: this.lastSendObj});
        this.sendMessage(params);

        return params;
    };



    private disconnectWebSocket()
    {
        let self = this;

        if (self.ws) {
            self.ws.close();
        }
    };



    private appendMessage(message)
    {
        //$('.executed').html(message + Math.random(0, 100))
        //$('.executed').append(message);
    };



    private onMessage(evt)
    {
        let self = this;

        let data = JSON.parse(evt.data);
        this.socketData = data; // for debug only
// console.log(data);

        if (data.Result) defaultMethods.showWarning(data.Result);
        if(data.CurrentOrders && (globalData.myOrdersOn || globalData.myPosOn)) window.ee.emit('yourOrders.update', data.CurrentOrders);//myOrdersControllerClass.updateData(data.CurrentOrders);

        if(data.OrdersPositionsHistory && globalData.myPosOn){
            window.ee.emit('myPosOrder.update', data.OrdersPositionsHistory.Positions);
            window.ee.emit('myOpenOrder.update', data.OrdersPositionsHistory.OrdersOrPositions);
            window.ee.emit('myOrderHistory.update', data.OrdersPositionsHistory.HistoryTradeItems);
        }
        if(data.AccountData) dataController && dataController.updateHeaderData(data.AccountData);


        // main page charts
        if(globalData.mainPage && globalData.MainCharOn) mainChartController.drawMainCharts(data.Bars);

        // BM: main page events data
// 0||console.debug( 'data.SymbolsAndOrders', data.SymbolsAndOrders );
        if (data.SymbolsAndOrders && data.SymbolsAndOrders.Result.length) {
            if(self.callbacks[WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES]) {
                // 0||console.debug( 'data.SymbolsAndOrders2', data.SymbolsAndOrders );
            // if(globalData.mainPage) {
                // 0||console.debug( 'data.SymbolsAndOrders.Result', data.SymbolsAndOrders.Result );
                // dataController.updateOrderData(data.SymbolsAndOrders.Result);
                self.callbacks[WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES](data.SymbolsAndOrders.Result);
            }
        }


        // Send chart data
        if(globalData.eventPageOn) { window.ee.emit('EventPage.Chart.setData', data.Bars); }
        // if(globalData.eventPageOn) eventChartController.drawEventChart(data.Bars);


        if(globalData.tradeOn) window.ee.emit('activeOrders.update', data.ActiveOrders);//activeTraderControllerClass.updateActiveTraiderData(data.ActiveOrders);

        // BM: event page data
        if (data.ActiveOrders != null && self.callbacks[WebsocketModel.CALLBACK_EVENTPAGE_ORDERS])
        {
            dataController.updateEventData(data.ActiveOrders, data.Bars);

            // fix received data
            let ret = this.SocketSubscribe.receiveData({ActiveOrders: data.ActiveOrders, Bars: data.Bars}, SocketSubscribe.EP_ACTIVE_ORDER);

            self.callbacks[WebsocketModel.CALLBACK_EVENTPAGE_ORDERS](ret.ActiveOrders, ret.Bars)
        }

        if(data.Result != null && globalData.eventPageOn)
        {
            defaultMethods.showError(data.Result);
        }
        //alert("message: " + evt.data);
        //appendMessage("# " + evt.data + "<br />");
    }



    private onOpen()
    {
        let self = this;
        console.log('socket open ts');

        // self.ws.send($('span.user-name').text());
        // if was a failed requests before open
        if( this.lastErrorSendObj )
        {
            self.ws.send(JSON.stringify(this.lastErrorSendObj));
            this.lastErrorSendObj = null;
        } // endif


        //appendMessage('* Connection open<br/>');
        //$('#messageInput').attr("disabled", "");
        //$('#sendButton').attr("disabled", "");
        //$('#connectButton').attr("disabled", "disabled");
        //$('#disconnectButton').attr("disabled", "");
    }



    private onClose() {
        // console.log('socket closed'); //self.ws.readyState
        defaultMethods.showError('socket closed');
        setTimeout(() => { this.connectSocketServer(); }, 1000);
        //appendMessage('* Connection closed<br/>');
        //$('#messageInput').attr("disabled", "disabled");
        //$('#sendButton').attr("disabled", "disabled");
        //$('#connectButton').attr("disabled", "");
        //$('#disconnectButton').attr("disabled", "disabled");
    }
}














$("#mp00").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "MainPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "0";
    obj.CurrentOrders = "0";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#mp01").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "MainPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "0";
    obj.CurrentOrders = "1";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#mp10").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "MainPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "1";
    obj.CurrentOrders = "0";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#mp11").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "MainPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "1";
    obj.CurrentOrders = "1";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});
//----------------------------------------------------------------------------
$("#ep00").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "EventPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "0";
    obj.CurrentOrders = "0";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#ep01").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "EventPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "0";
    obj.CurrentOrders = "1";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#ep10").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "EventPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "1";
    obj.CurrentOrders = "0";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#ep11").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "EventPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "1";
    obj.CurrentOrders = "1";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});
//--------------------------------------------------------------------
$("#op00").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "OrderPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "0";
    obj.CurrentOrders = "0";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#op01").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "OrderPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "0";
    obj.CurrentOrders = "1";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#op10").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "OrderPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "1";
    obj.CurrentOrders = "0";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});

$("#op11").click(function (e) {
    var obj : any = new Object();
    obj.User = $('span.user-name').text();
    obj.PageName = "OrderPage";
    obj.ExchangeName = $(".search #search").val();
    obj.ActiveTrader = "1";
    obj.CurrentOrders = "1";
    var jsonString = JSON.stringify(obj);
    ABpp.Websocket.sendMessage(jsonString);
});
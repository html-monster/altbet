/**
 * Socket model for creating a socket connection
 *
 * Created by Vlasakh on 19.12.2016.
 */

/// <reference path="../../.d/common.d.ts" />

import { SocketSubscribe } from "./SocketSubscribe";
import Notification from '../common/Notification';
// import {globalData} from "../../ts/index";


// старт подписок
export class WebsocketModel
{
    public static CALLBACK_MAINPAGE_EXCHANGES = "CMPE1";      // a main page receive data callback
    public static CALLBACK_MAINPAGE_CHART = "CMC1";      // a main page chart receive data callback
    public static CALLBACK_EVENTPAGE_ORDERS = "CEPO2";      // a event page receive data callback

    private noSupportMessage = "Your browser cannot support WebSocket!";
    private connectionString = "ws://localhost:2001/";
    // private connectionString = "ws://54.171.212.235:2001/";    // IP
    // private connectionString = "ws://192.168.1.249:2001/";

    private ws = null;                  // socket instance
    private SocketSubscribe = null;
    private callbacks = {};
    private socketData: any = null;
    private lastErrorSendObj = null;    // save send object if socket not connected
    private lastSendObj = null;         // save send last object
    private testTime = null;

    static MESSAGE_TYPES = {
        Default: 'default',
        Success: 'success',
        Info: 'info',
        Warning: 'warning',
        Error: 'error',
    };


    constructor()
    {
        if (globalData.webSocketUrl) this.connectionString = globalData.webSocketUrl;
    }


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
        this.testTime = new Date(); // socket started

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
                this.lastSendObj = props;
                self.ws.send(JSON.stringify(props));
            } catch (e) {
                this.lastErrorSendObj = props;
            }
        }
    }


    public changeUser(userName) {
        this.ws.send(userName);
    };


    // public connectWebSocket() {
    //     this.connectSocketServer();
    // };



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


    public testClose()
    {
        this.ws.close(3001, "manual disconnect");
    }



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
        if(!data) return;

        if (data.Result) {
            // code - тип сообщения (closedmarket|logout|etc)
            // message - текст
            // type - вид сообщения - success|info|warning|error
            if(data.Code === 'LogIn' && data.Message.slice(-20) === 'has been logged out.')
            {
                if(Visibility.state() === 'hidden') location.reload();// костыль чтобы перезагружались все страницы при разлогировании
            }
            else (new Notification).showMessage({msg: data.Message}, WebsocketModel.MESSAGE_TYPES[data.Type]);
            __DEV__&& console.log( data );
        }

        if(data.CurrentOrders && (globalData.myOrdersOn || globalData.myPosOn))
            window.ee.emit('yourOrders.update', data.CurrentOrders);//myOrdersControllerClass.updateData(data.CurrentOrders);

        if(data.OrdersPositionsHistory && globalData.myPosOn){
            window.ee.emit('myPosOrder.update', data.OrdersPositionsHistory.Positions);
            window.ee.emit('myOpenOrder.update', data.OrdersPositionsHistory.OrdersOrPositions);
            window.ee.emit('myOrderHistory.update', data.OrdersPositionsHistory.HistoryTradeItems);
        }
        if(data.AccountData) {
            // dataController && dataController.updateHeaderData(data.AccountData);
            window.ee.emit('accountData.update', data.AccountData)
        }


        // main page charts
        if(globalData.mainPage && globalData.MainCharOn)
        {
            // mainChartController && mainChartController.drawMainCharts(data.Bars);
            self.callbacks[WebsocketModel.CALLBACK_MAINPAGE_CHART](data.Bars)
        }

        // BM: main page events data
        if (data.SymbolsAndOrders && data.SymbolsAndOrders.Result.length) {
            if(self.callbacks[WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES]) {
                // 0||console.debug( 'data.SymbolsAndOrders2', data.SymbolsAndOrders );
            // if(globalData.mainPage) {
                // 0||console.debug( 'data.SymbolsAndOrders.Result', data.SymbolsAndOrders.Result );
                // dataController.updateOrderData(data.SymbolsAndOrders.Result);
                    self.callbacks[WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES]({SymbolsAndOrders: data.SymbolsAndOrders.Result, lineupsData: data.LineupData, SymbolLimitData: data.CurrentSymbolLimitData});
            }
        }


        // Send chart data
        if(globalData.eventPageOn) { window.ee.emit('EventPage.Chart.setData', data.Bars); }
        // if(globalData.eventPageOn) eventChartController.drawEventChart(data.Bars);

        if(ABpp.config.tradeOn && !ABpp.config.basicMode)
        {
            window.ee.emit('activeOrders.update', {ActiveOrders: data.ActiveOrders, SymbolLimitData: data.CurrentSymbolLimitData});//activeTraderControllerClass.updateActiveTraiderData(data.ActiveOrders);
        }

        // BM: event page data
        if (data.ActiveOrders != null && self.callbacks[WebsocketModel.CALLBACK_EVENTPAGE_ORDERS])
        {
            dataController.updateEventData(data.ActiveOrders, data.Bars);

            // fix received data
            let ret = this.SocketSubscribe.receiveData({ActiveOrders: data.ActiveOrders, Bars: data.Bars}, SocketSubscribe.EP_ACTIVE_ORDER);

            self.callbacks[WebsocketModel.CALLBACK_EVENTPAGE_ORDERS](ret.ActiveOrders, ret.Bars)
        }

        // if(data.Result != null && globalData.eventPageOn)
        // {
        //     defaultMethods.showError(data.Result);
        // }
        //alert("message: " + evt.data);
        //appendMessage("# " + evt.data + "<br />");
    }



    private onOpen()
    {
        let self = this;
        __DEV__ && console.log('socket open ts');

        // self.ws.send($('span.user-name').text());

        // if was a failed requests before open
        var sendObj = this.lastErrorSendObj || this.lastSendObj || null;
        // 0||console.log( 'sendObj', sendObj );
        if( sendObj )
        {
            self.ws.send(JSON.stringify(sendObj));
            this.lastErrorSendObj = null;
        } // endif

        $("[data-js-connect-label]").fadeOut(200);
    }



    private onClose() {
        // defaultMethods.showError('socket closed');
        $("[data-js-connect-label]").fadeIn(200);
        // setTimeout(() => { this.connectSocketServer(); }, 1000);

        var duration = moment.duration(moment(new Date()).diff(this.testTime));
        let data = {
            "StartTime": moment(this.testTime).format("H:mm:s DD MMM"),
            // "EndTime": moment(moment(this.testTime).diff(new Date())).format("H:mm:s DD MMM"),
            "EndTime": moment(new Date()).format("H:mm:s DD MMM"),
            "Duration": `${parseInt(duration.asHours())}h ${parseInt(duration.asMinutes())}m ${parseInt(duration.asSeconds())}s`,
        };
        console.group("Socket time debug");
        // console.groupCollapsed("Debug");
        console.info(data);
        console.groupEnd();
    }
}
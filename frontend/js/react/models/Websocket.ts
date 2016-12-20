/**
 * Socket model for creating a socket connection
 *
 * Created by Vlasakh on 19.12.2016.
 */

/// <reference path="./../../.d/common.d.ts" />

// declare var window;
// declare var globalData;


export class WebsocketModel
{
    private noSupportMessage = "Your browser cannot support WebSocket!";
    private ws = null;

    public callbackMainPage = null;     // a main page recieve data callback


    public connectSocketServer()
    {
        var self = this;

        var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

        if (support == null) {
            //appendMessage("* " + noSupportMessage + "<br/>");
            return;
        }

        //appendMessage("* Connecting to server ..<br/>");
        // create a new websocket and connect
        self.ws = new WebSocket('ws://localhost:2001/');

        //self.ws.

        console.log('socket open');

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


    public sendMessage()
    {
        var self = this;

        if (self.ws) {
            var messageBox = '{"MessageID":"e50e9ee3-0315-4f01-9316-335b19bd5d59","MessageType":"SubscribeRequest","Currency":"USD","Subscribe":true,"Symbol":{"Currency":"USD","Exchange":"FIRST","Name":"UAH\/USD"},"UserName":"testing@test.ua"}'; //document.getElementById('messageInput');
            // self.ws.send(messageBox.value);
            // messageBox.value = "";
        }
    }


    public changeUser(userName) {
        this.ws.send(userName);
    };


    public connectWebSocket() {
        this.connectSocketServer();
    };



    private disconnectWebSocket()
    {
        var self = this;

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
        var self = this;

        var data = JSON.parse(evt.data);
        // console.log(data);
        if (data.Result) defaultMethods.showWarning(data.Result);
        if(data.CurrentOrders && (globalData.myOrdersOn || globalData.myPosOn)) window.ee.emit('yourOrders.update', data.CurrentOrders);//myOrdersControllerClass.updateData(data.CurrentOrders);

        if(data.OrdersPositionsHistory && globalData.myPosOn){
            window.ee.emit('myPosOrder.update', data.OrdersPositionsHistory.Positions);
            window.ee.emit('myOpenOrder.update', data.OrdersPositionsHistory.OrdersOrPositions);
            window.ee.emit('myOrderHistory.update', data.OrdersPositionsHistory.HistoryTradeItems);
        }
        if(data.AccountData) dataController.updateHeaderData(data.AccountData);


        // main page charts
        if(globalData.mainPage && globalData.MainCharOn) mainChartController.drawMainCharts(data.Bars);

        // main page events data
        if (data.SymbolsAndOrders != null) {
            if(self.callbackMainPage) {
            // if(globalData.mainPage) {
                // 0||console.debug( 'data.SymbolsAndOrders.Result', data.SymbolsAndOrders.Result );
                // dataController.updateOrderData(data.SymbolsAndOrders.Result);
                self.callbackMainPage(data.SymbolsAndOrders.Result);
            }
        }


        // Send chart data
        if(globalData.eventPageOn) { window.ee.emit('EventPage.Chart.setData', data.Bars); }
        // if(globalData.eventPageOn) eventChartController.drawEventChart(data.Bars);


        if(globalData.tradeOn) window.ee.emit('activeOrders.update', data.ActiveOrders);//activeTraderControllerClass.updateActiveTraiderData(data.ActiveOrders);

        if (data.ActiveOrders != null)
            dataController.updateEventData(data.ActiveOrders, data.Bars);

        if(data.Result != null && globalData.eventPageOn)
        {
            defaultMethods.showError(data.Result);
        }
        //alert("message: " + evt.data);
        //appendMessage("# " + evt.data + "<br />");
    }



    private onOpen()
    {
        var self = this;

        self.ws.send($('span.user-name').text());
        //appendMessage('* Connection open<br/>');
        //$('#messageInput').attr("disabled", "");
        //$('#sendButton').attr("disabled", "");
        //$('#connectButton').attr("disabled", "disabled");
        //$('#disconnectButton').attr("disabled", "");
    }



    private onClose() {
        // console.log('socket closed'); //self.ws.readyState
        defaultMethods.showError('socket closed');
        setTimeout(function () { this.connectSocketServer(); }, 1000);
        //appendMessage('* Connection closed<br/>');
        //$('#messageInput').attr("disabled", "disabled");
        //$('#sendButton').attr("disabled", "disabled");
        //$('#connectButton').attr("disabled", "");
        //$('#disconnectButton').attr("disabled", "disabled");
    }
}
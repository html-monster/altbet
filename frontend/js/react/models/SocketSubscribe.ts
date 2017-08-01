/**
 * Created by tianna on 06.01.17.
 */

/// <reference path="../../.d/common.d.ts" />


export class SocketSubscribe
{
    public static MP_SYMBOLS_AND_ORDERS = '3';
    public static EP_ACTIVE_ORDER = '1';
    public static MYP_ORDERS_POSITIONS_HISTORY= '5';
    public static TRADER_ON = '2';
    public static CURRENT_ORDERS = '4';
    public static AP_ACCOUNT_DATA = '6';
    public static MP_CHARTS_SYMBOL = '7';
    public static MP_LINEUP = '8';

    private subscribeParams = { // last subscribe params
            UserBrowser: "",
            User: "",
            PageName: '',
            ExchangeName: "",
            ActiveTrader: "0", //ABpp.config.tradeOn ? "1" : "0",
            CurrentOrders: "0",
            PaginationNumber: '1',
            CategoryPath: '', //sport/american-football
            MainPageChartsSymbol: "",
        };
    private subscribeData = {};     // data from subscribers



    constructor()
    {
        // init subscribe data
        this.subscribeParams.UserBrowser = navigator.userAgent;
        this.subscribeParams.User = ABpp.User.login;
        this.subscribeParams.PageName = ABpp.config.currentPage;
    }



    /**
     * Set socket subscribe params
     */
    public subscribe({data, type, lastObj = null})
    {
        let ret;
        switch( type )
        {
            case SocketSubscribe.MP_SYMBOLS_AND_ORDERS : ret = this.setSymbolsAndOrders(data); break;
            case SocketSubscribe.MP_CHARTS_SYMBOL : ret = this.setMpChartsSymbol(data); break;
            case SocketSubscribe.MP_LINEUP : ret = this.setCurrentOrders(data); break;
            case SocketSubscribe.AP_ACCOUNT_DATA : ret = this.setAccountData(data); break;
            case SocketSubscribe.EP_ACTIVE_ORDER : ret = this.setActiveOrder(data); break;
            case SocketSubscribe.MYP_ORDERS_POSITIONS_HISTORY : ret = this.setOrdersPositionsHistory(data); break;
            case SocketSubscribe.TRADER_ON : ret = this.setTraderOn(data); break;
            case SocketSubscribe.CURRENT_ORDERS : ret = this.setCurrentOrders(data); break;
            default: return ;
        }
        return this.subscribeParams = ret;
    }



    /**
     * receive data from socket
     * @param inData
     * @param inType
     */
    public receiveData(inData, inType)
    {
        switch( inType )
        {
            case SocketSubscribe.EP_ACTIVE_ORDER : return this.receiveActiveOrderFixData(inData);
            default: return ;
        }
    }



    /**
     * set SymbolsAndOrders for main page
     * @param props
     */
    private setSymbolsAndOrders(props)
    {
        this.subscribeData[SocketSubscribe.MP_SYMBOLS_AND_ORDERS] = { params: props };

        var path;
        try {
            path = appData.pageHomeData.Pagination.RouteParams.path;
        } catch (e) {
        }

        props = { ...this.subscribeParams,
            User: ABpp.User.login,
            PageName: 'MainPage',
            ExchangeName: props.exchange,
            LineupsSymbol: props.symbol,
            ActiveTrader: ABpp.config.tradeOn ? "1" : "0",
            // CurrentOrders: "0",
            PaginationNumber: appData.urlQuery.pageNum || "1",
            CategoryPath: path, //sport/american-football
            Sort: appData.urlQuery.sortType || "closingsoon",
            Filter: appData.urlQuery.filter || "closingsoon",
            // CategoryPath: '',
        };

        return props;
    }


    /**
     * set AccountData for account page
     * @param props
     */
    private setAccountData(props)
    {

        props = { ...this.subscribeParams,
            User: ABpp.User.login,
            PageName: 'MainPage',
        };

        return props;
    }



    /**
     * set active order for event page
     * @param props
     */
    private setActiveOrder(props)
    {
        this.subscribeData[SocketSubscribe.EP_ACTIVE_ORDER] = { params: props };

        props = { ...this.subscribeParams,
            User: ABpp.User.login,
            PageName: 'EventPage',
            ExchangeName: props.exchange,
            ActiveTrader: "1",
            // CurrentOrders: "0",
        };

        return props;
    }



    /**
     * set active order for event page
     * @param props
     */
    private setOrdersPositionsHistory(props)
    {
        props = { ...this.subscribeParams,
            User: ABpp.User.login,
            PageName: 'OrderPage',
        };

        return props;
    }



    /**
     * set active trader on/off
     * @param props
     */
    private setTraderOn(props)
    {
        props = { ...this.subscribeParams,
            ExchangeName: props.exchange ? props.exchange : this.subscribeParams.ExchangeName,
            ActiveTrader: props.tradeOn ? "1" : "0",
        };

        return props;
    }



    /**
     * set current orders on/off
     * @param props
     */
    private setCurrentOrders(props)
    {
        props = { ...this.subscribeParams,
            CurrentOrders: props ? "1" : "0",
        };

        return props;
    }



    /**
     * receive active order data from socket for event page
     * @param data
     */
    private receiveActiveOrderFixData(inData)
    {
        let params = this.subscribeData[SocketSubscribe.EP_ACTIVE_ORDER].params;


        // filter right data for orders
        let activeOrders = null;
        for( let val of inData.ActiveOrders )
        {
            if( val.Symbol.Exchange == params.exchange ) {activeOrders = val; break;}
        } // endfor


        // filter right data for ticks
        let bars = null;
        for( let val of inData.Bars )
        {
            if( val.Symbol.Exchange == params.exchange ) bars = val;
        } // endfor

        // 0||console.debug( 'receiveActiveOrderFixData', inData, params, activeOrders );
        return {ActiveOrders: activeOrders, Bars: bars};
    }



    /**
     * set main page chart open
     * @param props
     */
    private setMpChartsSymbol(props)
    {
        props = { ...this.subscribeParams,
            MainPageChartsSymbol: props.exchange,
        };

        return props;
    }

}

window.SocketSubscribe = SocketSubscribe;
/**
 * Created by tianna on 06.01.17.
 */


export class SocketSubscribe
{
    public static MP_SYMBOLS_AND_ORDERS = '3';
    public static EP_ACTIVE_ORDER = '1';
    public static TRADER_ON = '2';

    private subscribeParams = {
            User: "",
            PageName: '',
            ExchangeName: "",
            ActiveTrader: "0", //ABpp.config.tradeOn ? "1" : "0",
            CurrentOrders: "0",
        };
    private subscribeData = {};     // data from subscribers



    constructor()
    {
        // init subscribe data
        this.subscribeParams.User = ABpp.User.login;
        this.subscribeParams.PageName = ABpp.config.currentPage;
    }



    /**
     * Set socket subscribe params
     */
    public subscribe({data, type, lastObj = null})
    {
        switch( type )
        {
            case SocketSubscribe.MP_SYMBOLS_AND_ORDERS : return this.setSymbolsAndOrders(data);
            case SocketSubscribe.EP_ACTIVE_ORDER : return this.setActiveOrder(data);
            case SocketSubscribe.TRADER_ON : return this.setTraderOn(lastObj);
            default: return ;
        }
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
        this.subscribeParams[SocketSubscribe.EP_ACTIVE_ORDER] = { params: props };

        props = {
            User: ABpp.User.login,
            PageName: 'MainPage',
            ExchangeName: props.exchange,
            ActiveTrader: "0", //ABpp.config.tradeOn ? "1" : "0",
            CurrentOrders: "0",
        };
        return props;
    }



    /**
     * set active order for event page
     * @param props
     */
    private setActiveOrder(props)
    {
        this.subscribeParams[SocketSubscribe.EP_ACTIVE_ORDER] = { params: props };

        props = {
            User: ABpp.User.login,
            PageName: 'EventPage',
            ExchangeName: props.exchange,
            ActiveTrader: "0", //ABpp.config.tradeOn ? "1" : "0",
            CurrentOrders: "0",
        };
        return props;
    }



    /**
     * set active trader on/off
     * @param props
     */
    private setTraderOn(props)
    {
        // todo: доделать exchange
        // this.subscribeParams[SocketSubscribe.EP_ACTIVE_ORDER] = { params: props };

        props = { ...props,
            ExchangeName: props.exchange,
            ActiveTrader: ABpp.config.tradeOn ? "1" : "0",
        };
        return props;
    }



    /**
     * receive active order data from socket for event page
     * @param data
     */
    private receiveActiveOrderFixData(inData)
    {
        let params = this.subscribeParams[SocketSubscribe.EP_ACTIVE_ORDER].params;


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
}
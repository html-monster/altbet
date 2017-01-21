/**
 * Created by tianna on 06.01.17.
 */


export class SocketSubscribe
{
    public static EP_ACTIVE_ORDER = '1';
    public static TRADER_ON = '2';

    private subscribeParams = {};


    /**
     *
     * @param inData
     * @param inType
     */
    public subscribe(inData, inType)
    {
        switch( inType )
        {
            case SocketSubscribe.EP_ACTIVE_ORDER : return this.setActiveOrder(inData);
            case SocketSubscribe.TRADER_ON : return this.setTraderOn(inData);
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
            ActiveTrader: ABpp.config.tradeOn ? "1" : "0",
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
        // this.subscribeParams[SocketSubscribe.EP_ACTIVE_ORDER] = { params: props };

        props = {
            ActiveTrader: ABpp.config.tradeOn ? "1" : "0",
            sendLastObj: true,
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
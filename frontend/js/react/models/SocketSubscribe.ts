/**
 * Created by tianna on 06.01.17.
 */


export class SocketSubscribe
{
    public static EP_ACTIVE_ORDER = 'EP_ACTIVE_ORDER';

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
     * @param data
     */
    private setActiveOrder(data)
    {
        this.subscribeParams[SocketSubscribe.EP_ACTIVE_ORDER] = { params: data };

        return {someparams: null};
    }



    /**
     * receive active order data from socket for event page
     * @param data
     */
    private receiveActiveOrderFixData(inData)
    {
        let params = this.subscribeParams[SocketSubscribe.EP_ACTIVE_ORDER].params;

        let activeOrders = null;
        for( let val of inData.ActiveOrders )
        {
            if( val.Symbol.Exchange == params.exchange ) activeOrders = val;
        } // endfor

        // 0||console.debug( 'receiveActiveOrderFixData', inData, params, activeOrders );


        return {ActiveOrders: activeOrders, Bars: inData.Bars};
    }
}
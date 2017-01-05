import {
    ON_SOCKET_MESSAGE,
} from '../constants/ActionTypesPageEvent'

import BaseActions from './BaseActions';
import { WebsocketModel } from '../models/Websocket';


var __LDEV__ = true;

class Actions extends BaseActions
{
    public actionOnLoad()
    {
        return (dispatch, getState) =>
        {
            ABpp.Websocket.subscribe((inActiveOrders, inBars) =>
            {
                // __DEV__&&console.debug( 'on load ok' , inActiveOrders, inBars, getState());
                let activeOrders = getState().eventPage.socket.activeOrders;
                let bars = getState().eventPage.socket.bars;

                if( JSON.stringify(inActiveOrders) != JSON.stringify(activeOrders) ||
                    JSON.stringify(inBars) != JSON.stringify(bars) )
                {
    // __DEV__&&console.debug( 'changed', inActiveOrders, inBars,  activeOrders, bars );
                    dispatch({
                        type: ON_SOCKET_MESSAGE,
                        payload: { activeOrders: inActiveOrders, bars: inBars }
                    });
    //             }
    //             else
    //             {
    // __DEV__&&console.debug('samedata');
                } // endif

            }, WebsocketModel.CALLBACK_EVENTPAGE_ORDERS);
        }
    }



    /**
     * Create bet form in side bar
     * @param props
     * @return {(dispatch:any, getState:any)=>undefined}
     */
    public actionOnPosPriceClick(props)
    {


        return (dispatch, getState) =>
        {
            // 0||console.debug( 'getState()', getState() );
            // getState().App.controllers.TradeSlip.createNewOrder(outStruc);
            // dispatch({
            //     type: ON_POS_PRICE_CLICK,
            //     payload: {}
            // });
        }
    }
}


export default (new Actions()).export();

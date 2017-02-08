/**
 * Created by Vlasakh on 25.01.2017.
 */


// import {
//     ON_LOAD,
// } from '../constants/ActionTypesMyPos.js';
// import { WebsocketModel } from '../models/Websocket';
import BaseActions from './BaseActions';
import {SocketSubscribe} from "../models/SocketSubscribe";


var __LDEV__ = true;
// var __LDEV__ = false;


class Actions extends BaseActions
{
    public actionOnLoad()
    {
        return (dispatch, getState) =>
        {
            ABpp.Websocket.sendSubscribe({}, SocketSubscribe.MYP_ORDERS_POSITIONS_HISTORY);

    //         ABpp.Websocket.subscribe((inData) =>
    //         {
    //             let state = getState().mainPage.marketsData;
    //
    //             if( JSON.stringify(inData) != JSON.stringify(state) )
    //             {
    // // __DEV__&&console.debug( 'inData', inData, state );
    //                 dispatch({
    //                     type: ON_SOCKET_MESSAGE,
    //                     payload: inData
    //                 });
    // //             }
    // //             else
    // //             {
    // // __DEV__&&console.debug('samedata');
    //             } // endif
    //
    //         }, WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES);


            // dispatch({
            //     type: ON_POS_PRICE_CLICK,
            //     payload: [data.Symbol.Exchange, false]
            // });
        }
    }
}

export default (new Actions()).export();

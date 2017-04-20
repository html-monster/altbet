// import {
//     ON_POS_PRICE_CLICK,
//     ON_SOCKET_MESSAGE,
//     ON_BASIC_MODE_CH,
//     TRAIDER_MODE_CH,
// } from '../constants/ActionTypesPageMain';
import BaseActions from './BaseActions';


var __LDEV__ = !true;

declare let orderClass;

class Actions extends BaseActions
{
    public actionTest(inProps)
    {
        return (dispatch, getState) =>
        {
            // let state = getState().mainPage;

            // ABpp.Websocket.sendSubscribe({exchange: inProps.exchange}, SocketSubscribe.MP_CHARTS_SYMBOL);

            // dispatch({
            //     type: type,
            //     payload: data,
            // });
        };
    }
}

export default (new Actions()).export();

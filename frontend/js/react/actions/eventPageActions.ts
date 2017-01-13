import {
    ON_SOCKET_MESSAGE,
} from '../constants/ActionTypesPageEvent'

import BaseActions from './BaseActions';
import { WebsocketModel } from '../models/Websocket';
import { SocketSubscribe } from '../models/SocketSubscribe';


var __LDEV__ = true;

class Actions extends BaseActions
{
    public actionOnLoad(inProps)
    {
        return (dispatch, getState) =>
        {
            // subscribe for data
            ABpp.Websocket.sendSubscribe({exchange: inProps.exchange}, SocketSubscribe.EP_ACTIVE_ORDER);

            // receive data
            ABpp.Websocket.subscribe((inActiveOrders, inBars) =>
            {
                // __DEV__&&console.debug( 'on load ok' , inActiveOrders, inBars, getState());
                let activeOrders = getState().eventPage.socket.activeOrders;
                let bars = getState().eventPage.socket.bars;

                if( !activeOrders || JSON.stringify(inActiveOrders.Symbol) != JSON.stringify(activeOrders.Symbol) || false
                    /*JSON.stringify(inBars) != JSON.stringify(bars)*/ )
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



    public activeTraiderActivate(data)
    {
        return (dispatch, getState) =>
        {
            // let data = getState().mainPage.marketsData["0"];
// 0||console.debug( 'data', data );

            if( $('.left_order .tab input.limit').prop('checked') )
            {
                // remove after move react
                // $('.content_bet').removeClass('active');
                // $('.event-content').removeClass('active');

                // todo: needs move to sidebar
                // set current tab
                $('.active_trader .event_title .event_name').removeClass('active').eq(data.isMirror ? 1 : 0).addClass('active');

                // todo: needs move to sidebar
                // set new tabs titles
                // var tabs = $('.active_trader .event_title .event_name');
                // var ii = 0;
                // tabs.each(function () {
                //     $(this).text(inProps.title[ii++]);
                // });


                // todo: needs move to activeTrader
                // берет данные при смене события(название события, symbol и т.п.)
                var activeTrader = $('.active_trader');
                activeTrader.attr('id', 'trader_' + `${data.SymbolsAndOrders.Symbol.Exchange}_${data.SymbolsAndOrders.Symbol.Name}_${data.SymbolsAndOrders.Symbol.Currency}`);
                activeTrader.find('table.limit tbody').removeClass('scroll_dis');

                activeTraderClass.spreaderClean(true);
                activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), false);
            } // endif
        };
    }

}


export default (new Actions()).export();

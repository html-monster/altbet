import {
    ON_SOCKET_MESSAGE,
    ON_TRADE_ONOFF,
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



    public onQuantityClick(inProps)
    {
        return (dispatch, getState) =>
        {
            0||console.log( 'inProps', inProps );
/*
        let flag = false;
        let qt : any = 0,
            bpr : any = props.type == 1 ? 0 : 99;
        let isBasicMode = ABpp.config.basicMode;

        if( props.isempty )
        {
            bpr = "0.";
            qt = '';
        }
        else
        {
            if( isBasicMode )
            {
                qt = props.quantity;
                bpr = props.price;
            }
            else
            {
                for( let val of props.PosPrice )
                {
                    if (!flag && val.Price == props.price) flag = true;
                    if( props.type == 1 )
                    {
                        if( flag )
                        {
                            qt += val.Quantity;
                            bpr < val.Price && (bpr = val.Price);
                        } // endif
                    }
                    else
                    {
                        if( !flag || val.Price == props.price )
                        {
                            qt += val.Quantity;
                            bpr > val.Price && (bpr = val.Price);
                        } // endif
                    } // endif
                } // endfor
            } // endif
        } // endif

        props.ismirror && !props.isempty && (bpr = Common.toFixed(1 - bpr, 2));

0||console.debug( '!!props.isempty', !!props.isempty );
        let outStruc = {
            "ID": `${props.data.exdata.Exchange}_${props.data.exdata.Name}_${props.data.exdata.Currency}`, // "NYG-WAS-12252016_NYG-WAS_USD",
            "EventTitle": props.ismirror ? props.data.exdata.AwayName : props.data.exdata.HomeName,
            "Positions": props.data.exdata.Positions,
            "isMirror": props.ismirror ? 1 : 0,
            "Orders": [
                {
                    "Price": bpr,
                    "Side": props.type == 1 ? 1 : 0, // sell/buy
                    "Symbol": {
                        "Exchange": props.data.exdata.Exchange,
                        "Name": props.data.exdata.Name,
                        "Currency": props.data.exdata.Currency
                    },
                    "Volume": qt,
                    "Limit": isBasicMode ? true : !!props.isempty, // empty ? true : false
                    "NewOrder": true,
                    "isMirror": props.ismirror ? 1 : 0
                },
            ]
        };
        __LDEV__&&console.debug( 'outStruc', props, outStruc );
        */
            // dispatch({
            //     type: ON_SOCKET_MESSAGE,
            //     payload: { activeOrders: inActiveOrders, bars: inBars }
            // });
        }
    }



    public activeTraiderActivate(data)
    {
        return (dispatch, getState) =>
        {
            // let data = getState().mainPage.marketsData["0"];
// 0||console.debug( 'data', data );

            // if( $('.left_order .tab input.limit').prop('checked') )
            if( ABpp.config.tradeOn )
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


            dispatch({
                type: ON_TRADE_ONOFF,
                payload: { isTraiderOn: ABpp.config.tradeOn }
            });
        };
    }

}


export default (new Actions()).export();

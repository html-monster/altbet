import {
    ON_SOCKET_MESSAGE,
    ON_TRADE_ONOFF,
} from '../constants/ActionTypesPageEvent'

import BaseActions from './BaseActions';
import { WebsocketModel } from '../models/Websocket';
import { SocketSubscribe } from '../models/SocketSubscribe';


let __LDEV__ = true;
declare let orderClass;

class Actions extends BaseActions
{
    public actionOnLoad(inProps)
    {
        return (dispatch, getState) =>
        {
            ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: inProps.exchange, isMirror: appData.pageEventData.IsMirror, symbol: inProps.symbol});
            // subscribe for data
            ABpp.Websocket.sendSubscribe({exchange: inProps.exchange}, SocketSubscribe.EP_ACTIVE_ORDER);


            // receive data
            ABpp.Websocket.subscribe((inActiveOrders, inBars) =>
            {
                // __DEV__&&console.debug( 'on load ok' , inActiveOrders, inBars, getState());
                let activeOrders = getState().eventPage.socket.activeOrders;
                let bars = getState().eventPage.socket.bars;

                // if( !activeOrders || JSON.stringify(inActiveOrders.Orders) != JSON.stringify(activeOrders.Orders) || false
                if( !activeOrders || JSON.stringify(inActiveOrders) != JSON.stringify(activeOrders) || false
                    /*JSON.stringify(inBars) != JSON.stringify(bars)*/ )
    // __DEV__&&console.debug( 'changed socket', inActiveOrders, inBars,  activeOrders, bars );
                {
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



    public onQuantityClick(inProps, actions)
    {
        return (dispatch, getState) =>
        {
            // console.log( 'inProps', inProps );

            // if( !ABpp.config.tradeOn )
            // {
                let props = inProps;
                let flag = false;
                let qt : any = 0,
                    bpr = (inProps.Price).toFixed(2);
                    // bpr = props.data[0].Price;
                let isBasicMode = ABpp.config.basicMode;


                for( let val of props.data )
                {
                    qt += val.Quantity;

                    if (val.Price == props.Price) break
                } // endfor

                if (inProps.exdata.isMirror) bpr = (1 - bpr).toFixed(2);

        // 0||console.debug( 'bpr', bpr, qt);

                // return;
                let outStruc = {
                    "ID": `${props.exdata.Exchange}_${props.exdata.Name}_${props.exdata.Currency}`, // "NYG-WAS-12252016_NYG-WAS_USD",
                    "EventTitle": props.exdata.isMirror ? props.exdata.AwayName : props.exdata.HomeName,
                    "Positions": props.exdata.Positions,
                    "isMirror": props.exdata.isMirror ? 1 : 0,
                    "Bid": inProps.exdata.Bid,
                    "Ask": inProps.exdata.Ask,
                    "Orders": [
                        {
                            "Price": bpr,//ABpp.config.basicMode ? bpr : props.bestPrice,
                            "Side": props.type == 1 ? 0 : 1, // sell/buy
                            "Symbol": {
                                "Exchange": props.exdata.Exchange,
                                "Name": props.exdata.Name,
                                "Currency": props.exdata.Currency
                            },
                            "Volume": qt,
                            "Limit": true, //ABpp.config.basicMode,
                            "NewOrder": true,
                            "isMirror": props.exdata.isMirror ? 1 : 0
                        },
                    ]
                };
                __LDEV__&&console.debug( 'outStruc', props, outStruc );

                // === Htmlbook === 17-02-09 ===============================================
                orderClass.tabReturn();
                // === Htmlbook === 17-02-09 ===============================================

                // call trade slip action
                if(ABpp.config.tradeOn)
                {
                    let order : any = outStruc.Orders[0];
                    let index = order.Price === '0.' ? 'empty' : Math.round(99 - order.Price * 100);

                    actions.actionAddDefaultOrder(null, {
                        direction: order.Side ? 'sell' : 'buy',
                        price: order.Price,
                        quantity: order.Volume,
                        limit: order.Limit,
                        outputOrder: true
                    }, order.Limit ? index : 'market');
                }
                else
                    actions.actionOnOrderCreate(outStruc);
                // getState().App.controllers.TradeSlip.createNewOrder(outStruc);

                // dispatch({
                //     type: ON_SOCKET_MESSAGE,
                //     payload: { activeOrders: inActiveOrders, bars: inBars }
                // });
            // } // endif
        }
    }



    public onPriceClick(inProps, actions)
    {
        return (dispatch, getState) =>
        {
            // 0||console.log( 'inProps', inProps );

            // if( !ABpp.config.tradeOn )
            // {
                let props = inProps;
                let flag = false;
                let qt : any = 0,
                    bpr = "0.";
                let isBasicMode = ABpp.config.basicMode;


                for( let val of props.data )
                {
                    qt += val.Quantity;
                } // endfor

        // 0||console.debug( 'bpr', bpr, qt);
                bpr = inProps.exdata.isMirror ? (1 - props.Price).toFixed(2) : (props.Price).toFixed(2);

                // return;
                let outStruc = {
                    "ID": `${props.exdata.Exchange}_${props.exdata.Name}_${props.exdata.Currency}`, // "NYG-WAS-12252016_NYG-WAS_USD",
                    "EventTitle": props.exdata.isMirror ? props.exdata.AwayName : props.exdata.HomeName,
                    "Positions": props.exdata.Positions,
                    "isMirror": props.exdata.isMirror ? 1 : 0,
                    "Bid": inProps.exdata.Bid,
                    "Ask": inProps.exdata.Ask,
                    "Orders": [
                        {
                            "Price": bpr,
                            "Side": props.type == 0 ? 0 : 1, // sell/buy
                            "Symbol": {
                                "Exchange": props.exdata.Exchange,
                                "Name": props.exdata.Name,
                                "Currency": props.exdata.Currency
                            },
                            "Volume": '',
                            "Limit": true,
                            "NewOrder": true,
                            "isMirror": props.exdata.isMirror ? 1 : 0
                        },
                    ]
                };
                __LDEV__&&console.debug( 'outStruc', props, outStruc );

                if(ABpp.config.tradeOn)
                {
                    let order : any = outStruc.Orders[0];
                    let index = order.Price === '0.' ? 'empty' : Math.round(99 - order.Price * 100);

                    actions.actionAddDefaultOrder(null, {
                        direction: order.Side ? 'sell' : 'buy',
                        price: order.Price,
                        quantity: order.Volume,
                        limit: order.Limit,
                        outputOrder: true
                    }, order.Limit ? index : 'market');
                }
                else
                    actions.actionOnOrderCreate(outStruc);
                // getState().App.controllers.TradeSlip.createNewOrder(outStruc);

                // === Htmlbook === 17-02-09 ===============================================
                orderClass.tabReturn();
                // === Htmlbook === 17-02-09 ===============================================

                // dispatch({
                //     type: ON_SOCKET_MESSAGE,
                //     payload: { activeOrders: inActiveOrders, bars: inBars }
                // });
            // } // endif
        }
    }



    public onSellBuyClick(inProps, actions)
    {
        return (dispatch, getState) =>
        {
            // 0||console.log( 'inProps', inProps, ABpp.config.tradeOn );

            // if( !ABpp.config.tradeOn )
            // {
                let props = inProps;

                let outStruc = {
                    "ID": `${props.exdata.Exchange}_${props.exdata.Name}_${props.exdata.Currency}`, // "NYG-WAS-12252016_NYG-WAS_USD",
                    "EventTitle": props.exdata.isMirror ? props.exdata.AwayName : props.exdata.HomeName,
                    "Positions": props.exdata.Positions,
                    "isMirror": props.exdata.isMirror ? 1 : 0,
                    "Bid": inProps.exdata.Bid,
                    "Ask": inProps.exdata.Ask,
                    "Orders": [
                        {
                            "Price": "0.",
                            "Side": props.type == 0 ? 0 : 1, // sell/buy
                            "Symbol": {
                                "Exchange": props.exdata.Exchange,
                                "Name": props.exdata.Name,
                                "Currency": props.exdata.Currency
                            },
                            "Volume": "",
                            "Limit": true,
                            "NewOrder": true,
                            "isMirror": props.exdata.isMirror ? 1 : 0
                        },
                    ]
                };
                // __LDEV__&&console.debug( 'outStruc', props, outStruc );
            // === Htmlbook === 17-02-09 ===============================================
            orderClass.tabReturn();
            // === Htmlbook === 17-02-09 ===============================================

            if(ABpp.config.tradeOn)
            {
                let order : any = outStruc.Orders[0];
                let index = order.Price === '0.' ? 'empty' : Math.round(99 - order.Price * 100);

                actions.actionAddDefaultOrder(null, {
                    direction: order.Side ? 'sell' : 'buy',
                    price: order.Price,
                    quantity: order.Volume,
                    limit: order.Limit,
                    outputOrder: true
                }, order.Limit ? index : 'market');
            }
            else
                actions.actionOnOrderCreate(outStruc);
                // getState().App.controllers.TradeSlip.createNewOrder(outStruc);

                // dispatch({
                //     type: ON_SOCKET_MESSAGE,
                //     payload: { activeOrders: inActiveOrders, bars: inBars }
                // });
            // } // endif
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
                // $('.active_trader .event_title .event_name').removeClass('active').eq(data.isMirror ? 1 : 0).addClass('active');

                // todo: needs move to sidebar
                // set new tabs titles
                // var tabs = $('.active_trader .event_title .event_name');
                // var ii = 0;
                // tabs.each(function () {
                //     $(this).text(inProps.title[ii++]);
                // });


                // todo: needs move to activeTrader
                // берет данные при смене события(название события, symbol и т.п.)
                // var activeTrader = $('.active_trader');
                // activeTrader.attr('id', 'trader_' + `${data.SymbolsAndOrders.Symbol.Exchange}_${data.SymbolsAndOrders.Symbol.Name}_${data.SymbolsAndOrders.Symbol.Currency}`);
                // activeTrader.find('table.limit tbody').removeClass('scroll_dis');

                // activeTraderClass.spreaderClean(true);
                // activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), false);
            } // endif


            dispatch({
                type: ON_TRADE_ONOFF,
                payload: ABpp.config.tradeOn,
            });
        };
    }

}


export default (new Actions()).export();

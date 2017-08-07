import {
    MP_ON_POS_PRICE_CLICK,
    MP_ON_SOCKET_MESSAGE,
    MP_CHART_ON_SOCKET_MESSAGE,
    MP_ON_BASIC_MODE_CH,
    MP_TRAIDER_MODE_CH,
    MP_ON_CHANGE_SUBSCRIBING,
    MP_ON_CHANGE_ORDER_VISABLT,
    MP_ON_CHANGE_ORDER_PRICE
} from '../constants/ActionTypesPageMain';
import { WebsocketModel } from '../models/Websocket';
import { Common } from '../common/Common';
import BaseActions from './BaseActions';
import { SocketSubscribe } from "../models/SocketSubscribe";
import {DateLocalization} from "../models/DateLocalization";
import {PushNotification} from "../models/PushNotification.js";

var __LDEV__ = !true;
/// <reference path="../../.d/common.d.ts" />


// declare let orderClass;

class Actions extends BaseActions
{
    public actionOnLoad()
    {

        let OneSignal = new PushNotification();
        OneSignal.init();
        OneSignal.pushOneSignal();

        return (dispatch, getState) =>
        {
            let flag = true;
            let data = getState().mainPage.marketsData["0"];

            // prevent empty data error
            if( !data ) { data = {Symbol: {}}; flag = false; }

            // console.log('data:', data);
            let symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
            ABpp.Websocket.sendSubscribe({exchange: data.Symbol.Exchange, symbol: data.Symbol.Exchange}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);
            flag && ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: data.Symbol.Exchange, symbol: symbol, isMirror: false,
                HomeName: data.Symbol.HomeName, AwayName: data.Symbol.AwayName, startDate: data.Symbol.StartDate, endDate: data.Symbol.EndDate});
            // flag && setTimeout(() => ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: data.Symbol.Exchange, symbol: symbol, isMirror: false,
            //     HomeName: data.Symbol.HomeName, AwayName: data.Symbol.AwayName, startDate: data.Symbol.StartDate, endDate: data.Symbol.EndDate}), 700);

            ABpp.Websocket.subscribe(({SymbolsAndOrders, lineupsData, SymbolLimitData}) =>
            {
                let state = getState().mainPage;

                let compare = SymbolsAndOrders.some((item, index)=>{
                        delete item.TimeRemains;// костыль убирает TimeRemains (надо этот момент подправить)
                        delete state.marketsData[index].TimeRemains;
                        return JSON.stringify(item) !== JSON.stringify(state.marketsData[index])
                });

                if( compare || JSON.stringify(state.SymbolLimitData) !== JSON.stringify(SymbolLimitData) )
                {
                    dispatch({
                        type: MP_ON_SOCKET_MESSAGE,
                        payload: {dataName: 'SymbolsAndOrders', SymbolsAndOrders, SymbolLimitData}
                    });
                    __DEV__ && console.log('re-render');
                } // endif

                if(!state.lineupsData || JSON.stringify(lineupsData.HomeTeam) !== JSON.stringify(state.lineupsData.HomeTeam) ||
                    JSON.stringify(lineupsData.AwayTeam) !== JSON.stringify(state.lineupsData.AwayTeam))
                {
                    let fppg = 0, eppg = 0, score = 0, etr = 0;

                    lineupsData.HomeTeam.Items.forEach((item) =>
                    {
                        fppg += item.FPPG;
                        eppg += item.EPPG;
                        score += item.Score;
                        etr += item.ETR;
                    });
                    lineupsData.HomeTotals = {
                        FPPG: Math.round10(fppg, -2),
                        EPPG: Math.round10(eppg, -2),
                        Score: Math.round10(score, -2),
                        ETR: Math.round10(etr, -2)
                    };

                    fppg = 0; eppg = 0; score = 0; etr = 0;

                    lineupsData.AwayTeam.Items.forEach((item) =>
                    {
                        fppg += item.FPPG;
                        eppg += item.EPPG;
                        score += item.Score;
                        etr += item.ETR;
                    });
                    lineupsData.AwayTotals = {
                        FPPG: Math.round10(fppg, -2),
                        EPPG: Math.round10(eppg, -2),
                        Score: Math.round10(score, -2),
                        ETR: Math.round10(etr, -2)
                    };

                    dispatch({
                        type: MP_ON_SOCKET_MESSAGE,
                        payload: {dataName: 'lineupsData', lineupsData}
                    });
                    __DEV__ && console.log('lineups re-render');
                }

            }, WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES);

            ABpp.Websocket.subscribe((inData) =>
            {
                if(inData)
                {
                    const fromSocket = JSON.stringify(inData); // copy inData and create pure not changed data
                    // console.log('inData:', inData);
                    // console.log('serverChartsData:', JSON.stringify(getState().mainPage.serverChartsData));
                    // console.log(JSON.stringify(fromSocket) !== JSON.stringify(getState().mainPage.serverChartsData));
                    // if(fromSocket !== JSON.stringify(getState().mainPage.serverChartsData))
                    // {
                        let newObj = {};

                        inData.forEach((item) =>
                        {
                            item.Ticks.map((subItem) =>
                            {
                                subItem.Time = (new DateLocalization()).fromSharp(subItem.Time); // правка серверного timestamp-а
                                return subItem;
                            });
                            newObj[item.Symbol.Exchange] = item; // переделка массива в объект с ключами Exchange
                        });

                        dispatch({
                            type: MP_CHART_ON_SOCKET_MESSAGE,
                            payload: { serverChartsData: JSON.parse(fromSocket), newObj }
                        });

                        __DEV__ && console.log('chart rendered');
                    // }
                }

            }, WebsocketModel.CALLBACK_MAINPAGE_CHART);

            dispatch({
                type: MP_ON_POS_PRICE_CLICK,
                payload: [data.Symbol.Exchange, false]
            });
        }
    }



    /**
     * Create bet form in side bar
     * @param context - контекст MainPage (для проброски defaultOrderSidebarActions)
     * @param props
     * @return {(dispatch:any, getState:any)=>undefined}
     */
    public actionOnPosPriceClick(context, props)
    {
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
            bpr = +props.price;
            for( let val of props.PosPrice )
            {
                if( props.ismirror )
                {
                    if( props.type == 1 ) // buy
                    {
                        qt += val.Quantity;
                        if( val.Price == props.price ) break;
                    }
                    else // sell
                    {
                        if( val.Price == props.price ) flag = true;

                        if( flag )
                        {
                            qt += val.Quantity;
                        } // endif
                    } // endif
                }
                else
                {
                    if (!flag && val.Price == props.price) flag = true;

                    if( props.type == 1 )
                    {
                        if( flag )
                        {
                            qt += val.Quantity;
                        } // endif
                    }
                    else
                    {
                        if( !flag || val.Price == props.price )
                        {
                            qt += val.Quantity;
                        } // endif
                    } // endif
                } // endif
            } // endfor
        } // endif

        props.ismirror && !props.isempty && (bpr = Common.toFixed(1 - bpr, 2));
        // if(+moment().format('x') < (props.data.exdata.StartDate).split('+')[0].slice(6)) // РАБОТАЕТ ПОКА БЭНД ПЕРЕДАЕТ ДАТУ С ЛОКАЛЬЮ!!! "/Date(1498660200000+0300)/"
        // {
        //
        // }

        let outStruc = {
            "ID": `${props.data.exdata.Exchange}_${props.data.exdata.Name}_${props.data.exdata.Currency}`, // "NYG-WAS-12252016_NYG-WAS_USD",
            "EventTitle": props.ismirror ? props.data.exdata.AwayName : props.data.exdata.HomeName,
            "Positions": props.data.exdata.Positions,
            "isMirror": props.ismirror ? 1 : 0,
            "Bid": props.data.exdata.Bid,
            "Ask": props.data.exdata.Ask,
            "Orders": [
                {
                    "Price": bpr === '0.' ? bpr : (+bpr).toFixed(2),
                    "Side": props.type == 1 ? 0 : 1, // sell/buy
                    "Symbol": {
                        "Exchange": props.data.exdata.Exchange,
                        "Name": props.data.exdata.Name,
                        "Currency": props.data.exdata.Currency
                    },
                    "Volume": qt,
                    "Limit": true, //isBasicMode ? true : !!props.isempty, // empty ? true : false
                    "NewOrder": true,
                    "isMirror": props.ismirror ? 1 : 0
                },
            ]
        };
        __LDEV__&&console.debug( 'outStruc', props, outStruc );

        // actionOnOrderCreate(outStruc);

        return (dispatch) =>
        {
            // console.log(outStruc);
            // console.log('context:', context);
            let order : any = outStruc.Orders[0];
            let index = order.Price === '0.' ? 'empty' : Math.round(99 - order.Price * 100);

            // if(ABpp.config.tradeOn){
            //     context.props.traderActions.actionAddDefaultOrder(null, {
            //         direction: order.Side ? 'sell' : 'buy',
            //         price: order.Price,
            //         quantity: order.Volume,
            //         limit: order.Limit,
            //         outputOrder: true
            //     }, order.Limit ? index : 'market');
            // }
            // else
                context.props.defaultOrderActions.actionOnOrderCreate(outStruc, context);
                // context.props.actions.actionShowOrder(true);
            // 0||console.debug( 'getState()', getState() );
            // getState().App.controllers.TradeSlip.createNewOrder(outStruc);
            // dispatch({
            //     type: MP_ON_POS_PRICE_CLICK,
            //     payload: {}
            // });

            dispatch({
                type: MP_ON_CHANGE_ORDER_PRICE,
                payload: order.Price
            });
        }
    }



    public exchangeSideClick(inProps)
    {
        return (dispatch, getState) =>
        {
            // set init
            // 0||console.log( 'inProps', inProps );
            // === Htmlbook === 17-02-09 ===============================================
            // let symbol = getState().activeTrader.data.Symbol;
            // let symbol = getState().activeTrader.data.Symbol;
            // symbol = `${symbol.Exchange}_${symbol.Name}_${symbol.Currency}`;
            const aexch = getState().mainPage.activeExchange;

            // 0||console.log( 'click', inProps );

            if( aexch.name !== inProps.name || aexch.isMirror !== inProps.isMirror )
            {
                // console.log('inProps:', inProps);
                ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: inProps.name, HomeName: inProps.title[0],
                    AwayName: inProps.title[1], isMirror: inProps.isMirror, symbol: inProps.symbol, startDate: inProps.startDate, endDate: inProps.endDate});
                ABpp.Websocket.sendSubscribe({exchange: inProps.name, symbol: inProps.name}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);

                if($('#ChkLimit').prop('checked')) globalData.tradeOn = true;
                // orderClass.tabReturn();
                // console.log(inProps.symbol);
                $('#active_trader').addClass('loading');
                // === Htmlbook === 17-02-09 ===============================================

                // call common part
                let ret = this.exchangeSide(inProps);
                dispatch({
                    type: ret.type,
                    payload: ret.data,
                });
            }
        };
    }



    private exchangeSide(inProps)
    {
        // return (dispatch, getState) =>
        // {
        // };
            // console.debug( 'exchangeSideClick', getState());

/*            if( $('.left_order .tab input.limit').prop('checked') )
            {
                // todo: needs move to sidebar
                // set current tab
                // $('.active_trader .event_title .event_name').removeClass('active').eq(inProps.isMirror ? 1 : 0).addClass('active');

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
                // activeTrader.attr('id', 'trader_' + inProps.symbol);
                // activeTrader.find('table.limit tbody').removeClass('scroll_dis');

                // activeTraderClass.spreaderClean(true);
                // activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), false);
            }*/ // endif

            // 0||console.log( 'inProps, val.Symbol.Exchange', inProps, inProps.name, inProps.isMirror );

            // dispatch({
            //     type: MP_ON_POS_PRICE_CLICK,
            //     payload: [inProps.name, inProps.isMirror]
            // });
            return {
                type: MP_ON_POS_PRICE_CLICK,
                data: [inProps.name, inProps.isMirror]
            };
    }



    public lastExchangeActivate(inController)
    {
        return (dispatch, getState) =>
        {
            let state = getState().mainPage;

            if (state.activeExchange.name == '')
            {
                let data = state.marketsData["0"];

                if( data && data.Symbol )
                {
                    let ret = this.exchangeSide({name: data.Symbol.Exchange,
                        isMirror: false,
                        title: [data.Symbol.HomeName, data.Symbol.AwayName],
                        symbol: `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`,
                    });

                    dispatch({
                        type: ret.type,
                        payload: ret.data,
                    });
                }
            }
        };
    }



    public OnOffBasicMode(inMode)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: MP_ON_BASIC_MODE_CH,
                payload: inMode
            });
        };
    }



    public actionOnTraiderOnChanged(inMode, context)
    {
        return (dispatch, getState) =>
        {
            inMode && context.lastExchangeActivate();

            dispatch({
                type: MP_TRAIDER_MODE_CH,
                payload: inMode
            });
        };
    }


    /**
     * set active symbol on main page
     * @param inProps
     * @param context
     */
    public actionOnActiveSymbolChanged(inProps, context)
    {
        return (dispatch, getState) =>
        {
            let state = getState().mainPage;


            for( var val of state.marketsData )
            {
                // if( inProps.id == `${val.Symbol.Exchange}_${val.Symbol.Name}_${val.Symbol.Currency}` ) break;
                if( inProps.id == val.Symbol.Exchange ) break;
            } // endfor

            var {type, data} = this.exchangeSide({name: val.Symbol.Exchange,
                isMirror: inProps.isMirror,
                title: [val.Symbol.HomeName, val.Symbol.AwayName],
                symbol: `${val.Symbol.Exchange}_${val.Symbol.Name}_${val.Symbol.Currency}`,
            });


            dispatch({
                type: type,
                payload: data,
            });
        };
    }

    /**
     * set active symbol on main page
     * @param inProps
     * @param context
     */
    public actionSetChartsSymbol(inProps)
    {
        return (dispatch) =>
        {
            ABpp.Websocket.sendSubscribe({exchange: inProps.exchange}, SocketSubscribe.MP_CHARTS_SYMBOL);
            globalData.MainCharOn = !!inProps.exchange;

            dispatch({
                type: MP_ON_CHANGE_SUBSCRIBING,
                payload: inProps.exchange,
            });
        };
    }
    public actionShowOrder(visible)
    {
        return (dispatch) =>
        {
            dispatch({
                type: MP_ON_CHANGE_ORDER_VISABLT,
                payload: visible
            })
        }
    }
}

export default (new Actions()).export();

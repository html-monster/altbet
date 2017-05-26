import {
    MP_ON_POS_PRICE_CLICK,
    MP_ON_SOCKET_MESSAGE,
    MP_CHART_ON_SOCKET_MESSAGE,
    MP_ON_BASIC_MODE_CH,
    MP_TRAIDER_MODE_CH,
    MP_ON_CHANGE_SUBSCRIBING
} from '../constants/ActionTypesPageMain';
import { WebsocketModel } from '../models/Websocket';
import { Common } from '../common/Common';
import BaseActions from './BaseActions';
import { SocketSubscribe } from "../models/SocketSubscribe";


var __LDEV__ = !true;

declare let orderClass;

class Actions extends BaseActions
{
    public actionOnLoad()
    {
        return (dispatch, getState) =>
        {
            let flag = true;
            let data = getState().mainPage.marketsData["0"];

            // prevent empty data error
            if( !data ) { data = {Symbol: {}}; flag = false; }


            let symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
            ABpp.Websocket.sendSubscribe({exchange: data.Symbol.Exchange}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);
            flag && ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: data.Symbol.Exchange, symbol: symbol, isMirror: false,
                HomeName: data.Symbol.HomeName, AwayName: data.Symbol.AwayName});
            flag && setTimeout(() => ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: data.Symbol.Exchange, symbol: symbol, isMirror: false,
                HomeName: data.Symbol.HomeName, AwayName: data.Symbol.AwayName}), 700);

            ABpp.Websocket.subscribe((inData) =>
            {
                let state = getState().mainPage.marketsData;

                let compare = inData.some((item, index)=>{
                    delete item.TimeRemains;// костыль убирает TimeRemains (надо этот момент подправить)
                    delete state[index].TimeRemains;
                    return JSON.stringify(item) !== JSON.stringify(state[index])
                });

                if( compare )
                {
                    dispatch({
                        type: MP_ON_SOCKET_MESSAGE,
                        payload: inData
                    });
                    __DEV__ && console.log('re-render');
                } // endif

            }, WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES);

            ABpp.Websocket.subscribe((inData) =>
            {
                const fromSocket = JSON.stringify(inData); // copy inData and create pure not changed data
                // console.log('inData:', inData);
                // console.log('serverChartsData:', JSON.stringify(getState().mainPage.serverChartsData));
                // console.log(JSON.stringify(fromSocket) !== JSON.stringify(getState().mainPage.serverChartsData));
                if(fromSocket !== JSON.stringify(getState().mainPage.serverChartsData))
                {
                    let newObj = {};

                    inData.forEach((item) =>
                    {
                        item.Ticks.map((subItem) =>
                        {
                            subItem.Time = +subItem.Time.replace(/[^0-9]+/gi, ''); // правка серверного timestamp-а
                            return subItem;
                        });
                        newObj[item.Symbol.Exchange] = item; // переделка массива в объект с ключами Exchange
                    });

                    dispatch({
                        type: MP_CHART_ON_SOCKET_MESSAGE,
                        payload: { serverChartsData: JSON.parse(fromSocket), newObj }
                    });

                    __DEV__ && console.log('chart rendered');
                }

            }, WebsocketModel.CALLBACK_MAINPAGE_CHART);
// let ap = '[{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"MUN","AwayHandicap":-0.5,"AwayName":"Manchester United","AwayPoints":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"ARS-MUN-5132017","FullName":"Arsenal_vs_Manchester United","HomeAlias":"ARS","HomeHandicap":0.5,"HomeName":"Arsenal","HomePoints":null,"LastAsk":0.59,"LastBid":0.54,"LastPrice":0,"LastSide":null,"Name":"ARS-MUN","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526202060000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"arsenal-vs-manchester-united-5132017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"CHI","AwayHandicap":12.5,"AwayName":"Team Quintana, CHI","AwayPoints":66.1,"CategoryId":"27ce6e77-c184-4c6e-91e4-010c2b494e02","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"CSD-QCHI-5122017","FullName":"Team Cahill, SD_vs_Team Quintana, CHI","HomeAlias":"SD","HomeHandicap":-12.5,"HomeName":"Team Cahill, SD","HomePoints":78.6,"LastAsk":0.61,"LastBid":0.55,"LastPrice":0,"LastSide":null,"Name":"CSD-QCHI","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526127000000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-cahill-sd-vs-team-quintana-chi-5122017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"WAS","AwayHandicap":5.3,"AwayName":"Team Hotby, WAS","AwayPoints":70.3,"CategoryId":"c65aa34d-26da-4d63-80df-8a9be456e5fb","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"LPIT-HWAS-5102017","FullName":"Team Fleury, PIT_vs_Team Hotby, WAS","HomeAlias":"PIT","HomeHandicap":-5.3,"HomeName":"Team Fleury, PIT","HomePoints":75.6,"LastAsk":0.6,"LastBid":0.57,"LastPrice":0.59,"LastSide":1,"Name":"LPIT-HWAS","PriceChangeDirection":1,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1525984200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-fleury-pit-vs-team-holby-was-5102017"},"Ticks":[{"Close":0.59,"EndDate":"/Date(-6847812000000+0200)/","High":0.59,"Low":0.59,"Open":0.59,"Side":true,"Time":"/Date(1495118566000)/","Volume":5},{"Close":0.58,"EndDate":"/Date(-6847812000000+0200)/","High":0.58,"Low":0.58,"Open":0.58,"Side":true,"Time":"/Date(1495118569000)/","Volume":5},{"Close":0.59,"EndDate":"/Date(1495449341000)/","High":0.59,"Low":0.59,"Open":0.59,"Side":true,"Time":"/Date(1495449341000)/","Volume":5}]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"HOU","AwayHandicap":-17.1,"AwayName":"Team Harden, HOU","AwayPoints":236.5,"CategoryId":"433f9ebe-2309-47ff-bc28-0fb8bc9684f3","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"LSA-HHOU-5122017","FullName":"Team Leonard, SA_vs_Team Harden, HOU","HomeAlias":"SA","HomeHandicap":17.1,"HomeName":"Team Leonard, SA","HomePoints":219.4,"LastAsk":1,"LastBid":0.59,"LastPrice":0.46,"LastSide":1,"Name":"LSA-HHOU","PriceChangeDirection":1,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526162400000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-leonard-sa-vs-team-harden-hou-5122017"},"Ticks":[{"Close":0.46,"EndDate":"/Date(-6847812000000+0200)/","High":0.46,"Low":0.46,"Open":0.46,"Side":true,"Time":"/Date(1494582749000)/","Volume":25},{"Close":0.46,"EndDate":"/Date(1494599961000)/","High":0.46,"Low":0.46,"Open":0.46,"Side":true,"Time":"/Date(1494599961000)/","Volume":25}]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"WAS","AwayHandicap":-1.5,"AwayName":"Washignton Capitals","AwayPoints":null,"CategoryId":"c65aa34d-26da-4d63-80df-8a9be456e5fb","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"PIT-WAS-5102017","FullName":"Pittsburgh Penguins_vs_Washignton Capitals","HomeAlias":"PIT","HomeHandicap":1.5,"HomeName":"Pittsburgh Penguins","HomePoints":null,"LastAsk":0.54,"LastBid":0.46,"LastPrice":0.5,"LastSide":1,"Name":"PIT-WAS","PriceChangeDirection":1,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1525984200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"pittsburgh-penguins-vs-washignton-capitals-5102017"},"Ticks":[{"Close":0.5,"EndDate":"/Date(1495467463000)/","High":0.5,"Low":0.5,"Open":0.5,"Side":true,"Time":"/Date(1495467463000)/","Volume":15}]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"HOU","AwayHandicap":-6.5,"AwayName":"Houston Rockets","AwayPoints":null,"CategoryId":"433f9ebe-2309-47ff-bc28-0fb8bc9684f3","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"SA-HOU-5122017","FullName":"San Antonio Spurs_vs_Houston Rockets","HomeAlias":"SA","HomeHandicap":6.5,"HomeName":"San Antonio Spurs","HomePoints":null,"LastAsk":0.58,"LastBid":0.5,"LastPrice":0,"LastSide":null,"Name":"SA-HOU","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526162400000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"san-antonio-spurs-vs-houston-rockets-5122017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"MUN","AwayHandicap":-5.5,"AwayName":"Team Ibrahimovic, MUN","AwayPoints":60.7,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"SARS-IMUN-5132017","FullName":"Team Sanchez, ARS_vs_Team Ibrahimovic, MUN","HomeAlias":"ARS","HomeHandicap":5.5,"HomeName":"Team Sanchez, ARS","HomePoints":55.2,"LastAsk":0.59,"LastBid":0.55,"LastPrice":0,"LastSide":null,"Name":"SARS-IMUN","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526202000000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-sanchez-ars-vs-team-ibrahimovic-mun-5132017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"CHI","AwayHandicap":-2.5,"AwayName":"Chicago White Sox (Quintana)","AwayPoints":null,"CategoryId":"27ce6e77-c184-4c6e-91e4-010c2b494e02","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"SD-CHI-5122017","FullName":"San Diego Padres (Cahill)_vs_Chicago White Sox (Quintana)","HomeAlias":"SD","HomeHandicap":2.5,"HomeName":"San Diego Padres (Cahill)","HomePoints":null,"LastAsk":0.53,"LastBid":0.43,"LastPrice":0,"LastSide":null,"Name":"SD-CHI","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526127000000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"san-diego-padres-cahill-vs-chicago-white-sox-quintana-5122017"},"Ticks":[]}]';
// let ap = '[{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"MUN","AwayHandicap":-0.5,"AwayName":"Manchester United","AwayPoints":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"ARS-MUN-5132017","FullName":"Arsenal_vs_Manchester United","HomeAlias":"ARS","HomeHandicap":0.5,"HomeName":"Arsenal","HomePoints":null,"LastAsk":0.59,"LastBid":0.54,"LastPrice":0,"LastSide":null,"Name":"ARS-MUN","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526202060000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"arsenal-vs-manchester-united-5132017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"CHI","AwayHandicap":12.5,"AwayName":"Team Quintana, CHI","AwayPoints":66.1,"CategoryId":"27ce6e77-c184-4c6e-91e4-010c2b494e02","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"CSD-QCHI-5122017","FullName":"Team Cahill, SD_vs_Team Quintana, CHI","HomeAlias":"SD","HomeHandicap":-12.5,"HomeName":"Team Cahill, SD","HomePoints":78.6,"LastAsk":0.61,"LastBid":0.55,"LastPrice":0,"LastSide":null,"Name":"CSD-QCHI","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526127000000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-cahill-sd-vs-team-quintana-chi-5122017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"WAS","AwayHandicap":5.3,"AwayName":"Team Hotby, WAS","AwayPoints":70.3,"CategoryId":"c65aa34d-26da-4d63-80df-8a9be456e5fb","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"LPIT-HWAS-5102017","FullName":"Team Fleury, PIT_vs_Team Hotby, WAS","HomeAlias":"PIT","HomeHandicap":-5.3,"HomeName":"Team Fleury, PIT","HomePoints":75.6,"LastAsk":0.6,"LastBid":0.57,"LastPrice":0.59,"LastSide":1,"Name":"LPIT-HWAS","PriceChangeDirection":1,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1525984200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-fleury-pit-vs-team-holby-was-5102017"},"Ticks":[{"Close":0.59,"EndDate":"/Date(-6847812000000+0200)/","High":0.59,"Low":0.59,"Open":0.59,"Side":true,"Time":1495118566000,"Volume":5},{"Close":0.58,"EndDate":"/Date(-6847812000000+0200)/","High":0.58,"Low":0.58,"Open":0.58,"Side":true,"Time":1495118569000,"Volume":5},{"Close":0.59,"EndDate":"/Date(1495449341000)/","High":0.59,"Low":0.59,"Open":0.59,"Side":true,"Time":1495449341000,"Volume":5}]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"HOU","AwayHandicap":-17.1,"AwayName":"Team Harden, HOU","AwayPoints":236.5,"CategoryId":"433f9ebe-2309-47ff-bc28-0fb8bc9684f3","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"LSA-HHOU-5122017","FullName":"Team Leonard, SA_vs_Team Harden, HOU","HomeAlias":"SA","HomeHandicap":17.1,"HomeName":"Team Leonard, SA","HomePoints":219.4,"LastAsk":1,"LastBid":0.59,"LastPrice":0.46,"LastSide":1,"Name":"LSA-HHOU","PriceChangeDirection":1,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526162400000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-leonard-sa-vs-team-harden-hou-5122017"},"Ticks":[{"Close":0.46,"EndDate":"/Date(-6847812000000+0200)/","High":0.46,"Low":0.46,"Open":0.46,"Side":true,"Time":1494582749000,"Volume":25},{"Close":0.46,"EndDate":"/Date(1494599961000)/","High":0.46,"Low":0.46,"Open":0.46,"Side":true,"Time":1494599961000,"Volume":25}]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"WAS","AwayHandicap":-1.5,"AwayName":"Washignton Capitals","AwayPoints":null,"CategoryId":"c65aa34d-26da-4d63-80df-8a9be456e5fb","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"PIT-WAS-5102017","FullName":"Pittsburgh Penguins_vs_Washignton Capitals","HomeAlias":"PIT","HomeHandicap":1.5,"HomeName":"Pittsburgh Penguins","HomePoints":null,"LastAsk":0.54,"LastBid":0.46,"LastPrice":0.5,"LastSide":1,"Name":"PIT-WAS","PriceChangeDirection":1,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1525984200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"pittsburgh-penguins-vs-washignton-capitals-5102017"},"Ticks":[{"Close":0.5,"EndDate":"/Date(1495467463000)/","High":0.5,"Low":0.5,"Open":0.5,"Side":true,"Time":1495467463000,"Volume":15}]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"HOU","AwayHandicap":-6.5,"AwayName":"Houston Rockets","AwayPoints":null,"CategoryId":"433f9ebe-2309-47ff-bc28-0fb8bc9684f3","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"SA-HOU-5122017","FullName":"San Antonio Spurs_vs_Houston Rockets","HomeAlias":"SA","HomeHandicap":6.5,"HomeName":"San Antonio Spurs","HomePoints":null,"LastAsk":0.58,"LastBid":0.5,"LastPrice":0,"LastSide":null,"Name":"SA-HOU","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526162400000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"san-antonio-spurs-vs-houston-rockets-5122017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"MUN","AwayHandicap":-5.5,"AwayName":"Team Ibrahimovic, MUN","AwayPoints":60.7,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"SARS-IMUN-5132017","FullName":"Team Sanchez, ARS_vs_Team Ibrahimovic, MUN","HomeAlias":"ARS","HomeHandicap":5.5,"HomeName":"Team Sanchez, ARS","HomePoints":55.2,"LastAsk":0.59,"LastBid":0.55,"LastPrice":0,"LastSide":null,"Name":"SARS-IMUN","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526202000000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-sanchez-ars-vs-team-ibrahimovic-mun-5132017"},"Ticks":[]},{"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"CHI","AwayHandicap":-2.5,"AwayName":"Chicago White Sox (Quintana)","AwayPoints":null,"CategoryId":"27ce6e77-c184-4c6e-91e4-010c2b494e02","Currency":"USD","EndDate":null,"EndDateStr":null,"Exchange":"SD-CHI-5122017","FullName":"San Diego Padres (Cahill)_vs_Chicago White Sox (Quintana)","HomeAlias":"SD","HomeHandicap":2.5,"HomeName":"San Diego Padres (Cahill)","HomePoints":null,"LastAsk":0.53,"LastBid":0.43,"LastPrice":0,"LastSide":null,"Name":"SD-CHI","PriceChangeDirection":0,"ResultExchange":null,"SettlementDate":null,"SortingData":[],"StartDate":"/Date(1526127000000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"san-diego-padres-cahill-vs-chicago-white-sox-quintana-5122017"},"Ticks":[]}]';

            dispatch({
                type: MP_ON_POS_PRICE_CLICK,
                payload: [data.Symbol.Exchange, false]
            });
        }
    }



    /**
     * Create bet form in side bar
     * @param context - контекст MainPage (для проброски defaultOrderActions)
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

        return () =>
        {
            // console.log(outStruc);
            // console.log('context:', context);
            let order : any = outStruc.Orders[0];
            let index = order.Price === '0.' ? 'empty' : Math.round(99 - order.Price * 100);

            if(ABpp.config.tradeOn){
                context.props.traderActions.actionAddDefaultOrder(null, {
                    direction: order.Side ? 'sell' : 'buy',
                    price: order.Price,
                    quantity: order.Volume,
                    limit: order.Limit,
                    outputOrder: true
                }, order.Limit ? index : 'market');
            }
            else
                context.props.defaultOrderActions.actionOnOrderCreate(outStruc);
            // 0||console.debug( 'getState()', getState() );
            // getState().App.controllers.TradeSlip.createNewOrder(outStruc);
            // dispatch({
            //     type: MP_ON_POS_PRICE_CLICK,
            //     payload: {}
            // });
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
                ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: inProps.name, HomeName: inProps.title[0],
                    AwayName: inProps.title[1], isMirror: inProps.isMirror, symbol: inProps.symbol});
                ABpp.Websocket.sendSubscribe({exchange: inProps.name}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);

                if($('#ChkLimit').prop('checked')) globalData.tradeOn = true;
                orderClass.tabReturn();
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
}

export default (new Actions()).export();

import {
    ON_POS_PRICE_CLICK,
    ON_SOCKET_MESSAGE,
    ON_BASIC_MODE_CH,
    TRAIDER_MODE_CH,
} from '../constants/ActionTypesPageMain';
import { WebsocketModel } from '../models/Websocket';
import { Common } from '../common/Common';
import BaseActions from './BaseActions';


// var __LDEV__ = true;
var __LDEV__ = false;


class Actions extends BaseActions
{
    public actionOnLoad()
    {
        return (dispatch, getState) =>
        {
            ABpp.Websocket.subscribe((inData) =>
            {
                let state = getState().mainPage.marketsData;

                if( JSON.stringify(inData) != JSON.stringify(state) )
                {
    // __DEV__&&console.debug( 'inData', inData, state );
                    dispatch({
                        type: ON_SOCKET_MESSAGE,
                        payload: inData
                    });
    //             }
    //             else
    //             {
    // __DEV__&&console.debug('samedata');
                } // endif

            }, WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES);
        }
    }



    /**
     * Create bet form in side bar
     * @param props
     * @return {(dispatch:any, getState:any)=>undefined}
     */
    public actionOnPosPriceClick(props)
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

        // actionOnOrderCreate(outStruc);


        return (dispatch, getState) =>
        {
            // 0||console.debug( 'getState()', getState() );
            getState().App.controllers.TradeSlip.createNewOrder(outStruc);
            // dispatch({
            //     type: ON_POS_PRICE_CLICK,
            //     payload: {}
            // });
        }
    }



    public exchangeSideClick(inProps)
    {
        return (dispatch, getState) =>
        {
            // console.debug( 'exchangeSideClick', getState());

            if( $('.left_order .tab input.limit').prop('checked') )
            {
                // remove after move react
                // $('.content_bet').removeClass('active');
                // $('.event-content').removeClass('active');

                // todo: needs move to sidebar
                // set current tab
                $('.active_trader .event_title .event_name').removeClass('active').eq(inProps.isMirror ? 1 : 0).addClass('active');

                // todo: needs move to sidebar
                // set new tabs titles
                var tabs = $('.active_trader .event_title .event_name');
                var ii = 0;
                tabs.each(function () {
                    $(this).text(inProps.title[ii++]);
                });


                // todo: needs move to activeTrader
                // берет данные при смене события(название события, symbol и т.п.)
                var activeTrader = $('.active_trader');
                activeTrader.attr('id', 'trader_' + inProps.symbol);
                activeTrader.find('table.limit tbody').removeClass('scroll_dis');

                activeTraderClass.spreaderClean(true);
                activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), false);
            } // endif


            dispatch({
                type: ON_POS_PRICE_CLICK,
                payload: [inProps.name, inProps.isMirror]
            });
        };
    }



    public lastExchangeActivate(inController)
    {
        return (dispatch, getState) =>
        {
            let data = getState().mainPage.marketsData["0"];

            inController.exchangeSideClick({name: data.Symbol.Exchange,
                isMirror: false,
                title: [data.Symbol.HomeName, data.Symbol.AwayName],
                symbol: `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`,
            });
        };
    }



    public OnOffBasicMode(inMode)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_BASIC_MODE_CH,
                payload: inMode
            });
        };
    }



    public OnOffTraider(inMode)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: TRAIDER_MODE_CH,
                payload: inMode
            });
        };
    }
}

export default (new Actions()).export();

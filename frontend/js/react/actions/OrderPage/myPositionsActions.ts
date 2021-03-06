/**
 * Created by Vlasakh on 01.02.2017.
 */


/**
 * Created by Vlasakh on 25.01.2017.
 */
declare let orderClass;

// import {
//     ON_BUY_CLICK,
// } from '../../constants/ActionTypesMyPos.js';
import BaseActions from '../BaseActions';


var __LDEV__ = true;
// var __LDEV__ = false;


class Actions extends BaseActions
{
    public actionOnBuySellClick(props, defaultOrderActions)
    {
        let flag = false;
        let qt : any = 0,
            bpr : any = props.type == 1 ? 0 : 99;
        let isBasicMode = ABpp.config.basicMode;

        bpr = "0.";
        qt = '';


        let outStruc = {
            "ID": `${props.exdata.Exchange}_${props.exdata.Name}_${props.exdata.Currency}`, // "NYG-WAS-12252016_NYG-WAS_USD",
            "EventTitle": props.exdata.isMirror ? props.exdata.AwayName : props.exdata.HomeName,
            "Positions": props.exdata.Positions,
            "isMirror": props.exdata.isMirror ? 1 : 0,
            "Bid": props.exdata.Bid,
            "Ask": props.exdata.Ask,
            "Orders": [
                {
                    "Price": bpr,
                    "Side": props.type == 1 ? 1 : 0, // sell/buy
                    "Symbol": {
                        "Exchange": props.exdata.Exchange,
                        "Name": props.exdata.Name,
                        "Currency": props.exdata.Currency
                    },
                    "Volume": qt,
                    "Limit": true,
                    "NewOrder": true,
                    "isMirror": props.exdata.isMirror ? 1 : 0
                },
            ]
        };
        __LDEV__&&console.debug( 'outStruc', props, outStruc );

        // actionOnOrderCreate(outStruc);


        return (dispatch, getState) =>
        {
            // 0||console.debug( 'getState()', getState() );
            // getState().App.controllers.TradeSlip.createNewOrder(outStruc);
            defaultOrderActions.actionOnOrderCreate(outStruc);
            orderClass.tabReturn();

            // dispatch({
            //     type: ON_POS_PRICE_CLICK,
            //     payload: {}
            // });
        }
    }



    public actionOnCloseOutClick(props)
    {
        // {event: ee, that: self, resolve, reject}
        return (dispatch, getState) =>
        {
            defaultMethods.sendAjaxRequest({
                httpMethod: 'POST',
                dataType: "text",
                callback: () => 0||console.log( 'props.resolve()', props.resolve() ),
                onError: props.reject.bind(1),
                url: ABpp.baseUrl + '/order/closeout',
                // url: 'http://localhost/AltBet.Admin/Category/TestAction',
                data: { Symbol: props.symbol }});



            // dispatch({
            //     type: ON_POS_PRICE_CLICK,
            //     payload: {}
            // });
        }
    }
}

export default (new Actions()).export();

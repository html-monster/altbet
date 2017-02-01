/**
 * Created by Vlasakh on 01.02.2017.
 */


/**
 * Created by Vlasakh on 25.01.2017.
 */


// import {
//     ON_BUY_CLICK,
// } from '../../constants/ActionTypesMyPos.js';
import BaseActions from '../BaseActions';


var __LDEV__ = true;
// var __LDEV__ = false;


class Actions extends BaseActions
{
    public actionOnBuyClick(props)
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
}

export default (new Actions()).export();

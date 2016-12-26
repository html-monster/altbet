import {
    ON_POS_PRICE_CLICK,
    ON_SOCKET_MESSAGE,
} from '../constants/ActionTypesPageMain';
import { WebsocketModel } from '../models/Websocket';
import { Common } from '../common/Common';


var __LDEV__ = true;
export function actionOnPosPriceClick(props)
{
    let flag = false;
    let qt = 0, bpr = props.type == 1 ? 0 : 99;
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

    props.ismirror && (bpr = Common.toFixed(1 - bpr, 2));

    let outStruc = {
        "ID": props.data.exdata.Exchange, // "NYG-WAS-12252016_NYG-WAS_USD",
        "EventTitle": props.ismirror ? props.data.exdata.AwayName : props.data.exdata.HomeName,
        "Positions": 0, // ?
        "isMirror": props.ismirror ? 1 : 0,
        "Orders": [
            {
                "Category": "Society", // ?
                "Price": bpr,
                "Side": 0,
                "Symbol": {
                    "Exchange": props.data.exdata.Exchange,
                    "Name": props.data.exdata.Name,
                    "Currency": props.data.exdata.Currency
                },
                "Volume": qt,
                "Limit": false, // ?
                "NewOrder": true, // ?
                "isMirror": props.ismirror ? 1 : 0
            },
        ]
    };
    __LDEV__&&console.debug( 'outStruc', props, outStruc );


    return (dispatch, getState) =>
    {
        0||console.debug( 'getState()', getState() );
        // dispatch({
        //     type: ON_POS_PRICE_CLICK,
        //     payload: {}
        // });
    }
}


export function actionOnLoad()
{
    return (dispatch, getState) =>
    {
        ABpp.Websocket.subscribe((inData) =>
        {
            let state = getState().mainPage.marketsData;

            if( JSON.stringify(inData) != JSON.stringify(state) )
            {
__DEV__&&console.debug( 'inData', inData, state );
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

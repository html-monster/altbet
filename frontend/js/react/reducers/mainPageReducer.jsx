import {
    MP_ON_POS_PRICE_CLICK,
    MP_ON_SOCKET_MESSAGE,
    MP_ON_BASIC_MODE_CH,
	MP_TRAIDER_MODE_CH,
    MP_ON_CHANGE_SUBSCRIBING,
} from '../constants/ActionTypesPageMain';


const initialState = {
    marketsData: appData.pageHomeData ? appData.pageHomeData.Data : null,
    isBasicMode: globalData.basicMode,
    isTraiderOn: globalData.autoTradeOn,
    chartSubscribing: false,
    activeExchange: {name: '', // exchange unique name
        isMirror: false},
};


export default function mainPage(state = initialState, action)
{
    switch (action.type)
    {
        case MP_ON_SOCKET_MESSAGE:
            // 0||console.debug( 'state', state );
            // 0||console.debug( 'newVar', newVar );
            //     let newVar = {...state, marketsData: action.payload};
            return {...state, marketsData: action.payload};

        case MP_ON_POS_PRICE_CLICK:
            return {...state, activeExchange: {name: action.payload[0], isMirror: action.payload[1]}};

        case MP_ON_BASIC_MODE_CH:
            return {...state, isBasicMode: action.payload};

        case MP_TRAIDER_MODE_CH:
            return {...state, isTraiderOn: action.payload};

		case MP_ON_CHANGE_SUBSCRIBING:
			return {...state, chartSubscribing: action.payload};

        default:
            return state
    }

}
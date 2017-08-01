import {
    MP_ON_POS_PRICE_CLICK,
    MP_ON_SOCKET_MESSAGE,
	MP_CHART_ON_SOCKET_MESSAGE,
    MP_ON_BASIC_MODE_CH,
	MP_TRAIDER_MODE_CH,
    MP_ON_CHANGE_SUBSCRIBING,
	MP_ON_CHANGE_ORDER_VISABLT,
	MP_ON_CHANGE_ORDER_PRICE,
} from '../constants/ActionTypesPageMain';


const initialState = {
    marketsData: appData.pageHomeData ? appData.pageHomeData.Data : null,
    Breadcrumbs: appData.pageHomeData ? appData.pageHomeData.Breadcrumbs : [],
    isBasicMode: globalData.basicMode,
    isTraiderOn: globalData.autoTradeOn,
	serverChartsData: null, // need for comparison
	charts: null,
    chartSubscribing: false,
	lineupsData: null,
	orderDetails: {
		showOrder: false,
		orderPrice: 0,
	},
    activeExchange: {
    	name: '', // exchange unique name
        isMirror: false,
	},
};


export default function mainPage(state = initialState, action)
{
    switch (action.type)
    {
        case MP_ON_SOCKET_MESSAGE:
            // 0||console.debug( 'state', state );
            // 0||console.debug( 'newVar', newVar );
            //     let newVar = {...state, marketsData: action.payload};
			if(action.payload.dataName === 'lineupsData')
            	return {...state, lineupsData: action.payload.lineupsData};
            else
            	return {...state, marketsData: action.payload.SymbolsAndOrders};

        case MP_CHART_ON_SOCKET_MESSAGE:
            return {...state, charts: action.payload.newObj, serverChartsData: action.payload.serverChartsData};

        case MP_ON_POS_PRICE_CLICK:
            return {...state, activeExchange: {name: action.payload[0], isMirror: action.payload[1]}};

        case MP_ON_BASIC_MODE_CH:
            return {...state, isBasicMode: action.payload};

        case MP_TRAIDER_MODE_CH:
            return {...state, isTraiderOn: action.payload};

		case MP_ON_CHANGE_SUBSCRIBING:
			return {...state, chartSubscribing: action.payload};

		case MP_ON_CHANGE_ORDER_VISABLT:
			return {...state, orderDetails: { ...state.orderDetails, showOrder: action.payload }};

		case MP_ON_CHANGE_ORDER_PRICE:
			return {...state, orderDetails: { ...state.orderDetails, orderPrice: action.payload } };

        default:
            return state
    }

}
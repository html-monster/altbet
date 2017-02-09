import {
	ALLOW_AT_CH,
	ON_TRADER_ON,
	ON_AUTO_TRADE,
	ON_TAB_SWITCH,
	ON_ACTIVE_SYMBOL_CHANGED,
} from '../constants/ActionTypesSidebar.js';


const initialState = {
    tab: 'tradeSlip',
	traderOn: globalData.tradeOn,
	autoTradeOn: globalData.autoTradeOn,
    isAllowAT: true,
    activeExchange: {name: "", symbol: '', isMirror: false},
};


export default function sidebar(state = initialState, action)
{
    switch (action.type)
    {
		case ALLOW_AT_CH:
			return {...state, isAllowAT: action.payload};

        case ON_TRADER_ON:
            return {...state, traderOn: action.payload};

		case ON_AUTO_TRADE:
            return {...state, autoTradeOn: action.payload};

        case ON_ACTIVE_SYMBOL_CHANGED:
            if (!action.payload.id) action.payload.id = state.activeExchange.name;
            if (!action.payload.symbol) action.payload.symbol = state.activeExchange.symbol;
            return {...state, activeExchange: {name: action.payload.id, isMirror: action.payload.isMirror, symbol: action.payload.symbol}};

        default:
            return state;
    }

}
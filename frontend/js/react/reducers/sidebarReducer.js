import {
	ON_SIDEBAR_LOAD,
	ALLOW_AT_CH,
	ON_TRADER_ON,
	ON_AUTO_TRADE,
	ON_TAB_SWITCH,
	ON_ACTIVE_SYMBOL_CHANGED,
	ON_SIDEBAR_ODD_SYS_CHANGE,
} from '../constants/ActionTypesSidebar.js';
// import OddsConverter from '../models/oddsConverter/oddsConverter';

const initialState = {
    tab: 'tradeSlip',
	traderOn: globalData.tradeOn,
	autoTradeOn: globalData.autoTradeOn,
	currentOddSystem: null,
    isAllowAT: true,
    activeExchange: {name: "", symbol: '', isMirror: false},
};


export default function sidebar(state = initialState, action)
{
    switch (action.type)
    {
		case ON_SIDEBAR_LOAD:
			return {...state, currentOddSystem: action.payload};

		case ALLOW_AT_CH:
			return {...state, isAllowAT: action.payload};

        case ON_TRADER_ON:
            return {...state, traderOn: action.payload};

		case ON_AUTO_TRADE:
            return {...state, autoTradeOn: action.payload};

		case ON_SIDEBAR_ODD_SYS_CHANGE:
            return {...state, currentOddSystem: action.payload};

        case ON_ACTIVE_SYMBOL_CHANGED:
            if (!action.payload.id) action.payload.id = state.activeExchange.name;
            if (!action.payload.symbol) action.payload.symbol = state.activeExchange.symbol;
            if (!action.payload.HomeName) action.payload.HomeName = state.activeExchange.homeName;
            if (!action.payload.AwayName) action.payload.AwayName = state.activeExchange.awayName;
            // console.log('action.payload:', action.payload);
            return {...state, activeExchange: {
            	name: action.payload.id,
				isMirror: action.payload.isMirror,
				symbol: action.payload.symbol,
				homeName: action.payload.HomeName,
				awayName: action.payload.AwayName
            }};

        default:
            return state;
    }

}
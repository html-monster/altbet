import {
	ALLOW_AT_CH,
	ON_TRADER_ON,
	ON_TAB_SWITCH,
	ON_ACTIVE_SYMBOL_CHANGED,
} from '../constants/ActionTypesSidebar.js';


const initialState = {
    tab: 'tradeSlip',
    traderOn: globalData.autoTradeOn,
    isAllowAT: true,
    activeExchange: {name: "", isMirror: false},
};


export default function sidebar(state = initialState, action)
{
    switch (action.type)
    {
		case ALLOW_AT_CH:
			return {...state, isAllowAT: action.payload};

        case ON_TRADER_ON:
            return {...state, traderOn: action.payload};

        case ON_ACTIVE_SYMBOL_CHANGED:
            // return {...state, name: action.payload, error: ''};
            if (!action.payload.id) action.payload.id = state.activeExchange.name;
            return {...state, activeExchange: {name: action.payload.id, isMirror: action.payload.isMirror}};

        // todo: проверить на надобность
		case ON_TAB_SWITCH:
			return {...state, name: action.payload, error: ''};


        default:
            return state;
    }

}
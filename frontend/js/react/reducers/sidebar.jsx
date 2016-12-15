import {
	ON_TRADER_ON,
	ON_TAB_SWITCH,
} from '../constants/ActionTypesSidebar.js';


const initialState = {
    tab: 'tradeSlip',
    traderOn: true
};


export default function sidebar(state = initialState, action)
{
    switch (action.type)
    {
        case ON_TRADER_ON:
            return {...state, name: action.payload, error: ''};

		case ON_TAB_SWITCH:
			return {...state, name: action.payload, error: ''};

        default:
            return state
    }

}
/**
 * Created by Htmlbook on 28.02.2017.
 */
import {
	HEADER_ON_SOCKET_MESSAGE,
	HEADER_CHANGE_ODD_SYSTEM,
	ON_BASIC_MODE_SWITCH,
} from '../constants/ActionTypesHeader.js';


const initialState = {
	currentOddSystem: localStorage.getItem('currentOddSystem') ? localStorage.getItem('currentOddSystem') : 'Implied',
	serverData: {
		CurrentBalance: 0,
		GainLost: 0,
		Invested: 0,
		Profitlost: 0,
		...(appData ? appData.headerData : {}),
	},
	isBasicMode: globalData.basicMode,
};


export default function header(state = initialState, action)
{
	switch (action.type)
	{
		case HEADER_ON_SOCKET_MESSAGE:
			return {...state, serverData: action.payload};

		case HEADER_CHANGE_ODD_SYSTEM:
			return {...state, currentOddSystem: action.payload};

		case ON_BASIC_MODE_SWITCH:
			return {...state, isBasicMode: action.payload};

		default:
			__DEV__&&console.log( 'state.serverData', state.serverData );
			return state;
	}
}
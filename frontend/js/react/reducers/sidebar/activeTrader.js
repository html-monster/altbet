/**
 * Created by Htmlbook on 27.01.2017.
 */

import {
	TRADER_ON_SOCKET_MESSAGE,
	TRADER_ON_QUANTITY_CHANGE,
	TRADER_ON_SPREAD_CHANGE,
	TRADER_ON_ADD_ORDER,
	TRADER_ON_DELETE_ORDER
} from '../../constants/ActionTypesActiveTrader';
import RebuildServerData from '../../actions/Sidebar/activeTrader/rebuildServerData';

const initialState = {
	data: {},
	isMirror: 0,
	rebuiltServerData:[],
	spread: '',
	quantity: '',
	orderInfo: {
		price: null,
		activeString: null,
		showDefaultOrder: false,
		direction: null,
		limit: true
	}
};
let price = 0.99;
for(let ii = 1; ii <= 99; ii++)
{
	initialState.rebuiltServerData.push(new RebuildServerData({price}));
	price = Math.round10(price - 0.01, -2);
}

export default function activeTrader(state = initialState, action)
{
	switch (action.type)
	{
		case TRADER_ON_QUANTITY_CHANGE:
			return {...state, quantity: action.payload};

		case TRADER_ON_SPREAD_CHANGE:
			return {...state, spread: action.payload};

		case TRADER_ON_SOCKET_MESSAGE:
			return {...state, data: action.payload.data, isMirror: action.payload.isMirror, rebuiltServerData: action.payload.rebuiltServerData };

		case TRADER_ON_ADD_ORDER:
			return {...state, orderInfo: {...action.payload}};

		case TRADER_ON_DELETE_ORDER:
			return {...state, orderInfo: {...action.payload}};

		default:
			return state
	}

}
/**
 * Created by Htmlbook on 27.01.2017.
 */

import {
	TRADER_ON_SOCKET_MESSAGE,
	TRADER_ON_EXCHANGE_CHANGE,
	TRADER_ON_QUANTITY_CHANGE,
	TRADER_ON_SPREAD_CHANGE,
	TRADER_ON_ADD_ORDER,
	TRADER_ON_DELETE_ORDER,
	TRADER_ON_SPREAD_HIGHLIGHT,
	TRADER_ON_DRAG
} from '../../../constants/ActionTypesActiveTrader';
import {RebuildServerData} from '../../../actions/Sidebar/tradeSlip/activeTrader/rebuildServerData';

const initialState = {
	data: {},
	dragData:{
		// dragPrevPrice: null,
		// dragNextPrice: null,
		dragSide: null,
		popUpShow: false
	},
	isMirror: 0,
	rebuiltServerData:[],
	spread: '',
	spreadHighLight: [],
	quantity: '',
	orderInfo: {
		activeString: null,
		direction: null,
		limit: true,
		price: null,
		showSpreadOrder: false,
		showDefaultOrder: false,
		showDirectionConfirm: false
	},
};
let price = 0.99;
for(let ii = 1; ii <= 99; ii++)
{
	initialState.rebuiltServerData.push(new RebuildServerData({price, data: initialState.data}));
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
			return {...state, data: action.payload.data, rebuiltServerData: action.payload.rebuiltServerData };

		case TRADER_ON_EXCHANGE_CHANGE:
			return {...state, ...action.payload};

		case TRADER_ON_ADD_ORDER:
			return {...state, orderInfo: {...state.orderInfo, ...action.payload} };

		case TRADER_ON_DELETE_ORDER:
			return {...state, orderInfo: {...state.orderInfo, ...action.payload}};

		case TRADER_ON_SPREAD_HIGHLIGHT:
			return {...state, spreadHighLight: action.payload};

		case TRADER_ON_DRAG:
			return {...state, dragData: {...state.dragData, ...action.payload}};

		default:
			return state
	}

}


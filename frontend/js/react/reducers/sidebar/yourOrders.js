/**
 * Created by Htmlbook on 22.12.2016.
 */
import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
	ON_YOUR_ORDER_GROUP_SYMBOL,
	ON_YOUR_CHANGE_ACTIVE_EVENT,
} from '../../constants/ActionTypesYourOrders.js';


	// mode: ABpp.config.basicMode,

const initialState = {
	yourOrdersData: appData.yourOrders,
	openGroupSymbol: appData.yourOrders && appData.yourOrders.length ? appData.yourOrders[0].Orders[0].Symbol.Exchange : null,
	activeExchange: null
};

export default function yourOrders(state = initialState, action)
{
	switch (action.type)
	{
		case ON_YOUR_ORDER_DELETE:
			return {...state, yourOrdersData: action.payload};

		case ON_YOUR_ORDER_SOCKET_MESSAGE:
			return {...state, yourOrdersData: action.payload};

		case ON_YOUR_ORDER_GROUP_SYMBOL:
			return {...state, openGroupSymbol: action.payload};

		case ON_YOUR_CHANGE_ACTIVE_EVENT:
			return {...state, activeExchange: action.payload};

		default:
			return state
	}

}

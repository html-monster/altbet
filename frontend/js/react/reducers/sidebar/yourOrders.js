/**
 * Created by Htmlbook on 22.12.2016.
 */
import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
	ON_YOUR_ORDER_GROUP_INDEX,
} from '../../constants/ActionTypesYourOrders.js';


	// mode: ABpp.config.basicMode,
const initialState = {
	yourOrdersData: appData.yourOrders,
	openGroupIndex: 0
};


export default function yourOrders(state = initialState, action)
{
	switch (action.type)
	{
		case ON_YOUR_ORDER_DELETE:
			return {...state, yourOrdersData: action.payload};

		case ON_YOUR_ORDER_SOCKET_MESSAGE:
			return {...state, yourOrdersData: action.payload};

		case ON_YOUR_ORDER_GROUP_INDEX:
			return {...state, openGroupIndex: action.payload};

		default:
			return state
	}

}

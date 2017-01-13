/**
 * Created by Htmlbook on 22.12.2016.
 */
import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
} from '../../constants/ActionTypesYourOrders.js';


	// mode: ABpp.config.basicMode,
const initialState = {
	yourOrders: appData.yourOrders
};


export default function yourOrders(state = initialState, action)
{
	switch (action.type)
	{
		case ON_YOUR_ORDER_DELETE:
			return {...state, yourOrders: action.payload};

		case ON_YOUR_ORDER_SOCKET_MESSAGE:
			return {...state, yourOrders: action.payload};

		default:
			return state
	}

}

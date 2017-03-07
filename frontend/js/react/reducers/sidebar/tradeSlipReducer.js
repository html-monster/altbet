/**
 * Created by Htmlbook on 03.03.2017.
 */
import {
// 	ON_YOUR_ORDER_DELETE,
} from '../../constants/ActionTypesTradeSlip';


// mode: ABpp.config.basicMode,
const initialState = {

};


export default function yourOrders(state = initialState, action)
{
	switch (action.type)
	{
		// case ON_YOUR_ORDER_DELETE:
		// 	return {...state, yourOrders: action.payload};

		default:
			return state
	}

}

/**
 * Created by Htmlbook on 27.01.2017.
 */

import {
	ON_DEFAULT_ORDER_DELETE,
} from '../../constants/ActionTypesActiveTrader';

const initialState = {
	data: {}
};

export default function activeTrader(state = initialState, action)
{
	switch (action.type)
	{
		case ON_DEFAULT_ORDER_DELETE:
			return {...state, orderNewData: action.payload};

		default:
			return state
	}

}
/**
 * Created by Htmlbook on 21.12.2016.
 */
import {
	ON_KEY_UP
} from "../constants/ActionTypesOrderForm.js";

//not use!!!!!!!!
const initialState = {
	orderData: {}
};


export default function sidebar(state = initialState, action)
{
	switch (action.type)
	{
		case ON_TRADER_ON:
			return {...state, data: action.payload, error: ''};

		default:
			return state
	}

}
/**
 * Created by Htmlbook on 13.07.2017.
 */
import {
	DISQUS_SET_EVENT_DATA,
} from '../constants/ActionTypesDisqus';


const initialState = {
	url: null,
	identifier: null
};


export default function  disqus(state = initialState, action)
{
	switch (action.type)
	{
		case DISQUS_SET_EVENT_DATA:
			return {...state, ...action.payload};

		default:
			return state
	}
}


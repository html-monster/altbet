/**
 * Created by Htmlbook on 01.08.2017.
 */

import {
	ODDSCONVERTER_CHANGE,
} from '../constants/ActionTypesOdds';

const initialState = {
	currentOddSystem: localStorage.getItem('currentOddSystem') ? localStorage.getItem('currentOddSystem') : 'Implied'
};


export default function oddsReducer(state = initialState, action)
{
	switch (action.type)
	{
		case ODDSCONVERTER_CHANGE:
			return {...state, currentOddSystem: action.payload};

		default:
			return state
	}

}
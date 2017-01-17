/**
 * Created by Htmlbook on 14.01.2017.
 */
import {
	VALIDATION_ON_INPUT_CHANGE,
	VALIDATION_ON_INITIAL_VALUES,
	VALIDATION_ON_INPUT_VALIDATION,
	// VALIDATION_ON_CHECK_INPUT
} from "../constants/ActionTypesFormValidation";

const initialState = {
	// values: {},
	// validation: {},
};

export default function formValidation(state = initialState, action)
{
	switch (action.type)
	{
		case VALIDATION_ON_INPUT_CHANGE:
			console.log({...state, [action.payload[0]]: {values: action.payload[1]}});
			return {...state, [action.payload[0]]: {values: action.payload[1]}};

		case VALIDATION_ON_INITIAL_VALUES:
			return {...state, [action.payload[0]]: {values: action.payload[1]}};

		case VALIDATION_ON_INPUT_VALIDATION:
			return {...state, [action.payload[0]]: {validation: action.payload[1]}};

		// case VALIDATION_ON_CHECK_INPUT:
		// 	return {...state, invalid: action.payload};

		default:
			return state
	}
}

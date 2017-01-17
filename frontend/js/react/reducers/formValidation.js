/**
 * Created by Htmlbook on 14.01.2017.
 */
import {
	VALIDATION_ON_INPUT_CHANGE,
	VALIDATION_ON_INITIAL_VALUES,
	VALIDATION_ON_FORM_SUBMIT,
	// VALIDATION_ON_CHECK_INPUT
} from "../constants/ActionTypesFormValidation";

const initialState = {
	values: {},
	invalid: false,
};

export default function formValidation(state = initialState, action)
{
	switch (action.type)
	{
		case VALIDATION_ON_INPUT_CHANGE:
			return {...state, values: action.payload};

		case VALIDATION_ON_INITIAL_VALUES:
			return {...state, values: action.payload};

		case VALIDATION_ON_FORM_SUBMIT:
			return {...state, invalid: action.payload};

		// case VALIDATION_ON_CHECK_INPUT:
		// 	return {...state, invalid: action.payload};

		default:
			return state
	}
}

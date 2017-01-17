/**
 * Created by Htmlbook on 14.01.2017.
 */
import {
	// VALIDATION_ON_FOCUS,
	// VALIDATION_ON_BLUR,
	INPUT_VALIDATION_ON_FORM_SUBMIT
} from "../../constants/ActionTypesInputValidation";

const initialState = {
	submit: false
};

export default function inputValidation(state = initialState, action)
{
	switch (action.type)
	{
		// case VALIDATION_ON_FOCUS:
		// 	return {...state, dirty: action.payload};
		//
		// case VALIDATION_ON_BLUR:
		// 	return {...state, touched: action.payload};
		//
		case INPUT_VALIDATION_ON_FORM_SUBMIT:
			return {...state, submit: action.payload};



		default:
			return state
	}

}
/**
 * Created by Htmlbook on 16.01.2017.
 */
import {
	VALIDATION_ON_INPUT_CHANGE,
	VALIDATION_ON_INITIAL_VALUES,
	VALIDATION_ON_FORM_SUBMIT,
	VALIDATION_ON_CHECK_INPUT
} from "../constants/ActionTypesFormValidation";

export function actionOnInputChange(value)
{
	return (dispatch) =>
	{
		dispatch({
			type: VALIDATION_ON_INPUT_CHANGE,
			payload: value
		});
	};
}

// export function actionOnInitialValues(value)
// {
// 	return (dispatch) =>
// 	{
// 		dispatch({
// 			type: VALIDATION_ON_INITIAL_VALUES,
// 			payload: value
// 		});
// 	};
// }

export function actionOnFormSubmit(value)
{
	return (dispatch) =>
	{
		dispatch({
			type: VALIDATION_ON_FORM_SUBMIT,
			payload: value
		});
	};
}

// export function actionCheckInput(value)
// {
// 	return (dispatch) =>
// 	{
// 		dispatch({
// 			type: VALIDATION_ON_CHECK_INPUT,
// 			payload: value
// 		});
// 	};
// }

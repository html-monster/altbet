/**
 * Created by Htmlbook on 16.01.2017.
 */
import {
	VALIDATION_ON_INPUT_CHANGE,
	VALIDATION_ON_INITIAL_VALUES,
	VALIDATION_ON_INPUT_VALIDATION,
	VALIDATION_ON_FORM_SUBMIT,
	VALIDATION_ON_FORM_INITIAL
	// VALIDATION_ON_CHECK_INPUT
} from "../constants/ActionTypesFormValidation";

export function actionOnInputChange(formId, value)
{
	return (dispatch) =>
	{
		dispatch({
			type: VALIDATION_ON_INPUT_CHANGE,
			payload: [formId, value]
		});
	};
}

export function actionOnInitialValues(formId, value)
{
	return (dispatch) =>
	{
		dispatch({
			type: VALIDATION_ON_INITIAL_VALUES,
			payload: [formId, value]
		});
	};
}

	export function actionOnFormInitial(formId, value)
{
	return (dispatch) =>
	{
		dispatch({
			type: VALIDATION_ON_FORM_INITIAL,
			payload: formId
		});
	};
}

export function actionOnInputValidation(formId, value)
{
	return (dispatch) =>
	{
		dispatch({
			type: VALIDATION_ON_INPUT_VALIDATION,
			payload: [formId, value]
		});
	};
}

export function actionOnFormSubmit(formId, value)
{
	return (dispatch) =>
	{
		dispatch({
			type: VALIDATION_ON_FORM_SUBMIT,
			payload: [formId, value]
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

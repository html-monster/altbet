/**
 * Created by Htmlbook on 16.01.2017.
 */
import {
	// VALIDATION_ON_FOCUS,
	// VALIDATION_ON_BLUR,
	INPUT_VALIDATION_ON_FORM_SUBMIT
} from "../../constants/ActionTypesInputValidation";


export function actionOnFormSubmit()
{
	return (dispatch) =>
	{
		let submit = true;

		dispatch({
			type: INPUT_VALIDATION_ON_FORM_SUBMIT,
			payload: submit
		});

		setTimeout(() => {
			submit = false;

			dispatch({
				type: INPUT_VALIDATION_ON_FORM_SUBMIT,
				payload: submit
			});
		}, 200);
	};
}

// export function onFocus()
// {
// 	return (dispatch) =>
// 	{
// 		const dirty = true;
//
// 		dispatch({
// 			type: VALIDATION_ON_FOCUS,
// 			payload: dirty
// 		});
// 	};
// }
//
// export function onBlur()
// {
// 	return (dispatch) =>
// 	{
// 		const touched = true;
//
// 		dispatch({
// 			type: VALIDATION_ON_BLUR,
// 			payload: touched
// 		});
// 	};
// }
/**
 * Created by Htmlbook on 28.12.2016.
 */

import {
	DEPOSIT_QUANTITY_CHANGE,
	DEPOSIT_PRICE_PLAN_CHANGE,
	DEPOSIT_PERIOD_CHANGE,
	DEPOSIT_QUANTITY_VALIDATE,
	DEPOSIT_SOCKET_MESSAGE
} from "../../constants/ActionTypesDeposit.js";

export function actionOnSocketMessage()
{
	return (dispatch, getState) =>
	{
		window.ee.addListener('accountData.update', (newData) =>
		{
			if(getState().deposit.data.UserAssets.CurrentBalance != newData.Available){
				dispatch({
					type: DEPOSIT_SOCKET_MESSAGE,
					payload: newData.Available
				});
				console.log('re-render');
			}
		});
	}
}

export function actionOnPeriodChange(context, payYearly)
{
	return (dispatch, getState) =>
	{
		let state = getState().deposit;

		context.props.actions.actionOnPricePlanChange(state.plan, state.pricePlanInfo.monthly, state.pricePlanInfo.yearly, payYearly);

		dispatch({
			type: DEPOSIT_PERIOD_CHANGE,
			payload: payYearly
		});
	}
}

export function actionOnPricePlanChange(plan, monthQuantity, yearQuantity, payYearly)
{
    return (dispatch, getState) =>
	{
		let state = getState().deposit;
		payYearly = typeof payYearly == "boolean" ? payYearly : state.payYearly;
		let quantity = payYearly ? yearQuantity : monthQuantity;

		$('html, body').animate({scrollTop: $('.quantity_control').offset().top - $('header').outerHeight(true)}, 800);

        dispatch({
            type: DEPOSIT_PRICE_PLAN_CHANGE,
            payload: {
            	plan: plan,
				quantity: quantity,
				pricePlanInfo: {
					monthly: monthQuantity,
					yearly: yearQuantity,
				}
			}
        });
    }
}

export function actionOnInputQuantityChange(actions, event)
{
	return (dispatch) =>
	{
		actions.actionOnQuantityValidate(event.target.value);
		dispatch({
			type: DEPOSIT_QUANTITY_CHANGE,
			payload: event.target.value
		});
	}
}

export function actionOnButtonQuantityClick(actions, event)
{
	return (dispatch, getState) =>
	{
		let summary = +getState().deposit.depositQuantity + +event.target.textContent;
		actions.actionOnQuantityValidate(summary);
		dispatch({
			type: DEPOSIT_QUANTITY_CHANGE,
			payload: summary
		});
	}
}

export function actionOnQuantityValidate(values)
{
	return (dispatch) =>
	{
		dispatch({
			type: DEPOSIT_QUANTITY_VALIDATE,
			payload: values ? null : 'invalidJs'
		});
	}
}

export function actionOnAjaxSend(context, values, serverValidation, event)
{
	return (dispatch) =>
	{
		let submit = $(event.target).find('[type=submit]');
		// console.log(event.target);
		// console.log(values, serverValidation);
		// if(values.sum){
		// 	new Promise(resolve => {
		// 		setTimeout(() => {  // simulate server latency
		// 			window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
		// 			resolve()
		// 		}, 500)
		// 	});
		// }

		// const obj = {
		// 	clientId: 'Wrong client ID',
		// 	secureId: 'Wrong secure ID',
		// 	error: 'Server error',
		// 	message: 'all fine'
		// };
		// setTimeout(() => {
		// 	serverValidation(obj);
		// }, 2000);
		// let data = context.props.data;
		// console.log(parentData, context.props.data);
		function OnBeginAjax()
		{
			submit.attr('disabled', true);
		}

		function onSuccessAjax(data)
		{
			console.log(data);
			// serverValidation(obj);
			// context.props.actions.actionOnDeleteOrder(parentData, context.props.data);
			// console.log(`Order sending finished: ${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`);
		}

		function onErrorAjax()
		{
			let data = {};
			data.error = 'The payment failed. Please check your internet connection or reload the page or try again later.';
			submit.removeAttr('disabled');
			serverValidation(data);
			// defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
		}

		if(values.sum){
			defaultMethods.sendAjaxRequest({
				httpMethod: 'POST',
				url: $(event.target).attr('action'),
				data: values,
				callback: onSuccessAjax,
				onError: onErrorAjax,
				beforeSend: OnBeginAjax,
			});
		}


		dispatch({
			type: DEPOSIT_QUANTITY_VALIDATE,
			payload: values.sum ? null : 'invalidJs'
		});
	}
}


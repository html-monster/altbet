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

export function actionOnAjaxSend(values, serverValidation)
{
	return (dispatch) =>
	{
		// console.log(values, serverValidation);
		if(values.sum){
			new Promise(resolve => {
				setTimeout(() => {  // simulate server latency
					window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
					resolve()
				}, 500)
			});
		}

		const obj = {
			clientId: 'Wrong client ID',
			secureId: 'Wrong secure ID',
			error: 'Server error',
			// message: 'all fine'
		};
		setTimeout(() => {
			serverValidation(obj);
		}, 2000);
		// let data = context.props.data;
		// console.log(parentData, context.props.data);
		function OnBeginAjax()
		{
			// $(context.refs.orderForm).find('[type=submit]').attr('disabled', true);
		}

		function onSuccessAjax()
		{
			// context.props.actions.actionOnDeleteOrder(parentData, context.props.data);
			// console.log(`Order sending finished: ${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`);
		}

		function onErrorAjax()
		{
			// $(context.refs.orderForm).find('[type=submit]').removeAttr('disabled');
			// defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
		}

		// defaultMethods.sendAjaxRequest({
		// 	httpMethod: 'POST',
		// 	url: context.props.formData.url,
		// 	callback: onSuccessAjax,
		// 	onError: onErrorAjax,
		// 	beforeSend: OnBeginAjax,
		// 	context: $(context.refs.orderForm)
		// });

		dispatch({
			type: DEPOSIT_QUANTITY_VALIDATE,
			payload: values.sum ? null : 'invalidJs'
		});
	}
}


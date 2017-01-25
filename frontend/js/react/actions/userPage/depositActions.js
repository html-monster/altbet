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
		let error = null;
		if(!values) error = 'Required';
		// if(values && values < 5) error = 'Required';
		dispatch({
			type: DEPOSIT_QUANTITY_VALIDATE,
			payload: error
		});
	}
}

export function actionOnAjaxSend(context, values, serverValidation, event)
{
	return (dispatch) =>
	{
		let submit = $(event.target).find('[type=submit]');
		let error = null;
		if(!values.sum)
			error = 'Required';

		if(values.sum && values.sum < 5)
			error = 'Minimum deposit is $5';

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
			const {Answer: { code }} = data;
			// serverValidation(obj);
			switch (code) {
				case '200':{
					const { transaction: { amount = null, fees = null } } = data;
					popUpClass.nativePopUpOpen('.wrapper_user_page .payment_message');
					$(context.refs.paymentMessage).find('.amount').text('$' + ((amount - fees[0].feeAmount) / 100));
					serverValidation({message: 'The payment is successful'});
					break;}
				case '555':{
					serverValidation({error: 'The payment failed. Please reload the page or try again later'});
					break;}
				case 'Account disabled':{
					serverValidation({error: 'The account you provided is disabled'});
					break;}
				case '20001':{
					serverValidation({error: 'The account is closed'});
					break;}
				case '20007' || '20008':{
					serverValidation({error: 'The Neteller ID or e-mail is invalid or the Secure ID or Authentication Code is invalid', clientId: ' ', secureId: ' '});
					break;}
				case '20011':{
					serverValidation({error: 'You are residing in a NETELLER blocked country/state/region'});
					break;}
				case '20015':{
					serverValidation({error: 'You are not entitled to receive this type of transaction'});
					break;}
				case '20020':{
					serverValidation({error: 'Insufficient balance to complete the transaction'});
					break;}
				case '20021':{
					serverValidation({error: 'The specified amount is below defined minimum transfer limits'});
					break;}
				case '20022':{
					serverValidation({error: 'The specified amount is above defined maximum transfer out limits'});
					break;}
				case '20031':{
					serverValidation({error: 'The specified amount is too high. You must specify an amount within your transactional limit'});
					break;}
				case '20035':{
					serverValidation({error: 'The transaction exceeds allowed account limits'});
					break;}
				case '20301':{
					serverValidation({error: 'NETELLER has declined to process the transaction'});
					break;}
				default:{
					serverValidation({error: 'The payment failed. Try again later'});
				}
			}//20008, 20011, 20015, 20020, 20021, 20022, 20031, 20035, 20301
				// // case 20003:
				// // 	serverValidation({error: 'Your NETELLER Merchant Account does not support this currency.'});
				// // 	break;?????????????????????????????????????????????????????
			submit.removeAttr('disabled');
		}

		function onErrorAjax()
		{
			let data = {};
			data.error = 'The payment failed. Please check your internet connection or reload the page or try again later';
			submit.removeAttr('disabled');
			serverValidation(data);
			// defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
		}

		if(values.sum && values.sum >= 5){
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
			payload: error
		});
	}
}


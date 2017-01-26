/**
 * Created by Htmlbook on 28.12.2016.
 */

import {
	WITHDRAW_QUANTITY_CHANGE,
	WITHDRAW_QUANTITY_VALIDATE,
	WITHDRAW_SOCKET_MESSAGE
} from "../../constants/ActionTypesWithdraw";

export function actionOnSocketMessage()
{
	return (dispatch, getState) =>
	{
		window.ee.addListener('accountData.update', (newData) =>
		{
			if(getState().withdraw.data.UserAssets.CurrentBalance != newData.Available){
				dispatch({
					type: WITHDRAW_SOCKET_MESSAGE,
					payload: newData.Available
				});
				console.log('re-render');
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
			type: WITHDRAW_QUANTITY_CHANGE,
			payload: event.target.value
		});
	}
}

export function actionOnButtonQuantityClick(actions, event)
{
	return (dispatch, getState) =>
	{
		let summary = +getState().withdraw.depositQuantity + +event.target.textContent;
		actions.actionOnQuantityValidate(summary);
		dispatch({
			type: WITHDRAW_QUANTITY_CHANGE,
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
			type: WITHDRAW_QUANTITY_VALIDATE,
			payload: error
		});
	}
}

export function actionOnAjaxSend(context, values, serverValidation, event)
{
	return (dispatch) =>
	{
		console.log(values);
		let form = $(event.target);
		let submit = $(event.target).find('[type=submit]');
		let error = null;
		if(!values.sum)
			error = 'Required';

		if(values.sum && values.sum < 5)
			error = 'Minimum withdraw is $5';

		function OnBeginAjax()
		{
			submit.attr('disabled', true);
			form.addClass('loading');
		}

		function onSuccessAjax(data)
		{
			console.log(data);
			const {Answer: { code }} = data;
			// serverValidation(obj);
			switch (code) {
				case '200':{
					const { transaction: { amount = null, fees = null } } = data;
					popUpClass.nativePopUpOpen('.wrapper_user_page .withdraw_message');

					$(context.refs.paymentMessage).find('.amount').text('$' + (amount / 100));
					serverValidation({message: 'The payment is successful'});
					break;}
				case '555':{
					serverValidation({error: 'The payment failed. Please reload the page or try again later'});
					break;}
				case '556':{
					serverValidation({error: 'You don`t have enough money in your Alt.bet account'});
					error = ' ';
					dispatch({
						type: WITHDRAW_QUANTITY_VALIDATE,
						payload: error
					});
					break;}
				case 'Account disabled':{
					serverValidation({error: 'The account you provided is disabled'});
					break;}
				case '20001':{
					serverValidation({error: 'The account is closed'});
					break;}
				case '20007':{
					serverValidation({error: `The e-mail is invalid or the Secure ID / Authentication Code is invalid`, clientId: ' ', secureId: ' '});
					break;}
				case '20008':{
					serverValidation({error: `The e-mail is invalid or the Secure ID / Authentication Code is invalid`, clientId: ' ', secureId: ' '});
					break;}
				case '20011':{
					serverValidation({error: 'You are residing in a NETELLER blocked country/state/region'});
					break;}
				case '20015':{
					serverValidation({error: 'You are not entitled to receive this type of transaction'});
					break;}
				case '20020':{
					serverValidation({error: 'Insufficient balance to complete the transaction'});
					error = ' ';
					dispatch({
						type: WITHDRAW_QUANTITY_VALIDATE,
						payload: error
					});
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
			}
			submit.removeAttr('disabled');
			form.removeClass('loading');
		}

		function onErrorAjax()
		{
			let data = {};
			data.error = 'The payment failed. Please check your internet connection or reload the page or try again later';
			submit.removeAttr('disabled');
			form.removeClass('loading');
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
			type: WITHDRAW_QUANTITY_VALIDATE,
			payload: error
		});
	}
}


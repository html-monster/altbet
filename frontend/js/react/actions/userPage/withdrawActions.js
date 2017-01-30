/**
 * Created by Htmlbook on 28.12.2016.
 */

import {
	WITHDRAW_QUANTITY_CHANGE,
	WITHDRAW_QUANTITY_VALIDATE,
	WITHDRAW_SOCKET_MESSAGE,
	WITHDRAW_APPROVE
} from "../../constants/ActionTypesWithdraw";

export function actionOnSocketMessage()
{
	return (dispatch, getState) =>
	{
		let data = getState().withdraw.data.UserAssets.CurrentBalance;

		window.ee.addListener('accountData.update', (newData) =>
		{
			if(data != newData.Available){
				data = newData.Available;
				dispatch({
					type: WITHDRAW_SOCKET_MESSAGE,
					payload: newData.Available
				});
				__DEV__ && console.log('re-render');
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
		// let summary = +getState().withdraw.depositQuantity + +event.target.textContent;
		actions.actionOnQuantityValidate(event.target.textContent);
		dispatch({
			type: WITHDRAW_QUANTITY_CHANGE,
			payload: event.target.textContent
		});
	}
}

export function actionOnQuantityValidate(values)
{
	return (dispatch) =>
	{
		let error = null;
		if(!values) error = 'Required';
		// if(values && values < 10) error = 'Required';
		dispatch({
			type: WITHDRAW_QUANTITY_VALIDATE,
			payload: error
		});
	}
}

// export function actionOnApprove()
// {
// 	return (dispatch, getState) =>
// 	{
// 		getState().withdraw.approved = true;
// 		console.log(getState().withdraw.form);
// 		$(getState().withdraw.form).submit();
// 		// dispatch({
// 		// 	type: WITHDRAW_APPROVE,
// 		// 	payload: true
// 		// });
// 	}
// }

export function actionOnAjaxSend(context, values, serverValidation, event)
{
	return (dispatch, getState) =>
	{
		const { approved } = getState().withdraw;
		__DEV__ && console.log(values);
		// getState().withdraw.form = event.target;
		const form = $(event.target);
		const submit = $(event.target).find('[type=submit]');
		const jQAjax = defaultMethods.sendAjaxRequest.bind(null ,{
			httpMethod: 'POST',
			url       : $(event.target).attr('action'),
			data      : values,
			callback  : onSuccessAjax,
			onError   : onErrorAjax,
			beforeSend: OnBeginAjax,
		});
		let error = null;

		if(!values.sum)
			error = 'Required';

		if(values.sum && values.sum < 10)
			error = 'Minimum withdraw is $10';

		function OnBeginAjax()
		{
			submit.attr('disabled', true);
			form.addClass('loading');
		}

		function onSuccessAjax(data)
		{
			__DEV__ && console.log(data);
			const {Answer: { code }} = data;
			// serverValidation(obj);
			switch (code) {
				case '200':{
					const { transaction: { amount = null, fees = null } } = data;
					popUpClass.nativePopUpOpen('.wrapper_user_page .message');

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
					serverValidation({error: `The Neteller ID or e-mail is invalid`, clientId: ' '});
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
			$(context.refs.paymentMessage).find('.hide').unbind('click');
			// getState().withdraw.approved = false;
		}

		function onErrorAjax()
		{
			let data = {};
			data.error = 'The payment failed. Please check your internet connection or reload the page or try again later';
			submit.removeAttr('disabled');
			form.removeClass('loading');
			serverValidation(data);
			$(context.refs.paymentMessage).find('.hide').unbind('click');
			// getState().withdraw.approved = false;
			// defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
		}

		if(!error && !approved) {
			popUpClass.nativePopUpOpen('.wrapper_user_page .withdraw.message');
			$(context.refs.paymentMessage).find('.submit').click(() => {
				if(!approved){
					jQAjax();
					dispatch({
						type: WITHDRAW_APPROVE,
						payload: true
					});
				}
			})
		}

		if(approved && !error) jQAjax();

		dispatch({
			type: WITHDRAW_QUANTITY_VALIDATE,
			payload: error
		});
	}
}


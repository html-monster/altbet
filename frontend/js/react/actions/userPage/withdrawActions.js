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
/**
 *
 * @param context - this компонента в которой нахоидтся функция
 * @param payment string - название платежки
 * @param values - данные собранные с формы
 * @param serverValidation - функция обратной связи для серверной валидации
 * @param event
 * @returns {function(*, *)}
 */
export function actionOnAjaxSend(context, payment, values, serverValidation, event)
{
	return (dispatch, getState) =>
	{
		const { approved } = getState().withdraw;
		__DEV__ && console.log('transactionData:', values);
		// getState().withdraw.form = event.target;
		const form = $(event.target);
		const url = $(event.target).attr('action');
		const submit = form.find('[type=submit]');
		let onSuccessAjax;

		switch (payment){
			case 'Neteller':{
				onSuccessAjax =  context.props.actions.onSuccessAjaxNeteller.bind(null, context, form, serverValidation);
				break;}
			case 'Skrill':{
				onSuccessAjax =  context.props.actions.onSuccessAjaxSkrill.bind(null, context, form, serverValidation);
				break;}
			case 'Bitpay':{
				onSuccessAjax =  context.props.actions.onSuccessAjaxBitpay.bind(null, context, form, serverValidation);
				break;}
			case 'Visa':{
				onSuccessAjax =  context.props.actions.onSuccessAjaxVisa.bind(null, context, form, serverValidation);
				break;}
		}

		const jQAjax = defaultMethods.sendAjaxRequest.bind(null ,{
			httpMethod: 'POST',
			url       : url,
			data      : values,
			callback  : onSuccessAjax,
			onError   : onErrorAjax,
			beforeSend: OnBeginAjax,
		});
		let error = null;

		if(!values.Sum) error = 'Required';

		if(values.Sum && values.Sum < 10) error = 'Minimum withdraw is $10';

		function OnBeginAjax()
		{
			submit.attr('disabled', true);
			form.addClass('loading');
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

export function onSuccessAjaxNeteller(context, form, serverValidation, data)
{
	return (dispatch) =>
	{
		__DEV__ && console.log(data);
		const {Answer: { code }} = data;
		// serverValidation(obj);
		switch (code) {
			case '200':{
				const { transaction: { amount = null } } = data;
				popUpClass.nativePopUpOpen('.wrapper_user_page .withdraw.message');

				$(context.refs.paymentMessage).find('.amount').text('$' + (amount / 100));
				serverValidation({message: 'The payment is successful'});
				break;}
			case '555':{
				serverValidation({error: 'The payment failed. Please reload the page or try again later'});
				break;}
			case '556':{
				serverValidation({error: 'You don`t have enough money in your Alt.bet account'});
				dispatch({
					type: WITHDRAW_QUANTITY_VALIDATE,
					payload: ' '
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
				dispatch({
					type: WITHDRAW_QUANTITY_VALIDATE,
					payload: ' '
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
		form.find('[type=submit]').removeAttr('disabled');
		form.removeClass('loading');
		$(context.refs.paymentMessage).find('.hide').unbind('click');
		// getState().withdraw.approved = false;
	}
}

export function onSuccessAjaxSkrill(context, form, serverValidation, data)
{
	return (dispatch) =>
	{
		__DEV__ && console.log(data);
		const { SkrillAnswer: { Code } } = data;

		switch (Code) {
			case '200':{
				const { amount = null  } = data;
				if(amount) popUpClass.nativePopUpOpen('.wrapper_user_page .withdraw.message');

				$(context.refs.paymentMessage).find('.amount').text('$' + (amount));
				serverValidation({message: 'The payment is successful'});
				break;}
			case '555':{
				serverValidation({error: 'The payment failed. Please reload the page or try again later'});
				break;}
			case '556':{
				serverValidation({error: 'You don`t have enough money in your Alt.bet account'});
				dispatch({
					type: WITHDRAW_QUANTITY_VALIDATE,
					payload: ' '
				});
				break;}
			case 'SINGLE_TRN_LIMIT_VIOLATED':{
				serverValidation({error: 'Maximum amount per payment transaction = EUR 10,000'});
				dispatch({
					type: WITHDRAW_QUANTITY_VALIDATE,
					payload: ' '
				});
				break;}
			default:{
				serverValidation({error: 'The payment failed. Try again later'});
			}
		}
		form.find('[type=submit]').removeAttr('disabled');
		form.removeClass('loading');
		$(context.refs.paymentMessage).find('.hide').unbind('click');
		// getState().withdraw.approved = false;
	}
}

export function onSuccessAjaxBitpay(context, form, serverValidation, data) {
	return (dispatch) =>
	{
		__DEV__ && console.log(data);
		const {Answer: { code }} = data;

		form.find('[type=submit]').removeAttr('disabled');
		form.removeClass('loading');
	}
}

export function onSuccessAjaxVisa(context, form, serverValidation, data) {
	return (dispatch) =>
	{
		__DEV__ && console.log(data);
		const {Answer: { code }} = data;

		form.find('[type=submit]').removeAttr('disabled');
		form.removeClass('loading');
	}
}


/**
 * Created by Htmlbook on 22.12.2016.
 */

import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
} from "../../constants/ActionTypesYourOrders.js";
import {OddsConverter} from '../../models/oddsConverter/oddsConverter.js';

// let initialState = true;
let OddsConverterObj = new OddsConverter('implied_probability');

export function actionOnSocketMessage()
{
	return (dispatch, getState) =>
	{
		window.ee.addListener('yourOrders.update', (newData) =>
		{
			// if(initialState){
			// 	newData.forEach(function () {
			//
			// 	});
			// 	initialState = false;
			// }
			// console.log(JSON.stringify(getState().yourOrders.yourOrders));
			// console.log('========');
			// console.log(JSON.stringify(newData));
			// console.log(JSON.stringify(getState().yourOrders.yourOrders) != JSON.stringify(newData));
			if(JSON.stringify(getState().yourOrders.yourOrders) != JSON.stringify(newData)){
				dispatch({
					type: ON_YOUR_ORDER_SOCKET_MESSAGE,
					payload: newData
				});
				console.log('re-render');
			}
		});
	}
}

export function actionOnYourOrderDelete(order, indexGr)
{
	return (dispatch, getState) =>
	{
		let orderId = order.ID;
		let newData = getState().yourOrders.yourOrders;

		newData[indexGr].Orders = newData[indexGr].Orders.filter((order) => order.ID !== orderId );
		if(!newData[indexGr].Orders.length) newData.splice(indexGr, 1);

		dispatch({
			type: ON_YOUR_ORDER_DELETE,
			payload: newData
		});
	}
}

export function actionOnAjaxSend(context, e)
{
	return (dispatch, getState) =>
	{
		e.preventDefault();

		function OnBeginAjax()
		{
			$(context.refs.orderForm).find('[type=submit]').attr('disabled', true);
		}

		function onSuccessAjax()
		{
			console.log('Order sending finished: ' + context.props.data.ID);
		}

		function onErrorAjax()
		{
			$(context.refs.orderForm).find('[type=submit]').removeAttr('disabled');
			defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
		}

		defaultMethods.sendAjaxRequest({
			httpMethod: 'POST',
			url: context.props.formData.url,
			callback: onSuccessAjax,
			onError: onErrorAjax,
			beforeSend: OnBeginAjax,
			context: $(context.refs.orderForm)
		});
	}
}







/**
 * Created by Htmlbook on 22.12.2016.
 */

import {
	ON_DEFAULT_ORDER_DELETE,
	ON_DEFAULT_ORDER_TYPE_CHANGE,
	ON_DEFAULT_ORDER_CREATE,
	ON_DEFAULT_ORDER_AJAX_SEND,
} from "../../constants/ActionTypesDefaultOrders.js";
import {OddsConverter} from '../../models/oddsConverter/oddsConverter.js';


let OddsConverterObj = new OddsConverter('implied_probability');

export function actionOnDeleteOrder(orderContainer, order)
{
	return (dispatch, getState) =>
	{
		console.log(orderContainer);
		console.log(order);

		let orderId;
		if(order.Side !== undefined	)
			orderId = order.Side;
		else
			orderId = orderContainer.ID;

		let newOrders = getState().tradeSlip.orderNewData.filter(function(itemContainer) {
			if(order.Side !== undefined && itemContainer.ID === orderContainer.ID){
				itemContainer.Orders = itemContainer.Orders.filter((item) => item.Side !== orderId);
				if(itemContainer.Orders.length)
					return true;
				else
					return false;
			}
			else
				return itemContainer.ID !== orderId;
		});
		// console.log(newOrders);

		dispatch({
			type: ON_DEFAULT_ORDER_DELETE,
			payload: newOrders
		});
	}
}

export function actionOnOrderTypeChange(checkboxProp, formData)
{
	return (dispatch, getState) =>
	{
		let data = formData.props.data;
		let price = $(formData.refs.inputPrice);
		let quantity = $(formData.refs.inputQuantity);
		let orderID = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;

		getState().tradeSlip.orderNewData.forEach(function (thisItem) {
			if(orderID == thisItem.ID){
				thisItem.Orders.map(function (item) {
					if(item.Side == data.Side){
						item.Limit = !checkboxProp;
					}
					return item;
				});
			}
		});
		dispatch({
			type: ON_DEFAULT_ORDER_TYPE_CHANGE,
			payload: getState().tradeSlip.orderNewData
		});
		if (!checkboxProp) {

			setTimeout(function () {
				price.focus();
				price[0].selectionStart = 4;
			}, 0);
			OddsConverterObj.calculation(formData, 'price', !checkboxProp);
		}
		else {
			setTimeout(function () {
				quantity.focus();
				quantity[0].selectionStart = quantity.val().length;
			}, 0);
			OddsConverterObj.calculation(formData, 'quantity', !checkboxProp);
		}
	}
}

export function actionOnOrderCreate(newOrder)
{
	return (dispatch, getState) =>
	{

		// let data = formData.props.data;
		// let price = $(formData.refs.inputPrice);
		// let quantity = $(formData.refs.inputQuantity);
		let state = getState().tradeSlip.orderNewData;
// console.log(state);
// console.log(newOrder);
		let removedChild;
		state.some(function (thisItem, index) {
			if(newOrder.ID == thisItem.ID){
				thisItem.Positions = newOrder.Positions;
				removedChild = state.splice(index, 1);
				thisItem.Orders.some(function (item, childIndex, arr) {
					// console.log(item.Side, newOrder.Orders[0].Side);
					// console.log(state.splice(index, 1));
					if(item.Side == newOrder.Orders[0].Side){
						if(newOrder.Orders[0])
							arr.splice(childIndex, 1, newOrder.Orders[0]);
							// item = newOrder.Orders[0];

						return true;
					}
					else if(childIndex == thisItem.Orders.length - 1){
						if(newOrder.Orders[0].Side){
							thisItem.Orders.push(newOrder.Orders[0]);
						}
						else{
							thisItem.Orders.unshift(newOrder.Orders[0]);
						}
					}
					// return item;
				});
				return true;
			}
			else if(index == state.length - 1){
				state.unshift(newOrder);
			}
		});

		if(state.length == 0){
			state.unshift(newOrder);
		}

		if(removedChild) state.unshift(removedChild[0]);
		// console.log(state);
		dispatch({
			type: ON_DEFAULT_ORDER_CREATE,
			payload: state
		});
	}
}

export function actionOnAjaxSend(context, parentData, e)
{
	return (dispatch, getState) =>
	{
		e.preventDefault();
		let data = context.props.data;
		// console.log(parentData, context.props.data);
		function OnBeginAjax()
		{
			$(context.refs.orderForm).find('[type=submit]').attr('disabled', true);
		}

		function onSuccessAjax()
		{
			context.props.actions.actionOnDeleteOrder(parentData, context.props.data);
			console.log(`Order sending finished: ${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`);
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

		// dispatch({
		// 	type: ON_DEFAULT_ORDER_AJAX_SEND,
		// 	payload: newData
		// });
	}
}





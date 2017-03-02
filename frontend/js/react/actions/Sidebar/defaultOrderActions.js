/**
 * Created by Htmlbook on 22.12.2016.
 */

import {
	ON_DEFAULT_ORDER_DELETE,
	ON_DEFAULT_ORDER_TYPE_CHANGE,
	ON_DEFAULT_ORDER_CREATE,
	// ON_DEFAULT_ORDER_AJAX_SEND,
	ON_TAB_MIRROR_CHANGE,
} from "../../constants/ActionTypesDefaultOrders.js";
// import { ON_ACTIVE_SYMBOL_CHANGED } from '../../constants/ActionTypesSidebar.js';
// import {OddsConverterObj} from '../../models/oddsConverter/oddsConverter.js';
import { orderForm } from '../../components/formValidation/validation';


// let OddsConverterObj = new OddsConverter('implied_probability');


export function actionOnLoad(that)
{
	return (dispatch, getState) =>
	{
		// 0||console.debug( 'TSlp load', getState(), that );
		// 0||console.debug( 'getState().App.instance.addController', getState().App.instance.addController );
		getState().App.instance.addController('TradeSlip', that);
		// ABpp.controllers.TradeSlip = this;
	};
}

export function actionOnDeleteOrder(orderContainer, order)
{
	return (dispatch, getState) =>
	{
		// console.log(orderContainer);
		// console.log(order);

		let orderId;
		if(order.Side !== undefined)
			orderId = order.Side;
		else
			orderId = orderContainer.ID;

		// debugger;
		let newOrders = getState().tradeSlip.orderNewData.filter(function(itemContainer) {
			if(order.Side !== undefined && itemContainer.ID === orderContainer.ID &&
				itemContainer.isMirror === orderContainer.isMirror){

				itemContainer.Orders = itemContainer.Orders.filter((item) => item.Side !== orderId);
				if(itemContainer.Orders.length)
					return true;
				else
					return false;
			}
			else
				return itemContainer.ID !== orderId || itemContainer.isMirror !== orderContainer.isMirror;
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
		let state = getState().tradeSlip.orderNewData;

		state.forEach(function (thisItem) {
			if(orderID == thisItem.ID){
				thisItem.Orders.some(function (item, index, arr) {
					if(item.Side == data.Side){
						let newObj = Object.assign({}, item);

						newObj.Limit = !checkboxProp;

						if(checkboxProp && (newObj.Price == '0.'))
							newObj.Price = '';
						else if((newObj.Price == ''))
							newObj.Price = '0.';

						arr.splice(index, 1, newObj);

						return true;
					}
					return false;
				});
			}
		});
		// console.log(state);
		dispatch({
			type: ON_DEFAULT_ORDER_TYPE_CHANGE,
			payload: state
		});
	}
}

export function actionOnOrderCreate(newOrder)
{
	return (dispatch, getState) =>
	{

		let state = getState().tradeSlip.orderNewData;
		let removedChild;
		// console.log('newOrder', newOrder);
		// console.log('state', state);
		state.some(function (thisItem, index) {
			if(newOrder.ID == thisItem.ID && newOrder.isMirror == thisItem.isMirror){
				thisItem.Positions = newOrder.Positions;
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
				removedChild = state.splice(index, 1);
				return true;
			}
			else if(index == state.length - 1){
				state.unshift(newOrder);
			}
		});

		if(state.length == 0 && !removedChild){
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
	return () =>
	{
		e.preventDefault();

		// if(!ABpp.User.userIdentity) return false;
		if(!orderForm(context.refs.orderForm)) return false;

		const data = context.props.data;
		function OnBeginAjax()
		{
			$(context.refs.orderForm).find('[type=submit]').attr('disabled', true);
		}

		function onSuccessAjax()
		{
			context.props.actions.actionOnDeleteOrder(parentData, context.props.data);
			__DEV__ && console.log(`Order sending finished: ${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`);
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



export function actionOnTabMirrorClick(isMirror)
{
	// $('.active_trader .event_title .event_name').removeClass('active');
	// $(this).addClass('active');
	// activeTraderClass.takeData($('.content_bet.active .event-content').eq(isMirror ? 1 : 0));
	// activeTraderClass.spreaderClean(true);

	// let id = $('.active_trader').attr('id').replace("trader_", "");


	// dispatch({
	// 	type: ON_ACTIVE_SYMBOL_CHANGED,
	// 	payload: {isMirror: isMirror}
	// });
	return (dispatch, getState) =>
	{
		// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: getState().sidebar.activeExchange.name, isMirror: isMirror, symbol: getState().sidebar.activeExchange.symbol});
		// dispatch({
		// 	// type: ON_TAB_MIRROR_CHANGE,
		// 	type: ON_ACTIVE_SYMBOL_CHANGED,
		// 	payload: {isMirror: isMirror}
		// });
	};
}

/**
 * Created by Htmlbook on 22.12.2016.
 */

import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
} from "../../constants/ActionTypesYourOrders.js";
import { orderForm } from '../../components/formValidation/validation';

export function actionOnSocketMessage()
{
	return (dispatch, getState) =>
	{
		window.ee.addListener('yourOrders.update', (newData) =>
		{
			// let oldData = '[{"ID":"BUB-NEP-3312017_BUB-NEP_USD_mirror","Symbol":"New England Patriots","Positions":0,"LastSide":1,"LastPrice":0.9,"Orders":[{"ID":"935aef66-9f07-4f60-b4ca-af158cd87a91","Symbol":{"Name":"BUB-NEP","Exchange":"BUB-NEP-3312017","Currency":"USD","FullName":"Buffalo Bills_vs_New England Patriots","HomeName":"Buffalo Bills","HomeAlias":"BUB","AwayName":"New England Patriots","AwayAlias":"NEP","Status":"approved","StartDate":"/Date(1490918400000)/","EndDate":null,"CategoryId":"1518ed47-ee93-4979-93de-344d526c3e36","SymbolExchange":"BUB-NEP-3312017","UrlExchange":"buffalo-bills-vs-new-england-patriots-3312017-sf","ResultExchange":null,"ApprovedDate":"/Date(1482195600000)/","SettelmentDate":null,"LastPrice":0.1,"LastSide":0,"LastAsk":0.49,"LastBid":0,"HomePoints":73.9,"HomeHandicap":-3.7,"AwayPoints":77.6,"AwayHandicap":3.7,"OrderBy":2},"Time":"/Date(1482823051138)/","Price":0.51,"Volume":5,"Side":1,"Category":"Sport","isPosition":0,"isMirror":1}]}]'
			// let newData = '[{"ID":"BUB-NEP-3312017_BUB-NEP_USD_mirror","LastPrice":0.9,"LastSide":1,"Orders":[{"Category":"Sport","ID":"935aef66-9f07-4f60-b4ca-af158cd87a91","Price":0.49,"Side":1,"Symbol":{"ApprovedDate":"/Date(1482195600000+0200)/","AwayAlias":"NEP","AwayHandicap":3.7,"AwayName":"New England Patriots","AwayPoints":77.6,"CategoryId":"1518ed47-ee93-4979-93de-344d526c3e36","Currency":"USD","EndDate":null,"Exchange":"BUB-NEP-3312017","FullName":"Buffalo Bills_vs_New England Patriots","HomeAlias":"BUB","HomeHandicap":-3.7,"HomeName":"Buffalo Bills","HomePoints":73.9,"LastAsk":0.49,"LastBid":0,"LastPrice":0.1,"LastSide":0,"Name":"BUB-NEP","ResultExchange":null,"SettelmentDate":null,"StartDate":"/Date(1490918400000+0300)/","Status":"approved","SymbolExchange":"BUB-NEP-3312017","UrlExchange":"buffalo-bills-vs-new-england-patriots-3312017-sf"},"Time":"/Date(1482823051138)/","Volume":5,"isMirror":1,"isPosition":0}],"Positions":0,"Symbol":"New England Patriots"}]'
			// console.log(JSON.stringify(getState().yourOrders.yourOrders));
			// console.log('========');
			// console.log(JSON.stringify(newData));
			// console.log(JSON.stringify(getState().yourOrders.yourOrders) != JSON.stringify(newData));
			// console.log(defaultMethods.deepCompare(newData, getState().yourOrders.yourOrders));
			// if(defaultMethods.deepCompare(newData, getState().yourOrders.yourOrders)){
			if(JSON.stringify(getState().yourOrders.yourOrders) != JSON.stringify(newData)){
				dispatch({
					type: ON_YOUR_ORDER_SOCKET_MESSAGE,
					payload: newData
				});
				__DEV__ && console.log('re-render');
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

export function actionOnAjaxSend(context, parentContext, e)
{
	return (dispatch, getState) =>
	{
		e.preventDefault();
		if(!orderForm(context.refs.orderForm)) return false;

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







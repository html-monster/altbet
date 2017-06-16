/**
 * Created by Htmlbook on 22.12.2016.
	  */

import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
} from "../../constants/ActionTypesYourOrders.js";
import BaseActions from '../BaseActions';
import { orderForm } from '../../components/formValidation/validation';

class Actions extends BaseActions
{
	public actionOnSocketMessage()
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

	public actionOrderDelete(order, indexGr)
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

	public actionOrderDeleteAjax(context, event)
	{
		return () =>
		{
			event.preventDefault();
			const form = $(context.refs.deleteForm);

			function BeforeAjax()
			{
				form.addClass('loading');
				form.find('[type=submit]').attr('disabled', 'true');
			}

			function onSuccessAjax(data)
			{
				data = data.split('_');
				let id = '#' + data[0] + '__order';

				if(data[1] === 'True'){
					console.log($(id).parents('.order_content').find('h3').text() + ' order is deleted');

					context.props.onDelete();
				}
				else{
					console.log($(id).parents('.order_content').find('h3').text() + ' order isn\'t deleted');
					form.find('[type=submit]').removeAttr('disabled');
					form.removeClass('loading');
					defaultMethods.showError('Internal server error, try again later');
				}
			}

			function onErrorAjax(x, y)
			{
				form.find('[type=submit]').removeAttr('disabled');
				form.removeClass('loading');
				__DEV__ && console.log('XMLHTTPRequest object: ', x);
				__DEV__ && console.log('textStatus: ',  y);
				defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
			}

			defaultMethods.sendAjaxRequest({
				httpMethod: 'POST',
				callback: onSuccessAjax,
				onError: onErrorAjax,
				beforeSend: BeforeAjax,
				url: ABpp.baseUrl + '/Order/Cancel',
				context: form});
		}
	}

	public actionOnAjaxSend(formUrl, event)
	{
		return () =>
		{
			event.preventDefault();

			const form = event.currentTarget;

			if(!orderForm(form)) return false;

			function OnBeginAjax()
			{
				$(form).find('[type=submit]').attr('disabled', 'true');
			}

			function onSuccessAjax()
			{
				console.log('Order sending finished: ' + $(form).find('[name=ID]').val());
			}

			function onErrorAjax()
			{
				$(form).find('[type=submit]').removeAttr('disabled');
				defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
			}

			defaultMethods.sendAjaxRequest({
				httpMethod: 'POST',
				url: formUrl,
				callback: onSuccessAjax,
				onError: onErrorAjax,
				beforeSend: OnBeginAjax,
				context: $(form)
			});
		}
	}

	public actionOpenEditForm(id)
	{
		return () =>
		{
			id = `#${id}__order`;
			const activeFirstTab = this._prepeareToMove(id, 'edit');
			const scrollPos = $(id)[0].offsetTop + 150;
			// console.log('1: ', scrollPos);

			if(this._checkOnLastElement(id)){
				$(id).find('.form-container').slideToggle(200, ()=>{
					if(activeFirstTab){
						setTimeout(() => {
							$('#current-orders').animate({scrollTop: scrollPos} , 200);
						}, 450);
					}
					else
						$('#current-orders').animate({scrollTop: scrollPos} , 200);
				});
			}
			else{
				setTimeout(() => {
					$(id).find('.form-container').slideToggle(200);
				}, 300);
			}
		}
	}

	public actionOpenDeleteForm(id)
	{
		return () =>
		{
			id = `#${id}__order`;
			this._prepeareToMove(id, 'delete');
			setTimeout(function () {
				$(id).find('.pop_up').fadeIn();
			}, 300);
		}
	}

	private _prepeareToMove(id, handle) {
		const currentOrders = $('#current-orders');
		const tab = $('.left_order .tab');
		const activeTadFirst = tab.eq(0).hasClass('active');
		const scrollPos = $(id)[0].offsetTop - 150;

		// console.log('2: ', scrollPos);
		currentOrders.find('.form-container').slideUp(200);
		currentOrders.find('.pop_up').fadeOut();

		if(activeTadFirst){
			$('#order').hide();
			tab.removeClass('active');
			tab.eq(1).addClass('active');
			currentOrders.fadeIn();
			// if(handle == 'edit' && !this._checkOnLastElement(id)){
			// 	setTimeout(()=>{
			// 		currentOrders.animate({scrollTop: scrollPos} , 200);
			// 	}, 450);
			// }
			// else if(handle == 'delete'){
			// 	setTimeout(()=>{
			// 		currentOrders.animate({scrollTop: scrollPos} , 200);
			// 	}, 450);
			// }
		}
		// else{
			// if(handle == 'edit' && !this._checkOnLastElement(id)) currentOrders.animate({scrollTop: scrollPos} , 200);
			// else currentOrders.animate({scrollTop: scrollPos} , 200);
		// }
		currentOrders.animate({scrollTop: scrollPos} , 200);

		return activeTadFirst;
	}

	private _checkOnLastElement(id)
	{
		const lastOrders = $('#current-orders').find('.order_content:last-of-type .order_container');
		const ids = [];
		for(let ii = -4; ii <= -1; ii++){
			ids.push('#' + lastOrders.eq(ii).attr('id'));
		}
		 return ids.some((item)=> item == id)
	}
}



export default (new Actions()).export();
/**
 * Created by Htmlbook on 22.12.2016.
 */
/// <reference path="../../../.d/common.d.ts" />

import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
} from "../../constants/ActionTypesYourOrders.js";
import BaseActions from '../BaseActions';
// import { orderForm } from '../../components/formValidation/validation';

class Actions extends BaseActions
{
	public actionOnSocketMessage()
	{
		return (dispatch, getState) =>
		{
			window.ee.addListener('yourOrders.update', (newData) =>
			{
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
					defaultMethods.showError('Server error, try again later');
				}
			}

			function onErrorAjax(x, y)
			{
				form.find('[type=submit]').removeAttr('disabled');
				form.removeClass('loading');
				__DEV__ && console.log('XMLHTTPRequest object: ', x);
				__DEV__ && console.log('textStatus: ',  y);
				defaultMethods.showError('The connection has been lost. Please check your internet connection or try again.');
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

			// if(!orderForm(form)) return false;

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
				defaultMethods.showError('The connection has been lost. Please check your internet connection or try again.');
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
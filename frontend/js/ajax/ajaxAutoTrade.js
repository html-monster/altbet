class ajaxAutoTradeClass{
	constructor(){
		function onSuccessAjax(data) {
			data = data.split('_');
			// console.log(data);
			var id = '#' + data[0] + '__order';

			if(data[1] == 'True'){
				console.log($(id).parents('.order_content').find('h3').text() + ' order is deleted');

				if ($(id).parents('.my_order').children().length > 2)
					$(id).remove();
				else
					$(id).parents('.order_content').remove();
			}
			else{
				console.log($(id).parents('.order_content').find('h3').text() + ' order isn\'t deleted');
				defaultMethods.showError('Internal server error, try again later');
			}
		}
		function onErrorAjax(x, y, z) {
			console.log(x + '\n' + y + '\n' + z);
			defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
		}
	}
	static sendLimitOrder(context, modification, price){
		var url = $('.template .order_content.new form').attr('data-ajax-url'),
				data = {},
				trader = $('.active_trader');

		data.Symbol = trader.attr('id').slice(7);
		data.Quantity = $('.active_trader .control .quantity.number').val();
		if($('#IsMirror').length)
			data.isMirror = $('#IsMirror').val() == 'False' ? 0 : 1;
		else
			data.isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;

		if(modification == 'market')
			data.OrderType = 'false';
		else{
			data.OrderType = 'true';
			data.LimitPrice = price;
		}

		if(modification == 'sell')
			data.Side = 'Sell';
		else
			data.Side = 'Buy';

		JSON.stringify(data);

		defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, null, data);
	}
}

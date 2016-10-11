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
	static sendLimitOrder(context){
		var url = $('.template .order_content.new form').attr('data-ajax-url');

		console.log(url);
		// defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, context, data);
	}
}

class myOrderClass{
	constructor(){
		var currentOrders = $('#current-orders'),
				url = currentOrders.find('.confirmation form').attr('action');

		currentOrders.on('submit', '.confirmation form', function () {
			// var data = $(this).parent().find('input').val() ;
			sendAjaxRequest('POST', onSuccessAjax, url, $(this));
			// $.ajax(url, {
			// 	type: 'POST',
			// 	data: data,
			// 	error: function (x, y, z) {
			// 		console.log(x + '\n' + y + '\n' + z);
			// 	}
			// });
		});

		function onSuccessAjax(data) {
			data = data.split('_');
			console.log(data);
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

		function sendAjaxRequest(httpMethod, callback, url, form) {
			var data = form.serialize();
			$.ajax({
				url: url,
				type: httpMethod,
				dataType: 'json',
				data: data,
				success: callback,
				error: onErrorAjax
			});
		}
	}
}

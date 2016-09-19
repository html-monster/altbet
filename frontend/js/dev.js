$(document).ready(function () {
	if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru'){
		var flag = 0,
				flagRevers = 0;

		$('.event-content').each(function () {
			if($(this).hasClass('revers')){
				$(this).attr('id', 'event-revers' + flagRevers++);
			}
			else{
				$(this).attr('id', 'event' + flag++);
			}
		});
		//my position=======================================================================================================
		(function myPosition() {
			for(var ii = 2; ii < 5; ii++){
				let html = $('#tab1').clone(),
						parent = $('#tab1').parents('table');

				html.removeAttr('id').attr('id', 'tab' + ii);
				parent.append(html);
			}
			for(ii = 6; ii < 9; ii++){
				let html = $('#tab5').clone(),
						parent = $('#tab5').parents('table');

				html.removeAttr('id').attr('id', 'tab' + ii);
				parent.append(html);
			}
		})();
		//my position=======================================================================================================


		$('#current-orders span.price').each(function () {
			$(this).text(defaultMethods.randomInteger(0.01, 0.99));
		});
		$('#current-orders span.volume').each(function () {
			$(this).text(defaultMethods.randomInteger(1, 999))
		});
		$('#current-orders .current-order span').each(function () {
			$(this).text(defaultMethods.randomInteger(1, 99));
		});
		$('#current-orders .last-price').each(function () {
			$(this).text(defaultMethods.randomInteger(0.01, 0.99));
		});
	}




	var price = 0.99, html;
	for(var ii = 1; ii <= 99; ii++){
		html = '<tr class="visible"><td class="my_bids my_size"><span class="value"></span></td><td class="size sell size_sell confim"><span class="container"><span class="value"></span></span></td><td class="price_value"><span class="container"><span class="value">$' + (price).toFixed(2) + '</span></span></td><td class="size buy size_buy confim"><span class="container"><span class="value"></span></span></td><td class="my_offers my_size"><span class="value"></span></td></tr>';
		$('.left_order .active_trader .limit tbody').append(html);
		price -= 0.01;
	}

	var currentOrders = $('#current-orders');
	currentOrders.on('click', '.confirmation .yes', function () {
		let parent = $(this).parents('.order_content');

		if ($(this).parents('.my_order').children().length > 2)
			$(this).parents('.order_container').remove();
		else
			parent.remove();
	});
	currentOrders.on('click', '.order_container .close', function () {
		$(this).parents('.order_content').remove();
	});

	if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru'){
		let id = 0, setId = 0, orderId = 0;

		$('.my_position_container tbody tr').each(function () {
			$(this).attr('id', 'new_event_' + setId++);
		});
		$('.open_orders tbody tr').each(function () {
			$(this).attr('id', 'event_' + id++);
		});

		for(let ii = 0; ii < 3; ii++){
			let html = $('#current-orders .order_content').eq(0).clone();
			$('#current-orders').append(html);
		}
		$('#current-orders .order_container').each(function () {
			$(this).attr('id', 'event_' + orderId++ + '_order');
		});
	}

});



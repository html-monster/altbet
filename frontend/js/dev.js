$(document).ready(function () {
	if(location.host == 'localhost:3000'){
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
	}


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

	var price = 0.99, html;
	for(var ii = 1; ii <= 99; ii++){
		html = '<tr class="visible"><td class="my_bids my_size"><span class="value"></span></td><td class="size sell size_sell confim"><span class="container"><span class="value"></span></span></td><td class="price_value"><span class="container"><span class="value">$' + (price).toFixed(2) + '</span></span></td><td class="size buy size_buy confim"><span class="container"><span class="value"></span></span></td><td class="my_offers my_size"><span class="value"></span></td></tr>';
		$('.left_order .active_trader .limit tbody').append(html);
		price -= 0.01;
	}

	$('.confirmation .yes').click(function () {
		$(this).parents('.order_content').remove();
	});

});



class eventPageClass{
	constructor(){
		let self = this;

		// $('.left_order .tab input.limit').change(function () {
		// 	if($(this).prop('checked'))
		// 		$('.executed_orders td').removeClass('clickable');
		// 	else
		// 		$('.executed_orders td').addClass('clickable');
		// });

		// self.tabularMarking = function () {
		// 	let executedOrders = $('.wrapper_event_page .executed_orders');
        //
		// 	executedOrders.on('mouseenter', 'td.volume.clickable', function () {
		// 		0||console.debug( 'here' );
		// 		$(this).parents('.executed_orders').find('tr').removeClass('active');
		// 		for(let ii = 0; ii <= $(this).parent().index(); ii++){
		// 			$(this).parents('.executed_orders').find('tr').eq(ii).addClass('active');
		// 		}
		// 	});
		// 	executedOrders.on('mouseleave', 'td.clickable', function () {
		// 		$(this).parents('.executed_orders').find('tr').removeClass('active');
		// 	});
		// }();

		self.addOrder = function () {
			// let order = $('#order .default_orders'), data;
			//
			// data = {
			// 	title: $('.wrapper_event_page .current_price h2').text(),
			// 	price: '0.',
			// 	priceMarket: '0.',
			// 	volume: ''
			// };

			/*function createOrderForm(context, orderDirection, modification, data) {
				let html = $('.order_content.new').clone();
				let title = $('.wrapper_event_page .current_price h2').text();
				let symbol = $('.wrapper_event_page').attr('id');

				html.removeClass('new');

				if(!data){
					data = {};
					data.priceMarket = '0.';
					data.volume = '';
				}

				if(modification == 'full')
					html.find('h3').text(title);
				else
					html = html.find('form').css({display: 'none'});

				if (orderDirection == 'sell') {
					// html.find('.obligations input.number').val(data.sellSum);
					html.find('.side').val('Sell');
				}
				else {
					if(modification == 'full'){
						html.find('.buy-container').html(html.find('.sell-container').html());
						html.find('.sell-container').html('');
					}
					html.find('input[type=submit]').toggleClass('sell buy').val('buy');
					html.find('.side').val('Buy');
					// html.find('.obligations input.number').val(data.buySum);
				}

				if(context.hasClass('price')) {
					html.find('.price input.number').val(data.priceMarket);
					html.find('.checkbox span').text('Limit');
				}
				else {
					html.find('.price input.number').val(data.priceMarket).attr('disabled', true);
					html.find('.obligations input.number').removeAttr('name').attr('disabled', true);
					html.find('.obligations .regulator').hide();
					html.find('.price label').text('Market price');
					html.find('.price .regulator').remove();
					html.find('.checkbox input[type=checkbox]').attr('checked', false);
					html.find('.checkbox span').text('Market');
				}
				html.find('.volume input.number').val(data.volume);
				html.find('.symbol').val(symbol);
				if($('#IsMirror').val() == 'True'){
					html.attr('id', symbol + '_mirror__order');
					html.find('.mirror').val(1);
				}
				else{
					html.attr('id', symbol + '__order');
					html.find('.mirror').val(0);
				}

				return html;
			}*/

			// $('.executed_orders.order_create').on('click', 'td.clickable', function () {
			// 	let html, inputFocus, self = $(this), currentId, ordersArr = [], limit;
			//
			// 	data.buySum = '';
			// 	data.sellSum = '';
			//
			// 	// data.title = $('.wrapper_event_page .current_price h2').text();
			// 	if($(this).hasClass('volume')){
			// 		limit = false;
			// 		data.priceMarket = self.parents('tbody').find('tr').eq(0).find('td.price span').text().replace(/[^0-9.]+/g, "");
			// 		data.volume = 0;
			// 		data.sellSum = 0;
			// 		data.buySum = 0;
			// 		for(let ii = 0; ii <= self.parent().index() ; ii++){
			// 			data.price = +self.parents('tbody').find('tr').eq(ii).find('td.data.price span').text().replace(/[^0-9.]+/g, "");
			// 			data.volume += +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
			// 			if(self.parents('.sell').length){
			// 				data.sellSum += (1 - data.price / 100) * +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
			// 			}
			// 			else{
			// 				data.buySum += data.price / 100 * +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
			// 			}
			// 		}
			// 		data.sellSum = data.sellSum.toFixed(2);
			// 		data.buySum = data.buySum.toFixed(2);
			// 	}
			// 	else{
			// 		limit = true;
			// 		data.price = '0.'
			// 	}
			//
			// 	let direction;
			// 	currentId = $(this).parents('.event-content').attr('id') ? $(this).parents('.event-content').attr('id')
			// 			: $(this).parents('.event-content').attr('data-symbol');
			// 	ordersArr.push(currentId, data.title);
			// 	id.push(ordersArr);
			// 	let focus = (limit) ? '.price' : '.volume';
			// 	if(!(order.children().length > 1)){
			// 		if (self.parents('.sell').length) {
			// 			direction = self.hasClass('price') ? 'buy' : 'sell';
			// 			html = orderClass.createOrderForm(direction, 'full', limit, self, data);//self, direction, 'full', data
			// 			order.append(html);
			// 			inputFocus = $(`.${direction}-container ${focus} input`);
			// 		}
			// 		else{
			// 			direction = self.hasClass('price') ? 'sell' : 'buy';
			// 			html = orderClass.createOrderForm(direction, 'full', limit, self, data);//self, direction, 'full', data
			// 			order.append(html);
			// 			inputFocus = $(`.${direction}-container ${focus} input`);
			// 		}
			// 	}
			// 	else{
			// 		if (self.parents('.sell').length) {
			// 			direction = self.hasClass('price') ? 'buy' : 'sell';
			// 			html = orderClass.createOrderForm(direction, null, limit, self, data);//self, direction, null, data
			// 			$('.default_orders .'+ direction +'-container').html(html);
			// 			$('.order_content form').fadeIn(400);
			// 			inputFocus = $(`.${direction}-container ${focus} input`);
			// 		}
			// 		else{
			// 			direction = self.hasClass('price') ? 'sell' : 'buy';
			// 			html = orderClass.createOrderForm(direction, null, limit, self, data);//self, direction, null, data
			// 			$('.default_orders .'+ direction +'-container').html(html);
			// 			$('.order_content form').fadeIn(400);
			// 			inputFocus = $(`.${direction}-container ${focus} input`);
			// 		}
			// 	}
			//
			//
			// 	$('.order_content').fadeIn(400);
			//
			// 	inputFocus.focus();
			// 	inputFocus[0].selectionStart = inputFocus.val().length;
			//
			// 	orderClass.tabReturn();
			// 	orderClass.showInfo();
			// });
			//
			// $('.ord_crt_cont .btn').click(function () {
			// 	let html, inputFocus, self = $(this), ordersArr = [], currentId;
			//
			// 	data.price = '0.';
			// 	data.volume = '';
			//
			// 	currentId = $(this).parents('.event-content').attr('id') ? $(this).parents('.event-content').attr('id')
			// 			: $(this).parents('.event-content').attr('data-symbol');
			// 	ordersArr.push(currentId, data.title);
			// 	id.push(ordersArr);
			// 	if(!(order.children().length > 1)){
			// 		if (self.hasClass('sell')) {
			// 			html = orderClass.createOrderForm('sell', 'full', 'limit', self, data);//self, 'sell', 'full'
			// 			order.append(html);
			// 			inputFocus = $('.sell-container .price input');
			// 		}
			// 		else{
			// 			html = orderClass.createOrderForm('buy', 'full', 'limit', self, data);//self, 'buy', 'full'
			// 			order.append(html);
			// 			inputFocus = $('.buy-container .price input');
			// 		}
			// 	}
			// 	else{
			// 		if (self.hasClass('sell')) {
			// 			html = orderClass.createOrderForm('sell', null, 'limit', self, data);//self, 'sell'
			// 			$('.default_orders .sell-container').html(html);
			// 			$('.order_content form').fadeIn(400);
			// 			inputFocus = $('.sell-container .price input');
			// 		}
			// 		else{
			// 			html = orderClass.createOrderForm('buy', null, 'limit', self, data);//self, 'buy'
			// 			$('.default_orders .buy-container').html(html);
			// 			$('.order_content form').fadeIn(400);
			// 			inputFocus = $('.buy-container .price input');
			// 		}
			// 	}
			//
			// 	setTimeout(function () {
			// 		inputFocus.focus();
			// 		inputFocus[0].selectionStart = inputFocus.val().length;
			// 	}, 0);
			//
			// 	$('.order_content').fadeIn(400);
			//
			// 	orderClass.tabReturn();
			// 	orderClass.showInfo();
			// });
		}();
	}
}
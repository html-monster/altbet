class eventPageClass{
	constructor(){
		var self = this;

		self.tabularMarking = function () {
			var executedOrders = $('.wrapper_event_page .executed_orders');

			executedOrders.on('mouseenter', 'td.volume.clickable', function () {
				$(this).parents('.executed_orders').find('tr').removeClass('active');
				for(var ii = 0; ii <= $(this).parent().index(); ii++){
					$(this).parents('.executed_orders').find('tr').eq(ii).addClass('active');
				}
			});
			executedOrders.on('mouseleave', 'td.clickable', function () {
				$(this).parents('.executed_orders').find('tr').removeClass('active');
			});
		}();

		self.tableAddOrder = function () {
			var order = $('#order .default_orders');

			function createOrderForm(context, orderDirection, modification, data) {
				var html = $('.order_content.new').clone();
				var title = $('.wrapper_event_page .current_price h2').text();
				var symbol = $('.wrapper_event_page').attr('id');

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
			}

			$('.executed_orders.order_create').on('click', 'td.clickable', function () {
				var html, data, inputFocus, self = $(this);

				data = {
					price: 0,
					priceMarket: 0,
					volume: '',
					buySum: '',
					sellSum: ''
				};

				if($(this).hasClass('volume')){
					data.priceMarket = self.parents('tbody').find('tr').eq(0).find('td.price span').text().replace(/[^0-9.]+/g, "");
					data.volume = 0;
					data.sellSum = 0;
					data.buySum = 0;
					for(var ii = 0; ii <= self.parent().index() ; ii++){
						data.price = +self.parents('tbody').find('tr').eq(ii).find('td.data.price span').text().replace(/[^0-9.]+/g, "");
						data.volume += +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
						if(self.parents('.sell').length){
							data.sellSum += (1 - data.price / 100) * +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
						}
						else{
							data.buySum += data.price / 100 * +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
						}
					}
					data.sellSum = data.sellSum.toFixed(2);
					data.buySum = data.buySum.toFixed(2);
				}
				else{
					data.priceMarket = self.text().replace(/[^0-9.]+/g, "");
				}

				if(!(order.children().length > 1)){
					if (self.parents('.sell').length) {
						html = createOrderForm(self, 'sell', 'full', data);
						order.append(html);
						inputFocus = $('.sell-container .volume input');
					}
					else{
						html = createOrderForm(self, 'buy', 'full', data);
						order.append(html);
						inputFocus = $('.buy-container .volume input');
					}
				}
				else{
					if (self.parents('.sell').length) {
						html = createOrderForm(self, 'sell', null, data);
						$('.default_orders .sell-container').html(html);
						$('.order_content form').fadeIn(400);
						inputFocus = $('.sell-container .volume input');
					}
					else{
						html = createOrderForm(self, 'buy', null, data);
						$('.default_orders .buy-container').html(html);
						$('.order_content form').fadeIn(400);
						inputFocus = $('.buy-container .volume input');
					}
				}


				$('.order_content').fadeIn(400);

				inputFocus.focus();
				inputFocus[0].selectionStart = inputFocus.val().length;

				orderClass.tabReturn();
				orderClass.showInfo();
			});

			$('.ord_crt_cont .btn').click(function () {
				var html, inputFocus, self = $(this);


				if(!(order.children().length > 1)){
					if (self.hasClass('sell')) {
						html = createOrderForm(self, 'sell', 'full');
						order.append(html);
						inputFocus = $('.sell-container .price input');
					}
					else{
						html = createOrderForm(self, 'buy', 'full');
						order.append(html);
						inputFocus = $('.buy-container .price input');
					}
				}
				else{
					if (self.hasClass('sell')) {
						html = createOrderForm(self, 'sell');
						$('.default_orders .sell-container').html(html);
						$('.order_content form').fadeIn(400);
						inputFocus = $('.sell-container .price input');
					}
					else{
						html = createOrderForm(self, 'buy');
						$('.default_orders .buy-container').html(html);
						$('.order_content form').fadeIn(400);
						inputFocus = $('.buy-container .price input');
					}
				}

				setTimeout(function () {
					inputFocus.focus();
					inputFocus[0].selectionStart = inputFocus.val().length;
				}, 0);

				$('.order_content').fadeIn(400);

				orderClass.tabReturn();
				orderClass.showInfo();
			});
		}();
	}
}
class eventPageClass{
	constructor(){
		var self = this;

		self.tabularMarking = function () {
			var executedOrders = $('.executed_orders');

			executedOrders.on('mouseenter', 'td.volume', function () {
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
			$('.executed_orders.order_create').on('click', 'td.clickable', function () {
				var html, price = 0, priceMarket = 0, volume = '', buySum = '', sellSum = '', title, inputFocus, order = $('#order .default_orders'), self = $(this);

				title = $('.wrapper_event_page .current_price h2').text();
				if($(this).hasClass('volume')){
					priceMarket = '0.' + self.parents('tbody').find('tr').eq(0).find('td.price span').text().replace(/[^0-9.]+/g, "");
					volume = 0;
					sellSum = 0;
					buySum = 0;
					for(var ii = 0; ii <= self.parent().index() ; ii++){
						price = +self.parents('tbody').find('tr').eq(ii).find('td.price span').text().replace(/[^0-9.]+/g, "");
						volume += +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
						if(self.parents('.sell').length){
							sellSum += (1 - price / 100) * +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
						}
						else{
							buySum += price / 100 * +self.parents('tbody').find('tr').eq(ii).find('td.volume span').text();
						}
					}
					sellSum = sellSum.toFixed(2);
					buySum = buySum.toFixed(2);
				}
				else{
					priceMarket = '0.' + self.text().replace(/[^0-9.]+/g, "");
				}

				function createOrderForm(orderDirection, modification) {
					html = $('.order_content.new').clone();
					html.removeClass('new');
					if(modification == 'full')
						html.find('h3').text(title);
					else
						html = html.find('form').css({display: 'none'});

					if (orderDirection == 'sell') {
						// html.find('.obligations input.number').val(sellSum);
					}
					else {
						if(modification == 'full'){
							html.find('.buy-container').html(html.find('.sell-container').html());
							html.find('.sell-container').html('');
						}
						html.find('input[type=submit]').toggleClass('sell buy').val('buy');
						// html.find('.obligations input.number').val(buySum);
					}

					if(self.hasClass('price')) {
						html.find('.price input.number').val(priceMarket);
						html.find('.checkbox span').text('Limit');
					}
					else {
						html.find('.price input.number').val(priceMarket).attr('disabled', true);
						html.find('.obligations input.number').removeAttr('name').attr('disabled', true);
						html.find('.obligations .regulator').hide();
						html.find('.price label').text('Market price');
						html.find('.price .regulator').remove();
						html.find('.checkbox input[type=checkbox]').attr('checked', false);
						html.find('.checkbox span').text('Market');
					}
					html.find('.volume input.number').val(volume);
				}

				if(!(order.children().length > 1)){
					if (self.parents('.sell').length) {
						createOrderForm('sell', 'full');
						order.append(html);
						inputFocus = $('.sell-container .volume input');
					}
					else{
						createOrderForm('buy', 'full');
						order.append(html);
						inputFocus = $('.buy-container .volume input');
					}
				}
				else{
					if (self.parents('.sell').length) {
						createOrderForm('sell');
						$('.default_orders .sell-container').html(html);
						$('.order_content form').fadeIn(400);
						inputFocus = $('.sell-container .volume input');
					}
					else{
						createOrderForm('buy');
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
		}();
	}
}
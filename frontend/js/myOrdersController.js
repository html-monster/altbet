var myOrdersControllerClass = new function () {
	var htmlTmp, orderTmp;
	this.createTemplate = function () {
		htmlTmp = $('.order_content.tmp').clone();
		htmlTmp.removeClass('tmp');
		htmlTmp.find('.order_container').each(function () {
			if($(this).index() == 1)
				orderTmp = $(this).clone();

			$(this).remove();
		});
		// html.find('.last-price').removeClass('hidden up down');
		// order.find('.order_info').removeClass('sell buy');
	};

	this.updateData = function (data) {
		// console.log(data);
		// console.log(html);
		// console.log(item);
		$(data).each(function () {
			var item = this,
					newItem = true,
					html = htmlTmp.clone(),
					lastPrice = html.find('.last-price');

			// console.log(item);
			$('#current-orders .order_content').each(function () {
				var self = $(this),
						lastPrice = self.find('.last-price');

				if(item.ID == self.attr('id')){
					newItem = false;
					if(item.LastSide == null || item.LastPrice == 1){
						lastPrice.addClass('hidden');
					}
					else{
						if(lastPrice.text() != (item.LastPrice).toFixed(2)) lastPrice.removeClass('hidden').text((item.LastPrice).toFixed(2));
						if(item.LastSide){
							if(lastPrice.hasClass('up')) lastPrice.removeClass('up').addClass('down');
						}
						else{
							if(lastPrice.hasClass('down')) lastPrice.removeClass('down').addClass('up');
						}
					}
					// console.log(self.find('.current-order span').text());
					// console.log(item.Positions);
					if(self.find('.current-order span').text() != item.Positions) self.find('.current-order span').text(item.Positions);

					$(item.Orders).each(function () {
						var orderInfo = this,
								newItem = true,
								order = orderTmp.clone();

						// console.log(orderInfo);
						self.find('.order_container').each(function () {
							if(($(this).attr('id')).slice(0, -7) == orderInfo.ID){
								newItem = false;
							}
						});

						if(newItem){
							createChild(self.find('.order-title'), order, orderInfo);
							// console.log(orderInfo.ID);
						}
					});
				}
			});
			if(newItem){
					html.attr('id', item.ID);
					html.find('h3').text(item.Symbol);
					if(item.LastSide == null)
						lastPrice.addClass('hidden');
					else{
						lastPrice.text((item.LastPrice).toFixed(2));
						if(item.LastSide)
							lastPrice.addClass('down');
						else
							lastPrice.addClass('up');
					}
					html.find('.current-order span').text(item.Positions);
					$(item.Orders).each(function () {
						var orderInfo = this,
								order = orderTmp.clone();

						createChild(html, order, orderInfo);
					});


					$('#current-orders').prepend(html);
			}

		});
		// console.log('=======================================');
	};
	function createChild(context, childTmp, data) {
		var date = new Date(+data.Time.slice(6).slice(0, -2)),
				direction;

		// console.log(orderInfo);
		childTmp.attr('id', data.ID + '__order');
		childTmp.find('.curnt_ord_id').val(data.ID);
		childTmp.find('.form-container #ID').val(data.ID);
		childTmp.find('.form-container #Symbol').val(data.Symbol.Exchange + '_' + data.Symbol.Name + '_' + data.Symbol.Currency);
		childTmp.find('.form-container #isMirror').val(data.isMirror);
		childTmp.find('.form-container #Side').val(data.Side ? 'Sell' : 'Buy');
		childTmp.find('.checkbox input').attr('checked', true);
		if(data.Side)
			direction = data.isMirror ? 'buy' : 'sell';
		else
			direction = data.isMirror ? 'sell' : 'buy';

		childTmp.find('.order_info').addClass(direction);
		childTmp.find('.form-container').addClass(direction + '-container');
		childTmp.find('[type=submit]').addClass(direction).val(direction);

		childTmp.find('.order_info .price').text(data.isMirror ? (1 - data.Price).toFixed(2) : data.Price);
		childTmp.find('.form-container .price input').val(data.isMirror ? (1 - data.Price).toFixed(2) : data.Price);
		childTmp.find('.order_info .volume').text(data.Volume);
		childTmp.find('.form-container .volume input').val(data.Volume);
		childTmp.find('.date').text((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
		childTmp.find('.time').text((date.getHours() - 3) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()));

		childTmp.insertAfter(context);
		// if(direction == 'sell')
			// context.find('.my_order').append(childTmp);
		// else
		// 	childTmp.insertAfter('.my_order .order-title');
	}
};
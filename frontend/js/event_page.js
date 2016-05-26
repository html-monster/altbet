;(function tabularMarking() {
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
})();

(function tableAddOrder() {
	$('.executed_orders.order_create').on('click', 'td.clickable', function () {
		var html, price = 0, priceMarket = 0, volume = '', buySum = '', sellSum = '', title, inputFocus, order = $('#order .default_orders');

		title = $('.wrapper_event_page h1').text();
		priceMarket = '0.' + $(this).parents('.body').find('tr').eq(0).find('td.price span').text().replace(/[^0-9.]+/g, "");
		if($(this).hasClass('volume')){
			volume = 0;
			sellSum = 0;
			buySum = 0;
			for(var ii = 0; ii <= $(this).parent().index() ; ii++){
				price = +$(this).parents('.body').find('tr').eq(ii).find('td.price span').text().replace(/[^0-9.]+/g, "");
				volume += +$(this).parents('.body').find('tr').eq(ii).find('td.volume span').text();
				if($(this).parents('.sell').length){
					sellSum += (1 - price / 100) * +$(this).parents('.body').find('tr').eq(ii).find('td.volume span').text();
				}
				else{
					buySum += price / 100 * +$(this).parents('.body').find('tr').eq(ii).find('td.volume span').text();
				}
			}
			sellSum = sellSum.toFixed(2);
			buySum = buySum.toFixed(2);
		}

		if(!(order.children().length)){
			if ($(this).parents('.sell').length) {
				html = '<div class="order_content" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price down">0.33</strong><strong class="current-order up">pos: <span>2553</span></strong></div><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
						sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div><div class="buy-container"></div></div>';
				order.append(html);
				inputFocus = $('.sell-container .volume input');
			}
			else{
				html = '<div class="order_content" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price down">0.33</strong><strong class="current-order up">pos: <span>2553</span></strong></div><div class="sell-container"></div><div class="buy-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
						buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div></div>';
				order.append(html);
				inputFocus = $('.buy-container .volume input');
			}
		}
		else{
			if ($(this).parents('.sell').length) {
				html = '<form><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
						sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
				$('.sell-container').html(html);
				inputFocus = $('.sell-container .volume input');
			}
			else{
				html = '<form><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
						buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
				$('.buy-container').html(html);
				inputFocus = $('.buy-container .volume input');
			}
		}


		numericalVerification($('.order_content input'));
		$('.order_content').fadeIn(400);

		inputFocus.focus();
		inputFocus[0].selectionStart = inputFocus.val().length;

		tabReturn();
	});
})();

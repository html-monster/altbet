	var id = [],
			limit = 0;

	function searchValue(array, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][0] === value) return i;
		}

		return -1;
	}

	// sidebar height and current order ==================================================================================
	;(function orderSize() {
		numericalVerification($('.order_content input'));
		var windowHeight = window.innerHeight,
				windowWidth = window.innerWidth,
				orderSidebarHeight = windowHeight - 254,
				orderContent = $('#order'),
				currentOrders = $('#current-orders'),
				tab_content = $('.tab_content'),
				checkbox = $('.left_order .tab input'),
				tbody = $('.left_order table.limit tbody');

		// tabs($('.left_order'));
		$(".left_order .wrapper .tab").click(function (e) {
				$(".left_order .wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
			$(".left_order .tab_item").hide().eq($(this).index()).fadeIn();
			if($(this).index() == 1){
				var height = currentOrders[0].clientHeight;
				if(height + 1 > windowHeight - 235){
					// currentOrders.css('overflow-y', 'auto');
					tab_content.addClass('max');
				}
				else{
					// currentOrders.css('overflow-y', 'inherit');
					tab_content.removeClass('max');
				}
			}
		}).eq(0).addClass("active");

		$(window).resize(function () {
			windowWidth = window.innerWidth;
			orderSidebarHeight = windowHeight - 254;
			if(windowWidth > 1200){
				windowHeight = window.innerHeight;
				orderContent.css('max-height', orderSidebarHeight);
				currentOrders.css('max-height', orderSidebarHeight);
				tbody.css('max-height', windowHeight - 459);
			}
		});

		if(windowWidth > 1200){
			orderContent.css('max-height', orderSidebarHeight);
			currentOrders.css('max-height', orderSidebarHeight);
			tbody.css('max-height', windowHeight - 459);
		}

		checkbox.change(function () {
			if(checkbox.prop('checked')){
				orderContent.css('overflow-y', 'auto');
			}
			else{
				orderContent.css('overflow-y', 'inherit');
			}
		});

		orderContent.bind('DOMSubtreeModified', function(event) {
			if(checkbox.prop('checked')){
				orderContent.css('overflow-y', 'auto');
			}
			else{
				if(orderContent[0].clientHeight + 3  > (orderSidebarHeight)){
					orderContent.css('overflow-y', 'auto');
					tab_content.addClass('max');
				}
				else{
					orderContent.css('overflow-y', 'inherit');
					tab_content.removeClass('max');
				}
			}
		});
	})();

	// order validation ==================================================================================================
	(function formValidation() {
		var order = $('.tab_item');

		order.on('contextmenu', 'input.number', function (e) {
			if(e.button == 2)
					e.preventDefault();
		});


		order.on('submit','form', function (e) {
			var price = +$(this).find('.price input').val(),
					volume = +$(this).find('.volume input').val(),
					sum = +$(this).find('.obligations input').val();
			if(0 >= price || price > 0.99){
				$(this).find('.price input').next().fadeIn(200);
				return false;
			}
			if(+$(this).find('select').val()){
				if(0 >= volume || !(isInteger(volume))){//|| +volume > 999999
					$(this).find('.volume input').next().fadeIn(200);
					return false;
				}
				if(0 >= sum){// || +sum > 999999
					$(this).find('.obligations input').next().fadeIn(200);
					return false;
				}
			}
			else{
				if((0 >= volume || !(isInteger(volume))) && sum == ''){//|| +volume > 999999
					$(this).find('.volume input').next().fadeIn(200);
					return false;
				}
				if(0 >= sum && volume == ''){// || +sum > 999999
					$(this).find('.obligations input').next().fadeIn(200);
					return false;
				}
			}
			return true;
		});
		order.on('focus','input', function () {
			$(this).next('.warning').fadeOut(200);
		});

		order.on('keydown', 'input.number', function (e) {
			e = e || window.e;
			var code = e.which ||e.charCode || e.keyCode;
			if($(this).parents('.price').length){
				if($(this)[0].selectionStart == 2){
					if(code == 37 || code == 8){
						return false;
					}
				}
			}
		});

		order.on('mouseup', 'input.number', function () {
			if($(this).parents('.price').length){
				if($(this).val().length >= 2){
					$(this)[0].selectionStart = $(this).val().length;
				}
			}
		});
		order.on('keypress', 'input.number', function (e) {
			e = e || window.e;
			var code = e.which ||e.charCode || e.keyCode,
					message = $(this).next();
			if($(this).parents('.price').length){
				/*if(code	 < 46 || code	 > 57 || code	 == 47){
					message.fadeIn(200);
					return false;
				}
				else if($(this).val().length > 1){
					message.fadeOut(200);
				}*/
				if($(this).val() == ''){
					if(code	 != 48){
						message.fadeIn(200);
						return false;
					}
					else{
						message.fadeOut(200);
					}
				}
				else if($(this).val().length == 1){
					if(code	 != 46){
						message.fadeIn(200);
						return false;
					}
					else{
						message.fadeOut(200);
					}
				}
				// else if($(this).val().length == 2){
				// 	if(code	 == 8){
				// 		return false;
				// 	}
				// }
				else{
					if(code	 == 46 ){
						message.fadeIn(200);
						return false;
					}
					else{
						message.fadeOut(200);
					}
				}
			}
			if($(this).parents('.volume').length){
				if(code	 < 46 || code	 > 57 || code	 == 47 || code	 == 46){
					message.fadeIn(200);
					return false;
				}
				else{
					message.fadeOut(200);
				}
				if($(this).val() == ''){
					if(code	 == 13){
						return false;
					}
				}
			}
			if($(this).parents('.obligations').length){
				if(code	 < 46 || code	 > 57 || code	 == 47){
					message.fadeIn(200);
				}
				else{
					message.fadeOut(200);
				}
				var val = $(this).val().split('.');
				if(val.length == 2){
					if(code	 == 46)
						return false;

					if(val[1].length > 2){
						val[1] = val[1].slice(0, 1);
						$(this).val($(this).val().split('.')[0] + '.' + val[1]);
					}
					// if(val[1].length > 1){
					// 	return false;
					// }
				}
			}
		});
	})();

	// new order =========================================================================================================
	(function addOrder() {
		$('#exchange').on('click', 'button.event', function () {
			var html, price = 0, volume = 0, buySum = 0, sellSum = 0, title, currentID, inputFocus, order = [];
			price = $(this).find('.price').text().replace(/[^0-9.]+/g, "");
			title = $(this).parents('.event-content').find('.event-title').text();
			currentID = $(this).parents('.event-content').attr('id');
			order.push(currentID, title);
			if(limit){
				volume = $(this).find('.volume').text();
				buySum = (!(isNaN(price)) && !(isNaN(volume))) ? (price * volume).toFixed(2) : "";
				sellSum = (!(isNaN(price)) && !(isNaN(volume))) ? ((1 - price) * volume).toFixed(2) : "";
			}
			else{
				var ii = $(this).index(),
						items = $(this).parent().children(),
						priceMarket;
				if($(this).parent('.sell').length){
					sellSum = 0;
					for(ii; ii < items.length; ii++){
						volume += +$(this).parent().find('.event').eq(ii).find('.volume').text();
						sellSum +=  (1 - +$(this).parent().find('.event').eq(ii).find('.price').text().replace(/[^0-9.]+/g, "")) * +$(this).parent().find('.event').eq(ii).find('.volume').text();
					}
					sellSum = sellSum.toFixed(2);
					priceMarket = items.eq(items.length - 1).find('.price').text().replace(/[^0-9.]+/g, "");
				}
				else{
					buySum = 0;
					for(ii; ii > -1; ii--){
						volume += +$(this).parent().find('.event').eq(ii).find('.volume').text();
						buySum +=  +$(this).parent().find('.event').eq(ii).find('.price').text().replace(/[^0-9.]+/g, "") * +$(this).parent().find('.event').eq(ii).find('.volume').text();
					}
					buySum = buySum.toFixed(2);
					priceMarket = items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
				}
			}
			if (searchValue(id, $(this).parents('.event-content').attr('id')) == -1) {
				id.push(order);
				if (($(this).parent().hasClass('sell'))) {
					if(limit){
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price down">0.33</strong><strong class="current-order up">pos: <span>255</span></strong></div><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Your price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
								sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit" checked><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div><div class="buy-container"></div></div>';
					}
					else{
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price down">0.33</strong><strong class="current-order up">pos: <span>255</span></strong></div><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div><div class="buy-container"></div></div>';
					}
				}
				else {
					if(limit){
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price up">0.33</strong><strong class="current-order down">pos: <span>255</span></strong></div><div class="sell-container"></div><div class="buy-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Your price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
							buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit" checked><span>Limit</span></label><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div></div>';
					}
					else{
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price up">0.33</strong><strong class="current-order down">pos: <span>255</span></strong></div><div class="sell-container"></div><div class="buy-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div></div>';
					}
				}
				$('#order .default_orders').append(html);
				numericalVerification($('.order_content input'));
				$('.order_content').fadeIn(400);
				if(limit){
					inputFocus = $('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .price input');
				}
				else{
					inputFocus = $('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .volume input');
				}
				inputFocus.focus();
				inputFocus[0].selectionStart = inputFocus.val().length;
			}
			else {
				var container;
				if (($(this).parent().hasClass('sell'))) {
					container = $('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .sell-container');
					if(limit){
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"><label>Your price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit" checked><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
					else{
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
				}
				else {
					container = $('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .buy-container');
					if(limit){
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"><label>Your price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit" checked><span>Limit</span></label><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
					else{
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"><label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><label class="col-3" style="margin-left: 3px;"><input type="checkbox" name="limit"><span>Limit</span></label><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
				}
				// if(container.find('form').length < 1)
					container.html(html);
				numericalVerification($('.order_content input'));
				$('.order_content form').fadeIn(400);
				if(limit){
					inputFocus = container.find('.price input');
				}
				else{
					inputFocus = container.find('.volume input');
				}
				inputFocus.focus();
				inputFocus[0].selectionStart = inputFocus.val().length;
			}

			tabReturn();
			// $("body select").msDropDown();
		});
	})();
	function tabReturn() {
		var tab = $(".left_order .tab_wrapper .tab"),
				tab_item = $(".left_order .tab_item");
		if(!(tab.eq(0).hasClass('active'))){
			tab.removeClass("active").eq(0).addClass("active");
			tab_item.hide().eq(0).fadeIn(200);
		}
	}
	//order edit =======================================================================================================
	;(function orderEdit() {
		var container = $('.left_order'),
				checkbox,
				priceMarket = '';
		container.on('change', 'label.col-3 input', function () {
			var price = $(this).parents('form').find('.price'),
					id,
					items;
			checkbox = $(this).parents('form').find('input[type="checkbox"]').prop('checked');
			if($(this).parents('#order').length){
				if($('.wrapper_event_page').length){
					if($(this).parents('.sell-container').length){
						items = $('.executed_orders.sell .body tr');
						priceMarket = '0.' + items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
					}
					else{
						items = $('.executed_orders.buy .body tr');
						priceMarket = '0.' + items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
					}
				}
				else{
					id  = $(this).parents('.order_content').attr('id').slice(0, -7);
					if($(this).parents('.sell-container').length){
						items = $('.event-content#' + id + ' .sell').children();
						priceMarket = items.eq(items.length - 1).find('.price').text().replace(/[^0-9.]+/g, "");
					}
					else{
						items = $('.event-content#' + id + ' .buy').children();
						priceMarket = items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
					}
				}
			}
			if(checkbox){
				price.html('<label style="display: none;">Your price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="0."><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator" style="display: none;"><span class="plus">+</span><span class="minus">-</span></div></div>').find('.regulator').fadeIn(200);
				price.find('label').fadeIn(200);
				price.find('input').focus();
				price.find('input')[0].selectionStart = 2;
			}
			else{
				// price.animate({opacity: 0}, 100);
				price.find('.regulator').fadeOut(200);
				price.find('label').fadeOut(200);
				setTimeout(function () {
					price.html('<label>Market price:</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + priceMarket + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div>');
				}, 200);
				price.parent().find('input.number').val('');
				price.parent().find('.volume input').focus();
			}
		});
		// container.on('focus', 'input.number', function () {
		// 	checkbox = $(this).parents('form').find('input[type="checkbox"]').is('checked');
		// });
		function calculation(context) {
			var priceInput = context.parents('form').find('.price input'),
					volumeInput = context.parents('form').find('.volume input'),
					sumInput = context.parents('form').find('.obligations input'),
					price,
					volume = volumeInput.val(),
					sum = sumInput.val();

			if(checkbox){
				if(context.parents('.sell-container').length){
					price = 1 - priceInput.val();
				}
				else{
					price = priceInput.val();
				}
				if(context.parents('.price').length){//(price * volume).toFixed(2)
					if(!(isNaN(volume))){
						sumInput.val((price * volume).toFixed(2));
					}
					else{
						sumInput.val('');
					}
				}
				if(context.parents('.volume').length){
					if(!(isNaN(price))){
						sumInput.val((price * volume).toFixed(2));
					}
					else{
						sumInput.val('');
					}
				}
				if(context.parents('.obligations').length){
					if(!(isNaN(price))){
						volumeInput.val(Math.round(sum / price));
					}
					else{
						volumeInput.val('');
					}
				}
			}
			else{
				if(context.parents('.volume').length){
					sumInput.val('');
				}
				if(context.parents('.obligations').length){
					volumeInput.val('');
				}
			}
		}
		container.on('keyup', 'input.number', function () {
			calculation($(this));
		});
		container.on('click', '.regulator span', function(){
			var thisItem = $(this);
			setTimeout(function () {
				calculation(thisItem);
			}, 0);
		});

		$('.current-order-title .edit').click(function (e) {
			var title = $(this).parents('.current-order-title'),
					tab_content = $('.tab_content'),
					windowHeight = window.innerHeight,
					parent = $(this).parents('#current-orders'),
					height;
			e.stopPropagation();
			setTimeout(function () {
				height = parent[0].clientHeight;
				if(height + 1 > windowHeight - 235){
					// parent.css('overflow-y', 'auto');
					tab_content.addClass('max');
				}
				else{
					tab_content.removeClass('max');
					// parent.css('overflow-y', 'auto');
				}
			}, 300);
			if(title.hasClass('active')){
				setTimeout(function () {
					title.removeClass('active');
				}, 200);
			}
			else{
				title.addClass('active');
			}
			$(this).parent().next().toggleClass('active').slideToggle(200);
			$(this).parents('.order_content').toggleClass('active');
		});
	})();

	// $('#exchange').on('click', 'button.event', function () {
		// 	var html, price, volume, title, parent, order = [];
		// 	price = $(this).find('.price').text();
		// 	volume = $(this).find('.volume').text();
		// 	title = $(this).parents('.event-content').find('.event-title').text();
		// 	parent = $(this).parent().attr('class');
		// 	if(!($(this).hasClass('empty'))){
		// 		$('#order-form .price input').val(price);
		// 		$('#order-form .volume input').val(volume);
		// 	}
		// 	else{
		// 		$('#order-form .price input').val('');
		// 		$('#order-form .volume input').val('');
		// 	}
		// 	$('#order-container').attr('class', parent +'-container');
		// 	$('#order-form h3').text(title);
		// 	$('#order-form input[type="submit"]').val(parent).attr('class', parent + ' col-3 btn');
		// 	$('#order-form').fadeIn(200);
		// });

	(function orderDelete() {
		var order_tab = $('#order');
		order_tab.on('click', 'button.delete', function (e) {
			e.preventDefault();
			var form = $(this).parents('form'),
					order = $(this).parents('.order_content');
			if(order.find('form').length == 1){
				if(id.length)
					id.splice(searchValue(id, order.attr('id').slice(0, -7)), 1);
				order.remove();
			}
			else{
				form.remove();
			}
		});
		order_tab.on('click', 'a.close', function (e) {
			e.preventDefault();
			var order = $(this).parents('.order_content');
			if(id.length)
				id.splice(searchValue(id, order.attr('id').slice(0, -7)), 1);
			order.remove();
		});
		// var order_tab = $('#order');
		// order_tab.on('click', '.delete', function (e) {
		// 	e.preventDefault();
		// 	$('#order-form').fadeOut(200);
		// });
	})();

	// order drag and drop ===============================================================================================
	$(function() {
		var current = $( "#current-orders" );
		current.sortable({
			placeholder: "ui-state-highlight"
		});
		current.disableSelection();
	});

$(document).ready(function () {
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
				orderSidebarWidth = windowHeight - 235,
				orderContent = $('#order'),
				currentOrders = $('#current-orders');

		// tabs($('.left_order'));
		$(".left_order .wrapper .tab").click(function () {
			$(".left_order .wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
			$(".left_order .tab_item").hide().eq($(this).index()).fadeIn();
			if($(this).index() == 1){
				var height = currentOrders[0].clientHeight;
				if(height + 1 > windowHeight - 235){
					currentOrders.css('overflow-y', 'auto');
				}
				else{
					currentOrders.css('overflow-y', 'inherit');
				}
			}
		}).eq(0).addClass("active");

		$(window).resize(function () {
			windowWidth = window.innerWidth;
			orderSidebarWidth = windowHeight - 235;
			if(windowWidth > 1200){
				windowHeight = window.innerHeight;
				orderContent.css('max-height', orderSidebarWidth);
				currentOrders.css('max-height', orderSidebarWidth);
			}
		});

		if(windowWidth > 1200)
			orderContent.css('max-height', orderSidebarWidth);
		currentOrders.css('max-height', orderSidebarWidth);

		orderContent.bind('DOMSubtreeModified', function(event) {
			if(orderContent[0].clientHeight + 3  > (orderSidebarWidth)){
				orderContent.css('overflow-y', 'auto');
			}
			else{
				orderContent.css('overflow-y', 'inherit');
			}
		});
	})();

	// order validation ==================================================================================================
	(function formValidation() {
		var order = $('.tab_item');
		/*function formValidation(form){
		 form.each(function () {
		 // $(this).find('input[type="submit"]').prop('disabled', true);
		 if($(this).find('input.number').length != 0){
		 $(this).submit(function (e) {
		 e.preventDefault();
		 $(this).find('input.number').each(function () {
		 // \d{1,6} - целые
		 //[0-9]{0,6}[.]?[0-9]{1,2} - 0,01 - 99999999
		 //[0]+([.][0-9]{1,2})? -
		 var validationFormula = new RegExp('(' + $(this).attr('validation') + ')','i'),
		 value = $(this).val();
		 console.log(/\d{1,6}$/i.test('12345678'));
		 if(!(validationFormula.test(value))){
		 if(validationFormula.test('2.1')){
		 console.log('Введенные данные должны быть ');
		 }
		 }
		 });
		 });
		 }
		 });
		 }
		 formValidation($('#order form'));*/
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

		order.on('keypress', 'input.number', function (e) {
			e = e || window.e;
			var code = e.charCode || e.keyCode,
					message = $(this).next();
			if($(this).parents('.price').length){
				if(code	 < 46 || code	 > 57 || code	 == 47){
					message.fadeIn(200);
				}
				else if($(this).val().length > 1){
					message.fadeOut(200);
				}
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
					if(code	 == 48){
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
				// console.log((+$(this).val()).toFixed(2));
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
			var html, price, volume, buySum, sellSum, title, currentID, order = [];
			price = $(this).find('.price').text().replace(/[^0-9.]+/g, "");
			volume = $(this).find('.volume').text();
			title = $(this).parents('.event-content').find('.event-title').text();
			currentID = $(this).parents('.event-content').attr('id');
			order.push(currentID, title);
			buySum = (price != '' && volume != '' && price != undefined && volume != undefined) ? (price * volume).toFixed(2) : "";
			sellSum = (price != '' && volume != '' && price != undefined && volume != undefined) ? ((1 - price) * volume).toFixed(2) : "";
			if (searchValue(id, $(this).parents('.event-content').attr('id')) == -1) {
				id.push(order);
				if (($(this).parent().hasClass('sell'))) {
					if(+limit){
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price down">0.33</strong><strong class="current-order up">pos: <span>255</span></strong></div><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Ваша цена</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
								sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0">Market</option><option value="1" selected>Limit</option></select><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div><div class="buy-container"></div></div>';
					}
					else{
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price down">0.33</strong><strong class="current-order up">pos: <span>255</span></strong></div><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0" selected>Market</option><option value="1">Limit</option></select><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div><div class="buy-container"></div></div>';
					}
				}
				else {
					if(+limit){
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price up">0.33</strong><strong class="current-order down">pos: <span>255</span></strong></div><div class="sell-container"></div><div class="buy-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Ваша цена</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' +
							buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0">Market</option><option value="1" selected>Limit</option></select><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div></div>';
					}
					else{
						html = '<div class="order_content" id="' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order" style="display: none;"><div class="order-title"><h3>' + title + '</h3><a href="#" class="close"></a><strong class="last-price up">0.33</strong><strong class="current-order down">pos: <span>255</span></strong></div><div class="sell-container"></div><div class="buy-container"><form><div class="price col-3" style="margin-left: 3px;"></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0" selected>Market</option><option value="1">Limit</option></select><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form></div></div>';
					}
				}
				$('#order').append(html);
				numericalVerification($('.order_content input'));
				$('.order_content').fadeIn(400);
				if(+limit){
					var inputFocus = $('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .price input');
					inputFocus.focus();
					inputFocus[0].selectionStart = inputFocus.val().length;
				}
				else{
					$('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .volume input').focus();
				}
			}
			else {
				if (($(this).parent().hasClass('sell'))) {
					var container = $('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .sell-container');
					if(+limit){
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"><label>Ваша цена</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + sellSum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0">Market</option><option value="1" selected>Limit</option></select><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
					else{
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0" selected>Market</option><option value="1">Limit</option></select><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
					if(container.find('form').length < 1)
						container.append(html);
				}
				else {
					var container = $('#' + id[searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .buy-container');
					if(+limit){
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"><label>Ваша цена</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="' + price + '"><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8" value="' + volume + '"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8" value="' + buySum + '"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0">Market</option><option value="1" selected>Limit</option></select><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
					else{
						html = '<form style="display: none;"><div class="price col-3" style="margin-left: 3px;"></div><div class="volume col-3" style="margin-left: 3px;"><label>Объем</label><div class="input"><input type="text" class="number" placeholder="123" validation="[0-9]{1,6}" maxlength="8"><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div><div class="order_type col-3" style="margin-left: 3px;"><div class="obligations"><label>Сумма:</label><div class="input"><input type="text" class="number" placeholder="40.59" validation="[0-9]{0,6}[.]?[0-9]{1,2}" maxlength="8"><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p> </div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div></div></div><select class="limit_market col-3" style="margin-left: 3px; width: 31%;" name="limit"><option value="0" selected>Market</option><option value="1">Limit</option></select><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button></form>';
					}
					if(container.find('form').length < 1)
						container.append(html);
				}
				// container.find('.volume input').css('background', 'green');
				numericalVerification($('.order_content input'));
				$('.order_content form').fadeIn(400);
				if(+limit){
					var inputFocus = container.find('.price input');
					inputFocus.focus();
					inputFocus[0].selectionStart = inputFocus.val().length;
				}
				else{
					container.find('.volume input').focus();
				}
			}

			;(function tabReturn() {
				var tab = $(".left_order .wrapper .tab"),
						tab_item = $(".left_order .tab_item");
				if(!(tab.eq(0).hasClass('active'))){
					tab.removeClass("active").eq(0).addClass("active");
					tab_item.hide().eq(0).fadeIn(200);
				}
			})();
			$("body select").msDropDown();
		});

		//order edit ======================================================================================================
		;(function orderEdit() {
			var container = $('.left_order'),
					select;
			container.on('change', 'select', function () {
				var price = $(this).parents('form').find('.price');
				if(+$(this).val()){
					price.css({'display': 'none', 'opacity': 1}).html('<label>Ваша цена</label><div class="input"><input type="text" class="number" placeholder="0.33" validation="[0]+([.][0-9]{1,2})?" maxlength="4" value="0."><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div><div class="regulator"><span class="plus">+</span><span class="minus">-</span></div></div>').fadeIn(200);
					price.find('input').focus();
					price.find('input')[0].selectionStart = 2;
				}
				else{
					price.animate({opacity: 0}, 100);
					setTimeout(function () {
						price.html('');
					}, 200);
					price.parent().find('input.number').val('');
					price.parent().find('.volume input').focus();
				}
			});
			container.on('focus', 'input.number', function () {
				select = +$(this).parents('form').find('select').val();
			});
			function calculation(context) {
				var priceInput = context.parents('form').find('.price input'),
						volumeInput = context.parents('form').find('.volume input'),
						sumInput = context.parents('form').find('.obligations input'),
						price,
						volume = volumeInput.val(),
						sum = sumInput.val();

				if(select){
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

			$('.current-order-title .edit').click(function () {
				var title = $(this).parents('.current-order-title'),
						windowHeight = window.innerHeight,
						parent = $(this).parents('#current-orders'),
						height;
				setTimeout(function () {
					height = parent[0].clientHeight;
					if(height + 1 > windowHeight - 235){
						parent.css('overflow-y', 'auto');
					}
					else{
						parent.css('overflow-y', 'inherit');
					}
				}, 400);
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

	})();
	(function orderDelete() {
		var order_tab = $('#order');
		order_tab.on('click', 'button.delete', function (e) {
			e.preventDefault();
			var form = $(this).parents('form'),
					order = $(this).parents('.order_content');
			if(order.find('form').length == 1){
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
		$( "#current-orders" ).sortable({
			placeholder: "ui-state-highlight"
		});
		$( "#current-orders" ).disableSelection();
	});
});
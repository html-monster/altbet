let id = [];

class orderClass{
	constructor(){
		let self = this;
		// const takerFees = 0.0086;

		orderClass.showInfo();

		// sidebar height and current order ============================================================================
		self.orderSize = function () {
			// numericalVerification($('.order_content input'));
			let windowHeight = window.innerHeight,
					windowWidth = window.innerWidth,
					substructionHeight = $('.left_order .tabs').height() + 45 + $('header').height(),
					orderSidebarHeight = windowHeight - substructionHeight,
					orderContent = $('#order'),
					currentOrders = $('#current-orders'),
					tab_content = $('.tab_content'),
					checkbox = $('.left_order .tab input[type=checkbox]');

			$(".left_order .wrapper .tab").click(function () {
				let tab = $(".left_order .wrapper .tab");

				if($(this).attr('data-disabled')) return false;

				if($(this).index() == 0){
					if($('.left_order .tab input.limit').prop('checked')) globalData.tradeOn = true;
					globalData.myOrdersOn = false;
				}
				else{
					globalData.tradeOn = false;
					globalData.myOrdersOn = true;
				}
				tab.removeClass("active").eq($(this).index()).addClass("active");
				$(".left_order .tab_item").hide().eq($(this).index()).show();
			}).eq(0).addClass("active");

			$(window).resize(function () {
				windowWidth = window.innerWidth;
				orderSidebarHeight = windowHeight - substructionHeight;
				if(windowWidth > 1200){
					windowHeight = window.innerHeight;
					orderContent.css('max-height', orderSidebarHeight);
					currentOrders.css('max-height', orderSidebarHeight);
				}
			});

		}();

		// order validation ============================================================================================
		self.formValidation = function() {
			let order = $('.order');

			order.on('submit','form', function () {

				if($(this).find('[data-log-out]').attr('data-log-out')) return false;

				let price = +$(this).find('.price input').val(),
						volume = +$(this).find('.volume input').val(),
						sum = +$(this).find('.obligations input').val(),
						checkboxProp = $(this).find('input[type="checkbox"]').length ? $(this).find('input[type="checkbox"]').prop('checked') : 1,
						staticProject = location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru';

				if(globalData.userIdentity == 'False'){
					$('.sign_in_form').fadeIn(200);  //'.sign_in_form'
					$('#login-email').focus(); //'#email'
					return false;
				}


				if(checkboxProp){
					if(0 >= price || price > 0.99){
						$(this).find('.price input').next().fadeIn(200);
						return false;
					}
					if(0 >= volume || !(defaultMethods.isInteger(volume))){//|| +volume > 999999
						$(this).find('.volume input').next().fadeIn(200);
						return false;
					}
					if(0 >= sum){// || +sum > 999999
						$(this).find('.obligations input').next().fadeIn(200);
						return false;
					}
				}
				else{
					if((0 >= volume || !(defaultMethods.isInteger(volume))) && sum == ''){//|| +volume > 999999
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
				let code = e.which ||e.charCode || e.keyCode;
				if($(this).parents('.price').length || $(this).hasClass('spreader')){
					if($(this)[0].selectionStart == 2){
						if(code == 37 || code == 8){
							return false;
						}
					}
					else if($(this)[0].selectionStart < 2)
						$(this).val('0.')
				}
			});

			// order.on('mousedown', 'input.number', function () {
			// 	if($(this).parents('.price').length){
			// 		if($(this).val().length >= 2){
			// 			$(this)[0].selectionStart = $(this).val().length;
			// 		}
			// 	}
			// });

			order.on('keypress', 'input.number', function (e) {
				e = e || window.e;
				let code = e.which ||e.charCode || e.keyCode,
						message = $(this).next('.warning'),
						condition = code != 13 && code != 8 && code != 9 && code != 37 && code != 39;

				// if(code == 13)
				// 	$(this).parents('form').submit();
				if($(this).parents('.price').length || $(this).parents('.input').find('.spreader').length){
					if((code < 46 || code > 57 || code == 47) && condition){
						message.fadeIn(200);
						return false;
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
					if((code	 < 46 || code	 > 57 || code	 == 47 || code	 == 46) && condition){
						message.fadeIn(200);
						return false;
					}
					else{
						message.fadeOut(200);
					}
					if(code == 48 && $(this)[0].selectionStart == 0)
						return false;
				}
				if($(this).parents('.obligations').length){
					let val = $(this).val().split('.');

					if((code < 46 || code > 57 || code == 47) && condition){
						message.fadeIn(200);
					}
					else{
						message.fadeOut(200);
					}
					if(val.length == 2){
						if(code	 == 46)
							return false;

						if(val[1].length > 2){
							val[1] = val[1].slice(0, 1);
							$(this).val($(this).val().split('.')[0] + '.' + val[1]);
						}
					}
				}
			});
		}();

		//order edit ===================================================================================================
		self.orderEdit = function () {
			// let container = $('.left_order'),
			// 		currentOrders = $('#current-orders'),
			// 		checkboxProp,
			// 		priceMarket = '';
			// container.on('change', 'label.checkbox input[type=checkbox]', function () {
			// 	let price = $(this).parents('form').find('.price'),
			// 			id,
			// 			items;
			// 	checkboxProp = $(this).parents('form').find('input[type=checkbox]').prop('checked');
			// 	if ($(this).parents('#order').length) {
			// 		if ($('.wrapper_event_page').length) {
			// 			if ($(this).parents('.sell-container').length) {
			// 				items = $('.executed_orders.sell .body tr');
			// 				priceMarket = '0.' + items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
			// 			}
			// 			else {
			// 				items = $('.executed_orders.buy .body tr');
			// 				priceMarket = '0.' + items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
			// 			}
			// 		}
			// 		else {
			// 			id = $(this).parents('.order_content').attr('id').slice(0, -7);
			// 			if ($(this).parents('.sell-container').length) {
			// 				items = $('.event-content#' + id + ' .sell').children();
			// 				priceMarket = items.eq(items.length - 1).find('.price').text().replace(/[^0-9.]+/g, "");
			// 			}
			// 			else {
			// 				items = $('.event-content#' + id + ' .buy').children();
			// 				priceMarket = items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
			// 			}
			// 		}
			// 	}
			// 	if (checkboxProp) {
			// 		let html = $('.order_content.new .price').clone();
			//
			// 		$(this).parent().find('span').text('Limit');
			// 		html.find('label').hide();
			// 		html.find('.regulator').hide();
			// 		$(this).parents('form').find('.obligations .regulator').fadeIn(200);
			// 		price.html(html.html()).find('.regulator').fadeIn(200);
			// 		price.find('label').fadeIn(200);
			// 		price.find('input').val('0.').focus();
			// 		price.find('input')[0].selectionStart = 4;
			// 		price.parents('form').find('.obligations input').removeAttr('disabled');
			// 	}
			// 	else {
			// 		let sum = $(this).parents('form').find('.obligations');
			//
			// 		$(this).parent().find('span').text('Market');
			// 		price.find('label').text('Market price');
			// 		price.find('input.number').attr('disabled', true).removeAttr('name').val('');
			// 		price.find('.regulator').fadeOut(200);
			// 		sum.find('input.number').attr('disabled', true);
			// 		sum.find('.regulator').fadeOut(200);
			// 		price.parents('form').find('.obligations input.number').val('');
			// 		price.parents('form').find('.volume input').focus();
			// 	}
			// });
			// function calculation(context) {
			// 	let priceInput = context.parents('form').find('.price input'),
			// 			volumeInput = context.parents('form').find('.volume input'),
			// 			sumInput = context.parents('form').find('.obligations input'),
			// 			feesInput = context.parents('form').find('.fees input'),
			// 			riskInput = context.parents('form').find('.risk input'),
			// 			profitInput = context.parents('form').find('.profit input'),
			// 			price,
			// 			volume = +volumeInput.val(),
			// 			sum = +sumInput.val(),
			// 			fee = Math.round10(0.0086 * volume, -2);
			//
			// 	if (checkboxProp) {
			// 		if (context.parents('.sell-container').length) {
			// 			price = 1 - priceInput.val();
			// 		}
			// 		else {
			// 			price = priceInput.val();
			// 		}
			// 		if (context.parents('.price').length) {//(price * volume).toFixed(2)
			// 			if (volume) {
			// 				sum = Math.round10(price * volume, -2);
			// 				sumInput.val(sum);
			// 				feesInput.val(fee || '');
			// 				riskInput.val(Math.round10(fee + sum, -2) || '');
			// 				profitInput.val(Math.round10((1 - price) * ((volume == 'Infinity') ? '' : volume), -2) || '');
			// 			}
			// 		}
			// 		if (context.parents('.volume').length) {
			// 			if (price) {
			// 				sum = Math.round10(price * volume, -2);
			// 				sumInput.val(sum);
			// 			}
			// 			feesInput.val(fee || '');
			// 			riskInput.val(Math.round10(fee + sum, -2) || '');
			// 		}
			// 		if (context.parents('.obligations').length) {
			// 			if (price) {
			// 				volume = Math.round10(sum / price) || '';
			// 				volumeInput.val((volume == 'Infinity') ? '' : volume);
			// 				fee = Math.round10(0.0086 * volume, -2);
			// 				feesInput.val(fee || '');
			// 				riskInput.val(Math.round10(fee + sum, -2) || '');
			// 				profitInput.val(Math.round10((1 - price) * ((volume == 'Infinity') ? '' : volume), -2) || '');
			// 			}
			// 		}
			// 		else{
			// 			if(price && volume && sum)
			// 				profitInput.val(Math.round10((1 - price) * volume, -2));
			// 			else
			// 				profitInput.val('');
			// 		}
			// 	}
			// 	else {
			// 		if (context.parents('.volume').length) {
			// 			feesInput.val(fee || '');
			// 			sumInput.val('');
			// 		}
			// 		if (context.parents('.obligations').length) {
			// 			volumeInput.val('');
			// 			feesInput.val('');
			// 		}
			// 	}
			// }

			// container.on('keyup', 'input.number', function () {
			// 	// checkboxProp = $(this).parents('form').find('input[type=checkbox]').length ? $(this).parents('form').find('input[type=checkbox]').prop('checked') : 1;
			// 	calculation($(this));
			// });
			// container.on('click', '.regulator span', function () {
			// 	let thisItem = $(this);
			// 	checkboxProp = $(this).parents('form').find('input[type=checkbox]').length ? $(this).parents('form').find('input[type=checkbox]').prop('checked') : 1;
			//
			// 	setTimeout(function () {
			// 		calculation(thisItem);
			// 	}, 0);
			// });

			// currentOrders.on('click', '.order_info .edit', function () {
			// 	let tab_content = $('.tab_content');
			//
			// 	$(this).parents('.order_info').next().slideToggle(200);//.toggleClass('active')
			// 	// $(this).parents('.order_content').toggleClass('active');
			// });

			// currentOrders.on('click', '.order_info .delete', function () {
			// 	$(this).parents('.order_info').find('.pop_up').fadeIn();
			// });
			// currentOrders.on('click', '.order_content .close', function () {
			// 	$(this).parents('.order_content').children('.pop_up').fadeIn();
			// });
			// currentOrders.on('click', '.confirmation .no', function () {
			// 	$(this).parents('.pop_up').fadeOut();
			// });
		}();

		//order delete =====================================================================================================
		self.orderDelete = function () {
			let order_tab = $('#order');
			// order_tab.on('click', '.delete', function (e) {
			// 	e.preventDefault();
			// 	$('.active_trader .spread_confim').remove();
			// 	let form = $(this).parents('form'),
			// 			order = $(this).parents('.order_content');
			// 	if(order.find('form').length <= 1){
			// 		if($(this).parents('.default_orders').length && id.length)
			// 			id.splice(defaultMethods.searchValue(id, order.attr('id').slice(0, -7)), 1);
			// 		order.remove();
			// 	}
			// 	else{
			// 		form.remove();
			// 	}
			// 	orderClass.showInfo();
			// });
			// order_tab.on('click', '.order-title .close', function (e) {
			// 	e.preventDefault();
			// 	let order = $(this).parents('.order_content');
			// 	if($(this).parents('.default_orders').length && id.length)
			// 		id.splice(defaultMethods.searchValue(id, order.attr('id').slice(0, -7)), 1);
			// 	order.remove();
			// 	orderClass.showInfo();
			// });
			// order_tab.on('click', '.error_pop_up .close', function () {
			// 	$(this).parents('.error_pop_up').removeClass('bounceInRight').addClass('bounceOutRight');
			// 	setTimeout(function () {
			// 		$(this).parents('.error_pop_up').removeClass('active')
			// 	}, 700);
			// });

			// $(document).keyup(function (e) {
			// 	e = e || event;
			//
			// 	if(e.keyCode == 27) {
			// 		$('.error_pop_up').removeClass('bounceInRight').addClass('bounceOutRight');
			// 		setTimeout(function () {
			// 			$('.error_pop_up').removeClass('active')
			// 		}, 700);
			// 	}
			// });
		}();

		// self.checkbox = function () {
		// 	let order_tab = $('#order');
		//
		// 	order_tab.on('change', '[type=checkbox]', function () {
		// 		let self = $(this);
		//
		// 		 if(self.prop('checked'))
		// 		 	self.parent().find('span').text('Limit');
		// 		 else
		// 		 	self.parent().find('span').text('Market');
		// 	});
		// }();

		orderClass.addOrder('#exchange', 'button.event');
	}

	// new order =========================================================================================================
		static addOrder(container, button) {
	$(container).on('click', button, function () {
		// let html,
		// 	data = {
		// 		price: 0,
		// 		volume: 0,
		// 		buySum: 0,
		// 		sellSum: 0,
		// 		priceMarket: 0
		// 	},
		// 	currentID, inputFocus, order = [], self = $(this);
		//
		// data.price = $(this).find('.price').text().replace(/[^0-9.]+/g, "") || '0.';
		// data.title = $(this).parents('.event-content').find('.title').text();
		// let idDefine = () => $(this).parents('.event-content').attr('id') ? $(this).parents('.event-content').attr('id')
		// 		: $(this).parents('.event-content').attr('data-symbol');
		//
		// currentID = idDefine();
		// order.push(currentID, data.title);
		//
		// if((globalData.basicMode || $(this).hasClass('empty'))){
		// 	data.volume = $(this).find('.volume').text();
		// 	data.buySum = (data.price && data.volume) ? (data.price * data.volume).toFixed(2) : "";
		// 	data.sellSum = (data.price && data.volume) ? ((1 - data.price) * data.volume).toFixed(2) : "";
		// }
		// else{
		// 	let ii = $(this).index(),
		// 			items = $(this).parent().children();
		// 	if($(this).parent('.sell').length){
		// 		data.sellSum = 0;
		// 		for(ii; ii < items.length; ii++){
		// 			data.volume += +$(this).parent().find('.event').eq(ii).find('.volume').text();
		// 			data.sellSum +=  (1 - +$(this).parent().find('.event').eq(ii).find('.price').text().replace(/[^0-9.]+/g, "")) * +$(this).parent().find('.event').eq(ii).find('.volume').text();
		// 		}
		// 		data.sellSum = data.sellSum.toFixed(2);
		// 		data.priceMarket = items.eq(items.length - 1).find('.price').text().replace(/[^0-9.]+/g, "");
		// 	}
		// 	else{
		// 		data.buySum = 0;
		// 		for(ii; ii > -1; ii--){
		// 			data.volume += +$(this).parent().find('.event').eq(ii).find('.volume').text();
		// 			data.buySum +=  +$(this).parent().find('.event').eq(ii).find('.price').text().replace(/[^0-9.]+/g, "") * +$(this).parent().find('.event').eq(ii).find('.volume').text();
		// 		}
		// 		data.buySum = data.buySum.toFixed(2);
		// 		data.priceMarket = items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
		// 	}
		// }
		//
		// if (defaultMethods.searchValue(id, currentID) == -1) {
		// 	id.push(order);
		// 	if ($(this).parent('.sell').length) {
		//
		// 		if((globalData.basicMode || $(this).hasClass('empty')))
		// 			html = orderClass.createOrderForm('sell', 'full', true, self, data);
		// 		else
		// 			html = orderClass.createOrderForm('sell', 'full', false, self, data);
		// 	}
		// 	else{
		// 		if((globalData.basicMode|| $(this).hasClass('empty')))
		// 			html = orderClass.createOrderForm('buy', 'full', true, self, data);
		// 		else
		// 			html = orderClass.createOrderForm('buy', 'full', false, self, data);
		// 	}
		// 	$('#order .default_orders').append(html);
		// 	$('.order_content').fadeIn(400);
		// 	if((globalData.basicMode|| $(this).hasClass('empty'))) {
		// 		currentID = idDefine();
		// 		inputFocus = $('#' + id[defaultMethods.searchValue(id, currentID)][0] + '__order .price input');
		// 	}
		// 	else
		// 	{
		// 		currentID = idDefine();
		// 		inputFocus = $('#' + id[defaultMethods.searchValue(id, currentID)][0] + '__order .volume input');
		// 	}
		// 	inputFocus.focus();
		// 	inputFocus[0].selectionStart = inputFocus.val().length;
		// }
		// else {
		// 	let container;
		// 	if ($(this).parent('.sell').length) {
		// 		currentID = idDefine();
		// 		container = $('#' + id[defaultMethods.searchValue(id, currentID)][0] + '__order .sell-container');
		// 		if((globalData.basicMode|| $(this).hasClass('empty')))
		// 			html = orderClass.createOrderForm('sell', null, true, self, data);
		// 		else
		// 			html = orderClass.createOrderForm('sell', null, false, self, data);
		// 	}
		// 	else {
		// 		currentID = idDefine();
		// 		container = $('#' + id[defaultMethods.searchValue(id, currentID)][0] + '__order .buy-container');
		// 		if((globalData.basicMode|| $(this).hasClass('empty')))
		// 			html = orderClass.createOrderForm('buy', null, true, self, data);
		// 		else
		// 			html = orderClass.createOrderForm('buy', null, false, self, data);
		// 	}
		// 	container.html(html);
		// 	$('.order_content form').fadeIn(400);
		// 	if((globalData.basicMode || $(this).hasClass('empty'))){
		// 		inputFocus = container.find('.price input');
		// 	}
		// 	else{
		// 		inputFocus = container.find('.volume input');
		// 	}
		// 	inputFocus.focus();
		// 	inputFocus[0].selectionStart = inputFocus.val().length;
		// }

		orderClass.tabReturn();
		// orderClass.showInfo();
	});
};

	/**
	 * формирует html ордера создоваемого
	 * @param orderDirection string направление ордера sell buy
	 * @param modification string если full, то будет полный ордер с тайтлом
	 * @param limit bool лимитный или маркетный
	 * @param context дом узел с которого идет вызов, чтобы взять symbol объекта
	 * @param object передаются данные для ордера
	 * @returns html ордера
	 */
	static createOrderForm(orderDirection, modification, limit, context, object) {
		let html = $('.order_content.new').clone(),
				eventId = context.parents('.event-content').attr('id') ? context.parents('.event-content').attr('id') : context.parents('.event-content').attr('data-symbol'),
				sumVal;

		html.removeClass('new');
		if(modification == 'full'){
			html.attr('id', id[defaultMethods.searchValue(id, eventId)][0] + '__order').css({display: 'none'});
			html.find('h3').text(object.title);
			if(globalData.basicMode) html.find('form').addClass('basic_mode');
		}
		else{
			html = html.find('form').css({display: 'none'});
			if(globalData.basicMode) html.addClass('basic_mode');
		}

		if (orderDirection == 'sell') {
			// html.find('.id').val(id[defaultMethods.searchValue(id, context.parents('.event-content').attr('id'))][0] + '__order_buy');
			if(globalData.basicMode){
				sumVal = +object.sellSum;
				html.find('.obligations input.number').val(object.sellSum);
			}
			html.find('.side').val('Sell');
		}
		else {
			if(modification == 'full'){
				html.find('.buy-container').html(html.find('.sell-container').html());
				html.find('.sell-container').html('');
			}
			html.find('input[type=submit]').toggleClass('sell buy').val('buy');
			if(globalData.basicMode){
				sumVal = +object.buySum;
				html.find('.obligations input.number').val(object.buySum);
			}
			html.find('.side').val('Buy');
			// html.find('.id').val(id[defaultMethods.searchValue(id, context.parents('.event-content').attr('id'))][0] + '__order_buy');
		}

		if(limit) {
			html.find('.price input.number').val(object.price);
			html.find('.checkbox span').text('Limit');
			html.find('.checkbox input').prop('checked', true);
		}
		else {
			html.find('.price input.number').attr('disabled', true).removeAttr('name').val(object.priceMarket);
			html.find('.obligations input.number').removeAttr('name').attr('disabled', true);
			html.find('.obligations .regulator').hide();
			// html.find('.price input.number').attr('disabled', true);
			// html.find('.obligations input.number').val('');
			html.find('.price label').text('Market price');
			html.find('.price .regulator').remove();
			html.find('.checkbox input[type=checkbox]').attr('checked', false);
			html.find('.checkbox span').text('Market');
			html.find('.fees span').hide();
			html.find('.fees input').val(Math.round10(object.volume * 0.0086, -2));
		}

		html.find('.volume input.number').val(object.volume);
		html.find('.symbol').val(context.parents('.event-content').attr('data-symbol').replace(/_mirror/, ''));

		if(context.parents('.event-content').hasClass('revers'))
			html.find('.mirror').val('1');
		else
			html.find('.mirror').val('0');

		if(globalData.basicMode){
			let fee = Math.round10(object.volume * 0.0086, -2);
			// let container = html.find('.switch');
			// container.css({paddingLeft: 0, textAlign: 'center'}).children().hide();
			// container.append('<strong class="profit">Profit: <span></span></strong>');
			html.find('.fees input').val(fee || '');
			html.find('.risk input').val(Math.round10(fee + sumVal, -2) || '');
			html.find('.profit input').val(Math.round10((1 - object.price) * object.volume, -2) || '');
		}

		return html;
	}

	/**
	 * скрывает и показывает информацию при отсутсвие ордеров в сайдбаре
	 */
	static showInfo () {
		if($('#order .default_orders').children().length > 1)
			$('#default_order_info').hide();
		else
			$('#default_order_info').show();
	}

	/**
	 * возвращает с вкладки your orders на trade slip
	 */
	static tabReturn() {
		let tab = $(".left_order .wrapper .tab"),
				tab_item = $(".left_order .tab_item");
		if (!(tab.eq(0).hasClass('active'))) {
			tab.removeClass("active").eq(0).addClass("active");
			tab_item.hide().eq(0).fadeIn(0);
			if($('.left_order .tab input.limit').prop('checked')) globalData.tradeOn = true;
			globalData.myOrdersOn = false;
		}
	}
}
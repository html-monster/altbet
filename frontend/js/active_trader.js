
function spreaderChangeVal(input, quantity){
	spreadVisability(null, true);
	var value, ii,
			ask = $('.active_trader .best_buy').parent().index(),
			bid = $('.active_trader .best_sell').parent().index(),
			limit = $('.active_trader table.limit'),
			tr= $('.active_trader table.limit tbody tr'),
			bestBuy = $('.active_trader table.limit td.best_buy'),
			bestSell = $('.active_trader table.limit td.best_sell');

	if(input.hasClass('spreader') || input.parent().hasClass('spread')){
		var orderContent = $('.order_content.spread');

		input.focus();
		if(quantity) input.val(quantity);
		input[0].selectionStart = input.val().length;
		value = +(input.val() * 100).toFixed(0);
		tr.find('.price_value').removeClass('active');
		if(bid == -1) bid = ask;
		if(ask == -1) ask = bid;
		if(ask == -1 && bid == -1) value= 0;
		if(value){
			for(ii = bid - 1; ii > ask; ii--){
				tr.eq(ii).find('.price_value').addClass('active');
			}
			for(ii = bid + 1; ii <= bid + value; ii++){
				tr.eq(ii).find('.price_value').addClass('active');
			}
			for(ii = ask - 1; ii >= ask - value; ii--){
				tr.eq(ii).find('.price_value').addClass('active');
			}
			bestBuy.addClass('active');
			bestSell.addClass('active');
		}

		if(orderContent.parents('tr').find('.ask').length){
			ask = (+orderContent.find('.price input').eq(0).val() - value / 100).toFixed(2);
			if(ask < 0.01) ask = 0.01;
			orderContent.find('.price input').eq(1).val(ask);
		}
		if(orderContent.parents('tr').find('.bid').length){
			bid = (+orderContent.find('.price input').eq(1).val() + value / 100).toFixed(2);
			if(bid > 0.99) ask = 0.99;
			orderContent.find('.price input').eq(0).val(bid);
		}
	}

	function spreadHighlight(context) {
		ii = context.parents('tr').index();
		$('.active_trader .limit td.price_value').removeClass('hovered');
		context.parents('tr').find('.price_value').addClass('hovered');
		if(context.hasClass('ask')){
			tr.eq(ii + value).find('.price_value').addClass('hovered');
		}
		if(context.hasClass('bid')){
			tr.eq(ii - value).find('.price_value').addClass('hovered');
		}
		if(context.hasClass('mid')){
			tr.eq(ii - value).find('.price_value').addClass('hovered');
			tr.eq(ii + value).find('.price_value').addClass('hovered');
		}
	}
	limit.on('mouseenter', 'td.price_value.active', function () {
		spreadHighlight($(this));
	});
	limit.on('mouseleave', 'td.price_value.active', function () {
		$('.active_trader .limit td.price_value').removeClass('hovered');
	});
	limit.on('mouseenter', '.confim_button', function (e) {
		e.stopPropagation();
		spreadHighlight($(this));
	});
	limit.on('mouseleave', '.confim_button', function (e) {
		e.stopPropagation();
		$('.active_trader .limit td.price_value').removeClass('hovered');
	});
	// limit.on('mouseenter', '.spread_confim', function (e) {
	// 	e.stopPropagation();
	// 	spreadHighlight($(this));
	// });
	// limit.on('mouseleave', '.spread_confim', function (e) {
	// 	e.stopPropagation();
	// 	$('.active_trader .limit td.price_value').removeClass('hovered');
	// });

}

function spreaderClean() {
	$('.active_trader table.limit tbody tr').find('.price_value').removeClass('active');
	$('.active_trader input.spreader').val('');
	$('.active_trader table.limit td.best_buy').removeClass('active');
	$('.active_trader table.limit td.best_sell').removeClass('active');
	$('.active_trader #order_content').remove();
}

function recaluculateSum(item){
	var order_content = $('.active_trader .order_content'),
			quantity = +item.text() || +item.val(),
			price = +order_content.find('.price input').val();

	order_content.find('.volume input').val(quantity);
	if(order_content.find('.sell-container').length)
		order_content.find('.obligations input').val(((1 - price) * quantity).toFixed(2));
	else
		order_content.find('.obligations input').val((price * quantity).toFixed(2));
}

function buttonActivation(current) {
	if(current.parents('.active_trader').length){
		var	html = '<div class="regulator" style="display: none;"><span class="plus" title="Press Arrow Up">+</span><span class="minus" title="Press Arrow Down">-</span></div>',
				input = $('.active_trader input.quantity'),
				quantity = current.hasClass('btn') ? current.text() : '',
				market_button = $('.active_trader .control tr:first-of-type .market_button'),
				limit_market_button = $('.active_trader .control tr:nth-last-of-type(2) .market_button');

		//quantityButton.removeClass('activated');
		if(current.parent().hasClass('quantity') || current.hasClass('quantity')){
			if(current.parent('.input').length && (current.val() == '' || current.val() == 0)){
				market_button.removeClass('active clickable');
				limit_market_button.removeClass('active clickable');
				$('.active_trader table.limit tbody td.size').removeClass('clickable');
				$('.active_trader .spread').find('button').removeClass('btn').attr('disabled', true);
				$('.active_trader input.spreader').attr('disabled', true).parent().find('.regulator').fadeOut(400).remove();
			}
			else{
				if(!(market_button.hasClass('active')))
					$('.active_trader input.spreader').removeAttr('disabled').parent().append(html).find('.regulator').fadeIn(400);
				limit_market_button.each(function () {
					if ($(this).find('.price').text() != '') {
						$(this).addClass('active clickable');
						market_button.eq($(this).index()).addClass('active clickable');
					}
					else{
						$(this).removeClass('active clickable');
						market_button.eq($(this).index()).removeClass('active clickable');
					}

				});
				$('.active_trader .spread').find('button').addClass('btn').removeAttr('disabled');
				if(!(current.parent('.input').length || current.parent('.regulator').length)){
					input.focus().val(quantity);
					input[0].selectionStart = input.val().length;
				}
				$('.active_trader table.limit tbody td.size').addClass('clickable');
			}
			recaluculateSum(current);
		}
		if(current.hasClass('spreader')) {
			spreaderChangeVal(current);
		}
		else if(current.parent().hasClass('spread')){
			input = $('.active_trader input.spreader');
			spreaderChangeVal(input, quantity);
		}
	}
}

function scrollTo(center) {
	var table = $('table.limit tbody tr'),
			indexBuy = table.find('.best_buy').parent().index(),
			indeSell = table.find('.best_sell').parent().index(),
			tbody = $('table.limit tbody');

	if(indexBuy == -1)
		indexBuy = indeSell;
	else if(indeSell == -1)
		indeSell = indexBuy;

	center = center ? 0 : (indeSell - indexBuy) / 2;

	tbody.animate({scrollTop: (indexBuy + center) * 20 - tbody.height() / 2}, 400);
}

//spread show/hide =============================================================================================================
function tdWidthChange(tdWidth) {

	$('table.limit').find('tr').each(function () {
		for (var ii = 0; ii < tdWidth.length; ii++) {
			$(this).find('td').eq(ii).width(tdWidth[ii] + 10)
		}
	});

	// в firefox отображение надо поправить
}

function spreadVisability(isButton, visibility) {
	if($('.active_trader table.limit .best_buy').length && $('.active_trader table.limit .best_sell').length){
		var tdWidth = [],
				table = $('table.limit'),
				tbody = $('.left_order table.limit tbody'),
				hide = tbody.find('.mid').parent().hasClass('hidden'),
				spread = tbody.find('.mid').parent(),
				hidden = tbody.find('.hidden'),
				visibleString = tbody.height() / tbody.find('tr').eq(0).height(),
				spreadSize = tbody.find('.best_sell ').parent().index() - tbody.find('.best_buy ').parent().index() - 1;
		isButton = isButton || false;

		for (var ii = 0; ii < table.find('th').length; ii++) {
			tdWidth.push(table.find('th').eq(ii).width());
		}

		$('#order_content').remove();

		if(!isButton)
			hidden.animate({height: 20}).attr('class', 'visible');

		if(spreadSize > visibleString - 4 && !isButton && visibility !== true){
			$('.active_trader .show_spread .visibility').text('Hide');
			setTimeout(function () {
				spread.attr('class', 'hidden').animate({height: 0}, 400);
				tdWidthChange(tdWidth);
				scrollTo(true);
				$('.active_trader .show_spread .visibility').text('Show');
				$('.active_trader .show_spread').addClass('active');
			}, 700);
		}
		else if(!isButton){
			$('.active_trader .show_spread .visibility').text('Hide');
			if(!(spreadSize > visibleString - 4)) $('.active_trader .show_spread').removeClass('active');
		}

		if(!hide && isButton || visibility === false) {
			if(tbody.find('.hidden').length)
				hidden.animate({height: 20}, 400).attr('class', 'visible');
			if(isButton) scrollTo(true);
			spread.attr('class', 'hidden').animate({height: 0}, 400);
			tdWidthChange(tdWidth);
			$('.active_trader .show_spread .visibility').text('Show');
		}
		else if(isButton || visibility === true){
			hidden.animate({height: 20}, 400);
			scrollTo();
			setTimeout(function () {
				hidden.attr('class', 'visible');
			}, 400);
			$('.active_trader .show_spread .visibility').text('Hide');
		}
	}
	else{
		$('.active_trader .show_spread').removeClass('active');
		$('.left_order table.limit tbody .hidden').animate({height: 20}).attr('class', 'visible');
	}

}

$(document).ready(function () {

	$('.left_order .tab label').click(function (e) {
		e.stopPropagation();
	});

	(function tradeOn() {
		var checkbox = $('.left_order .tab input.limit'),
				autoTrade = $('.left_order .tab input.auto'),
			  default_order = $('.left_order .default_orders'),
				active_trader = $('.left_order .active_trader'),
				buttons = $('#exchange .content_bet .event'),
				event_container = $('.content_bet'),
				titles = event_container.eq(0).find('.event-title a'),
				tab_content = $('.tab_content');

		if(checkbox.prop('checked')){
			var ii = 0;
			autoTrade.parent().fadeIn(200);
			default_order.fadeOut(200);
			active_trader.fadeIn(200);
			buttons.attr('disabled', true);
			event_container.eq(0).find('.event-content').eq(0).addClass('active');
			spreadVisability();

			event_container.addClass('clickable').eq(0).addClass('active');
			$('.active_trader .event_title .event_name').each(function () {
				$(this).text(titles.eq(ii++).text());
			});
			setTimeout(function () {
				tab_content.addClass('max');
			}, 400);
			setTimeout(function () {
				takeData($('.content_bet.active '));
			}, 400);
		}
		checkbox.change(function () {
			ii = 0;
			if($(this).prop('checked')){
				autoTrade.parent().fadeIn(200);
				default_order.fadeOut(200);
				setTimeout(function () {
					active_trader.fadeIn(200);
				}, 200);
				tbodyResize();
				buttons.attr('disabled', true);
				if(event_container.hasClass('active')){
					event_container.addClass('clickable');
				} else {
					event_container.addClass('clickable').eq(0).addClass('active');
					titles = $('.content_bet.active .event-title a');
					$('.active_trader .event_title .event_name').each(function () {
						$(this).text(titles.eq(ii++).text());
					});
				}
				tabReturn();
				setTimeout(function () {
					if($('.active_trader .best_buy').text() == '' && $('.active_trader .best_sell').text() == '')
						takeData($('.content_bet.active '));
				}, 400);
				tab_content.addClass('max');
			}
			else{
				autoTrade.parent().fadeOut(200);
				setTimeout(function () {
					default_order.fadeIn(200);
				}, 200);
				active_trader.fadeOut(200);
				buttons.removeAttr('disabled');
				event_container.removeClass('clickable');
				tab_content.removeClass('max');
			}
		});
		$('.left_order .active_trader a').click(function (e) {
			e.preventDefault();
		});
		function tbodyResize(){
			var windowHeight = window.innerHeight,
					footer = $('footer'),
					footerHeight = footer.height() + 30,
					tbody = $('.left_order table.limit tbody'),
					order = $('#order');

			order.css('overflow-y', 'hidden');
			setTimeout(function () {
				var orderSidebarHeight = windowHeight - ($('.left_order .tabs').height() + 45 + $('header').height()),
						actveTraderHeight = orderSidebarHeight - ($('.active_trader .event_title').height() + $('.active_trader .info').height() +
								$('.active_trader .control').height() + $('.active_trader .control.remote').height() + $('.active_trader .limit thead').height() + 10);

				if(footer.hasClass('active')){
					tbody.css('max-height', actveTraderHeight - footerHeight);
				} else {
					tbody.css('max-height', actveTraderHeight);
				}
			}, 200);
		}
	})();

	(function eventChange() {
		var checkbox = $('.left_order .tab input.limit'),
				event_container = $('.content_bet'),
				event_content = $('.event-content'),
				tabs = $('.active_trader .event_title .event_name');

		tabs.eq(0).addClass('active');
		event_container.click(function () {
			if (checkbox.prop('checked')) {
				var titles = $(this).find('.event-title a');

				tableLimitChangeData($(this), titles);
				tabs.removeClass('active').eq(0).addClass('active');
				$(this).find('.event-content').eq(0).addClass('active');

				takeData($(this));
				spreaderClean();
				buttonActivation($('.active_trader .control input.quantity'));
				spreadVisability();
			}
		});
		event_content.click(function (e) {
			if (checkbox.prop('checked')) {
				var titles = $(this).parents('.content_bet').find('.event-title a');

				e.stopPropagation();
				tableLimitChangeData($(this), titles);
				$(this).parents('.content_bet').addClass('active');
				tabs.removeClass('active').eq($(this).index()).addClass('active');

				takeData($(this));
				spreaderClean();
				buttonActivation($('.active_trader .control input.quantity'));
				spreadVisability();
			}
		});

		function tableLimitChangeData(current, title) {
			var ii = 0;

			event_container.removeClass('active');
			event_content.removeClass('active');
			current.addClass('active');
			tabs.each(function () {
				$(this).text(title.eq(ii++).text());
			});

		}
		tabs.click(function () {
			if (checkbox.prop('checked')) {
				event_content.removeClass('active');
				tabs.removeClass('active');
				$(this).addClass('active');
				takeData($('.content_bet.active .event-content').eq($(this).index()));
				spreaderClean();
			}
		});

	})();
	function takeData(currentItem) {
		var ii, priceSell = [], priceBuy = [], volumeSell = [], volumeBuy = [],
				bestSell, bestBuy, currentPrice,
				table = $('table.limit tbody tr'),
				join_bid = $('.join_bid a'),
				join_ask = $('.join_ask a'),
				className = 'ask';

		currentItem = currentItem.hasClass('content_bet') ? currentItem.find('.table').children('.event-content').eq(0) : currentItem;
		if(!(currentItem.hasClass('content_bet')))
				currentItem.addClass('active');

		for(ii = 0; ii < currentItem.find('.sell').find('button.event').length; ii++){
			priceSell.push(currentItem.find('.sell').find('button.event').eq(ii).find('.price').text());
			volumeSell.push(currentItem.find('.sell').find('button.event').eq(ii).find('.volume').text());
			bestSell = currentItem.find('.sell').find('button.event').eq(ii).find('.price').text();
		}
		for(ii = 0; ii < currentItem.find('.buy').find('button.event').length; ii++){
			priceBuy.push(currentItem.find('.buy').find('button.event').eq(ii).find('.price').text());
			volumeBuy.push(currentItem.find('.buy').find('button.event').eq(ii).find('.volume').text());
		}
		bestBuy = currentItem.find('.buy').find('button.event').eq(0).find('.price').text();

		if(priceSell.length)
			if(priceSell[0].search(/[0-9]+/i) == -1) bestSell = '';

		if(priceBuy.length)
			if(priceBuy[0].search(/[0-9]+/i) == -1) bestBuy = '';


		join_bid.find('.price').text(bestSell);
		join_ask.find('.price').text(bestBuy);

		table.find('.size').removeClass('best_sell best_buy').find('.value').text('');
		table.find('.my_size').find('.value').text('');// for development =============================================
		table.find('.price_value').removeClass('best_sell best_buy');
		table.each(function () {
			var current = $(this);
			currentPrice = $(this).find('.price_value').text();
			if(searchValue(priceSell, currentPrice) != -1){
				ii = searchValue(priceSell, currentPrice);
				$(this).find('.size_sell').addClass('animated fadeOut').find('span.value').text(volumeSell[ii]);
				if (randomInteger(0, 1)) $(this).find('.my_bids').addClass('animated fadeOut').find('span.value').text(randomInteger(1, +volumeSell[ii]));  // for development =============================================
				var context = $(this);
				setTimeout(function () {
					context.find('.size_sell').removeClass('animated fadeOut');
					context.find('.my_bids').removeClass('animated fadeOut'); // for development =============================================
				}, 1000);
				if(bestSell == currentPrice){
					$(this).find('.size_sell').addClass('best_sell');
					$(this).find('.price_value').addClass('best_sell');
				}
			}
			if(searchValue(priceBuy, currentPrice) != -1){
				ii = searchValue(priceBuy, currentPrice);
				$(this).find('.size_buy').addClass('animated fadeOut').find('span.value').text(volumeBuy[ii]);
				if (randomInteger(0, 1)) $(this).find('.my_offers').addClass('animated fadeOut').find('span.value').text(randomInteger(1, +volumeBuy[ii]));  // for development =============================================
				var context = $(this);
				setTimeout(function () {
					context.find('.size_buy').removeClass('animated fadeOut');
					context.find('.my_offers').removeClass('animated fadeOut'); // for development =============================================
				}, 1000);
				if(bestBuy == currentPrice){
					$(this).find('.size_buy').addClass('best_buy');
					$(this).find('.price_value').addClass('best_buy');
				}
			}

			;(function separation() {
				current = current.find('td.price_value');

				current.removeClass('ask bid mid');
				if(current.hasClass('best_sell')){
					className = 'bid';
				}
				current.addClass(className);
				if(current.hasClass('best_buy')){
					className = 'mid';
				}
			})();
		});


	  scrollTo();
	}

	(function addOrder() {
		var //quantityButton = $('.active_trader .control .button.quantity'),
				trader = $('.active_trader'),
				size = trader.width(),
				html;

		trader.find('.active_trader_footer').css('width', size);
		$(window).resize(function () {
			size = $('.active_trader').width();
			trader.find('#order_content').css('width', size);
			trader.find('.active_trader_footer').css('width', size);
		});

		$('.active_trader .control .button button').click(function () {
			buttonActivation($(this));
		});

		$('.active_trader table.control input').keyup(function () {
			buttonActivation($(this));
		});

		$('.active_trader .regulator span').click(function () {
			var input = $(this).parents('.input').find('.quantity');

			if(input.length){
				setTimeout(function () {
					recaluculateSum(input);
				}, 0);
			}
		});

		trader.on('click', '.confim.clickable', function(e){
			if(!($('.order label input.auto').prop('checked'))){
				addOrder($(this), e);
			}
		});

		trader.on('click', '.price_value.active', function(){
			if(!($('.order label input.auto').prop('checked')) || $(this).hasClass('mid'))
				addOrder($(this));

			// if($(this).hasClass('mid'))
			// 	addOrder($(this));

		});

		trader.on('click', '.confim_button', function (e) {
			e.stopPropagation();
			if(!($('.order label input.auto').prop('checked')))
				addOrder($(this));
		});
		
		$(document).click(function (e) {
			if($(e.target).closest('.spread_confim').length || $(e.target).closest('.order_content').length ||
					$(e.target).closest('.mid').length || $(e.target).closest('table.control').length)
					return;

			trader.find('.spread_confim').removeClass('active');
			setTimeout(function () {
				trader.find('.spread_confim').remove();
			}, 400);
		});


		function addOrder(context, event) {
			var position = context.position().top + 19,
					price = context.find('.price').text().replace(/[^0-9.]+/g, "") || context.parent().find('.price_value .value').text().replace(/[^0-9.]+/g, ""),
					quantity = +trader.find('input.quantity').val();

			if(event)
				event.stopPropagation();

			if(context.hasClass('size') || context.hasClass('price_value') || context.hasClass('confim_button')){
				if(context.parents('tr').index() > trader.find('.best_buy ').parents('tr').index()){
					position = (context.parents('tr').index() - trader.find('table.limit tbody tr.hidden').length) * 20 + 20;
				}
				else{
					position = context.parents('tr').index() * 20 + 20;
				}
			}


			if(context.hasClass('size sell'))
				html = '<div class="order_content" id="order_content" style="display: none; width: ' +
						size + 'px; position: absolute; top: ' + position  + 'px; left: 0;z-index: 10;"><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
						price + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
						quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><div class="obligations col-3" style="margin-left: 3px;"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" maxlength="8" value="' + ((1 - price) * quantity).toFixed(2) + '" disabled><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div></div></div><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><span class="btn delete col-3" style="margin-left: 3px;"></span><div class="col-3" style="margin-left: 3px;"></div></form></div><div class="buy-container"></div></div>';
			else if(context.hasClass('price_value') || context.hasClass('confim_button')){
				var price1, price2;
				if(context.hasClass('ask')){
					price2 = context.parents('tr').find('.price_value .value').text().replace(/[^0-9.]+/g, "");
					price1 = (+price2 - +$('.active_trader input.spreader').val()).toFixed(2);
				}
				else{
					price1 = context.parents('tr').find('.price_value .value').text().replace(/[^0-9.]+/g, "");
					price2 = (+price1 + +$('.active_trader input.spreader').val()).toFixed(2);
				}
				if(context.hasClass('mid')){
					html = '<div class="spread_confim"><span class="sell ask confim_button" onmousedown="return false" onselectstart="return false">Sell</span><span class="buy bid confim_button" onmousedown="return false" onselectstart="return false">Buy</span></div>';
				}
				else{
					html = '<div class="order_content spread" id="order_content" style="display: none; width: ' +
							size + 'px; position: absolute; top: ' + position  + 'px; left: 0;z-index: 10;"><div class="sell-buy-container"><form><div class="price sell col-3" style="margin-left: 3px;"><label>Selling price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
							price2 + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
							quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><input type="submit" class="btn success col-3" value="" style="margin-left: 3px;"><div class="price buy col-3" style="margin-left: 3px;"><label>Buying price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
							price1 + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
							quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><span class="btn delete col-3" style="margin-left: 3px;"></span></div></form></div>';
				}
			}
			else
				html = '<div class="order_content" id="order_content" style="display: none; width: ' +
						size + 'px; position: absolute; top: ' + position  + 'px; left: 0;z-index: 10;"><div class="buy-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
						price + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
						quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><div class="obligations col-3" style="margin-left: 3px;"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" maxlength="8" value="' + (price * quantity).toFixed(2) + '" disabled><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div></div></div><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><span class="btn delete col-3" style="margin-left: 3px;"></span><div class="col-3" style="margin-left: 3px;"></div></form></div><div class="buy-container"></div></div>';

			trader.find('#order_content').remove();

			if(trader.find('.spread_confim').length && !context.hasClass('confim_button')){
				trader.find('.spread_confim').removeClass('active');
				if(context.find('.spread_confim').length){
					trader.find('.spread_confim').remove();
				}
				else{
					var current = trader.find('.spread_confim');
					setTimeout(function () {
						current.remove();
					}, 400);
				}
			}

			if(context.hasClass('mid')){
				context.find('.container').append(html);
				setTimeout(function () {
					context.find('.spread_confim').addClass('active');
				}, 0)
			}
			else if(context.hasClass('size') || context.hasClass('price_value') || context.hasClass('confim_button'))
				context.parents('tr').find('td.my_bids').append(html);
			else
				context.parent().next().html('<td>' + html + '</td>');

			numericalVerification($('.order_content input'));
			$('.order_content').slideDown(400);
			// inputFocus = $('#order_content .volume input');
			// inputFocus.focus();
			// inputFocus[0].selectionStart = inputFocus.val().length;
		}

		$('.active_trader input.spreader').mouseup(function () {
			var value = $(this).val() || '0.';
			$(this).val(value);
			$(this).selectionStart = value.length;
		});

		$('.order label input.auto').change(function () {
			if($(this).prop('checked')){
				trader.find('#order_content').remove();
				trader.find('.spread_confim').remove();
			}
		});

		// trader.on('click', 'table.limit tbody', function () {
		// 	trader.find('#order_content').remove();
		// });
		//
		// trader.on('click', '#order_content', function(e){
		// 	e.stopPropagation();
		// });
	})();

	//spread show/hide =============================================================================================================
	// ;(function showHideSpread() {

		$('.active_trader .show_spread').click(function () {
			spreadVisability(true);
		});
	// })();

});


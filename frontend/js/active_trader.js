
function spreaderChangeVal(input, quantity){
	var value, ii,
			ask = $('.active_trader .best_buy').parent().index(),
			bid = $('.active_trader .best_sell').parent().index(),
			limit = $('.active_trader table.limit'),
			tr= $('.active_trader table.limit tbody tr'),
			bestBuy = $('.active_trader table.limit td.best_buy'),
			bestSell = $('.active_trader table.limit td.best_sell');

	if(input.hasClass('spreader') || input.parent().hasClass('spread')){

		input.focus();
		if(quantity) input.val(quantity);
		input[0].selectionStart = input.val().length;
		value = +input.val() * 100;
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
	}

	limit.on('mouseenter', 'td.price_value.active', function () {
		ii = $(this).parent().index();
		$('.active_trader .limit td.price_value').removeClass('hovered');
		$(this).addClass('hovered');
		if($(this).hasClass('ask')){
			tr.eq(ii + value).find('.price_value').addClass('hovered');
		}
		if($(this).hasClass('bid')){
			tr.eq(ii - value).find('.price_value').addClass('hovered');
		}
		if($(this).hasClass('mid')){
			tr.eq(ii - value).find('.price_value').addClass('hovered');
			tr.eq(ii + value).find('.price_value').addClass('hovered');
		}
	});
	limit.on('mouseleave', 'td.price_value.active', function () {
		$('.active_trader .limit td.price_value').removeClass('hovered');
	});

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
		table.find('.price_value').removeClass('best_sell best_buy');
		table.each(function () {
			var current = $(this);
			currentPrice = $(this).find('.price_value').text();
			if(searchValue(priceSell, currentPrice) != -1){
				ii = searchValue(priceSell, currentPrice);
				$(this).find('.size_sell span.value').text(volumeSell[ii]);
				if(bestSell == currentPrice){
					$(this).find('.size_sell').addClass('best_sell');
					$(this).find('.price_value').addClass('best_sell');
				}
			}
			if(searchValue(priceBuy, currentPrice) != -1){
				ii = searchValue(priceBuy, currentPrice);
				$(this).find('.size_buy span.value').text(volumeBuy[ii]);
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

		(function scrollTo() {
			var indexBuy = table.find('.best_buy').parent().index(),
					indeSell = table.find('.best_sell').parent().index(),
					tbody = $('table.limit tbody');
			if(indexBuy == -1)
					indexBuy = indeSell;
			else if(indeSell == -1)
					indeSell = indexBuy;
			tbody.animate({scrollTop: (indexBuy + (indeSell - indexBuy) / 2) * 20 - tbody.height() / 2}, 400);
		})();
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
			if(!($('.order label input.auto').prop('checked')))
				addOrder($(this));

			if($(this).hasClass('mid'))
				addOrder($(this));

		});

		function addOrder(context, event) {
			var position = context.position().top + 19,
					price = context.find('.price').text().replace(/[^0-9.]+/g, "") || context.parent().find('.price_value .value').text().replace(/[^0-9.]+/g, ""),
					quantity = +trader.find('input.quantity').val();

			if(event)
				event.stopPropagation();

			if(context.hasClass('size') || context.hasClass('price_value'))
				position = context.parent().index() * 20 + 20;

			if(context.hasClass('sell'))
				html = '<div class="order_content" id="order_content" style="display: none; width: ' +
						size + 'px; position: absolute; top: ' + position  + 'px; left: 0;z-index: 10;"><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
						price + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
						quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><div class="obligations col-3" style="margin-left: 3px;"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" maxlength="8" value="' + ((1 - price) * quantity).toFixed(2) + '" disabled><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div></div></div><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><span class="btn delete col-3" style="margin-left: 3px;"></span><div class="col-3" style="margin-left: 3px;"></div></form></div><div class="buy-container"></div></div>';
			else if(context.hasClass('price_value')){
				var price1, price2;
				if(context.hasClass('ask')){
					price2 = context.find('.value').text().replace(/[^0-9.]+/g, "");
					price1 = (+price2 - +$('.active_trader input.spreader').val()).toFixed(2);
				}
				else{
					price1 = context.find('.value').text().replace(/[^0-9.]+/g, "");
					price2 = (+price1 + +$('.active_trader input.spreader').val()).toFixed(2);
				}
				if(context.hasClass('mid')){
					html = '<div class="order_content" id="order_content" style="display: none; width: ' +
							size + 'px; position: absolute; top: ' + position  + 'px; left: 0;z-index: 10;"><div class="sell-buy-container"><form><div class="price sell col-3" style="margin-left: 3px;"><label>Selling price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
							price2 + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
							quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><input type="submit" class="btn success col-3" value="" style="margin-left: 3px;"><div class="price buy col-3" style="margin-left: 3px;"><label>Buying price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
							price1 + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
							quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><span class="btn close col-3" style="margin-left: 3px;"></span></div></form><div class="sell-buy-container"><form><div class="price sell col-3" style="margin-left: 3px;"><label>Selling price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
							price1 + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
							quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><input type="submit" class="btn success col-3" value="" style="margin-left: 3px;"><div class="price buy col-3" style="margin-left: 3px;"><label>Buying price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
							(price1 - +$('.active_trader input.spreader').val()).toFixed(2) + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
							quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><span class="btn close col-3" style="margin-left: 3px;"></span></div></form></div></div>';
				}
				else{
					html = '<div class="order_content" id="order_content" style="display: none; width: ' +
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

			if(trader.find('#order_content').length)
					trader.find('#order_content').remove();

			if(context.hasClass('size') || context.hasClass('price_value'))
				context.parent().find('td.my_bids').append(html);
			// else if(context.hasClass('price_value'))
			// 	context.append(html);
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
			if($(this).prop('checked'))
				trader.find('#order_content').remove();
		});

		// trader.on('click', 'table.limit tbody', function () {
		// 	trader.find('#order_content').remove();
		// });
		//
		// trader.on('click', '#order_content', function(e){
		// 	e.stopPropagation();
		// });
	})();
});

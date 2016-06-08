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
						actveTraderHeight = orderSidebarHeight - ($('.active_trader .event_title').height() +
								$('.active_trader .control').height() + $('.active_trader .limit thead').height() + 10);

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
				autoTrade = $('.left_order .tab input.auto'),
				event_container = $('.content_bet'),
				event_content = $('.event-content'),
				tabs = $('.active_trader .event_title .event_name');

		tabs.eq(0).addClass('active');
		autoTrade.parent().fadeIn(200);
		event_container.click(function () {
			if (checkbox.prop('checked')) {
				var titles = $(this).find('.event-title a'),
						ii = 0;

				event_container.removeClass('active');
				tabs.removeClass('active').eq(0).addClass('active');
				$(this).addClass('active');
				tabs.each(function () {
					$(this).text(titles.eq(ii++).text());
				});

				takeData($(this));
			}
		});
		event_content.click(function (e) {
			if (checkbox.prop('checked')) {
				var titles = $(this).parents('.content_bet').find('.event-title a'),
						ii = 0;

				e.stopPropagation();
				event_container.removeClass('active');
				$(this).parents('.content_bet').addClass('active');
				tabs.each(function () {
					$(this).text(titles.eq(ii++).text());
				});
				tabs.removeClass('active').eq($(this).index()).addClass('active');

				takeData($(this));
			}
		});

		tabs.click(function () {
			if (checkbox.prop('checked')) {
				tabs.removeClass('active');
				$(this).addClass('active');
				takeData($('.content_bet.active .event-content').eq($(this).index()));
			}
		});
	})();
	function takeData(currentItem) {
		var ii, priceSell = [], priceBuy = [], volumeSell = [], volumeBuy = [],
				bestSell, bestBuy, currentPrice,
				table = $('table.limit tbody tr'),
				join_bid = $('.join_bid a'),
				join_ask = $('.join_ask a');
		currentItem = currentItem.hasClass('content_bet') ? currentItem.find('.table').children('.event-content').eq(0) : currentItem;

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

		join_bid.find('.price').text(bestSell);
		join_ask.find('.price').text(bestBuy);

		table.find('.size').removeClass('best_sell best_buy').find('.value').text('');
		table.find('.price_value').removeClass('best_sell best_buy');
		table.each(function () {
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
		});

		(function scrollTo() {
			var indeSell = table.find('.best_sell').parent().index(),
					indexBuy = table.find('.best_buy').parent().index(),
					tbody = $('table.limit tbody');
			tbody.animate({scrollTop: (indexBuy + (indeSell - indexBuy) / 2) * 20 - tbody.height() / 2}, 400);
		})();
	}

	(function addOrder() {
		var quantityButton = $('.active_trader .control .button.quantity'),
				trader = $('.active_trader'),
				size = trader.width(),
				html;
		$(window).resize(function () {
			size = $('.active_trader').width();
			trader.find('#order_content').css('width', size);
		});
		$('.active_trader .control .button').click(function () {
			var quantity = $(this).find('a').text();

			if($(this).hasClass('quantity')){
				quantityButton.removeClass('activated');
				$(this).toggleClass('activated');

				$('.active_trader .market_button').addClass('active clickable');
				$('.active_trader input.quantity').val(quantity);
				$('.active_trader table.limit tbody td.size').addClass('clickable');
				recaluculateSum($(this));
			}
		});
		$('.active_trader input.quantity').keyup(function () {
			quantityButton.removeClass('activated');
			if($(this).val() == ''){
				$('.active_trader .market_button').removeClass('active clickable');
				$('.active_trader table.limit tbody td.size').removeClass('clickable');
			}
			else{
				$('.active_trader .market_button').addClass('active clickable');
				$('.active_trader table.limit tbody td.size').addClass('clickable');
			}
			recaluculateSum($(this));
		});
		trader.on('click', '.confim.clickable', function(){
			if(!($('.order label input.auto').prop('checked'))){
				var position = $(this).position().top + 19,
						price = $(this).find('.price').text().replace(/[^0-9.]+/g, "") || $(this).parent().find('.price_value .value').text().replace(/[^0-9.]+/g, ""),
						quantity = +trader.find('input.quantity').val();

				if($(this).hasClass('size'))
						position = $(this).parent().index() * 20 + 20;
				if($(this).hasClass('sell'))
						html = '<div class="order_content" id="order_content" style="display: none; width: ' +
								size + 'px; position: absolute; top: ' + position  + 'px; left: 0;z-index: 10;"><div class="sell-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
								price + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
								quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><div class="obligations col-3" style="margin-left: 3px;"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" maxlength="8" value="' + ((1 - price) * quantity).toFixed(2) + '" disabled><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div></div></div><input type="submit" class="btn sell col-3" value="SELL" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button><div class="col-3" style="margin-left: 3px;"></div></form></div><div class="buy-container"></div></div>';
				else
						html = '<div class="order_content" id="order_content" style="display: none; width: ' +
								size + 'px; position: absolute; top: ' + position  + 'px; left: 0;z-index: 10;"><div class="buy-container"><form><div class="price col-3" style="margin-left: 3px;"><label>Price:</label><div class="input"><input type="text" class="number" placeholder="0.33" maxlength="4" value="' +
								price + '" disabled><div class="warning" style="display: none;"><p>Допустимое значение от 0.01 до 0.99</p></div></div></div><div class="volume col-3" style="margin-left: 3px;"><label>Quantity:</label><div class="input"><input type="text" class="number" placeholder="123" maxlength="8" value="' +
								quantity + '" disabled><div class="warning" style="display: none;"><p>Допустимое только целые значения больше 0</p></div></div></div><div class="obligations col-3" style="margin-left: 3px;"><label>Sum:</label><div class="input"><input type="text" class="number" placeholder="40.59" maxlength="8" value="' + (price * quantity).toFixed(2) + '" disabled><div class="warning" style="display: none;"><p>Минимально допустимое значение 0.01</p></div></div></div><input type="submit" class="btn buy col-3" value="BUY" style="text-transform: uppercase; margin-left: 3px;"><button class="btn delete col-3" style="margin-left: 3px;"></button><div class="col-3" style="margin-left: 3px;"></div></form></div><div class="buy-container"></div></div>';

				if(trader.find('#order_content').length)
						trader.find('#order_content').remove();
				if($(this).hasClass('size'))
						$(this).parent().find('td.price_value').append(html);
				else
						$(this).parent().next().html('<td>' + html + '</td>');

				numericalVerification($('.order_content input'));
				$('.order_content').slideDown(400);
				// inputFocus = $('#order_content .volume input');
				// inputFocus.focus();
				// inputFocus[0].selectionStart = inputFocus.val().length;
			}
		});
		function recaluculateSum(item){
			var order_content = $('.active_trader .order_content'),
					quantity = +item.children().text() || +item.val(),
					price = +order_content.find('.price input').val();

			order_content.find('.volume input').val(quantity);
			if(order_content.find('.sell-container').length)
				order_content.find('.obligations input').val(((1 - price) * quantity).toFixed(2));
			else
				order_content.find('.obligations input').val((price * quantity).toFixed(2));
		}

		$('.order label input.auto').change(function () {
			if($(this).prop('checked'))
				trader.find('#order_content').remove();
		});

		// trader.on('click', '#order_content', function(e){
		// 	e.stopPropagation();
		// });
	})();
});

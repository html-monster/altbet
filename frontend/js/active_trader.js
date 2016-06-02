$(document).ready(function () {
	$('.left_order .tab label').click(function (e) {
		e.stopPropagation();
	});
	(function tradeOn() {
		var checkbox = $('.left_order .tab input'),
			  default_order = $('.left_order .default_orders'),
				active_trader = $('.left_order .active_trader'),
				buttons = $('#exchange .content_bet .event'),
				event_container = $('.content_bet'),
				titles = event_container.eq(0).find('.event-title a'),
				tab_content = $('.tab_content');

		if(checkbox.prop('checked')){
			var ii = 0;
			default_order.fadeOut(200);
			active_trader.fadeIn(200);
			buttons.attr('disabled', true);

			event_container.addClass('clickable').eq(0).addClass('active');
			$('.active_trader .event_title .event_name').each(function () {
				$(this).text(titles.eq(ii++).text());
			});
			setTimeout(function () {
				tab_content.addClass('max');
			}, 400)
		}
		checkbox.change(function () {
			if($(this).prop('checked')){
				default_order.fadeOut(200);
				setTimeout(function () {
					active_trader.fadeIn(200);
				}, 200);
				buttons.attr('disabled', true);
				event_container.addClass('clickable');
				tabReturn();
			}
			else{
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
	})();

	(function eventChange() {
		var checkbox = $('.left_order .tab input'),
				event_container = $('.content_bet'),
				event_content = $('.event-content'),
				tabs = $('.active_trader .event_title .event_name');

		if(checkbox.prop('checked')){
			tabs.eq(0).addClass('active');
			event_container.click(function () {
				if(checkbox.prop('checked')){
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
				if(checkbox.prop('checked')){
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
				if(checkbox.prop('checked')){
					tabs.removeClass('active');
					$(this).addClass('active');
				}
			});

			function takeData(currentItem) {
				var ii, priceSell = [], priceBuy = [], volumeSell = [], volumeBuy = [],
						bestSell, bestBuy, currentPrice,
						table = $('table.limit tbody tr');
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
				table.find('.size').removeClass('best_sell best_buy').text('');
				table.find('.price').removeClass('best_sell best_buy');
				table.each(function () {
					currentPrice = $(this).find('.price').text();
					if(searchValue(priceSell, currentPrice) != -1){
						ii = searchValue(priceSell, currentPrice);
							$(this).find('.size_sell').text(volumeSell[ii]);
						if(bestSell == currentPrice){
							$(this).find('.size_sell').addClass('best_sell');
							$(this).find('.price').addClass('best_sell');
						}
					}
					if(searchValue(priceBuy, currentPrice) != -1){
						ii = searchValue(priceBuy, currentPrice);
						$(this).find('.size_buy').text(volumeBuy[ii]);
						if(bestBuy == currentPrice){
							$(this).find('.size_buy').addClass('best_buy');
							$(this).find('.price').addClass('best_buy');
						}
					}
				});

				(function scrollTo() {
					var indeSell = table.find('.best_sell').parent().index(),
							indexBuy = table.find('.best_buy').parent().index();
					$('table.limit tbody').animate({scrollTop: (indexBuy + (indeSell - indexBuy) / 2) * 19 - $('table.limit tbody').height() / 2}, 400);
				})();
			}
		}
	})();

});

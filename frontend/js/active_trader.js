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
				event_container = $('.content_bet');

		if(checkbox.prop('checked')){
			event_container.click(function () {
				var titles = $(this).find('.event-title a'),
						select = $(".left_order select");
						ii = 0;

				event_container.removeClass('active');
				$(this).addClass('active');
				$('.active_trader .event_title .event_name').each(function () {
					$(this).text(titles.eq(ii++).text());
				});
			});
		}
	})();

});

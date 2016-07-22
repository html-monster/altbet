class footerClass{
	constructor(){
		var windowHeight = window.innerHeight,
				windowWidth = window.innerWidth,
				orderSidebarHeight = windowHeight - ($('.left_order .tabs').height() + 45 + $('header').height()),
				actveTraderHeight,
				footer = $('footer'),
				footerHeight = footer.height() + 30,
				scroll = orderSidebarHeight,
				orderContent = $('#order'),
				currentOrders = $('#current-orders'),
				tbody = $('.left_order table.limit tbody'),
				tabContent = $('.left_order .tab_content'),
				active_trader_footer = $('.active_trader_footer');

		$('footer .hide_show').click(function () {
			footer.toggleClass('active');
			if (footer.hasClass('active') ){
				scroll = orderSidebarHeight - footerHeight;
				$('body > .wrapper').css('padding-bottom', footerHeight);
				orderContent.css('max-height', scroll);
				currentOrders.css('max-height', scroll);
				tbody.css('max-height', actveTraderHeight - footerHeight);
				tabContent.removeClass('footer_active');
				active_trader_footer.css('bottom', 128);
			}
			else {
				scroll = orderSidebarHeight ;
				$('body > .wrapper').css('padding-bottom', 0);
				orderContent.css('max-height', scroll);
				currentOrders.css('max-height', scroll);
				tbody.css('max-height', actveTraderHeight);
				tabContent.addClass('footer_active');
				active_trader_footer.css('bottom', 2);
			}
		});
		setTimeout(function () {
			actveTraderHeight = orderSidebarHeight - ($('.active_trader .event_title').height() + $('.active_trader .info').height() +
					$('.active_trader .control').height() + $('.active_trader .control.remote').height() + $('.active_trader .limit thead').height() + 10);
			tbody.css('max-height', actveTraderHeight);
		} , 0);
		orderContent.css('max-height', scroll);
		currentOrders.css('max-height', scroll);
		tabContent.addClass('footer_active');

		$(window).resize(function () {
			windowWidth = window.innerWidth,
					orderSidebarHeight = windowHeight - ($('.left_order .tabs').height() + 45 + $('header').height()),
					actveTraderHeight = orderSidebarHeight - ($('.active_trader .event_title').height() + $('.active_trader .info').height() +
							$('.active_trader .control').height() + $('.active_trader .control.remote').height() + $('.active_trader .limit thead').height() + 10);
			if(windowWidth > 1200){
				windowHeight = window.innerHeight;
				tbody.css('max-height', actveTraderHeight);
			}
		});
	}
}
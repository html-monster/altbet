class footerClass{
	constructor(){
		var windowHeight = window.innerHeight,
				windowWidth = window.innerWidth,
				orderSidebarHeight = windowHeight - ($('.left_order .tabs').outerHeight(true) + $('header').outerHeight(true)),
				// actveTraderHeight = orderSidebarHeight - ($('.active_trader .event_title')[0].offsetHeight + $('.active_trader .info').outerHeight() +
				// 		$('.active_trader .control').eq(0).outerHeight() + $('.active_trader .control').eq(1).outerHeight() +
				// 		$('.active_trader .control.remote').outerHeight() + $('.active_trader .limit thead').outerHeight() + 12),
				footer = $('.footer'),
				footerHeight = footer.outerHeight(),
				scroll = orderSidebarHeight,
				orderContent = $('#order'),
				currentOrders = $('#current-orders'),
				tbody = $('.left_order table.limit tbody'),
				tabContent = $('.left_order .tab_content'),
				active_trader_footer = $('.active_trader_footer');

		$('footer .hide_show').click(function () {
			footer.toggleClass('active');
			// console.log(actveTraderHeight);
			if (footer.hasClass('active') ){
				scroll = orderSidebarHeight - footerHeight;
				$('body > .wrapper').css('padding-bottom', footerHeight);
				orderContent.css('maxHeight', scroll);
				currentOrders.css('maxHeight', scroll);
				// tbody.css('height', actveTraderHeight - footerHeight);
				activeTraderClass.tbodyResize(true);
				tabContent.removeClass('footer_active');
				active_trader_footer.css('bottom', footerHeight + 2);
			}
			else {
				scroll = orderSidebarHeight ;
				$('body > .wrapper').css('padding-bottom', 0);
				orderContent.css('maxHeight', scroll);
				currentOrders.css('maxHeight', scroll);
				activeTraderClass.tbodyResize(true);
				// tbody.css('height', actveTraderHeight);
				tabContent.addClass('footer_active');
				active_trader_footer.css('bottom', 2);
			}
		});
		// setTimeout(function () {
		// 	actveTraderHeight = orderSidebarHeight - ($('.active_trader .event_title')[0].offsetHeight + $('.active_trader .info').outerHeight() +
		// 			$('.active_trader .control').eq(0).outerHeight() + $('.active_trader .control').eq(1).outerHeight() +
		// 			$('.active_trader .control.remote').outerHeight() + $('.active_trader .limit thead').height() + 12);
			// tbody.css('max-height', actveTraderHeight);
		// } , 0);
		orderContent.css('maxHeight', scroll);
		currentOrders.css('maxHeight', scroll);
		tabContent.addClass('footer_active');

		$(window).resize(function () {
			// windowWidth = window.innerWidth;
			// orderSidebarHeight = windowHeight - ($('.left_order .tabs').outerHeight(true) + $('header').outerHeight(true));
			// actveTraderHeight = orderSidebarHeight - ($('.active_trader .event_title')[0].offsetHeight + $('.active_trader .info').outerHeight() +
			// 		$('.active_trader .control').eq(0).outerHeight() + $('.active_trader .control').eq(1).outerHeight() +
			// 		$('.active_trader .control.remote').outerHeight() + $('.active_trader .limit thead').outerHeight() + 12);
			if(windowWidth > 1200){
				windowHeight = window.innerHeight;
				// tbody.css('max-height', actveTraderHeight);
				activeTraderClass.tbodyResize();
			}
		});
	}
}
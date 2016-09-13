class myPosClass{
	constructor(){
		let posContainer = $('.my_position_container'),
				openOrders = $('.open_orders'),
				currentOrders = $('#current-orders'),
				tab = $('.left_order .tab');

		orderClass.addOrder(posContainer, '.btn');

		function moveTo(context) {
			let id = '#' + context.parents('tr').attr('id') + '_order',
					scrollPos = $(id)[0].offsetTop;

			currentOrders.find('.form-container').slideUp(200);
			currentOrders.find('.pop_up').fadeOut();

			if(tab.eq(0).hasClass('active')){
				$('#order').hide();
				tab.removeClass('active');
				tab.eq(1).addClass('active');
				currentOrders.fadeIn();
				if(!(context.hasClass('show'))){
					setTimeout(function () {
						scrollPos = $(id)[0].offsetTop;
						currentOrders.animate({scrollTop: scrollPos} , 200);
					}, 450);
				}
				else{
					setTimeout(function () {
						currentOrders.animate({scrollTop: 0} , 200);
					}, 450);
				}
			}
			else if(!(context.hasClass('show')))
				currentOrders.animate({scrollTop: scrollPos} , 200);
			else
				currentOrders.animate({scrollTop: 0} , 200);

			return id;
		}

		openOrders.on('click', '.edit', function () {
			let id = moveTo($(this));

			setTimeout(function () {
				$(id).find('.form-container').slideToggle(200);
			}, 300);
		});
		openOrders.on('click', '.delete', function () {
			let id = moveTo($(this));

			setTimeout(function () {
				$(id).find('.pop_up').fadeIn();
			}, 300);
		});
		openOrders.on('click', '.show', function () {
			let id = moveTo($(this));

			setTimeout(function () {
				let element  = $(id).parents('.order_content').detach();

				element.hide();
				currentOrders.prepend(element);
				element.slideDown(200);
			}, 500);
		});
	}
}
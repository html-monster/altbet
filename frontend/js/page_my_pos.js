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
				currentOrders.fadeIn();
				setTimeout(function () {
					scrollPos = $(id)[0].offsetTop;
					currentOrders.animate({scrollTop: scrollPos} , 200);
				}, 450);
			}
			else
				currentOrders.animate({scrollTop: scrollPos} , 200);

			return id;
		}

		openOrders.on('click', '.edit', function () {
			let id = moveTo($(this));
			setTimeout(function () {
				$(id).focus().find('.form-container').slideToggle(200);
			}, 300);
		});
		openOrders.on('click', '.delete', function () {
			let id = moveTo($(this));
			setTimeout(function () {
				$(id).focus().find('.pop_up').fadeIn();
			}, 300);
		});
		// posContainer.on('click', '.btn', function () {
		// 	let html, data = {}, order = [], currentID;
		//
		// 	currentID = $(this).parents('.event-content').attr('id');
		// 	order.push(currentID, data.title);
		//
		// 	data.title = $(this).parents('tr').find('.title').text();
		// 	data.price = '0.';
		//
		// 	id.push(order);
		//
		// 	if(defaultMethods.searchValue(id, $(this).parents('.event-content').attr('id')) == -1){
		// 		let inputFocus = $('#' + id[defaultMethods.searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .price input');
		// 		if($(this).hasClass('sell')){
		// 			html = orderClass.createOrderForm('sell', 'full', true, $(this), data);
		// 		}
		// 		else{
		// 			html = orderClass.createOrderForm('buy', 'full', true, $(this) , data);
		// 		}
		// 		$('#order .default_orders').append(html);
		// 		$('.order_content').fadeIn(400);
		//
		// 	}
		//
		// 	orderClass.showInfo();
		// });
	}
}
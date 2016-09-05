class orderClass{
	constructor(){
		var id = [], limit = 0, self = this;

		orderClass.showInfo();

		// sidebar height and current order ==================================================================================
		self.orderSize = function () {
			// numericalVerification($('.order_content input'));
			var windowHeight = window.innerHeight,
					windowWidth = window.innerWidth,
					substructionHeight = $('.left_order .tabs').height() + 45 + $('header').height(),
					orderSidebarHeight = windowHeight - substructionHeight,
					orderContent = $('#order'),
					currentOrders = $('#current-orders'),
					tab_content = $('.tab_content'),
					checkbox = $('.left_order .tab input[type=checkbox');

			$(".left_order .wrapper .tab").click(function () {
				var height;

				if($(this).attr('data-log-out')) return false;

				$(".left_order .wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
				$(".left_order .tab_item").hide().eq($(this).index()).show();
				if($(this).index() == 1){
					height = currentOrders.height();
					if(height + 7 > windowHeight - substructionHeight){
						tab_content.addClass('max');
					}
					else{
						tab_content.removeClass('max');
					}
				}
				else{
					height = orderContent.height();
					if(height + 7 > windowHeight - substructionHeight){
						tab_content.addClass('max');
					}
					else{
						tab_content.removeClass('max');
					}
				}
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

			orderContent.bind('DOMSubtreeModified', function(event) {
				if(checkbox.prop('checked')){
					orderContent.css('overflow-y', 'hidden');
				}
				else{
					if(orderContent[0].clientHeight + 3  > (orderSidebarHeight)){
						orderContent.css('overflow-y', 'auto');
						tab_content.addClass('max');
					}
					else{
						orderContent.css('overflow-y', 'inherit');
						tab_content.removeClass('max');
					}
				}
			});
		}();

		// order validation ==================================================================================================
		self.formValidation = function() {
			var order = $('.order');

			order.on('submit','form', function () {

				if($(this).find('[data-log-out]').attr('data-log-out')) return false;

				var price = +$(this).find('.price input').val(),
						volume = +$(this).find('.volume input').val(),
						sum = +$(this).find('.obligations input').val(),
						checkboxProp = $(this).find('input[type="checkbox"]').length ? $(this).find('input[type="checkbox"]').prop('checked') : 1;

				if($('header .log_out').length){
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
				var code = e.which ||e.charCode || e.keyCode;
				if($(this).parents('.price').length){
					if($(this)[0].selectionStart == 2){
						if(code == 37 || code == 8){
							return false;
						}
					}
				}
			});

			order.on('mouseup', 'input.number', function () {
				if($(this).parents('.price').length){
					if($(this).val().length >= 2){
						$(this)[0].selectionStart = $(this).val().length;
					}
				}
			});

			order.on('keypress', 'input.number', function (e) {
				e = e || window.e;
				var code = e.which ||e.charCode || e.keyCode,
						message = $(this).next('.warning');

				if($(this).parents('.price').length || $(this).parents('.input').find('.spreader').length){
					if(code	 < 46 || code	 > 57 || code	 == 47){
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
					if(code	 < 46 || code	 > 57 || code	 == 47 || code	 == 46){
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
					var val = $(this).val().split('.');

					if(code	 < 46 || code	 > 57 || code	 == 47){
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

		// new order =========================================================================================================
		self.addOrder = function () {
			$('#exchange').on('click', 'button.event', function () {
				var html, price = 0, volume = 0, buySum = 0, sellSum = 0, title, currentID, inputFocus, order = [], self = $(this);
				price = $(this).find('.price').text().replace(/[^0-9.]+/g, "") || '0.';
				title = $(this).parents('.event-content').find('.event-title .title').text();
				currentID = $(this).parents('.event-content').attr('id');
				order.push(currentID, title);

				if(limit || $(this).hasClass('empty')){
					volume = $(this).find('.volume').text();
					buySum = (!(isNaN(price)) && !(isNaN(volume))) ? (price * volume).toFixed(2) : "";
					sellSum = (!(isNaN(price)) && !(isNaN(volume))) ? ((1 - price) * volume).toFixed(2) : "";
				}
				else{
					var ii = $(this).index(),
							items = $(this).parent().children(),
							priceMarket;
					if($(this).parent('.sell').length){
						sellSum = 0;
						for(ii; ii < items.length; ii++){
							volume += +$(this).parent().find('.event').eq(ii).find('.volume').text();
							sellSum +=  (1 - +$(this).parent().find('.event').eq(ii).find('.price').text().replace(/[^0-9.]+/g, "")) * +$(this).parent().find('.event').eq(ii).find('.volume').text();
						}
						sellSum = sellSum.toFixed(2);
						priceMarket = items.eq(items.length - 1).find('.price').text().replace(/[^0-9.]+/g, "");
					}
					else{
						buySum = 0;
						for(ii; ii > -1; ii--){
							volume += +$(this).parent().find('.event').eq(ii).find('.volume').text();
							buySum +=  +$(this).parent().find('.event').eq(ii).find('.price').text().replace(/[^0-9.]+/g, "") * +$(this).parent().find('.event').eq(ii).find('.volume').text();
						}
						buySum = buySum.toFixed(2);
						priceMarket = items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
					}
				}

				function createOrderForm(orderDirection, modification, limit) {
					html = $('.order_content.new').clone();
					html.removeClass('new');
					if(modification == 'full'){
						html.attr('id', id[defaultMethods.searchValue(id, self.parents('.event-content').attr('id'))][0] + '__order').css({display: 'none'});
						html.find('h3').text(title);
					}
					else
						html = html.find('form').css({display: 'none'});

					if (orderDirection == 'sell') {
						// html.find('.obligations input.number').val(sellSum);
						html.find('.side').val('Sell');
					}
					else {
						if(modification == 'full'){
							html.find('.buy-container').html(html.find('.sell-container').html());
							html.find('.sell-container').html('');
						}
						html.find('input[type=submit]').toggleClass('sell buy').val('buy');
						// html.find('.obligations input.number').val(buySum);
						html.find('.side').val('Buy');
					}

					if(limit) {
						html.find('.price input.number').val(price);
						html.find('.checkbox span').text('Limit');
					}
					else {
						html.find('.price input.number').attr('disabled', true).removeAttr('name').val(priceMarket);
						html.find('.obligations input.number').removeAttr('name').attr('disabled', true);
						html.find('.obligations .regulator').hide();
						// html.find('.price input.number').attr('disabled', true);
						// html.find('.obligations input.number').val('');
						html.find('.price label').text('Market price');
						html.find('.price .regulator').remove();
						html.find('.checkbox input[type=checkbox]').attr('checked', false);
						html.find('.checkbox span').text('Market');
					}

					html.find('.volume input.number').val(volume);
					html.find('.symbol').val(self.parents('.content_bet').find('.symbol_name').text());
					if(self.parents('.event-content').hasClass('revers'))
						html.find('.mirror').val('1');
					else
						html.find('.mirror').val('0');
				}

				if (defaultMethods.searchValue(id, $(this).parents('.event-content').attr('id')) == -1) {
					id.push(order);
					if (($(this).parents().hasClass('sell'))) {

						if(limit || $(this).hasClass('empty'))
							createOrderForm('sell', 'full', true);
						else
							createOrderForm('sell', 'full', false);
					}
					else{
						if(limit || $(this).hasClass('empty'))
							createOrderForm('buy', 'full', true);
						else
							createOrderForm('buy', 'full', false);
					}
					$('#order .default_orders').append(html);
					$('.order_content').fadeIn(400);
					if(limit || $(this).hasClass('empty'))
						inputFocus = $('#' + id[defaultMethods.searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .price input');
					else
						inputFocus = $('#' + id[defaultMethods.searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .volume input');

					inputFocus.focus();
					inputFocus[0].selectionStart = inputFocus.val().length;
				}
				else {
					var container;
					if (($(this).parents().hasClass('sell'))) {
						container = $('#' + id[defaultMethods.searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .sell-container');
						if(limit || $(this).hasClass('empty'))
							createOrderForm('sell', null, true);
						else
							createOrderForm('sell', null, false);
					}
					else {
						container = $('#' + id[defaultMethods.searchValue(id, $(this).parents('.event-content').attr('id'))][0] + '__order .buy-container');
						if(limit || $(this).hasClass('empty'))
							createOrderForm('buy', null, true);
						else
							createOrderForm('buy', null, false);
					}
					container.html(html);
					$('.order_content form').fadeIn(400);
					if(limit || $(this).hasClass('empty')){
						inputFocus = container.find('.price input');
					}
					else{
						inputFocus = container.find('.volume input');
					}
					inputFocus.focus();
					inputFocus[0].selectionStart = inputFocus.val().length;
				}

				orderClass.tabReturn();
				orderClass.showInfo();
			});
		}();

		//order edit =======================================================================================================
		self.orderEdit = function () {
			var container = $('.left_order'),
					checkboxProp,
					priceMarket = '';
			container.on('change', 'label.checkbox input[type=checkbox]', function () {
				var price = $(this).parents('form').find('.price'),
						id,
						items;
				checkboxProp = $(this).parents('form').find('input[type=checkbox]').prop('checked');
				// if ($(this).parents('#order').length) {
				// 	if ($('.wrapper_event_page').length) {
				// 		if ($(this).parents('.sell-container').length) {
				// 			items = $('.executed_orders.sell .body tr');
				// 			priceMarket = '0.' + items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
				// 		}
				// 		else {
				// 			items = $('.executed_orders.buy .body tr');
				// 			priceMarket = '0.' + items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
				// 		}
				// 	}
				// 	else {
				// 		id = $(this).parents('.order_content').attr('id').slice(0, -7);
				// 		if ($(this).parents('.sell-container').length) {
				// 			items = $('.event-content#' + id + ' .sell').children();
				// 			priceMarket = items.eq(items.length - 1).find('.price').text().replace(/[^0-9.]+/g, "");
				// 		}
				// 		else {
				// 			items = $('.event-content#' + id + ' .buy').children();
				// 			priceMarket = items.eq(0).find('.price').text().replace(/[^0-9.]+/g, "");
				// 		}
				// 	}
				// }
				if (checkboxProp) {
					let html = $('.order_content.new .price').clone();

					html.find('label').hide();
					html.find('.regulator').hide();
					$(this).parents('form').find('.obligations .regulator').fadeIn(200);
					price.html(html.html()).find('.regulator').fadeIn(200);
					price.find('label').fadeIn(200);
					price.find('input').val('0.').focus();
					price.find('input')[0].selectionStart = 4;
					price.parents('form').find('.obligations input').removeAttr('disabled');
				}
				else {
					let sum = $(this).parents('form').find('.obligations');

					price.find('label').text('Market price');
					price.find('input.number').attr('disabled', true).removeAttr('name').val('');
					price.find('.regulator').fadeOut(200);
					sum.find('input.number').attr('disabled', true);
					sum.find('.regulator').fadeOut(200);
					price.parents('form').find('.obligations input.number').val('');
					price.parents('form').find('.volume input').focus();
				}
			});
			function calculation(context) {
				var priceInput = context.parents('form').find('.price input'),
						volumeInput = context.parents('form').find('.volume input'),
						sumInput = context.parents('form').find('.obligations input'),
						price,
						volume = volumeInput.val(),
						sum = sumInput.val();

				if (checkboxProp) {
					if (context.parents('.sell-container').length) {
						price = 1 - priceInput.val();
					}
					else {
						price = priceInput.val();
					}
					if (context.parents('.price').length) {//(price * volume).toFixed(2)
						if (!(isNaN(volume))) {
							sumInput.val((price * volume).toFixed(2));
						}
						else {
							sumInput.val('');
						}
					}
					if (context.parents('.volume').length) {
						if (!(isNaN(price))) {
							sumInput.val((price * volume).toFixed(2));
						}
						else {
							sumInput.val('');
						}
					}
					if (context.parents('.obligations').length) {
						if (!(isNaN(price))) {
							let volume = Math.round(sum / price);
							volumeInput.val((volume == 'Infinity') ? '' : volume);
						}
						else {
							volumeInput.val('');
						}
					}
				}
				else {
					if (context.parents('.volume').length) {
						sumInput.val('');
					}
					if (context.parents('.obligations').length) {
						volumeInput.val('');
					}
				}
			}

			container.on('keyup', 'input.number', function () {
				checkboxProp = $(this).parents('form').find('input[type=checkbox]').length ? $(this).parents('form').find('input[type=checkbox]').prop('checked') : 1;
				calculation($(this));
			});
			container.on('click', '.regulator span', function () {
				var thisItem = $(this);
				checkboxProp = $(this).parents('form').find('input[type=checkbox]').length ? $(this).parents('form').find('input[type=checkbox]').prop('checked') : 1;

				setTimeout(function () {
					calculation(thisItem);
				}, 0);
			});

			$('.order-title .edit').click(function () {
				var title = $(this).parents('.current-order-title'),
						tab_content = $('.tab_content'),
						windowHeight = window.innerHeight,
						parent = $(this).parents('#current-orders'),
						height;
				setTimeout(function () {
					height = parent[0].clientHeight;
					if (height + 1 > windowHeight - 235)
						tab_content.addClass('max');
					else
						tab_content.removeClass('max');
				}, 300);
				$(this).parent().next().toggleClass('active').slideToggle(200);
				$(this).parents('.order_content').toggleClass('active');
			});

			$('.order-title .delete').click(function (e) {
				$(this).parent().find('.pop_up').fadeIn();
			});
			$('.confirmation .no').click(function (e) {
				$(this).parents('.pop_up').fadeOut();
			});
		}();

		self.orderDelete = function () {
			var order_tab = $('#order');
			order_tab.on('click', '.delete', function (e) {
				e.preventDefault();
				$('.active_trader .spread_confim').remove();
				var form = $(this).parents('form'),
						order = $(this).parents('.order_content');
				if(order.find('form').length <= 1){
					if($(this).parents('.default_orders').length && id.length)
						id.splice(defaultMethods.searchValue(id, order.attr('id').slice(0, -7)), 1);
					order.remove();
				}
				else{
					form.remove();
				}
				orderClass.showInfo();
			});
			order_tab.on('click', '.close', function (e) {
				e.preventDefault();
				var order = $(this).parents('.order_content');
				if($(this).parents('.default_orders').length && id.length)
					id.splice(defaultMethods.searchValue(id, order.attr('id').slice(0, -7)), 1);
				order.remove();
				orderClass.showInfo();
			});
		}();

		self.checkbox = function () {
			var order_tab = $('#order');

			order_tab.on('change', '[type=checkbox]', function () {
				var self = $(this);

				if(self.prop('checked'))
					self.parent().find('span').text('Limit');
				else
					self.parent().find('span').text('Market');
			});
		}();


		// order drag and drop ===============================================================================================
		$(function() {
			var current = $( ".ui-sort" );
			current.sortable({
				placeholder: "ui-state-highlight"
			});
			current.disableSelection();
		});

	}

	static showInfo () {
		if($('#order .default_orders').children().length > 1)
			$('#default_order_info').hide();
		else
			$('#default_order_info').show();
	}

	static tabReturn() {
		var tab = $(".left_order .wrapper .tab"),
				tab_item = $(".left_order .tab_item");
		if (!(tab.eq(0).hasClass('active'))) {
			tab.removeClass("active").eq(0).addClass("active");
			tab_item.hide().eq(0).fadeIn(0);
		}
	}
}

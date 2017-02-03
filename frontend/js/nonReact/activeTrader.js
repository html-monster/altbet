	class activeTraderClass{
	constructor(){
		var content = $('.content');

        // BM: переключатель табов EP здесь -> orderClass



		$('.left_order .tab.js-tab2 label').click(function (e) {
                e.stopPropagation();
		});
		if($('.wrapper_event_page').length || $('.my_position_tab').length)
			$('.active_trader .event_title').hide();


		// BM: init trader On/Off
		this.tradeOn = function () {
			var checkbox = $('.left_order .tab input.limit'),
					autoTrade = $('.left_order .tab input.auto'),
					order = $('#order'),
					default_order = $('.left_order .default_orders'),
					active_trader = $('.left_order .active_trader'),
					buttons = $('.content_bet button.event'),
					event_container = $('.content_bet'),
					titles = event_container.eq(0).find('.event-title .title'),
					tab_content = $('.tab_content'),
					executedOrders = $('.wrapper_event_page .executed_orders'),
					webkit = ($.browser.webkit) ? 'webkit' : '';

			$('.active_trader table.limit').addClass(webkit);
			// if(autoTrade.prop('checked')) globalData.autoTradeOn = true;
			// globalData.tradeOn = false;
			if(checkbox.prop('checked')){
				/*var ii = 0, // commented 23-1-17
						symbol = event_container.eq(0).attr('data-symbol');

				order.css('overflow-y', 'hidden');
				autoTrade.parent().fadeIn(200);
				default_order.fadeOut(200);
				active_trader.fadeIn(200);
				buttons.attr('disabled', true);
				activeTraderClass.tbodyResize();
				// activeTraderClass.spreadVisability();
				if($('.wrapper_event_page').length)
						executedOrders.find('td.clickable').removeClass('clickable');

				// === Vlasakh === 17-01-03 ===============================================
                // setTimeout(() => { if (ABpp.actions['MainPage.firstExchangeActivate']) ABpp.actions['MainPage.firstExchangeActivate']() }, 1000);
				// event_container.eq(0).find('.event-content').eq(0).addClass('active');
				// if(symbol) $('[data-symbol=' + symbol + ']').addClass('active');
				// event_container.addClass('clickable').eq(0).addClass('active');
				// === ==================== ===============================================
				$('.active_trader .event_title .event_name').each(function () {
					$(this).text(titles.eq(ii++).text());
				});
				setTimeout(function () {
					if(globalData.mainPage || globalData.myPosOn)
						activeTraderClass.takeData($('.content_bet').eq(0));
					else
						activeTraderClass.takeData($('.wrapper_event_page'));
				}, 400);
				globalData.tradeOn = true;
				// === Vlasakh === 17-01-12 ===============================================
                ABpp.config.tradeOn = true;
                setTimeout(() => { /!** @var ABpp ABpp *!/ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, true); }, 1000);
				// === ==================== ===============================================*/
			}
			// checkbox.change(function () {
			// 	activeTraderClass.traderOnCheck($(this));
			// });
		}();

		this.eventChange = function () {
			var checkbox = $('.left_order .tab input.limit'),
					event_container = '.content_bet',
					event_content = $('.event-content'),
					tabs = $('.active_trader .event_title .event_name');

			tabs.eq(0).addClass('active');

			// BM: tab_item onClick TODEL
			$('.tab_item').on('click', 'event_container', function () {
				if (checkbox.prop('checked')) {
					0||console.log( '.tab_item .event_container click' );
					var titles = $(this).find('.event-title .title');

					tableLimitChangeData($(this), titles);
					tabs.removeClass('active').eq(0).addClass('active');
					$(this).find('.event-content').eq(0).addClass('active');

					activeTraderClass.takeData($(this));
					activeTraderClass.spreaderClean(true);
					activeTraderClass.buttonActivation($('.active_trader .control input.quantity'));
				}
			});
			// Removed after EventPage on react
			/*event_content.click(function (e) {
				return ; // added after move this to react
				if (checkbox.prop('checked')) {
					var titles = $(this).parents('.content_bet').find('.event-title .title'),
							symbol = $(this).attr('data-symbol');

					tableLimitChangeData($(this), titles);
					$(this).parents('.content_bet').addClass('active');
					$('[data-symbol=' + symbol + ']').addClass('active');
					tabs.removeClass('active').eq($(this).index()).addClass('active');

					activeTraderClass.takeData($(this));
					activeTraderClass.spreaderClean(true);
					activeTraderClass.buttonActivation($('.active_trader .control input.quantity'));
					// activeTraderClass.spreadVisability();

					// e.stopPropagation();
				}
			});*/

			function tableLimitChangeData(current, title) {
				var ii = 0;

				// $(event_container).removeClass('active');
				// event_content.removeClass('active');
				// current.addClass('active');
				tabs.each(function () {
					$(this).text(title.eq(ii++).text());
				});
			}

			// BM: tabs click TODEL
/*
			tabs.click(function () {
				if (checkbox.prop('checked')) {
					0||console.log( 'tabs.click()' );

					// event_content.removeClass('active');
					tabs.removeClass('active');
					$(this).addClass('active');
					activeTraderClass.takeData($('.content_bet.active .event-content').eq($(this).index()));
					activeTraderClass.spreaderClean(true);

                    let id = $('.active_trader').attr('id').replace("trader_", "");
                    ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: id, isMirror: $(this).index()})
				}
			});
*/

		}();

		this.addOrder = function () {
			let //quantityButton = $('.active_trader .control .button.quantity'),
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
				activeTraderClass.buttonActivation($(this));
				if($(this).parent('.spread').length)
					inputNumber.clearInput($('.active_trader .number.spreader'));
				else
					inputNumber.clearInput($('.active_trader .volume.quantity input'));
			});

			trader.on('keyup', 'input.number', function(){
				activeTraderClass.buttonActivation($(this));
			});

			$('.active_trader .regulator span').click(function () {
				var input = $(this).parents('.input').find('.quantity');

				if(input.length){
					setTimeout(function () {
						activeTraderClass.recaluculateSum(input);
					}, 0);
				}
			});

			// BM: делаем ставку в трейдере
			trader.on('click', '.confim.clickable', function(e){
				var	price;

				if($(this).hasClass('market_button'))
						price = $(this).find('.price').text().replace('$', '');
				else
						price = $(this).parents('tr').find('.price_value .value').text().replace('$', '');

				if(globalData.autoTradeOn){
					if($(this).hasClass('sell'))
						ajaxAutoTradeClass.sendOrder($(this), 'sell', price);
					else
						ajaxAutoTradeClass.sendOrder($(this), 'buy', price);
				}
				else
					addOrder($(this), e);

			});

			trader.on('click', '.price_value.active', function(){
				var context = $(this), price1 = (takeSpreadPrice(context)).price1, price2 = (takeSpreadPrice(context)).price2;

				if(globalData.autoTradeOn && !($(this).hasClass('mid')))
					ajaxAutoTradeClass.sendSpreadOrder(price1, price2);
				else
					addOrder($(this));

				// if($(this).hasClass('mid'))
				// 	addOrder($(this));

			});

			trader.on('click', '.confim_button', function (e) {
				e.stopPropagation();
				var context = $(this), price1 = (takeSpreadPrice(context)).price1, price2 = (takeSpreadPrice(context)).price2;

				if(globalData.autoTradeOn)
					ajaxAutoTradeClass.sendSpreadOrder(price1, price2);
				else
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

			function takeSpreadPrice(context) {
				var price1, price2, spreadVal = +$('.active_trader input.spreader').val();

				if(context.hasClass('ask')){
					price2 = context.parents('tr').find('.price_value .value').text().replace(/[^0-9.]+/g, "");
					price1 = (+price2 - spreadVal).toFixed(2);
					price1 = price1 < 0.01 ? 0.01 : price1;
				}
				else{
					price1 = context.parents('tr').find('.price_value .value').text().replace(/[^0-9.]+/g, "");
					price2 = (+price1 + spreadVal).toFixed(2);
					price2 = price2 > 0.99 ? 0.99 : price2;
				}

				return {price1, price2};
			}

			function addOrder(context, event) {
				var position = context.position().top + 25,
						price = context.find('.price').text().replace(/[^0-9.]+/g, "") || context.parent().find('.price_value .value').text().replace(/[^0-9.]+/g, ""),
						quantity = +trader.find('input.quantity').val();

				if(event) event.stopPropagation();

				if(context.hasClass('size') || context.hasClass('price_value') || context.hasClass('confim_button')){
					if(context.parents('tr').index() > trader.find('.best_buy ').parents('tr').index()){
						if(context.parents('tbody')[0].scrollHeight < context.parents('tr').index() * 20 + 110)
							position = context.parents('tbody')[0].scrollHeight - 90;
						else
							position = (context.parents('tr').index() - trader.find('table.limit tbody tr.hidden').length) * 20 + 20;
					}
					else{
						position = context.parents('tr').index() * 20 + 20;
					}
				}


				if(context.hasClass('sell_mkt')){
					createOrderForm('.template .order_content.default', 'sell_mkt');
				}
				else if(context.hasClass('buy_mkt')){
					createOrderForm('.template .order_content.default', 'buy_mkt');
				}
				else if(context.hasClass('size sell') || context.hasClass('join_ask')){
					createOrderForm('.template .order_content.default', 'sell');
				}
				else if(context.hasClass('price_value') || context.hasClass('confim_button')){
					var price1 = (takeSpreadPrice(context)).price1, price2 = (takeSpreadPrice(context)).price2;


					if(context.hasClass('mid')){
						html = '<div class="spread_confim"><span class="sell ask confim_button" onmousedown="return false" onselectstart="return false">Sell</span><span class="buy bid confim_button" onmousedown="return false" onselectstart="return false">Buy</span></div>';
					}
					else{
						createOrderForm('.template .order_content.spread', 'spread');
					}
				}
				else{
					createOrderForm('.template .order_content.default', 'buy');
				}

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
					}, 0);
				}
				else if(context.hasClass('size') || context.hasClass('price_value') || context.hasClass('confim_button'))
					context.parents('tr').find('td:last-of-type').append(html);
				else
					context.parent().next().html('<td></td>').children().append(html);

				$('#order_content').css('visibility', 'visible');
				setTimeout(function () {
					$('#order_content').addClass('active');
				}, 0);
				function createOrderForm(element, modification) {
					var isMirror;

					if($('#IsMirror').length)
						isMirror = $('#IsMirror').val().toLowerCase() == 'false' ? 0 : 1;
					else
						isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;


					html = $(element).clone();
					html.attr('id', 'order_content').css({
						width: size - 4,
						top: position
					});
					if(modification == 'buy' || modification == 'buy_mkt'){
						html.find('.buy-container').html(html.find('.sell-container').html());
						html.find('input[type=submit]').toggleClass('sell buy').val('buy');
						html.find('.sell-container').html('');
						html.find('.side').val('Buy');
					}
					else
						html.find('.side').val('Sell');

					if(modification == 'buy')
						html.find('.obligations input').val((price * quantity).toFixed(2));
					else if(modification == 'sell')
						html.find('.obligations input').val(((1 - price) * quantity).toFixed(2));
					else if(modification == 'sell_mkt')
						html.find('.obligations input').val('');

					if(modification == 'spread'){
						html.find('.price.sell input').val(price2);
						html.find('.price.buy input').val(price1);
						html.find('.SellOrderLimitPrice').val(price2);
						html.find('.BuyOrderLimitPrice').val(price1);
					}
					else
						html.find('.price input').val(price);

					html.find('.volume input').val(quantity);
					html.find('.symbol').val($('.active_trader').attr('id').slice(7));

					if(modification == 'sell' || modification == 'buy')
						html.find('.price_value').val(price);


					if(modification == 'sell_mkt' || modification == 'buy_mkt'){
						html.find('form').attr('action', globalData.rootUrl + 'Order/MarketTrading').removeAttr('data-ajax-url');
						html.find('.checkbox').append('<input type="checkbox" class="hidden" />');
						html.find('.direction').val(false);
					}
					else
						html.find('.direction').val(true);

					if(!isMirror)
						html.find('.mirror').val(0);
					else
						html.find('.mirror').val(1);
				}
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
					globalData.autoTradeOn = true;
				}
				else
					globalData.autoTradeOn = false;
			});

		}();

		this.controlMethods = function () {
			let trader = $('.active_trader');

			trader.on('click', '.active_trader_footer td', function () {
				$(this).find('.confirm_window').removeClass('bounceOutDown').addClass('bounceInUp');
				$(this).find('.confirm_window').addClass('active');
			});
			$('.active_trader_footer button').click(function (e) {
				e.stopPropagation();
				if($(this).hasClass('yes')){
					let method = ($(this).parents('td').find('a').attr('class')).slice(0, -2);
					ajaxControlTraderClass.ajaxDataSender(method);
				}
				$(this).parents('.confirm_window').removeClass('bounceInUp').addClass('bounceOutDown');
				setTimeout(() => {
					$(this).parents('.confirm_window').removeClass('active');
				}, 500);
			});
		}();
		// this.marcketOrder = function () {
		// 	var container = $('.active_trader .control').eq(0);
		//
		// 	$('.active_trader .market_button ').mousedown(function () {
		// 		if ($(this).hasClass('buy_mkt'))
		// 			container.find('.side').val('Buy');
		// 		else
		// 			container.find('.side').val('Sell');
		//
		// 		container.find('.symbol').val($('.active_trader').attr('id').slice(7));
		//
		// 		if($('.active_trader .event_name').eq(0).hasClass('active'))
		// 			container.find('.mirror').val(0);
		// 		else
		// 			container.find('.mirror').val(1);
		// 	});
		// }();
		//spread show/hide =============================================================================================================

		// $('.active_trader .show_spread').click(function () {
		// 	activeTraderClass.spreadVisability(true);
		// });
	}

	static spreaderChangeVal(input, quantity){
		// activeTraderClass.spreadVisability(null, true);
		var value, ii,
				ask = $('.active_trader .best_sell').parent().index(),
				bid = $('.active_trader .best_buy').parent().index(),
				limit = $('.active_trader table.limit'),
				tr= $('.active_trader table.limit tbody tr'),
				bestBuy = $('.active_trader table.limit td.best_buy'),
				bestSell = $('.active_trader table.limit td.best_sell');

		if(input.hasClass('spreader') || input.parent().hasClass('spread')){
			var orderContent = $('.order_content.spread');

			// input.focus();
			if(quantity) input.val(quantity);
			// input[0].selectionStart = input.val().length;
			value = +(input.val() * 100).toFixed(0);
			tr.find('.price_value').removeClass('active');
			if(bid == -1) bid = ask;
			if(ask == -1) ask = bid;
			// if(ask == -1 && bid == -1) value= 0;
			function addClass() {
				if(ii < 0) return;
				tr.eq(ii).find('.price_value').addClass('active');
			}

			if(value){
				if(!(bestBuy.length || bestSell.length))
					tr.find('.price_value').addClass('active');

				for(ii = bid - 1; ii > ask; ii--){
					addClass();
				}
				for(ii = bid + 1; ii <= bid + value; ii++){
					addClass();
				}
				for(ii = ask - 1; ii >= ask - value; ii--){
					addClass();
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
				if(bid > 0.99) bid = 0.99;
				orderContent.find('.price input').eq(0).val(bid);
			}
			// if(orderContent.parents('tr').find('.mid').length){
			// 	var currentPrice = +(orderContent.parents('tr').find('.mid span.value').text()).slice(1);
			//
			// 	ask = (currentPrice - value / 100).toFixed(2);
			// 	bid = (currentPrice + value / 100).toFixed(2);
			// 	if(ask < 0.01) ask = 0.01;
			// 	orderContent.find('.price input').eq(1).val(ask);
			// 	if(bid > 0.99) bid = 0.99;
			// 	orderContent.find('.price input').eq(0).val(bid);
			// }
		}

		function spreadHighlight(context) {
			ii = context.parents('tr').index();
			$('.active_trader .limit td.price_value').removeClass('hovered');
			context.parents('tr').find('.price_value').addClass('hovered');
			if(context.hasClass('ask')){
				tr.eq((ii + value) > 98 ? 98 : ii + value).find('.price_value').addClass('hovered');
			}
			if(context.hasClass('bid')){
				tr.eq((ii - value) < 1 ? 0 : ii - value).find('.price_value').addClass('hovered');
			}
			if(context.hasClass('mid')){
				tr.eq((ii - value) < 1 ? 0 : ii - value).find('.price_value').addClass('hovered');
				tr.eq((ii + value) > 98 ? 98 : ii + value).find('.price_value').addClass('hovered');
			}
		}
		limit.on('mouseover', 'td.price_value.active', function () {
			spreadHighlight($(this));
		});
		limit.on('mouseout', 'td.price_value.active', function () {
			$('.active_trader .limit td.price_value').removeClass('hovered');
		});
		limit.on('mouseover', '.confim_button', function (e) {
			e.stopPropagation();
			spreadHighlight($(this));
		});
		limit.on('mouseout', '.confim_button', function (e) {
			e.stopPropagation();
			$('.active_trader .limit td.price_value').removeClass('hovered');
		});
	}

	// static spreadVisability(isButton, visibility) {
	// 	if($('.active_trader table.limit .best_buy').length && $('.active_trader table.limit .best_sell').length){
	// 		var tdWidth = [],
	// 				table = $('table.limit'),
	// 				tbody = $('.left_order table.limit tbody'),
	// 				hide = tbody.find('.mid').parent().hasClass('hidden'),
	// 				spread = tbody.find('.mid').parent(),
	// 				hidden = tbody.find('.hidden'),
	// 				visibleString = tbody.height() / tbody.find('tr').eq(0).height(),
	// 				spreadSize = tbody.find('.best_sell ').parent().index() - tbody.find('.best_buy ').parent().index() - 1;
	// 		isButton = isButton || false;
	//
	// 		for (var ii = 0; ii < table.find('th').length; ii++) {
	// 			if($.browser.webkit){
	// 				if(ii == 1)
	// 					tdWidth.push(parseInt(table.find('th').eq(ii).css('width')) - 1 + 'px');
	// 				else
	// 					tdWidth.push(table.find('th').eq(ii).css('width'));
	// 			}
	// 			else{
	// 				tdWidth.push(parseInt(table.find('th').eq(ii).css('width')) + 'px');
	// 			}
	//
	// 		}
	//
	//
	// 		if(!isButton){
	// 			hidden.animate({height: 20}).attr('class', 'visible');
	// 		}
	// 		else{
	//
	// 			$('#order_content').remove();
	// 		}
	//
	// 		if(spreadSize > visibleString - 4 && !isButton && visibility !== true){
	// 			$('.active_trader .show_spread .visibility').text('Hide');
	// 			setTimeout(function () {
	// 				spread.attr('class', 'hidden').animate({height: 0}, 400);
	// 				activeTraderClass.tdWidthChange(tdWidth);
	// 				activeTraderClass.scrollTo(true);
	// 				$('.active_trader .show_spread .visibility').text('Show');
	// 				$('.active_trader .show_spread').addClass('active');
	// 			}, 700);
	// 		}
	// 		else if(!isButton){
	// 			$('.active_trader .show_spread .visibility').text('Hide');
	// 			if(!(spreadSize > visibleString - 4)) $('.active_trader .show_spread').removeClass('active');
	// 		}
	//
	// 		if(!hide && isButton || visibility === false) {
	// 			if(tbody.find('.hidden').length)
	// 				hidden.animate({height: 20}, 400).attr('class', 'visible');
	// 			if(isButton) activeTraderClass.scrollTo(true);
	// 			spread.attr('class', 'hidden').animate({height: 0}, 400);
	// 			activeTraderClass.tdWidthChange(tdWidth);
	// 			$('.active_trader .show_spread .visibility').text('Show');
	// 		}
	// 		else if(isButton || visibility === true){
	// 			hidden.animate({height: 20}, 400);
	// 			activeTraderClass.scrollTo();
	// 			setTimeout(function () {
	// 				hidden.attr('class', 'visible');
	// 			}, 400);
	// 			$('.active_trader .show_spread .visibility').text('Hide');
	// 		}
	// 	}
	// 	else{
	// 		$('.active_trader .show_spread').removeClass('active');
	// 		$('.left_order table.limit tbody .hidden').animate({height: 20}).attr('class', 'visible');
	// 	}
	// }
	/**
	 * Активирует и дезактиварует кнопки в трейдре
	 * @param current дом узел (кнопки или поля ввода в контрольной панеле трейдера)
	 * @param recalc bool (вызывает функцию пересчета recaluculateSum для пересчета кол. и суммы в контрольной панеле и в вызваном ордере одновременно)
	 */
	static buttonActivation(current, recalc) {
		if(current.parents('.active_trader').length){
			var	html = '<div class="regulator min" style="display: none;"><span class="plus" title="Press Arrow Up"></span><span class="minus" title="Press Arrow Down"></span></div>',
					input = $('.active_trader input.quantity'),
					quantity = current.hasClass('btn') ? current.text() : '',
					market_button = $('.active_trader .control tr:first-of-type .market_button'),
					limit_market_button = $('.active_trader .control tr:nth-last-of-type(2) .market_button'),
					className = 'active clickable wave';

			//quantityButton.removeClass('activated');
			if(current.parent().hasClass('quantity') || current.hasClass('quantity')){
				if(current.parent('.input').length && (current.val() == '' || current.val() == 0)){
					market_button.removeClass(className);
					limit_market_button.removeClass(className);
					$('.active_trader .table_limit').removeClass('clickable');
					$('.active_trader table.limit').removeClass('clickable');
					$('.active_trader table.limit tbody td.size').removeClass('clickable wave');
					$('.active_trader .spread').find('button').removeClass('btn').attr('disabled', true);
					$('.active_trader input.spreader').attr('disabled', true).parent().find('.regulator').fadeOut(400).remove();
					activeTraderClass.spreaderClean();
				}
				else{
					if(!(market_button.hasClass('active')))
						$('.active_trader input.spreader').removeAttr('disabled').parent().append(html).find('.regulator').fadeIn(400);
					limit_market_button.each(function () {
						if ($(this).find('.price').text() != '') {
							$(this).addClass(className);
							market_button.eq($(this).index()).addClass(className);
						}
						else{
							$(this).removeClass(className);
							market_button.eq($(this).index()).removeClass(className);
						}

					});
					$('.active_trader .spread').find('button').addClass('btn').removeAttr('disabled');

					if(!(current.parent('.input').length || current.parent('.regulator').length)){
						if(+input.val() + +quantity >= 99999999)
							input.focus().val(99999999);
						else
							input.focus().val(+input.val() + +quantity);

						input[0].selectionStart = input.val().length;
					}
					$('.active_trader .table_limit').addClass('clickable');
					$('.active_trader table.limit').addClass('clickable');
					$('.active_trader table.limit tbody td.size').addClass('clickable');
				}
				if(!recalc) activeTraderClass.recaluculateSum(current);
			}
			if(current.hasClass('spreader')) {
				activeTraderClass.spreaderChangeVal(current);
			}
			else if(current.parent().hasClass('spread')){
				input = $('.active_trader input.spreader');
				// inputNumber.clearInput($('.active_trader').find('.control input.spreader'));
				activeTraderClass.spreaderChangeVal(input, quantity);
				input.focus();
				input[0].selectionStart = input.val().length;
			}
		}
	}

	/**
	 * вычисляет в трейдере центр между бидом и аском
	 * @param center
	 * @returns {boolean}
	 */
	static scrollTo(center) {
		var table = $('table.limit tbody tr'),
				indexBuy = table.find('.best_buy').parent().index(),
				indexSell = table.find('.best_sell').parent().index(),
				tbody = $('table.limit tbody');

		if(tbody.hasClass('scroll_dis')) return false;

		if(indexBuy == -1 && indexSell == -1)
			indexSell = 49;
		if(indexBuy == -1)
			indexBuy = indexSell;
		else if(indexSell == -1)
			indexSell = indexBuy;

		center = center ? 0 : (indexSell - indexBuy) / 2;

		tbody.animate({scrollTop: (indexBuy + center) * 20 - tbody.height() / 2 + 10}, 400);
	}

	/**
	 * удаляет вызванный ордер в трейдере, дизактивирует все активные элементы в трейдере(сбрасывает его в изначальное состояние)
	 * @param removeOrder
	 */
	static spreaderClean(removeOrder) {
		$('.active_trader table.limit tbody tr').find('.price_value').removeClass('active');
		$('.active_trader input.spreader').val('');
		$('.active_trader table.limit td.best_buy').removeClass('active');
		$('.active_trader table.limit td.best_sell').removeClass('active');
		if(removeOrder){
			$('.active_trader .table_limit ').removeClass('clickable');
			$('.active_trader table.limit ').removeClass('clickable');
			$('.active_trader table.limit td.size ').removeClass('clickable');
			$('.active_trader #order_content').remove();
		}
		$('.active_trader .spread_confim').remove();
	}

	/**
	 * для пересчета кол. и суммы в контрольной панеле и в вызваном ордере одновременно
	 * @param item дом узел с которым ордер будет синхронизирован в пересчете
	 */
	static recaluculateSum(item){
		var order_content = $('#order_content'),
				quantity = +item.text() || +item.val() || '',
				price = +order_content.find('.price input').val();

		if(item.parents('td.button.quantity').length)
			quantity = order_content.find('.volume input').val();
		else
			$('.active_trader .volume input').not(item).val(quantity);

		if(order_content.find('.sell-container').children().length)
			order_content.find('.obligations input').val(((1 - price) * quantity).toFixed(2));
		else
			order_content.find('.obligations input').val((price * quantity).toFixed(2));
	}

	//spread show/hide ===================================================================================================
	/**
	 * исользуется, когда спредер прячится пересчитывает ширину ячеек в таблице
	 * @toDelete 19/11/2016
	 * @param tdWidth
	 */
	static tdWidthChange(tdWidth) {

		$('table.limit').find('tr').each(function () {
			for (var ii = 0; ii < tdWidth.length; ii++) {
				$(this).find('td').eq(ii).css('width', tdWidth[ii]);//  + 10
			}
		});
	}

	/**
	 * берет данные при смене события(название события, symbol и т.п.)
	 * @param currentItem дом узел события с которого берется symbol
	 */
	static takeData(currentItem) {
		var ii, priceSell = [], priceBuy = [], volumeSell = [], volumeBuy = [],
				bestSell, bestBuy, currentPrice,
				table = $('table.limit tbody tr'),
				join_bid = $('.join_bid a'),
				join_ask = $('.join_ask a'),
				className = 'ask',
				activeTrader = $('.active_trader');

		// 0||console.log( 'currentItem', currentItem );
		if(currentItem.hasClass('content_bet'))
			activeTrader.attr('id', 'trader_' + currentItem.find('.symbol_name').text());
		else if(globalData.eventPageOn)
			activeTrader.attr('id', 'trader_' + currentItem.attr('id'));
		else
			activeTrader.attr('id', 'trader_' + currentItem.parents('.content_bet').find('.symbol_name').text());

		activeTrader.find('table.limit tbody').removeClass('scroll_dis');

		// currentItem = currentItem.hasClass('content_bet') ? currentItem.find('.table').children('.event-content').eq(0) : currentItem;
		// if(!(currentItem.hasClass('content_bet')))
		// 	currentItem.addClass('active');


	/*	if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru'){// for development ==============
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
			table.find('.my_size').find('.value').text('');
			table.find('.price_value').removeClass('best_sell best_buy');
		}

		table.each(function () {
			var current = $(this);
			currentPrice = $(this).find('.price_value').text();
			if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru') {// for development =============
				if(defaultMethods.searchValue(priceSell, currentPrice) != -1){
					ii = defaultMethods.searchValue(priceSell, currentPrice);
					$(this).find('.size_sell').addClass('animated fadeOut').find('span.value').text(volumeSell[ii]);
					if (defaultMethods.randomInteger(0, 1)) $(this).find('.my_bids').addClass('animated fadeOut').find('span.value').text(defaultMethods.randomInteger(1, +volumeSell[ii]));  // for development =============================================
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
				if(defaultMethods.searchValue(priceBuy, currentPrice) != -1){
					ii = defaultMethods.searchValue(priceBuy, currentPrice);
					$(this).find('.size_buy').addClass('animated fadeOut').find('span.value').text(volumeBuy[ii]);
					if (defaultMethods.randomInteger(0, 1)) $(this).find('.my_offers').addClass('animated fadeOut').find('span.value').text(defaultMethods.randomInteger(1, +volumeBuy[ii]));  // for development =============================================
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
			}

			;(function separation() {
				current = current.find('td.price_value');

				current.removeClass('ask bid mid');
				if(current.hasClass('best_sell')){
					className = 'bid';
				}
				current.addClass(className);
				if(current.hasClass('best_buy')){
					if(activeTrader.find('.best_buy').length && activeTrader.find('.best_sell').length )
						className = 'mid';
					else
						className = 'bid';
				}
			})();
		});*/


		// activeTraderClass.scrollTo();
	}

	/**
	 * просчет высоты таблицы с данным в трейдере
	 * @param showFooter bool включен футер или нет
	 */
	static tbodyResize(showFooter){
		var windowHeight = window.innerHeight,
				footer = $('footer'),
				footerHeight = footer.outerHeight(),
				tbody = $('.left_order table.limit tbody'),
				delay = 400;
		// order = $('#order');

		if(showFooter) delay = 0;

		// order.css('overflow-y', 'hidden');
		setTimeout(function () {
			var	orderSidebarHeight = windowHeight - ($('.left_order .tabs').outerHeight(true) + $('header').outerHeight(true)),
			 		eventTitleHeight = ($('.active_trader .event_title').length) ? $('.active_trader .event_title')[0].offsetHeight : '',
					activeTraderHeight = orderSidebarHeight - (eventTitleHeight + $('.active_trader .info').outerHeight() +
							$('.active_trader .control').eq(0).outerHeight() + $('.active_trader .control').eq(1).outerHeight() +
							$('.active_trader .control.remote').outerHeight() + $('.active_trader .limit thead').outerHeight() + 12);

			if(footer.hasClass('active')){
				tbody.css('max-height', activeTraderHeight - footerHeight);
			} else {
				tbody.css('max-height', activeTraderHeight);
			}
		}, delay);
	};

	/**
	 * BM: включает и отключает трейдер TODEL (после переноса тредера в R)
	 * @param context дом узел чекбокса трейдера
	 */
	static traderOnCheck(context)
	{
		// let ii = 0;
		// let autoTrade = $('.left_order .tab input.auto'),
		// 		order = $('#order'),
		// 		default_order = $('.left_order .default_orders'),
		// 		active_trader = $('.left_order .active_trader'),
		// 		buttons = $('.event-content button.event'),
		// 		event_container = $('.content_bet'),
		// 		titles = event_container.eq(0).find('.event-title .title'),
		// 		executedOrders = $('.wrapper_event_page .executed_orders');
        //
		// if(context.prop('checked')){
		// 	var symbol = event_container.eq(0).attr('data-symbol');
        //
		// 	order.css('overflow-y', 'hidden');
		// 	autoTrade.parent().fadeIn(200);
		// 	default_order.fadeOut(200);
		// 	setTimeout(function () {
		// 		active_trader.fadeIn(200);
		// 	}, 200);
		// 	activeTraderClass.tbodyResize();
		// 	// buttons.attr('disabled', true);
        //
		// 	// === Vlasakh === 17-01-03 ===============================================
         //    // ABpp.actions['MainPage.firstExchangeActivate'] && ABpp.actions['MainPage.firstExchangeActivate']();
         //    // ABpp.actions['EventPage.activeTraiderActivate'] && ABpp.actions['EventPage.activeTraiderActivate']();
        //
		// 	// if(event_container.hasClass('active')){
		// 	// 	event_container.addClass('clickable');
		// 	// } else {
		// 	// 	if(symbol) $('[data-symbol=' + symbol + ']').addClass('active');
		// 	// 	event_container.addClass('clickable').eq(0).addClass('active');
		// 	// 	titles = $('.content_bet.active .event-title .title');
		// 	// 	$('.active_trader .event_title .event_name').each(function () {
		// 	// 		$(this).text(titles.eq(ii++).text());
		// 	// 	});
		// 	// }
		// 	// === ==================== ===============================================
        //
		// 	orderClass.tabReturn();
		// 	setTimeout(function () {
		// 		if($('.active_trader .best_buy').text() == '' && $('.active_trader .best_sell').text() == ''){
		// 			if(globalData.mainPage || globalData.myPosOn)
		// 				activeTraderClass.takeData($('.content_bet').eq(0));
		// 			else
		// 				activeTraderClass.takeData($('.wrapper_event_page'));
		// 		}
		// 		// === Vlasakh === 17-01-12 ===============================================
		// 		// ABpp.Websocket.sendSubscribe({exchange: data.Symbol.Exchange}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);
		// 		let id = $('.active_trader').attr('id').replace("trader_", "");
		// 		ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: id, isMirror: $(this).index()});
		// 		ABpp.actions['MainPage.getExchange'] && ABpp.actions['MainPage.getExchange']();
		// 		// === ==================== ===============================================
		// 	}, 700);
		// 	if($('.wrapper_event_page').length)
		// 		executedOrders.find('td.clickable').removeClass('clickable');
        //
		// 	globalData.tradeOn = true;
		// 	// === Vlasakh === 23-01-12 ===============================================
		// 	ABpp.config.tradeOn = true;
		// 	/** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, true);
        //
		// 	// let id = $('.active_trader').attr('id').replace("trader_", "");
		// 	// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: id, isMirror: $(this).index()});
        //
        //
		// // ABpp.Websocket.sendSubscribe({exchange: null}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);
		// 	// === ==================== ===============================================
		// }
		// else{
		// 	autoTrade.parent().fadeOut(200);
		// 	order.css('overflow-y', 'auto');
		// 	setTimeout(function () {
		// 		default_order.fadeIn(200);
		// 	}, 200);
		// 	active_trader.fadeOut(200);
		// 	buttons.removeAttr('disabled');
		// 	event_container.removeClass('clickable');
		// 	if($('.wrapper_event_page').length)
		// 		executedOrders.find('td.clickable').addClass('clickable');
        //
		// 	globalData.tradeOn = false;
		// 	// === Vlasakh === 17-01-12 ===============================================
		// 	ABpp.config.tradeOn = false;
		// 	/** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, false);
		// 	// === ==================== ===============================================
		// }
	}
}








class activeTraderControllerClass{
	static updateActiveTraiderData  (data) {
		if ($('div[id^="trader_"]').attr('id') == null) return;

		var identificators = $('div[id^="trader_"]').attr('id').replace('trader_', '').split('_');

		// console.log(identificators);
		// var td = $('.active_trader table.limit td');


		var trader = $('.active_trader'),
				isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1,
				lines = $('.active_trader tr.visible'),
				tbody	= $('table.limit tbody'),
				td= tbody.find('td'),
				// bestSell = 0,
				// bestBuy = 1,
				activeData = null;

		td.removeClass('best_sell best_buy');
		// td.find('span.value').addClass('rel');
		/*td.each(function () {
		 if($(this).hasClass('size') || $(this).hasClass('my_size')){
		 // $(this).find('.value').text('');
		 }
		 });*/

		$(data).each(function () {
			if (this.Symbol.Exchange == identificators[0]
					&& this.Symbol.Name == identificators[1]
					&& this.Symbol.Currency == identificators[2])
			{
				activeData = this;
				console.log(activeData);
			}
		});

		$(lines).each(function () {
			var currnetLine = $(this),
					noData = true;

			$(activeData.Orders).each(function () {
				var side = this.Side;

				$(this.SummaryPositionPrice).each(function () {
					var self = this,
							line = null,
							price = (isMirror) ? (1 - self.Price).toFixed(2) : (self.Price).toFixed(2),
							volume = self.Quantity,
							userVolume = self.ParticularUserQuantity;

					if (currnetLine.find('td.price_value span.value').text() == '$' + price)
					{
						line = currnetLine;
						noData = false;
					}

					// function showData(side, isMirror) {
					// 	var bestPriceDir, direction;
					// 	if(side == 'td.sell'){
					// 		bestPriceDir = 'best_sell';
					// 		direction = isMirror ? 'td.my_offers.my_size' : 'td.my_bids.my_size';
					// 		if (bestSell < self.Price) {
					// 			bestSell = self.Price;
					// 			lines.find(side).removeClass(bestPriceDir);
					// 			lines.find('td.price_value').removeClass(bestPriceDir);
					// 			$(line).find(side).addClass(bestPriceDir);
					// 			$(line).find('td.price_value').addClass(bestPriceDir);
					// 		}
					// 	}
					// 	else{
					// 		bestPriceDir = 'best_buy';
					// 		direction = isMirror ? 'td.my_bids.my_size' : 'td.my_offers.my_size';
					// 		if (bestBuy > self.Price) {
					// 			bestBuy = self.Price;
					// 			$(line).find(side).addClass(bestPriceDir);
					// 			$(line).find('td.price_value').addClass(bestPriceDir);
					// 		}
					// 	}
					//
					// 	$(line).find(side + ' span.value').text(volume);
					// 	if(userVolume != 0) $(line).find(direction + ' span.value').text(userVolume);
					// 	$(line).find(side).addClass('animated fadeOut');
					// 	$(line).find('td.price_value').addClass('animated fadeOut');
					//
					// 	// $(best_price).find(side).addClass(direction);
					// 	// $(best_price).find('td.price_value').addClass(direction);
					// 	function _isMirror(dir, isMirror) {
					// 		var side;
					// 		if(dir == 'sell'){
					// 			side = isMirror ? 'td.buy' : 'td.sell';
					// 			if (bestSell < self.Price) {
					// 				bestSell = self.Price;
					// 				if(isMirror){
					// 					lines.find(side).removeClass(bestPriceDir);
					// 					lines.find('td.price_value').removeClass(bestPriceDir);
					// 				}
					// 				$(line).find(side).addClass(bestPriceDir);
					// 				$(line).find('td.price_value').addClass(bestPriceDir);
					// 			}
					// 		}
					// 		else{
					// 			side = isMirror ? 'td.sell' : 'td.buy';
					// 			if (bestBuy > self.Price) {
					// 				bestBuy = self.Price;
					// 				if(isMirror){
					// 					lines.find(side).removeClass(bestPriceDir);
					// 					lines.find('td.price_value').removeClass(bestPriceDir);
					// 				}
					// 				$(line).find(side).addClass(bestPriceDir);
					// 				$(line).find('td.price_value').addClass(bestPriceDir);
					// 			}
					// 		}
					// 	}
					// }

					if(!isMirror){
						if (side == 0) {
							$(line).find('td.my_offers.my_size span.value').text('');
							$(line).find('td.buy span.value').text('');
							if($(line).find('td.sell span.value').text() != volume) {
								$(line).find('td.sell span.value').text(volume);
								$(line).find('td.sell').addClass('animated fadeOut');
								$(line).find('td.price_value').addClass('animated fadeOut');
							}
							if (userVolume != 0 && $(line).find('td.my_bids.my_size span.value').text() != userVolume){
								$(line).find('td.my_bids.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
							}


							setTimeout(function () {
								$(line).find('.fadeOut').removeClass('fadeOut')
							}, 700);
						}
						else{
							$(line).find('td.my_bids.my_size span.value').text('');
							$(line).find('td.sell span.value').text('');
							if($(line).find('td.buy span.value').text() != volume) {
								$(line).find('td.buy span.value').text(volume);
								$(line).find('td.buy').addClass('animated fadeOut');
								$(line).find('td.price_value').addClass('animated fadeOut');
							}
							if (userVolume != 0 && $(line).find('td.my_offers.my_size span.value').text() != userVolume){
								$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
							}

							setTimeout(function () {
								$(line).find('.fadeOut').removeClass('fadeOut')
							}, 700);
						}
						if(currnetLine.find('td.price_value span.value').text() == '$' + (activeData.Symbol.LastBid).toFixed(2))
						{
							currnetLine.find('td.sell').addClass('best_sell');
							currnetLine.find('td.price_value').addClass('best_sell');
						}
						if(currnetLine.find('td.price_value span.value').text() == '$' + (activeData.Symbol.LastAsk).toFixed(2))
						{
							currnetLine.find('td.buy').addClass('best_buy');
							currnetLine.find('td.price_value').addClass('best_buy');
						}
					}
					else{
						if (side == 0) {
							$(line).find('td.my_bids.my_size span.value').text('');
							$(line).find('td.sell span.value').text('');
							if($(line).find('td.buy span.value').text() != volume) {
								$(line).find('td.buy span.value').text(volume);
								$(line).find('td.buy').addClass('animated fadeOut');
								$(line).find('td.price_value').addClass('animated fadeOut');
							}
							if (userVolume != 0 && $(line).find('td.my_offers.my_size span.value').text() != userVolume){
								$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
							}


							setTimeout(function () {
								$(line).find('.fadeOut').removeClass('fadeOut')
							}, 700);
						}
						else{
							$(line).find('td.my_offers.my_size span.value').text('');
							$(line).find('td.buy span.value').text('');
							if($(line).find('td.sell span.value').text() != volume) {
								$(line).find('td.sell span.value').text(volume);
								$(line).find('td.sell').addClass('animated fadeOut');
								$(line).find('td.price_value').addClass('animated fadeOut');
							}
							if (userVolume != 0 && $(line).find('td.my_bids.my_size span.value').text() != userVolume){
								$(line).find('td.my_bids.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
							}


							setTimeout(function () {
								$(line).find('.fadeOut').removeClass('fadeOut')
							}, 700);
						}
						if(currnetLine.find('td.price_value span.value').text() == '$' + (1 - activeData.Symbol.LastAsk).toFixed(2))
						{
							currnetLine.find('td.sell').addClass('best_sell');
							currnetLine.find('td.price_value').addClass('best_sell');
						}
						if(currnetLine.find('td.price_value span.value').text() == '$' + (1 - activeData.Symbol.LastBid).toFixed(2))
						{
							currnetLine.find('td.buy').addClass('best_buy');
							currnetLine.find('td.price_value').addClass('best_buy');
						}
					}

				});
			});

			if(noData){
				currnetLine.find('.fadeOut').removeClass('fadeOut');
				currnetLine.find('.size').find('.value').text('');
				currnetLine.find('.my_size').find('.value').text('');
			}
		});

		tbody.find('tr').each(function () {
			var current = $(this);

			;(function separation() {
				var className;
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
		console.log('========================================================');
		activeTraderClass.scrollTo();
		tbody.addClass('scroll_dis');
	}
}
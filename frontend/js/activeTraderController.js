class activeTraderControllerClass{
	static updateActiveTraiderData  (data) {
		var trader = $('.active_trader'),
				isMirror,
				lines = $('.active_trader tr.visible'),
				tbody	= $('table.limit tbody'),
				td = tbody.find('td'),
				// bestSell = 0,
				// bestBuy = 1,
				activeData = null,
				bid = '', ask = '',
				className = 'ask';

		if($('#IsMirror').length)
			isMirror = $('#IsMirror').val();
		else
			isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;

		if (!trader.attr('id')) return;
		var identificators = trader.attr('id').replace('trader_', '').split('_');

		// console.log(identificators);
		// var td = $('.active_trader table.limit td');



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
				// console.log(activeData);
			}
		});

		if(activeData){
			if(activeData.Positions) $('.open_contracts .quantity').text(activeData.Positions);
			if(activeData.GainLoss) $('.open_pnl .quantity').text(activeData.GainLoss);
			$(lines).each(function () {
				var currnetLine = $(this),
						noData = true;

				$(activeData.Orders).each(function () {
					var side = this.Side;
// console.log(this.SummaryPositionPrice);
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

						if(!isMirror && line){
							if (side == 0) {
								$(line).find('td.my_offers.my_size span.value').text('');
								$(line).find('td.buy span.value').text('');
								if($(line).find('td.sell span.value').text() != volume) {
									$(line).find('td.sell span.value').text(volume);
									$(line).find('td.sell').addClass('animated fadeOut');
									$(line).find('td.price_value').addClass('animated fadeOut');
								}
								if(userVolume == 0 && $(line).find('td.my_bids.my_size span.value').text()){
									$(line).find('td.my_bids.my_size').addClass('animated fadeOut').find('span.value').text('');
								}
								else if ($(line).find('td.my_bids.my_size span.value').text() != userVolume){
									$(line).find('td.my_bids.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
								}


								setTimeout(function () {
									$(line).find('.fadeOut').removeClass('fadeOut animated');
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
								// debugger;
								// console.log(userVolume);
								if(userVolume == 0 && $(line).find('td.my_offers.my_size span.value').text()){
									$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text('');
								}
								else if ($(line).find('td.my_offers.my_size span.value').text() != userVolume){
									$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
								}

								setTimeout(function () {
									$(line).find('.fadeOut').removeClass('fadeOut animated');
								}, 700);
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (activeData.Symbol.LastBid).toFixed(2))
							{
								bid = (activeData.Symbol.LastBid).toFixed(2) == 0 ? '' : (activeData.Symbol.LastBid).toFixed(2);
								currnetLine.find('td.sell').addClass('best_sell');
								currnetLine.find('td.price_value').addClass('best_sell');
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (activeData.Symbol.LastAsk).toFixed(2))
							{
								ask = (activeData.Symbol.LastAsk).toFixed(2) == 1 ? '' : (activeData.Symbol.LastAsk).toFixed(2);
								currnetLine.find('td.buy').addClass('best_buy');
								currnetLine.find('td.price_value').addClass('best_buy');
							}
						}
						else if(line){
							if (side == 0) {
								$(line).find('td.my_bids.my_size span.value').text('');
								$(line).find('td.sell span.value').text('');
								if($(line).find('td.buy span.value').text() != volume) {
									$(line).find('td.buy span.value').text(volume);
									$(line).find('td.buy').addClass('animated fadeOut');
									$(line).find('td.price_value').addClass('animated fadeOut');
								}
								if(userVolume == 0 && $(line).find('td.my_offers.my_size span.value').text()){
									$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text('');
								}
								else if ($(line).find('td.my_offers.my_size span.value').text() != userVolume){
									$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
								}


								setTimeout(function () {
									$(line).find('.fadeOut').removeClass('fadeOut animated');
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
								if(userVolume == 0 && $(line).find('td.my_bids.my_size span.value').text()){
									$(line).find('td.my_bids.my_size').addClass('animated fadeOut').find('span.value').text('');
								}
								else if ($(line).find('td.my_bids.my_size span.value').text() != userVolume){
									$(line).find('td.my_bids.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
								}


								setTimeout(function () {
									$(line).find('.fadeOut').removeClass('fadeOut animated');
								}, 700);
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (1 - activeData.Symbol.LastAsk).toFixed(2))
							{
								ask = (activeData.Symbol.LastAsk).toFixed(2) == 1 ? '' : (1 - activeData.Symbol.LastAsk).toFixed(2);
								currnetLine.find('td.sell').addClass('best_sell');
								currnetLine.find('td.price_value').addClass('best_sell');
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (1 - activeData.Symbol.LastBid).toFixed(2))
							{
								bid = (activeData.Symbol.LastBid).toFixed(2) == 0 ? '' : (1 -activeData.Symbol.LastBid).toFixed(2);
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
		}
		else{
			$('.open_contracts .quantity').text('0');
			$('.open_pnl .quantity').text('0');
			td.each(function () {
				if($(this).hasClass('size') || $(this).hasClass('my_size'))
					$(this).find('.value').text('');
			});
		}


		if(isMirror){
			trader.find('.join_bid .price').text(ask);
			trader.find('.join_ask .price').text(bid);
		}
		else{
			trader.find('.join_bid .price').text(bid);
			trader.find('.join_ask .price').text(ask);
		}

		tbody.find('tr').each(function () {
			var current = $(this);

			;(function separation() {
				current = current.find('td.price_value');

				current.removeClass('ask bid mid');
				if(current.hasClass('best_sell')){
					className = 'bid';
				}
				current.addClass(className);
					if(current.hasClass('best_buy')){
						if(trader.find('.best_buy').length && trader.find('.best_sell').length )
							className = 'mid';
						else
							className = 'bid';
					}
			})();

		});
		//console.log('========================================================');
		activeTraderClass.scrollTo();
		tbody.addClass('scroll_dis');
		activeTraderClass.buttonActivation($('.active_trader .control input.quantity'));
		activeTraderClass.spreaderChangeVal(trader.find('input.spreader'));
	}
}

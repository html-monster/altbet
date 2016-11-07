class activeTraderControllerClass{
	static updateActiveTraiderData  (data) {
		var trader = $('.active_trader'),
				isMirror,
				lines = $('.active_trader tr.visible'),
				tbody	= $('table.limit tbody'),
				pos = $('.open_contracts .quantity'),
				pnl = $('.open_pnl .quantity'),
				td = tbody.find('td'),
				// bestSell = 0,
				// bestBuy = 1,
				activeData = null,
				bid = '', ask = '',
				className = 'ask';

		if($('#IsMirror').length)
			isMirror = $('#IsMirror').val() == 'False' ? 0 : 1;
		else
			isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;

		if (!trader.attr('id')) return;
		var identificators = trader.attr('id').replace('trader_', '').split('_');

		// console.log(identificators);
		// var td = $('.active_trader table.limit td');



		// td.removeClass('best_sell best_buy');
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
			if(pos.data('Positions')!== activeData.Positions){
				pos.data('Positions', activeData.Positions);
				pos.text(activeData.Positions);
			}
			if(pnl.data('GainLoss')!== activeData.GainLoss){
				if(activeData.GainLoss < 0)
					pnl.removeClass('profit').addClass('loss').text('($' + (activeData.GainLoss).toFixed(2).toString().slice(1) + ')');
				else
					pnl.removeClass('loss').addClass('profit').text('$' + (activeData.GainLoss).toFixed(2));

				pnl.data('GainLoss', activeData.GainLoss);
			}
			if(!activeData.Orders.length){
				td.removeClass('best_sell');
				td.removeClass('best_buy');
			}

			if(isMirror){
				if(activeData.Symbol.LastAsk.toFixed(2) == 1) td.removeClass('best_buy');
				if(activeData.Symbol.LastBid.toFixed(2) == 0) td.removeClass('best_sell');
			}
			else{
				if(activeData.Symbol.LastAsk.toFixed(2) == 1) td.removeClass('best_sell');
				if(activeData.Symbol.LastBid.toFixed(2) == 0) td.removeClass('best_buy');
			}
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
									$(line).find('.fadeOut').removeClass('fadeOut');
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
									$(line).find('.fadeOut').removeClass('fadeOut');
								}, 700);
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (activeData.Symbol.LastAsk).toFixed(2))
							{
								ask = (activeData.Symbol.LastAsk).toFixed(2) == 1 ? '' : (activeData.Symbol.LastAsk).toFixed(2);
								if(!currnetLine.find('td.price_value').hasClass('best_sell')){
									td.removeClass('best_sell');
									currnetLine.find('td.sell').addClass('best_sell');
									currnetLine.find('td.price_value').addClass('best_sell');
								}
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (activeData.Symbol.LastBid).toFixed(2))
							{
								bid = (activeData.Symbol.LastBid).toFixed(2) == 0 ? '' : (activeData.Symbol.LastBid).toFixed(2);
								if(!currnetLine.find('td.price_value').hasClass('best_buy')){
									td.removeClass('best_buy');
									currnetLine.find('td.buy').addClass('best_buy');
									currnetLine.find('td.price_value').addClass('best_buy');
								}
							}
						}
						else if(line){
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
									$(line).find('.fadeOut').removeClass('fadeOut');
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
								if(userVolume == 0 && $(line).find('td.my_offers.my_size span.value').text()){
									$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text('');
								}
								else if ($(line).find('td.my_offers.my_size span.value').text() != userVolume){
									$(line).find('td.my_offers.my_size').addClass('animated fadeOut').find('span.value').text(userVolume);
								}


								setTimeout(function () {
									$(line).find('.fadeOut').removeClass('fadeOut');
								}, 700);
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (1 - activeData.Symbol.LastAsk).toFixed(2))
							{
								ask = (activeData.Symbol.LastAsk).toFixed(2) == 1 ? '' : (1 - activeData.Symbol.LastAsk).toFixed(2);
								if(!currnetLine.find('td.price_value').hasClass('best_buy')){
									td.removeClass('best_buy');
									currnetLine.find('td.buy').addClass('best_buy');
									currnetLine.find('td.price_value').addClass('best_buy');
								}
							}
							if(currnetLine.find('td.price_value span.value').text() == '$' + (1 - activeData.Symbol.LastBid).toFixed(2))
							{
								bid = (activeData.Symbol.LastBid).toFixed(2) == 0 ? '' : (1 - activeData.Symbol.LastBid).toFixed(2);
								if(!currnetLine.find('td.price_value').hasClass('best_sell')){
									td.removeClass('best_sell');
									currnetLine.find('td.sell').addClass('best_sell');
									currnetLine.find('td.price_value').addClass('best_sell');
								}
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
			pos.text('0');
			pnl.removeClass('loss').addClass('profit').text('$0.00');
			td.each(function () {
				if($(this).hasClass('size') || $(this).hasClass('my_size'))
					$(this).find('.value').text('');
			});
			td.removeClass('best_sell');
			td.removeClass('best_buy');
		}

		if(isMirror){
			if(trader.find('.join_bid .price').text() != ask) trader.find('.join_bid .price').text(ask);
			if(trader.find('.join_ask .price').text() != bid) trader.find('.join_ask .price').text(bid);
		}
		else{
			if(trader.find('.join_bid .price').text() != bid) trader.find('.join_bid .price').text(bid);
			if(trader.find('.join_ask .price').text() != ask) trader.find('.join_ask .price').text(ask);
		}
		//
		tbody.find('tr').each(function () {
			var current = $(this);

			(function separation() {
				current = current.find('td.price_value');

				current.removeClass('ask bid mid');
				if(current.hasClass('best_buy'))
					className = 'bid';

				if(!trader.find('.best_buy, .best_sell').length)
					className = 'mid';

				current.addClass(className);
				if(current.hasClass('best_sell')){
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
		activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), true);
		activeTraderClass.spreaderChangeVal(trader.find('input.spreader'));
	}
}

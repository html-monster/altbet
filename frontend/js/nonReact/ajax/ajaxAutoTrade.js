var ajaxAutoTradeClass = new function () {
	function onSuccessAjax(data) {
		data = data.split('_');

		console.log('Order sending finished: ' + data[0]);
	}
	function onErrorAjax(x, y) {
		console.log('XMLHTTPRequest object: ', x);
		console.log('textStatus: ',  y);
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
	this.sendOrder = function(context, modification, price){
		let url,
				data = {},
				trader = $('.active_trader');

		data.Symbol = trader.attr('id').slice(7);
		data.Quantity = $('.active_trader .control .quantity.number').val();
		if($('#IsMirror').length)
			data.isMirror = $('#IsMirror').val() == 'False' ? 0 : 1;
		else
			data.isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;

		if(context.hasClass('sell_mkt') || context.hasClass('buy_mkt')){
			data.OrderType = 'false';
			url = globalData.rootUrl + 'Order/MarketTrading';
		}
		else{
			data.OrderType = 'true';
			data.LimitPrice = price;
			url = globalData.rootUrl + 'Order/Create';//$('.template .order_content.new form').attr('data-ajax-url')
		}

		if(modification == 'sell')
			data.Side = 'Sell';
		else
			data.Side = 'Buy';

		defaultMethods.sendAjaxRequest({
			httpMethod: 'POST',
			callback: onSuccessAjax,
			onError: onErrorAjax,
			url: url,
			data: data});
	};

	this.sendSpreadOrder = function(buyPrice, sellPrice){
		let url = globalData.rootUrl + 'Order/Spreader',
				data = {},
				quantity = $('.active_trader .control .quantity.number').val(),
				trader = $('.active_trader');

		data.Symbol = trader.attr('id').slice(7);
		data.SellOrderQuantity = quantity;
		data.BuyOrderQuantity = quantity;
		data.SellOrderLimitPrice = sellPrice;
		data.BuyOrderLimitPrice = buyPrice;
		if($('#IsMirror').length)
			data.isMirror = $('#IsMirror').val() == 'False' ? 0 : 1;
		else
			data.isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;

		// console.log(data);
		JSON.stringify(data);

		defaultMethods.sendAjaxRequest({
			httpMethod: 'POST',
			callback: onSuccessAjax,
			onError: onErrorAjax,
			url: url,
			data: data});
	}
};

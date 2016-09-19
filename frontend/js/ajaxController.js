class ajaxControllerClass{

	static OnBeginJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&')),
				id = defaultMethods.getId(object);

		console.log('Order sending start: ' + object.Symbol);
		if(object.Side == 'Buy'){
			$('#'+id + ' .buy-container input[type=submit]').attr('disabled', true);
			$('#order_content .buy-container input[type=submit]').attr('disabled', true);
		}
		else{
			$('#'+id + ' .sell-container input[type=submit]').attr('disabled', true);
			$('#order_content .sell-container input[type=submit]').attr('disabled', true);
		}

	}

	static OnSuccessJs(e){
		let serverData = e.split('/'), orderID, sell, buy;

		orderID = '#' + serverData[0];
		orderID += (+serverData[2]) ? '_mirror__order' : '__order' ;
		sell = $(orderID + ' .sell-container');
		buy = $(orderID + ' .buy-container');

		if(sell.children().length && buy.children().length){
			if(+serverData[1])
				sell.html('');
			else
				buy.html('');
		}
		else{
			id.splice(defaultMethods.searchValue(id, orderID.slice(0, -7)), 1);
			$(orderID).remove();
		}

		$('#order_content').remove();
		console.log('Order sending finished: ' + serverData[0]);
		orderClass.showInfo();
	}

	static OnFailureJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&')),
				id = defaultMethods.getId(object),
				element;

		if(object.Side == 'Buy'){
			element = $('#'+id + ' .buy-container');
			$('#'+id + ' .buy-container input[type=submit]').removeAttr('disabled');
			$('#order_content .buy-container input[type=submit]').removeAttr('disabled');
		}
		else{
			element = $('#'+id + ' .sell-container');
			$('#'+id + ' .sell-container input[type=submit]').removeAttr('disabled');
			$('#order_content .sell-container input[type=submit]').removeAttr('disabled');
		}

		console.log('Order isn\'t sending: ' + object.Symbol);
		element.find('.error_pop_up').removeClass('bounceOutRight').addClass('bounceInRight active');
	}

}

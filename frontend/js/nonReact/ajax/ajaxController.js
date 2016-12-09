class ajaxControllerClass{

	static OnBeginJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&')),
				id = defaultMethods.getId(object);
			// console.log($('#'+id));
			// console.log(this);
		if(object.ID)
			console.log('Order sending start: ' + object.ID);
		else
			console.log('Order sending start: ' + object.Symbol);

		if(object.Side == 'Buy'){
			$('#'+id + ' .buy-container [type=submit]').attr('disabled', true);
			$('#order_content .buy-container [type=submit]').attr('disabled', true);
		}
		else{
			$('#'+id + ' .sell-container [type=submit]').attr('disabled', true);
			$('#order_content .sell-container [type=submit]').attr('disabled', true);
		}

	}

	static OnSuccessJs(e){
		let serverData = e.split('/'), orderID, sell, buy;
// console.log(serverData);
		orderID = '#' + serverData[0];
		orderID += (+serverData[2]) ? '_mirror__order' : '__order' ;
		sell = $(orderID + ' .sell-container');
		buy = $(orderID + ' .buy-container');

		// console.log($(orderID));
		// if(!($(orderID).parents('#current-orders').length)){
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
		// }

		$('#order_content').remove();
		console.log('Order sending finished: ' + serverData[0]);
		orderClass.showInfo();
	}

	static OnFailureJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&')),
				id = defaultMethods.getId(object);

		if(object.Side == 'Buy'){
			$('#'+id + ' .buy-container input[type=submit]').removeAttr('disabled');
			$('#order_content .buy-container input[type=submit]').removeAttr('disabled');
		}
		else{
			$('#'+id + ' .sell-container input[type=submit]').removeAttr('disabled');
			$('#order_content .sell-container input[type=submit]').removeAttr('disabled');
		}

		console.log('Order isn\'t sending: ' + object.Symbol);
		// element.find('.error_pop_up').removeClass('bounceOutRight').addClass('bounceInRight active');
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}

}

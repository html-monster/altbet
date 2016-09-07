class ajaxControllerClass{

	static OnBeginJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&')),
				id = defaultMethods.getId(object);

		console.log(id);
		if(object.Side == 'Buy')
			$('#'+id + ' .buy-container input[type=submit]').attr('disabled', true);
		else
			$('#'+id + ' .sell-container input[type=submit]').attr('disabled', true);

	}

	static OnSuccessJs(e){
		let serverData = e.split('/'), order;

console.log(e);
		// if($(this).parents('.default_orders').length && id.length)
		// 	id.splice(defaultMethods.searchValue(id, order.attr('id').slice(0, -7)), 1);
		// order.remove();
		orderClass.showInfo();
	}

	static OnFailureJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&')),
				id = defaultMethods.getId(object),
				element;

		if(object.Side == 'Buy'){
			element = $('#'+id + ' .buy-container');
			$('#'+id + ' .buy-container input[type=submit]').removeAttr('disabled');
		}
		else{
			element = $('#'+id + ' .sell-container');
			$('#'+id + ' .sell-container input[type=submit]').removeAttr('disabled');
		}

		element.find('.error_pop_up').removeClass('bounceOutRight').addClass('bounceInRight active');
	}

}

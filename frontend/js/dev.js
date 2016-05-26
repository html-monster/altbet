$(document).ready(function () {
	var flag = 0,
		flagRevers = 0;

	$('.event-content').each(function () {
		if($(this).hasClass('revers')){
			$(this).attr('id', 'event-revers' + flagRevers++);
		}
		else{
			$(this).attr('id', 'event' + flag++);
		}
	});

	function randomInteger(min, max) {
		var rand,
				flag;
		if(isInteger(min) && isInteger(max)){
			rand = min - 0.5 + Math.random() * (max - min + 1);
			rand = Math.round(rand);
		}
		else{
			rand = min + Math.random() * (max - min);
			rand = rand.toFixed(2);
		}
		// if(!(thisItem == null)){
		// 	rand = min + Math.random() * (max - min);
		// 	if(thisItem.hasClass('number')){
		// 		(isInteger(+thisItem.attr('placeholder'))) ? flag = 1 : flag = 0;
		// 		rand = Math.abs(rand);
		// 		if(flag){
		// 			rand = Math.round(rand);
		// 		}
		// 		else{
		// 			rand = rand.toFixed(2);
		// 		}
		// 	}
		// 	else{
		// 		(isInteger(+thisItem.text())) ? flag = 1 : flag = 0;
		// 		rand = Math.abs(rand);
		// 		if(flag){
		// 			rand = Math.round(rand);
		// 		}
		// 		else{
		// 			rand = rand.toFixed(2);
		// 		}
		// 	}
		// }
		// else{
		// 	rand = min - 0.5 + Math.random() * (max - min + 1);
		// 	rand = Math.round(rand);
		// }
		return rand;
	}



	$('#current-orders span.price').each(function () {
			$(this).text(randomInteger(0.01, 0.99));
	});
	$('#current-orders span.volume').each(function () {
		$(this).text(randomInteger(1, 999))
	});
	$('#current-orders .current-order span').each(function () {
			$(this).text(randomInteger(1, 9999));
	});
	$('#current-orders .last-price').each(function () {
			$(this).text(randomInteger(0.01, 0.99));
	});
	// $('#current-orders .price input.number').each(function () {
	// 	$(this).val(randomInteger(0.01, 0.99, $(this)))
	// });
	// $('#current-orders .volume input.number').each(function () {
	// 	$(this).val(randomInteger(1, 10000, $(this)))
	// });
	// $('#current-orders .obligations input.number').each(function () {
	// 	var price = $(this).parents('form').find('.price input').val(),
	// 			volume = $(this).parents('form').find('.volume input').val();
	// 	$(this).val(+(price * volume).toFixed(2));
	// });

});


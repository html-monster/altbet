;(function tabularMarking() {
	var executedOrders = $('.executed_orders');
	executedOrders.on('mouseenter', 'td.clickable', function () {
		$(this).parents('.executed_orders').find('tr').removeClass('active');
		for(var ii = 0; ii <= $(this).parent().index(); ii++){
			$(this).parents('.executed_orders').find('tr').eq(ii).addClass('active');
		}
	});
	executedOrders.on('mouseleave', 'td.clickable', function () {
		$(this).parents('.executed_orders').find('tr').removeClass('active');
	});
})();

// const Contacts = React.createClass({
// 	render() {
// 		return (
// 				<div></div>
// 		);
// 	}
// });
/*
// var positionControllerClass = new function () {
// 	var htmlTmp, itemTmp;
// 	this.createTemplate = function () {
// 		htmlTmp = $('.pos.tmp').clone();
// 		htmlTmp.removeClass('tmp');
// 		htmlTmp.find('tbody tr').each(function () {
// 			if($(this).index() ==0)
// 				itemTmp = $(this).clone();
//
// 			$(this).remove();
// 		});
// 		$('.my_position_tab .filter_item table').data('ProfitLoss', 0);
// 		$('.my_position_tab .filter_item tbody tr').data('ProfitLoss', 0);
// 	};
// 	this.updateData = function (data) {
// 		// console.log(data);
// 		// let currentOrders = $('.my_position_tab .filter_item table');
// 		$('.my_position_tab .filter_item table').addClass('thisRemoveJs');
// 		$('.my_position_tab .filter_item tbody tr').addClass('thisRemoveJs');
// 		$(data).each(function () {
// 			var item = this,
// 					newItem = true,
// 					html = htmlTmp.clone(),
// 					pl = html.find('th.pl');
//
// 			$('#MyPos_' + item.Category + ' table').each(function () {
// 				var self = $(this),
// 						pl = self.find('th.pl');
//
// 				if(item.Symbol.Exchange == self.attr('id')){
// 					newItem = false;
// 					$(this).removeClass('thisRemoveJs');
// 					if(pl.data('ProfitLoss') != item.CommonSymbolProfitLoss){
// 						if(item.CommonSymbolProfitLoss < 0){
// 							pl.find('span.pl').removeClass('profit').addClass('loss').text('$(' + ((item.CommonSymbolProfitLoss).toFixed(2)).slice(1) + ')');
// 						}
// 						else{
// 							pl.find('span.pl').removeClass('loss').addClass('profit').text('$' + (item.CommonSymbolProfitLoss).toFixed(2));
// 						}
// 						pl.data('ProfitLoss', item.CommonSymbolProfitLoss);
// 					}
// 					if(!self.data().length)
// 						self.data('tagData', item.Symbol);
// 					// console.log(self.find('.current-order span').text());
// 					// console.log(item.Positions);
// 					if(self.find('thead .quantity').text() != item.CommonSymbolVolume) self.find('thead .quantity').text(item.CommonSymbolVolume);
//
// 					$(item.SubPositions).each(function () {
// 						var orderInfo = this,
// 								newItem = true,
// 								order = itemTmp.clone();
//
// 						// console.log(orderInfo);
// 						self.find('tbody tr').each(function () {
// 							let symbolData = (orderInfo.IsMirror) ? orderInfo.ID + '_mirror' : orderInfo.ID;
//
// 							if($(this).attr('data-symbol') == symbolData){
// 								newItem = false;
// 								$(this).removeClass('thisRemoveJs');
// 								// console.log($(this).data());
// 								if($(this).data('orderInfo')){
// 									if($(this).data('orderInfo').Side != orderInfo.Side){
// 										if(orderInfo.Side){
// 											$(this).removeClass('buy').addClass('sell');
// 											$(this).find('td.side').text('Short')
// 										}
// 										else{
// 											$(this).removeClass('sell').addClass('buy');
// 											$(this).find('td.side').text('Long')
// 										}
// 										$(this).data('orderInfo').Side = orderInfo.Side
// 									}
//
// 									// 	console.log(orderInfo.CommonVolume);
// 									// console.log(orderInfo.CommonVolume);
// 									if($(this).data('orderInfo').CommonVolume != orderInfo.CommonVolume){
// 										$(this).find('td.quantity').text(orderInfo.CommonVolume);
// 										$(this).data('orderInfo').CommonVolume = orderInfo.CommonVolume;
// 									}
//
// 									if($(this).data('orderInfo').AvgPrice != (orderInfo.AvgPrice).toFixed(2)){
// 										if($(this).data('orderInfo').IsMirror)
// 											$(this).find('.avg_price').text((1 - (orderInfo.AvgPrice).toFixed(2)).toFixed(2));
// 										else
// 											$(this).find('.avg_price').text((orderInfo.AvgPrice).toFixed(2));
//
// 										$(this).data('orderInfo').AvgPrice = (orderInfo.AvgPrice).toFixed(2);
// 									}
//
// 									if($(this).data('orderInfo').LastAsk != item.Symbol.LastAsk){
// 										if($(this).data('orderInfo').IsMirror)
// 											$(this).find('.spread span.sell').text((1 - item.Symbol.LastAsk).toFixed(2));
// 										else
// 											$(this).find('.spread span.buy').text((item.Symbol.LastAsk).toFixed(2));
//
// 										$(this).data('orderInfo').LastAsk = item.Symbol.LastAsk;
// 									}
//
// 									if($(this).data('orderInfo').LastBid != item.Symbol.LastBid){
// 										if($(this).data('orderInfo').IsMirror)
// 											$(this).find('.spread span.buy').text((1 - item.Symbol.LastBid).toFixed(2));
// 										else
// 											$(this).find('.spread span.sell').text(item.Symbol.LastBid);
//
// 										$(this).data('orderInfo').LastABid= item.Symbol.LastBid;
// 									}
//
// 									if($(this).data('orderInfo').CommonProfitLoss != orderInfo.CommonProfitLoss){
// 										if(orderInfo.CommonProfitLoss < 0){
// 											$(this).find('.pl').removeClass('profit').addClass('loss').text('$(' + ((orderInfo.CommonProfitLoss).toFixed(2)).slice(1) + ')');
// 										}
// 										else{
// 											$(this).find('.pl').removeClass('loss').addClass('profit').text('$' + (orderInfo.CommonProfitLoss).toFixed(2));
// 										}
// 										$(this).data('orderInfo').CommonProfitLoss = orderInfo.CommonProfitLoss;
// 									}
// 								}
// 								else{
// 									$(this).data('orderInfo', orderInfo);
// 									$(this).data('orderInfo').LastAsk = item.Symbol.LastAsk;
// 									$(this).data('orderInfo').LastBid = item.Symbol.LastBid;
// 								}
// 							}
// 						});
// 							// console.log('===========================');
//
// 						if(newItem){
// 							console.log(item);
// 							console.log(orderInfo);
// 							createChild(self.find('tbody'), order, orderInfo);
// 							// console.log(orderInfo.ID);
// 						}
// 					});
// 				}
// 			});
// 			if(newItem){
// 				console.log(data);
// 				console.log(item);
// 				html.data('tagData', item.Symbol);
// 				html.attr('id', item.Symbol.Exchange);
// 				html.find('th.title').text(item.Symbol.HomeName + ' - ' + item.Symbol.AwayName);
//
// 				html.find('thead .quantity').text(item.CommonSymbolVolume);
//
// 				if(item.CommonSymbolProfitLoss < 0){
// 					html.find('span.pl').addClass('loss').text('$(' + ((item.CommonSymbolProfitLoss).toFixed(2)).slice(1) + ')');
// 				}
// 				else{
// 					html.find('span.pl').addClass('profit').text('$' + (item.CommonSymbolProfitLoss).toFixed(2));
// 				}
// 				html.data('ProfitLoss', item.CommonSymbolProfitLoss);
// 				// console.log(self.find('.current-order span').text());
// 				// console.log(item.Positions);
// 				if(html.find('thead .quantity').text() != item.CommonSymbolVolume) self.find('thead .quantity').text(item.CommonSymbolVolume);
//
// 				html.find('.current-order span').text(item.Positions);
// 				$(item.SubPositions).each(function () {
// 					var orderInfo = this,
// 							order = itemTmp.clone();
//
// 					createChild(html.find('tbody'), order, orderInfo);
// 				});
//
//
// 				$('#MyPos_' + item.Category).prepend(html);
// 			}
//
// 		});
// 		// console.log($('#current-orders .thisRemoveJs'));
// 		// $('#current-orders .thisRemoveJs').remove();
// 		// console.log('=======================================');
// 	};
// 	function createChild(context, childTmp, data) {
// 		let dataSymbol = (data.IsMirror) ? data.ID + '_mirror' : data.ID;
// 		// console.log(orderInfo);
// 		childTmp.data('orderInfo', data);
// 		childTmp.data('orderInfo').LastAsk = context.parents('table').data('tagData').LastAsk;
// 		childTmp.data('orderInfo').LastBid = context.parents('table').data('tagData').LastBid;
// 		childTmp.attr('data-symbol', dataSymbol);
// 		childTmp.find('.title').text(data.EventName);
// 		childTmp.find('span.symbol_name').text(data.ID);
//
// 		if(data.Side){
// 			childTmp.addClass('sell');
// 			childTmp.find('td.side').text('Short')
// 		}
// 		else{
// 			childTmp.addClass('buy');
// 			childTmp.find('td.side').text('Long')
// 		}
//
// 		childTmp.find('td.quantity').text(data.CommonVolume);
// 		childTmp.find('td.avg_price').text((data.AvgPrice).toFixed(2));
//
// 		if(data.IsMirror){
// 			childTmp.find('.spread span.sell').text((1 - childTmp.data('orderInfo').LastAsk).toFixed(2));
// 			childTmp.find('.spread span.buy').text((1 - childTmp.data('orderInfo').LastBid).toFixed(2));
// 		}
// 		else{
// 			childTmp.find('.spread span.buy').text((childTmp.data('orderInfo').LastAsk));
// 			childTmp.find('.spread span.sell').text((childTmp.data('orderInfo').LastBid));
// 		}
//
// 		if(data.CommonProfitLoss < 0){
// 			childTmp.find('.pl').addClass('loss').text('$(' + ((data.CommonProfitLoss).toFixed(2)).slice(1) + ')');
// 		}
// 		else{
// 			childTmp.find('.pl').addClass('profit').text('$' + (data.CommonProfitLoss).toFixed(2));
// 		}
//
// 		console.log(data);
// 		if(data.IsMirror)
// 			childTmp.appendTo(context);
// 		else
// 			childTmp.prependTo(context);
// 	}
// };*/

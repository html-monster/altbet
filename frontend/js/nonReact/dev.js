$(document).ready(function () {
	if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru'){
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
		//my position=======================================================================================================
		(function myPosition() {
			for(var ii = 2; ii < 5; ii++){
				let html = $('#tab1').clone(),
						parent = $('#tab1').parents('table');

				html.removeAttr('id').attr('id', 'tab' + ii);
				parent.append(html);
			}
			for(ii = 6; ii < 9; ii++){
				let html = $('#tab5').clone(),
						parent = $('#tab5').parents('table');

				html.removeAttr('id').attr('id', 'tab' + ii);
				parent.append(html);
			}
		})();
		//my position=======================================================================================================


		// $('#current-orders span.price').each(function () {
		// 	$(this).text(defaultMethods.randomInteger(0.01, 0.99));
		// });
		// $('#current-orders span.volume').each(function () {
		// 	$(this).text(defaultMethods.randomInteger(1, 999))
		// });
		// $('#current-orders .current-order span').each(function () {
		// 	$(this).text(defaultMethods.randomInteger(1, 99));
		// });
		// $('#current-orders .last-price').each(function () {
		// 	$(this).text(defaultMethods.randomInteger(0.01, 0.99));
		// });
	}




	// var price = 0.99, html;
	// for(var ii = 1; ii <= 99; ii++){
	// 	html = '<tr class="visible"><td class="my_offers my_size"><span class="value"></span></td><td class="size buy size_buy confim"><span class="container"><span class="value"></span></span></td><td class="price_value"><span class="container"><span class="value">$' + (price).toFixed(2) + '</span></span></td><td class="size sell size_sell confim"><span class="container"><span class="value"></span></span></td><td class="my_bids my_size"><span class="value"></span></td><td></td></tr>';
	// 	$('.left_order .active_trader .limit tbody').append(html);
	// 	price -= 0.01;
	// }

	var currentOrders = $('#current-orders');
	currentOrders.on('click', '.confirmation .yes', function (e) {
		let parent = $(this).parents('.order_content');
// e.preventDefault();

		// if ($(this).parents('.my_order').children().length > 2)
		// 	$(this).parents('.order_container').remove();
		// else
		// 	parent.remove();
	});
	// currentOrders.on('submit', '.confirmation form', function () {
	// 	console.log(123);
	// });
	// currentOrders.on('click', '.order_container .close', function () {
	// 	$(this).parents('.order_content').remove();
	// });

	if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru'){
		let id = 0, setId = 0, orderId = 0;

		$('.my_position_container tbody tr').each(function () {
			$(this).attr('id', 'new_event_' + setId++);
		});
		$('.open_orders tbody tr').each(function () {
			$(this).attr('id', 'event_' + id++);
		});

		for(let ii = 0; ii < 3; ii++){
			let html = $('#current-orders .order_content').eq(0).clone();
			$('#current-orders').append(html);
		}
		$('#current-orders .order_container').each(function () {
			$(this).attr('id', 'event_' + orderId++ + '_order');
		});
	}
	$('.schedule').mousedown(function (e) {
		e.stopPropagation();
	});
	$('a.favorite').click(function (e) {
		e.preventDefault();
		$(this).toggleClass('active');
	});

	new teamClass();
});
if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru'){
	var globalData;
	globalData.userIdentity = 'True';
}
class teamClass{
	constructor(){


		var quantity = $('.content_bet:last-child').index(),
				html = $(document.createElement("div")),
				object = [
					{
						title : 'Chicago Bears (85.2) - 0.7',
						th : ['POS', 'PLAYER', 'FPPG'],
						td : [
							['QB', 'Brian Hoyer', '16,3'],
							['RB', 'Jordan Howard', '12,5'],
							['RB', 'Joique Bell', '0,6'],
							['WR', 'Alshon Jeffery', '12,9'],
							['WR', 'Eddie Royal', '15,8'],
							['WR', 'Deonte Thompson	', '0'],
							['TE', 'Zach Miller', '12,9'],
							['FLEX', 'Jeremy Langford O', '10,1'],
							['DST', 'Bears', '4,8'],
							['Total', '', '85,9']
						]
					},
					{
						title : 'Dallas Cowboys (104.4) + 0.7',
						th : ['POS', 'PLAYER', 'FPPG'],
						td : [
							['QB', 'Dak Prescott', '17,5'],
							['RB', 'Ezekiel Elliott', '18,7'],
							['RB', 'Alfred Morris', '5,7'],
							['WR', 'Cole Beasley', '12,9'],
							['WR', 'T. Williams', '8,2'],
							['WR', 'Brice Butler', '4,4'],
							['TE', 'Jason Witten O', '10'],
							['FLEX', 'Lance Dunbar', '4,4'],
							['DST', 'Cowboys', '4,8'],
							['Total', '', '86,6']
						]
					},
					{
						title : 'New York Giants (105.7) - 7.9',
						th : ['POS', 'PLAYER', 'FPPG'],
						td : [
							['QB', 'Eli Manning', '18,2'],
							['RB', 'Orleans Darkwa', '4,8'],
							['RB', 'Bobby Rainey', '1,7'],
							['WR', 'O. Beckham Jr.', '16,7'],
							['WR', 'Sterling Shepard', '18,1'],
							['WR', 'Victor Cruz', '11,8'],
							['TE', 'Larry Donnell', '6,3'],
							['FLEX', 'Will Tye', '4'],
							['DST', 'Giants', '6'],
							['Total	', '', '87,6']
						]
					},
					{
						title : 'Washington Redskins (107.9) +7.9',
						th : ['POS', 'PLAYER', 'FPPG'],
						td : [
								['QB', 'Kirk Cousins', '18,8'],
								['RB', 'Matt Jones', '13,1'],
								['RB', 'Chris Thompson', '8,8'],
								['WR', 'DeSean Jackson', '12,1'],
								['WR', 'Jamison Crowder', '12,4'],
								['WR', 'Pierre Garcon', '8,6'],
								['TE', 'Jordan Reed', '15,8'],
								['FLEX', 'Rob Kelley', '0,6'],
								['DST', 'Redskins', '5,3'],
								['Total', '', '95,5'],
						]
					},
					{
						title : 'Buffalo Bills (73.9) -3.7',
						th : ['POS', 'PLAYER', 'FPPG'],
						td : [
								['QB', 'Tyrod Taylor', '16.1'],
								['RB', 'LeSean McCoy', '19.9'],
								['RB', 'Jerome Felton', '0.0'],
								['WR', 'Robert Woods', '6.4'],
								['WR', 'Marquise Goodwin', '7.9'],
								['WR', 'Walt Powell', '2.9'],
								['TE', 'Charles Clay', '4.6'],
								['FLEX', 'Mike Gillislee', '3.8'],
								['DST', 'Bills', '12.3'],
								['Total', '', '73.9']
						]
					},
					{
						title : 'New England Patriots (77.6)  +3.7',
						th : ['POS', 'PLAYER', 'FPPG'],
						td : [
								['QB', 'Jacoby Brissett', '9.9'],
								['RB', 'L. Blount', '19.6'],
								['RB', 'James White', '5.6'],
								['WR', 'Julian Edelman', '13.0'],
								['WR', 'Chris Hogan', '8.7'],
								['WR', 'Matthew Slater', '0.0'],
								['TE', 'M. Bennett', '11.1'],
								['FLEX', 'Rob Gronkowski', '0.0'],
								['DST', 'Patriots', '9.7'],
								['Total', '', '77.6']
						]
					}
	];

		html.addClass('help').html('<div class="help_message"><strong></strong><table><thead></thead><tbody></tbody></table></div>');

		// $('.schedule').mouseup(function (e) {
		// 	e.stopPropagation();
		// });
		// $('.content_bet').each(function () {
		// 	$(this).css('z-index', quantity--)
		// });
		$(object).each(function () {
			var self = this;

			$('.content_bet h2').each(function () {
				var title = $(this).text().split(')');

				title = title[0];//.replace(/([\s]{2})/g, '');
				if(self.title.split(')')[0] == title){
					var hoverHtml = html.clone();

					hoverHtml.find('strong').text(self.title);
					$(self.th).each(function () {
						var th = $(document.createElement("th"));

						th.text(this);
						hoverHtml.find('thead').append(th);
					});
					$(self.td).each(function () {
						var tr = $(document.createElement("tr"));


						$(this).each(function () {
							var td = $(document.createElement("td"));

							td.html('<span></span>');
							td.find('span').text(this);
							tr.append(td);
						});
						hoverHtml.find('tbody').append(tr);
					});
					$(this).append(hoverHtml);
				}
			});
		});
	}
}

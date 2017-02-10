class tabsClass{
	constructor(){
		this.defaultTab = function () {
			let tab = $('.tab');


			// BM: change active tab
			tab.click(function ()
			{
				let tabContainer = $(this).parent(),
						itemContainer = tabContainer.next();
				if(!($(this).attr('data-disabled'))){
					tabContainer.children('.tab').removeClass("active").eq($(this).index()).addClass("active");
					itemContainer.children('.tab_item').removeClass('active').hide().eq($(this).index()).fadeIn();
				}
			});
		}();
	}


	static tabsChangeAnimate(container, animated_row){
		$(container).find('.wrapper .tab').click(function () { //$(".nav_items .wrapper .tab")
			$(container).find('.wrapper .tab').removeClass("active").eq($(this).index()).addClass("active");
			let item = $(container).find('.tab_item'),
					ii = 1;
			item.find(animated_row).css('display', 'none'); //'.content_bet'
			item.hide().eq($(this).index()).show().find(animated_row).each(function(){
				$(this).delay(50 * ii).css({display: 'flex', opacity: 0, marginTop: '10px'}).animate({
					opacity: '1',
					marginTop: '2px'
				}, 300);
				ii++;
			});
			ii = 1;
		}).eq(0).addClass("active");
	}

	// static tabFilter(filterContainer){
	// 	$(filterContainer).find('input[type="checkbox"]').change(function(){
	// 		let current_div = $('#'+$(this).val());
	// 	0||console.log( 'here', 0 );
    //
	// 		if($(this).is(':checked'))
	// 			current_div.addClass('active');
	// 		else
	// 			current_div.removeClass('active');
	// 	});
	// }
}


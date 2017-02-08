class tabsClass{
	constructor(){
		this.defaultTab = function () {
			let tab = $('.tab');

			
			tab.click(function () 
			{
				0||console.debug( 'here', 0 );
				let tabContainer = $(this).parent(),
						itemContainer = tabContainer.next();
				if(!($(this).attr('data-disabled'))){
					tabContainer.children('.tab').removeClass("active").eq($(this).index()).addClass("active");
					itemContainer.children('.tab_item').removeClass('active').hide().eq($(this).index()).fadeIn();
				}
			});
			// tab.each(function () {
			// 	let self = $(this);
			// 	if(self.hasClass('active')){
			// 		let index = self.index();
			//
			// 		self.parents('.tabs').next('.tab_content').children('.tab_item').hide().eq($(this).index()).show()
			// 	}
			// });
			//tab.parent().find('.tab:first-child').addClass("active");
		}();
	}
	// static tabsChange(container, tab, tab_item) {
	// 	tab = tab || '.tab';
	// 	tab_item = tab_item || '.tab_item';
	// 	$(container).find(tab).click(function() {
	// 		if($(this).attr('data-disabled')) return false;
	// 		$(container).find(tab).removeClass("active").eq($(this).index()).addClass("active");
	// 		$(container).find(tab_item).hide().eq($(this).index()).fadeIn();
	// 	}).eq(0).addClass("active");
	// }

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


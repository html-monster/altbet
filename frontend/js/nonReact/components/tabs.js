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


	// анимация рынков на главной
	static tabsChangeAnimate(container, animated_row){

        var itemsAnimation = function (items)
        {
            let ii = 1;
            items.find(animated_row).css('display', 'none'); //'.content_bet'
            items.hide().eq($(this).index()).show().find(animated_row).each(function(){
                $(this).delay(50 * ii).css({display: 'flex', opacity: 0, marginTop: '10px'}).animate({
                    opacity: '1',
                    marginTop: '2px'
                }, 300);
                ii++;
            });
            ii = 1;
        };


        $(container).find('.wrapper .tab').click(function ()
        {
			let items = $(container).find('.tab_item');

			$(container).find('.wrapper .tab').removeClass("active").eq($(this).index()).addClass("active");

			itemsAnimation(items);
        }).eq(0).addClass("active");

        itemsAnimation($(container).find('.tab_item'));
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


class tabsClass
{
	constructor()
	{
		this.apply();
	}


	// BM: анимация рынков на главной
/*
	static tabsChangeAnimate(container, animated_row){

        var itemsAnimation = function (items)
        {
            let ii = 1;
            items.find(animated_row).css('display', 'none'); //'.content_bet'
            // items.hide().eq($(this).index()).show().find(animated_row).each(function(){
            items.show().find(animated_row).each(function(){
				$(this).addClass('list-animate2');
				setInterval(() => {
					$(this).addClass('animate2'); // /!*.delay(100 * ii)*!/.animate({}, 1500, function() { $(this).addClass('animate2') });
				}, 100 * ii);
				ii++;
                // .css({display: 'flex', opacity: 0, marginTop: '10px'}).animate({
                //     opacity: '1',
                //     marginTop: '2px'
                // }, 300);
            });
            ii = 1;
        };


        $(container).find('.wrapper .tab').click(function ()
        {
			let items = $(container).find('.tab_item');

			$(container).find('.wrapper .tab').removeClass("active").eq($(this).index()).addClass("active");

			itemsAnimation(items);
        }).eq(0).addClass("active");

        setTimeout(() => itemsAnimation($(container).find('.tab_item')), 2000);
	}
*/


    /**
     * @public
     */
	apply(context)
	{
		context = context ? $(context) : $('body');

		let tab = $('.tab:not(.custom)', context);

		// BM: change active tab
		tab.click(function ()
		{
			let tabContainer = $(this).parent();
			let itemContainer = tabContainer.next();

			if( !($(this).attr('data-disabled')) )
			{
				tabContainer.children('.tab').removeClass("active").eq($(this).index()).addClass("active");
				itemContainer.children('.tab_item').removeClass('active').hide().eq($(this).index()).fadeIn();
			}
		});
	}
}


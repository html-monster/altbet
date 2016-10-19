class modeSwitchClass{
	constructor(){
		function checkMode(context){
			if($(context).prop('checked')){
				$(context).parent().find('span').text('Expert Mode');
				$('.content_bet').removeClass('basic_mode_js');
				$('.mode_info_js').hide();
				$('.content_bet button').each(function () {
					var price = $(this).find('.price:not(.empty)').text();
					$(this).find('.price:not(.empty)').text(price.slice(1));
				});
				globalData.basicMode = false;
			}
			else{
				$(context).parent().find('span').text('Basic Mode');
				$('.content_bet').addClass('basic_mode_js');
				$('.mode_info_js').show();
				$('.content_bet button').each(function () {
					var price = $(this).find('.price:not(.empty)').text();
					$(this).find('.price:not(.empty)').text('$' + price);
				});
				globalData.basicMode = true;

			}
		}
		checkMode('.mode_switch input');
		$('.mode_switch input').change(function () {
			let self = this;
			checkMode(self);
		});
	}
}
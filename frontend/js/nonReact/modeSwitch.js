class modeSwitchClass{
	constructor(){
		// if(localStorage.tradingMode){
		// 	if(localStorage.tradingMode == 'expert')
		// 		$('.mode_switch input').prop('checked', true);
		// 	else
		// 		$('.mode_switch input').prop('checked', false);
		// }
		// else{
		// 	if($('.mode_switch input').prop('checked'))
		// 		localStorage.tradingMode = 'expert';
		// 	else
		// 		localStorage.tradingMode = 'basic';
		// }

		// checkMode('.mode_switch input');
		$('.mode_switch input').change(function () {
			let self = this;
			modeSwitchClass.checkMode(self);
		});
	}

	static checkMode(context){
		if($(context).prop('checked')){
			$(context).parent().find('span').text('Expert Mode');
			$('.content_bet').removeClass('basic_mode_js');
			// $('.mode_info_js').hide();
			$('.content_bet button').each(function () {
				var price = $(this).find('.price:not(.empty)').text();
				$(this).find('.price:not(.empty)').text(price.replace('$', ''));
			});
			globalData.basicMode = false;

			ABpp && (ABpp.config.basicMode = false);
			// localStorage.setItem('tradingMode', 'expert');
		}
		else{
			$(context).parent().find('span').text('Basic Mode');
			$('.content_bet').addClass('basic_mode_js');
			// $('.mode_info_js').show();
			$('.content_bet button').each(function () {
				var price = $(this).find('.price:not(.empty)').text().replace('$', '');
				$(this).find('.price:not(.empty)').text('$' + price);
			});
			globalData.basicMode = true;

			ABpp && (ABpp.config.basicMode = true);
			// localStorage.setItem('tradingMode', 'basic');
		}
	}
}
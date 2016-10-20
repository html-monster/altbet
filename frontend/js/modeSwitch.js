class modeSwitchClass{
	constructor(){
		function checkMode(context){
			if($(context).prop('checked')){
				$(context).parent().find('span').text('Expert Mode');
				$('.content_bet').removeClass('basic_mode_js');
				$('.mode_info_js').hide();
				$('.content_bet button').each(function () {
					var price = $(this).find('.price:not(.empty)').text();
					$(this).find('.price:not(.empty)').text(price.replace('$', ''));
				});
				globalData.basicMode = false;
				localStorage.setItem('tradingMode', 'expert');
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
				localStorage.setItem('tradingMode', 'basic');
			}
		}
		if(localStorage.tradingMode == 'expert')
			$('.mode_switch input').prop('checked', true);
		else
			$('.mode_switch input').prop('checked', false);

		checkMode('.mode_switch input');
		$('.mode_switch input').change(function () {
			let self = this;
			checkMode(self);
		});
	}
}
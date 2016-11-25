class AppStateClass{
	static updateAppState(stateParams){
		if(stateParams){
			let modeSwitch = $('.mode_switch input'),
					traderCheckbox = $('.left_order .tab input.limit'),
					autoTrade = $('.left_order .tab input.auto');

			if(stateParams.Mode && stateParams.Mode == 'basic'){
				modeSwitch.prop('checked', false);
				globalData.basicMode = true;
				modeSwitchClass.checkMode(modeSwitch);
			}
			else{
				modeSwitch.prop('checked', true);
				globalData.basicMode = false;
				modeSwitchClass.checkMode(modeSwitch);
			}
			if(stateParams.Theme && stateParams.Theme == 'dark')
				themeChangeClass.setColorScheme($('.change-color button'), 'dark');
			else
				themeChangeClass.setColorScheme($('.change-color button'), 'light');

			if(stateParams.Bettor && stateParams.Bettor == "false"){
				traderCheckbox.prop('checked', false);
				autoTrade.parent().fadeIn(200);
				globalData.tradeOn = false;
				activeTraderClass.traderOnCheck(traderCheckbox);
			}
			else{
				traderCheckbox.prop('checked', true);
				autoTrade.parent().fadeOut(200);
				globalData.tradeOn = true;
				activeTraderClass.traderOnCheck(traderCheckbox);
			}
			if(stateParams.trade && stateParams.trade == "false"){
				autoTrade.prop('checked', false);
				globalData.autoTradeOn = false;
			}
			else{
				autoTrade.prop('checked', true);
				globalData.autoTradeOn = true;
			}
		}
	}
}

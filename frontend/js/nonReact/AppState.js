class AppStateClass{
	static updateAppState(stateParams){
		if(stateParams){
			let tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href');

			if(stateParams.Mode && stateParams.Mode == 'basic'){
				$('.mode_switch input').prop('checked', false);
				globalData.basicMode = true;
			}
			else{
				$('.mode_switch input').prop('checked', true);
				globalData.basicMode = false;
			}
			if(stateParams.Theme && stateParams.Theme == 'dark')
				themeChangeClass.setColorScheme('dark');
			else
				themeChangeClass.setColorScheme('light');

			if(stateParams.Bettor && stateParams.Bettor == "false"){
				$('.left_order .tab input.limit').prop('checked', false);
				globalData.tradeOn = false;
			}
			else{
				$('.left_order .tab input.limit').prop('checked', true);
				globalData.tradeOn = true;
			}
			if(stateParams.trade && stateParams.trade == "false")
				$('.left_order .tab input.auto').prop('checked', false);
			else
				$('.left_order .tab input.auto').prop('checked', true);
		}
	}
}

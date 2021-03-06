class ajaxThemeChangeClass{
	constructor(){
		let data = {};
		$('.change-color button').click(function (event)
		{
			event.preventDefault();

			if($(this).hasClass('dark') && !$(this).parent().find('.dark').hasClass('active')){
				data.Theme = 'dark';
			}
			else if($(this).hasClass('light') && !$(this).parent().find('.light').hasClass('active')){
				data.Theme = 'light';
			}
			else
				return false;

			if(globalData.userIdentity === 'True')
				defaultMethods.sendAjaxRequest({
					httpMethod: 'POST',
					callback: onSuccessAjax,
					onError: onErrorAjax,
					url: `${globalData.rootUrl}Account/EditTheme`,
					data: data});
			else
				themeChangeClass.setColorScheme($('.change-color button'), data.Theme);
		});

		function onSuccessAjax(e) {
			if(e)
				defaultMethods.showError(e);
			else
				themeChangeClass.setColorScheme($('.change-color button'), data.Theme);
		}
		function onErrorAjax(x, y) {
			console.log('XMLHTTPRequest object: ', x);
			console.log('textStatus: ',  y);
			defaultMethods.showError('The connectionhas been lost. Please check your internet connection or try again.');
		}
	}


	// static onBeginAjax(){
	// 	console.log('begin');
	// }
	//
	// static onSuccessAjax(e){
	// 	console.log(e);
	// }
	//
	// static onErrorAjax(){
	// 	console.log('failure');
	//
	// }
}

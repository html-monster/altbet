class ajaxThemeChangeClass{
	constructor(){
		let data = {};
		$('.change-color button').click(function () {
			if($(this).hasClass('dark') && !$(this).parent().find('.dark').hasClass('active')){
				data.Theme = 'dark';
			}
			else if($(this).hasClass('light') && !$(this).parent().find('.light').hasClass('active')){
				data.Theme = 'light';
			}
			else
				return false;

			if(globalData.userIdentity == 'True')
				defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, `${globalData.rootUrl}Account/EditTheme`, null, data);
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
			defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
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

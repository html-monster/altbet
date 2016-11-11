class ajaxThemeChangeClass{
	constructor(){
		let data = {
			IsMode: null,
			IsBettor: null,
			IsTrade: null
		};
		$('.change-color button').click(function () {
			if($(this).hasClass('dark') && !$(this).hasClass('active')){
				data.Theme = 'dark';
			}
			else if(!$(this).parent().find('.light').hasClass('active')){
				data.Theme = 'light';
			}
			else
				return false;

			defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, `${globalData.rootUrl}Account/EditUser`, null, data);
		});

		function onSuccessAjax(data) {
			console.log(data);
			if(data){

			}
			else
				themeChangeClass.setColorScheme($(this), data.Theme);
		}
		function onErrorAjax(x, y, z) {
			console.dir('XMLHTTPRequest object: ', x);
			console.dir('textStatus: ',  y);
			console.dir('errorThrown: ',  z);
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

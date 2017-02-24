class ajaxPreferencesClass{
	static onSuccessAjax(e){
		let message = $('.wrapper_user_page .preferences .answer_message');
		if(e){
			message.removeClass('valid').addClass('validation-summary-errors').text(e);
		}
		else
			message.removeClass('validation-summary-errors').addClass('valid').text('Your data has been successfully updated');

		setTimeout(() => {
			message.removeClass('valid validation-summary-errors').text('');
		}, 5000);
	}

	static onErrorAjax(x, y){
		console.log('XMLHTTPRequest object: ', x);
		console.log('textStatus: ',  y);
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
}

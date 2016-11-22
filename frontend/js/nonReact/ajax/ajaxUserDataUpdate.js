class ajaxUserDataUpdate{
	static OnSuccessJs(e){
		let message = $('.wrapper_user_page .setting_form .answer_message');
		if(e){
			message.removeClass('valid').addClass('validation-summary-errors').text(e);
			$('.wrapper_user_page #user_curr_pass').removeClass('valid').addClass('input-validation-error')
		}
		else{
			message.removeClass('validation-summary-errors').addClass('valid')
						 .text('Your data was successfully changed');
		}

		setTimeout(() => {
			message.removeClass('valid validation-summary-errors').text('');
		}, 5000);
	}

	static OnFailureJs(x, y){
		console.log('XMLHTTPRequest object: ', x);
		console.log('textStatus: ',  y);
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
}

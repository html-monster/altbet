class ajaxChangePassClass{

	static onBeginAjax(){
		console.log('begin');
	}

	static onSuccessAjax(e){
		let message = $('.wrapper_user_page .change_password .answer_message');
		if(e){
			message.removeClass('valid').addClass('validation-summary-errors').text(e);
		}
		else{
			message.removeClass('validation-summary-errors').addClass('valid')
						 .text('You password was successfully changed');

			setTimeout(() => {
				$('.wrapper_user_page .change_password [type=password]').removeClass('validation-summary-errors valid').val('');
				$('.wrapper_user_page .change_password .validation-summary-errors').text('');
			}, 100);
		}

		setTimeout(() => {
			message.removeClass('valid validation-summary-errors').text('');
		}, 5000);
	}

	static onErrorAjax(x, y, z){
		console.dir('XMLHTTPRequest object: ', x);
		console.dir('textStatus: ',  y);
		console.dir('errorThrown: ',  z);
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
}
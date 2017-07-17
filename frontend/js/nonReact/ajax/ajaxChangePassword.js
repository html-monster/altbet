// class ajaxChangePassClass{
//
// 	// static onBeginAjax(){
// 	// 	console.log('begin');
// 	// }
//
// 	static onSuccessAjax(e){
// 		let message = $('.wrapper_user_page .change_password .answer_message');
// 		if(e.Error){
// 			message.removeClass('validJs').addClass('validation-summary-errors').text(e.Error);
// 			$('.wrapper_user_page #user_curr_pass').removeClass('validJs').addClass('invalidJs')
// 		}
// 		else if(e.ErrorUpdate)
// 			message.removeClass('validJs').addClass('validation-summary-errors').text(e.ErrorUpdate);
// 		else{
// 			message.removeClass('validation-summary-errors').addClass('validJs')
// 						 .text('Your password was successfully changed');
//
// 			setTimeout(() => {
// 				$('.wrapper_user_page .pass_container').removeClass('input--filled');
// 				$('.wrapper_user_page .change_password [type=password]').removeClass('validation-summary-errors validJs valid').val('');
// 				$('.wrapper_user_page .change_password .validation-summary-errors').text('');
// 			}, 100);
// 		}
//
// 		setTimeout(() => {
// 			message.removeClass('valid validation-summary-errors').text('');
// 		}, 5000);
// 	}
//
// 	static onErrorAjax(x, y){
// 		console.log('XMLHTTPRequest object: ', x);
// 		console.log('textStatus: ',  y);
// 		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
// 	}
// }
// class ajaxUserDataUpdate{
// 	static OnSuccessJs(e){
// 		let message = $('.wrapper_user_page .setting_form .answer_message');
// 		if(e){
// 			message.removeClass('validJs').addClass('invalidJs').text(e);
// 			$('.wrapper_user_page #user_curr_pass').removeClass('validJs').addClass('invalidJs')
// 		}
// 		else{
// 			message.removeClass('invalidJs').addClass('validJs')
// 						 .text('Your data was successfully changed');
// 		}
//
// 		setTimeout(() => {
// 			message.removeClass('validJs invalidJs').text('');
// 		}, 5000);
// 	}
//
// 	static OnFailureJs(x, y){
// 		console.log('XMLHTTPRequest object: ', x);
// 		console.log('textStatus: ',  y);
// 		defaultMethods.showError('The connectionhas been lost. Please check your internet connection or try again.');
// 	}
// }

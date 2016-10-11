class ajaxLoginControllerClass{
	constructor(){
		$('.sign_in_form .input__field').keydown(function () {
			if($('.sign_in_form .wrong_log').length){
				$('[data-valmsg-for=UserIdentity]').removeClass('wrong_log');
				$('.sign_in_form .input__field').removeClass('input-validation-error');
				$('.sign_in_form .input_animate').removeClass('invalid');
			}
		});
	}
	static OnBeginJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&'));

		$('#submit_sign').attr('disabled', true);
		console.log('User "' + object.UserIdentity + '" try to enter the site');
	}

	static OnSuccessJs(e){
		if(!e.Error){
			popUpClass.closePopUp('.sign_in_form');
			console.log('Welcome to hell }:-)');
			$('#submit_sign').removeAttr('disabled');
			$('header .log_out').removeClass('active');
			$('header .log_in').addClass('active');
			$('header .log_in .user-name').text(e.UserName);
			$('header .user_info').show();
			$('.left_order .tab input.limit').removeAttr('disabled');
			popUpClass.removeEventPopUp('header .deposit, header .my_order');
			globalData.userIdentity = 'True';
		}
		else{
			$('.sign_in_form .input_animate').addClass('invalid');
			$('#submit_sign').removeAttr('disabled');
			$('[data-valmsg-for=UserIdentity]').text('Wrong password or nickname').addClass('wrong_log');
			$('.sign_in_form .input__field').addClass('input-validation-error').removeClass('valid');
		}
	}

	static OnFailureJs(){
		$('#submit_sign').removeAttr('disabled');
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
}

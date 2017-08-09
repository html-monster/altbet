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

		$('#submit_sign_in').attr('disabled', true);
		console.log('User "' + object.UserIdentity + '" try to enter the site');
	}

	static OnSuccessJs(e){
		if (!e.Error && e.UserName) {
			popUpClass.nativePopUpClose('.sign_in_form');
			console.log('Welcome to hell }:-)');
			$('#submit_sign_in').removeAttr('disabled');
			// $('header .log_out').removeClass('active');
			// $('header .log_in').addClass('active');
			// $('header .log_in .user-name').text(e.UserName);
			// $('header .user_info').show();
			// $('.left_order .tab').removeAttr('data-disabled');
			// $('.left_order .tab input.limit').removeAttr('disabled');
			// popUpClass.removeEventPopUp('header .deposit, header .my_order');
			// globalData.userIdentity = 'True';

			if(!globalData.landingPage) AppStateClass.updateAppState(e);
			if(!globalData.landingPage) ABpp.Websocket.changeUser(e.UserName);
			// if(!globalData.landingPage) wsActiveBettor.changeUser(e.UserName);
			else{
				$('.first_page_wrapper button.join').remove();
				$('.first_page_wrapper .container_down').append('<a href="' + globalData.rootUrl + '" class="join_link btn wave">Trade Now</a>');
				location.href = globalData.rootUrl;
			}
		} else {
			$('.sign_in_form .input_animate').addClass('invalid');
			$('#submit_sign_in').removeAttr('disabled');
			$('[data-valmsg-for=UserIdentity]').text(e.Error).addClass('wrong_log');
			$('.sign_in_form .input__field').addClass('input-validation-error').removeClass('valid');
		}
	}

	static OnFailureJs(){
		$('#submit_sign_in').removeAttr('disabled');
		defaultMethods.showError('The connection has been lost. Please check your internet connection or try again.');
	}
}

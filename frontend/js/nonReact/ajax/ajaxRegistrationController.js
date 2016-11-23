class ajaxRegistrationControllerClass{
	constructor(){
		$('.sign_up_form form').submit(function () {
			if(!(checkAreement('agreement', $(this)) && checkAreement('agreement_age', $(this)))) return false;
		});
		function checkAreement(item, context){
			if(context.find(`#${item}`).prop('checked')) return true;
			else{
				context.find(`.agreement label[for=${item}]`).addClass('animated shake');
				setTimeout(() => {
					context.find(`.agreement label[for=${item}]`).removeClass('animated shake');
				}, 500);
				return false;
			}
		}
	}
	static OnBeginJs(){
		let object = defaultMethods.objectFromArray(this.data.split('&'));

		// $('#submit_sign_up').attr('disabled', true);
		console.log(object);
		// console.log('User "' + object.UserIdentity + '" try to enter the site');
	}

	static OnSuccessJs(e){
		ajaxLoginControllerClass.OnSuccessJs(e);
		if (!e.Error && e.UserName) {
			console.log(111);
		}
		else{
			console.log(222);
		}
		// if (!e.Error && e.UserName) {
		// 	popUpClass.closePopUp('.sign_in_form');
		// 	console.log('Welcome to hell }:-)');
		// 	$('#submit_sign').removeAttr('disabled');
		// 	$('header .log_out').removeClass('active');
		// 	$('header .log_in').addClass('active');
		// 	$('header .log_in .user-name').text(e.UserName);
		// 	$('header .user_info').show();
		// 	$('.left_order .tab').removeAttr('data-disabled');
		// 	$('.left_order .tab input.limit').removeAttr('disabled');
		// 	popUpClass.removeEventPopUp('header .deposit, header .my_order');
		// 	globalData.userIdentity = 'True';
		// 	AppStateClass.updateAppState(e);
		// 	if(!globalData.landingPage) wsActiveBettor.changeUser(e.UserName);
		// 	else{
		// 		$('.first_page_wrapper button.join').remove();
		// 		$('.first_page_wrapper .container_down').append('<a href="' + globalData.rootUrl + '" class="join_link btn wave">Trade Now</a>');
		// 		location.href = globalData.rootUrl;
		// 	}
		// } else {
		// 	$('.sign_in_form .input_animate').addClass('invalid');
		// 	$('#submit_sign').removeAttr('disabled');
		// 	$('[data-valmsg-for=UserIdentity]').text(e.Error).addClass('wrong_log');
		// 	$('.sign_in_form .input__field').addClass('input-validation-error').removeClass('valid');
		// }
	}

	static OnFailureJs(){
		$('#submit_sign_up').removeAttr('disabled');
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
}

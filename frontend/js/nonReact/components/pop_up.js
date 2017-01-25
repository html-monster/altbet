class popUpClass{
	constructor(){
		$(document).keyup(function (e) {
			e = e || event;
			if(e.keyCode == 27){
				$('.pop_up').fadeOut();
				$('body>.wrapper').removeClass('blur');
				$('.video_form iframe').removeAttr('src', '');
				$('#order_content').remove();
				$('.confirm_window').removeClass('bounceInUp').addClass('bounceOutDown');
				setTimeout(() => {
					$('.confirm_window').removeClass('active');
				}, 500);
			}
			// if(e.keyCode == 49){
			// 	console.log(1);
			// 	defaultMethods.showError();
			// }
		});
		console.log("browser version: " + $.browser.version.slice(0, 2)); // EDGE В ВЕРСИИ 50 МОГУТ ПОЛЕЗТЬ БАГИ
	}
	static popUpClose(closeButton, ...popUpWindow){ //.head_form .close

		$(closeButton).click(callback);
		function callback(e) {
			e = e || event;
			e.preventDefault();
			popUpWindow.forEach(function (item) {
				$(item).fadeOut(200).removeClass('active'); //.sign_in_form
			});
			if (!$('.pop_up').hasClass('active'))
				$('body>.wrapper').removeClass('blur');
		}
	}

	static popUpOpen(openButton, popUpWindow, focusElement){
		let browser = $.browser.chrome && ($.browser.version.slice(0, 2) > 50) || $.browser.mozilla;

		$(openButton).click(callback);
		function callback(e) {
			e = e || event;
			e.preventDefault();
			$(popUpWindow).addClass('active').fadeIn(200);  //'.sign_in_form'
			$(focusElement).focus(); //'#email'

			if (browser)
				$('body>.wrapper').addClass('blur');

			if($(this).parent('.video').length){
				var ru = 'https://www.youtube.com/embed/Gv491v-RGPA?autoplay=1',
						eng = 'https://www.youtube.com/embed/i0hV6e9Cph4?autoplay=1';

				if($(this).hasClass('ru'))
					$('.video_form iframe').attr('src', ru);
				else
					$('.video_form iframe').attr('src', eng);
			}
		}
	}

	static globalPopUpClose(popUp, method, ...target){
		$(document).click(callback);
		function callback(e) {
			e = e || event;
			if(target.length){
				if(target.some((element) =>  $(e.target).closest(element).length != 0))
					return;
			}
			$(popUp).removeClass('active');

			if (!$('.pop_up').hasClass('active')){
				$('body>.wrapper').removeClass('blur');
				$('.video_form iframe').removeAttr('src', '');
			}

			if(method == 'slideUp')
				$(popUp).slideUp(400);
			else
				$(popUp).fadeOut(400);
		}
	}

	static nativePopUpClose(popUp){
		$(popUp).removeClass('active').fadeOut(400);
		$('body>.wrapper').removeClass('blur');
	}

	static nativePopUpOpen(popUp){
		let browser = $.browser.chrome && ($.browser.version.slice(0, 2) > 50) || $.browser.mozilla;
		$(popUp).addClass('active').fadeIn(200);
		if (browser)
			$('body>.wrapper').addClass('blur');
	}

	static removeEventPopUp(element){
		$(element).unbind('click');
	}
}

new popUpClass();
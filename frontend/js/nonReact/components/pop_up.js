class popUpClass{
	constructor(){
		$(document).keyup(function (e) {
			e = e || event;
			if(e.keyCode == 27){
				$('.pop_up').fadeOut();
				// $('body>.wrapper').removeClass('blur');
				$('.video_form iframe').removeAttr('src', '');
				// $('#order_content').remove();
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
	static popUpClose(closeButton, method, ...popUpWindow)
	{
		$(closeButton).click(callback);
		function callback(e)
		{
			// return scrolling
			// $('body').removeClass('no-scroll');

			e = e || event;
			e.preventDefault();
			popUpWindow.forEach(function (item) {
				if(method == 'slideUp')
					$(item).slideUp(400);
				else if(method == 'hide')
					$(item).hide();
				else
					$(item).fadeOut(400);

				$(item).removeClass('active');
			});
			// if (!$('.pop_up').hasClass('active'))
			// 	$('.blur').removeClass('blur');
		}
	}

	static popUpOpen(openButton, popUpWindow, focusElement)
	{
		let browser = $.browser.chrome && ($.browser.version.slice(0, 2) > 53) || $.browser.mozilla;
		$(openButton).click(callback);
		function callback(e)
		{
			// disable scrolling while popuped
			setTimeout(() => $('body').addClass('no-scroll'), 100);

			e = e || event;
			e.preventDefault();
			$(popUpWindow).addClass('active').fadeIn(200);
			$(focusElement).focus(); //'#email'

			// if (browser)
			// 	$('body>.wrapper').addClass('blur');

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

	static globalPopUpClose(popUp, method, ...target)
	{
		$(document).click(callback);
		// $(document).on('click', callback);
		function callback(e)
		{
			e = e || event;
			if(target.length){
				if(target.some((element) =>  $(e.target).closest(element).length != 0))
					return;
			}

			// return scrolling
			if($(popUp).hasClass('active'))
			{
				$('body').removeClass('no-scroll');
				$(popUp).removeClass('active');
				if(method == 'slideUp')
					$(popUp).slideUp(400);
				else if(method == 'hide')
					$(popUp).hide();
				else
					$(popUp).fadeOut(400);
			}

            // 0||console.log( '$(popUp)', $(popUp), popUp, method );

			// if (!$('.pop_up').hasClass('active')){
			// 	// $('body>.wrapper').removeClass('blur');
			// 	$('.video_form iframe').removeAttr('src', '');
			// }


            // $(document).off('click', callback);
		}
	}

	static nativePopUpClose(popUp){
		$(popUp).removeClass('active').fadeOut(400);
		// $('body>.wrapper').removeClass('blur');
	}

	static nativePopUpOpen(popUp){
		// let browser = $.browser.chrome && ($.browser.version.slice(0, 2) > 50) || $.browser.mozilla;
		$(popUp).addClass('active').fadeIn(200);
		// if (browser){
		// 	$('header').addClass('blur');
		// 	$('footer').addClass('blur');
		// 	$('.main_menu').addClass('blur');
		// 	$('.order_slide').addClass('blur');
		// }
	}

	static removeEventPopUp(element){
		$(element).unbind('click');
	}
}

new popUpClass();
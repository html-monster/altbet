class popUpClass{
	constructor(){
		$(document).keyup(function (e) {
			e = e || event;
			if(e.keyCode == 27) $('.pop_up').fadeOut();
		});
		console.log($.browser.version.slice(0, 2)); // EDGE В ВЕРСИИ 50 МОГУТ ПОЛЕЗТЬ БАГИ
	}
	static popUpClose(closeButton, ...popUpWindow){ //.head_form .close
		$(closeButton).click(function(e){
			e = e || event;
			e.preventDefault();
			popUpWindow.forEach(function (item) {
				$(item).fadeOut(200).removeClass('active'); //.sign_in_form
			});
			if (!$('.pop_up').hasClass('active'))
				$('body>.wrapper').removeClass('blur');
		});
	}

	static popUpOpen(openButton, popUpWindow, focusElement){
		let browser = $.browser.chrome && ($.browser.version.slice(0, 2) > 50) || $.browser.mozilla;

		$(openButton).click(function(e){//'.log_out .sign_in'
			e = e || event;
			e.preventDefault();
			$(popUpWindow).addClass('active').fadeIn(200);  //'.sign_in_form'
			$(focusElement).focus(); //'#email'

			console.log(browser);
			if (browser)
				$('body>.wrapper').addClass('blur');
		});
	}

	static globalPopUpClose(popUp, method, ...target){
		$(document).click( function(e){
			e = e || event;
			if(target.length){
				if(target.some((element) =>  $(e.target).closest(element).length != 0))
					return;
			}
			$(popUp).removeClass('active');

			if (!$('.pop_up').hasClass('active'))
				$('body>.wrapper').removeClass('blur');

			if(method == 'slideUp')
				$(popUp).slideUp(400);
			else
				$(popUp).fadeOut(400);

		});
	}
}

new popUpClass();
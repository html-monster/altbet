class popUpClass{
	constructor(){
		$(document).keyup(function (e) {
			e = e || event;
			if(e.keyCode == 27) $('.pop_up').fadeOut();
		});
	}
	static popUpClose(closeButton, ...popUpWindow){ //.head_form .close
		$(closeButton).click(function(e){
			e = e || event;
			e.preventDefault();
			popUpWindow.forEach(function (item) {
				$(item).fadeOut(200); //.sign_in_form
			});
		});
	}

	static popUpOpen(openButton, popUpWindow, focusElement){
		$(openButton).click(function(e){//'.log_out .sign_in'
			e = e || event;
			e.preventDefault();
			$(popUpWindow).fadeIn(200);  //'.sign_in_form'
			$(focusElement).focus(); //'#email'
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
			if(method == 'slideUp')
				$(popUp).slideUp(400);
			else
				$(popUp).fadeOut(400);
		});
	}
}

new popUpClass();
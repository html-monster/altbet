class popUpClass{
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

// $(document).ready(function () {
// 	$('.head_form .close').click(function(  ){
// 		$('.sign_in_form').fadeOut(400);
// 	});
// 	$('.log_out .sign_in').click(function(e){
// 		e.preventDefault();
// 		$('.sign_in_form').fadeIn(400);
// 		$('#email').focus();
// 	});
// 	$(document).click( function(event){
// 		console.log(123);
// 		$('.warning').fadeOut(400);
// 		if( $(event.target).closest(".sign_in_content").length || $(event.target).closest(".log_out .sign_in").length )
// 			return;
// 		$('.sign_in_form').fadeOut(400);
// 	});
// 	$(document).click( function(event){
// 		console.log(123);
// 		$('.warning').fadeOut(400);
// 		if( $(event.target).closest(".log_in").length )
// 			return;
// 		$('.user-menu').slideUp(400);
// 	});
// });

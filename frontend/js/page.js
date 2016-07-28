$(document).ready(function () {
	new inputNumber('.order');
	new inputNumber('.sing_up_form');

	if(location.hostname == "altbet.html-monster.ru"){
		let letAccess = new access('.access_container input[name="login"]', '.access_container input[name="pass"]', $('.access_container input.required').parent());

		$('.access_container form').submit(function (event) {
			event = event || window.event;
			event.preventDefault ? event.preventDefault() : (event.returnValue=false);
			letAccess.checkAccess('access');
		});
	}

	new menuClass();
	new footerClass();

	tabs.tabFilter('.filters'); // page my_position

	tabs.tabsChange('.my_position'); // page my_position
	tabs.tabsChange('.funds_tab'); // page user_page
	tabs.tabsChange('.top_reg'); // page registration

	tabs.tabsChangeAnimate('.nav_items', '.content_bet'); // page index

	popUpClass.popUpOpen('.log_out .sign_in', '.sign_in_form', '#login-email'); // pop-up login
	popUpClass.popUpOpen('.sign_in_form a.register', '.sign_up_form', '#f_name');
	popUpClass.popUpOpen('.sign_up_form input.submit', '.sign_up_form .confirm');

	popUpClass.popUpClose('.sign_in_form a.register', '.sign_in_form');
	popUpClass.popUpClose('.sign_in_form .close', '.sign_in_form'); // pop-up login
	popUpClass.popUpClose('.sign_up_form .confirm .btn', '.sign_up_form', '.sign_up_form .confirm'); // pop-up login

	popUpClass.globalPopUpClose('.warning'); // all warning message
	popUpClass.globalPopUpClose('.user-menu', 'slideUp', '.log_in'); // login user menu
	popUpClass.globalPopUpClose('.sign_up_form', 'fadeOut', '.sign_up_content', '.sign_in_form a.register'); // pop-up registration
	popUpClass.globalPopUpClose('.sign_in_form', 'fadeOut', '.sign_in_content', '.log_out .sign_in'); //pop-up login

	defaultMethods.maxHeight('.sign_up_form  .tab_content ', 105 + window.innerHeight * 0.1);
	defaultMethods.activated('.content_bet .add_favorite');

	messageClass.showHelpMessage('.active_trader .help', '.tab_item');
	var activeTrader = new activeTraderClass(); //active trader activation

	(function changeSelect(){
		try {
			$("body select").msDropDown();
		} catch(e) {
			alert(e.message);
		}
	})();

	$('input.input__field').focusout(function () {
		if($(this).val() == '') $(this).parent().removeClass('input--filled');
		else $(this).parent().addClass('input--filled');
	});

	$('.show-schedule').click(function(){ // show chart on the main page
		$(this).toggleClass('active')
					 .next().slideToggle();
		var schedule = $(this).next();
		setTimeout(function(){
			schedule.toggleClass('active');
		}, 1000)
	});
	


	//cybersport==========================================================================================================
	$('.stream_body .stream_title').click(function(){
		$(this).toggleClass('active');
		$('.menu_stream').slideToggle();
		$('.stream_video').slideToggle();
	});
	$('.main_list a').click(function(event){
		event.preventDefault();
		var attr = $(this).attr('href');
		$('.stream_video iframe').attr('src', attr);
	});

	$('.log_in').click(function () { //header account dropdown list
		$('.user-menu').slideToggle().toggleClass('active');
	});

	$('.show_password').mousedown(function () { // show password
		$(this).parents('.pass_container').find('input[type=password]').attr('type', 'text');
	}).mouseup(function () {
		$(this).parents('.pass_container').find('input[type=text]').attr('type', 'password').focus();
	});


});

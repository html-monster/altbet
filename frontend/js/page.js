$(document).ready(function () {
	new inputNumber('.order');
	new inputNumber('.sing_up_form');

	if(location.hostname == "altbet.html-monster.ru"){
		let letAccess = new accessClass('.access_container input[name="login"]', '.access_container input[name="pass"]', $('.access_container input.required').parent());

		$('.access_container form').submit(function (event) {
			event = event || window.event;
			event.preventDefault ? event.preventDefault() : (event.returnValue=false);
			letAccess.checkAccess('access');
		});
	}

	new menuClass();
	new footerClass();

	new userInspectionClass();

	tabsClass.tabFilter('.filters'); // page my_position

	new tabsClass();
	// tabsClass.tabsChange('.my_position'); // page my_position
	// tabsClass.tabsChange('.funds_tab'); // page user_page
	// tabsClass.tabsChange('.top_reg'); // page registration
	// tabsClass.tabsChange('.wrapper_user_page'); // page registration

	tabsClass.tabsChangeAnimate('.nav_items', '.content_bet'); // page index

	popUpClass.popUpOpen('.log_out .sign_in', '.sign_in_form', '#login-email'); // pop-up login
	popUpClass.popUpOpen('[data-log-out]', '.sign_in_form', '#login-email');
	popUpClass.popUpOpen('.sign_in_form a.register', '.sign_up_form', '#n_name');
	// popUpClass.popUpOpen('.sign_up_form input.submit', '.sign_up_form .confirm');
	popUpClass.popUpOpen('.first_page_wrapper .join', '.sign_up_form', '#n_name');
	popUpClass.popUpOpen('.video button', '.video_form');
	popUpClass.popUpOpen('header .price_plan', '.price_plan_form');

	popUpClass.popUpClose('.sign_in_form a.register', '.sign_in_form');
	popUpClass.popUpClose('.sign_in_form .close', '.sign_in_form'); // pop-up login
	// popUpClass.popUpClose('.sign_up_form .confirm .btn', '.sign_up_form', '.sign_up_form .confirm'); // pop-up login

	popUpClass.globalPopUpClose('.warning'); // all warning message
	popUpClass.globalPopUpClose('.user-menu', 'slideUp', '.log_in'); // login user menu
	popUpClass.globalPopUpClose('.sign_up_form', 'fadeOut', '.sign_up_content', '.sign_in_form a.register', '.first_page_wrapper .join'); // pop-up registration
	popUpClass.globalPopUpClose('.sign_in_form', 'fadeOut', '.sign_in_content', '.log_out .sign_in', 'header .deposit',
			'header .my_order', '.order_screening', '[data-log-out]'); //pop-up login
	popUpClass.globalPopUpClose('.video_form', 'fadeOut', '.pop_up_content', '.video button');
	popUpClass.globalPopUpClose('.price_plan_form', 'fadeOut', '.pop_up_content', 'header .price_plan');

	defaultMethods.maxHeight('.sign_up_form  .tab_content ', 105 + window.innerHeight * 0.1);
	defaultMethods.activated('.content_bet .add_favorite');

	// messageClass.showHelpMessage('.active_trader .help', '.tab_item');

	new orderClass();//order activation
	new myOrderClass();
	new activeTraderClass(); //active trader activation
	new eventPageClass(); //active order on the event page

	new myPosClass(); // activate my pos script

	new themeChangeClass();
	(function changeSelect(){
		try {
			$("body select").msDropDown();
		} catch(e) {
			alert(e.message);
		}
	})();

	/*$('.first_page_wrapper').fullpage({
		//Scrolling
		css3: true,
		//menu: '.main-menu',
		// anchors: ['header', 'whatwedo', 'portfolio', 'resp', 'team', 'contact', 'footer'],
		scrollingSpeed: 1000
	});*/

	Waves.init();
	Waves.attach('.wave', ['waves-button']);

	(function showPass () {
		let input = $('.input__field');

		input.change(function () {
			if($(this).val() == '') $(this).parent().removeClass('input--filled');
			else $(this).parent().addClass('input--filled');
		});
		input.blur(function () {
			if($(this).val() == '') $(this).parent().removeClass('input--filled');
			else $(this).parent().addClass('input--filled');
		});
	})();

	$('.show-schedule').click(function(){ // show chart on the main page
		$(this).toggleClass('active')
					 .next().toggleClass('active');
		// var schedule = $(this).next();
		// setTimeout(function(){
		// 	schedule.addClass('loader');
		// }, 400);
		// setTimeout(function(){
		// 	schedule.removeClass('loader');
		// }, 1000);
	});

	// $('.schedule').sortable('disabled') ; //drug disable

	// order drag and drop ===============================================================================================
	$(function() {
		var current = $( ".ui-sort" );
		current.sortable({
			placeholder: 'ui-state-highlight',
			cancel: '.not-sort',
			scroll: false,
			delay: 200
		});
		current.disableSelection();
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

	$('.help').mouseover(function () {
		$('.help').css('zIndex', 10);
		$(this).css('zIndex', 80);
	});

	$('.page_content_plan a').click(function (e) {
		var target = $($(this).attr('href'));
		e.preventDefault();

		$('html,body').animate({
			scrollTop: target.offset().top - 70
		}, 1000);
	});

	new accountClass();
});

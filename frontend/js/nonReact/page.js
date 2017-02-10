window.ee = new EventEmitter();


// BM: for Discuss
if( appData && appData.pageEventData )
{
    try {
        var disqus_config = function () {
            this.page.url = "http://" + location.host + appData.pageEventData.exchangeLink;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = appData.pageEventData.SymbolsAndOrders.Symbol.Exchange; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
    } catch (e) {
        console.warn( 'disqus_config fails' );
    }
} // endif



$(document).ready(function ()
{
	// BM: Deposit btn click for routing ----------------------------------
	$("[data-js-deposit]").click((ee) => {
		var $that = $(ee.target);
		location.href = $that.attr("href");
		location.reload();
	});



	new defaultMethods();
	// new inputValidationClass();
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

	// if($('.content_bet').length)
	// 	globalData.mainPage = true;
	// else
	// 	globalData.mainPage = false;

	// BM: page my_position
	// tabsClass.tabFilter('.filters');

	new tabsClass();
	// if(globalData.positionData) positionControllerClass.checkTab();
	// tabsClass.tabsChange('.my_position'); // page my_position
	// tabsClass.tabsChange('.funds_tab'); // page user_page
	// tabsClass.tabsChange('.top_reg'); // page registration
	// tabsClass.tabsChange('.wrapper_user_page'); // page registration

	tabsClass.tabsChangeAnimate('.nav_items', '.content_bet'); // page index

	popUpClass.popUpOpen('.log_out .sign_in', '.sign_in_form', '#login-email'); // pop-up login
	popUpClass.popUpOpen('[data-log-out]', '.sign_in_form', '#login-email');
	popUpClass.popUpOpen('.sign_in_form a.register', '.sign_up_form', '#f_name');
	// popUpClass.popUpOpen('.sign_up_form input.submit', '.sign_up_form .confirm');
	popUpClass.popUpOpen('.first_page_wrapper .join', '.sign_up_form', '#f_name');
	popUpClass.popUpOpen('.video button', '.video_form');
	popUpClass.popUpOpen('header .price_plan', '.price_plan_form');

	popUpClass.popUpClose('.sign_in_form a.register', 'fadeOut', '.sign_in_form');
	popUpClass.popUpClose('.sign_in_form .close', 'fadeOut', '.sign_in_form'); // pop-up login
	popUpClass.popUpClose('.wrapper_user_page .payment_message .hide', 'hide', '.wrapper_user_page .payment_message'); //payment message

	popUpClass.globalPopUpClose('.warning'); // all warning message
	popUpClass.globalPopUpClose('.user-menu', 'slideUp', '.log_in'); // login user menu
	popUpClass.globalPopUpClose('.sign_up_form', 'fadeOut', '.sign_up_content', '.sign_in_form a.register', '.first_page_wrapper .join',
	'#ui-datepicker-div', '.ui-corner-all'); // pop-up registration
	popUpClass.globalPopUpClose('.sign_in_form', 'fadeOut', '.sign_in_content', '.log_out .sign_in', 'header .deposit',
			'header .my_order', '.order_screening', '[data-log-out]'); //pop-up login
	popUpClass.globalPopUpClose('.video_form', 'fadeOut', '.pop_up_content', '.video button');
	popUpClass.globalPopUpClose('.price_plan_js', 'fadeOut', '.pop_up_content', 'header .price_plan');
	popUpClass.globalPopUpClose('.wrapper_user_page .payment_message', 'fadeOut', '.wrapper_user_page .payment_message .pop_up_content');//payment message

	defaultMethods.maxHeight('.sign_up_form  .tab_content ', 105 + window.innerHeight * 0.1);
	defaultMethods.activated('.content_bet .add_favorite');

	// messageClass.showHelpMessage('.active_trader .help', '.tab_item');

	new orderClass();//order activation
	new myOrderClass();
	// myOrdersControllerClass.createTemplate();
	// positionControllerClass.createTemplate();
	new activeTraderClass(); //active trader activation
	new eventPageClass(); //active order on the event page

	new myPosClass(); // activate my pos script

	new modeSwitchClass(); //mode switch activate

	new themeChangeClass();
	// (function changeSelect(){
	// 	try {
	// 		$("body select").msDropDown();
	// 	} catch(e) {
	// 		alert(e.message);
	// 	}
	// })();
	// $(window).focus(function() {
	// 	console.log('focus');
	// });


	// BM: Waves
	Waves.init();
	Waves.attach('.wave:not([disabled])', ['waves-button']);

	(function showPass () {
		let input = $('.input__field');

		input.each(function () {
			if($(this).val()) $(this).parent().addClass('input--filled');
		});

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
		$(this).parents('.table').toggleClass('active');
		if($(this).hasClass('active'))
			$(this).parents('.content_bet').find('.content_title').css('max-height', 'inherit');
		else{
			setTimeout(() => {
				$(this).parents('.content_bet').find('.content_title').removeAttr('style');
			}, 400);
		}

		if($('.show-schedule').hasClass('active'))
			globalData.MainCharOn = true;
		else
			globalData.MainCharOn = false;

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
	// date picker =======================================================================================================
	$(function() {
		let input = $( "input.datePickerJs" );
		input.keyup(function () { return false; });
		input.keydown(function () { return false; });
		input.keypress(function () { return false; });
		input.datepicker({
			yearRange: "1901:c+0",
			maxDate: "0",
			minDate: new Date(1, 1 - 1, 1),
			changeMonth: true,
			changeYear: true,
			showAnim: 'slideDown'
		});

		//validation =======================================================================================================
		/*$('body').on('click', '#ui-datepicker-div  .ui-datepicker-current-day', function () {
			console.log(133);
			if(input.val().length) {
				input.addClass('valid');
				console.log(546354);
			}
		});*/
	});

	//cyber sport ========================================================================================================
	// $('.stream_body .stream_title').click(function(){
	// 	$(this).toggleClass('active');
	// 	$('.menu_stream').slideToggle();
	// 	$('.stream_video').slideToggle();
	// });
	// $('.main_list a').click(function(event){
	// 	event.preventDefault();
	// 	var attr = $(this).attr('href');
	// 	$('.stream_video iframe').attr('src', attr);
	// });



	$('.log_in').click(function () { //header account dropdown list
		$('.user-menu').slideToggle().toggleClass('active');
	});

	$('.show_password').mousedown(function () { // show password
		$(this).parents('.pass_container').find('input[type=password]').attr('type', 'text');
	}).mouseup(function () {
		$(this).parents('.pass_container').find('input[type=text]').attr('type', 'password').focus();
	});

	$('.help').mouseenter(function () {
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


	new ajaxLoginControllerClass();
	new ajaxRegistrationControllerClass();
	new accountClass();
	new ajaxThemeChangeClass();
});



// class menuClass{
// 	constructor(){
// 		$('.main_menu ul li').click(function(e){
// 			e = e || event;
// 			e.stopPropagation();
// 			if($(this).hasClass('active')){
// 				$(this).find('ul').slideUp(400);
// 				$(this).removeClass('active');
// 				$(this).children('li').removeClass('active');
// 			}
// 			else{
// 				$(this).children('ul').slideDown(400);
// 				if(($(this).hasClass('main'))){
// 					$('.main_menu ul li.main.active ul').slideUp();
// 					$('.main_menu ul li').removeClass('active');
// 				}
// 				$(this).addClass('active');
// 			}
// 		});
// 		$('.main_menu ul a.jump').click(function(e){
// 			e = e || event;
// 			e.stopPropagation();
// 		});
// 		$('.main_menu ul li a.favorite').click(function (e) {
// 			e = e || event;
// 			e.stopPropagation();
// 		});
//
// 		//menu maxHeight
// 		let windowHeight = window.innerHeight,
// 				windowWidth = window.innerWidth,
// 				orderSidebarHeight = windowHeight - 132,// - 253,
// 				menu = $('.nav_bet');
// 		$(window).resize(function () {
// 			windowWidth = window.innerWidth;
// 			orderSidebarHeight = windowHeight - 132;// - 253;
// 			if(windowWidth > 1200){
// 				windowHeight = window.innerHeight;
// 				menu.css('max-height', orderSidebarHeight);
// 			}
// 		});
// 		if(windowWidth > 1200){
// 			menu.css('max-height', orderSidebarHeight);
// 		}
// 	}
// }
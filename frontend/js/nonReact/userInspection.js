class userInspectionClass{
	constructor(){
		var staticProject = location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru';

		if(globalData.userIdentity == 'False' && !staticProject){
			popUpClass.popUpOpen('header .my_order', '.sign_in_form', '#login-email');
			popUpClass.popUpOpen('header .deposit', '.sign_in_form', '#login-email');
			// popUpClass.popUpOpen('.order_screening', '.sign_in_form', '#login-email');
		}
		// else
		// 	$('.order_screening').hide();
	}
}

(function access() {
	if(location.hostname == "altbet.html-monster.ru"){
		var LOGIN = 'altbet',
				PASSWORD = 'altbet1234',
				host = location.host,
				currentLogin, currentPass;

		if(location.pathname != '/access.html'){
			if(localStorage.access != 'allowed' && sessionStorage.access != 'allowed' &&
					location.pathname != '/access.html'){
				location.href = 'http://' + host + '/access.html';
			}
		}

		function access() {
			var checkbox = $('.access_container input.remember');
			currentLogin = $('.access_container input[name="login"]').val();
			currentPass = $('.access_container input[name="pass"]').val();

			if(LOGIN == currentLogin && PASSWORD == currentPass){
				if(checkbox.prop('checked')){
					localStorage.setItem('access', 'allowed');
				}
				else{
					localStorage.removeItem('access');
					sessionStorage.setItem('access', 'allowed')
				}
				location.href = 'http://' + host;
			}
			else{
				var input = $('.access_container input.required').parent();
				input.removeClass('animated shake');
				setTimeout(function () {
					input.addClass('animated shake')
				}, 0)
			}
		}
		$(document).ready(function () {
			$('.access_container form').submit(function (event) {
				event = event || window.event;
				event.preventDefault ? event.preventDefault() : (event.returnValue=false);
				access();
			});
		});
	}
})();



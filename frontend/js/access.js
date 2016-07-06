(function access() {
	if(location.hostname == "altbet.html-monster.ru"){
		var LOGIN = 'YWx0YmV0',
				PASSWORD = 'YWx0YmV0MTIzNA',
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

			if(b64DecodeUnicode(LOGIN) == currentLogin && b64DecodeUnicode(PASSWORD) == currentPass){
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

		function b64DecodeUnicode(str) {
			return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
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



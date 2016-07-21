'use strict';

class access{

	constructor(currentLogin, currentPass, inputArr){
		this.LOGIN = 'YWx0YmV0';
		this.PASSWORD = 'YWx0YmV0MTIzNA';
		this.currentLogin = $(currentLogin);
		this.currentPass = $(currentPass);
		this.input = $(inputArr);
		this.checkbox = inputArr.parents('form').find('.remember_me');
		this.b64EncodeUnicode = function(str) {
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
		};
		this.b64DecodeUnicode = function(str) {
			return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
		};
	}
	static redirectForDineAccess(page){
		if(location.pathname != `/${page}`){
			if(localStorage.access != 'allowed' && sessionStorage.access != 'allowed' &&
					location.pathname != `/${page}`){
				location.href = `/${page}`;
			}
		}
	}

	checkAccess(accessName){
		if(this.b64DecodeUnicode(this.LOGIN) == this.currentLogin.val() && this.b64DecodeUnicode(this.PASSWORD) == this.currentPass.val()){
			if(this.checkbox.prop('checked')){
				localStorage.setItem(accessName, 'allowed');
			}
			else{
				localStorage.removeItem(accessName);
				sessionStorage.setItem(accessName, 'allowed')
			}
			location.href = '/';
		}
		else{
			this.input.removeClass('animated shake');
			setTimeout(() => {
				this.input.addClass('animated shake')
			}, 0)
		}
	}
}
if(location.hostname == "altbet.html-monster.ru")
		access.redirectForDineAccess('access.html');



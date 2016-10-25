class defaultMethods{
	constructor(){
		$(document).keyup(function (e) {
			e = e || event;

			if(e.keyCode == 27) {
				$('.message_pop_up').removeClass('bounceInRight').addClass('bounceOutRight');
			}
		});

		$(document).mousemove(function () {
			removeMesOnAction();
		});

		$(document).click(function () {
			removeMesOnAction();
		});

		$(document).on('mouseenter', '.global_message_container.clone', function () {
				clearTimeout($(this)[0].tagData.timeFadeOut);
				clearTimeout($(this)[0].tagData.timeRemove);
		});
		$(document).on('mouseleave', '.global_message_container.clone', function () {
			var self = $(this);

			self[0].tagData.timeFadeOut = setTimeout(function () {
				self.fadeOut(800);
			}, 1000);
			self[0].tagData.timeFadeOut = setTimeout(function () {
				self.remove();
			}, 1800);
		});

		function removeMesOnAction() {
			let errorMessage = $('.global_message_container.clone:not(.remove_js)'),
					TIMEOUT = 2000,
					ANIMATION_TIME = 800;

			errorMessage.each(function () {
				let self = $(this);
				self.addClass('remove_js');
				self[0].tagData = {};
				self[0].tagData.timeFadeOut = setTimeout(function () {
					self.fadeOut(ANIMATION_TIME);
				}, TIMEOUT);
				self[0].tagData.timeRemove = setTimeout(function () {
					self.remove();
				}, TIMEOUT + ANIMATION_TIME);

			});
		}
	}

	static isInteger(num) {
		return (num ^ 0) === num;
	}

	static searchValue(array, value) {
		var ii;
		if(array.length != 0){
			if(typeof array[0] == 'string'){
				for (ii = 0; ii < array.length; ii++) {
					if (array[ii] === value) return ii;
				}
			}
			else{
				for (ii = 0; ii < array.length; ii++) {
					if (array[ii][0] === value) return ii;
				}
			}
		}
		return -1;
	}

	static randomInteger(min, max) {
		var rand;
		if(defaultMethods.isInteger(min) && defaultMethods.isInteger(max)){
			rand = min - 0.5 + Math.random() * (max - min + 1);
			rand = Math.round(rand);
		}
		else{
			rand = min + Math.random() * (max - min);
			rand = rand.toFixed(2);
		}
		return rand;
	}

	static maxHeight(element, fixedSubtractionHeight, ...containerSubtractionHeight){
		var windowHeight = window.innerHeight,
				totalSubtractionHeight = 0;

		$(window).resize(function () {
			windowHeight = window.innerHeight;
			$(element).css('max-height', windowHeight - fixedSubtractionHeight - totalSubtractionHeight)
		});

		fixedSubtractionHeight = fixedSubtractionHeight || 0;
		containerSubtractionHeight.forEach(function (item) {
			totalSubtractionHeight +=  $(item).height();
		});
		$(element).css('max-height', windowHeight - fixedSubtractionHeight - totalSubtractionHeight)
	}

	static activated(element){
		$(element).click(function (e) {
			e.preventDefault();
			$(this).toggleClass('active');
		});
	}

	static getClass(obj) {
		return {}.toString.call(obj).slice(8, -1);
	}

	static objectFromArray(data, obj) {
		obj = defaultMethods.getClass(obj) == 'Object' ? obj : {};

		data.forEach(function (key) {
			let item = key.split('=');

			obj[item[0]] = item[1];
		});

		return obj;
	}

	static getId(obj) {
		let id;

		if (+obj.isMirror){
			if(obj.ID)
				id = obj.ID + '_mirror__order';
			else
				id = obj.Symbol + '_mirror__order';
		}
		else{
			if(obj.ID)
				id = obj.ID + '__order';
			else
				id = obj.Symbol + '__order';
		}

		return id;
	}

	static showError(errorMessage){
		defaultMethods.showMessage(errorMessage, 'error');
	}

	static showWarning(warningMessage){
		defaultMethods.showMessage(warningMessage, 'alert');
	}

	static showInfo(infoMessage){
		defaultMethods.showMessage(infoMessage, 'info');
	}

	static sendAjaxRequest(httpMethod, callback, onError, url, context, data) {
		if(!data) data = context.serialize();
		$.ajax({
			url: url,
			type: httpMethod,
			dataType: 'json',
			data: data,
			success: callback,
			error: onError
		});
	}
	static showMessage(message, messageName) {
		let error = $('#global_message').clone(),
				windowHeight = $(window).outerHeight(),
				allMessages,
				position = 0,
				totalHeight = 0,
				ii = 1;

		error.removeAttr('id').addClass('clone ' + messageName);
		error.find('p').text(message);
		$('body').append(error);

		position = error.outerHeight(true);
		allMessages = $('.global_message_container.clone');
		allMessages.each(function () {
			let currentPosition = +$(this).css('bottom').replace('px', '');

			totalHeight += $(this).outerHeight(true);

			if(allMessages.length != ii++){
				$(this).css('bottom', currentPosition + position);
			}

			if(totalHeight > windowHeight)
				allMessages.eq(0).remove();
		});

		error.hide().fadeIn(200)
				 .removeClass('bounceOutRight').addClass('bounceInRight active');
	};
}

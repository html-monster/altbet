class defaultMethods{
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
		let error = $('.global_error_container');

		error.hide().fadeIn(200)
				 .removeClass('bounceOutRight').addClass('bounceInRight active')
				 .find('p').text(errorMessage);
		setTimeout(function () {
			error.fadeOut(800);
		}, 5000);
	}
}

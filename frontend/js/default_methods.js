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
}

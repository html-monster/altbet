
class inputValidationClass{
	constructor(){
		let inputs = $('input[data-valid-js]');

		inputs.each(function () {
			inputCheck($(this));
		});

		function inputCheck(context) {
			let params = context.attr('data-valid-js');

// console.log(JSON.parse(params));
			if (defaultMethods.getClass(params) != 'Object') {
				console.error('options in input validation isn`t object: ', context);
				return false;
			}
			console.log(params);
		}
	}
}


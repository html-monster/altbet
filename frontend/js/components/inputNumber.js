class inputNumber{
	constructor(parent){
		this.parent = $(parent);
		this.INPUT = 'input.number';

		//oneStepValueChange()==============================================================================================
		let flag, self = this;

		function limitInputData(current, input, flag, code){

			if(input.next('.warning').length)
				input.next().fadeOut(200);

			if(current.parents('.price').length || current.parents('.input').find('.spreader').length){
				if(+input.val() > 0.98 && (current.hasClass('plus') || code == 38)){
					return false;
				}
				if(+input.val() < 0.02 && (current.hasClass('minus') ||  code == 40)){
					return false;
				}
			}

			if(input.attr('maxlength')){
				if(((+input.val() + flag).toFixed(0) + '').length > +input.attr('maxlength') && (current.hasClass('plus') || code == 38)){
					return false;
				}
			}
			if((+input.val() - flag) < 0 && (current.hasClass('minus') || code == 40)){
				return false;
			}
		}
		
		this.parent.on('keydown', this.INPUT, function (e) {
			let input = $(this),
					value = +input.val(),
					code;

			e = e || event;
			code = e.which || e.charCode || e.keyCode;

			(defaultMethods.isInteger(+input.attr('data-validation'))) ? flag = 1 : flag = 0.01;

			if (limitInputData($(this), input, flag, code) === false)  return false;

			if (code == 38) {
				e.preventDefault();
				input.val((flag == 1) ? value + flag : (value + flag).toFixed(2));
				input[0].selectionStart = input.val().length;
			}
			else if (code == 40) {
				e.preventDefault();
				input.val((flag == 1) ? value - flag : (value - flag).toFixed(2));
				input[0].selectionStart = input.val().length;
			}
		});

		this.parent.on('click', '.regulator span', function () {
			let input = $(this).parents('.input').find('input.number'),
					value = +input.val();

			(defaultMethods.isInteger(+input.attr('data-validation'))) ? flag = 1 : flag = 0.01;

			if (limitInputData($(this), input, flag) === false)  return false;

			if ($(this).hasClass('plus')) {
				input.val((flag == 1) ? value + flag : (value + flag).toFixed(2));
				input.focus();
				input[0].selectionStart = input.val().length;
			}
			else {
				input.val((flag == 1) ? value - flag : (value - flag).toFixed(2));
				input.focus();
				input[0].selectionStart = input.val().length;
			}

			inputNumber.clearInput($(this).parents('.input').find('input'));
			activeTraderClass.buttonActivation($(this).parents('.input').find('input.quantity'));
			activeTraderClass.spreaderChangeVal($(this).parents('.input').find('input'), $(this).parents('.input').find('input').val());
		});

		//numericalVerification()==========================================================================================
		this.parent.on('keypress', this.INPUT, function (e) {
			e = e || event;
			let code = e.which || e.charCode || e.keyCode;

			if(code != 13){
				if(!(code == 46 || code >= 48 && code <= 57 || code >= 8 && code <= 9
						|| code == 27 || code == 37 || code == 39)){
					return false;
				}
			}
		});
		this.parent.on('keydown', this.INPUT, function (e) {
			e = e || event;
			let code = e.which || e.charCode || e.keyCode;

			if(e.ctrlKey && code == 86){
				return false;
			}
		});

		this.parent.on('keyup', this.INPUT, function (e) {
			inputNumber.clearInput($(this));
		});
		this.parent.on('contextmenu', this.INPUT, function (e) {
			if(e.button == 2)
				e.preventDefault();
		});


		//clearInput=======================================================================================================
		this.parent.on('click', '.input .clear', function () {
			var self = $(this);
			self.parent().find('input').val('');
			self.removeClass('active');
			setTimeout(function () {
				self.hide();
			}, 150);
		});
		// $(document).keyup(function (e) {
		// 	e = e || event;
		// 	if(e.keyCode == 27){
		// 		$('.input .clear').removeClass('active');
		// 		setTimeout(function () {
		// 			$('.input .clear').hide();
		// 		}, 150);
		// 	}
		// });
	}
	static clearInput(current) {
		var clearBtn = $('.input .clear');
		if(current.val()){
			clearBtn.show();
			setTimeout(function () {
				clearBtn.addClass('active');
			}, 100);
		}
		else{
			clearBtn.removeClass('active');
			setTimeout(function () {
				clearBtn.hide();
			}, 150);
		}
	}
}

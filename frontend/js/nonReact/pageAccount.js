class accountClass{
	constructor(){
		this.passwordCompare = function () {
			let currentPass = '.wrapper_user_page #user_curr_pass',
					newPass = '.wrapper_user_page #user_pass',
					confirmPass = '.wrapper_user_page #user_confirm_pass';

			$(currentPass).keyup(function () {
				minCheck(this);
				compare({
					anotherText: $(this),
					context: newPass,
					sameText: confirmPass
				});
			});
			$(newPass).keyup(function () {
				minCheck(this);
				compare({
					context: $(this),
					sameText: confirmPass,
					anotherText: currentPass
				});
			});
			$(confirmPass).keyup(function () {
				minCheck(this);
				compare({
					context: $(this),
					sameText: newPass,
					anotherText: currentPass
				});
			});

			$('.wrapper_user_page .change_password').submit(function () {
				let valid, minLengthValid;
				minLengthValid = minCheck(currentPass, newPass, confirmPass);
				valid = compare({
					context: newPass,
					sameText: confirmPass,
					anotherText: currentPass
				});

				return valid && minLengthValid;
			});

			function minCheck(...context) {
				let valid = [];
				$(context).each(function () {
					if($(this).val().length < 3){
						$(this).addClass('input-validation-error').removeClass('valid');
						showMessage('password min length is 3 characters', this);
						valid.push(false);
					}
					else{
						$(this).addClass('valid').removeClass('input-validation-error');
						showMessage('', this);
						valid.push(true);
					}
				});
				valid = valid.every(item => item);

				return valid;
			}
			function compare(elements) {
				let valid = false;
				if(elements.context && elements.anotherText && elements.sameText){
					let contextLength = $(elements.context).val().length >= 3,
							sameTextLength = $(elements.sameText).val().length >= 3,
							anotherTextLength = $(elements.anotherText).val().length >= 3;

					if($(elements.context).val() != $(elements.sameText).val() &&
							contextLength && sameTextLength){
						$(elements.context).addClass('input-validation-error').removeClass('valid');
						$(elements.sameText).addClass('input-validation-error').removeClass('valid');
						showMessage('Password aren`t match', elements.context, elements.sameText);
						valid = false;
						if($(elements.context).val() != $(elements.anotherText).val() &&
								$(elements.sameText).val() != $(elements.anotherText).val()){
							$(elements.anotherText).addClass('valid').removeClass('input-validation-error');
							showMessage('',	elements.anotherText);
						}
					}
					else{
						if(contextLength) {
							$(elements.context).addClass('valid').removeClass('input-validation-error');
							showMessage('', elements.context);
							valid = true;
						}
						if(sameTextLength) {
							$(elements.sameText).addClass('valid').removeClass('input-validation-error');
							showMessage('',	elements.sameText);
							valid = true;
						}
						if(anotherTextLength) {
							$(elements.anotherText).addClass('valid').removeClass('input-validation-error');
							showMessage('',	elements.anotherText);
							valid = true;
						}
					}

					if($(elements.context).val() == $(elements.anotherText).val() &&
					contextLength && anotherTextLength){
						$(elements.context).addClass('input-validation-error').removeClass('valid');
						$(elements.anotherText).addClass('input-validation-error').removeClass('valid');
						showMessage('Old password and new password are match', elements.context, elements.anotherText);
						valid = false;
					}

					if($(elements.sameText).val() == $(elements.anotherText).val() &&
					sameTextLength && anotherTextLength){
						$(elements.sameText).addClass('input-validation-error').removeClass('valid');
						$(elements.anotherText).addClass('input-validation-error').removeClass('valid');
						showMessage('Old password and new password are match', elements.sameText, elements.anotherText);
						valid = false;
					}
				}

				return valid;
			}
			function showMessage(errorText, ...context) {
				$(context).each(function () {
					$(this).parent().find('.validation-summary-errors').text(errorText);
				});
			}
		}();

		this.balanceAnimation = function () {
			let element = $('.balance span'),
					elementVal = $('.balance strong'),
					elementMapVal = $('.color_map span'),
					value = [],
					data = {};

			let animate = function (options) {
				var start = Date.now(); // сохранить время начала

				requestAnimationFrame(function tick() {
					var timePassed = Date.now() - start;
					var progress = timePassed / options.duration;
					var timeFunction = options.timeFunction || function (progress) {
								return progress;
							};
					progress = progress > 1 ? 1 : progress;

					options.step(timeFunction(progress));

					if (progress === 1) {
						options.complete();
					} else {
						requestAnimationFrame(tick);
					}

				});
			};

			elementVal.each(function () {
				value.push(+$(this).text());
			});

			data.all = value[0] + value[1] + value[2];
			if(value[0] >= 0){
				data.pl = ((value[0] / data.all) * 100).toFixed(2);
				data.inv = ((value[1] / data.all) * 100).toFixed(2);
				data.av = ((value[2] / data.all) * 100).toFixed(2);
				$('.balance .pl').removeClass('neg').addClass('pos');
				$('.balance .inv').removeClass('neg');
				$('.color_map .pl').removeClass('neg');
			}
			else{
				data.inv = ((value[1] / (value[1] + value[2])) * 100).toFixed(2);
				data.pl = (data.inv - ((value[1] + value[0]) / (value[1] + value[2])) * 100).toFixed(2);
				data.av = ((value[2] / (value[1] + value[2])) * 100).toFixed(2);
				$('.balance .pl').removeClass('pos').addClass('neg');
				$('.balance .inv').addClass('neg');
				$('.color_map .pl').addClass('neg');
			}

			setTimeout(function () {
				animate({
					duration: 1000,
					step    : function (progress) {
						elementVal.eq(0).text('$' + Math.round((value[0] * progress)));
						elementVal.eq(1).text('$' + Math.round((value[1] * progress)));
						elementVal.eq(2).text('$' + Math.round((value[2] * progress)));
						elementMapVal.eq(0).text('$' + Math.round((value[0] * progress)));
						elementMapVal.eq(1).text('$' + Math.round((value[1] * progress)));
						elementMapVal.eq(2).text('$' + Math.round((value[2] * progress)));
					},
					complete: function () {}
				});
				animate({
					duration: 10,
					step: function (progress) {
						element.eq(0).css('width', data.pl * progress + '%');
						element.eq(1).css('width', data.inv * progress + '%');
						element.eq(2).css('width', data.av * progress + '%');
					},
					easing: 'swing',
					complete: function () {}
				});
			}, 500);
		}();
	}
}

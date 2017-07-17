// $(document).ready(function() {
//     jQuery.validator.addMethod("testValidator", function (value, element, params) {
//         0||console.debug( 'value', value );
//         0||console.debug( 'element', element );
//         0||console.debug( 'params', params );
//         return false; //this.optional(element) || value == params[0] + params[1];
//     },
//     // jQuery.validator.format("Please enter the correct value for {0} + {1}")
//     'Test Validator works');
// });

class accountClass
{
	constructor()
	{
		// let hello = 1;
		// BM: passwordCompare
		/*this.passwordCompare = function () {
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
						$(this).addClass('invalidJs').removeClass('validJs');
						showMessage('password min length is 3 characters', this);
						valid.push(false);
					}
					else{
						$(this).addClass('validJs').removeClass('invalidJs');
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

					if($(elements.context).val() !== $(elements.sameText).val() &&
							contextLength && sameTextLength){
						$(elements.context).addClass('invalidJs').removeClass('validJs');
						$(elements.sameText).addClass('invalidJs').removeClass('validJs');
						showMessage('Password aren`t match', elements.context, elements.sameText);
						valid = false;
						if($(elements.context).val() !== $(elements.anotherText).val() &&
								$(elements.sameText).val() !== $(elements.anotherText).val()){
							$(elements.anotherText).addClass('validJs').removeClass('invalidJs');
							showMessage('',	elements.anotherText);
						}
					}
					else{
						if(contextLength) {
							$(elements.context).addClass('validJs').removeClass('invalidJs');
							showMessage('', elements.context);
							valid = true;
						}
						if(sameTextLength) {
							$(elements.sameText).addClass('validJs').removeClass('invalidJs');
							showMessage('',	elements.sameText);
							valid = true;
						}
						if(anotherTextLength) {
							$(elements.anotherText).addClass('validJs').removeClass('invalidJs');
							showMessage('',	elements.anotherText);
							valid = true;
						}
					}

					if($(elements.context).val() === $(elements.anotherText).val() &&
					contextLength && anotherTextLength){
						$(elements.context).addClass('invalidJs').removeClass('validJs');
						$(elements.anotherText).addClass('invalidJs').removeClass('validJs');
						showMessage('Old password and new password are match', elements.context, elements.anotherText);
						valid = false;
					}

					if($(elements.sameText).val() === $(elements.anotherText).val() &&
					sameTextLength && anotherTextLength){
						$(elements.sameText).addClass('invalidJs').removeClass('validJs');
						$(elements.anotherText).addClass('invalidJs').removeClass('validJs');
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
		}();*/

        // BM: balanceAnimation
		accountClass.balanceAnimation();
	}
	static balanceAnimation() {
		let element = $('.balance span'),
			elementVal = $('.balance strong'),
			elementMapVal = $('.color_map span'),
			value = [],
			data = {},
			profitPositive;

		let animate = function (options) {
			let start = Date.now(); // сохранить время начала

			requestAnimationFrame(function tick() {
				let timePassed = Date.now() - start;
				let progress = timePassed / options.duration;
				let timeFunction = options.timeFunction || function (progress) {
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
			value.push(+$(this).attr('data-content'));
		});

		data.all = value[0] + value[1] + value[2];
		if(value[0] >= 0){
			data.pl = ((value[0] / data.all) * 100);
			data.inv = ((value[1] / data.all) * 100);
			data.av = ((value[2] / data.all) * 100);
			$('.balance .pl').removeClass('neg').addClass('pos');
			$('.balance .inv').removeClass('neg');
			$('.color_map .pl').removeClass('neg');
			profitPositive = true;
		}
		else{
			data.inv = ((value[1] / (value[1] + value[2])) * 100);
			data.pl = (data.inv - ((value[1] + value[0]) / (value[1] + value[2])) * 100);
			data.av = ((value[2] / (value[1] + value[2])) * 100);
			$('.balance .pl').removeClass('pos').addClass('neg');
			$('.balance .inv').addClass('neg');
			$('.color_map .pl').addClass('neg');
			profitPositive = false;
		}
		element.eq(0).css({width: data.pl + '%', transform: `scaleX(0)`});//translateX(0)
		element.eq(1).css({width: data.inv + '%', transform: `scaleX(0)`});//translateX(0)
		element.eq(2).css({width: data.av + '%', transform: `scaleX(0)`});//translateX(-${data.inv / data.av * 100}%)

		setTimeout(function () {
			animate({
				duration: 1000,
				step    : function (progress) {
					// if(profitPositive) elementVal.eq(0).text('$' + Math.round10((value[0] * progress), -2));
					// else elementVal.eq(0).text('($' + (Math.round10((value[0] * progress), -2)).toString().slice(1) + ')');
					// elementVal.eq(1).text('$' + Math.round10((value[1] * progress), -2));
					// elementVal.eq(2).text('$' + Math.round10((value[2] * progress), -2));
					if(profitPositive) elementMapVal.eq(0).text('$' + (Math.round10((value[0] * progress), -2)).toFixed(2));
					else elementMapVal.eq(0).text(`($${(Math.abs(Math.round10((value[0] * progress), -2)).toFixed(2))})`);
					elementMapVal.eq(1).text('$' + (Math.round10((value[1] * progress), -2)).toFixed(2));
					elementMapVal.eq(2).text('$' + (Math.round10((value[2] * progress), -2)).toFixed(2));
				},
				complete: function () {}
			});
			animate({
				duration: 10,//10
				step: function (progress) {
					element.eq(0).css('transform', `scaleX(${progress})`);//translateX(0)
					element.eq(1).css('transform', `scaleX(${progress})`);//translateX(0)
					element.eq(2).css('transform', `scaleX(${progress})`);//(data.inv / data.av * 100) - (data.inv / data.av * 100 *
				},
				easing: 'swing',
				complete: function () {}
			});
		}, 500);
	}
}
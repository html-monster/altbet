class accountClass{
	constructor(){
		let element = $('.balance span'),
				elementVal = $('.balance strong'),
				elementMapVal = $('.color_map span'),
				value = [],
				data = {};

		var animate = function (options) {
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
	}
}

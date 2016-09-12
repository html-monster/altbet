class accountClass{
	constructor(){
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
		var div = $('.balance span');

		animate({
			duration: 1000,
			step: function (progress) {
				var percent = Math.round(33 * progress) + '%';
				div.html(percent);
				div.css('width', 33.33 * progress + '%');
			},
			complete: function () {}
		});
	}
}

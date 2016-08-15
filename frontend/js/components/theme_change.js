class themeChangeClass {
	constructor(){
		var tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href');
		function styleSearch() {
			return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		}
		if(styleSearch() == 'index_dark')
			$('.user span.dark').addClass('active');
		else
			$('.user span.light').addClass('active');

		$('.change-color span').click(function () {
			$('.user .color_pick').removeClass('active');
			$(this).addClass('active');
			if($(this).hasClass('dark'))
				tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_dark'));
			else
				tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_light'));
		});

	}
}

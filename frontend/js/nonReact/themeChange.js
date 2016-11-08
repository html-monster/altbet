class themeChangeClass {
	constructor(){
		var tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href'), self = this;
		self.styleSearch = function () {
			return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		};
		if(self.styleSearch() == 'index_dark')
			$('.change-color span.dark').addClass('active');
		else
			$('.change-color span.light').addClass('active');

		$('.change-color span').click(function () {
			let colorPickDark = $('.change-color .color_pick.dark'),
					colorPickLight = $('.change-color .color_pick.light');

			$('.change-color .color_pick').removeClass('active');
			if($(this).hasClass('dark')) {
				colorPickDark.addClass('active');
				tagLink.attr('href', styleUrl.replace(self.styleSearch(), 'index_dark'));
				localStorage.setItem('colorScheme', 'index_dark')
			}
			else{
				colorPickLight.addClass('active');
				tagLink.attr('href', styleUrl.replace(self.styleSearch(), 'index_light'));
				localStorage.setItem('colorScheme', 'index_light')
			}
		});

	}
	static setColorscheme() {
		var tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href');
		function styleSearch () {
			return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		}
		if(localStorage.getItem('colorScheme') == 'index_dark' && styleSearch() != 'index_dark'){
			tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_dark'));
		}
		else if(localStorage.getItem('colorScheme') == 'index_light' && styleSearch() != 'index_light'){
			tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_light'));
		}
	}
}

if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru')
	themeChangeClass.setColorscheme();
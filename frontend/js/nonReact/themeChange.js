class themeChangeClass {
	constructor(){
		let tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href'), self = this;
		self.styleSearch = function () {
			return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		};
		if(self.styleSearch() == 'index_dark')
			$('.change-color .dark').addClass('active');
		else
			$('.change-color .light').addClass('active');

		$('.change-color button').click(function () {
			// let colorPickDark = $('.change-color .color_pick.dark'),
			// 		colorPickLight = $('.change-color .color_pick.light');

			// $('.change-color .color_pick').removeClass('active');
			// if($(this).hasClass('dark')) {
			// 	themeChangeClass.setColorScheme($(this), 'dark');
				// colorPickDark.addClass('active');
				// tagLink.attr('href', styleUrl.replace(self.styleSearch(), 'index_dark'));
			// }
			// else{
			// 	themeChangeClass.setColorScheme($(this), 'light');
				// colorPickLight.addClass('active');
				// tagLink.attr('href', styleUrl.replace(self.styleSearch(), 'index_light'));
			// }
		});

	}
	static setColorScheme(context, theme) {
		let tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href');
		function styleSearch () {
			return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		}
		context.parent().children().removeClass('active');
		context.addClass('active');
		if(theme == 'dark' && styleSearch() != 'index_dark'){//localStorage.getItem('colorScheme') == 'index_dark'
			tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_dark'));
		}
		else if(theme == 'light' && styleSearch() != 'index_light'){//localStorage.getItem('colorScheme') == 'index_light'
			tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_light'));
		}
	}
}

// if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru')
// 	themeChangeClass.setColorScheme();
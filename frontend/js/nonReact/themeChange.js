class themeChangeClass {
	constructor(){
		// let tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href'), self = this;
		// self.styleSearch = function () {
		// 	return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		// };
		if(globalData.theme == 'dark')
			$('.change-color .dark').addClass('active');
		else
			$('.change-color .light').addClass('active');
	}


	static setColorScheme(context, theme)
	{
        let currentTheme = 'dark';
		let tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href');

		function styleSearch () {
			return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		}

		context.each(function () {
			$(this).removeClass('active');
			if($(this).hasClass(theme)) $(this).addClass('active');
		});

		if(theme == 'dark' && styleSearch() != 'index_dark'){//localStorage.getItem('colorScheme') == 'index_dark'
			tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_dark'));
		}
		else if(theme == 'light' && styleSearch() != 'index_light'){//localStorage.getItem('colorScheme') == 'index_light'
			tagLink.attr('href', styleUrl.replace(styleSearch(), 'index_light'));
			currentTheme = 'light';
		}

        location.reload();
        // ABpp.config.currentTheme = theme;
        // window.ee.emit('setSiteTheme', currentTheme);
	}
}

// if(location.host == 'localhost:3000' || location.host == 'altbet.html-monster.ru')
// 	themeChangeClass.setColorScheme();
class themeChangeClass {
	constructor(){
		var tagLink = $('link[rel=stylesheet]'), styleUrl = tagLink.attr('href'), self = this;
		self.styleSearch = function () {
			return styleUrl.slice(styleUrl.indexOf('index_'), styleUrl.indexOf('.'));
		};
		if(self.styleSearch() == 'index_dark')
			$('.user span.dark').addClass('active');
		else
			$('.user span.light').addClass('active');

		$('.change-color span').click(function () {
			$('.user .color_pick').removeClass('active');
			$(this).addClass('active');
			if($(this).hasClass('dark')) {
				tagLink.attr('href', styleUrl.replace(self.styleSearch(), 'index_dark'));
				localStorage.setItem('colorScheme', 'index_dark')
			}
			else{
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
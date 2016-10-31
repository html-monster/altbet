$(document).ready(function() {
  $('#fullpage').fullpage({
    menu: '#menu',
    anchors: (globalData.userIdentity == 'True') ? ['secondPage', 'thirdPage', 'fourthPage', 'lastPage'] : ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'lastPage'],
    navigation: true,
    navigationTooltips: (globalData.userIdentity == 'True') ? ['Main','Contacts','More','Pricing'] : ['Start','Main','Contacts','More','Pricing'],
    slidesNavigation: false
  });
});



1
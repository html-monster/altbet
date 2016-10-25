$(document).ready(function() {
  $('#fullpage').fullpage({
    menu: '#menu',
    lockAnchors: false,
    anchors: (globalData.userIdentity == 'True') ? ['secondPage', 'thirdPage', 'fourthPage', 'lastPage'] : ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'lastPage'],
    navigation: true,
    navigationTooltips: (globalData.userIdentity == 'True') ? ['Main','Contacts','More','Pricing'] : ['Start','Main','Contacts','More','Pricing'],
    showActiveTooltip: false,
    slidesNavigation: true,

    scrollingSpeed: 600,
    loopBottom: true,
    loopTop: true,

  });

});







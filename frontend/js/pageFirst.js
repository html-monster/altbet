$(document).ready(function() {
  $('#fullpage').fullpage({
    menu: '#menu',
    anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'lastPage'],
    navigation: true,
    navigationTooltips: ['Start','Markets','Advantages','Pricing','Contacts'],
    slidesNavigation: false,
  });
});




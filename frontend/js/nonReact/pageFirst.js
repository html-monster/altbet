$(document).ready(function () {

  var $preloader = $('#p_prldr'),
      $svg_anm   = $preloader.find('.svg_anm');
  $svg_anm.fadeOut();
  $preloader.delay().fadeOut();

  $('#fullpage').fullpage({
    menu: '#menu',
    anchors: (globalData.userIdentity == 'True') ? ['secondPage', 'thirdPage', 'fourthPage', 'lastPage'] : ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'lastPage'],
    navigation: true,
    navigationTooltips: (globalData.userIdentity == 'True') ? ['Markets', 'Advantages', 'Pricing', 'Contacts'] : ['Start', 'Markets', 'Advantages', 'Pricing', 'Contacts'],
    slidesNavigation: false,
    slidesNavPosition: 'bottom',
    loopBottom: true,
    loopTop: true,

  });

  $(".item_category").mouseover(function () {
    var ID = $(this).attr("id");
    var IdVideo = ID + '_video';
    $('#' + IdVideo).addClass('active');
  });

  $(".item_category").mouseleave(function () {
    var ID = $(this).attr("id");
    var IdVideo = ID + '_video';
    $('#' + IdVideo).removeClass('active');
  });




  setTimeout(function(){$('.info_f').addClass('animated')},200);
  setTimeout(function(){$('.info_s').addClass('animated')},300);
  setTimeout(function(){$('.info_th').addClass('animated')},400);
  setTimeout(function(){$('#start_betting .join').addClass('fadeInUpBig')},500);
  $('#start_betting .join').addClass('animated');
});
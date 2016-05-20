  //default*************************************************************************************************************
  function isInteger(num) {
    return (num ^ 0) === num;
  }
  function numericalVerification(input){
    if(input.attr('class') == 'number'){
      $('.order').on('keypress', input, function (e) {
        e = e || event;
        var code = e.charCode || e.keyCode;
        // if(!(/[0-9\.]+/i.test(String.fromCharCode(code)))){
        //   console.log(String.fromCharCode(code));
        //   return false;
        // }
        if(!(code == 46 || code >= 48 && code <= 57 || code >= 8 && code <= 9
            || code == 27)){
          return false;
        }
      });
      $('.order').on('keydown', input, function (e) {
        e = e || event;
        var code = e.charCode || e.keyCode;
        if(e.ctrlKey && code == 86){
          return false;
        }
      });
    }
  }

  function tabs(container, tab, tab_item) {
    tab = tab || '.tab';
    tab_item = tab_item || '.tab_item';
    container.find(tab).click(function () {
      container.find(tab).removeClass("active").eq($(this).index()).addClass("active");
      container.find(tab_item).hide().eq($(this).index()).fadeIn()
    }).eq(0).addClass("active");
  }

$(document).ready(function () {

  $('.order').on('click', '.regulator span', function(){
    var input = $(this).parents('.input').find('input.number');
    var value = +input.val(),
        flag;

    (isInteger(+input.attr('placeholder'))) ? flag = 1 : flag = 0.01;

    if(input.next('.warning').length)
      input.next().fadeOut(200);

    if($(this).parents('.price').length){
      if(+input.val() > 0.98 && $(this).hasClass('plus')){
        return false;
      }
      if(+input.val() < 0.02 && $(this).hasClass('minus')){
        return false;
      }
    }
    if(input.attr('maxlength') != undefined){
      if(((+input.val() + flag).toFixed(0) + '').length > +input.attr('maxlength') && $(this).hasClass('plus')){
        return false;
      }
    }
    if((+input.val() - flag) < 0 && $(this).hasClass('minus')){
      return false;
    }

    if($(this).hasClass('plus')){
      input.val((flag == 1) ? value + flag: (value + flag).toFixed(2));
    }
    else{
      input.val((flag == 1) ? value - flag: (value - flag).toFixed(2));
    }
  });

  tabs($('.funds_tab'));

  //header==============================================================================================================
  ;(function changeSelect(){
    try {
      $("body select").msDropDown();
    } catch(e) {
      alert(e.message);
    }
  })();


  // $(".funds_tab .wrapper_user .tab").click(function () {
  //   $(".funds_tab .wrapper_user .tab").removeClass("active").eq($(this).index()).addClass("active");
  //   $(".funds_tab .tab_item").hide().eq($(this).index()).fadeIn()
  // }).eq(0).addClass("active");

  //tabs_registration_page**********************************************************************************************
  tabs($('.top_reg'));
  // $(".top_reg .wrapper_reg .tab").click(function () {
  //   $(".top_reg .wrapper_reg .tab").removeClass("active").eq($(this).index()).addClass("active");
  //   $(".top_reg .tab_item").hide().eq($(this).index()).fadeIn()
  // }).eq(0).addClass("active");
  //menu_main***********************************************************************************************************

  ;(function menu () {
    $('ul a.jump').click(function(event){
      event.stopPropagation();
    });
    $('ul li').click(function(e){
      e.stopPropagation();
      if($(this).hasClass('active')){
        $(this).find('ul').slideUp(400);
        $(this).removeClass('active');
        $(this).children('li').removeClass('active');
      }
      else{
        $(this).children('ul').slideDown(400);
        if(($(this).hasClass('main'))){
          $('ul li.main.active ul').slideUp();
          $('ul li').removeClass('active');
        }
        $(this).addClass('active');
      }
    });
    $('ul li a.favorite').click(function (e) {
      e.stopPropagation();
    });
  })();
  //$(".my_position_tab .wrapper .sub_tab").click(function () {
  //  $(".my_position_tab .wrapper .sub_tab").removeClass("active");//.eq($(this).index()).addClass("active");
  //  $(this).addClass('active');
  //  var index = $(this).index();
  //  $(this).parent('.tabs').next().children().hide();//.eq($(this).index()).fadeIn()
  //  $(this).parent('.tabs').next().find('.sub_tab_item').eq(index).fadeIn();
  //}).eq(0).addClass("active");


  //$('.main_menu').children('ul').children('li').click(function () {
  //  var thisItem = $(this).children('ul');
  //  $('.turn_inset').click(function(){
  //    thisItem.removeClass('active');
  //    $('.sub-menu li ul').slideUp();
  //  });
  //  if($(this).children('ul').hasClass('active')){
  //    $('.main_menu ul').removeClass('active');
  //  }
  //  else{
  //    $('.main_menu ul').removeClass('active');
  //    $('.sub-menu li ul').slideUp();
  //    $(this).children('ul').addClass('active').click(function(e) {
  //      e.stopPropagation();
  //    });
  //  }
  //});
  //$('.sub-menu li').click(function(e){
  //  e.stopPropagation();
  //  $(this).children('ul').slideToggle(400);
  //});

  //end_of_menu*********************************************************************************************************

  //my orders***********************************************************************************************************

  $('.filters input[type="checkbox"]').click(function(){
    var current_div = $('#'+$(this).val());

    if($(this).is(':checked'))
      current_div.addClass('active');
    else
      current_div.removeClass('active');
  });


  //main_page_tbs*******************************************************************************************************
  $(".nav_items .wrapper .tab").click(function () {
    $(".nav_items .wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
    var item = $(".nav_items .tab_item"),
        ii = 1;
    item.find('.content_bet').css('display', 'none');
    item.hide().eq($(this).index()).show().find('.content_bet').each(function(){
      $(this).delay(50 * ii).css({display: 'flex', opacity: 0, marginTop: '10px'}).animate({
        opacity: '1',
        marginTop: '1px'
      }, 300);
      ii++;
    });
    ii = 1;
  }).eq(0).addClass("active");


  tabs($('.my_position'));
  // $(".my_position .wrapper .tab").click(function () {
  //   $(".my_position .wrapper .tab").removeClass("active").eq($(this).index()).addClass("active");
  //   $(".my_position .tab_item").hide().eq($(this).index()).fadeIn()
  // }).eq(0).addClass("active");

  $('.show-schedule').click(function(){
    $(this).toggleClass('active')
           .next().slideToggle(400);
    var schedule = $(this).next();
    setTimeout(function(){
      schedule.toggleClass('active');
    }, 1000)
  });

  //right sidebar*******************************************************************************************************
  $('.buton').click(function(){
    $('.order_slide').toggleClass('active');
  });

  //cybersport**********************************************************************************************************
  $('.stream_body .stream_title').click(function(){
    $(this).toggleClass('active');
    $('.menu_stream').slideToggle();
    $('.stream_video').slideToggle();
  });
  $('.main_list a').click(function(event){
    event.preventDefault();
    var attr = $(this).attr('href');
    $('.stream_video iframe').attr('src', attr);
  });

  //sing in pop-up******************************************************************************************************
  ;(function () {
    $('.head_form .close').click(function(  ){
      $('.sign_in_form').fadeOut(200);
    });
    $('.log_out .sign_in').click(function(e){
      e.preventDefault();
      $('.sign_in_form').fadeIn(200);
      $('#email').focus();
    });
    $(document).click( function(event){
      $('.warning').fadeOut(200);
      if( $(event.target).closest(".sign_in_content").length || $(event.target).closest(".log_out .sign_in").length )
        return;
      if( $(event.target).closest(".log_in").length )
        return;
      $('.user-menu').slideUp(400);
      $('.sign_in_form').fadeOut(200);
    });
  })();

  //my account**********************************************************************************************************
  $('.log_in').click(function () {
    $('.user-menu').slideToggle(400);
  });
  //my registration*****************************************************************************************************
  $('.show').mousedown(function () {
    $(this).prev().attr('type', 'text');
  }).mouseup(function () {
    $(this).prev().attr('type', 'password');
  });


    //admin panel=========================================================================================================
  // $('.admin-panel').on('click', 'button.bot', function (e) {
  //   e.preventDefault();
  //   if($(this).hasClass('start')){
  //     $(this).text('Stop bot');
  //   }
  //   else{
  //     $(this).text('Start bot');
  //   }
  //   $(this).toggleClass('start');
  // });

});
  /*ws.onmessage = function (evt) {
    //alert("message: " + evt.data);
    console.log(ang);
      var scope = angular.element(document.getElementById("mainController")).scope();
    scope.$apply(function () { scope.refreshData(evt.data); })
    setStartDate(evt.data);
    //ang.refreshData(evt.data);
    //appendMessage("# " + evt.data + "<br />");
    //refreshData(evt.data);
  };*/





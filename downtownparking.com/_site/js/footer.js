$(function() {
  if ($('body').hasClass('home') && ($('.mobile-home').css('display') === 'none')) {
    $('#pop2, #pop, #pop-press, #pop-business, #pop-print-maps').popover({trigger: 'manual', placement: 'right'}).mousedown(function(e) {
      var txt = $(this).data('open');
      if (txt == "open")
      {
        $(this).popover('hide');
        $(this).data('open', 'closed') 
      }
      else{
        $(this).popover('show');
        $(this).data('open', 'open')
      }
      e.preventDefault();
    });

    $('#pop2, #pop, #pop-press, #pop-business, #pop-print-maps').click(function(e) {
      e.preventDefault();
    });

    $('body').on('click', '.popover .close', function(e) {
      e.preventDefault();
      $('#pop2, #pop, #pop-press, #pop-business, #pop-print-maps')
        .popover('hide')
        .data('open', 'closed');
    });
  } else {
    $('#pop-press').click(function(e) {
      e.preventDefault();
      if ($('.mobile-press-room').css('display') == 'block') {
        $('.mobile-press-room').slideUp();
      } else {
        $('.mobile-info .info-block').hide();
        $('.mobile-press-room').toggle();
      }
      $('html, body').animate({
        scrollTop: $(document).height()
      });
    });
    $('#pop-business').click(function(e) {
      e.preventDefault();
      if ($('.mobile-business-tools').css('display') == 'block') {
        $('.mobile-business-tools').slideUp();
      } else {
        $('.mobile-info .info-block').hide();
        $('.mobile-business-tools').toggle();
      }
      $('html, body').animate({
        scrollTop: $(document).height()
      });
    });
    $('#pop-faq').click(function(e) {
      e.preventDefault();
      if ($('.mobile-faq').css('display') == 'block') {
        $('.mobile-faq').slideUp();
      } else {
        $('.mobile-info .info-block').hide();
        $('.mobile-faq').toggle();
      }
      $('html, body').animate({
        scrollTop: $(document).height()
      });
    });
  }
});

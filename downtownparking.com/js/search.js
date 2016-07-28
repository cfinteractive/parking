parking.search_term = '';
parking.current_term = '';
parking.search_timeout = 0;
parking.search_result_height = 33;
parking.geocoder = new google.maps.Geocoder();

parking.search = function() {
  parking.current_term = $('#q').val();
  // console.log('Searching for ' + parking.current_term);
  if (parking.current_term === '') {
    parking.close_search();
  } else {
    if (parking.current_term !== parking.search_term) {
      parking.geocoder.geocode({
        address: parking.current_term,
        componentRestrictions: {
          locality: 'Seattle'
        }
      }, parking.show_results);
    } else {
      parking.hide_spinner();
    }
  }
};

parking.show_results = function(results, status) {
  parking.hide_spinner();
  if (status == google.maps.GeocoderStatus.OK) {
    // console.log(results);
    var $search_results = $('.search-results');
    $search_results.empty();
    $.each(results, function(index, value) {
      $search_results.append(
        '<li><a href="" title="' + value.formatted_address +
        '" data-lat="' + value.geometry.location.lat() +
        '" data-lng="' + value.geometry.location.lng() +
        '">' + value.formatted_address + '</a></li>'
      );
    });
    $search_results.addClass('show');
    $search_results.css('height', parking.search_result_height * results.length + 'px');
    parking.search_term = parking.current_term;
  } else {
    alert('uh oh, google blew up: ' + status);
  }

};

parking.close_search = function() {
  // console.log('Closing search results');
  var $search_results = $('.search-results');
  if ($search_results.hasClass('show')) {
    $search_results.removeClass('show');
    $search_results.css('height', '0px');
  }
};

parking.select_top_search_result = function() {
  var $result = $('.search-results li:first-child');
  if ($result.text() === 'empty results') {
    return;
  }
  $('#q').val($result.text());
  var position = {
    coords: {
      latitude: parseFloat($result.find('a').attr('data-lat')),
      longitude: parseFloat($result.find('a').attr('data-lng'))
    }
  };
  parking.close_search();
  parking.display_search_results(position);
};

parking.show_spinner = function() {
  $('.search .spinner').fadeIn();
}

parking.hide_spinner = function() {
  $('.search .spinner').fadeOut();
}

parking.show_search_close = function() {
  $('.search .close').addClass('show');
}

parking.hide_search_close = function() {
  $('.search .close').removeClass('show');
}

parking.display_search_results = function(position) {
  // console.log(position);
  $('.home-list').removeClass('home-list-show');
  $('.mobile-home-list').removeClass('mobile-home-list-show');
  parking.sortLotsByDistance(position);
}

parking.hide_search_results = function() {
  $('.lot-list').hide();
  $('.home-list').addClass('home-list-show');
  $('.mobile-home-list').addClass('mobile-home-list-show');
}

$(function() {
  $('.search form').on('submit', function(e) {
    e.preventDefault();
    window.clearTimeout(parking.search_timeout);
    parking.search();
  });

  $('#q').on('keyup', function(e) {
    // console.log('keyup: ' + e.which);
    window.clearTimeout(parking.search_timeout);
    if (e.which === 13) {
      e.preventDefault();
      parking.select_top_search_result();
    } else if (e.which === 27 || $('#q').val() === '') {
      parking.hide_spinner();
      parking.close_search();
    } else {
      parking.show_spinner();
      parking.search_timeout = window.setTimeout(parking.search, 1300);
    }

    if ($('#q').val() === '') {
      parking.hide_search_close();
      parking.hide_search_results();
    } else {
      parking.show_search_close();
    }
  });

  $('.search .close').on('click', function(e) {
    e.preventDefault();
    $('#q')
      .val('')
      .focus();
    parking.hide_search_close();
    parking.close_search();
    parking.hide_search_results();
  });

  $('.search-results').on('click', 'a', function(e) {
    e.preventDefault();
    $('#q').val($(this).text());
    parking.close_search();
    var position = {
      coords: {
        latitude: parseFloat($(this).attr('data-lat')),
        longitude: parseFloat($(this).attr('data-lng'))
      }
    };
    parking.display_search_results(position);
  });

  $('.lot-list').on('click', 'a', function(e) {
    if (document.body.clientWidth > 767) {
      e.preventDefault();
      $('#map').fadeOut(function() {
        $('.map-container').addClass('subpage');
      });
      $('.map-container').load(
        $(this).attr('href') + ' article.lot',
        function() {
          parking.initializeMiniMap();
        }
      );
    }
  });
});

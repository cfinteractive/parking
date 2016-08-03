parking.sortAlpha = function (a, b) {
  return $(a).find('.lot-title')[0].innerHTML.toLowerCase() > $(b).find('.lot-title')[0].innerHTML.toLowerCase() ? 1 : -1;
};

parking.sortDistance = function (a, b) {
  return $(a).data('distance') > $(b).data('distance') ? 1 : -1;
};

parking.getLocation = function() {
  // parking.showSpinner();
  if (Modernizr.geolocation) {
    var options = {
      enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(parking.sortLotsByDistance, parking.sortLotsByName, options);
  } else {
    parking.sortLotsByName();
  }
};

parking.getLocationNearMe = function() {
  if (Modernizr.geolocation) {
    var options = {
      enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(parking.sortLotsByDistance, parking.nearMeError, options);
  } else {
    parking.nearMeError({ code: 4, message: 'Browser does not support geolocation' });
  }
};

parking.nearMeError = function(error) {
  var message = '';
  switch (error.code) {
    case 1:
      message = "Your browser has denied permission to share your location. Please change your browser settings to allow this page to query your location and try again, or follow one of the other links to find parking in a different way.";
      break;
    case 2:
    case 3:
      message = "Sorry, I can't find your location at this time. Please try again later.";
      break;
    default:
      message = "Sorry, there was an error finding your location. Please try again later.";
  }
  $('.overlay .message p').html(message);
  $('.overlay .message').show();
  $('.overlay').fadeIn();
};

parking.getDistances = function(position) {
  $('.lot-list li').each(function() {
    var lot_loc = new google.maps.LatLng($(this).data('lat'), $(this).data('lng'));
    var distance = parking.metersToMiles(google.maps.geometry.spherical.computeDistanceBetween(position, lot_loc));
    $(this).data('distance', distance);
    // $(this).find('.distance').append(parking.formatDistance(distance));
    $(this).find('.distance')
      .replaceWith('<span class="distance">' + parking.formatDistance(distance) + '</span>');
  });
};

parking.sortLotsByName = function(error) {
  if (error) {
    console.log("Error " + error.code + ": " + error.message);
    var message = '';
    switch (error.code) {
      case 1:
        message = "Your browser has denied permission to share your location. Please change your browser settings to allow this page to query your location and try again.";
        break;
      case 2:
      case 3:
        message = "Sorry, I can't find your location at this time. Please try again later.";
        break;
      default:
        message = "Sorry, there was an error finding your location. Please try again later.";
    }
    $('.overlay .message p').html(message);
    $('.overlay .message a').html("OK").click(function(e) {
      e.preventDefault();
      $('.overlay').fadeOut();
    });
    $('.overlay .message').show();
    $('.overlay').fadeIn();
  }
  $('.lot-list li').sort(parking.sortAlpha).appendTo('.lot-list');
  $('.lot-list').addClass('lot-list-show');
  $('.sort .alpha a').addClass('selected');
  $('.sort .distance a').removeClass('selected');
};

parking.sortLotsByDistance = function(position) {
  var pos;
  if ('coords' in position) {
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  } else {
    pos = position;
  }
  parking.getDistances(pos);
  if ($('.mobile-home').css('display') === 'block') {
    $('.lot-list li')
      .not('.sidebar .lot-list li, .hours-lots .lot-list li, .neighborhoods .lot-list li').sort(parking.sortDistance).appendTo('.sidebar .lot-list, .lot-list:not(.hours-lots .lot-list, .neighborhoods .lot-list)');
    $('.mobile-home .lot-list').addClass('lot-list-show');
  } else {
    $('.lot-list li')
      .not('.mobile-home .lot-list li, .hours-lots .lot-list li, .neighborhoods .lot-list li').sort(parking.sortDistance).appendTo('.lot-list:not(.mobile-home .lot-list, .hours-lots .lot-list, .neighborhoods .lot-list)');
    $('.lot-list').addClass('lot-list-show');
  }
  $('.sort .alpha a').removeClass('selected');
  $('.sort .distance a').addClass('selected');
};

parking.metersToMiles = function(meters) {
  return meters / 1609.34;
};
parking.formatDistance = function(distance) {
  var shortened = distance.toFixed(1).toString();
  if (shortened === '0.0') {
    shortened = '0.1';
  }
  return shortened + "mi";
};

$(function() {
  $('.sort .alpha a').click(function(e) {
    e.preventDefault();
    parking.sortLotsByName();
  });
  $('.sort .distance a').click(function(e) {
    e.preventDefault();
    parking.getLocation();
  });
});

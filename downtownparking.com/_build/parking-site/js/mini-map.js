(function($) {
  $.QueryString = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p=a[i].split('=');
      if (p.length != 2) continue;
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));
})(jQuery);

parking.initializeMiniMap = function() {
  parking.minimap_center = new google.maps.LatLng($('.mini-map').data('lat'), $('.mini-map').data('lng'));
  var myOptions = {
    center: parking.minimap_center,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    styles: parking.styles
  };
  parking.minimap = new google.maps.Map(document.getElementById("mini-map"), myOptions);

  var prefix = '';
  if (typeof(is_single_lot_page) !== 'undefined') {
    prefix = '../../';
  }

  var marker_regular = {
    url: prefix + 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_low = {
    url: prefix + 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 90),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_flat = {
    url: prefix + 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 205),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_epark = {
    url: prefix + 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 45),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_shadow = {
    url: prefix + 'img/marker-sprites.png',
    size: new google.maps.Size(45, 25),
    origin: new google.maps.Point(0, 135),
    anchor: new google.maps.Point(9, 25)
  };

  var icon = marker_regular;
  var icon_data = $('.mini-map').attr('data-icon');
  if (icon_data === 'low') {
    icon = marker_low;
  } else if (icon_data === 'flat') {
    icon = marker_flat;
  } else if (icon_data === 'epark') {
    icon = marker_epark;
  } else {
    icon = marker_regular;
  }

  parking.minimap_marker = new google.maps.Marker({
    map: parking.minimap,
    clickable: false,
    icon: icon,
    shadow: marker_shadow,
    position: parking.minimap_center
  });
  parking.me_marker = null;

  var context_lat = 0;
  var context_lng = 0;
  var context_title = '';
  if (parking.context_lat && parking.context_lng && parking.context_title) {
    context_lat = parking.context_lat;
    context_lng = parking.context_lng;
    context_title = parking.context_title;
  } else {
    context_lat = $.QueryString['lat'];
    context_lng = $.QueryString['lng'];
    context_title = $.QueryString['title'];
  }
  if (context_lat && context_lng && context_title) {
    var bounds = new google.maps.LatLngBounds();
    var context = new google.maps.LatLng(
      parseFloat(context_lat),
      parseFloat(context_lng)
    );

    bounds.extend(parking.minimap_center);
    bounds.extend(context);
    parking.minimap.fitBounds(bounds);

    parking.context_marker = new google.maps.Marker({
      position: context,
      map: parking.minimap,
      title: context_title,
      animation: google.maps.Animation.DROP,
      zIndex: 5000
    });
  }
};

parking.getLocationMiniMap = function() {
  if (Modernizr.geolocation) {
    var options = {
      enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(parking.showLocationOnMap, parking.miniMapLocationError, options);
  } else {
    parking.miniMapLocationError({ code: 4, message: 'Browser does not support geolocation' });
  }
};

parking.showLocationOnMap = function(position) {
  if (parking.me_marker !== null) {
    parking.me_marker.setMap(null);
    parking.me_marker = null
  }
  parking.me_marker = new google.maps.Marker({
    map: parking.minimap,
    clickable: false,
    icon: parking.minimap_marker_position,
    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  });
  var bounds = new google.maps.LatLngBounds(parking.minimap_marker.getPosition(), parking.minimap_marker.getPosition());
  bounds.extend(parking.me_marker.getPosition());
  parking.minimap.fitBounds(bounds);
};

parking.miniMapLocationError = function(error) {
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
  $('.overlay .message a').click(function(e) {
    e.preventDefault();
    $('.overlay').fadeOut();
  });
  $('.overlay .message').show();
  $('.overlay').fadeIn();
};

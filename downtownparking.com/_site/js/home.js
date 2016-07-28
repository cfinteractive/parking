parking.handleMapClick = function(e) {
  parking.dropPin(e);
  var position = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
  parking.sortLotsByDistance(position);
  parking.close_pin_drop();
  $('.home-list').removeClass('home-list-show');
  parking.cancelViewOnMap();
};

parking.prepareToDrop = function() {
  $('.view-arrow').addClass('show');
  parking.map.setZoom(15);
  parking.map.panTo(parking.view_on_map_center);
};

parking.dropPin = function(e) {
  if (typeof(parking.current_marker) !== 'undefined') {
    parking.current_marker.setMap(null);
  }
  parking.map.panTo(e.latLng);
  parking.current_marker = new google.maps.Marker({
      position: e.latLng,
      map: parking.map,
      animation: google.maps.Animation.DROP,
      zIndex: 5000
  });
  parking.context_lat = e.latLng.lat();
  parking.context_lng = e.latLng.lng();
  parking.context_title = 'Your Location';
};

parking.cancelViewOnMap = function() {
  $('.view-arrow').removeClass('show');
  google.maps.event.removeListener(parking.pin_drop_event);
};

$(function() {
  $('.home-list .view-on-map').on('click', function(e) {
    e.preventDefault();
    if ($('#map').length > 0) {
      $('.home-list .view-on-map .caption').removeClass('caption-show');
      $('.home-list .view-on-map .instructions').addClass('instructions-show');
      // parking.map.fitBounds(parking.marker_bounds);
      parking.prepareToDrop();

      parking.pin_drop_event = google.maps.event.addListenerOnce(parking.map, 'click', parking.handleMapClick);
    } else {
      parking.reopen_map();
      parking.prepareToDrop();
    }

  });

  $('.home-list .view-by-neighborhood').on('click', function(e) {
    e.preventDefault();
    parking.cancelViewOnMap();
    $('.home-list').removeClass('home-list-show');
    $('.neighborhoods').addClass('neighborhoods-show');
    $('.neighborhoods .lot-list').addClass('lot-list-show');
  });

  $('.home-list .garage-hours').on('click', function(e) {
    e.preventDefault();
    parking.cancelViewOnMap();
    $('.home-list').removeClass('home-list-show');
    $('.hours-lots').addClass('hours-lots-show');
    $('.hours-lots .lot-list').addClass('lot-list-show');
  });

  $('.lot-list .back').on('click', function(e) {
    e.preventDefault();
    if ($('.mobile-home').css('display') === 'block') {
      $('.lot-list').removeClass('lot-list-show');
      $('.mobile-home-list').addClass('mobile-home-list-show');
    } else {
      $('.lot-list').removeClass('lot-list-show');
      $('.hours-lots').removeClass('hours-lots-show');
      $('.neighborhood-lots').removeClass('neighborhood-lots-show');
      $('.home-list').addClass('home-list-show');
      parking.close_pin_drop();
      parking.reopen_map();
    }
    parking.context_lat = 0;
    parking.context_lng = 0;
    parking.context_title = '';
  });

  $('.home .map-container').on('click', 'article.lot header .back a', function(e) {
    e.preventDefault();
    $('.lot-list').removeClass('lot-list-show');
    $('.hours-lots').removeClass('hours-lots-show');
    $('.neighborhood-lots').removeClass('neighborhood-lots-show');
    $('.home-list').addClass('home-list-show');
    parking.close_pin_drop();
    parking.reopen_map();
  });
});

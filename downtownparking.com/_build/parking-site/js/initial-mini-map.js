$(function() {
  parking.initializeMiniMap();
  $('.mini-map .find-me').on('click', function(e) {
    e.preventDefault();
    parking.getLocationMiniMap();
  });

  $('.mobile header .back a').on('click', function(e) {
    e.preventDefault();
    history.back();
  });
});

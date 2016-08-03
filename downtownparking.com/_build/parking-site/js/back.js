$(function() {
  $('.mobile header .back a').on('click', function(e) {
    e.preventDefault();
    history.back();
  });
});

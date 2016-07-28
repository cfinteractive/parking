parking.info_windows = [];
parking.central_waterfront = new google.maps.LatLng(47.607, -122.338);
parking.pioneer_square = new google.maps.LatLng(47.602, -122.335);
parking.retail_core = new google.maps.LatLng(47.610, -122.336);
parking.view_on_map_center = new google.maps.LatLng(47.604, -122.33);
parking.context_lat = 0;
parking.context_lng = 0;
parking.context_title = '';

parking.initializeMap = function() {
  var myOptions = {
    center: new google.maps.LatLng(47.604, -122.340),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    styles: parking.styles,
    scaleControl: true
  };
  parking.map = new google.maps.Map(document.getElementById("map"), myOptions);

  $('#quick-zoom-template').clone().appendTo($('.map-container'));
  $('.map-container #quick-zoom-template').attr('id', 'quick-zoom');
  parking.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('quick-zoom'));

  var marker_regular = {
    url: 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_low = {
    url: 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 90),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_flat = {
    url: 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 205),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_epark = {
    url: 'img/marker-sprites.png',
    size: new google.maps.Size(35, 45),
    origin: new google.maps.Point(0, 45),
    anchor: new google.maps.Point(18, 45)
  };
  var marker_shadow = {
    url: 'img/marker-sprites.png',
    size: new google.maps.Size(45, 25),
    origin: new google.maps.Point(0, 135),
    anchor: new google.maps.Point(9, 25)
  };

  var next_epark_index = 1000;
  parking.marker_bounds = new google.maps.LatLngBounds();
  $.each(parking.lots, function(){
    var icon = marker_regular;
    if (this.low_cost === true) {
      icon = marker_low;
    } else if (this.flat_rate === true) {
      icon = marker_flat;
    } else if (this.epark === true) {
      icon = marker_epark;
    } else {
      icon = marker_regular;
    }

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.lat, this.lng),
      map: parking.map,
      title: this.title,
      address: this.address, // not part of Marker, but need for map analytics
      icon: icon,
      shadow: marker_shadow,
      id: this.id
    });
    if (this.epark === true) {
      marker.setZIndex(next_epark_index);
      next_epark_index++;
    }
    parking.marker_bounds.extend(marker.position);

    google.maps.event.addDomListener(marker, 'click', function() {
      var lot_page_url = $('.lot-list li[data-lot-id="' + this.id + '"]').find('a').attr('href');
      // Uncomment to display map center in clicked infoWindow
      // info_window.setContent(map.getCenter().toString());
      _gaq.push(['_trackEvent', 'Marker opened', this.title, this.address]);
      ga('send', 'event', 'Marker opened', this.title, this.address);
      var query_params = parking.get_context_query();
      $('#map').fadeOut(function() {
        $('.map-container').addClass('subpage');
      });
      $('.map-container').load(
        lot_page_url + ' article.lot',
        function() {
          parking.initializeMiniMap();
          parking.renderEpark();
        }
      );
      parking.close_pin_drop();
    });

    // Uncomment to capture events from StreetView
    // google.maps.event.addDomListener(parking.streetview, 'position_changed', parking.updateMapDebugInfo);
    // google.maps.event.addDomListener(parking.streetview, 'pov_changed', parking.updateMapDebugInfo);
  });
};

parking.initializeSearch = function() {
  var input = document.getElementById('q');
  var options = {
    bounds: {
      south: 47.50055,
      west: -122.432671,
      north: 47.762453,
      east: -122.236977
    }
  };
  parking.autocomplete = new google.maps.places.Autocomplete(input, options);

  parking.autocomplete.addListener('place_changed', function() {
    var place = parking.autocomplete.getPlace();
    if (place.geometry) {
      parking.display_search_results(place.geometry.location, place.name);
    }
  });
};

// Uncomment to add debug display to StreetView
// parking.debug_display = $('.streetview-debug');
// parking.updateMapDebugInfo = function(e) {
  // pos = parking.streetview.getPosition();
  // pov = parking.streetview.getPov();
  // parking.debug_display.html(
    // 'lat: ' + pos.lat() + '<br>' +
    // 'lng: ' + pos.lng() + '<br>' +
    // 'heading: ' + pov.heading + '<br>' +
    // 'pitch: ' + pov.pitch
  // );
// };

parking.display_search_results = function(position, title) {
  $('.home-list').removeClass('home-list-show');
  $('.mobile-home-list').removeClass('mobile-home-list-show');
  $('.hours-lots').removeClass('hours-lots-show');
  $('.neighborhoods').removeClass('neighborhoods-show');

  if ($('#map').length === 0) {
    parking.reopen_map();
  }

  if (typeof(parking.current_marker) !== 'undefined') {
    parking.current_marker.setMap(null);
  }
  parking.map.panTo(position);
  parking.current_marker = new google.maps.Marker({
      position: position,
      map: parking.map,
      title: title,
      animation: google.maps.Animation.DROP,
      zIndex: 5000
  });
  parking.context_lat = position.lat();
  parking.context_lng = position.lng();
  parking.context_title = title;

  parking.sortLotsByDistance(position);
};

parking.hide_search_results = function() {
  $('.lot-list').removeClass('lot-list-show');
  $('.hours-lots').removeClass('hours-lots-show');
  $('.neighborhoods').removeClass('neighborhoods-show');
  $('.home-list').addClass('home-list-show');
  $('.mobile-home-list').addClass('mobile-home-list-show');
  if (typeof(parking.current_marker) !== 'undefined') {
    parking.current_marker.setMap(null);
  }
  parking.context_lat = 0;
  parking.context_lng = 0;
  parking.context_title = '';
};

parking.show_search_close = function() {
  $('.search .close').addClass('show');
};

parking.hide_search_close = function() {
  $('.search .close').removeClass('show');
};

parking.close_pin_drop = function() {
  $('.home-list .view-on-map .caption').addClass('caption-show');
  $('.home-list .view-on-map .instructions').removeClass('instructions-show');
  if (typeof(parking.pin_drop_event !== 'undefined')) {
    google.maps.event.removeListener(parking.pin_drop_event);
  }
};

parking.reopen_map = function() {
  $('.map-container')
    .removeClass('subpage')
    .empty()
    .append('<div id="map"></div>');
  parking.initializeMap();
};

parking.get_context_query = function() {
  var query_params = '';
  if (parking.context_lat && parking.context_lng && parking.context_title) {
    query_params = '?lat=' + parking.context_lat +
                   '&lng=' + parking.context_lng +
                   '&title=' + parking.context_title;
  }
  return query_params;
};


// Fire it up, wire up event handlers to the DOM
$(function() {
  parking.initializeMap();
  parking.initializeSearch();

  $('.lot-list').on('click', 'a:not(.back, .hood)', function(e) {
    e.preventDefault();
    if (document.body.clientWidth > 767) {
      $('#map').fadeOut(function() {
        $('.map-container').addClass('subpage');
      });
      $('.map-container').load(
        $(this).attr('href') + ' article.lot',
        function() {
          parking.initializeMiniMap();
          setTimeout(function() {
            $.smoothScroll({
              scrollTarget: $('.sidebar'),
              offset: -90
            });
          }, 1000);
        }
      );
    } else {
      var query_params = parking.get_context_query();
      window.location.href = $(this).attr('href') + query_params;
    }
  });

  $('.search form').on('submit', function(e) {
    e.preventDefault();
  });

  $('.go-pioneer, .neighborhood-pioneer').click(function(e) {
    e.preventDefault();
    parking.map.panTo(parking.pioneer_square);
    parking.map.setZoom(16);
  });

  $('.go-waterfront, .neighborhood-waterfront').click(function(e) {
    e.preventDefault();
    parking.map.panTo(parking.central_waterfront);
    parking.map.setZoom(16);
  });

  $('.go-retail, .neighborhood-retail').click(function(e) {
    e.preventDefault();
    parking.map.panTo(parking.retail_core);
    parking.map.setZoom(16);
  });

  $('#q').on('keyup', function(e) {
    // console.log('keyup: ' + e.which);
    window.clearTimeout(parking.search_timeout);
    if (e.which === 13) {
      // TODO: launch topmost search suggestion, if any
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
    parking.hide_search_results();
  });
});


/*!
 * jQuery Smooth Scroll Plugin v1.4
 *
 * Date: Mon Apr 25 00:02:30 2011 EDT
 * Requires: jQuery v1.3+
 *
 * Copyright 2010, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 *
 *
*/
(function(c){function k(b){return b.replace(/^\//,"").replace(/(index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")}var l=k(location.pathname),m=function(b){var d=[],a=false,e=b.dir&&b.dir=="left"?"scrollLeft":"scrollTop";this.each(function(){if(!(this==document||this==window)){var f=c(this);if(f[e]()>0)d.push(this);else{f[e](1);a=f[e]()>0;f[e](0);a&&d.push(this)}}});if(b.el==="first"&&d.length)d=[d.shift()];return d};c.fn.extend({scrollable:function(b){return this.pushStack(m.call(this,{dir:b}))},
firstScrollable:function(b){return this.pushStack(m.call(this,{el:"first",dir:b}))},smoothScroll:function(b){b=b||{};var d=c.extend({},c.fn.smoothScroll.defaults,b);this.die("click.smoothscroll").live("click.smoothscroll",function(a){var e=c(this),f=location.hostname===this.hostname||!this.hostname,g=d.scrollTarget||(k(this.pathname)||l)===l,i=this.hash,h=true;if(!d.scrollTarget&&(!f||!g||!i))h=false;else{f=d.exclude;g=0;for(var j=f.length;h&&g<j;)if(e.is(f[g++]))h=false;f=d.excludeWithin;g=0;for(j=
f.length;h&&g<j;)if(e.closest(f[g++]).length)h=false}if(h){d.scrollTarget=b.scrollTarget||i;d.link=this;a.preventDefault();c.smoothScroll(d)}});return this}});c.smoothScroll=function(b,d){var a,e,f,g=0;e="offset";var i="scrollTop",h={};if(typeof b==="number"){a=c.fn.smoothScroll.defaults;f=b}else{a=c.extend({},c.fn.smoothScroll.defaults,b||{});if(a.scrollElement){e="position";a.scrollElement.css("position")=="static"&&a.scrollElement.css("position","relative")}f=d||c(a.scrollTarget)[e]()&&c(a.scrollTarget)[e]()[a.direction]||
0}a=c.extend({link:null},a);i=a.direction=="left"?"scrollLeft":i;if(a.scrollElement){e=a.scrollElement;g=e[i]()}else e=c("html, body").firstScrollable();h[i]=f+g+a.offset;e.animate(h,{duration:a.speed,easing:a.easing,complete:function(){a.afterScroll&&c.isFunction(a.afterScroll)&&a.afterScroll.call(a.link,a)}})};c.smoothScroll.version="1.4";c.fn.smoothScroll.defaults={exclude:[],excludeWithin:[],offset:0,direction:"top",scrollElement:null,scrollTarget:null,afterScroll:null,easing:"swing",speed:400}})(jQuery);

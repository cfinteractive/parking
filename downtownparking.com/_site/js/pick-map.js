parking.initializeMap = function() {
  var myOptions = {
    center: new google.maps.LatLng(47.603, -122.338),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    styles: parking.styles,
    scaleControl: true,
    streetViewControl: false,
    disableDoubleClickZoom: true
  };
  parking.map = new google.maps.Map(document.getElementById("map"), myOptions);
  parking.drop_marker = null;

  var marker_regular = {
    url: '../img/marker-sprites-tiny.png',
    size: new google.maps.Size(16, 21),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(9, 22)
  };
  var marker_low = {
    url: '../img/marker-sprites-tiny.png',
    size: new google.maps.Size(16, 21),
    origin: new google.maps.Point(0, 42),
    anchor: new google.maps.Point(9, 22)
  };
  var marker_flat = {
    url: '../img/marker-sprites-tiny.png',
    size: new google.maps.Size(16, 21),
    origin: new google.maps.Point(0, 96),
    anchor: new google.maps.Point(9, 22)
  };
  var marker_epark = {
    url: '../img/marker-sprites-tiny.png',
    size: new google.maps.Size(16, 21),
    origin: new google.maps.Point(0, 21),
    anchor: new google.maps.Point(9, 22)
  };
  var marker_shadow = {
    url: '../img/marker-sprites-tiny.png',
    size: new google.maps.Size(21, 12),
    origin: new google.maps.Point(0, 63),
    anchor: new google.maps.Point(5, 12)
  };

  google.maps.event.addListener(parking.map, 'click', parking.handleMapClick);

  parking.num_lots = parking.lots.length;
  parking.lots_by_latitude = parking.lots.sort(function(a, b) {
    return a.lat - b.lat;
  });
  var next_epark_index = 1000;
  for (var i = parking.num_lots - 1; i >= 0; i--) {
    var icon = marker_regular;
    if (parking.lots_by_latitude[i].low_cost === true) {
      icon = marker_low;
    } else if (parking.lots_by_latitude[i].flat_rate === true) {
      icon = marker_flat;
    } else if (parking.lots_by_latitude[i].epark === true) {
      icon = marker_epark;
    } else {
      icon = marker_regular;
    }

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(parking.lots_by_latitude[i].lat, parking.lots_by_latitude[i].lng),
      map: parking.map,
      zIndex: parking.num_lots - i,
      clickable: false,
      icon: icon,
      shadow: marker_shadow
    });
    if (parking.lots_by_latitude[i].epark === true) {
      marker.setZIndex(next_epark_index);
      next_epark_index++;
    }
  }
};

parking.handleMapClick = function(e) {
  parking.dropPin(e);
  var position = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
  parking.sortLotsByDistance(position);
};

parking.dropPin = function(e) {
  if (parking.drop_marker !== null) {
    parking.drop_marker.setMap(null);
    parking.drop_marker = null
  }
  parking.drop_marker = new google.maps.Marker({
    map: parking.map,
    clickable: false,
    animation: google.maps.Animation.DROP,
    zIndex: parking.num_lots + 100,
    position: e.latLng
  });
  setTimeout(function() {
    $.smoothScroll({
      scrollTarget: $('.pick-map-results'),
      offset: -200
    });
  }, 1000);
};

$(function() {
  parking.initializeMap();
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

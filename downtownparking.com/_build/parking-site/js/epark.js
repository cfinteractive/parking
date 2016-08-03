// All this crap because IE can't play ball.
// jQuery.XDomainRequest.js
// Author: Jason Moon - @JSONMOON
// IE8+
if (!jQuery.support.cors && jQuery.ajaxTransport && window.XDomainRequest) {
  var httpRegEx = /^https?:\/\//i;
  var getOrPostRegEx = /^get|post$/i;
  var sameSchemeRegEx = new RegExp('^'+location.protocol, 'i');
  var htmlRegEx = /text\/html/i;
  var jsonRegEx = /\/json/i;
  var xmlRegEx = /\/xml/i;
  
  // ajaxTransport exists in jQuery 1.5+
  jQuery.ajaxTransport('text html xml json', function(options, userOptions, jqXHR){
    // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
    if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(options.url) && sameSchemeRegEx.test(options.url)) {
      var xdr = null;
      var userType = (userOptions.dataType||'').toLowerCase();
      return {
        send: function(headers, complete){
          xdr = new XDomainRequest();
          if (/^\d+$/.test(userOptions.timeout)) {
            xdr.timeout = userOptions.timeout;
          }
          xdr.ontimeout = function(){
            complete(500, 'timeout');
          };
          xdr.onload = function(){
            var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
            var status = {
              code: 200,
              message: 'success'
            };
            var responses = {
              text: xdr.responseText
            };
            try {
              if (userType === 'html' || htmlRegEx.test(xdr.contentType)) {
                responses.html = xdr.responseText;
              } else if (userType === 'json' || (userType !== 'text' && jsonRegEx.test(xdr.contentType))) {
                try {
                  responses.json = jQuery.parseJSON(xdr.responseText);
                } catch(e) {
                  status.code = 500;
                  status.message = 'parseerror';
                  //throw 'Invalid JSON: ' + xdr.responseText;
                }
              } else if (userType === 'xml' || (userType !== 'text' && xmlRegEx.test(xdr.contentType))) {
                var doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = false;
                try {
                  doc.loadXML(xdr.responseText);
                } catch(e) {
                  doc = undefined;
                }
                if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                  status.code = 500;
                  status.message = 'parseerror';
                  throw 'Invalid XML: ' + xdr.responseText;
                }
                responses.xml = doc;
              }
            } catch(parseMessage) {
              throw parseMessage;
            } finally {
              complete(status.code, status.message, responses, allResponseHeaders);
            }
          };
          // set an empty handler for 'onprogress' so requests don't get aborted
          xdr.onprogress = function(){};
          xdr.onerror = function(){
            complete(500, 'error', {
              text: xdr.responseText
            });
          };
          var postData = '';
          if (userOptions.data) {
            postData = (jQuery.type(userOptions.data) === 'string') ? userOptions.data : jQuery.param(userOptions.data);
          }
          xdr.open(options.type, options.url);
          xdr.send(postData);
        },
        abort: function(){
          if (xdr) {
            xdr.abort();
          }
        }
      };
    }
  });
}

// Code that does something starts here
parking.epark_endpoint = "http://data.seattle.gov/resource/3neb-8edu.json";

parking.getEparkData = function(id, total_spaces_raw, callback) {
  if (id) {
    var url = parking.epark_endpoint + '?buslic_location_id=' + id;
    var total_spaces = parseInt(total_spaces_raw, 10);
    $.getJSON(url)
    .done(function(data) {
      var output = {};
      output.id = id;
      output.open_spaces = parseInt(data[0].vacant, 10);
      output.dea_stalls = parseInt(data[0].dea_stalls, 10);
      output.capacity = 0;
      if (isNaN(total_spaces)) {
        output.capacity = output.dea_stalls;
      } else {
        output.capacity = parseInt(total_spaces, 10);
      }
      output.full = Math.round((output.capacity - output.open_spaces) / output.capacity * 100);
      if (! isNaN(output.full)) {
        callback(output);
      }
    })
    .fail(function(jqxhr, textStatus, error) {
      console.log(error + ":" + textStatus);
    });
  }
};

parking.displayEparkSingleLot = function(data) {
  $('.epark-info .open-spaces').html(data.open_spaces);
  $('.epark-info .capacity').html(data.capacity);
  $('.epark-info .full-bar span').html(data.full);
  $('.epark-info .full-bar').css('width', data.full.toString() + '%');
  $('.epark-info').slideDown();
};

parking.displayEparkList = function(data) {
  $lot = $('.lot-list li[data-buslic-location-id=' + data.id + ']');
  $lot.find('.full-bar span').html(data.full);
  $lot.find('.full-bar').css('width', data.full.toString() + '%');
  $lot.addClass('epark');
  $lot.find('.epark-wrapper').slideDown();
};

parking.renderEpark = function() {
  var id = $('.lot').data('buslic-location-id');
  var total_spaces = $('.lot').data('total-spaces');
  if (typeof id !== 'undefined') {
    parking.getEparkData(id, total_spaces, parking.displayEparkSingleLot);
  } else {
    var ids = [];
    $('.lot-list li[data-buslic-location-id]').each(function() {
      parking.getEparkData($(this).data('buslic-location-id'), $(this).data('total-spaces'), parking.displayEparkList);
      ids.push($(this).data('buslic-location-id'));
    });
  }
}

$(function() {
  $.ajaxSetup({
    cache: false
  });
  parking.renderEpark();
});

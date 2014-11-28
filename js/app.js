// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    }; // center lat & lng

    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    }); // map

    var infoWindow = new google.maps.InfoWindow();

    var trafficCams;
    var markers = [];

    // Angular = .succes, .error, .finally
    $.getJSON('https://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            trafficCams = data;

            data.forEach(function(trafficCam, itemIndex) {
                var marker = new google.maps.Marker( {
                    position: {
                        lat: Number(trafficCam.location.latitude),
                        lng: Number(trafficCam.location.longitude)
                    },
                    map: map,
                    index: itemIndex
                }); // marker
                markers.push(marker);

                // infoWindow
                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<h2>' + trafficCam.cameralabel + '</h2>';
                    html += '<img src="' + trafficCam.imageurl.url + '">';

                    map.panTo(this.getPosition());

                    infoWindow.setContent(html);
                    infoWindow.open(map, this); // this = marker
                });
            }); // for each loop on array stations
        })
        .fail(function(error) {
            console.log(error);
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        });

    $('#search').bind('search input', function() {
        var input = $('#search').val().toLowerCase();
 //       console.log(input);
        markers.forEach(function(marker) {
            var key = trafficCams[marker.index];
            var search = key.cameralabel.toLowerCase();
            if (search.indexOf(input) !== -1) {
                marker.setMap(map);
            }
            else {
                marker.setMap(null);
            }
        });
    }); // search
}); // doc ready function
// bird.js

var map;
var markers = [];
var bird_count = 0;

function initMap() {
  var myMapCenter = {lat: 43.052955, lng: -87.9003088};
  var mapOptionsHide = {
    default: null,
    hide: [
      {
        featureType: 'poi.business',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{visibility: 'on'}]
      }
    ]
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: myMapCenter
  });
  map.setOptions({styles: mapOptionsHide['hide']});

  // Data Fetch
  downloadUrl('https://bird-getvehicles.azurewebsites.net/', function(data) {

    var json_response = JSON.parse(data.response) // Transform JSON String to Object

    if( json_response === undefined || json_response.length == 0 ) {
      alert( "Sorry Walley World is closed. Try again tomorrow when the Birds are out folks!" )
    }
    // Data Loop
    else {
      json_response.forEach(function(bird) {
        var marker = {lat: parseFloat(bird.location.latitude), lng: parseFloat(bird.location.longitude)};
        addMarker(marker, bird.code, bird.id, bird.battery_level)
      }
    )} // end data loop
    console.log("Bird Count -> " + bird_count);
  }); // downloadUrl
} //initMap

// Adds a marker to the map and push to the array.
function addMarker(bird, code, id, battery) {

  var bird_icon = {
    url : 'img/sam.png',
    scaledSize: new google.maps.Size(30, 30)
  }

  var marker = new google.maps.Marker({
    position: bird,
    map: map,
    icon: bird_icon
  });

  markers.push(marker);

  var infoWindow = new google.maps.InfoWindow;
  var infowincontent = document.createElement('div');

  var strong = document.createElement('strong');
  strong.textContent = "Battery level: " + battery + "%"
  infowincontent.appendChild(strong);
  infowincontent.appendChild(document.createElement('br'));

  var text = document.createElement('text');
  text.textContent = "Unlock code: " + code
  infowincontent.appendChild(text);

  bird_count+=1

  marker.addListener('click', function() {
    infoWindow.setContent(infowincontent);
    infoWindow.open(map, marker);
  })
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };
  request.open('GET', url, true);
  request.send(null);
}

function doNothing() {} // Dummy function for state loop

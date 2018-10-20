let map;
let Quest = function () {
  let markers = [];


  this.addMarker = function (marker) {
      marker.push(marker);
  }
}

function getCurrentPosition (func) {
  navigator.geolocation.getCurrentPosition(function (location) {
      let coords = location.coords;
      
      func.call(this, { lat: coords.latitude, lng: coords.longitude });
  });
}

function placeMarker(position) {
  let marker = new google.maps.Marker({ position, map });
  map.panTo(position);

  return marker;
}

function placePositionMarker() {
  getCurrentPosition (function (position) {
    let icon = { //icon
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5

    };
    let marker = new google.maps.Marker({ position, map, icon });
    map.panTo(position);
    map.setZoom(15)
  });
}

// Initialize and add the map
function initMap() {
  let quest = new Quest();
  // The map, centered at Uluru
  map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4});
  // Go to the current location
  placePositionMarker();

  map.addListener('click', function(e) {
      let marker = placeMarker(e.latLng, map);
      quest.addMarker(marker);
      if (quest.markers.length == 0) {
        $('#artifactAdder').html('Artifact 1');
      }
  });

  $('#quest-submit').on('click', function () {
    quest.package();
    //console.log(quest.)
  });
}
let map;
let Quest = function () {
  let markers = [];


  this.addMarker = function (marker) {
      markers.push(marker);
  }

  this.getMarkers = function () {
    return markers;
  }

  this.currentMarker = function () {
    return markers[markers.length - 1];
  }

  this.currentMarkerCount = function () {
    return markers.length;
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
      let count = quest.currentMarkerCount();

      if (count < 2 || $(`.artifact-clue[data-id="${count}"]`).val().trim() != '') {
        let marker = placeMarker(e.latLng, map);
        quest.addMarker(e.latLng);

        if (count == 0) {
          $('#artifactAdder').html('Artifact 1');
        } else {
          $('#artifactAdder').append(`<br><input type="text" class="artifact-clue" data-id="${count + 1}" placeholder="Clue" style="border: none;margin: 6px 2px;"><br> Artifact ` + (count+1));
        }
      }
  });

  $('#quest-submit').on('click', function () {
    quest.package();
    //console.log(quest.)
  });
}
let map;
let Quest = function () {
  let markers = [];
  let title = null;
  let description = null;
  let location = null;
  let firstClue = null;

  this.addMarker = function (marker) {
      if (markers.length == 0) {
        $.getJSON(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.lat}&lon=${marker.lng}`, function (loc) {
          location = loc.address.city + ', ' + loc.address.state;
        });
      }
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

  this.setDescription = function (desc) {
    description = desc;
  }

  this.setTitle = function (Title) {
    title = Title;
  }

  this.setFirstClue = function (initClue) {
    firstClue = initClue;
  }

  this.package = function () {
    return firebase.database().ref('quests').push({
      title: title, firstClue, 
      desc: description, 
      loc: location, 
      markers: markers, 
      creator: firebase.auth().currentUser.uid
    });
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
  map = new google.maps.Map(document.getElementById('map'), {zoom: 4});
  // Go to the current location
  placePositionMarker();

  map.addListener('click', function(e) {
      let count = quest.currentMarkerCount();

      if (count < 2 || $(`.artifact-clue[data-id="${count}"]`).val().trim() != '') {
        let marker = placeMarker(e.latLng, map);
        quest.addMarker({lat: e.latLng.lat(), lng: e.latLng.lng()});

        if (count == 0) {

          $('#artifactAdder').html('Artifact 1');
        } else {
          $('#artifactAdder').append(`<br><input type="text" class="artifact-clue" data-id="${count + 1}" placeholder="Clue" style="border: 1px solid white;margin: 6px 2px;"><br> Artifact ` + (count+1));
        }
      } else {
        $(`.artifact-clue[data-id="${count}"]`).css('border-color', 'red');
        setTimeout(function () {
          $(`.artifact-clue[data-id="${count}"]`).css('border-color', 'white');
        }, 200);
      }
  });

  $(document).on('click', '#quest-submit', function () {
    quest.setDescription($('#questDescription').val().trim());
    quest.setTitle($('#questTitle').text().trim());
    quest.setFirstClue($('#firstClue').val().trim());
    $('.artifact-clue').each(function () {
      let index = parseInt($(this).attr('data-id')) - 2;
      quest.getMarkers()[index].clue = $(this).val();
    });

    quest.package().then(function () {
      alert("submitted")
    })
  });
}
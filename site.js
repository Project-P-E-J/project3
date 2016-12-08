$(document).ready(function() {

  var initLat = 41.8403395;
  var initLong = -87.627072;

  var map = new GMaps({
    el: '#map',
    lat: initLat,
    lng: initLong,
  });
  map.addMarker({
    lat: initLat,
    lng: initLong,
    title: '60616',
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    click: function(e) {
      alert('60616');
    }
  });

  $('#zip-form').on('submit', function(event) {
    var query = $('#zip-code').val();
    console.log(query);
    $('#zip').empty();
    $('#zip').append(query);
    $.get(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' + query +
        '&key=AIzaSyBscMaTy7jt6fISLrMwGIejOy-1i-BqJ_g',
      function(data) {
        // load the initial zip code
        var status = data.status;
        switch(status) {
          case "OK":
            console.log("Successful query");
            break;
          case "ZERO_RESULTS":
            console.log("Zip code not found");
            var str = (' Sorry, I could not find that zip code').fontcolor("red");
            $('#zip').append(str);
            break;
          default:
            console.log('default');
            $('#zip').append(' Sorry, something really weird happened.  We will be investigating this soon');
            break;
        }
        console.log(status);
        var longitude = data.results[0].geometry.location.lng;
        var latitude = data.results[0].geometry.location.lat;
        var city = data.results[0].address_components[1].short_name;

        $('#zip').append(': Longitude: ' + longitude + ', Latitude: ' + latitude + '.  City: ' + city);
        map = new GMaps({
          el: '#map',
          lat: latitude,
          lng: longitude,
          zoom: 9
        });

        map.addMarker({
          lat: latitude,
          lng: longitude,
          title: city,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          click: function(e) {
            alert('You clicked');
          }
        });
        addMarkers(map, query);
      });
    event.preventDefault();
  });



  function addMarkers(map, zip)
  {
    console.log('addMarkers');
    console.log(zip);
    accessData();

    function accessData ()  {
      var key = 'ca77abb4e1f8c1cb6d536dfcdf9f45da';
    // var secret = '68426d0a9aa189d3d8fddb057a27b23d';
    // var md5 = MD5(secret+key);  //needed only for some queries leaving this here for now as I will need it for other queries

    // get authorization token
    // var url = 'https://api.petfinder.com/';  //all the commented out code here is needed should have to get the authorization token
    // var searchItem = 'shelter.find';
    var apiString = 'https://api.petfinder.com/shelter.find?format=json&key=' + key  +
    '&location=' + zip + '&callback=?';

    $.ajax({
      url: apiString,
      dataType: 'jsonp',
      error: function (error) {
        console.log(error);
        var str = ' A data access error occurred.  Please try again later';
        $('#error').append(str.fontcolor("red"));
      },
      success: function(data){
      var shelters = data.petfinder.shelters.shelter;
      var localShelters = [];
      for(var i = 0;  i < shelters.length; i++) {
        map.addMarker({
          lat: shelters[i].latitude.$t,
          lng: shelters[i].longitude.$t,
          title: shelters[i].name.$t,
          icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          click: function(e) {
            alert('you clicked');
          }
        });
        }
      }

    });

  }
}

});  //document.ready end

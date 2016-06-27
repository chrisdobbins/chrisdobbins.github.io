'use strict';
var map;
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'),{
    // 33.61,-84.29
    center: {lat: 33.61, lng: -84.29},
    zoom: 5
  });

  map.addListener('click', function(ev) {
    var latLng = {},
        geocoder = new google.maps.Geocoder,
        infoWindow = new google.maps.InfoWindow;
    latLng.lat = ev.latLng.lat();
    latLng.lng = ev.latLng.lng();
    geocoder.geocode({'location': latLng}, function(results, status) {
      var city,
          state,
          countryCode;
      if (status === google.maps.GeocoderStatus.OK) {
        console.log(results[0].address_components);
        results[0].address_components.forEach(function(currentComponent) {
          switch (currentComponent.types[0]) {
            case 'country':
              countryCode = currentComponent.short_name;
              break;
            case 'locality':
              city = currentComponent.long_name;
              break;
            case 'administrative_area_level_1':
              state = currentComponent.long_name;
              break;
          }
        });
        getLocWeather(latLng, city, state, countryCode);
      }
    });
     //, city, state, country);
    // console.log(`${ev.latLng.lat()}, ${ev.latLng.lng()}`);
  });
}
function getLocWeather(latLng, city, state, country) {
  var weatherUrlStart = 'https://api.weather.com/v2/turbo/vt1precipitation;vt1currentdatetime;vt1pollenforecast;vt1dailyForecast;vt1observation?units=e&language=en-US&geocode=',
  weatherUrlEnd = '&format=json&apiKey=c1ea9f47f6a88b9acb43aba7faf389d4',
  weatherXmlHttp = new XMLHttpRequest(),
  latLngArr = [latLng.lat, latLng.lng];
  weatherXmlHttp.onreadystatechange = function() {
      var weatherData;
      if (weatherXmlHttp.response){
        //TODO: create pop-up modal with weather info here
        weatherData = weatherXmlHttp.response;
        alert(`Weather for: ${(city) ? city + ', ' : ''}${(state) ? state + ', ' : ''}${(country) || ''}:
coordinates: ${weatherData.id}
current temp: ${weatherData.vt1observation.temperature}${'\xB0'}F
feels like: ${weatherData.vt1observation.feelsLike}${'\xB0'}F
humidity: ${weatherData.vt1observation.humidity}%
current conditions: ${weatherData.vt1observation.phrase}`);

    }
  }

  weatherXmlHttp.open('GET',
  weatherUrlStart + latLngArr.join(',') + weatherUrlEnd, true);
  weatherXmlHttp.responseType = 'json';
  weatherXmlHttp.send(null);

}

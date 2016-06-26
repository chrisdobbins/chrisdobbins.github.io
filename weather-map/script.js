'use strict';
var map;
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'),{
    // 33.61,-84.29
    center: {lat: 33.61, lng: -84.29},
    zoom: 5
  });

  map.addListener('click', function(ev) {
    var latLng = {};

    latLng.lat = ev.latLng.lat();
    latLng.lng = ev.latLng.lng();
    getLocWeather(latLng);
    // console.log(`${ev.latLng.lat()}, ${ev.latLng.lng()}`);
  });
}
function getLocWeather(latLng) {
  var weatherUrlStart = 'https://api.weather.com/v2/turbo/vt1precipitation;vt1currentdatetime;vt1pollenforecast;vt1dailyForecast;vt1observation?units=e&language=en-US&geocode=',
  weatherUrlEnd = '&format=json&apiKey=c1ea9f47f6a88b9acb43aba7faf389d4',
  weatherXmlHttp = new XMLHttpRequest(),
  latLngArr = [latLng.lat, latLng.lng];
  weatherXmlHttp.onreadystatechange = function() {
      var weatherData;
      if (weatherXmlHttp.response){
        // create pop-up modal with weather info here
        weatherData = weatherXmlHttp.response;
        alert(`coordinates: ${weatherData.id}
current temp: ${weatherData.vt1observation.temperature}
current conditions: ${weatherData.vt1observation.phrase}
feels like: ${weatherData.vt1observation.feelsLike}
humidity: ${weatherData.vt1observation.humidity}%`);
    }
  }

  weatherXmlHttp.open('GET',
  weatherUrlStart + latLngArr.join(',') + weatherUrlEnd, true);
  weatherXmlHttp.responseType = 'json';
  weatherXmlHttp.send(null);

}

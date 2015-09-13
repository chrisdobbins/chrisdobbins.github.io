/**
 * Created by Christopher Dobbins on 9/12/15.
 */

var UserPosition = function() {
    var userLat, userLng;
    navigator.geolocation.getCurrentPosition(
        function(currentPosition) {
            userLat = currentPosition.coords.latitude;
            userLng = currentPosition.coords.longitude;
        },
        function error (errMsg){
            alert("Please enable geolocation.");
        },
        {enableHighAccuracy: true});
    return {
        lat: userLat,
        lng: userLng,
        latLng: new google.maps.LatLng(userLat, userLng)
    }
};

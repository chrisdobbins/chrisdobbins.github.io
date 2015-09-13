function findMARTA() {
    navigator.geolocation.getCurrentPosition(
        function(currentPosition) {
            var userPosition = {
                lat: currentPosition.coords.latitude,
                lng: currentPosition.coords.longitude,
                latLng: toLatLng(currentPosition.coords.latitude,
                                 currentPosition.coords.longitude)
            };
            var directionsService = new google.maps.DirectionsService();
            getDirections(userPosition, directionsService, initMap(userPosition));
        },
        function error (errMsg) {
            alert("Please enable geolocation.");
        },
        {enableHighAccuracy: true});
}

function initMap(position) {
    console.log(position);
    var map = new google.maps.Map(document.getElementById('mapgoeshere'), mapOptions);
    var mapOptions = {
        center: position.latLng,
        zoom: 14,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    };
    return map;
}

function getDirections(startingPosition, directionsService, map){
    var directionsDiv = document.getElementById('directionsgohere');
    var isWalking = document.getElementById('walkingDirections').checked;
    var showDirections = new google.maps.DirectionsRenderer();
    //request that will be sent to directions API
    var request = {
        origin: startingPosition.latLng,
        destination: findClosestStation(startingPosition),
        unitSystem: google.maps.UnitSystem.IMPERIAL
    };
    if (isWalking){
        request.travelMode = google.maps.TravelMode.WALKING;
    }
    else {
        request.travelMode = google.maps.TravelMode.DRIVING;
    }
    directionsService.route(request, function(result, status){
        if (status === google.maps.DirectionsStatus.OK){
            console.log(result);
            document.getElementById('directionsgohere').style.backgroundColor = 'rgba(255,255,255,.8)';
            showDirections.setDirections(result);
            showDirections.setMap(map);
            if (directionsDiv.length  !== 0){
                directionsDiv.innerHTML = '';
            }
            showDirections.setPanel(directionsDiv);
        };
    });
};

function findClosestStation(userPosition){
    var shortestDist = 0;
    var nearestStation = '';
    var compareDist = 0;
    var destinationLatLng;
    var freeParkingSelected = document.getElementById('hasFreeParking').checked;
    var lat2, lng2;

    for (var station in martaStations){
        if (freeParkingSelected && !martaStations[station].hasFreeParking){
            //user selects free parking option but the current station in the iteration
            //does not have free parking, so the loop skips to the next one
            continue;
        }
        //user did not select free parking as an option
        else {
            lat2 = martaStations[station].lat;
            lng2 = martaStations[station].lng;
        }

        compareDist = getDistance(userPosition.lat, userPosition.lng, lat2, lng2);

        if (shortestDist === 0 || compareDist < shortestDist){
            shortestDist = compareDist;
            nearestStation = station.toString();
            destinationLatLng = toLatLng(lat2, lng2);
            console.log(nearestStation + ':  ' + shortestDist + ' mi');
        }
    }
    return destinationLatLng;
}

//gets direct distance between
// any two geographic points on Earth
// using spherical law of cosines
function getDistance(lat1, lng1, lat2, lng2) {
    //earth's approx radius in km
    var kmRadius = 6371;
    //latitude and longitude vals converted to radians
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var radLng1 = toRadians(lng1);
    var radLng2 = toRadians(lng2);
    var lngDiff = radLng2 - radLng1;
    return toMiles(Math.acos(Math.sin(radLat1) * Math.sin(radLat2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(lngDiff)) * kmRadius);

    function toRadians(angle) {
        return angle * (Math.PI/180);
    }
    function toMiles (kmDistance){
        return kmDistance * .621371;
    }
}

function toLatLng(lat, lng) {
    return new google.maps.LatLng(lat, lng);
}

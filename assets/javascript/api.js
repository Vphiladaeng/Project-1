//User location through IP api
function ipLookUp() {
    $.ajax('http://ip-api.com/json')
        .then(
            function success(response) {
                //DELETE logs later
                console.log(response);
                console.log(response.lat);
                console.log(response.lon);

                sessionStorage.setItem("sLat", response.lat);
                sessionStorage.setItem("sLong", response.lon);
                startMap();
            },

            function fail(data, status) {
                console.log('Request failed.  Returned status of',
                    status);
            }
        );
}

// ================== Google Map Variables and Calls ================================================

function startMap() {
    var myLatlng = new google.maps.LatLng(sessionStorage.getItem("sLat"), sessionStorage.getItem("sLong"));
    var myOptions = { zoom: 13, center: myLatlng }
    var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

    google.maps.event.addListener(map, 'click', function (event) {
        var response = event.latLng;
        sessionStorage.setItem("eLat", response.lat());
        sessionStorage.setItem("eLong", response.lng());
        //DELETE later
        console.log(response);
        console.log(response.lat());
        console.log(response.lng());
    });

}

// ================== Uber api call ================================================================

function getUberApi(startLat, startLong, endLat, endLong) {
    var queryURL = 'https://cors-anywhere.herokuapp.com/api.uber.com/v1.2/estimates/price?';
    var accessKey = '&server_token=ItD3_RRwUZCvBw5a4gEmtVwnD9GuOzn2Q2stHyee';
    var startLatitude = 'start_latitude=' + startLat;
    var startLongitude = '&start_longitude=' + startLong;
    var endLatitude = '&end_latitude=' + endLat;
    var endLongitude = '&end_longitude=' + endLong;

    queryURL += startLatitude + startLongitude + endLatitude + endLongitude + accessKey;

    $.ajax({ url: queryURL, method: "GET" })
        .then(function (response) {
            //ADD functionality to results page
            //UBER DOM FUNCTION CALL
            console.log(response);
            writeUber(response);

        });
}

// ================== Weather api call ================================================================

function getWeather() {

    var lat = sessionStorage.getItem("eLat");
    var lon = sessionStorage.getItem("eLong");
    queryURL = 'https://api.openweathermap.org/data/2.5/weather?';
    weatherLat = 'lat=' + lat;
    weatherLon = '&lon=' + lon;
    accessKey = '&APPID=0ff132ddd83d15f772c6169f2ee83a2b';
    units = "&units=imperial"

    queryURL += weatherLat + weatherLon + units + accessKey;

    $.ajax({ url: queryURL, method: "GET" })
        .then(function (response) {
            var temp = response.main.temp
            var currWeather = response.weather[0].description
            var city = response.name
            console.log("Dest. Temperature: " + temp)
            console.log("Dest. Weather: " + currWeather)
            console.log(response.name)
            // $("#city").append(" " + city)
            $("#temp").append(" " + temp)
            $("#currWeather").append(" " + currWeather)
            // weatherToDom()
        });

}

function getTransit(key) {

    var destinationLat= sessionStorage.getItem("eLat");
    var destinationLon= sessionStorage.getItem("eLong");
    var startingLat= sessionStorage.getItem("sLat");
    var startingLon= sessionStorage.getItem("sLong");

    queryURL = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='
    apiKey= key
    console.log("transit")
    queryURL += startingLat + "," + startingLon + "&destinations=" + destinationLat + "," + destinationLon + "&mode=transit" + "&key=" + apiKey
    console.log(queryURL)
     $.ajax({ url: queryURL, method: "GET"})
        .then(function (response) {
            console.log("running");
            console.log(response);
            var transitDuration = response.rows[0].elements[0].duration.text
            var transitDistance = response.rows[0].elements[0].distance.text
            $("#transitDuration").append(transitDuration)
            $("#transitDistance").append(" " + transitDistance)

        });
}

function getWalking(key) {

    var destinationLat= sessionStorage.getItem("eLat");
    var destinationLon= sessionStorage.getItem("eLong");
    var startingLat= sessionStorage.getItem("sLat");
    var startingLon= sessionStorage.getItem("sLong");
    apiKey= key
    queryURL = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='
    queryURL += startingLat + "," + startingLon + "&destinations=" + destinationLat + "," + destinationLon + "&mode=walking" + "&key=" + apiKey
    console.log("walking")
    console.log(queryURL)

    $.ajax({ url: queryURL, method: "GET" })
        .then(function (response) {
            console.log("running");
            console.log(response);
            var walkingDuration = response.rows[0].elements[0].duration.text
            var walkingDistance = response.rows[0].elements[0].distance.text
            var destAdd = response.destination_addresses
            console.log(destAdd)
            $("#walkingDuration").empty().append(" " + walkingDuration)
            $("#walkingDistance").empty().append(" " + walkingDistance)
            $("#city").append(" " + destAdd)


        });
}
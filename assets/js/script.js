//API key for later use =  d6563c1f7289474849eef3ceaf635e1d

$(document).ready(function(){

    var cities = [];

    $("#displayCity").hide();
    $("#fiveDay").hide();

//api call for currently searched city
    function displayCityForecast(city){
        var apiKey = "d6563c1f7289474849eef3ceaf635e1d";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var weatherIcon = response.weather[0].icon;
            var date = $("<h2>").text(moment().format('l'));
            var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"); 
            var tempFar = (response.main.temp - 273.15) * 1.80 + 32;
                
            $("#displayCityName").text(response.name);
            $("#displayCityName").append(date);
            $("#displayCityName").append(icon);
            $("#displayCityTemp").text(tempFar.toFixed(2) + " \u00B0F");
            $("#displayCityHumidity").text(response.main.humidity + "%");
            $("#displayCityWind").text(response.wind.speed + "MPH");

            var lat = response.coord.lat
            var lon = response.coord.lon
            queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon; 
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response){
//apply class for UV index 
            var uvIndex = response.value;
            $("#displayCityUVindex").removeClass("favorable");
            $("#displayCityUVindex").removeClass("moderate");
            $("#displayCityUVindex").removeClass("severe");
                if (uvIndex <= 2.9){
                    $("#displayCityUVindex").addClass("favorable");
                } else if (uvIndex >= 3 && uvIndex <= 7.9){
                    $("#displayCityUVindex").addClass("moderate");
                } else {
                    $("#displayCityUVindex").addClass("severe");
                };

                    $("#displayCityUVindex").text(response.value);
                });   

                $("#displayCityUVindex").show();   
        }); 
    };

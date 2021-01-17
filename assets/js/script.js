//API key for later use =  d6563c1f7289474849eef3ceaf635e1d

$(document).ready(function(){
    var cities = [];
    $("#displayCity").hide();
    $("#extended5").hide();

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
            var tempFarenheit = (response.main.temp - 273.15) * 1.80 + 32;
                
            $("#displayCityName").text(response.name);
            $("#displayCityName").append(date);
            $("#displayCityName").append(icon);
            $("#displayCityTemp").text(tempFarenheit.toFixed(2) + " \u00B0F");
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
                    $("#displayCityUVindex").addClass("severe");};
                    $("#displayCityUVindex").text(response.value);});   
                    $("#displayCity").show();}); 
                };

// begin api call for 5 day forecast
function fiveDayForecast(city){
    var apiKey = "d6563c1f7289474849eef3ceaf635e1d"
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        var counter = 1
        for(var i=0; i < response.list.length; i += 8){
            var date = moment(response.list[i].dt_txt).format("l");
            var weatherIcon = response.list[i].weather[0].icon;
            var temperatureF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                
            $("#date-" + counter).text(date);
            $("#icon" + counter).attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            $("#temp-" + counter).text(temperatureF.toFixed(2) + " \u00B0F");
            $("#humidity-" + counter).text(response.list[i].main.humidity + "%"); counter++;};
            $("#extended5").show();   
            });
            };

function searchedCities(city){
    var citiesListed = $("<li>").text(city)
    citiesListed.addClass("searchedCity");
    $("#searchedCity").append(citiesListed);};

//Clear input for new search
function getCities(){
    $("#searchedCity").empty();
    for (var i = 0; i < cities.length; i++) { 
        searchedCities(cities[i]);
    };};

function weather(city){
    displayCityForecast(city);
    fiveDayForecast(city);};
function init() {
// retrieve city list from local storage
    var storedCities = JSON.parse(localStorage.getItem("searches"));
    if (storedCities) {
        cities = storedCities;
        getCities();
        weather(cities[cities.length -1]);
    };};
init();

//Click event to save user input in local storage
$("#searchBtn").click(function(){
    var cityInputs = $(this).siblings("#inputCity").val().trim();
    $("#inputCity").val("");
    if (cityInputs !== ""){
        if (cities.indexOf(cityInputs)== -1){
            cities.push(cityInputs);
            localStorage.setItem("searches",JSON.stringify(cities));
            searchedCities(cityInputs);
        };
        weather(cityInputs);};
});
$("#searchedCity").on("click", ".searchedCity", function(){
    var cityOnButton = $(this).text();
    weather(cityOnButton);
});
});




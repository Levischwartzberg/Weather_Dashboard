var containerEl = $(".container");
var current = $(".current-weather");
var forecastArray = [];
var city = "";

const forecastUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
forecastUrl.searchParams.append("q", city);
forecastUrl.searchParams.append("appid", "938321dd3faa29575b4452961279be81");
var cityLat = "";
var cityLon = "";

containerEl.on("click", "#search", getCity);

function getCity(event) {
    event.preventDefault();
    city = ( $(this).parent().children().eq(0) ).val(); 
    callAPI();
}

function displayData(data) {
    console.log(data);
    current.text(KtoF(data.temp));
}

function callAPI() {
    var forecastArray = [];

    const forecastUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
    forecastUrl.searchParams.append("q", city);
    forecastUrl.searchParams.append("appid", "938321dd3faa29575b4452961279be81");
    var cityLat = "";
    var cityLon = "";

    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            //console.log(data.list);
            for (i=0; i<data.list.length; i++) {
                var maxTemp = data.list[i].main.temp_max;
                var dateTime = data.list[i].dt_txt;
                var pair = [dateTime, maxTemp];
                forecastArray.push(pair);
                cityLat = data.city.coord.lat;
                cityLon = data.city.coord.lon;
            }
            //console.log(forecastArray);

            const currentUrl = new URL("https://api.openweathermap.org/data/2.5/onecall");
            //?lat={lat}&lon={lon}&exclude={part}&appid={API key}"
            currentUrl.searchParams.append("lat", cityLat);
            currentUrl.searchParams.append("lon", cityLon);
            currentUrl.searchParams.append("exclude", "minutely,hourly,alerts");
            currentUrl.searchParams.append("appid", "938321dd3faa29575b4452961279be81");


            fetch(currentUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log(data.current);
                var currentData = {
                    temp: data.current.temp,
                    humidity: data.current.humidity,
                    windSpeed: data.current.wind_speed,
                    uvi: data.current.uvi,
                    icon: data.current.weather[0].icon
                };
                displayData(currentData);
            });

        });
}

function KtoF(num) {
    return ( (num - 273) * 9/5 + 32 ).toFixed(1);
}

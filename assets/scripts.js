var containerEl = $(".container");
var current = $(".current-weather");
var forecast = $(".five-day-forecast");
var forecastArray = [];
var city = "";
var date = moment().format('MMMM Do YYYY');

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

function displayCurrentData(data) {
    console.log(data);
    current.html(`
        <div class="currentCard"> 
            <h2> 
                ${city} &nbsp; (${date}) &nbsp; <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
            </h2>
            <p> Temperature: ${KtoF(data.temp)}&#176;F </p>
            <p> Humidity: ${data.humidity}% </p>
            <p> Wind Speed: ${data.windSpeed} MPH </p>
            <p> UV Index: ${data.uvi} </p>
        </div>`
    );
}

function displayForecastData(data) {
    console.log(data);
    for (i = 0; i < data.length; i++) {
        let day = moment().add(i+1,"days").format('MMMM Do YYYY');
        forecast.children().children().eq(i).html(`
            <div class="forecastCard"> 
                <h4> 
                    ${day}
                </h4>
                <img src="http://openweathermap.org/img/wn/${data[i].icon}@2x.png">
                <p> High: ${KtoF(data[i].highTemp)}&#176;F </p>
                <p> Low: ${KtoF(data[i].lowTemp)}&#176;F </p>
                <p> Humidity: ${data[i].humidity}% </p>
            </div>   
        `)
    }
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
                var forecastData = [];
                for (i = 1; i < 6; i++) {
                    forecastData.push(
                        {
                            highTemp: data.daily[i].temp.max,
                            lowTemp: data.daily[i].temp.min,
                            humidity: data.daily[i].humidity,
                            icon: data.daily[i].weather[0].icon
                        }
                    );
                }
                displayCurrentData(currentData);
                displayForecastData(forecastData);
            });

        });
}

function KtoF(num) {
    return ( (num - 273) * 9/5 + 32 ).toFixed(1);
}

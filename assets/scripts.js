var containerEl = $(".container-fluid");
var current = $(".current-weather");
var forecast = $(".five-day-forecast");
var city = "";
var date = moment().format('MMMM Do YYYY');
var savedCities = $(".saved-cities");
var cities = JSON.parse( localStorage.getItem("cities") ) || [];

const forecastUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
forecastUrl.searchParams.append("q", city);
forecastUrl.searchParams.append("appid", "938321dd3faa29575b4452961279be81");
var cityLat = "";
var cityLon = "";

containerEl.on("click", "#search", getCitySearch);
containerEl.on("click", ".city-button", getCityButton)
populateSaved();

//This function loads pre saved cities as buttons
function populateSaved() {
    for (i=0; i<cities.length; i++) {
        let cityBtn = $("<div>");
        savedCities.append(cityBtn);
        cityBtn.html(`
            <button class="city-button" id="${cities[i]}"> ${cities[i]} &nbsp; &nbsp; <span id="${i}" class="delete-item-btn"> x </span> </button>
        `)    
    }
}

//This function displays city data when a new city is searched
function getCitySearch(event) {
    event.preventDefault();
    city = ( $(this).parent().children().eq(0) ).val(); 
    city = capitalizeCity(city);
    callAPI();
}

//This function displays city data when the saved cities button is clicked
function getCityButton(event) {
    event.preventDefault();
    city = $(this).attr("id"); 
    console.log(city);
    city = capitalizeCity(city);
    callAPI();
}

//This function displays the current weather
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
            <p> <span class="${uviWarning(data.uvi)}"> UV Index: ${data.uvi} </span> </p>
        </div>`
    );
}

//This function displays the five day forecast data
function displayForecastData(data) {
    console.log(data);
    for (i = 0; i < data.length; i++) {
        let day = moment().add(i+1,"days").format('MMMM Do YYYY');
        forecast.children().children().eq(i).html(`
            <div class="forecastCard"> 
                <h5> 
                    ${day}
                </h5>
                <img src="http://openweathermap.org/img/wn/${data[i].icon}@2x.png">
                <p> High: ${KtoF(data[i].highTemp)}&#176;F </p>
                <p> Low: ${KtoF(data[i].lowTemp)}&#176;F </p>
                <p> Humidity: ${data[i].humidity}% </p>
            </div>   
        `)
    }
}

//This function calls a weather api based on city name and then looks in the more useful weather api based on coordinates from the first api
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
                cityLat = data.city.coord.lat;
                cityLon = data.city.coord.lon;
            }

            const currentUrl = new URL("https://api.openweathermap.org/data/2.5/onecall");
            
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
                addCityButton(city);
            });

        });
}

//This function adds a button with the city name if the city name is not already in the saved cities list
function addCityButton(city) {
    if ( cities.includes(city) ) {
        return;
    }
    else {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        let cityBtn = $("<div>");
        index = cities.length - 1;
        savedCities.append(cityBtn);
        cityBtn.html(`
            <button class="city-button" id="${city}"> ${city} &nbsp; &nbsp; <span id="${index}" class="delete-item-btn"> x </span> </button>
        `)
    }
}

function capitalizeCity(city) {
    return city.charAt(0).toUpperCase() + city.slice(1);
  }

function KtoF(num) {
    return ( (num - 273) * 9/5 + 32 ).toFixed(1);
}

//returns a class name based on uvi ranges
function uviWarning(uvi) {
    if (uvi <= 2) {
        return "low";
    }
    else if (uvi <= 5) {
        return "moderate";
    }
    else if (uvi <= 7) {
        return "high";
    }
    else {
        return "very-high";
    }
}

//removes parent element of a close icon button
function removeButton(event) {
    // convert button we pressed (`event.target`) to a jQuery DOM object
    var btnClicked = $(event.target);
    index = btnClicked.attr("id");
    cities.splice(index, 1);
    localStorage.setItem("cities", JSON.stringify(cities));
  
    // get the parent `<li>` element from the button we pressed and remove it
    btnClicked.parent('button').remove();

  }

  savedCities.on('click', '.delete-item-btn', removeButton);


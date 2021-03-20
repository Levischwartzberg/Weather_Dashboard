var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=Minneapolis&appid=938321dd3faa29575b4452961279be81';
var forecastArray = [];

fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data.list);
    for (i=0; i<data.list.length; i++) {
        var maxTemp = data.list[i].main.temp_max;
        var dateTime = data.list[i].dt_txt;
        var pair = [dateTime, maxTemp];
        forecastArray.push(pair);
    }
    console.log(forecastArray);
  });


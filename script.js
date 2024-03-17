const kelvinConstant = 273.15;
function getWeather() {
  const apiKey = "YOUR-API-KEY";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Please Try Again.");
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please Try Again.");
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const clothingSuggestionDiv = document.getElementById("clothing-suggestion");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  //Clear previous content
  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  //Check for error

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    //const feelsLike = Math.round(data.main.feelsLike - kelvinConstant);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const suggestClothingHTML = suggestClothing(temperature);

    const temperatureHTML = `<p> ${temperature}°C </p>`;
    const weatherHTML = `<p> ${cityName} </p>
    <p> ${description}</p>`;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;

    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    clothingSuggestionDiv.innerHTML = suggestClothingHTML;

    showImage();
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  const next24hours = hourlyData.slice(0, 8); //Display the next 24 hours (3 hr intervals)

  next24hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHTML = `<div class = "hourly-item"
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon"
        <span>${temperature}°C</span>
        </div>`;

    hourlyForecastDiv.innerHTML += hourlyItemHTML;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}

function suggestClothing(temp) {
  const tempForCoat = 15;
  const tempForGloves = 8;

  let suggestClothingHTML = "";

  if (temp < tempForCoat) {
    suggestClothingHTML += `<div class="suggested-clothing-item"> 
        <img id="coat-icon" src="./coat-icon.png" alt="Coat Suggested"/>
        <p> Wear a coat.</p>
        </div>`;
  }
  if (temp < tempForGloves) {
    suggestClothingHTML += `<div class="suggested-clothing-item"> 
        <img id="coat-icon" src="./gloves-icon.png" alt="glove Suggested"/>
        <p> Wear Gloves.</p>
        </div>`;
  }

  return suggestClothingHTML;
}

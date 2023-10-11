document.addEventListener('DOMContentLoaded', function() {
  // Define the API key for accessing weather data
  var apiKey = '411dc10fa165e89e7b76ad0131e1d7f4';

  // Get references to HTML elements
  var searchForm = document.getElementById('search-form');
  var cityInput = document.getElementById('city-input');
  var cityInfo = document.getElementById('city-info');
  var forecastContainer = document.getElementById('forecast-container');

  // Retrieve the previously stored city name from localStorage
  var storedCity = localStorage.getItem('storedCity');

  // If a city name is found in localStorage, populate the input field with it
  if (storedCity) {
    cityInput.value = storedCity;
  }

  // Add an event listener to the form submission
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the city name entered by the user
    var cityName = cityInput.value.trim();

    // If the city name is empty, do nothing
    if (cityName === '') return;

    try {
      // Store the entered city name in localStorage
      localStorage.setItem('storedCity', cityName);

      // Fetch current weather data for the entered city
      var cityWeatherResponse = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
      cityWeatherResponse
        .then(function(response) {
          return response.json();
        })
        .then(function(cityWeatherData) {
          // Display the current weather data for the city
          displayCityWeather(cityWeatherData);

          // Extract latitude and longitude for fetching the 5-day forecast
          var latitude = cityWeatherData.coord.lat;
          var longitude = cityWeatherData.coord.lon;

          // Fetch the 5-day weather forecast data
          var forecastResponse = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
          forecastResponse
            .then(function(response) {
              return response.json();
            })
            .then(function(forecastData) {
              // Display the 5-day weather forecast for the city
              displayForecast(forecastData);
            })
            .catch(function(error) {
              console.error('Error:', error);
            });
        })
        .catch(function(error) {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  });



  // Function to display the current weather data for the city
  function displayCityWeather(data) {
    var cityName = data.name;
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    var cityWeatherHTML = `
      <p>City: ${cityName}</p>
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    // Update the city info section with the weather data
    cityInfo.innerHTML = cityWeatherHTML;
  }

  // Function to display the 5-day weather forecast for the city
  function displayForecast(data) {
    forecastContainer.innerHTML = '';

    // Loop through the forecast data and create forecast cards
    for (var i = 0; i < data.list.length; i++) {
      var forecast = data.list[i];
      var forecastTime = new Date(forecast.dt * 1000);
      var temperature = forecast.main.temp;
      var windSpeed = forecast.wind.speed;
      var humidity = forecast.main.humidity;

      // Create a div for each forecast card
      var forecastCard = document.createElement('div');
      forecastCard.className = 'weather-card';

      // Generate HTML for the forecast card
      var forecastCardHTML = `
        <p>Date: ${forecastTime.toLocaleDateString()}</p>
        <p>Time: ${forecastTime.toLocaleTimeString()}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
      `;

      // Populate the forecast card with HTML content
      forecastCard.innerHTML = forecastCardHTML;

      // Append the forecast card to the forecast container
      forecastContainer.appendChild(forecastCard);
    }
  }
});

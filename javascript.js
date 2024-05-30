// Function to format the date
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let amPM = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDay = days[date.getDay()];
  const formattedMonth = months[date.getMonth()];

  return `${formattedDay}, ${day} ${formattedMonth} ${year} ${hours}:${minutes} ${amPM}`;
}

// Function to get the current day of the week
function getCurrentDayOfWeek() {
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

// Function to fetch city weather information
function fetchCityWeather(city) {
  const apiKey = "097tobe889c8b3ef74487a6e720a70b1";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const weatherData = response.data;
      updateWeatherDetails(weatherData);

      const lat = weatherData.coordinates.latitude;
      const lon = weatherData.coordinates.longitude;
      fetchCityForecast(lat, lon, apiKey);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("No location found. Please try again. 🐾");
      resetWeatherDetails();
    });
}

// Function to fetch forecast data
function fetchCityForecast(lat, lon, apiKey) {
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${lat}&lon=${lon}&key=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const forecastData = response.data.daily;
      updateForecastDetails(forecastData);

      // Update min and max temperature for selected date (today)
      const todayForecast = forecastData[0];
      updateSelectedDateTemperatures(todayForecast);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
      resetForecastDetails();
    });
}

// Function to update weather details on the page
function updateWeatherDetails(data) {
  console.log(data);
  document.getElementById("current-city").textContent = data.city;
  document.getElementById("currentCountry").textContent = data.country;
  document.getElementById("wind-speed").textContent = `${Math.round(
    data.wind.speed
  )} Km/h`;
  document.getElementById("currentTemperature").textContent = Math.round(
    data.temperature.current
  );
  document.getElementById("humidity").textContent = `${Math.round(
    data.temperature.humidity
  )}%`;
  document.getElementById("feelLike-value").textContent = Math.round(
    data.temperature.feels_like
  );
  document.getElementById("currentSky").textContent =
    data.condition.description;

  // Update weather icon based on condition
  let weatherIcon = "";
  const description = data.condition.description.toLowerCase();
  if (description.includes("clear sky")) {
    weatherIcon = "Warm-clearSky.png";
  } else if (description.includes("cloud")) {
    weatherIcon = "cloudy-day.png";
  } else if (description.includes("shower rain")) {
    weatherIcon = "Shower rain.png";
  } else if (description.includes("rain")) {
    weatherIcon = "Rain.png";
  } else if (description.includes("thunderstorm")) {
    weatherIcon = "thunderstorm.png";
  } else if (description.includes("snow")) {
    weatherIcon = "Snow.png";
  } else if (description.includes("mist")) {
    weatherIcon = "Shower rain.png";
  } else if (description.includes("drizzle")) {
    weatherIcon = "Mist.png";
  } else {
    weatherIcon = "default.png";
  }

  document.getElementById("weather-icon").src = `src/image/${weatherIcon}`;

  // Reset thisweek-title
  document.querySelector(".thisweek-title").textContent = "NEXT 7 DAYS";
}

// Function to update forecast details on the page
function updateForecastDetails(data) {
  const forecastContainer = document.querySelector(".thisweek-section ul");
  forecastContainer.innerHTML = "";

  // Start from the second element (tomorrow)
  data.slice(1).forEach((day) => {
    const dayElement = document.createElement("li");

    const date = new Date(day.time * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const iconUrl = `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${day.condition.icon}.png`;

    dayElement.innerHTML = `
      <img src="${iconUrl}" />
      <span>${dayName}</span>
      <span class="day_temp">${Math.round(day.temperature.minimum)}°C</span>
      <span class="day_temp">${Math.round(day.temperature.maximum)}°C</span>
    `;

    forecastContainer.appendChild(dayElement);
  });
}

// Function to update selected date temperatures
function updateSelectedDateTemperatures(data) {
  document.getElementById("selectedDate-minTemp").textContent = `${Math.round(
    data.temperature.minimum
  )}°C`;
  document.getElementById("selectedDate-maxTemp").textContent = `${Math.round(
    data.temperature.maximum
  )}°C`;
}

// Function to reset weather details to default
function resetWeatherDetails() {
  document.getElementById("current-city").textContent = "Unknown";
  document.getElementById("currentCountry").textContent = "Unknown";
  document.getElementById("wind-speed").textContent = "0 Km/h";
  document.getElementById("currentTemperature").textContent = "0";
  document.getElementById("humidity").textContent = "0%";
  document.getElementById("feelLike-value").textContent = "0";
  document.getElementById("currentSky").textContent = "Unknown";

  document.getElementById("weather-icon").src = "src/image/404 Not Found.png";

  resetForecastDetails();
}

// Function to reset forecast details to default
function resetForecastDetails() {
  const forecastContainer = document.querySelector(".thisweek-section ul");
  forecastContainer.innerHTML = "";

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();

  for (let i = 0; i < 7; i++) {
    const dayIndex = (today + i + 1) % 7;
    const dayName = daysOfWeek[dayIndex];
    const dayElement = document.createElement("li");

    dayElement.innerHTML = `
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/clear-sky-day.png" />
      <span>${dayName}</span>
      <span class="day_temp">0°C</span>
      <span class="day_temp">0°C</span>
    `;

    forecastContainer.appendChild(dayElement);
  }

  document.querySelector(".thisweek-title").textContent = "Unknown";
}

// Function to initialize forecast details on first load
function initializeForecastDetails() {
  const forecastContainer = document.querySelector(".thisweek-section ul");
  forecastContainer.innerHTML = "";

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();

  for (let i = 0; i < 7; i++) {
    const dayIndex = (today + i + 1) % 7;
    const dayName = daysOfWeek[dayIndex];
    const dayElement = document.createElement("li");

    dayElement.innerHTML = `
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/clear-sky-day.png" />
      <span>${dayName}</span>
      <span class="day_temp">0°C</span>
      <span class="day_temp">0°C</span>
    `;

    forecastContainer.appendChild(dayElement);
  }

  document.querySelector(".thisweek-title").textContent = "NEXT 7 DAYS";
}

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  document.querySelector(".current-date").textContent = formattedDate;

  const currentDayOfWeek = getCurrentDayOfWeek();
  document.querySelector(".season-title").textContent = currentDayOfWeek;

  initializeForecastDetails();

  document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const userInput = document.getElementById("search-input").value;
    fetchCityWeather(userInput);
  });
});

// Function to update weather information for the selected day
function updateSelectedDayInfo(dayInfo) {
  // Extract relevant information from the dayInfo object
  const { dayName, minTemp, maxTemp } = dayInfo;

  // Update DOM elements with the extracted information
  document.getElementById("season-title").textContent = dayName;
  document.getElementById("selectedDate-minTemp").textContent = `${minTemp}°`;
  document.getElementById("selectedDate-maxTemp").textContent = `${maxTemp}°`;
}

// Function to initialize event listeners for forecast days
function initializeForecastDayListeners() {
  // Get all forecast day elements
  const forecastDays = document.querySelectorAll(".thisweek-section ul li");

  // Add click event listener to each forecast day
  forecastDays.forEach((day, index) => {
    // Extract relevant information for the day
    const dayName = "Day " + (index + 1); // Example day name
    const minTemp = 10; // Example minimum temperature
    const maxTemp = 20; // Example maximum temperature

    // Add click event listener
    day.addEventListener("click", () => {
      // Call the function to update weather information for the selected day
      updateSelectedDayInfo({ dayName, minTemp, maxTemp });
    });
  });
}

// Initialize event listeners for forecast days when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeForecastDayListeners();
});

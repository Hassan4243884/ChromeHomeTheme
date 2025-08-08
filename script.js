// Weather API configuration
const WEATHER_API_KEY = "0abcdbbeec758cca779fbd57ceb24bb0"; // You'll need to get this from openweathermap.org
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Background images from Unsplash (nature themes)
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
];

// DOM elements
const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const nameGreetingElement = document.getElementById("nameGreeting");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const changeBgBtn = document.getElementById("changeBgBtn");
const backgroundImage = document.getElementById("backgroundImage");
// New weather block refs
const weatherAnchor = document.getElementById("weather");
const currentDescEl = document.getElementById("current-desc");
const currentTempEl = document.getElementById("current-temp");
const forecastEl = document.getElementById("forecast");
const tempNowEl = document.getElementById("temp-now");
const weatherIconSpan = document.getElementById("weather-icon");
const greetingMessage = document.getElementById("greetingMessage");
const greetingSubtitle = document.getElementById("greetingSubtitle");
const blurBtn = document.getElementById("blurBtn");
const changeBgBtnCorner = document.getElementById("changeBgBtnCorner");
const blurSlider = document.getElementById("blurSlider");
const blurValue = document.getElementById("blurValue");

// Current background index
let currentBgIndex = 0;

// Initialize the extension
function init() {
  updateTime();
  updateGreeting();
  loadBackground();
  setupEventListeners();

  // Update time every second
  setInterval(updateTime, 1000);

  // Update greeting every minute
  setInterval(updateGreeting, 60000);

  // Load weather if API key is available
  if (WEATHER_API_KEY !== "YOUR_OPENWEATHER_API_KEY") {
    loadWeather();
  }
}

// Update time and date
function updateTime() {
  const now = new Date();

  // Format time (24-hour format with seconds, no AM/PM)
  const timeString = now
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/^24:/, "00:");

  // Format date
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  timeElement.textContent = timeString;
  dateElement.textContent = dateString;
}

// Update greeting based on time
function updateGreeting() {
  const hour = new Date().getHours();
  let message = "";
  let subtitle = "";

  if (hour >= 5 && hour < 12) {
    message = "Have a wonderful day ahead!";
    subtitle = "Make today amazing";
  } else if (hour >= 12 && hour < 17) {
    message = "Hope your day is going great!";
    subtitle = "Keep up the good work";
  } else if (hour >= 17 && hour < 21) {
    message = "Time to unwind and relax";
    subtitle = "Enjoy your evening";
  } else {
    message = "Time to rest and recharge";
    subtitle = "Sweet dreams";
  }

  greetingMessage.textContent = message;
  greetingSubtitle.textContent = subtitle;
}

// Load and set background image
function loadBackground() {
  const savedIndex = localStorage.getItem("backgroundIndex");
  if (savedIndex !== null) {
    currentBgIndex = parseInt(savedIndex);
  }

  setBackgroundImage(currentBgIndex);
}

// Set background image
function setBackgroundImage(index) {
  const imageUrl = BACKGROUND_IMAGES[index];
  backgroundImage.style.backgroundImage = `url(${imageUrl})`;
}

// Change background image
function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % BACKGROUND_IMAGES.length;
  setBackgroundImage(currentBgIndex);
  localStorage.setItem("backgroundIndex", currentBgIndex.toString());
}

// Load weather data
async function loadWeather() {
  try {
    // Fetch weather data for Muzaffarabad
    const response = await fetch(
      `${WEATHER_API_URL}?q=Muzaffarabad&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const weatherData = await response.json();
    updateWeatherUI(weatherData);
  } catch (error) {
    console.error("Error loading weather:", error);
    if (weatherAnchor) {
      weatherAnchor.style.display = "none";
    }
  }
}

// Update weather UI
function updateWeatherUI(weatherData) {
  const temp = Math.round(weatherData.main.temp);
  const description = weatherData.weather[0].description;
  const city = weatherData.name;
  const country = weatherData.sys.country;
  const weatherCode = weatherData.weather[0].id;

  if (currentDescEl) currentDescEl.textContent = `${capitalize(description)}. `;
  if (currentTempEl) currentTempEl.textContent = `It is currently ${temp}°`;
  if (forecastEl && weatherData.main.temp_max !== undefined) {
    forecastEl.textContent = `with a high of ${Math.round(
      weatherData.main.temp_max
    )}° today. `;
  }
  if (tempNowEl) tempNowEl.textContent = `${temp}°`;

  // Icon state
  const isDay = isDaytime(weatherData);
  if (weatherIconSpan) {
    weatherIconSpan.setAttribute("data-daytime", isDay ? "day" : "night");
    weatherIconSpan.setAttribute("data-condition", mapCondition(weatherCode));
  }
  if (weatherAnchor) weatherAnchor.title = `${city}, ${country}`;
}

function isDaytime(weatherData) {
  const now = Math.floor(Date.now() / 1000);
  return now > weatherData.sys.sunrise && now < weatherData.sys.sunset;
}

function mapCondition(code) {
  if (code >= 200 && code < 300) return "thunder";
  if (code >= 300 && code < 400) return "drizzle";
  if (code >= 500 && code < 600) return "rain";
  if (code >= 600 && code < 700) return "snow";
  if (code >= 700 && code < 800) return "mist";
  if (code === 800) return "clear";
  if (code >= 801 && code < 900) return "fewclouds";
  return "clouds";
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Get weather icon class based on weather code
function getWeatherIcon(code) {
  if (code >= 200 && code < 300) return "fa-bolt";
  if (code >= 300 && code < 400) return "fa-cloud-rain";
  if (code >= 500 && code < 600) return "fa-cloud-showers-heavy";
  if (code >= 600 && code < 700) return "fa-snowflake";
  if (code >= 700 && code < 800) return "fa-smog";
  if (code === 800) return "fa-sun";
  if (code >= 801 && code < 900) return "fa-cloud";
  return "fa-cloud";
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Corner buttons
  changeBgBtnCorner.addEventListener("click", changeBackground);

  // Blur slider functionality
  blurSlider.addEventListener("input", updateBlur);

  // Load saved blur value
  loadBlurSetting();

  // Focus search input on page load
  window.addEventListener("load", () => {
    searchInput.focus();
  });
}

// Perform Google search
function performSearch() {
  const query = searchInput.value.trim();
  if (query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    window.open(searchUrl, "_blank");
    searchInput.value = "";
  }
}

// Update background blur
function updateBlur() {
  const blurValue = blurSlider.value;
  backgroundImage.style.transition = "filter 0.3s ease";
  backgroundImage.style.filter = `blur(${blurValue}px)`;
  document.getElementById("blurValue").textContent = `${blurValue}px`;
  localStorage.setItem("backgroundBlur", blurValue);
}

// Load saved blur setting
function loadBlurSetting() {
  const savedBlur = localStorage.getItem("backgroundBlur");
  if (savedBlur !== null) {
    blurSlider.value = savedBlur;
    updateBlur();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Add some additional nature backgrounds from Pexels
const PEXELS_IMAGES = [
  "https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2387876/pexels-photo-2387876.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2387879/pexels-photo-2387879.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
];

// Combine both image sources
const ALL_BACKGROUND_IMAGES = [...BACKGROUND_IMAGES, ...PEXELS_IMAGES];

// Update the background images array
BACKGROUND_IMAGES.length = 0;
BACKGROUND_IMAGES.push(...ALL_BACKGROUND_IMAGES);

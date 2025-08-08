// Weather API configuration
const WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"; // You'll need to get this from openweathermap.org
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
const greetingElement = document.getElementById("greeting");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const changeBgBtn = document.getElementById("changeBgBtn");
const backgroundImage = document.getElementById("backgroundImage");
const weatherSection = document.getElementById("weatherSection");
const temperatureElement = document.getElementById("temperature");
const weatherDescriptionElement = document.getElementById("weatherDescription");
const locationElement = document.getElementById("location");
const weatherIconElement = document.getElementById("weatherIcon");

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

  // Format time (12-hour format)
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

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
  let greeting = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  greetingElement.textContent = greeting;
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
    // Get user's location
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    // Fetch weather data
    const response = await fetch(
      `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const weatherData = await response.json();
    updateWeatherUI(weatherData);
  } catch (error) {
    console.error("Error loading weather:", error);
    weatherSection.style.display = "none";
  }
}

// Get current position
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000,
    });
  });
}

// Update weather UI
function updateWeatherUI(weatherData) {
  const temp = Math.round(weatherData.main.temp);
  const description = weatherData.weather[0].description;
  const city = weatherData.name;
  const country = weatherData.sys.country;
  const weatherCode = weatherData.weather[0].id;

  temperatureElement.textContent = `${temp}°C`;
  weatherDescriptionElement.textContent = description;
  locationElement.textContent = `${city}, ${country}`;

  // Set weather icon based on weather code
  const iconClass = getWeatherIcon(weatherCode);
  weatherIconElement.innerHTML = `<i class="fas ${iconClass}"></i>`;
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

  // Background change
  changeBgBtn.addEventListener("click", changeBackground);

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

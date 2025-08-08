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

// ==========================
// Bookmark Manager (scoped)
// ==========================
(function setupBookmarkManager() {
  const sidebar = document.getElementById("bookmarkSidebar");
  if (!sidebar) return; // Do nothing on pages without sidebar

  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const addBookmarkBtn = document.getElementById("addBookmarkBtn");
  const categorySelect = document.getElementById("bmCategorySelect");
  const grid = document.getElementById("bmGrid");

  const LS_CATEGORIES_KEY = "bm_categories_v1";
  const LS_BOOKMARKS_KEY = "bm_bookmarks_v1"; // object: { [category]: Bookmark[] }
  const LS_SELECTED_CATEGORY_KEY = "bm_selected_category_v1";

  /** @typedef {{ id: string; title: string; url: string; iconUrl?: string }} Bookmark */

  function loadCategories() {
    try {
      const raw = localStorage.getItem(LS_CATEGORIES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return ["General"];
    } catch (e) {
      return ["General"];
    }
  }

  function saveCategories(categories) {
    localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(categories));
  }

  function loadBookmarksMap() {
    try {
      const raw = localStorage.getItem(LS_BOOKMARKS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveBookmarksMap(map) {
    localStorage.setItem(LS_BOOKMARKS_KEY, JSON.stringify(map));
  }

  function getSelectedCategory() {
    return localStorage.getItem(LS_SELECTED_CATEGORY_KEY);
  }

  function setSelectedCategory(cat) {
    localStorage.setItem(LS_SELECTED_CATEGORY_KEY, cat);
  }

  function ensureCategoryExists(map, category) {
    if (!map[category]) map[category] = [];
  }

  function renderCategories() {
    const categories = loadCategories();
    const selected = getSelectedCategory() || categories[0];
    categorySelect.innerHTML = "";
    for (const cat of categories) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      if (cat === selected) opt.selected = true;
      categorySelect.appendChild(opt);
    }
    setSelectedCategory(selected);
  }

  function faviconFor(url) {
    try {
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(
        u.origin
      )}`;
    } catch (e) {
      return "";
    }
  }

  function createBookmarkElement(bookmark, index) {
    const item = document.createElement("div");
    item.className = "bm-item";
    item.setAttribute("draggable", "true");
    item.dataset.index = String(index);
    item.title = bookmark.url;

    const iconWrap = document.createElement("span");
    iconWrap.className = "bm-favicon";
    const img = document.createElement("img");
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.src = bookmark.iconUrl || faviconFor(bookmark.url);
    iconWrap.appendChild(img);

    const label = document.createElement("span");
    label.className = "bm-label";
    label.textContent = bookmark.title || bookmark.url;

    const dragHandle = document.createElement("span");
    dragHandle.className = "bm-drag-handle";
    dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';

    item.appendChild(iconWrap);
    item.appendChild(label);
    item.appendChild(dragHandle);

    // Open on click (ignore drag)
    item.addEventListener("click", (e) => {
      if (e.defaultPrevented) return;
      window.open(bookmark.url, "_blank");
    });

    // Drag & drop handlers
    item.addEventListener("dragstart", (e) => {
      item.classList.add("dragging");
      e.dataTransfer.setData("text/plain", String(index));
      e.dataTransfer.effectAllowed = "move";
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      grid
        .querySelectorAll(".drop-target")
        .forEach((el) => el.classList.remove("drop-target"));
    });
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      item.classList.add("drop-target");
    });
    item.addEventListener("dragleave", () =>
      item.classList.remove("drop-target")
    );
    item.addEventListener("drop", (e) => {
      e.preventDefault();
      item.classList.remove("drop-target");
      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      const toIndex = Number(item.dataset.index || "0");
      if (
        Number.isNaN(fromIndex) ||
        Number.isNaN(toIndex) ||
        fromIndex === toIndex
      )
        return;
      reorderBookmarks(fromIndex, toIndex);
    });

    return item;
  }

  function renderBookmarks() {
    const category = getSelectedCategory() || loadCategories()[0];
    const map = loadBookmarksMap();
    ensureCategoryExists(map, category);
    const list = map[category];
    grid.innerHTML = "";
    list.forEach((bm, idx) => grid.appendChild(createBookmarkElement(bm, idx)));
  }

  function reorderBookmarks(fromIndex, toIndex) {
    const category = getSelectedCategory() || loadCategories()[0];
    const map = loadBookmarksMap();
    ensureCategoryExists(map, category);
    const list = map[category];
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    saveBookmarksMap(map);
    renderBookmarks();
  }

  function addCategory() {
    const categories = loadCategories();
    const name = (prompt("New category name:") || "").trim();
    if (!name) return;
    if (categories.includes(name)) {
      alert("Category already exists.");
      return;
    }
    categories.push(name);
    saveCategories(categories);
    const map = loadBookmarksMap();
    ensureCategoryExists(map, name);
    saveBookmarksMap(map);
    setSelectedCategory(name);
    renderCategories();
    renderBookmarks();
  }

  function normalizeTitle(url, provided) {
    if (provided && provided.trim()) return provided.trim();
    try {
      const u = new URL(url);
      return u.hostname.replace("www.", "");
    } catch (e) {
      return url;
    }
  }

  function addBookmark() {
    const url = (prompt("Bookmark URL:") || "").trim();
    if (!url) return;
    const title = (prompt("Display name (optional):") || "").trim();
    const bm = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      title: normalizeTitle(url, title),
      url,
      iconUrl: faviconFor(url),
    };
    const category = getSelectedCategory() || loadCategories()[0];
    const map = loadBookmarksMap();
    ensureCategoryExists(map, category);
    map[category].push(bm);
    saveBookmarksMap(map);
    renderBookmarks();
  }

  // Init
  function initBookmarksUI() {
    renderCategories();
    renderBookmarks();

    categorySelect.addEventListener("change", () => {
      setSelectedCategory(categorySelect.value);
      renderBookmarks();
    });

    addCategoryBtn.addEventListener("click", addCategory);
    addBookmarkBtn.addEventListener("click", addBookmark);
  }

  // Defer to next tick to avoid blocking other initializers
  window.requestAnimationFrame(initBookmarksUI);
})();

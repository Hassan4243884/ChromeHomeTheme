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

// Weather location (shared with Prayer module)
let WEATHER_CITY = "Muzzafarabad";
let WEATHER_COUNTRY = "Pakistan";
let WEATHER_COORDS = null; // { lat, lon }

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
  const coords = weatherData.coord || null;

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

  // Share weather location globally for other modules (e.g., prayers)
  WEATHER_CITY = city || null;
  WEATHER_COUNTRY = country || null;
  WEATHER_COORDS =
    coords && typeof coords.lat === "number" && typeof coords.lon === "number"
      ? { lat: coords.lat, lon: coords.lon }
      : null;

  try {
    const evt = new CustomEvent("weatherLocationUpdated", {
      detail: {
        city: WEATHER_CITY,
        country: WEATHER_COUNTRY,
        coords: WEATHER_COORDS,
      },
    });
    window.dispatchEvent(evt);
  } catch (e) {
    // ignore
  }
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
  const hasChromeStorage =
    typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

  const LS_CATEGORIES_KEY = "bm_categories_v1";
  const LS_BOOKMARKS_KEY = "bm_bookmarks_v1"; // object: { [category]: Bookmark[] }
  const LS_SELECTED_CATEGORY_KEY = "bm_selected_category_v1";

  /** @typedef {{ id: string; title: string; url: string; iconUrl?: string }} Bookmark */

  async function storageGet(keys) {
    if (hasChromeStorage) {
      return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
    }
    const result = {};
    (Array.isArray(keys) ? keys : [keys]).forEach((k) => {
      result[k] = localStorage.getItem(k);
    });
    return result;
  }

  async function storageSet(obj) {
    if (hasChromeStorage) {
      return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
    }
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      if (typeof v === "string") {
        localStorage.setItem(k, v);
      } else {
        localStorage.setItem(k, JSON.stringify(v));
      }
    });
  }

  async function loadCategories() {
    try {
      const data = await storageGet([LS_CATEGORIES_KEY]);
      let raw = data[LS_CATEGORIES_KEY];
      if (!raw) {
        // raw may already be an array in chrome.storage
        const data2 = await storageGet(LS_CATEGORIES_KEY);
        raw = data2[LS_CATEGORIES_KEY];
      }
      const parsed = Array.isArray(raw) ? raw : raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return ["General"];
    } catch (e) {
      return ["General"];
    }
  }

  async function saveCategories(categories) {
    await storageSet({ [LS_CATEGORIES_KEY]: categories });
  }

  async function loadBookmarksMap() {
    try {
      const data = await storageGet([LS_BOOKMARKS_KEY]);
      let raw = data[LS_BOOKMARKS_KEY];
      if (!raw) {
        const data2 = await storageGet(LS_BOOKMARKS_KEY);
        raw = data2[LS_BOOKMARKS_KEY];
      }
      const parsed =
        raw && typeof raw === "object" ? raw : raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  async function saveBookmarksMap(map) {
    await storageSet({ [LS_BOOKMARKS_KEY]: map });
  }

  async function getSelectedCategory() {
    const data = await storageGet([LS_SELECTED_CATEGORY_KEY]);
    const v = data[LS_SELECTED_CATEGORY_KEY];
    if (typeof v === "string") return v;
    return v || null;
  }

  async function setSelectedCategory(cat) {
    await storageSet({ [LS_SELECTED_CATEGORY_KEY]: cat });
  }

  function ensureCategoryExists(map, category) {
    if (!map[category]) map[category] = [];
  }

  async function renderCategories() {
    const categories = await loadCategories();
    const storedSelected = await getSelectedCategory();
    const selected = storedSelected || categories[0];
    categorySelect.innerHTML = "";
    for (const cat of categories) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      if (cat === selected) opt.selected = true;
      categorySelect.appendChild(opt);
    }
    await setSelectedCategory(selected);
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

    const actions = document.createElement("span");
    actions.className = "bm-actions-inline";
    const editBtn = document.createElement("button");
    editBtn.className = "bm-small-btn";
    editBtn.title = "Edit bookmark";
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';
    const delBtn = document.createElement("button");
    delBtn.className = "bm-small-btn";
    delBtn.title = "Delete bookmark";
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';

    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      void editBookmark(index);
    });

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      void deleteBookmark(index);
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    const dragHandle = document.createElement("span");
    dragHandle.className = "bm-drag-handle";
    dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';

    item.appendChild(iconWrap);
    item.appendChild(label);
    item.appendChild(actions);
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

  async function renderBookmarks() {
    const categories = await loadCategories();
    const selected = (await getSelectedCategory()) || categories[0];
    const map = await loadBookmarksMap();
    ensureCategoryExists(map, selected);
    const list = map[selected];
    grid.innerHTML = "";
    list.forEach((bm, idx) => grid.appendChild(createBookmarkElement(bm, idx)));
  }

  async function reorderBookmarks(fromIndex, toIndex) {
    const categories = await loadCategories();
    const category = (await getSelectedCategory()) || categories[0];
    const map = await loadBookmarksMap();
    ensureCategoryExists(map, category);
    const list = map[category];
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    await saveBookmarksMap(map);
    await renderBookmarks();
  }

  async function addCategory() {
    const categories = await loadCategories();
    const name = (prompt("New category name:") || "").trim();
    if (!name) return;
    if (categories.includes(name)) {
      alert("Category already exists.");
      return;
    }
    categories.push(name);
    await saveCategories(categories);
    const map = await loadBookmarksMap();
    ensureCategoryExists(map, name);
    await saveBookmarksMap(map);
    await setSelectedCategory(name);
    await renderCategories();
    await renderBookmarks();
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

  async function addBookmark() {
    const url = (prompt("Bookmark URL:") || "").trim();
    if (!url) return;
    const title = (prompt("Display name (optional):") || "").trim();
    const bm = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      title: normalizeTitle(url, title),
      url,
      iconUrl: faviconFor(url),
    };
    const categories = await loadCategories();
    const category = (await getSelectedCategory()) || categories[0];
    const map = await loadBookmarksMap();
    ensureCategoryExists(map, category);
    map[category].push(bm);
    await saveBookmarksMap(map);
    await renderBookmarks();
  }

  async function editBookmark(index) {
    const categories = await loadCategories();
    const category = (await getSelectedCategory()) || categories[0];
    const map = await loadBookmarksMap();
    ensureCategoryExists(map, category);
    const list = map[category];
    const bm = list[index];
    if (!bm) return;
    const newTitle = (prompt("Edit name:", bm.title || "") || "").trim();
    const newUrl = (prompt("Edit URL:", bm.url || "") || "").trim();
    if (!newUrl) return;
    bm.title = newTitle || normalizeTitle(newUrl, newTitle);
    bm.url = newUrl;
    bm.iconUrl = faviconFor(newUrl);
    list[index] = bm;
    await saveBookmarksMap(map);
    await renderBookmarks();
  }

  async function deleteBookmark(index) {
    const categories = await loadCategories();
    const category = (await getSelectedCategory()) || categories[0];
    const map = await loadBookmarksMap();
    ensureCategoryExists(map, category);
    const list = map[category];
    const bm = list[index];
    if (!bm) return;
    const ok = confirm(`Delete bookmark "${bm.title || bm.url}"?`);
    if (!ok) return;
    list.splice(index, 1);
    await saveBookmarksMap(map);
    await renderBookmarks();
  }

  // Init
  async function migrateIfNeeded() {
    if (!hasChromeStorage) return;
    const current = await storageGet([
      LS_CATEGORIES_KEY,
      LS_BOOKMARKS_KEY,
      LS_SELECTED_CATEGORY_KEY,
    ]);
    const isEmpty = !current[LS_CATEGORIES_KEY] && !current[LS_BOOKMARKS_KEY];
    if (!isEmpty) return;
    try {
      const lsCategoriesRaw = localStorage.getItem(LS_CATEGORIES_KEY);
      const lsBookmarksRaw = localStorage.getItem(LS_BOOKMARKS_KEY);
      const lsSelected = localStorage.getItem(LS_SELECTED_CATEGORY_KEY);
      const categories = lsCategoriesRaw ? JSON.parse(lsCategoriesRaw) : null;
      const map = lsBookmarksRaw ? JSON.parse(lsBookmarksRaw) : null;
      const toSet = {};
      if (categories) toSet[LS_CATEGORIES_KEY] = categories;
      if (map) toSet[LS_BOOKMARKS_KEY] = map;
      if (lsSelected) toSet[LS_SELECTED_CATEGORY_KEY] = lsSelected;
      if (Object.keys(toSet).length > 0) await storageSet(toSet);
    } catch (e) {
      // ignore
    }
  }

  async function initBookmarksUI() {
    await migrateIfNeeded();
    await renderCategories();
    await renderBookmarks();

    categorySelect.addEventListener("change", async () => {
      await setSelectedCategory(categorySelect.value);
      await renderBookmarks();
    });

    addCategoryBtn.addEventListener("click", () => void addCategory());
    addBookmarkBtn.addEventListener("click", () => void addBookmark());

    // Add delete-category button next to the select (injected, no HTML edits required)
    const selectRow = categorySelect && categorySelect.parentElement;
    if (selectRow && !selectRow.querySelector("#deleteCategoryBtn")) {
      const delCatBtn = document.createElement("button");
      delCatBtn.id = "deleteCategoryBtn";
      delCatBtn.className = "bm-icon-btn-sm";
      delCatBtn.title = "Delete current category";
      delCatBtn.innerHTML = '<i class="fas fa-folder-minus"></i>';
      delCatBtn.addEventListener("click", () => void deleteCurrentCategory());
      selectRow.appendChild(delCatBtn);

      // Open all in new window button
      const openCatBtn = document.createElement("button");
      openCatBtn.id = "openCategoryBtn";
      openCatBtn.className = "bm-icon-btn-sm";
      openCatBtn.title = "Open all bookmarks in a new window";
      openCatBtn.style.marginLeft = "0.35rem";
      openCatBtn.innerHTML = '<i class="fas fa-window-restore"></i>';
      openCatBtn.addEventListener(
        "click",
        () => void openCurrentCategoryInNewWindow()
      );
      selectRow.appendChild(openCatBtn);
    }
  }

  async function deleteCurrentCategory() {
    const categories = await loadCategories();
    if (categories.length <= 1) {
      alert("You must have at least one category.");
      return;
    }
    const current = (await getSelectedCategory()) || categories[0];
    const ok = confirm(
      `Delete category "${current}" and all its bookmarks? This cannot be undone.`
    );
    if (!ok) return;
    // Remove category and its bookmarks
    const newCategories = categories.filter((c) => c !== current);
    await saveCategories(newCategories);
    const map = await loadBookmarksMap();
    if (map && typeof map === "object") {
      delete map[current];
      await saveBookmarksMap(map);
    }
    const newSelected = newCategories[0];
    await setSelectedCategory(newSelected);
    await renderCategories();
    await renderBookmarks();
  }

  async function openCurrentCategoryInNewWindow() {
    const categories = await loadCategories();
    const category = (await getSelectedCategory()) || categories[0];
    const map = await loadBookmarksMap();
    ensureCategoryExists(map, category);
    const list = map[category];
    const urls = list.map((b) => b.url).filter(Boolean);
    if (!urls.length) {
      alert("No bookmarks in this category.");
      return;
    }
    // Use extension APIs if available: create a new window with first tab, then add remaining URLs as tabs
    if (
      typeof chrome !== "undefined" &&
      chrome.windows &&
      chrome.windows.create &&
      chrome.tabs &&
      chrome.tabs.create
    ) {
      try {
        const createdWindow = await new Promise((resolve) =>
          chrome.windows.create(
            { url: urls[0], focused: true, state: "maximized" },
            resolve
          )
        );
        if (createdWindow && createdWindow.id && urls.length > 1) {
          for (let i = 1; i < urls.length; i++) {
            await new Promise((resolve) =>
              chrome.tabs.create(
                { windowId: createdWindow.id, url: urls[i], active: false },
                resolve
              )
            );
          }
        }
        return;
      } catch (e) {
        // Fallback below
      }
    }
    // Fallback (likely test.html): open tabs in current window
    const proceed = confirm(
      `Open ${urls.length} tab(s) in this window? Your browser may block pop-ups on non-extension pages.`
    );
    if (!proceed) return;
    urls.forEach((u) => window.open(u, "_blank"));
  }

  // Defer to next tick to avoid blocking other initializers
  window.requestAnimationFrame(() => {
    void initBookmarksUI();
  });
})();

// ==========================
// Prayer/Namaz Times
// ==========================
(function setupPrayerTimes() {
  const section = document.getElementById("prayerSection");
  if (!section) return;

  const listEl = document.getElementById("prayerList");
  const metaEl = document.getElementById("prayerMeta");
  const nextEl = document.getElementById("nextPrayer");
  const countdownEl = document.getElementById("prayerCountdown");

  const STORAGE_KEY_ALARMS = "prayer_alarm_prefs_v1";
  const hasChromeStorage =
    typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

  const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  function storageGet(key) {
    if (hasChromeStorage) {
      return new Promise((resolve) => chrome.storage.local.get(key, resolve));
    }
    const val = localStorage.getItem(key);
    return Promise.resolve({ [key]: val ? JSON.parse(val) : undefined });
  }

  function storageSet(obj) {
    if (hasChromeStorage) {
      return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
    }
    Object.keys(obj).forEach((k) =>
      localStorage.setItem(k, JSON.stringify(obj[k]))
    );
    return Promise.resolve();
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function parsePrayerTimeToDate(timeStr, tz) {
    // timeStr like "05:07"; tz is IANA or browser local
    const now = new Date();
    const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10));
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  }

  async function fetchPrayerTimesByCoords(lat, lng) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch prayer times");
    const json = await res.json();
    return json.data; // contains timings, date, meta
  }

  async function fetchPrayerTimesByCity(city, country) {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
      city
    )}&country=${encodeURIComponent(country || "Pakistan")}&method=2`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch prayer times by city");
    const json = await res.json();
    return json.data;
  }

  function renderList(timings, alarmPrefs) {
    listEl.innerHTML = "";
    for (const name of PRAYER_ORDER) {
      const timeStr = timings[name];
      if (!timeStr) continue;
      const liName = document.createElement("li");
      liName.className = "prayer-name";
      liName.textContent = name;

      const liTime = document.createElement("li");
      liTime.className = "prayer-time";
      liTime.textContent = timeStr;

      const liAlarm = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "prayer-alarm";
      const enabled = !!(alarmPrefs && alarmPrefs[name]);
      btn.innerHTML = enabled
        ? '<i class="fas fa-bell"></i>'
        : '<i class="far fa-bell"></i>';
      btn.title = enabled ? "Alarm on" : "Alarm off";
      btn.addEventListener("click", async () => {
        const next = { ...(alarmPrefs || {}) };
        next[name] = !enabled;
        await storageSet({ [STORAGE_KEY_ALARMS]: next });
        // Re-render
        renderList(timings, next);
      });
      liAlarm.appendChild(btn);

      listEl.appendChild(liName);
      listEl.appendChild(liTime);
      listEl.appendChild(liAlarm);
    }
  }

  function getNextPrayer(timings) {
    const now = new Date();
    for (const name of PRAYER_ORDER) {
      const t = parsePrayerTimeToDate(timings[name]);
      if (t > now) return { name, time: t };
    }
    // next day: fall back to the first prayer of tomorrow
    const first = parsePrayerTimeToDate(timings[PRAYER_ORDER[0]]);
    first.setDate(first.getDate() + 1);
    return { name: PRAYER_ORDER[0], time: first };
  }

  let alarmAudio;
  function getAudio() {
    if (!alarmAudio) {
      alarmAudio = new Audio(
        "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA..." // tiny silent placeholder, replaced when needed
      );
      alarmAudio.loop = false;
      alarmAudio.volume = 1.0;
    }
    return alarmAudio;
  }

  function playBeep() {
    // Lightweight beep using Web Audio API
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
    o.start();
    o.stop(ctx.currentTime + 1.05);
  }

  async function init() {
    try {
      // Prefer weather-provided city/coordinates if available
      let data;
      if (WEATHER_COORDS && typeof WEATHER_COORDS.lat === "number") {
        data = await fetchPrayerTimesByCoords(
          WEATHER_COORDS.lat,
          WEATHER_COORDS.lon
        );
      } else if (WEATHER_CITY) {
        data = await fetchPrayerTimesByCity(WEATHER_CITY, WEATHER_COUNTRY);
      } else {
        metaEl.textContent = "Detecting location…";
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 300000,
          })
        );
        const { latitude, longitude } = pos.coords;
        data = await fetchPrayerTimesByCoords(latitude, longitude);
      }
      const timings = data.timings;
      metaEl.textContent = data.date.readable;

      const prefsObj = await storageGet(STORAGE_KEY_ALARMS);
      const alarmPrefs = prefsObj[STORAGE_KEY_ALARMS] || {};
      renderList(timings, alarmPrefs);

      function updateCountdown() {
        const { name, time } = getNextPrayer(timings);
        nextEl.textContent = `Next: ${name} @ ${formatTime(time)}`;
        const now = new Date();
        const diff = time - now;
        const clamp = Math.max(0, diff);
        const hh = String(Math.floor(clamp / 3600000)).padStart(2, "0");
        const mm = String(Math.floor((clamp % 3600000) / 60000)).padStart(
          2,
          "0"
        );
        const ss = String(Math.floor((clamp % 60000) / 1000)).padStart(2, "0");
        countdownEl.textContent = `${hh}:${mm}:${ss}`;

        // Alarm when exactly hits (with 1s tolerance)
        if (diff <= 1000 && diff >= -1000) {
          const enabled = !!alarmPrefs[name];
          if (enabled) {
            try {
              playBeep();
              if (Notification && Notification.permission === "granted") {
                new Notification("Prayer time", {
                  body: `${name} time has started.`,
                });
              }
            } catch (e) {
              // ignore
            }
          }
        }
      }

      if (window.Notification && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    } catch (e) {
      metaEl.textContent = "Loading prayer times…";
      try {
        // Fallback: try weather city again, then Makkah
        let data;
        if (WEATHER_CITY) {
          data = await fetchPrayerTimesByCity(WEATHER_CITY, WEATHER_COUNTRY);
        } else if (WEATHER_COORDS) {
          data = await fetchPrayerTimesByCoords(
            WEATHER_COORDS.lat,
            WEATHER_COORDS.lon
          );
        } else {
          data = await fetchPrayerTimesByCoords(21.3891, 39.8579);
        }
        const timings = data.timings;
        const prefsObj = await storageGet(STORAGE_KEY_ALARMS);
        const alarmPrefs = prefsObj[STORAGE_KEY_ALARMS] || {};
        renderList(timings, alarmPrefs);
        function updateCountdownFallback() {
          const { name, time } = getNextPrayer(timings);
          nextEl.textContent = `Next: ${name} @ ${formatTime(time)}`;
          const now = new Date();
          const diff = time - now;
          const clamp = Math.max(0, diff);
          const hh = String(Math.floor(clamp / 3600000)).padStart(2, "0");
          const mm = String(Math.floor((clamp % 3600000) / 60000)).padStart(
            2,
            "0"
          );
          const ss = String(Math.floor((clamp % 60000) / 1000)).padStart(
            2,
            "0"
          );
          countdownEl.textContent = `${hh}:${mm}:${ss}`;
        }
        updateCountdownFallback();
        setInterval(updateCountdownFallback, 1000);
      } catch (err) {
        listEl.innerHTML = "<li>Unable to load timings</li>";
      }
    }
  }

  window.requestAnimationFrame(() => {
    void init();
  });

  // React to weather city/coords updates
  window.addEventListener("weatherLocationUpdated", async () => {
    try {
      const data = WEATHER_COORDS
        ? await fetchPrayerTimesByCoords(WEATHER_COORDS.lat, WEATHER_COORDS.lon)
        : WEATHER_CITY
        ? await fetchPrayerTimesByCity(WEATHER_CITY, WEATHER_COUNTRY)
        : null;
      if (!data) return;
      const timings = data.timings;
      const prefsObj = await storageGet(STORAGE_KEY_ALARMS);
      const alarmPrefs = prefsObj[STORAGE_KEY_ALARMS] || {};
      renderList(timings, alarmPrefs);
    } catch (_) {}
  });
})();

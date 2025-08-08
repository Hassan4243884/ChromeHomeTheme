# HomeTheme - Custom New Tab Extension

A beautiful Chrome extension that transforms your new tab page into a stunning, modern interface with nature backgrounds, real-time clock, weather information, and Google search functionality.

## Features

### 🌅 **Dynamic Nature Backgrounds**

- Beautiful high-quality nature images from Unsplash and Pexels
- Automatic background rotation
- Manual background change button
- Smooth transitions between images

### ⏰ **Real-time Clock & Date**

- Large, elegant time display
- Current date with full formatting
- Updates every second

### 🌤️ **Weather Information**

- Real-time weather data based on your location
- Temperature display in Celsius
- Weather description and location
- Dynamic weather icons
- Requires OpenWeatherMap API key (optional)

### 👋 **Smart Greetings**

- Time-based greetings (Good Morning, Afternoon, Evening, Night)
- Updates automatically throughout the day

### 🔍 **Google Search Integration**

- Clean, modern search bar
- Direct Google search functionality
- Keyboard shortcuts (Enter to search)
- Auto-focus on page load

### 🎨 **Modern Design**

- Dark, transparent theme
- Glassmorphism effects
- Responsive design for all screen sizes
- Smooth animations and transitions
- Beautiful typography using Inter font

## Installation

### Method 1: Load as Unpacked Extension

1. **Download the extension files**

   - Clone or download this repository
   - Extract the files to a folder on your computer

2. **Open Chrome Extensions**

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner

3. **Load the extension**

   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Set as New Tab Page**
   - The extension will automatically override your new tab page
   - Open a new tab to see the beautiful interface

### Method 2: Install from Chrome Web Store (when published)

1. Visit the Chrome Web Store
2. Search for "HomeTheme"
3. Click "Add to Chrome"
4. Confirm the installation

## Weather Setup (Optional)

To enable weather functionality:

1. **Get an API Key**

   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key

2. **Update the API Key**
   - Open `script.js`
   - Replace `YOUR_OPENWEATHER_API_KEY` with your actual API key
   - Save the file and reload the extension

## Customization

### Changing Background Images

- Click the "Change Background" button to cycle through images
- Your selection is saved and will persist between sessions

### Modifying the Design

- Edit `styles.css` to customize colors, fonts, and layout
- Modify `script.js` to change functionality
- Update `newtab.html` to change the structure

### Adding More Backgrounds

- Edit the `BACKGROUND_IMAGES` array in `script.js`
- Add URLs to your favorite nature images
- Ensure images are high resolution (1920x1080 or larger)

## File Structure

```
HomeTheme/
├── manifest.json          # Extension configuration
├── newtab.html           # Main HTML file
├── styles.css            # CSS styles
├── script.js             # JavaScript functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Features in Detail

### Background System

- 15+ high-quality nature backgrounds
- Smooth fade transitions
- Local storage for remembering user preference
- Mix of Unsplash and Pexels images

### Time & Date System

- Real-time updates every second
- 12-hour format with AM/PM
- Full date display (e.g., "Monday, January 1, 2024")
- Elegant typography and shadows

### Weather System

- Geolocation-based weather
- OpenWeatherMap API integration
- Dynamic weather icons
- Temperature in Celsius
- City and country display

### Search System

- Clean, modern search bar
- Google search integration
- Keyboard shortcuts
- Auto-focus functionality

### Responsive Design

- Works on all screen sizes
- Mobile-friendly layout
- Adaptive weather widget positioning
- Flexible search bar

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Opera
- ❌ Firefox (requires different manifest format)

## Troubleshooting

### Extension Not Loading

- Ensure all files are in the same directory
- Check that `manifest.json` is valid JSON
- Verify file permissions

### Weather Not Showing

- Check if you have an API key configured
- Ensure location permissions are granted
- Check browser console for errors

### Backgrounds Not Loading

- Check internet connection
- Verify image URLs are accessible
- Clear browser cache

## Contributing

Feel free to contribute to this project by:

- Adding new background images
- Improving the design
- Adding new features
- Fixing bugs

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have suggestions, please:

1. Check the troubleshooting section
2. Review the browser console for errors
3. Create an issue on the project repository

---

**Enjoy your beautiful new tab experience! 🌟**

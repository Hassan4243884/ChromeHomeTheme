# Quick Installation Guide

## Step 1: Prepare the Extension

1. Make sure all files are in the same folder:

   - `manifest.json`
   - `newtab.html`
   - `styles.css`
   - `script.js`
   - `README.md`

2. **Optional**: Generate icons using the `create_icons.html` file:
   - Open `create_icons.html` in your browser
   - Click "Generate Icons"
   - Move the downloaded icons to the `icons/` folder

## Step 2: Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the folder containing your extension files
5. The extension should appear in your extensions list

## Step 3: Test the Extension

1. Open a new tab in Chrome
2. You should see the beautiful HomeTheme interface
3. The extension will automatically override your new tab page

## Troubleshooting

- **Extension not loading**: Check that all files are in the same folder
- **Icons missing**: Generate icons using the provided HTML file
- **Weather not working**: Get an API key from OpenWeatherMap and update `script.js`

## Features to Test

- ✅ Clock and date display
- ✅ Greeting based on time
- ✅ Google search functionality
- ✅ Background change button
- ✅ Weather (if API key is set)
- ✅ Responsive design

Enjoy your new beautiful tab page! 🌟

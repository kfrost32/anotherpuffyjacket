# Another Puffy Jacket Chrome Extension

A Chrome extension that scrapes product pages and publishes directly to your Another Puffy Jacket directory.

## Features

- **Smart Page Scraping**: Automatically extracts product name, brand, price, description, and images from e-commerce pages
- **Image Selection**: Visual picker for featured and additional images
- **AI Commentary**: Automatically generates short and long commentary using OpenAI
- **Direct Publishing**: Uploads images to Supabase Storage and creates posts in your database
- **Editable Fields**: Review and edit all scraped data before publishing

## Setup

### 1. Configure API Keys

Edit `config.js` and replace the placeholder values with your actual credentials:

```javascript
const CONFIG = {
  supabase: {
    url: 'https://your-project.supabase.co',
    serviceRoleKey: 'your-service-role-key', // Found in Project Settings > API
    storageBucket: 'images'
  },
  openai: {
    apiKey: 'sk-...', // Your OpenAI API key
    model: 'gpt-4o-mini'
  }
};
```

**Important**: Use your Supabase **service role key** (not the anon key) to bypass RLS policies for direct database access.

### 2. Add Extension Icons

Create three PNG icon files or use placeholder images:
- `icon16.png` (16x16px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder

## Usage

1. **Navigate** to any product page (e.g., outdoor gear on REI, Backcountry, etc.)
2. **Click** the extension icon in your toolbar
3. **Review** the scraped data (name, brand, price, description)
4. **Select** a featured image and optionally additional images
5. **Edit** the AI-generated commentary if needed
6. **Click** "Publish to Supabase" to create the post

The extension will:
- Download and upload all selected images to your Supabase Storage
- Create a new post with `published: true`
- Close automatically after successful publishing

## Troubleshooting

### "Failed to scrape page"
- Make sure you're on a product page with visible product information
- The scraper works best on standard e-commerce sites

### "Failed to upload image"
- Check that your Supabase Storage bucket `images` exists
- Ensure the bucket has public access enabled
- Verify your service role key is correct

### "Failed to publish post"
- Check your Supabase service role key
- Verify the `posts` table exists with the correct schema
- Check browser console for detailed error messages

### Commentary not generating
- Verify your OpenAI API key is correct
- Check that you have API credits available
- Look for errors in the extension's service worker console

## Development

To modify the extension:

1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload any open product pages to pick up content script changes

## Security Notes

- The extension is meant for personal use only
- API keys are hardcoded in `config.js` - never share this extension with others
- Consider using environment-specific builds if sharing the codebase
- The service role key grants full database access - keep it secure

## File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── config.js              # API credentials (NEVER COMMIT)
├── content.js             # Page scraping logic
├── background.js          # API calls (OpenAI, Supabase)
├── popup.html             # Extension UI
├── popup.js               # UI logic
├── popup.css              # Styling
├── icon16.png             # Small icon
├── icon48.png             # Medium icon
├── icon128.png            # Large icon
└── README.md              # This file
```

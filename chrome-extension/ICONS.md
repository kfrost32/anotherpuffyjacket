# Creating Extension Icons

The extension requires three icon sizes. Here are a few options:

## Option 1: Quick Placeholder Icons

Use any image editor or online tool to create simple square icons:
- 16x16px → `icon16.png`
- 48x48px → `icon48.png`
- 128x128px → `icon128.png`

You can use a simple design like:
- Solid color background (e.g., blue #3b82f6)
- White text "APJ" or a jacket symbol
- Export as PNG

## Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Create a simple blue square with text
convert -size 128x128 xc:"#3b82f6" -pointsize 48 -fill white -gravity center -annotate +0+0 "APJ" icon128.png
convert -size 48x48 xc:"#3b82f6" -pointsize 18 -fill white -gravity center -annotate +0+0 "APJ" icon48.png
convert -size 16x16 xc:"#3b82f6" icon16.png
```

## Option 3: Online Icon Generator

Use a free service like:
- [Favicon Generator](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Canva](https://www.canva.com/)

## Option 4: Export from Design Tool

If you have Figma, Sketch, or similar:
1. Create a 128x128px artboard
2. Design your icon
3. Export at 1x (128px), and resized versions (48px, 16px)
4. Save as PNG files with the correct names

## Quick Fix for Testing

For quick testing, you can temporarily use any square image you have:
```bash
# Resize an existing image
convert your-image.png -resize 128x128 icon128.png
convert your-image.png -resize 48x48 icon48.png
convert your-image.png -resize 16x16 icon16.png
```

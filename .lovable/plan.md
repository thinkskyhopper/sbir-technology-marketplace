

# Update the Standalone Embed Widget (`public/embed.html`)

## Problem
The file `public/embed.html` is the actual file used when embedding the widget on external sites. It is a standalone HTML/CSS/JS file, completely separate from the React component. None of the recent changes (fonts, button colors, arrow icon) were applied to this file.

## Changes

### 1. Add Font Imports
Add Google Fonts link for **Inter** (body text) and **Archivo** (headings) to the `<head>` section of `public/embed.html`.

### 2. Update CSS Font Declarations
- Set the `body` font-family to `'Inter', sans-serif`
- Add a heading style using `'Archivo', sans-serif` with `font-weight: 700` for `.listing-title`

### 3. Update the Explore Button
- Update the `.btn-primary` styles to match the current site primary color and hover state
- Add an arrow icon (using a Unicode arrow or inline SVG) to the "Explore" button text, matching the React version

### 4. Update Badge Corners
- If any badge-like elements exist in the widget, update them to use square corners (`border-radius: 0`) to match the site-wide badge change

## Technical Details

All changes are isolated to a single file: **`public/embed.html`**. The CSS variables and inline styles will be updated to reflect the current design system established in the React app.

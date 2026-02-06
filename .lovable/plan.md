
# Fix Embed Widget Button Colors

## Problem
The `public/embed.html` file uses outdated primary color values that don't match the main site's current design system.

| Property | embed.html (current) | Site (index.css) |
|---|---|---|
| `--primary` | `217 91% 50%` | `217 92% 60%` |
| `--primary-hover` | not defined | `217 93% 74%` |

## Changes

**File: `public/embed.html`**

1. Update the `--primary` CSS variable from `217 91% 50%` to `217 92% 60%`
2. Add a `--primary-hover: 217 93% 74%` CSS variable
3. Update `.btn-primary:hover` to use the new hover color instead of just `opacity: 0.9`

These are small CSS-only changes. After publishing, the embedded widget buttons will match the site's current blue.

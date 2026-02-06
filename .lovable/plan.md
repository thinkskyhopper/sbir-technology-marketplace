

## Update Primary Color from #0b64f4 to #3c83f6

This is a one-line change. Both the Sign In button and Explore Marketplace button (and all other primary-colored elements) use the `--primary` CSS variable defined in `src/index.css`.

### Change

**File: `src/index.css`, line 17**

Replace:
```css
--primary: 217 91% 50%;
```
With:
```css
--primary: 217 92% 60%;
```

This converts `#0b64f4` (HSL 217, 91%, 50%) to `#3c83f6` (HSL 217, 92%, 60%) and automatically updates every element using the `primary` color token -- buttons, links, focus rings, sidebar accents, etc.

### Also update the high-contrast override

Line ~120 in `src/index.css` has a high-contrast media query that darkens primary to `217 91% 40%`. This should be adjusted proportionally to `217 92% 50%` to maintain the same contrast relationship.


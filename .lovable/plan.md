

# Update Focus Ring Color to Match Current Primary

## Problem
The `--ring` CSS variable in `src/index.css` is still set to the old primary blue (`217 91% 50%`), while the primary color was updated to `217 92% 60%`. This means dropdown select triggers, text inputs, and textareas show a slightly darker/different blue highlight ring when focused — inconsistent with the rest of the site.

## Changes

**File: `src/index.css`**

1. Update `--ring` from `217 91% 50%` to `217 92% 60%` (line 38)
2. Update `--sidebar-ring` from `217 91% 50%` to `217 92% 60%` (line 47)

This is a two-line CSS variable change. All components using `focus:ring-ring` (inputs, selects, textareas, etc.) will automatically pick up the corrected color.



# Prevent Embed Widget Drift with Project Knowledge

## Problem
The SBIR widget exists in two places:
- `src/components/EmbeddableWidget.tsx` (React component)
- `public/embed.html` (standalone HTML for external embedding)

Changes to one are frequently forgotten in the other, causing the externally embedded widget to fall out of sync with the site's design.

## Solution

Add a **custom knowledge entry** to the project settings so that every future prompt is aware of this dual-file relationship.

### Steps
1. Open **Project Settings** (click project name in top-left corner, then Settings)
2. Go to **Manage Knowledge**
3. Add a new knowledge entry with content like:

> **IMPORTANT: Dual Widget Files**
> The embeddable widget exists in TWO places that must always be kept in sync:
> 1. `src/components/EmbeddableWidget.tsx` — React component used within the app
> 2. `public/embed.html` — Standalone HTML/CSS/JS file served to external sites via iframe
>
> Whenever fonts, colors, buttons, layout, or any visual/functional change is made to either file, the same change MUST also be applied to the other file. The standalone HTML file does not use Tailwind or React — all styles are plain CSS and must be updated manually.

This is a manual step you would take in the Lovable UI — no code changes are needed. Once added, this knowledge will be included in every future conversation, ensuring both files are always updated together.


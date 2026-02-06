

## Fix Hardcoded Hover Colors on Primary Buttons

The button variant in `button.tsx` was updated correctly, but several components pass explicit `className="bg-primary hover:bg-primary/90"` which overrides the variant's hover style.

### Files to Update

Remove the hardcoded `hover:bg-primary/90` (and redundant `bg-primary`) from the `className` prop in these 6 locations across 5 files:

1. **`src/components/Hero.tsx`** (line 41) -- Explore Marketplace button
2. **`src/components/Header/HeaderAuthButtons.tsx`** (line 21) -- Sign In button
3. **`src/components/MarketplaceCard.tsx`** (line 190) -- Contact button
4. **`src/components/Header/HeaderPostListing.tsx`** (lines 41, 51) -- Post Listing buttons (desktop + mobile)
5. **`src/components/ExpertValue/ExpertValueCTA.tsx`** (line 19) -- Schedule Consultation button
6. **`src/components/EmbeddableWidget.tsx`** (line 82) -- Widget explore button

### What Changes

In each case, remove `bg-primary hover:bg-primary/90` from the className since the default button variant already applies `bg-primary` and the correct `hover:bg-[hsl(var(--primary-hover))]`. Keep any other classes (like sizing overrides) intact.

For example, in Hero.tsx:
```
// Before
className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"

// After
className="px-8 py-6 text-lg"
```


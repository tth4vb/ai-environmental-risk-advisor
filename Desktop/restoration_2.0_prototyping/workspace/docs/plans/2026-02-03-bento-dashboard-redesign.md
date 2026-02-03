# RWCB Dashboard Bento-Style Redesign

**Date:** February 3, 2026
**Status:** Design Complete - Ready for Implementation
**Design Aesthetic:** Hybrid Consumer-Dashboard (Instagram/Airbnb-inspired)

---

## Overview

Transform the RWCB Interactive Dashboard from a vertical list layout to a scannable bento-style masonry grid with consumer-app visual polish. The redesign maintains all 8 indicators and 32 visualization options while dramatically improving visual hierarchy and scannability.

---

## Design Decisions Summary

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Layout** | Masonry Grid - "Map as Hero" | Africa basemap draws immediate attention, natural flow |
| **Toggle System** | Dropdown Menu | Space-efficient, cleaner in grid context |
| **Visual Aesthetic** | Hybrid Consumer-Dashboard | Photo-first for qualitative, data-viz for quantitative |
| **Card Treatment** | 50/50 split (4 visual, 4 data) | Balanced storytelling with solid metrics |
| **Basemap** | Static SVG with regions | Beautiful, zero dependencies, implementable |
| **Polish Level** | Instagram Clean | Tighter spacing, subtle shadows, minimal |
| **Sections** | Subtle visual breaks | 32px spacing, no header text |

---

## Layout Architecture

### Grid Structure

**Desktop (≥1024px):**
```
┌────────────────────────────────────┐
│ HERO: Hectares Under Restoration   │  Full-width, 400px tall
│ [Africa SVG Basemap]               │  Visual-first treatment
└────────────────────────────────────┘
              32px spacing
┌─────────────────┬─────────────────┐
│ Seedlings       │ Trees Planted   │  Operational zone
│ [Data viz]      │ [Data viz]      │  2-column grid
├─────────────────┼─────────────────┤
│ Survival Rate   │ Natural Regen   │  Critical metrics
│ [Data viz]      │ [Photos]        │  Mixed treatment
└─────────────────┴─────────────────┘
              32px spacing
┌─────────────────┬─────────────────┐
│ Species         │ Chimpanzee      │  Ecological zone
│ Diversity       │ Habitat         │  2-column grid
│ [Data viz]      │ [Map viz]       │
└─────────────────┴─────────────────┘
              32px spacing
┌────────────────────────────────────┐
│ Hectares Restored (Outcome)        │  Final outcome
│ [Pre/Post verification]            │  Full-width
└────────────────────────────────────┘
```

**Grid Specifications:**
- Container: `max-width: 1200px`, centered with `40px` padding
- CSS Grid: `grid-template-columns: repeat(2, 1fr)`
- Gap: `16px` between cards (Instagram Clean aesthetic)
- Hero cards: `grid-column: 1 / -1` (full span)
- Section breaks: `margin-top: 32px` on first card of each zone

**Visual Hierarchy:**
1. **Hero map** (Hectares Under Restoration) - Immediate attention
2. **Operational metrics** (Seedlings, Trees) - Quick status
3. **Critical indicators** (Survival, Natural Regen) - Deep insight
4. **Ecological outcomes** (Species, Habitat) - Impact story
5. **Final outcome** (Hectares Restored) - Dramatic conclusion

---

## Card Component Design

### Visual-First Cards

**Indicators:** Natural Regeneration, Chimpanzee Habitat, Hectares Under Restoration, Hectares Restored (4 cards)

**Structure:**
```
┌─────────────────────────────┐
│ [Featured Visual/Photo]     │  Image/map: 60% of card height
│                             │  Aspect: 16:9 or 4:3
│                             │  Gradient overlay at bottom
├─────────────────────────────┤
│ ● Indicator Title           │  Status dot + title
│ [View: Trend ▾]             │  Dropdown top-right
│                             │
│ Big Stat or Status          │  36px Inter Bold, green
│ "Improving ↗" or "45 ha"   │
│                             │
│ Supporting text...          │  14px Inter Regular, gray
│                             │
│ [About this metric ▾]       │  Collapsible context
└─────────────────────────────┘
```

**Visual Treatment:**
- Photos/maps dominate the card
- Minimal text overlay
- Large, clear status indicators
- Generous whitespace

---

### Data-Viz Cards

**Indicators:** Seedlings Produced, Trees Planted, Survival Rate, Species Diversity (4 cards)

**Structure:**
```
┌─────────────────────────────┐
│ Indicator Title             │  20px Inter SemiBold
│ [View: Chart ▾]             │  Dropdown top-right
│                             │
│ [Visualization Area]        │  Chart fills 50% of card
│ (chart, bars, sparkline)   │  Clean, minimal styling
│                             │
│ 12,500,000                  │  Key stat: 36px bold green
│ trees planted               │  Label: 14px gray
│                             │
│ [About this metric ▾]       │  Collapsible context
└─────────────────────────────┘
```

**Data-Viz Treatment:**
- Charts/graphs prominent but not dominant
- Big number with label below
- Clear visual hierarchy
- Compact, efficient use of space

---

### Shared Card Styling

**Instagram Clean Aesthetic:**

```css
.indicator-card {
  background: var(--tm-white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 150ms ease;
}

.indicator-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
```

**Specifications:**
- Background: Always white
- Border radius: `8px` (softer than enterprise 4px)
- Padding: `20px` internal
- Shadow (default): `0 2px 8px rgba(0,0,0,0.04)` - very subtle
- Shadow (hover): `0 4px 12px rgba(0,0,0,0.08)` - slightly elevated
- Transition: `150ms ease` on all properties

---

## Dropdown Toggle System

### Visual Design

**Button (Closed State):**
```
┌────────────────────┐
│ View: Trend    ▾   │
└────────────────────┘
```

**Menu (Open State):**
```
┌────────────────────┐
│ ✓ Trend            │  ← Checkmark = active
│   Progress         │
│   By Site          │
│   Table            │
└────────────────────┘
```

### Styling Specifications

**Button:**
```css
.view-dropdown {
  background: transparent;
  border: 1px solid var(--tm-border-light);
  border-radius: 6px;
  padding: 6px 12px;
  font: 14px Inter Medium;
  color: var(--tm-neutrals-900);
  cursor: pointer;
  transition: background 150ms ease;
}

.view-dropdown:hover {
  background: var(--tm-hover-bg);
}
```

**Menu:**
```css
.view-dropdown option {
  padding: 8px 12px;
  background: var(--tm-white);
  color: var(--tm-neutrals-900);
}

.view-dropdown option:checked {
  background: var(--tm-hover-bg);
  font-weight: 600;
}

/* Custom dropdown (if using styled select) */
.dropdown-menu {
  background: var(--tm-white);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  border-radius: 8px;
  padding: 8px;
  animation: slideDown 150ms ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Behavior

**Interaction:**
- Click button → Menu appears below (or above if space constrained)
- Click option → Switches visualization, updates button label, closes menu
- Click outside → Closes menu
- ESC key → Closes menu

**Keyboard Navigation:**
- Tab → Focus button
- Enter/Space → Open menu
- Arrow keys → Navigate options
- Enter → Select option

**State Persistence:**
- Selected view saved to localStorage
- Same key structure: `rwcb-dashboard-state.indicatorStates[indicatorId]`
- Restored on page load

### Options Per Indicator

```javascript
const indicatorOptions = {
  'seedlings': ['Trend', 'Progress', 'By Nursery', 'Table'],
  'trees': ['Progress', 'Sparkline', 'By Site', 'Velocity'],
  'survival': ['Confidence Bands', 'Cohort Table', 'Risk Dashboard', 'Trend'],
  'natural-regen': ['Photos + Status', 'Distribution', 'Before/After', 'Table'],
  'hectares-under': ['Map', 'Timeline', 'By Site', 'Stat Card'],
  'species': ['Status + Breakdown', 'Trend', 'Checklist', 'Simple'],
  'habitat': ['Status', 'Index Trend', 'Map Overlay', 'Simple'],
  'hectares-restored': ['Pre-verification', 'Post-verification', 'Breakdown', 'Narrative']
};
```

---

## Africa Basemap (Hero Card)

### Visual Design

**Hectares Under Restoration - Hero Map:**

```
┌────────────────────────────────────┐
│                                    │
│        [Africa Continent]          │  SVG outline
│                                    │
│    ●                               │  Region highlights
│  Ghana        ● Lake Kivu          │
│            ● Rift Valley           │
│                                    │
│  [Overlay Text]                    │
│  47,000 hectares                   │  36px bold white
│  across 3 regions                  │  with subtle shadow
└────────────────────────────────────┘
```

### SVG Specifications

**Africa Outline:**
```svg
<svg viewBox="0 0 800 600" class="africa-basemap">
  <!-- Ocean/background -->
  <rect width="800" height="600" fill="var(--tm-primary-100)" />

  <!-- Africa continent -->
  <path d="M..."
        fill="var(--tm-neutrals-300)"
        fill-opacity="0.3"
        stroke="var(--tm-neutrals-400)"
        stroke-width="2" />

  <!-- Ghana Cocoa Belt region -->
  <polygon points="..."
           class="restoration-region"
           fill="var(--tm-accent)"
           fill-opacity="0.2"
           stroke="var(--tm-accent)"
           stroke-width="1.5" />

  <!-- Greater Rift Valley region -->
  <polygon points="..."
           class="restoration-region" />

  <!-- Lake Kivu & Rusizi Basin region -->
  <polygon points="..."
           class="restoration-region" />

  <!-- Site markers -->
  <circle cx="..." cy="..." r="8"
          class="site-marker"
          fill="var(--tm-accent)"
          stroke="white"
          stroke-width="2" />
  <!-- Repeat for each site -->
</svg>
```

**Color Palette:**
- Ocean: `--tm-primary-100` (#f7fbfd) - Very light blue
- Continent fill: `--tm-neutrals-300` (#e7e6e6) at 30% opacity
- Continent stroke: `--tm-neutrals-400` (#c9c9c9) at 2px width
- Region fills: `--tm-accent` (#477010) at 20% opacity
- Region strokes: `--tm-accent` solid at 1.5px width
- Site markers: `--tm-accent` solid, 8px circles with 2px white border

### Card Layout

```html
<article class="indicator-card indicator-card--hero indicator-card--visual-first">
  <div class="card-visual">
    <svg class="africa-basemap"><!-- SVG content --></svg>
    <div class="visual-overlay">
      <h3 class="stat-large">47,000 hectares</h3>
      <p class="stat-label">across 3 regions</p>
    </div>
  </div>

  <div class="card-content">
    <header class="card-header">
      <h2>Hectares Under Restoration</h2>
      <select class="view-dropdown">
        <option>Map</option>
        <option>Timeline</option>
        <option>By Site</option>
        <option>Stat Card</option>
      </select>
    </header>

    <div class="card-body">
      <div class="status-indicator">
        <span class="lock-icon">🔒</span>
        <p>Finalized Year 2 - Site boundaries locked</p>
      </div>
      <p class="supporting-text">
        Site boundaries were finalized at the end of Year 2 and cannot be changed...
      </p>
    </div>

    <details class="card-context">
      <summary>About this metric</summary>
      <div class="context-content"><!-- Methodology --></div>
    </details>
  </div>
</article>
```

**Dimensions:**
- Card height: `~500px` total (400px map + 100px content)
- Map aspect ratio: `4:3` or `16:9` depending on design preference
- Text overlay: Bottom 80px with gradient fade

**Interaction:**
- Hover on regions: Opacity increases (0.2 → 0.3)
- Hover on site markers: Scale up (8px → 10px) + tooltip with site name
- No pan/zoom (static SVG)

**Implementation:**
- Create `assets/images/africa-basemap.svg`
- Can be inline SVG or external reference
- Style via CSS classes for easy theming
- Zero external dependencies (no Leaflet/Mapbox)

---

## Responsive Mobile Layout

### Breakpoint Strategy

**Desktop (≥1024px):**
- 2-column masonry grid as designed
- All features enabled

**Tablet (768px - 1023px):**
- Same 2-column grid
- Slightly reduced padding/spacing
- Font sizes scale down minimally

**Mobile (≤767px):**
- Single-column stack
- Optimized for vertical scrolling

### Mobile Specifications

**Layout Changes:**
```css
@media (max-width: 767px) {
  .dashboard-bento-grid {
    grid-template-columns: 1fr; /* Single column */
    gap: 12px; /* Tighter gaps */
    padding: 16px; /* Reduced container padding */
  }

  .indicator-card {
    padding: 16px; /* Reduced card padding */
  }

  .indicator-card--hero {
    /* Hero map still full width, reduced height */
  }

  .card-visual {
    height: 300px; /* Reduced from 400px */
  }

  .indicator-card--section-start {
    margin-top: 24px; /* Reduced section spacing */
  }
}
```

**Typography Scaling:**
```css
@media (max-width: 767px) {
  :root {
    --tm-font-size-xl: 28px;   /* Stats: 36px → 28px */
    --tm-font-size-lg: 18px;   /* Large text: 20px → 18px */
    --tm-font-size-base: 16px; /* Keep base at 16px */
  }
}
```

**Card Order (Mobile):**
1. Hectares Under Restoration (Hero map)
2. Seedlings Produced
3. Trees Planted
4. Survival Rate
5. Natural Regeneration
6. Species Diversity
7. Chimpanzee Habitat Suitability
8. Hectares Restored (Final outcome)

**Touch Optimizations:**
- Dropdown buttons: `min-height: 44px` (touch target)
- Dropdown menu items: `min-height: 44px` per item
- Context panel summary: `min-height: 44px`
- All interactive elements: `min-width: 44px`

**Mobile-Specific Features:**
- Sticky header (optional): Dashboard title stays at top
- Pull-to-refresh (optional): Reload data
- Swipe gestures (optional): Between indicator detail views

---

## Color Usage & Typography

### Color Strategy (Airbnb-Inspired)

**Primary Color Palette:**
- `--tm-primary` (#032230) - Titles, badges, focus states
- `--tm-accent` (#477010) - Stats, status indicators, highlights
- `--tm-neutrals-900` (#1a1919) - Primary body text
- `--tm-neutrals-700` (#5c5959) - Secondary text, labels
- `--tm-neutrals-400` (#c9c9c9) - Borders
- `--tm-neutrals-300` (#e7e6e6) - Light borders, subtle fills
- `--tm-white` (#ffffff) - Card backgrounds

**Color Application Rules:**

**Where Color IS Used:**
- ✓ Big statistics (36px numbers in green `--tm-accent`)
- ✓ Status dots (8px ● circles: green/yellow/red before titles)
- ✓ Map region highlights (20% opacity `--tm-accent`)
- ✓ Active dropdown options (checkmark in `--tm-accent`)
- ✓ Hover borders (40% opacity `--tm-accent` outline)

**Where Color IS NOT Used:**
- ✗ Card backgrounds (always white)
- ✗ Most text (neutral blacks/grays only)
- ✗ Borders (neutral grays)
- ✗ Shadows (subtle gray only)
- ✗ Button backgrounds (neutral with minimal accent)

**Result:** Clean, restrained palette where color adds meaning, not decoration.

### Typography Hierarchy

**Scale:**
```css
:root {
  /* Figma-aligned scale */
  --tm-font-size-xs: 12px;      /* Small labels, metadata */
  --tm-font-size-sm: 14px;      /* Secondary text, dropdown labels */
  --tm-font-size-base: 16px;    /* Body text, navigation */
  --tm-font-size-md: 18px;      /* Subheadings */
  --tm-font-size-lg: 20px;      /* Indicator titles */
  --tm-font-size-xl: 36px;      /* Big numbers, stats */
  --tm-font-size-2xl: 44px;     /* Major headings (if needed) */
}
```

**Usage Map:**
```css
/* Hero Stats (on map overlay) */
.stat-large {
  font: 700 36px/1.0 'Inter', sans-serif;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* Indicator Titles */
.indicator-title {
  font: 600 20px/1.2 'Inter', sans-serif;
  color: var(--tm-neutrals-900);
}

/* Big Numbers/Stats */
.stat-number {
  font: 700 36px/1.0 'Inter', sans-serif;
  color: var(--tm-accent); /* Green */
}

/* Dropdown Labels */
.view-dropdown {
  font: 500 14px/1.5 'Inter', sans-serif;
  color: var(--tm-neutrals-900);
}

/* Body Text */
.card-body {
  font: 400 16px/1.5 'Inter', sans-serif;
  color: var(--tm-neutrals-900);
}

/* Supporting Text */
.supporting-text {
  font: 400 14px/1.5 'Inter', sans-serif;
  color: var(--tm-neutrals-700);
}

/* Small Labels */
.metadata-label {
  font: 400 12px/1.5 'Inter', sans-serif;
  color: var(--tm-neutrals-700);
}
```

**Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Line Height Strategy:**
- Tight (1.0-1.2): Large numbers, stats, headings
- Normal (1.5): Body text, labels, supporting text
- Never below 1.0 or above 1.75

---

## Interaction States & Animations

### Card Hover States

**Data-Viz Cards:**
```css
.indicator-card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transform: translateY(0);
  transition: all 150ms ease;
}

.indicator-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
```

**Visual-First Cards:**
```css
.indicator-card--visual-first:hover .card-visual img {
  transform: scale(1.05);
  transition: transform 300ms ease;
}

.indicator-card--visual-first .card-visual {
  overflow: hidden; /* Contain zoom */
}
```

### Dropdown Menu Animations

**Menu Entrance:**
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu {
  animation: slideDown 150ms ease;
}
```

**Menu Exit:**
```css
@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateY(-4px);
  }
}

.dropdown-menu.closing {
  animation: fadeOut 100ms ease;
}
```

### Visualization Toggle Transitions

**When Switching Views:**
```css
.viz-option {
  transition: opacity 200ms ease;
}

.viz-option[aria-hidden="true"] {
  opacity: 0;
  pointer-events: none;
  position: absolute; /* Remove from flow */
}

.viz-option[aria-hidden="false"] {
  opacity: 1;
  pointer-events: auto;
  position: relative;
}
```

**Smooth Crossfade:**
```javascript
function switchVisualization(indicatorId, newOption) {
  const container = document.querySelector(`[data-indicator="${indicatorId}"] .indicator-viz-container`);
  const oldViz = container.querySelector('[aria-hidden="false"]');
  const newViz = container.querySelector(`[data-option="${newOption}"]`);

  // Fade out old
  oldViz.style.opacity = '0';

  setTimeout(() => {
    oldViz.setAttribute('aria-hidden', 'true');
    newViz.setAttribute('aria-hidden', 'false');
    newViz.style.opacity = '1';
  }, 200);
}
```

### Context Panel Animation

**Expand/Collapse:**
```css
details[open] summary ~ * {
  animation: expandDown 200ms ease;
}

@keyframes expandDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Interactive Element Micro-Interactions

**Status Dots (Subtle Pulse):**
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.status-dot {
  animation: pulse 2s ease-in-out infinite;
}
```

**Lock Icons (Rotate on Hover):**
```css
.lock-icon {
  transition: transform 200ms ease;
}

.lock-icon:hover {
  transform: rotate(5deg);
}
```

**Map Regions (Highlight on Hover):**
```css
.restoration-region {
  fill-opacity: 0.2;
  transition: fill-opacity 200ms ease;
}

.restoration-region:hover {
  fill-opacity: 0.3;
  cursor: pointer;
}
```

### Performance Optimizations

**GPU Acceleration:**
```css
.indicator-card,
.card-visual img,
.dropdown-menu {
  will-change: transform;
}
```

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Animation Guidelines:**
- Only animate `transform` and `opacity` (GPU-accelerated)
- Keep durations short (100-300ms)
- Use `ease` or `ease-out` easing
- Avoid animating `width`, `height`, `left`, `top` (CPU-heavy)
- Test on lower-end devices

---

## Implementation Architecture

### File Structure

```
workspace/
├── rwcb-dashboard-interactive.html  (UPDATE: New bento structure)
├── assets/
│   ├── styles/
│   │   ├── terramatch-core.css      (KEEP: Updated with Figma tokens)
│   │   ├── dashboard-components.css (UPDATE: Add bento grid, dropdown)
│   │   ├── visualization-styles.css (KEEP: Chart styles unchanged)
│   │   └── bento-grid.css          (NEW: Masonry grid layout)
│   ├── scripts/
│   │   └── dashboard-controller.js  (UPDATE: Replace toggles with dropdowns)
│   └── images/
│       └── africa-basemap.svg       (NEW: Static map SVG)
└── docs/
    └── plans/
        └── 2026-02-03-bento-dashboard-redesign.md  (THIS FILE)
```

### CSS Implementation

**New File: `assets/styles/bento-grid.css`**

```css
/**
 * Bento Grid Layout
 * Consumer-app inspired masonry grid
 */

/* Main Grid Container */
.dashboard-bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

/* Hero Cards (Full-width) */
.indicator-card--hero {
  grid-column: 1 / -1;
}

/* Section Visual Breaks */
.indicator-card--section-start {
  margin-top: 32px;
}

/* Visual-First Treatment */
.indicator-card--visual-first .card-visual {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  margin: -20px -20px 20px -20px; /* Bleed to card edges */
}

.indicator-card--visual-first .card-visual img,
.indicator-card--visual-first .card-visual svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
}

.indicator-card--visual-first:hover .card-visual img,
.indicator-card--visual-first:hover .card-visual svg {
  transform: scale(1.05);
}

/* Visual Overlay (for hero stats) */
.visual-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  color: white;
}

.visual-overlay .stat-large {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.0;
  margin: 0 0 4px 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.visual-overlay .stat-label {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

/* Tablet Responsive */
@media (max-width: 1023px) {
  .dashboard-bento-grid {
    padding: 24px;
    gap: 16px;
  }

  .indicator-card {
    padding: 16px;
  }

  .visual-overlay .stat-large {
    font-size: 32px;
  }
}

/* Mobile Responsive */
@media (max-width: 767px) {
  .dashboard-bento-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .indicator-card {
    padding: 16px;
  }

  .indicator-card--section-start {
    margin-top: 24px;
  }

  .indicator-card--visual-first .card-visual {
    height: 250px;
  }

  .visual-overlay .stat-large {
    font-size: 28px;
  }
}
```

### HTML Structure Update

**Current Structure:**
```html
<main class="tm-content">
  <div class="indicators-container">
    <article class="tm-card indicator-card">...</article>
    <article class="tm-card indicator-card">...</article>
  </div>
</main>
```

**New Structure:**
```html
<main class="tm-content">
  <div class="dashboard-bento-grid">

    <!-- Hero: Hectares Under Restoration -->
    <article class="indicator-card indicator-card--hero indicator-card--visual-first"
             data-indicator="hectares-under">
      <div class="card-visual">
        <svg class="africa-basemap"><!-- SVG content --></svg>
        <div class="visual-overlay">
          <h3 class="stat-large">47,000 hectares</h3>
          <p class="stat-label">across 3 regions</p>
        </div>
      </div>
      <div class="card-content">
        <header class="card-header">
          <div class="title-row">
            <span class="status-dot status-dot--green"></span>
            <h2 class="indicator-title">Hectares Under Restoration</h2>
          </div>
          <select class="view-dropdown" aria-label="View options">
            <option value="map">Map</option>
            <option value="timeline">Timeline</option>
            <option value="by-site">By Site</option>
            <option value="stat-card">Stat Card</option>
          </select>
        </header>
        <div class="indicator-viz-container">
          <!-- 4 visualization options with aria-hidden -->
        </div>
        <details class="indicator-context">
          <summary>About this metric</summary>
          <div class="context-content"><!-- Content --></div>
        </details>
      </div>
    </article>

    <!-- Operational Section (visual break via margin) -->
    <article class="indicator-card indicator-card--section-start"
             data-indicator="seedlings">
      <div class="card-content">
        <header class="card-header">
          <h2 class="indicator-title">Seedlings Produced</h2>
          <select class="view-dropdown">
            <option value="trend">Trend</option>
            <option value="progress">Progress</option>
            <option value="by-nursery">By Nursery</option>
            <option value="table">Table</option>
          </select>
        </header>
        <div class="indicator-viz-container">
          <!-- Visualizations -->
        </div>
        <div class="stat-display">
          <p class="stat-number">12,500,000</p>
          <p class="stat-label">seedlings produced</p>
        </div>
        <details class="indicator-context">
          <summary>About this metric</summary>
          <div class="context-content"><!-- Content --></div>
        </details>
      </div>
    </article>

    <article class="indicator-card" data-indicator="trees">
      <!-- Similar structure -->
    </article>

    <!-- Critical Indicators Section -->
    <article class="indicator-card indicator-card--section-start"
             data-indicator="survival">
      <!-- Data-viz card -->
    </article>

    <article class="indicator-card indicator-card--visual-first"
             data-indicator="natural-regen">
      <div class="card-visual">
        <img src="natural-regen-hero.jpg" alt="Natural regeneration site">
      </div>
      <div class="card-content">
        <!-- Visual-first structure -->
      </div>
    </article>

    <!-- Ecological Section -->
    <article class="indicator-card indicator-card--section-start"
             data-indicator="species">
      <!-- Data-viz card -->
    </article>

    <article class="indicator-card indicator-card--visual-first"
             data-indicator="habitat">
      <div class="card-visual">
        <img src="habitat-map.jpg" alt="Chimpanzee habitat suitability">
      </div>
      <div class="card-content">
        <!-- Visual-first structure -->
      </div>
    </article>

    <!-- Final Outcome Section -->
    <article class="indicator-card indicator-card--hero indicator-card--section-start"
             data-indicator="hectares-restored">
      <!-- Full-width outcome card -->
    </article>

  </div>
</main>
```

### JavaScript Updates

**Update: `assets/scripts/dashboard-controller.js`**

**Replace Toggle Buttons with Dropdowns:**

```javascript
// OLD: Toggle button approach
function createToggleButtons(indicatorId, options) {
  const container = document.createElement('div');
  container.className = 'viz-toggle-group';

  options.forEach(opt => {
    const button = document.createElement('button');
    button.className = 'viz-toggle';
    button.innerHTML = `<span class="toggle-icon">${opt.icon}</span>
                        <span class="toggle-label">${opt.label}</span>`;
    button.dataset.option = opt.value;
    container.appendChild(button);
  });

  return container;
}

// NEW: Dropdown approach
function createDropdownToggle(indicatorId, options, activeOption) {
  const select = document.createElement('select');
  select.className = 'view-dropdown';
  select.setAttribute('aria-label', `View options for ${indicatorId}`);

  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    option.selected = opt.value === activeOption;
    select.appendChild(option);
  });

  // Event listener
  select.addEventListener('change', (e) => {
    switchVisualization(indicatorId, e.target.value);
  });

  return select;
}

// Update switchVisualization to work with select
function switchVisualization(indicatorId, optionId) {
  const card = document.querySelector(`[data-indicator="${indicatorId}"]`);
  const select = card.querySelector('.view-dropdown');

  // Update select value
  select.value = optionId;

  // Update visualization visibility
  card.querySelectorAll('.viz-option').forEach(viz => {
    const isActive = viz.dataset.option === optionId;
    viz.setAttribute('aria-hidden', !isActive);
    viz.style.opacity = isActive ? '1' : '0';
  });

  // Save state
  const state = loadState();
  state.indicatorStates[indicatorId] = optionId;
  saveState(state);

  // Announce to screen reader
  announceChange(`Now showing ${optionId} view for ${indicatorId}`);
}
```

**Dropdown Options Configuration:**

```javascript
const indicatorConfigs = {
  'hectares-under': {
    options: [
      { value: 'map', label: 'Map' },
      { value: 'timeline', label: 'Timeline' },
      { value: 'by-site', label: 'By Site' },
      { value: 'stat-card', label: 'Stat Card' }
    ],
    defaultView: 'map'
  },
  'seedlings': {
    options: [
      { value: 'trend', label: 'Trend' },
      { value: 'progress', label: 'Progress' },
      { value: 'by-nursery', label: 'By Nursery' },
      { value: 'table', label: 'Table' }
    ],
    defaultView: 'trend'
  },
  // ... etc for all 8 indicators
};
```

### Africa SVG Map Implementation

**Create: `assets/images/africa-basemap.svg`**

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" class="africa-basemap">
  <defs>
    <style>
      .ocean { fill: var(--tm-primary-100, #f7fbfd); }
      .continent { fill: var(--tm-neutrals-300, #e7e6e6); fill-opacity: 0.3; stroke: var(--tm-neutrals-400, #c9c9c9); stroke-width: 2; }
      .restoration-region { fill: var(--tm-accent, #477010); fill-opacity: 0.2; stroke: var(--tm-accent, #477010); stroke-width: 1.5; transition: fill-opacity 200ms ease; }
      .restoration-region:hover { fill-opacity: 0.3; cursor: pointer; }
      .site-marker { fill: var(--tm-accent, #477010); stroke: white; stroke-width: 2; transition: transform 200ms ease; }
      .site-marker:hover { transform: scale(1.25); cursor: pointer; }
    </style>
  </defs>

  <!-- Ocean background -->
  <rect class="ocean" x="0" y="0" width="800" height="600" />

  <!-- Africa continent outline (simplified path) -->
  <path class="continent" d="M 250,50 L 350,60 L 420,90 L 480,140 L 510,200 L 520,270 L 510,340 L 480,410 L 440,470 L 380,520 L 310,550 L 240,540 L 190,510 L 150,460 L 130,400 L 120,330 L 130,260 L 160,200 L 200,150 L 250,100 Z" />

  <!-- Ghana Cocoa Belt region -->
  <polygon class="restoration-region"
           data-region="ghana"
           points="180,280 220,270 230,310 210,330 180,320"
           aria-label="Ghana Cocoa Belt" />

  <!-- Greater Rift Valley of Kenya region -->
  <polygon class="restoration-region"
           data-region="rift-valley"
           points="420,320 450,310 460,350 440,370 420,360"
           aria-label="Greater Rift Valley of Kenya" />

  <!-- Lake Kivu & Rusizi Basin region -->
  <polygon class="restoration-region"
           data-region="lake-kivu"
           points="380,360 400,350 410,380 395,395 380,385"
           aria-label="Lake Kivu & Rusizi River Basin" />

  <!-- Site markers (example coordinates) -->
  <circle class="site-marker" cx="200" cy="295" r="8" data-site="Ghana Site 1" />
  <circle class="site-marker" cx="435" cy="335" r="8" data-site="Kenya Site 1" />
  <circle class="site-marker" cx="390" cy="375" r="8" data-site="Rwanda Site 1" />
  <!-- Add more site markers as needed -->
</svg>
```

**Usage in HTML:**

```html
<!-- Inline SVG -->
<div class="card-visual">
  <svg class="africa-basemap" viewBox="0 0 800 600">
    <!-- SVG content here -->
  </svg>
  <div class="visual-overlay">
    <h3 class="stat-large">47,000 hectares</h3>
    <p class="stat-label">across 3 regions</p>
  </div>
</div>

<!-- OR External reference -->
<div class="card-visual">
  <object data="/assets/images/africa-basemap.svg" type="image/svg+xml" class="africa-basemap">
    <img src="/assets/images/africa-basemap-fallback.png" alt="Africa basemap">
  </object>
  <div class="visual-overlay">
    <h3 class="stat-large">47,000 hectares</h3>
    <p class="stat-label">across 3 regions</p>
  </div>
</div>
```

**Tooltip JavaScript (Optional):**

```javascript
// Add tooltips to site markers
document.querySelectorAll('.site-marker').forEach(marker => {
  marker.addEventListener('mouseenter', (e) => {
    const siteName = e.target.dataset.site;
    showTooltip(siteName, e.clientX, e.clientY);
  });

  marker.addEventListener('mouseleave', hideTooltip);
});

function showTooltip(text, x, y) {
  const tooltip = document.createElement('div');
  tooltip.className = 'map-tooltip';
  tooltip.textContent = text;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y - 40}px`;
  document.body.appendChild(tooltip);
}

function hideTooltip() {
  document.querySelector('.map-tooltip')?.remove();
}
```

---

## Implementation Steps

### Phase 1: Structure & Layout (2-3 hours)

1. **Create bento-grid.css**
   - Copy masonry grid styles from this document
   - Test 2-column layout with placeholder cards
   - Verify section spacing (32px breaks)

2. **Update HTML structure**
   - Wrap indicators in `.dashboard-bento-grid`
   - Add modifier classes: `--hero`, `--section-start`, `--visual-first`
   - Verify grid spans correctly

3. **Test responsive behavior**
   - Check desktop 2-column
   - Check tablet 2-column (reduced padding)
   - Check mobile 1-column stack

### Phase 2: Dropdown Toggles (1-2 hours)

4. **Replace toggle buttons with dropdowns**
   - Update `dashboard-controller.js`
   - Create `createDropdownToggle()` function
   - Wire up event listeners

5. **Style dropdowns**
   - Apply Instagram Clean styling
   - Add hover states
   - Test keyboard navigation

6. **Verify state persistence**
   - Ensure localStorage still works
   - Test across page reloads

### Phase 3: Visual-First Cards (2-3 hours)

7. **Implement visual-first treatment**
   - Add `.indicator-card--visual-first` styles
   - Create `.card-visual` containers
   - Add gradient overlays for hero stats

8. **Add Africa basemap SVG**
   - Create `africa-basemap.svg` file
   - Inline or reference in HTML
   - Style regions and markers

9. **Add photo cards**
   - Natural Regeneration: Before/after photos
   - Chimpanzee Habitat: Map overlay image
   - Hectares Restored: Verification badge

### Phase 4: Animations & Polish (1-2 hours)

10. **Implement hover states**
    - Card elevation on hover
    - Image zoom on visual-first cards
    - Dropdown animations

11. **Add micro-interactions**
    - Status dot pulse
    - Lock icon rotate
    - Map region highlight

12. **Test accessibility**
    - Keyboard navigation
    - Screen reader announcements
    - Reduced motion support

### Phase 5: Testing & Refinement (2-3 hours)

13. **Cross-browser testing**
    - Chrome, Firefox, Safari, Edge
    - Desktop and mobile

14. **Performance testing**
    - Page load speed
    - Animation smoothness
    - Memory usage

15. **Visual QA**
    - Compare to design mockups
    - Check all 8 indicators
    - Test all 32 visualization options

**Total Estimated Time:** 8-13 hours

---

## Success Criteria

### Functional Requirements

- ✅ All 8 indicators displayed in masonry grid
- ✅ Dropdown menus work for all 32 visualization options
- ✅ State persists across page reloads
- ✅ Africa basemap displays with highlighted regions
- ✅ Responsive layout works on mobile/tablet/desktop
- ✅ Keyboard navigation functional
- ✅ Screen reader compatible

### Visual Requirements

- ✅ Instagram Clean aesthetic (16px gaps, 8px radius, subtle shadows)
- ✅ Hybrid treatment (4 visual-first, 4 data-viz cards)
- ✅ Color used sparingly (green stats, status dots only)
- ✅ Typography hierarchy clear (36px stats, 20px titles, 16px body)
- ✅ Hover animations smooth (150-300ms)
- ✅ Visual-first cards have prominent images/maps

### Performance Requirements

- ✅ Page load <3 seconds on 3G
- ✅ Smooth 60fps animations
- ✅ Zero console errors
- ✅ Works without external dependencies (except Inter font)

### Accessibility Requirements

- ✅ WCAG 2.1 AA compliant
- ✅ All interactions keyboard accessible
- ✅ Screen reader announcements for state changes
- ✅ Color contrast ≥4.5:1 for text
- ✅ Touch targets ≥44px on mobile
- ✅ Reduced motion support

---

## Future Enhancements (Post-MVP)

### Nice-to-Have Features

- **Interactive map regions:** Click region to filter to sites
- **Card favoriting:** Pin key metrics to top
- **Customizable grid:** Drag-and-drop card reordering
- **Print optimization:** Special stylesheet for PDF export
- **Data export:** Download visualization data as CSV
- **Share URLs:** Bookmark specific visualization configurations
- **Dark mode:** Toggle between light/dark themes
- **Animated transitions:** Smooth morphing between visualization types
- **Loading skeletons:** Progressive enhancement while data loads

### Integration Opportunities

- **Real-time updates:** WebSocket connection for live data
- **Comparison mode:** Compare multiple sites side-by-side
- **Historical playback:** Animate progress over time
- **Notification system:** Alert users to significant changes
- **Collaborative features:** Comments, annotations, shared views

---

## Design Validation

**Validated By:** Trevor Hinkle (User)
**Validation Date:** February 3, 2026
**Validation Status:** ✅ All 8 sections approved

**Section Approvals:**
1. ✅ Overall Layout Architecture
2. ✅ Card Component Design
3. ✅ Dropdown Menu Toggle System
4. ✅ Africa Basemap (Hero Card)
5. ✅ Responsive Mobile Layout
6. ✅ Color Usage & Typography Hierarchy
7. ✅ Interaction States & Animations
8. ✅ Implementation Architecture

**Ready for Implementation:** Yes

---

## Appendix: Design Rationale

### Why Bento/Masonry Grid?

**Problem:** Vertical list creates monotonous reading pattern, no visual hierarchy.

**Solution:** Masonry grid creates natural focal points through size variation:
- Hero map draws immediate attention
- Operational metrics at top for quick status
- Critical indicators get prominent space
- Final outcome has dramatic full-width reveal

**Inspiration:** Airbnb property listings, Instagram Explore grid, Pinterest boards

### Why Dropdown Toggles?

**Problem:** Horizontal toggle buttons take too much vertical space in grid layout.

**Solution:** Dropdown menu reduces chrome while maintaining all functionality:
- Saves ~40px vertical space per card
- Cleaner visual appearance
- Still accessible via keyboard
- Standard UI pattern (less cognitive load)

**Trade-off:** One extra click to switch views, but space efficiency worth it.

### Why Hybrid Treatment?

**Problem:** All data-viz feels dry, all photo-first lacks rigor.

**Solution:** 50/50 split based on metric type:
- Qualitative metrics (Natural Regen, Habitat) benefit from visual evidence
- Quantitative metrics (Seedlings, Survival) need chart clarity
- Balanced "impact story + solid data" narrative

**Result:** Dashboard feels human and trustworthy, not just technical.

### Why Instagram Clean vs Airbnb Generous?

**Problem:** Airbnb's generous spacing (24px gaps) reduces cards in viewport.

**Solution:** Instagram's tighter 16px gaps keeps more cards visible:
- Desktop shows 4-5 cards above fold (vs 3 with 24px)
- Better scannability (less scrolling)
- Still feels clean and breathable
- 8px border radius maintains softness

**Result:** Efficiency without feeling cramped.

### Why Static SVG vs Interactive Map?

**Problem:** Interactive maps (Leaflet, Mapbox) add heavy dependencies.

**Solution:** Static SVG with hover states provides 80% of value:
- Highlights restoration regions clearly
- Shows geographic context
- Lightweight (few KB vs 100+ KB)
- Maintains "zero dependencies" constraint
- Can add interactivity later if needed

**Result:** Beautiful, functional, maintainable.

---

**Document Status:** ✅ Complete
**Next Step:** Begin Phase 1 implementation (Structure & Layout)

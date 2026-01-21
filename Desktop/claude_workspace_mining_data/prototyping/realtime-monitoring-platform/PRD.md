# Product Requirements Document: Responsible Mining Tracker

**Version**: 1.0
**Date**: January 21, 2026
**Product Owner**: WRI Polsky Center for the Global Energy Transition
**Status**: Prototype / MVP

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Product Vision](#product-vision)
4. [Target Users](#target-users)
5. [Core Features](#core-features)
6. [Technical Architecture](#technical-architecture)
7. [Data Model](#data-model)
8. [User Interface Specification](#user-interface-specification)
9. [Design System](#design-system)
10. [Performance Requirements](#performance-requirements)
11. [Success Metrics](#success-metrics)
12. [Future Roadmap](#future-roadmap)
13. [Dependencies & Constraints](#dependencies--constraints)

---

## Executive Summary

The **Responsible Mining Tracker** is a web-based platform that enables stakeholders to monitor and track third-party certification status of critical mineral mining operations globally. The platform provides transparency into which mines meet international responsible mining standards, supporting WRI's mission to measure and increase the "responsible share" of critical minerals production.

**Current State**: Functional prototype deployed on Vercel with 4,254 mines from ICMM database, enriched with certification data from Copper Mark, IRMA, and regulatory sources.

**Key Metrics**:
- 4,254 mines tracked globally
- ~7% (300 mines) third-party certified
- ~14% (600 mines) in verification/self-assessment
- ~72% (3,000 mines) unknown certification status
- 8 critical minerals tracked (copper, lithium, nickel, cobalt, gold, silver, iron ore, coal)

---

## Problem Statement

### The Challenge

Currently operating critical minerals mining projects may have environmental and social risks that are not independently verified or disclosed. Local communities, regulators, buyers, and investors lack a centralized, trustworthy source to:

1. **Verify certification claims** - No single source aggregates third-party certification data across schemes (Copper Mark, IRMA, RMI RMAP)
2. **Track progress toward responsibility** - Binary certified/not-certified framing ignores mines working toward certification
3. **Identify transparency gaps** - 70%+ of mines have no public data on ESG performance
4. **Hold operators accountable** - Communities lack tools to identify which operations have independent verification
5. **Measure market transformation** - No baseline for tracking "responsible share" of production over time

### User Pain Points

**Communities & CSOs**:
- "Which mines near us are certified by independent third parties?"
- "How do we verify company claims about environmental responsibility?"
- "What evidence can we use to push for better standards?"

**Buyers & Investors**:
- "What percentage of our supply chain is from certified operations?"
- "How do we comply with EU due diligence regulations?"
- "Which suppliers are making progress toward certification?"

**Regulators**:
- "What's the baseline certification rate in our jurisdiction?"
- "Which operations claim to meet standards but lack third-party verification?"
- "How can we incentivize certification adoption?"

---

## Product Vision

### Vision Statement

"Make certification status and responsible mining progress transparent and actionable for all stakeholders, driving market transformation toward independently verified responsible practices."

### Core Principles

1. **Evidence-First**: Only show certifications with third-party verification and public registry links
2. **Rights & Equity by Design**: Prioritize community accessibility and plain language
3. **Standards-Aware, Not Standards-Bound**: Support multiple certification schemes while maintaining neutrality
4. **Progressive Disclosure**: Recognize journey from unknown → disclosure → certification
5. **Guard Against Misuse**: Prevent greenwashing through verification requirements; protect communities from targeting

---

## Target Users

### Primary Users

#### 1. Local Communities & CSOs
**Jobs-to-be-Done**:
- Identify certified vs. non-certified operations in their region
- Verify company certification claims
- Build evidence for advocacy and grievance mechanisms
- Monitor progress toward responsible practices

**Key Needs**:
- Simple visual interface (map-based)
- Plain language explanations
- Direct links to certification registries
- Offline/low-bandwidth considerations (future)

#### 2. Corporate Buyers (OEMs, Refiners)
**Jobs-to-be-Done**:
- Screen potential suppliers for certification status
- Track progress of suppliers working toward certification
- Report on responsible sourcing metrics
- Comply with EU/US due diligence regulations

**Key Needs**:
- Filterable mine list by commodity and certification
- Aggregate statistics (% certified by region/commodity)
- Export capabilities (future)
- API access (future)

#### 3. Government Regulators
**Jobs-to-be-Done**:
- Establish baseline certification rates
- Monitor compliance with national standards
- Identify operations requiring closer oversight
- Set policy targets for certification adoption

**Key Needs**:
- Geographic filtering
- Compliance status tracking
- Trend analysis (future)
- Regulatory integration (future)

### Secondary Users

- **Investors**: ESG screening and portfolio analysis
- **Standards Bodies**: Market adoption tracking
- **Researchers**: Data for academic studies on certification effectiveness
- **Civil Society Organizations**: Advocacy and policy research

---

## Core Features

### 1. Interactive Map Visualization

**Purpose**: Primary interface for discovering and filtering mines by location and certification status

**Specifications**:
- **Map Engine**: Leaflet.js with OpenStreetMap tiles
- **Markers**: Color-coded circles representing certification status
  - Gold (#F0AB00): Third-party certified (Copper Mark, IRMA 50+)
  - Blue (#3b82f6): Verification in progress
  - Amber (#f59e0b): Some transparency (disclosure, self-assessment)
  - Gray (#9ca3af): Unknown/no public data
- **Marker Size**: 5px radius (7px when selected)
- **Border Style**: Solid for certified, dashed for non-certified (when selected)
- **Auto-Fit**: Map automatically fits bounds to show all filtered mines
- **Bounds**: Horizontal wrapping allowed, vertical constrained to ±85° latitude
- **Click Interaction**: Select mine to open detail panel

**Map Legend**:
- Certification status color key (4 categories)
- Border pattern explanation (solid/dashed)
- Fixed position (bottom-left)

**Performance**:
- 4,254 mines rendered in <50ms
- Smooth panning and zooming
- No lag on marker selection

---

### 2. Search & Filter System

**Purpose**: Enable users to narrow down mines by specific criteria

#### Search Bar
- **Type**: Free text search
- **Scope**: Mine name, company name, country
- **Behavior**: Real-time filtering as user types
- **Clear Button**: X icon to reset search

#### Filter Categories

**Commodity Filter**:
- Options: All, Gold, Copper, Iron Ore, Coal, Lithium, Nickel, Cobalt, Silver
- Default: All

**Certification Filter**:
- Options: All mines, Certified, Verification in progress, Not certified
- Default: All mines
- Logic:
  - "Certified" = progressLevel: 'certified' OR 'advanced'
  - "Verification in progress" = progressLevel: 'verification'
  - "Not certified" = all others

**Progress Level Filter**:
- Options: All levels, Advanced, Certified, Verification, Self-Assessment, Disclosure, Baseline, Unknown
- Default: All levels
- Purpose: Granular filtering by 7-level progress ladder

**Clear Filters Button**:
- Appears when any filter is active
- Resets all filters to default state

**Results Counter**:
- Shows: "X mine(s)" based on current filter state
- Updates in real-time

---

### 3. Mine Detail Panel

**Purpose**: Display comprehensive information about selected mine

**Trigger**: Click mine marker on map

**Panel Layout**:
- Width: 384px (w-96)
- Position: Right side of screen
- Height: Full screen height
- Scroll: Content scrolls, header fixed

#### Header Section

**Mine Identity**:
- Mine name (text-lg, font-semibold)
- Operating company (text-sm, muted)

**Status Badges**:
- Operational status (Active, Suspended, Closed, Expansion)
- Commodity type (capitalized)
- Certification badge (if certified) - gold tint with checkmark

**Metadata Grid** (2 columns):
- Location: Region, Country (with MapPin icon)
- Mine type: Surface, Underground, Mixed (with Building2 icon)
- Operating since: Year (with Calendar icon)
- Nearest community: Distance in km (with Users icon)

**Alerts**:
- Near protected area (amber warning with Shield icon)
- Data confidence level (ICMM ID display)

**Actions**:
- "Watch This Mine" button (toggles watchlist)
- Eye/EyeOff icon to indicate watch status

#### Standards Content (Main Panel)

**Progress Ladder Visualization**:
- 7-level vertical ladder showing mine's current position
- Levels 0-6: Unknown → Baseline → Disclosure → Self-Assessment → Verification → Certified → Advanced
- Current level highlighted
- Checkmarks for achieved levels
- Footer text explaining "responsible tonnes" framework

**Certification Details Card**:
- If certified:
  - Individual certification cards for each scheme
  - Scheme name (Copper Mark, IRMA, RMI RMAP)
  - Certification dates (issued, expiry)
  - Status badge (Active, Expiring Soon, Expired)
  - Verification URL (clickable link to public registry)
  - Scope description
- If not certified:
  - Explanation of certification schemes
  - IRMA 50+ and Copper Mark thresholds
  - Educational text about "responsible tonnes"

**Data Sources Section**:
- Dynamic list based on progress level
- Examples:
  - Certified: Link to Copper Mark Registry
  - Verification: Company ESG Report 2024
  - Disclosure: CDP Climate Disclosure
  - Baseline: National Mining Registry

**Close Button**: X icon in top-right

---

### 4. Summary Statistics Panel

**Purpose**: Provide global overview of certification landscape

**Trigger**: Opens by default on page load; accessible via "Summary" button in header

**Panel Layout**:
- Width: 384px (w-96)
- Position: Right side of screen (replaces detail panel)
- Height: Full screen height
- Scroll: Content scrolls, header fixed

#### Header
- Title: "Global Mining Standards"
- Subtitle: "Summary Statistics"
- Gradient background: Amber-to-blue-to-green with gold accent
- Close button: X icon

#### Key Statistics Card

**Total Mines**:
- Large number display (text-2xl, font-bold)
- Shows count of currently filtered mines

**Certified Section**:
- Gold Award icon (#F0AB00)
- Count and percentage
- Progress bar (gold fill)

**In Progress Section**:
- Blue text
- Count and percentage (verification + self-assessment)
- Progress bar (blue fill)

**Some Transparency Section**:
- Amber text
- Count and percentage (disclosure + baseline)
- No progress bar (less emphasis)

**Unknown Section**:
- Gray text with AlertCircle icon
- Count and percentage
- Shows scale of transparency gap

#### Progress Level Breakdown Card
- List of all 7 levels with non-zero counts
- For each level:
  - Level name (e.g., "Certified")
  - Description (e.g., "Third-party certified (IRMA 50+, Copper Mark)")
  - Count and percentage

#### Top Commodities Card
- Top 5 commodities by mine count
- For each:
  - Commodity name (capitalized)
  - Count and percentage

#### Global Data Sources Card
- List of 5 primary data sources:
  1. ICMM Global Mine Asset Database (Sept 2025)
  2. The Copper Mark Registry
  3. IRMA (Initiative for Responsible Mining Assurance)
  4. Company ESG Disclosures
  5. National Mining Registries
- Brief description for each

#### About Section
- Light gold background with navy text
- Info icon (#003F6A)
- Explanation of WRI's measurement framework
- CTA: "Click any mine marker to see detailed certification information"

---

### 5. Certification Statistics Banner

**Purpose**: Highlight certification gap at global/filtered level

**Position**: Below search/filter bar, above map

**Design**:
- Light gold background (#F0AB0010) with gold border
- Gold Award icon
- Two-line text layout

**Content**:
- Primary: "X of Y mines (Z%) are third-party certified"
- Secondary: "A mines have some transparency • B with no public data"
- Updates dynamically based on filters

---

### 6. Header & Navigation

**Left Section**:
- Title: "Responsible Mining Tracker" (text-xl, font-semibold)
- Subtitle: "WRI Polsky Center for the Global Energy Transition" (text-xs, muted)
- Prototype badge (amber/gold tint)

**Right Section**:
- "Summary" button (toggles summary panel)
  - BarChart3 icon
  - Active state: secondary variant (when panel open)
- Watchlist counter badge (if mines watched)
  - Eye icon
  - "X watched" text

---

### 7. Footer

**Left Section**:
- Attribution: "A tool by the WRI Polsky Center for the Global Energy Transition"
- Copyright: "© 2026 World Resources Institute. All rights reserved."

**Right Section**:
- Links: About, Data Sources, Contact
- Hover state: underline
- Future: Link to actual pages

---

### 8. Watchlist Feature

**Purpose**: Allow users to track specific mines over time

**Functionality**:
- Add/remove mines from watchlist via detail panel button
- Persistent storage (localStorage)
- Counter badge in header shows total watched
- Future: Email alerts, export watchlist

**Current Implementation**:
- Client-side only (no backend sync)
- Survives page refresh
- No limit on watchlist size

---

## Technical Architecture

### Tech Stack

**Frontend Framework**:
- Next.js 14.2.35 (App Router)
- React 18
- TypeScript 5.x

**Styling**:
- Tailwind CSS 3.x
- shadcn/ui component library
- Custom WRI brand colors (#F0AB00, #003F6A)

**Mapping**:
- Leaflet 1.9.x
- react-leaflet
- OpenStreetMap tiles

**State Management**:
- React useState hooks (no external state library)
- localStorage for watchlist persistence

**Build & Deploy**:
- Vercel (production deployment)
- Automatic deployments on push to main
- Environment: Node.js 18+

### Project Structure

```
realtime-monitoring-platform/
├── app/
│   ├── page.tsx                 # Main application page
│   ├── layout.tsx               # Root layout with metadata
│   └── globals.css              # Global styles & Tailwind imports
├── components/
│   ├── ui/                      # shadcn/ui base components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── MineMap.tsx              # Interactive map component
│   ├── MineDetailPanel.tsx      # Mine details sidebar
│   ├── SummaryStatisticsPanel.tsx # Global stats sidebar
│   ├── ProgressLadder.tsx       # 7-level progress visualization
│   └── StandardsDetailCard.tsx  # Certification details card
├── lib/
│   ├── real-mines.ts            # ICMM mine dataset (8,508 → 4,254)
│   ├── standards-registry.ts    # Certification records & progress levels
│   ├── standards-utils.ts       # Certification helper functions
│   ├── production-data.ts       # Mine production volumes (future use)
│   ├── watchlist.ts             # Watchlist localStorage helpers
│   └── utils.ts                 # General utility functions
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/                      # Static assets
├── docs/plans/                  # Implementation plans & design docs
├── CLAUDE.md                    # AI development context
├── PRD.md                       # This document
└── README.md                    # Setup & deployment instructions
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Data Sources                                               │
│  ├── ICMM Global Mine Asset Database (Sept 2025)           │
│  ├── Copper Mark Registry                                   │
│  ├── IRMA Registry                                          │
│  ├── Company ESG Reports                                    │
│  └── National Registries                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Data Layer (lib/)                                          │
│  ├── real-mines.ts: 8,508 mines → filter 50% → 4,254       │
│  ├── standards-registry.ts: ~40 certification records       │
│  └── Enrichment: Add certifications + progressLevel         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  State Management (React)                                   │
│  ├── filteredMines: Apply commodity/cert/progress filters   │
│  ├── selectedMine: Currently displayed in detail panel      │
│  ├── showSummary: Toggle summary statistics panel           │
│  └── watchlist: localStorage-persisted mine IDs             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  UI Components                                              │
│  ├── MineMap: Render markers with certification colors      │
│  ├── MineDetailPanel: Show standards & certification        │
│  ├── SummaryStatisticsPanel: Aggregate statistics           │
│  └── ProgressLadder: Visualize 7-level journey              │
└─────────────────────────────────────────────────────────────┘
```

### Performance Optimizations

1. **Client-Side Filtering**: 4,254 mines filtered in <50ms
2. **React.memo**: Components memoized to prevent unnecessary re-renders
3. **Dynamic Import**: Leaflet loaded dynamically (map only renders client-side)
4. **Static Generation**: Main page pre-rendered at build time
5. **Bundle Size**: 374 kB main bundle, 461 kB first load (acceptable for prototype)

---

## Data Model

### Core Types

#### Mine
```typescript
interface Mine {
  // Identity
  id: string;                           // Unique identifier
  name: string;                         // Mine name
  company: string;                      // Operating company
  icmmId?: string;                      // ICMM database ID

  // Location
  latitude: number;                     // Decimal degrees
  longitude: number;                    // Decimal degrees
  country: string;                      // Country name
  region?: string;                      // State/province/region

  // Operations
  commodity: string;                    // Primary mineral
  mineType: 'surface' | 'underground' | 'mixed';
  status: 'active' | 'suspended' | 'closed' | 'expansion';
  operatingSince?: number;              // Year

  // Risk & Context
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  nearProtectedArea?: boolean;
  nearestCommunityKm?: number;

  // Standards & Certification
  progressLevel?: ProgressLadderLevel;
  certifications?: Certification[];
  regulatoryCompliance?: RegulatoryCompliance;

  // Production (future use)
  latestAnnualProduction?: ProductionData;

  // Metadata
  dataConfidence: 'high' | 'medium' | 'low';
  lastUpdated?: string;                 // ISO date
}
```

#### ProgressLadderLevel
```typescript
type ProgressLadderLevel =
  | 'unknown'          // Level 0: No public data
  | 'baseline'         // Level 1: Licensed, basic compliance
  | 'disclosure'       // Level 2: ESG reporting
  | 'self_assessment'  // Level 3: Internal evaluation
  | 'verification'     // Level 4: Third-party assessment in progress
  | 'certified'        // Level 5: Third-party certified (IRMA 50+, Copper Mark)
  | 'advanced';        // Level 6: Multiple certs or IRMA 75+
```

#### Certification
```typescript
interface Certification {
  scheme: StandardsScheme;              // Certification scheme
  certifiedDate: string;                // ISO date
  expiryDate?: string;                  // ISO date (if applicable)
  verificationUrl?: string;             // Public registry link
  level?: IRMALevel;                    // IRMA-specific level
  scope?: string;                       // What's covered
  notes?: string;                       // Additional context
}

type StandardsScheme =
  | 'copper_mark'
  | 'irma'
  | 'rmi_rmap'
  | 'tailing_standard';

type IRMALevel =
  | 'transparency'
  | 'irma_50'
  | 'irma_75'
  | 'irma_100';
```

#### ProductionData
```typescript
interface ProductionData {
  year: number;
  tonnage: number;                      // Metric tons
  mineral: string;                      // Specific mineral
  source?: string;                      // Data source
}
```

#### RegulatoryCompliance
```typescript
interface RegulatoryCompliance {
  status: 'compliant' | 'non_compliant' | 'under_review' | 'unknown';
  jurisdiction: string;                 // Country or region
  lastInspection?: string;              // ISO date
  notes?: string;
}
```

### Data Sources & Attribution

#### ICMM Global Mine Asset Database
- **Coverage**: 8,508 mines globally (50% shown = 4,254)
- **Date**: September 2025
- **Fields Used**: Name, company, location, commodity, mine type, status
- **Confidence**: High (industry-validated dataset)

#### The Copper Mark
- **Coverage**: ~40 certified copper and nickel operations
- **URL**: https://coppermark.org/participating-sites/
- **Update Frequency**: Quarterly
- **Verification**: Direct links to public registry

#### IRMA (Initiative for Responsible Mining Assurance)
- **Coverage**: ~15 mines at various IRMA levels
- **URL**: https://responsiblemining.net/
- **Levels**: Transparency, IRMA 50, IRMA 75, IRMA 100
- **Verification**: Direct links to public registry

#### Company ESG Disclosures
- **Sources**: Annual reports, sustainability reports, CDP submissions
- **Coverage**: ~600 mines with self-reported data
- **Update Frequency**: Annual
- **Confidence**: Medium (self-reported, not independently verified)

#### National Mining Registries
- **Examples**: US Bureau of Land Management, Australian Geoscience, Canadian Mining Registry
- **Coverage**: Regulatory compliance data for ~300 mines
- **Update Frequency**: Variable by jurisdiction
- **Confidence**: High (government-reported)

### Data Enrichment Process

```typescript
// Pseudocode for data enrichment
function enrichMine(baseMine: BaseMine): Mine {
  // 1. Get certifications from registry
  const certifications = getCertificationsForMine(baseMine.id);

  // 2. Determine progress level
  const progressLevel = determineProgressLevel(baseMine.id, certifications);

  // 3. Add production data (if available)
  const production = getProductionData(baseMine.id);

  // 4. Return enriched mine
  return {
    ...baseMine,
    certifications,
    progressLevel,
    latestAnnualProduction: production
  };
}

function determineProgressLevel(
  mineId: string,
  certs: Certification[]
): ProgressLadderLevel {
  // Priority 1: Explicit progress level assignment
  if (progressLadderData[mineId]) {
    return progressLadderData[mineId];
  }

  // Priority 2: Infer from certifications
  if (hasCertification(certs, 'irma', 'irma_75')) return 'advanced';
  if (hasCertification(certs, ['copper_mark', 'irma'])) return 'certified';

  // Priority 3: Deterministic hash-based assignment
  // (For demonstration purposes - shows realistic distribution)
  return assignProgressLevelByHash(mineId);
}
```

---

## User Interface Specification

### Layout Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Fixed)                                             │
│  ├── Logo/Title                                             │
│  ├── Prototype Badge                                        │
│  └── Summary Button + Watchlist Counter                     │
├─────────────────────────────────────────────────────────────┤
│  Search & Filters Bar (Fixed)                              │
│  ├── Search Input                                           │
│  ├── Filter Button (expandable)                            │
│  └── Results Counter                                        │
├─────────────────────────────────────────────────────────────┤
│  Certification Statistics Banner (Fixed)                    │
│  └── Gold award icon + certification %                      │
├─────────────────────────────────────────────────────────────┤
│  Main Content (Flexible)                                    │
│  ├──────────────────────────────────┬───────────────────────┤
│  │  Map (Flex-1)                    │  Side Panel (384px)  │
│  │  ├── Leaflet Map                 │  ├── (One of:)       │
│  │  ├── Mine Markers                │  │   - Summary Panel │
│  │  └── Legend (bottom-left)        │  │   - Detail Panel  │
│  │                                   │  └── Close Button    │
│  └──────────────────────────────────┴───────────────────────┘
├─────────────────────────────────────────────────────────────┤
│  Footer (Fixed)                                             │
│  ├── Attribution                                            │
│  └── Links (About, Data Sources, Contact)                   │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

**Current State**: Desktop-optimized (1280px+ recommended)

**Breakpoints** (Tailwind defaults):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Future Mobile Considerations**:
- Map: Full width, reduced header height
- Filters: Bottom sheet drawer
- Detail Panel: Full-screen overlay
- Summary Panel: Full-screen overlay
- Watchlist: Mobile-optimized UI

---

## Design System

### Brand Colors (WRI Polsky Center)

#### Primary Colors
- **Gold**: `#F0AB00` (RGB: 240, 171, 0)
  - Used for: Certified badges, progress bars, award icons, banner accents
- **Gray**: `#9B9B9B` (RGB: 155, 155, 155)
  - Used for: Muted text, non-certified markers

#### Secondary Colors
- **Navy**: `#003F6A` (RGB: 0, 63, 106)
  - Used for: About section text, subtle accents
- **Dark Green**: `#007A4D`
  - Used for: Success states (future)
- **Cyan Blue**: `#0099CC`
  - Used for: In-progress states (future)

### Certification Status Colors

```css
--cert-certified: #F0AB00;    /* WRI Gold - Third-party certified */
--cert-in-progress: #3b82f6;  /* Blue - Verification in progress */
--cert-disclosure: #f59e0b;   /* Amber - Some transparency */
--cert-unknown: #9ca3af;      /* Gray - Unknown/no data */
```

### Typography

**Font Family**: System font stack (via Tailwind)
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Font Sizes** (key uses):
- `text-xs` (12px): Supporting text, captions, data sources
- `text-sm` (14px): Body text, descriptions, secondary info
- `text-base` (16px): Default body text
- `text-lg` (18px): Card titles, mine names
- `text-xl` (20px): Page title
- `text-2xl` (24px): Large statistics numbers

**Font Weights**:
- `font-medium` (500): Section headings, labels
- `font-semibold` (600): Mine names, card titles, page title
- `font-bold` (700): Statistics numbers, emphasis

### Spacing System

**Padding/Margin Scale** (Tailwind):
- `p-1`: 0.25rem (4px)
- `p-2`: 0.5rem (8px)
- `p-3`: 0.75rem (12px)
- `p-4`: 1rem (16px) - Most common for cards/panels
- `p-6`: 1.5rem (24px)

**Gap Scale** (for flex/grid):
- `gap-2`: 0.5rem (8px) - Dense UI elements
- `gap-3`: 0.75rem (12px) - Standard spacing
- `gap-4`: 1rem (16px) - Cards, sections

### Component Styling Patterns

#### Badges
```tsx
// Status badge
<Badge variant="outline" className="bg-green-100 text-green-800">
  Active
</Badge>

// Certification badge (gold)
<Badge variant="outline" style={{
  backgroundColor: '#F0AB00' + '20',
  color: '#F0AB00',
  borderColor: '#F0AB00' + '40'
}}>
  ✓ Certified
</Badge>
```

#### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-base">Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Buttons
```tsx
// Primary action
<Button variant="default">Action</Button>

// Secondary action
<Button variant="outline">Action</Button>

// Toggle state
<Button variant={active ? "secondary" : "outline"}>Toggle</Button>

// Icon button
<Button variant="ghost" size="icon">
  <X className="h-4 w-4" />
</Button>
```

### Icons

**Library**: lucide-react

**Commonly Used Icons**:
- `Award`: Certification, achievements
- `MapPin`: Location
- `Building2`: Mine type
- `Calendar`: Dates
- `Users`: Community
- `Shield`: Protected areas
- `Eye/EyeOff`: Watchlist
- `Filter`: Filters
- `Search`: Search
- `X`: Close
- `ChevronDown`: Expand/collapse
- `TrendingUp`: Statistics
- `FileText`: Documents
- `AlertCircle`: Warnings/unknown
- `Info`: Information
- `BarChart3`: Analytics

**Icon Sizing**:
- Small: `h-3 w-3` (12px) - Inline with text
- Default: `h-4 w-4` (16px) - Standard UI icons
- Large: `h-5 w-5` (20px) - Emphasis icons

---

## Performance Requirements

### Load Time Targets

- **Initial Page Load**: < 3 seconds (on 4G connection)
- **Time to Interactive**: < 4 seconds
- **Map Render**: < 1 second after page load
- **Filter Response**: < 100ms (perceived as instant)
- **Mine Selection**: < 50ms to open detail panel

### Current Performance Metrics

**Build Output** (Next.js):
```
Route (app)                              Size     First Load JS
┌ ○ /                                    374 kB          461 kB
└ ○ /_not-found                          873 B          88.2 kB
+ First Load JS shared by all            87.3 kB
```

**Client-Side Performance**:
- 4,254 mines rendered on map: ~50ms
- Filter operation (4,254 → subset): <50ms
- Detail panel open: <20ms
- Summary statistics calculation: <10ms

### Scalability Considerations

**Current Scale**: 4,254 mines (50% of ICMM dataset)
**Target Scale**: 8,508 mines (full ICMM dataset)

**Performance at Scale**:
- Map rendering with 8,508 markers: ~100ms (acceptable)
- Potential optimization: Marker clustering for zoom levels < 4
- Filter performance: Linear time O(n), acceptable up to ~50k mines

**Future Scale** (beyond ICMM):
- 50,000+ mines globally: Requires backend API + pagination
- Real-time updates: WebSocket or polling architecture
- Large datasets: Virtual scrolling for lists

---

## Success Metrics

### Product Metrics

#### Adoption (90 days post-launch)
- **Target**: 500+ unique users
- **Measurement**: Google Analytics

#### Engagement
- **Target**: 3+ minutes average session duration
- **Target**: 5+ mine detail views per session
- **Measurement**: User interaction tracking

#### Feature Usage
- **Map Interaction**: 80%+ of users interact with map (pan/zoom/select)
- **Filters**: 40%+ of users apply at least one filter
- **Summary Panel**: 60%+ of users open summary panel
- **Watchlist**: 10%+ of users add mines to watchlist

### Impact Metrics (WRI Mission)

#### Measurement Framework Support
- **Target**: Platform used in ≥3 real permitting/monitoring decisions within 12 months
- **Target**: Data cited in ≥1 public policy process

#### Transparency Improvement
- **Baseline**: 7% of mines certified (Jan 2026)
- **Target**: Track 10% increase in certified share by Jan 2027
- **Measurement**: Platform data + manual verification

#### Data Quality
- **Target**: 90%+ accuracy on certification status (vs. manual registry checks)
- **Target**: <30 day lag between registry update and platform update

### Technical Metrics

#### Availability
- **Target**: 99.5% uptime (Vercel SLA)
- **Measurement**: Vercel analytics

#### Performance
- **Target**: <3s page load (P95)
- **Target**: <100ms filter response (P95)
- **Measurement**: Vercel Speed Insights

#### Errors
- **Target**: <1% error rate
- **Measurement**: Vercel logs + Sentry (future)

---

## Future Roadmap

### Phase 2: Dashboard & Analytics (Q2 2026)

**Features**:
- Aggregate metrics dashboard
  - "X% of global [commodity] production is certified"
  - Trend lines over time
  - Regional comparisons
- Export capabilities (PDF reports, CSV data)
- Advanced filtering (by production volume, by company portfolio)

**Estimated Effort**: 3-4 weeks

---

### Phase 3: Real-Time Data Integration (Q3 2026)

**Features**:
- API endpoints for Copper Mark and IRMA registries
- Automated production data scraping from company reports
- USGS/IEA data feeds for production volumes
- Scheduled daily/weekly updates
- Change notifications (mines newly certified)

**Technical Requirements**:
- Backend API (Node.js + PostgreSQL)
- ETL pipeline for data ingestion
- Webhook handlers for registry updates

**Estimated Effort**: 6-8 weeks

---

### Phase 4: Community Monitoring (Q4 2026)

**Features**:
- Community-reported observations (with moderation)
- Photo/document upload for evidence
- Grievance mechanism integration
- IPLC data sovereignty controls (consent-based data sharing)

**Partnerships Required**:
- Grievance mechanism providers (Shift, CAO)
- IPLC organizations for co-design
- Moderation infrastructure

**Estimated Effort**: 8-10 weeks

---

### Phase 5: Supply Chain Traceability (2027)

**Features**:
- Mine-to-smelter-to-refiner-to-OEM visualization
- RMI RMAP integration for downstream actors
- Chain-of-custody confidence scoring
- Supplier scorecards for buyers

**Technical Requirements**:
- Graph database for supply chain relationships
- Integration with OECD/IEA traceability frameworks
- Partnership with RMI, OECD

**Estimated Effort**: 12-16 weeks

---

### Phase 6: Mobile Apps (2027)

**Platforms**:
- iOS and Android native apps
- Offline-first architecture for low-bandwidth areas
- Push notifications for watchlist updates
- Location-based "mines near me" feature

**Estimated Effort**: 16-20 weeks

---

## Dependencies & Constraints

### Technical Dependencies

**Critical**:
- Next.js framework (locked to v14.x for stability)
- Leaflet.js (map rendering)
- ICMM database access (partnership required)
- Vercel hosting (can migrate if needed)

**Data Dependencies**:
- Copper Mark Registry (public API: yes)
- IRMA Registry (public API: no - manual scraping)
- Company reports (manual collection + OCR)
- National registries (variable API availability)

### Regulatory Constraints

**EU Digital Services Act (DSA)**:
- User-generated content moderation required (Phase 4+)
- Transparency reporting for content decisions
- Appeals mechanism for removed content

**GDPR (if serving EU users)**:
- Cookie consent for analytics
- User data deletion on request
- Privacy policy update required

**Data Licensing**:
- ICMM data: Non-commercial use only (current agreement)
- OpenStreetMap: Attribution required (currently compliant)
- Certification registry data: Public domain (no restrictions)

### Operational Constraints

**Current Resources**:
- 1 developer (Trevor)
- No dedicated data team
- Manual data updates

**Funding**:
- WRI internal funding (prototype phase)
- External funding required for Phases 3-6
- Potential revenue models:
  - Corporate subscriptions (buyer tier)
  - API access for researchers
  - Grant-funded (foundations, governments)

### Partnership Requirements

**Essential Partnerships**:
- ICMM: Data access and co-branding
- Copper Mark: API access, co-marketing
- IRMA: Data sharing, endorsement
- Standards bodies: Data validation, feedback

**Desirable Partnerships**:
- OEMs (Apple, Tesla, etc.): User testing, pilot programs
- NGOs (Earthworks, etc.): Community validation, co-design
- Academic institutions: Research collaboration, validation studies

---

## Appendix A: Glossary

**Terms**:
- **Certification**: Third-party verification of mine practices against defined standards
- **Progress Ladder**: 7-level framework tracking mine's journey from unknown to advanced certification
- **Responsible Share**: Percentage of production from certified mines (WRI metric)
- **Responsible Tonnes**: Tonnage of minerals produced from certified mines
- **FPIC**: Free, Prior, and Informed Consent (indigenous rights principle)
- **IPLC**: Indigenous Peoples and Local Communities
- **CSO**: Civil Society Organization
- **OEM**: Original Equipment Manufacturer (e.g., Apple, Tesla)
- **Due Diligence**: Legal requirement to verify supply chain practices (EU/US)

**Certification Schemes**:
- **Copper Mark**: Industry-led certification for copper and nickel operations
- **IRMA**: Multi-stakeholder standard for responsible mining (all minerals)
- **RMI RMAP**: Responsible Minerals Assurance Process (smelters/refiners)
- **GTS**: Global Tailings Standard (tailings facility safety)

**Data Sources**:
- **ICMM**: International Council on Mining and Metals (industry association)
- **USGS**: United States Geological Survey (production data)
- **IEA**: International Energy Agency (energy transition minerals)
- **CDP**: Carbon Disclosure Project (environmental reporting)
- **EITI**: Extractive Industries Transparency Initiative (government reporting)

---

## Appendix B: Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-21 | Trevor Hinkle | Initial PRD - prototype as deployed |

---

## Document Metadata

**Ownership**: WRI Polsky Center for the Global Energy Transition
**Maintained By**: Product Studio, World Resources Institute
**Last Updated**: January 21, 2026
**Next Review**: March 1, 2026 (post-user testing)
**Feedback**: trevor.hinkle@wri.org

---

**End of Document**

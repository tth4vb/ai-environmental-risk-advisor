# Marketplace Discovery View Design
**Date:** January 13, 2026
**Status:** Validated
**Context:** TerraMatch / Restoration Works prototype

---

## Overview

The Marketplace Discovery view is the key competitive differentiator for Restoration Works - addressing the primary gap that "no true matchmaking product exists" in the restoration space. This view enables:

- **Portfolio Managers (funders)** to discover, filter, shortlist, and vet restoration projects
- **Restoration Champions** to discover funders and submit their projects for consideration

It embodies the "selected not approved" paradigm: champions create projects bottom-up, funders discover and select them.

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| User model | Two-sided with toggle | Both funders and champions need discovery; toggle keeps UI simple |
| Discovery mechanism | Split view (map + synced list) | Geographic context is essential; list provides detail |
| Project filters | Geography, Outcomes, Funding Stage, Verification | Core criteria for funder evaluation |
| Funder filters | Parallel structure + Focus Areas, Funding Range | Champions need to find aligned funders |
| Primary actions | Shortlist, View Profile, Express Interest | Supports discover → vet → connect workflow |

---

## Page Structure & Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Restoration Works          [Search] [Notifications] [Profile] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  [Discover Projects]  |  [Discover Funders]             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────┬──────────────────────────────────────────┐   │
│  │              │                                          │   │
│  │   FILTERS    │            MAP VIEW                      │   │
│  │              │     (clusters + markers synced           │   │
│  │  Geography   │      with list below)                    │   │
│  │  Outcomes    │                                          │   │
│  │  Funding     │                                          │   │
│  │  Verified    ├──────────────────────────────────────────┤   │
│  │              │                                          │   │
│  │              │         RESULTS CARDS                    │   │
│  │              │    (scrollable, synced with map)         │   │
│  │              │                                          │   │
│  └──────────────┴──────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Layout proportions:**
- Left sidebar (filters): ~250px fixed width
- Right content area: flexible
  - Map: ~60% of vertical space
  - Results cards: ~40% of vertical space (scrollable)

---

## Project Card Component

For "Discover Projects" view:

```
┌─────────────────────────────────────────────────────────┐
│ [Hero Image - 120px tall, full width]                   │
├─────────────────────────────────────────────────────────┤
│  ◉ VERIFIED                          📍 Ethiopia        │
│                                                         │
│  Gambella Community Reforestation                       │
│  Tigray Development Association                         │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ 🌳 450K  │ │ 🌍 2,400 │ │ 👥 340   │                │
│  │ Trees    │ │ Hectares │ │ Jobs     │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│                                                         │
│  Seeking: $2.4M  |  Stage: Implementation               │
│                                                         │
│  [☆ Shortlist]  [View Profile →]  [Express Interest]   │
└─────────────────────────────────────────────────────────┘
```

**Visual hierarchy:**
1. Hero image - humanizes the project
2. Status badges - verification + location at a glance
3. Project name (bold) + Organization name (muted)
4. Key Indicators - 3 most impactful KPIs using existing indicator card pattern
5. Funding context - amount sought + current stage
6. Actions - Shortlist, View Profile, Express Interest

**Verification badge colors:**
- Green: Verified
- Yellow: Pending review
- Grey: Unverified

---

## Funder Card Component

For "Discover Funders" view:

```
┌─────────────────────────────────────────────────────────┐
│ [Organization Logo]     [Cover Image - portfolio sites] │
├─────────────────────────────────────────────────────────┤
│  PORTFOLIO MANAGER                   🌍 Global          │
│                                                         │
│  Terra Fund for AFR100                                  │
│  World Resources Institute                              │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ 📂 47    │ │ 🌳 12M   │ │ 💰 $45M  │                │
│  │ Projects │ │ Trees    │ │ Deployed │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│                                                         │
│  Focus: Agroforestry, Community-led  |  Active: Yes     │
│                                                         │
│  Looking for: Projects in East Africa, 100-500 ha      │
│                                                         │
│  [☆ Follow]  [View Portfolio →]  [Submit Project]      │
└─────────────────────────────────────────────────────────┘
```

**Key differences from Project cards:**
- Logo + cover image split (funders have brand identity)
- Portfolio-level KPIs (projects funded, total impact, capital deployed)
- "Looking for" section - signals what projects they're seeking (key matchmaking element)
- Different actions: Follow, View Portfolio, Submit Project

---

## Filter Panel

Left sidebar filters adapt based on active view:

```
┌─────────────────────────────┐
│  DISCOVER PROJECTS          │
│  ─────────────────────────  │
│                             │
│  📍 Geography               │
│  ┌─────────────────────┐    │
│  │ Search regions...   │    │
│  └─────────────────────┘    │
│  ☑ East Africa              │
│  ☐ West Africa              │
│  ☐ Southeast Asia           │
│  [+ Show all regions]       │
│                             │
│  🌱 Outcome Types           │
│  ☑ Tree Restoration         │
│  ☑ Agroforestry             │
│  ☐ Mangroves                │
│  ☐ Community Development    │
│                             │
│  💰 Funding Stage           │
│  ○ All                      │
│  ○ Seeking Funding          │
│  ○ Partially Funded         │
│  ○ Fully Funded             │
│                             │
│  ✓ Verification Status      │
│  ☑ Verified                 │
│  ☑ Pending Review           │
│  ☐ Unverified               │
│                             │
│  ─────────────────────────  │
│  [Clear All]  [Apply: 47]   │
└─────────────────────────────┘
```

**Interaction patterns:**
- Multi-select checkboxes for Geography, Outcomes, Verification
- Single-select radio for Funding Stage (mutually exclusive)
- Live count on Apply button shows matching results
- Clear All resets to defaults
- Filters apply immediately on change with debounce

**Funder-specific filters** (when toggled):
- Focus Areas (multi-select)
- Funding Range (min/max slider)
- Geographic Priorities (multi-select)
- Activity Status (active/paused)

---

## Map Interaction

The map is the primary discovery surface, synced with results list:

**Marker types:**
- Clusters: Circle with count number
- Individual markers: Brand color dot
- Selected/hovered: Enlarged with glow

**Synced behaviors:**
- Hover on marker → Card highlights in list, scrolls into view
- Hover on card → Marker pulses on map
- Click marker → Mini-preview popup appears
- Click cluster → Zooms in to show individual markers
- Pan/zoom map → List filters to visible projects (with "Show all X results" option)

**Mini-preview popup:**
```
┌──────────────────────┐
│ [Thumbnail]          │
│ Project Name         │
│ 🌳 450K | 🌍 2,400 ha│
│ [View Card ↓]        │
└──────────────────────┘
```

**Marker states:**
- Default: Brand color dot
- Hovered: Enlarged with subtle glow
- Shortlisted: Star icon overlay
- Selected: Popup visible

---

## Shortlist Functionality

Secondary tab row for shortlist access:

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Discover Projects    |    ☆ My Shortlist (12)       │
└─────────────────────────────────────────────────────────┘
```

**Shortlist view:**
```
┌─────────────────────────────────────────────────────────┐
│  ☆ MY SHORTLIST                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ [Project Card]  │  │ [Project Card]  │               │
│  │                 │  │                 │               │
│  │ Added: Jan 10   │  │ Added: Jan 8    │               │
│  │ Notes: "Strong  │  │ Notes: —        │               │
│  │ community..."   │  │ [+ Add note]    │               │
│  │                 │  │                 │               │
│  │ [Remove] [Compare] │ [Remove] [Compare]             │
│  └─────────────────┘  └─────────────────┘               │
│                                                         │
│  [Compare Selected (2)]           [Export to CSV]       │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Private notes per shortlisted item
- Date added tracking
- Compare mode (select 2-3 for side-by-side)
- Export to CSV for offline review
- Remove with confirmation

Supports "discover → shortlist → vet → select" workflow.

---

## Express Interest Flow

**From Funder → Project:**
```
┌─────────────────────────────────────────────────────────┐
│  EXPRESS INTEREST                                    ✕  │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  You're expressing interest in:                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🌳 Gambella Community Reforestation              │   │
│  │    Tigray Development Association                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Message to project champion:                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ We're interested in learning more about your    │   │
│  │ project for potential inclusion in Terra Fund...│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ☐ Request detailed financials                          │
│  ☐ Request site visit availability                      │
│  ☐ Share our portfolio requirements                     │
│                                                         │
│  [Cancel]                        [Send Interest →]      │
└─────────────────────────────────────────────────────────┘
```

**What happens:**
- Champion receives notification + email
- Interest appears in their "Incoming Inquiries" inbox
- Funder sees project move to "Interest Sent" status
- Both parties can message directly

**From Champion → Funder ("Submit Project"):**
- Similar modal with project selector (if multiple projects)
- Option to include pitch/alignment notes
- Funder receives in "Project Submissions" queue

---

## Empty States

**No results:**
```
┌─────────────────────────────────────────────────────────┐
│          🔍                                             │
│     No projects match your filters                      │
│     Try adjusting your criteria:                        │
│     • Expand geographic region                          │
│     • Include more outcome types                        │
│     • Consider unverified projects                      │
│     [Clear Filters]                                     │
└─────────────────────────────────────────────────────────┘
```

**Empty shortlist:**
```
┌─────────────────────────────────────────────────────────┐
│          ☆                                              │
│     Your shortlist is empty                             │
│     As you discover projects, click the                 │
│     ☆ Shortlist button to save them here.               │
│     [Start Discovering →]                               │
└─────────────────────────────────────────────────────────┘
```

**First-time user:**
- Subtle coach marks on key features
- "Looking for projects in [your region]?" based on profile
- Quick filter presets

**Loading:**
- Skeleton cards while results load
- Map region outline, markers fade in

---

## Design System Alignment

This design uses existing TerraMatch patterns:
- **Key Indicator cards** - Same component from project/portfolio profiles
- **Map with markers** - Same pattern from site/project views
- **Card layouts** - Consistent with existing card patterns
- **Pools vs streams** - Shortlist is a "pool" (static collection)
- **Recursive structure** - Cards link to full profile pages

---

## Implementation Notes

**Data requirements:**
- Projects endpoint with filter support
- Funders/portfolios endpoint with filter support
- Shortlist CRUD operations (user-scoped)
- Interest/submission messaging system

**Key interactions:**
- Map ↔ list synchronization (hover, click states)
- Real-time filter counts
- Debounced filter application

**Mobile considerations:**
- Map and list may need to be tabs rather than split view
- Filter panel as slide-out drawer

---

## References

- WRI Product Design Workshop (January 8, 2026)
- Portfolio Page Design Brief
- Restoration Strategy 2.0 Deck
- Existing TerraMatch Figma: `vE9JRD9uqLaSFVdH0yZHkK`

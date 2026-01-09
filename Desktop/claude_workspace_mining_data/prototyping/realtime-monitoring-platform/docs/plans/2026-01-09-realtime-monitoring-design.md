# Real-time Mining Monitoring Platform - Design Document

**Date:** 2026-01-09
**Status:** Approved for implementation

## Overview

A map-based platform enabling local communities and CSOs to monitor environmental impacts of currently operating mines. Users "watch" specific mines, receive anomaly alerts, and build independent evidence trails through community observations.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary workflow | Watchdog monitoring | Addresses "catch degradation early" pain point; creates ongoing engagement |
| Environmental indicators | Water + Air + Satellite | Comprehensive without overwhelming; satellite imagery provides verifiable evidence |
| Discovery approach | Map-first exploration | Visual engagement; works for both local users and researchers |
| Alert mechanism | Anomaly-based detection | No technical expertise required; catches baseline degradation automatically |
| Community contribution | Observation logging | Creates independent evidence trail without complex data validation |

## User Flow

```
Map Exploration → Mine Detail → Watch → Dashboard → Deep Monitoring
                                  ↓
                           Log Observations
```

## Screen Specifications

### 1. Map Exploration (Entry Point)

**Layout:**
- Full-screen map (~75% viewport) with collapsible left sidebar (~25%)
- Floating controls: zoom, "locate me", layer toggles

**Map Features:**
- Mine markers as colored circles (green/yellow/red by risk level)
- Marker size indicates operation scale
- Click marker → popup card with name, company, commodity, "View Details"
- Cluster markers when zoomed out
- Satellite imagery toggle

**Sidebar Filters:**
- Location: Country dropdown + "Near me" geolocation
- Commodity: Checkbox group (copper, lithium, nickel, cobalt)
- Risk level: Checkbox group (low, moderate, high, critical)
- Company: Searchable dropdown
- Clear all button

**Sidebar Mine List:**
- Scrollable list of visible mines
- Each row: mine name, commodity icon, risk badge
- Click row → fly to mine on map

**Header:**
- Logo/title (left)
- "My Watchlist (n)" button (right)

### 2. Mine Detail Panel

**Trigger:** Click "View Details" from popup or list

**Layout:** Slide-in panel from right (~40% screen), map visible behind

**Sections:**

**Header:**
- Mine name (large), company, commodity badge, status
- "Start Watching" button (or "Watching ✓")

**Risk Snapshot (3 cards):**
- Water Risk: level + one-line summary
- Air Quality: level + summary
- Land Change: level + summary

**Location Context:**
- Mini-map with mine footprint
- Nearby: communities within 25km, protected areas, water bodies
- Distance to nearest population center

**Key Facts:**
- Commodities, mine type, operating since, owner/operator, last updated

**Data Sources:**
- List with confidence badges

**Actions:**
- Start Watching / View Full Monitoring Data
- Share (copy link)

### 3. Watchlist Dashboard

**Trigger:** Click "My Watchlist" or after first watch action

**Layout:** Full page view

**Header:**
- "My Watchlist" title
- "Explore Map" button
- Notification bell with unread count

**Alert Banner:**
- Dismissible: "N new anomalies detected" with Review link
- Color-coded by severity

**Watched Mines Grid (2-3 per row):**
Each card:
- Mine name + commodity icon
- Current status indicator (green/yellow/red)
- 30-day sparkline trend
- Last alert timestamp
- Quick actions: View Details, Log Observation

**Recent Activity Feed:**
- Chronological events across all watched mines
- Types: Alert triggered, Observation logged, Data updated
- Click → navigate to relevant mine

**Quick Actions:**
- Log New Observation
- Export All Data (fake door)
- Invite Collaborator (fake door)

### 4. Mine Monitoring Page (Deep Dive)

**Trigger:** Click "View Details" on watched mine

**Layout:** Full page with tabs

**Header:**
- Back arrow, mine name + company + commodity
- "Watching since: [date]"
- Actions: Log Observation, Export Evidence, Share

**Tab 1: Overview**
- Current risk status cards (larger)
- Anomaly timeline (horizontal, clickable dots)
- 30-day summary stats

**Tab 2: Environmental Data**
- Time range selector: 7d / 30d / 90d / 1y / All
- Water section: Line charts (turbidity, pH, metals) with regulatory threshold lines, anomaly shading
- Air section: Line charts (PM2.5, PM10) with WHO guidelines
- Land section: Before/after satellite slider, vegetation index chart, tailings footprint
- Data source + last updated per chart

**Tab 3: Alerts**
- Filterable list of all anomalies
- Each: date, type, description, severity, status (new/reviewed/dismissed)
- Expand for context + recommended actions
- "Mark as Reviewed" action

**Tab 4: Community Observations**
- Gallery/list view
- Each: photo thumbnail, description, observer, timestamp, location
- "Add Observation" floating button
- Filter by type/date

### 5. Observation Logging Flow

**Trigger:** "Log Observation" buttons throughout app

**Modal Steps:**

**Step 1: Select Mine**
- Pre-selected if from specific mine context
- Dropdown of watched mines otherwise

**Step 2: Capture Evidence**
- Photo upload (drag/drop or camera)
- Up to 5 photos
- Auto-capture EXIF timestamp/location
- Preview thumbnails

**Step 3: Describe**
- Category checkboxes: Water, Air/dust, Noise, Land/vegetation, Wildlife, Health, Other
- Description textarea (500 chars)
- Severity (optional): Minor / Moderate / Serious / Emergency
- Date/time (auto-filled, editable)

**Step 4: Location**
- Mini-map with draggable pin
- "Use current location" option
- Shows distance from mine center

**Step 5: Review & Submit**
- Summary preview
- Privacy notice
- "Submit anonymously" checkbox
- Submit button

**After Submit:**
- Success toast
- Return to previous screen
- Observation visible immediately

## Technical Specification

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Mapping:** React Leaflet + OpenStreetMap
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **State:** Session storage for watchlist persistence

### File Structure

```
realtime-monitoring-platform/
├── app/
│   ├── page.tsx                    # Map exploration (entry)
│   ├── layout.tsx
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx                # Watchlist dashboard
│   └── mine/[mineId]/
│       └── page.tsx                # Mine monitoring deep dive
├── components/
│   ├── MapExplorer.tsx
│   ├── MineMarker.tsx
│   ├── FilterSidebar.tsx
│   ├── MineDetailPanel.tsx
│   ├── WatchlistDashboard.tsx
│   ├── MineMonitoringPage.tsx
│   ├── ObservationLogger.tsx
│   ├── AlertCard.tsx
│   ├── RiskSnapshotCard.tsx
│   ├── charts/
│   │   ├── EnvironmentalChart.tsx
│   │   ├── AnomalyTimeline.tsx
│   │   └── SatelliteComparison.tsx
│   └── ui/
├── lib/
│   ├── mock-mines.ts
│   ├── mock-environmental-data.ts
│   ├── mock-alerts.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── CLAUDE.md
```

### Mock Data

**Mines (10-15 samples):**
- Regions: DRC, Chile, Indonesia, Montana, Argentina
- Commodities: copper, lithium, nickel, cobalt
- Varied risk levels and operational status

**Environmental Time-Series:**
- 90 days of synthetic data per mine
- Realistic patterns with injected anomalies
- Indicators: turbidity, pH, metals, PM2.5, PM10, vegetation index

**Alerts:**
- 3-5 anomalies per mine
- Various severity levels
- Different indicator types

**Observations:**
- 2-3 sample observations per mine
- Placeholder photos
- Range of categories and severities

### Fake Door Features

- Export Evidence button → "Coming soon" toast
- Invite Collaborator → "Coming soon" toast
- Anonymous submission → checkbox works, labeled "beta"
- Push notification setup → "Coming soon"

## Design Principles Applied

1. **Evidence-first**: All data shows source attribution and confidence levels
2. **Rights & equity by design**: Community observations create independent record
3. **Guard against misuse**: Anonymous submission option protects community monitors
4. **Transparency**: Clear about data limitations and uncertainties
5. **Actionable insights**: Alerts include recommended actions, not just data

## Success Metrics (for prototype testing)

1. Users can find and watch a mine in under 60 seconds
2. Anomaly alerts are understandable without technical background
3. Observation logging completes in under 2 minutes
4. Users express confidence in evidence trail for accountability purposes

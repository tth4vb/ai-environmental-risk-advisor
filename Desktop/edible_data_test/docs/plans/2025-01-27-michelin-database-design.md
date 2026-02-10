# Michelin Restaurant Database Design

## Overview
Design for a prototype database containing all Michelin Guide restaurants worldwide, capturing restaurant names and distinction levels for data analysis and research purposes.

## Requirements
- **Purpose**: Data analysis & research on Michelin restaurant distributions and patterns
- **Scope**: Global - all countries where Michelin Guide operates (30+ countries)
- **Data**: Restaurant name + distinction type (no additional details needed)
- **Source**: Wikipedia/Wikidata articles for latest Michelin Guide data
- **Method**: Web scraping with batch processing

## Database Schema

### Table: `michelin_restaurants`
| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PRIMARY KEY | Unique identifier |
| `name` | VARCHAR | Restaurant name |
| `distinction_type` | VARCHAR | Type of Michelin distinction |
| `stars` | INTEGER | Number of stars (0-3) |
| `country` | VARCHAR | Country location |
| `year` | INTEGER | Guide year |
| `scraped_at` | TIMESTAMP | When data was collected |

### Distinction Types
- `three_star` - Three Michelin stars (★★★)
- `two_star` - Two Michelin stars (★★)
- `one_star` - One Michelin star (★)
- `bib_gourmand` - Bib Gourmand (good quality, good value)
- `green_star` - Green Star (sustainable gastronomy)
- `selected` - Selected/Recommended (in guide, no awards)

Note: Restaurants may have multiple distinctions (e.g., one star + green star)

## Architecture

### Core Components
1. **scraper.py** - Main orchestration and control flow
2. **parser.py** - Wikipedia HTML table parsing logic
3. **database.py** - SQLite database operations
4. **sources.json** - Wikipedia URLs for each country
5. **michelin_stars.db** - SQLite database file

### Technology Stack
- **Language**: Python 3.x
- **Database**: SQLite (portable, no server required)
- **Scraping**: requests + BeautifulSoup4
- **Optional**: pandas for data analysis

## Data Flow Pipeline

```
1. Initialize Database
   └── Create schema if not exists

2. Load Sources
   └── Read sources.json for Wikipedia URLs

3. For Each Country:
   ├── Fetch Wikipedia page
   ├── Identify all relevant tables
   ├── Parse restaurant entries
   └── Extract name + distinction

4. Transform Data
   ├── Clean restaurant names
   ├── Map distinction types
   └── Validate star counts

5. Load to Database
   └── Insert/update records

6. Generate Report
   └── Summary statistics
```

## Wikipedia Scraping Strategy

### Target Pages
- Primary: "List of Michelin starred restaurants in [Country]"
- Secondary: "List of Michelin Green Star restaurants in [Country]"
- Tertiary: "List of Bib Gourmand restaurants in [Country]"

### Parsing Approach
1. Locate HTML tables containing restaurant data
2. Identify column structure (name, location, stars/distinction)
3. Parse star symbols (★) or text indicators
4. Handle multi-section pages (organized by region/city)

### Error Handling
- Network retry logic with exponential backoff
- Log and skip malformed pages
- Continue processing remaining countries
- Generate parsing error report

## File Structure

```
michelin-database/
├── scraper.py           # Main scraping orchestration
├── parser.py            # Wikipedia table parsing logic
├── database.py          # Database operations
├── sources.json         # Wikipedia URLs by country
├── requirements.txt     # Python dependencies
├── README.md           # Usage documentation
├── data/
│   └── michelin_stars.db    # SQLite database
└── logs/
    ├── scraping.log         # Execution logs
    └── errors.log           # Error details
```

## Execution Modes

| Mode | Command | Description |
|------|---------|-------------|
| Full Scrape | `python scraper.py --full` | Build database from scratch |
| Update | `python scraper.py --update` | Refresh all data |
| Single Country | `python scraper.py --country France` | Process one country |
| Dry Run | `python scraper.py --dry-run` | Test without database writes |

## Data Validation Rules

1. **Stars**: Must be integer 0-3
2. **Distinction Type**: Must be from defined enum
3. **Names**: Remove special characters, normalize spacing
4. **Duplicates**: Same name + country = update, not duplicate
5. **Year**: Must be valid year (2000-current)

## Success Metrics

- [ ] Successfully scrape 30+ countries
- [ ] Capture all 6 distinction types
- [ ] Parse 95%+ of available restaurants
- [ ] Complete full scrape in < 30 minutes
- [ ] Generate comprehensive error report
- [ ] Produce clean, queryable database

## Maintenance Notes

### Regular Tasks
- **Monthly**: Re-run scraper to catch updates
- **Annually**: Update sources.json with new countries
- **As Needed**: Adjust parser for Wikipedia format changes

### Known Limitations
- Wikipedia page structures vary by country
- Some countries may lack Wikipedia pages
- Historical data may be incomplete
- Restaurant name variations possible

## Next Steps

1. Implement core scraping functionality
2. Test with 2-3 countries first
3. Expand to full country list
4. Add data export capabilities
5. Create analysis queries/reports
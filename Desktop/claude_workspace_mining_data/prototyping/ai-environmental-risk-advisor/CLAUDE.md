# CLAUDE.md - AI Environmental Risk Advisor Prototype

This folder contains the prototype implementation for the **AI Environmental Risk Advisor for potential mining projects** solution.

## Solution Overview

**Problem it solves**: In new mining projects, local communities need independent, trustworthy sources of information on environmental risks and understand potential impacts for them, to be prepared for the consultation and negotiation processes.

**Target Users**: Local community groups and CSOs that represent them where there are potential/planned critical minerals mining projects in the community.

## How it Works

Users select a planned mining site/project (or input their own), and will get automated environmental risk advice/reports/data/customized community guides to help them prepare for the consultation and negotiation process. They can also ask AI follow-up questions (inspiration: GNW). 

The platform will:
- Offer visualizations contextually
- Be available in different languages
- Allow communities to be connected directly to professionals for more in-depth, non-automated advice

## Key Design Principles (from Trevor's notes)

- Emphasize "AI" NOT as the main value proposition
- Focus on keywords like "trustable", "understandable" 
- Avoid "ChatMap" type explorations (some may still be relevant)

## Data Requirements

Potential datasets:
- Deposit/concession data
- Relevant ESG datasets for this local use case (with quality assurance done by WRI or 3rd party partner)
- Other contextual data (ex. demographic, land use)

## Implementation Notes

This prototype should align with the WRI Responsible Mining Data Platform principles:
- Evidence-first approach
- Rights & equity by design
- Open where possible
- Guard against misuse
- Respect data sovereignty

## Jobs-to-be-Done (from User Research)

Based on IPLC and community interviews, this tool must help users:
1. **Protect land, water, and environment** before mining begins
2. **Participate meaningfully in planning and permits** (not just compliance consultations)
3. **Validate company claims** through independent assessments
4. **Build legal cases** with environmental data support
5. **Consolidate community interests** across diverse groups
6. **Build technical capacity** to understand and challenge project proposals

## User Pain Points

### Critical Pains (from research)
- **Technical interpretation barriers**: "It is not easy for a lay person to interpret and understand" - communities need consultants to translate water quality reports and environmental assessments
- **Trust deficit with company data**: "The public source of data is not particularly trusted" - communities don't believe mining company projections
- **Late participation**: Limited invitations to public consultations; often only after key decisions made
- **Baseline data gaps**: "Barely any publicly available data" on current conditions and future projections
- **Power imbalances**: Communities lack capacity to engage effectively with companies/government on technical matters
- **Information without agency**: Communities receive data dumps but lack power in actual decision-making

### Key Insight from Research
**"Communities don't want more data - they want power in decisions"** (ALDA). They need tools that translate information into actionable influence, not just access.

## User Gains (What Success Looks Like)

1. **Early warning system** - Know about projects before key decisions are made
2. **Technical translation** - Complex data explained in community-relevant terms
3. **Independent verification** - Third-party validation of company/government claims
4. **Legal ammunition** - Evidence formatted for regulatory/legal proceedings
5. **Collective action support** - Tools to consolidate diverse community voices
6. **Negotiation leverage** - Data-backed positions for consultations

## Critical Feature Requirements (from Research)

### MUST Include:
1. **Translation layer** between technical data and community understanding
2. **Trust infrastructure** with independent verification mechanisms
3. **Decision support** not just data display - help communities formulate responses
4. **Capacity building** embedded in the platform design
5. **Legal/advocacy tools** to convert findings into actionable demands
6. **Municipal interface** to leverage local government as trust bridge
7. **Anti-disinformation features** to counter "confusing cloud" of competing claims

### MUST Avoid:
- Raw data dumps without interpretation
- Technical tools assuming sophisticated users
- Compliance-focused approaches
- One-way information flow without feedback mechanisms
- Global metrics without local context
- Platforms that don't address power imbalances

## Development Guidelines

1. Start with a simple MVP focusing on core functionality
2. Prioritize trustworthiness and understandability over complexity
3. Design for low-bandwidth/offline scenarios where possible
4. Include multilingual support from the beginning
5. Build in quality assurance mechanisms for data
6. **Center community agency** - every feature should increase community power in decisions
7. **Build trust through transparency** - show data sources, limitations, and confidence levels
8. **Support collective action** - features for community organizing and consensus building
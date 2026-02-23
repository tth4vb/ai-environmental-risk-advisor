import { MiningProject, RiskAssessment, RiskLevel, ProjectPhase, TechnicalDocument, ProjectStage, ProjectSize, WaterSource, CommunityDistance, IndigenousLandsStatus } from '@/types';

export const sampleProjects: Record<string, Partial<MiningProject>> = {
  'lithium-argentina': {
    mineralType: 'lithium',
    location: {
      country: 'Argentina',
      region: 'Catamarca Province',
      nearestCity: 'Fiambalá',
      coordinates: { lat: -27.5, lng: -67.5 }
    },
    companyName: 'Example Lithium Corp',
    projectName: 'Salar del Hombre Muerto Expansion'
  },
  'copper-drc': {
    mineralType: 'copper',
    location: {
      country: 'Democratic Republic of Congo',
      region: 'Katanga Province',
      nearestCity: 'Kolwezi',
      coordinates: { lat: -10.7, lng: 25.5 }
    },
    companyName: 'Global Copper Mining Ltd',
    projectName: 'Kolwezi Copper Project'
  },
  'nickel-indonesia': {
    mineralType: 'nickel',
    location: {
      country: 'Indonesia',
      region: 'Central Sulawesi',
      nearestCity: 'Morowali',
      coordinates: { lat: -2.5, lng: 121.9 }
    },
    companyName: 'Pacific Nickel Resources',
    projectName: 'Morowali Nickel Development'
  }
};

// Enhanced sample mines with full metadata for map-based selection
export interface SampleMine {
  id: string;
  name: string;
  location: string;
  mineralType: MiningProject['mineralType'];
  coordinates: { lat: number; lng: number };
  description: string;
  projectStage: ProjectStage;
  size: ProjectSize;
  waterSource: WaterSource;
  communityDistance: CommunityDistance;
  hasProtectedAreas: boolean;
  indigenousLandsStatus: IndigenousLandsStatus;
  companyName?: string;
  country: string;
  region: string;
  nearestCity: string;
}

export const sampleMines: SampleMine[] = [
  {
    id: 'lithium-valley-ca',
    name: 'Lithium Valley Project',
    location: 'Salton Sea, California, USA',
    coordinates: { lat: 33.3, lng: -115.8 },
    mineralType: 'lithium',
    projectStage: 'environmental-assessment',
    size: 'large',
    waterSource: 'groundwater',
    communityDistance: 'near',
    hasProtectedAreas: true,
    indigenousLandsStatus: 'adjacent',
    description: 'Geothermal lithium extraction project in Imperial County. Uses innovative brine extraction methods from geothermal power operations, raising concerns about water depletion and impacts on agricultural communities in the region.',
    companyName: 'Various operators',
    country: 'United States',
    region: 'California',
    nearestCity: 'Calipatria'
  },
  {
    id: 'copper-chile',
    name: 'Atacama Copper Mine',
    location: 'Atacama Desert, Chile',
    coordinates: { lat: -23.5, lng: -69.2 },
    mineralType: 'copper',
    projectStage: 'permitting',
    size: 'large',
    waterSource: 'both',
    communityDistance: 'medium',
    hasProtectedAreas: false,
    indigenousLandsStatus: 'overlap',
    description: 'Large-scale copper mining operation in the Atacama Desert. Critical concerns include extreme water scarcity in the driest desert on Earth, impacts on Indigenous communities, and competition with local water needs.',
    companyName: 'Chilean Copper Industries',
    country: 'Chile',
    region: 'Antofagasta',
    nearestCity: 'Calama'
  },
  {
    id: 'nickel-indonesia',
    name: 'Sulawesi Nickel Project',
    location: 'Central Sulawesi, Indonesia',
    coordinates: { lat: -2.5, lng: 121.9 },
    mineralType: 'nickel',
    projectStage: 'construction',
    size: 'large',
    waterSource: 'surface',
    communityDistance: 'near',
    hasProtectedAreas: true,
    indigenousLandsStatus: 'overlap',
    description: 'Nickel laterite mining and processing facility in Central Sulawesi. Major environmental concerns include deforestation, proximity to marine protected areas, impacts on coral reefs from tailings, and displacement of local fishing communities.',
    companyName: 'Pacific Nickel Resources',
    country: 'Indonesia',
    region: 'Central Sulawesi',
    nearestCity: 'Morowali'
  },
  {
    id: 'cobalt-drc',
    name: 'Kolwezi Cobalt Mine',
    location: 'Katanga Province, DRC',
    coordinates: { lat: -10.7, lng: 25.5 },
    mineralType: 'cobalt',
    projectStage: 'feasibility',
    size: 'medium',
    waterSource: 'groundwater',
    communityDistance: 'near',
    hasProtectedAreas: false,
    indigenousLandsStatus: 'adjacent',
    description: 'Cobalt extraction project in the DRC copper belt. Critical concerns include artisanal mining conflicts, child labor risks, community displacement, water contamination, and lack of benefit-sharing with local populations.',
    companyName: 'Global Copper Mining Ltd',
    country: 'Democratic Republic of Congo',
    region: 'Lualaba Province',
    nearestCity: 'Kolwezi'
  },
  {
    id: 'copper-nevada',
    name: 'Nevada Basin Copper Exploration',
    location: 'Humboldt County, Nevada, USA',
    coordinates: { lat: 41.2, lng: -117.5 },
    mineralType: 'copper',
    projectStage: 'exploration',
    size: 'small',
    waterSource: 'surface',
    communityDistance: 'far',
    hasProtectedAreas: false,
    indigenousLandsStatus: 'none',
    description: 'Early-stage copper exploration on BLM land in a sparsely populated basin. Low environmental sensitivity with no protected areas or indigenous land overlap. Surface water sourcing minimizes groundwater impacts.',
    companyName: 'Basin Range Minerals',
    country: 'United States',
    region: 'Nevada',
    nearestCity: 'Winnemucca'
  },
  {
    id: 'nickel-pilbara',
    name: 'Pilbara Nickel Survey',
    location: 'Pilbara Region, Western Australia',
    coordinates: { lat: -22.3, lng: 118.8 },
    mineralType: 'nickel',
    projectStage: 'exploration',
    size: 'small',
    waterSource: 'surface',
    communityDistance: 'far',
    hasProtectedAreas: false,
    indigenousLandsStatus: 'adjacent',
    description: 'Small-scale nickel survey in the Pilbara region. Located far from communities with no protected area overlap. Adjacent to Aboriginal lands requiring early engagement but no direct overlap with registered native title areas.',
    companyName: 'Pilbara Minerals Pty Ltd',
    country: 'Australia',
    region: 'Western Australia',
    nearestCity: 'Newman'
  }
];

// ── Risk-level helper functions ──

function getWaterRiskLevel(size: ProjectSize, waterSource: WaterSource, mineralType: string): RiskLevel {
  if (mineralType === 'lithium' && (waterSource === 'groundwater' || waterSource === 'both')) return 'critical';
  if (size === 'large') return 'high';
  if (size === 'medium' || (size === 'small' && waterSource === 'groundwater')) return 'medium';
  return 'low';
}

function getBiodiversityRiskLevel(hasProtectedAreas: boolean | null, size: ProjectSize): RiskLevel {
  const isProtected = hasProtectedAreas === true;
  if (isProtected && size === 'large') return 'critical';
  if (isProtected) return 'high';
  if (hasProtectedAreas === null || size === 'large') return 'medium';
  return 'low';
}

function getCommunityRiskLevel(communityDistance: CommunityDistance, size: ProjectSize): RiskLevel {
  if (communityDistance === 'near' && size === 'large') return 'critical';
  if ((communityDistance === 'near' && size === 'medium') || (communityDistance === 'medium' && size === 'large')) return 'high';
  if ((communityDistance === 'far' && size === 'large') || (communityDistance === 'medium' && (size === 'medium' || size === 'small'))) return 'medium';
  return 'low';
}

function getIndigenousRiskLevel(status: IndigenousLandsStatus, size: ProjectSize): RiskLevel {
  if (status === 'overlap' && size === 'large') return 'critical';
  if (status === 'overlap' || (status === 'adjacent' && size === 'large')) return 'high';
  if ((status === 'adjacent' && (size === 'small' || size === 'medium')) || status === 'unknown') return 'medium';
  return 'low';
}

function getFoodSecurityRiskLevel(size: ProjectSize, communityDistance: CommunityDistance): RiskLevel {
  if (size === 'large' && communityDistance === 'near') return 'critical';
  if ((size === 'medium' && communityDistance === 'near') || (size === 'large' && communityDistance === 'medium')) return 'high';
  if ((size === 'small' && communityDistance === 'near') || (size === 'medium' && communityDistance === 'medium') || (size === 'large' && communityDistance === 'far')) return 'medium';
  return 'low';
}

export const getRiskAssessments = (project: MiningProject): RiskAssessment[] => {
  const size = project.size ?? 'medium';
  const communityDistance = project.communityDistance ?? 'medium';
  const hasProtectedAreas = project.hasProtectedAreas ?? null;
  const waterSource = project.waterSource ?? 'unknown';
  const indigenousStatus = project.indigenousLandsStatus ?? 'unknown';

  const waterLevel = getWaterRiskLevel(size, waterSource, project.mineralType);
  const bioLevel = getBiodiversityRiskLevel(hasProtectedAreas, size);
  const communityLevel = getCommunityRiskLevel(communityDistance, size);
  const indigenousLevel = getIndigenousRiskLevel(indigenousStatus, size);
  const foodLevel = getFoodSecurityRiskLevel(size, communityDistance);

  return [
    {
      category: 'water',
      level: waterLevel,
      title: 'Water Resource Depletion Risk',
      summary: waterLevel === 'critical'
        ? 'Severe water depletion expected from extraction process'
        : waterLevel === 'high'
        ? 'Mining operations may significantly impact local water availability'
        : waterLevel === 'medium'
        ? 'Moderate water impacts possible depending on extraction methods'
        : 'Low water impact expected based on project scale and water source',
      details: waterLevel === 'critical'
        ? 'Lithium extraction requires massive amounts of water (2 million liters per ton of lithium). In this arid region, this will severely impact water availability for communities and ecosystems. Alternative brine processing methods should be mandated.'
        : waterLevel === 'high'
        ? `Based on hydrological modeling, the proposed ${project.mineralType} extraction could reduce groundwater levels by 15-30% within a 10km radius. This poses risks to local agriculture and community water access. Current water stress index shows the region is already experiencing moderate scarcity.`
        : waterLevel === 'medium'
        ? `The proposed ${project.mineralType} operation will require moderate water resources. While not expected to cause severe depletion, monitoring of groundwater levels and surface water flows is recommended to detect early signs of stress.`
        : `The small scale of this project and reliance on surface water suggest limited impact on local water resources. Standard monitoring protocols should be sufficient, though baseline measurements are still recommended.`,
      dataSource: 'WRI Aqueduct 4.0 + Local Basin Study 2023',
      confidence: 'high',
      lastUpdated: '2024-01-15'
    },
    {
      category: 'biodiversity',
      level: bioLevel,
      title: 'Biodiversity and Habitat Impact',
      summary: bioLevel === 'critical'
        ? 'Project overlaps with protected areas and critical habitats'
        : bioLevel === 'high'
        ? 'Protected areas nearby could be significantly affected'
        : bioLevel === 'medium'
        ? 'Some endemic species habitats may be affected'
        : 'Low biodiversity impact expected based on available data',
      details: bioLevel === 'critical'
        ? 'The project area overlaps with a Key Biodiversity Area (KBA) and is within 5km of a protected reserve. Three endangered species have been documented in the impact zone. The large scale of the project amplifies habitat fragmentation risks.'
        : bioLevel === 'high'
        ? 'The project area overlaps with a Key Biodiversity Area (KBA). Environmental assessment should include detailed species surveys and mitigation plans for any endangered species in the impact zone.'
        : bioLevel === 'medium'
        ? 'While no protected areas directly overlap, the project may fragment wildlife corridors. Environmental assessment should include detailed species surveys.'
        : 'No protected areas or Key Biodiversity Areas overlap with the project footprint. The small scale limits habitat fragmentation, though a basic ecological survey is still recommended.',
      dataSource: 'IBAT Alliance + National Environmental Registry',
      confidence: 'medium',
      lastUpdated: '2024-01-10'
    },
    {
      category: 'community-displacement',
      level: communityLevel,
      title: 'Community Displacement Concerns',
      summary: communityLevel === 'critical'
        ? 'Multiple communities face direct displacement from large-scale operations'
        : communityLevel === 'high'
        ? 'Communities within direct impact zone may face significant disruption'
        : communityLevel === 'medium'
        ? 'Indirect impacts on nearby communities likely'
        : 'Minimal community impact expected due to distance and project scale',
      details: communityLevel === 'critical'
        ? 'Approximately 1,200 households in 3 villages are within the proposed project footprint. The large scale of operations will require resettlement planning and fair compensation negotiations. Dust, noise, and traffic impacts will significantly affect daily life.'
        : communityLevel === 'high'
        ? 'Communities are within the direct impact zone. Resettlement or significant disruption is possible. Benefit-sharing agreements and community development plans should be established early.'
        : communityLevel === 'medium'
        ? 'While no direct displacement is anticipated, noise, dust, and traffic impacts will affect communities. Benefit-sharing agreements should be established.'
        : 'The project is located far from communities with a small footprint. Direct impacts are unlikely, though transport routes should be planned to minimize disruption.',
      dataSource: 'Community Mapping Initiative 2023',
      confidence: 'high',
      lastUpdated: '2024-01-20'
    },
    {
      category: 'indigenous-lands',
      level: indigenousLevel,
      title: 'Indigenous Territory Overlap',
      summary: indigenousLevel === 'critical'
        ? 'Large-scale project directly overlaps indigenous territory'
        : indigenousLevel === 'high'
        ? 'Project area includes traditional indigenous lands'
        : indigenousLevel === 'medium'
        ? 'Indigenous lands are nearby; engagement recommended'
        : 'No known indigenous land overlap identified',
      details: indigenousLevel === 'critical'
        ? 'The project directly overlaps with registered indigenous territory at a large scale. Free, Prior, and Informed Consent (FPIC) processes are legally required and must be completed before any project activities. Failure to obtain FPIC may expose the project to legal challenges and reputational risks.'
        : indigenousLevel === 'high'
        ? 'Historical and current maps indicate this area is part of traditional indigenous territory. Free, Prior, and Informed Consent (FPIC) processes must be initiated before any project activities. Local indigenous groups have ancestral ties and ongoing use of these lands for cultural practices.'
        : indigenousLevel === 'medium'
        ? 'Indigenous or community lands are adjacent to or in the vicinity of the project area. Early engagement with indigenous communities is recommended to understand potential cultural and livelihood impacts, even if direct overlap has not been confirmed.'
        : 'Available data from LandMark and national registries show no known indigenous or community land claims overlapping the project area. Standard community engagement practices should still be followed.',
      dataSource: 'LandMark Indigenous Mapping + Local Records',
      confidence: indigenousLevel === 'low' ? 'medium' : 'high',
      lastUpdated: '2024-01-18'
    },
    {
      category: 'food-security',
      level: foodLevel,
      title: 'Agricultural Land and Food Security',
      summary: foodLevel === 'critical'
        ? 'Large-scale conversion of agricultural land near communities threatens food security'
        : foodLevel === 'high'
        ? 'Significant agricultural land may be affected by mining operations'
        : foodLevel === 'medium'
        ? 'Mining may impact local food production capacity'
        : 'Minimal impact on agricultural land and food security expected',
      details: foodLevel === 'critical'
        ? 'The project would convert approximately 2,000 hectares of agricultural land near populated areas. This represents 15% of the district\'s arable land, potentially affecting food security for 5,000+ people. Dust and water diversion could further reduce yields on adjacent farms.'
        : foodLevel === 'high'
        ? 'Significant agricultural land is within the project impact area. Compensation should include support for alternative livelihoods and food security programs. Water diversion for mining could also reduce irrigation availability.'
        : foodLevel === 'medium'
        ? 'Some agricultural lands will be affected. Compensation should include support for alternative livelihoods and food security programs.'
        : 'The project\'s small footprint and distance from farming communities suggest minimal impact on food production. Standard environmental monitoring should confirm no indirect effects on soil or water used for agriculture.',
      dataSource: 'Agricultural Census 2022 + Satellite Analysis',
      confidence: 'medium',
      lastUpdated: '2024-01-12'
    }
  ];
};

export const getProjectPhases = (project: MiningProject): ProjectPhase[] => {
  const stage = project.stage ?? 'exploration';
  const currentStageIndex = [
    'exploration',
    'feasibility',
    'environmental-assessment',
    'permitting',
    'construction'
  ].indexOf(stage);

  return [
    {
      name: 'Exploration',
      status: currentStageIndex > 0 ? 'completed' : currentStageIndex === 0 ? 'current' : 'upcoming',
      estimatedDate: 'Q3 2023 - Q1 2024',
      description: 'Initial geological surveys and resource estimation',
      communityActions: [
        'Request copies of exploration permits',
        'Document current land use and water sources',
        'Establish community monitoring committee'
      ],
      documentsNeeded: [
        'Exploration license',
        'Initial community consultation records',
        'Baseline environmental data'
      ],
      rights: [
        'Right to information about exploration activities',
        'Right to report environmental concerns',
        'Right to traditional land access during exploration'
      ]
    },
    {
      name: 'Feasibility Study',
      status: currentStageIndex > 1 ? 'completed' : currentStageIndex === 1 ? 'current' : 'upcoming',
      estimatedDate: 'Q2 2024 - Q4 2024',
      description: 'Detailed technical and economic assessment',
      communityActions: [
        'Demand inclusion in feasibility consultations',
        'Submit community development priorities',
        'Engage independent technical advisor'
      ],
      documentsNeeded: [
        'Feasibility study summary',
        'Preliminary mine plan',
        'Water usage projections'
      ],
      rights: [
        'Right to participate in planning discussions',
        'Right to propose alternative development options',
        'Right to independent technical review'
      ]
    },
    {
      name: 'Environmental Impact Assessment',
      status: currentStageIndex > 2 ? 'completed' : currentStageIndex === 2 ? 'current' : 'upcoming',
      estimatedDate: 'Q1 2025 - Q3 2025',
      description: 'Comprehensive environmental and social impact studies',
      communityActions: [
        'Participate in all public hearings',
        'Submit written concerns and recommendations',
        'Conduct independent impact assessments',
        'Document traditional ecological knowledge'
      ],
      documentsNeeded: [
        'Full EIA report',
        'Social impact assessment',
        'Biodiversity surveys',
        'Hydrological studies'
      ],
      rights: [
        'Right to full EIA disclosure in local language',
        'Right to sufficient review time (minimum 60 days)',
        'Right to public hearings in accessible locations',
        'Right to have concerns addressed in writing'
      ]
    },
    {
      name: 'Permitting',
      status: currentStageIndex > 3 ? 'completed' : currentStageIndex === 3 ? 'current' : 'upcoming',
      estimatedDate: 'Q4 2025 - Q2 2026',
      description: 'Government review and permit decisions',
      communityActions: [
        'Submit formal objections if concerns unaddressed',
        'Negotiate Community Development Agreement',
        'Establish grievance mechanism',
        'Secure benefit-sharing commitments'
      ],
      documentsNeeded: [
        'All permit applications',
        'Government response to EIA',
        'Proposed permit conditions',
        'Monitoring plans'
      ],
      rights: [
        'Right to appeal permit decisions',
        'Right to negotiate binding agreements',
        'Right to third-party monitoring',
        'Right to fair compensation'
      ]
    },
    {
      name: 'Construction',
      status: currentStageIndex === 4 ? 'current' : 'upcoming',
      estimatedDate: 'Q3 2026 - Q4 2027',
      description: 'Mine construction and infrastructure development',
      communityActions: [
        'Monitor compliance with permit conditions',
        'Track local employment commitments',
        'Report any unauthorized activities',
        'Ensure grievance mechanism is functional'
      ],
      documentsNeeded: [
        'Construction management plan',
        'Local procurement policies',
        'Emergency response procedures',
        'Community communication protocols'
      ],
      rights: [
        'Right to safe construction practices',
        'Right to local employment opportunities',
        'Right to report violations',
        'Right to emergency information'
      ]
    }
  ];
};

// Learning articles for the Learn tab
export interface LearningArticle {
  id: string;
  title: string;
  description: string;
  category: 'water' | 'rights' | 'mining-basics' | 'data-literacy';
  categoryLabel: string;
  readTime: string;
  relatedIds: string[];
}

export const learningArticles: LearningArticle[] = [
  // Water & Environment
  {
    id: 'water-quality-report',
    title: 'How to Read a Water Quality Report',
    description: 'Learn what the numbers mean and when to be concerned',
    category: 'water',
    categoryLabel: 'Water & Environment',
    readTime: '8 min read',
    relatedIds: ['acid-mine-drainage', 'monitoring-data']
  },
  {
    id: 'acid-mine-drainage',
    title: 'Acid Mine Drainage: What It Means for Your Water',
    description: 'How mining can make water acidic and what to watch for',
    category: 'water',
    categoryLabel: 'Water & Environment',
    readTime: '6 min read',
    relatedIds: ['water-quality-report', 'water-competition']
  },
  {
    id: 'water-competition',
    title: 'Where Does Our Water Go? Mining and Water Competition',
    description: 'Understanding how mines use and affect local water sources',
    category: 'water',
    categoryLabel: 'Water & Environment',
    readTime: '7 min read',
    relatedIds: ['water-quality-report', 'acid-mine-drainage']
  },
  // Your Rights
  {
    id: 'fpic-consent',
    title: 'FPIC: Your Right to Free, Prior and Informed Consent',
    description: 'What consent really means and how to exercise it',
    category: 'rights',
    categoryLabel: 'Your Rights',
    readTime: '10 min read',
    relatedIds: ['community-benefits', 'eia-participation']
  },
  {
    id: 'community-benefits',
    title: 'Community Benefits Agreements Explained',
    description: 'What to negotiate and how to hold companies accountable',
    category: 'rights',
    categoryLabel: 'Your Rights',
    readTime: '9 min read',
    relatedIds: ['fpic-consent', 'permits-approvals']
  },
  {
    id: 'eia-participation',
    title: 'How to Participate in an Environmental Impact Assessment',
    description: 'Make your voice count during the EIA process',
    category: 'rights',
    categoryLabel: 'Your Rights',
    readTime: '8 min read',
    relatedIds: ['fpic-consent', 'red-flags-reports']
  },
  // Mining Basics
  {
    id: 'mining-lifecycle',
    title: 'Mining Lifecycle 101: From Exploration to Closure',
    description: 'The stages of a mining project and what happens at each',
    category: 'mining-basics',
    categoryLabel: 'Mining Basics',
    readTime: '12 min read',
    relatedIds: ['tailings-care', 'permits-approvals']
  },
  {
    id: 'tailings-care',
    title: 'What Are Tailings and Why Should You Care?',
    description: 'Understanding mining waste and its risks',
    category: 'mining-basics',
    categoryLabel: 'Mining Basics',
    readTime: '7 min read',
    relatedIds: ['mining-lifecycle', 'acid-mine-drainage']
  },
  {
    id: 'permits-approvals',
    title: 'Permits and Approvals: What Happens Before Mining Begins',
    description: 'The regulatory steps and where community input matters',
    category: 'mining-basics',
    categoryLabel: 'Mining Basics',
    readTime: '9 min read',
    relatedIds: ['mining-lifecycle', 'eia-participation']
  },
  // Understanding Data
  {
    id: 'monitoring-data',
    title: 'Making Sense of Environmental Monitoring Data',
    description: 'A beginner\'s guide to the numbers that matter',
    category: 'data-literacy',
    categoryLabel: 'Understanding Data',
    readTime: '8 min read',
    relatedIds: ['independent-monitoring', 'water-quality-report']
  },
  {
    id: 'independent-monitoring',
    title: 'Independent vs. Company Monitoring: Know the Difference',
    description: 'Why who collects the data matters',
    category: 'data-literacy',
    categoryLabel: 'Understanding Data',
    readTime: '6 min read',
    relatedIds: ['monitoring-data', 'red-flags-reports']
  },
  {
    id: 'red-flags-reports',
    title: 'Red Flags in Environmental Reports',
    description: 'Warning signs to look for when reviewing mining documents',
    category: 'data-literacy',
    categoryLabel: 'Understanding Data',
    readTime: '7 min read',
    relatedIds: ['independent-monitoring', 'eia-participation']
  }
];

export const glossary: Record<string, string> = {
  'EIA': 'Environmental Impact Assessment — a formal study of how a proposed project would affect the environment, required before major projects can proceed.',
  'Environmental Impact Assessment': 'A formal study of how a proposed project would affect the environment, required before major projects can proceed.',
  'FPIC': 'Free, Prior and Informed Consent — the right of Indigenous peoples to give or withhold consent to projects that affect their lands and resources.',
  'grievance mechanism': 'A formal process for community members to raise complaints or concerns about a mining project and get a response.',
  'benefit-sharing commitments': 'Written promises from a mining company about how profits or other benefits will be shared with the local community.',
  'third-party monitoring': 'When an independent organization (not the mining company or government) checks whether environmental rules are being followed.',
  'hydrological studies': 'Scientific studies of water in an area — where it flows, how much there is, and how a project might affect it.',
  'baseline environmental data': 'Measurements of the environment (water, soil, air, wildlife) taken before a project starts, used to track future changes.',
  'Community Development Agreement': 'A legal contract between a mining company and the community that spells out what the company must do for the community.',
  'social impact assessment': 'A study of how a proposed project would affect people\'s daily lives, jobs, health, and culture.',
  'biodiversity surveys': 'Studies that count and identify the different plants and animals in an area, especially rare or endangered ones.',
  'traditional ecological knowledge': 'Knowledge about the local environment that has been passed down through generations within a community.',
  'water stress index': 'A score that shows how much demand there is for water compared to how much is available in an area.',
  'Key Biodiversity Area': 'An area identified by scientists as especially important for plants and animals — it may contain rare species or unique habitats.',
  'aquifer': 'An underground layer of rock or soil that holds water, often used as a source of drinking water through wells.',
};

export const sampleTechnicalDocument: TechnicalDocument = {
  id: 'doc-1',
  title: 'Groundwater Quality Baseline Report - Section 4.3',
  type: 'water-quality',
  technicalContent: `Hydrogeological investigations indicate confined aquifer at -45m to -62m depth with TDS levels ranging 450-680 mg/L. Trace element analysis shows: As: 8-12 μg/L, Cd: <0.5 μg/L, Pb: 2-5 μg/L, Hg: <0.2 μg/L. Pumping tests yield transmissivity values of 250-400 m²/day. Isotopic signatures (δ18O: -8.5‰, δ2H: -58‰) suggest recharge from regional precipitation with residence time >50 years based on ³H analysis.`,
  simplifiedContent: `This report tested the underground water that your community uses for drinking and farming. The main findings:

**Water Location**: The water sits about 50-60 meters (165-200 feet) underground, trapped between rock layers.

**Water Quality**: Generally GOOD for drinking. The water has normal mineral levels and is mostly clean.

**Concerning Findings**: 
- Arsenic levels are slightly elevated but still within safe limits
- This water takes over 50 years to refill naturally
- Current pumping could lower water levels if increased

**What This Means**: Your current water is safe, but the mine's water use could affect your wells within 2-3 years if not carefully managed. The slow refill rate means any pollution or overuse would last for decades.`,
  keyConcerns: [
    'Slow aquifer recharge means any contamination would persist for generations',
    'Current arsenic levels need monitoring if mining begins',
    'Water extraction by mine could lower community well levels',
    'No backup water source identified if primary aquifer is impacted'
  ],
  recommendations: [
    'Demand real-time water monitoring accessible to community',
    'Require mine to develop alternative water source before operations',
    'Establish legal water allocation protecting community needs first',
    'Create emergency water supply plan'
  ]
};
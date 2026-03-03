import { MiningProject, RiskAssessment, ProjectPhase, TechnicalDocument, ProjectStage, ProjectSize, WaterSource, CommunityDistance, RiskCategory, RiskLevel, MitigationSummary } from '@/types';

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
    description: 'Cobalt extraction project in the DRC copper belt. Critical concerns include artisanal mining conflicts, child labor risks, community displacement, water contamination, and lack of benefit-sharing with local populations.',
    companyName: 'Global Copper Mining Ltd',
    country: 'Democratic Republic of Congo',
    region: 'Lualaba Province',
    nearestCity: 'Kolwezi'
  }
];

export const getMitigationForRisk = (category: RiskCategory, level: RiskLevel): MitigationSummary => {
  const mitigationData: Record<RiskCategory, Record<RiskLevel, MitigationSummary>> = {
    water: {
      critical: {
        actions: [
          { stakeholder: 'community', title: 'Establish independent water monitoring', description: 'Partner with a local university or NGO to set up baseline monitoring stations upstream and downstream of the proposed site. Document current water quality and quantity before any project activity begins.', timeframe: '3-6 months', priority: 'high' },
          { stakeholder: 'community', title: 'Map all community water sources', description: 'Create a comprehensive inventory of wells, springs, and surface water used by households, farms, and livestock. This becomes critical evidence if water levels change.', timeframe: '1-3 months', priority: 'high' },
          { stakeholder: 'company', title: 'Implement closed-loop water systems', description: 'Design water recycling systems that minimize freshwater intake and eliminate discharge to local waterways. Use dry-stack tailings to reduce water consumption.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Require water allocation limits in permits', description: 'Set legally binding maximum water extraction volumes based on independent hydrological studies, with community water needs taking priority.', timeframe: 'Permitting phase', priority: 'high' },
        ],
        successExample: 'Antamina Mine, Peru: Community-company water monitoring committee has operated for 20+ years with independent lab analysis and public reporting.',
        expertHelpCta: 'Connect with a hydrologist who specializes in mining impacts',
      },
      high: {
        actions: [
          { stakeholder: 'community', title: 'Establish independent water monitoring', description: 'Partner with a local university or NGO to set up baseline monitoring stations upstream and downstream of the proposed site.', timeframe: '3-6 months', priority: 'high' },
          { stakeholder: 'company', title: 'Implement advanced water treatment before discharge', description: 'Multi-stage treatment systems exceeding regulatory minimums, with real-time quality monitoring at discharge points.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Require enhanced monitoring in permits', description: 'Mandate real-time water monitoring with public reporting conditions and automatic shutdown triggers if thresholds are exceeded.', timeframe: 'Permitting phase', priority: 'high' },
        ],
        successExample: 'Stillwater Mine, Montana: 25 years of independent water monitoring through a community-company agreement with publicly accessible data.',
        expertHelpCta: 'Connect with a hydrologist who specializes in mining impacts',
      },
      medium: {
        actions: [
          { stakeholder: 'community', title: 'Request baseline water quality data', description: 'Ask the company and government for all existing water monitoring data. If none exists, advocate for baseline studies before project approval.', timeframe: '1-3 months', priority: 'medium' },
          { stakeholder: 'company', title: 'Conduct comprehensive hydrological study', description: 'Commission an independent study of surface and groundwater systems, including seasonal variation and climate projections.', timeframe: 'Pre-feasibility', priority: 'medium' },
          { stakeholder: 'government', title: 'Establish water monitoring requirements', description: 'Include standard monitoring and reporting conditions in environmental permits with community access to results.', timeframe: 'Permitting phase', priority: 'medium' },
        ],
        successExample: 'Tintaya Mine, Peru: Multi-stakeholder dialogue table established water monitoring protocols accepted by all parties.',
      },
      low: {
        actions: [
          { stakeholder: 'community', title: 'Stay informed about water conditions', description: 'Monitor any changes in local water availability or quality and report concerns early to environmental authorities.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'company', title: 'Maintain regular monitoring reports', description: 'Publish quarterly water monitoring results in an accessible format and location for community review.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'government', title: 'Conduct periodic compliance checks', description: 'Schedule regular inspections of water management practices and share results with affected communities.', timeframe: 'Annually', priority: 'low' },
        ],
      },
    },
    biodiversity: {
      critical: {
        actions: [
          { stakeholder: 'community', title: 'Document local species and ecosystems', description: 'Work with local environmental groups to create a community biodiversity inventory including traditional ecological knowledge about species, migration routes, and seasonal patterns.', timeframe: '3-6 months', priority: 'high' },
          { stakeholder: 'community', title: 'Advocate for project redesign', description: 'With critical biodiversity overlap, push for the project footprint to be redesigned to avoid Key Biodiversity Areas and protected habitat corridors.', timeframe: '1-3 months', priority: 'high' },
          { stakeholder: 'company', title: 'Commission independent biodiversity assessment', description: 'Hire an accredited independent ecologist to conduct a full species survey and habitat connectivity analysis before any land clearing.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Enforce buffer zones around protected areas', description: 'Require minimum setbacks from KBAs and protected areas, with mandatory wildlife corridors connecting fragmented habitats.', timeframe: 'Permitting phase', priority: 'high' },
        ],
        successExample: 'Ambatovy Mine, Madagascar: Established 12,000-hectare conservation zone and species relocation program in partnership with community conservation groups.',
        expertHelpCta: 'Connect with a conservation biologist for an independent review',
      },
      high: {
        actions: [
          { stakeholder: 'community', title: 'Document local species and ecosystems', description: 'Create a community biodiversity inventory including species observations and traditional ecological knowledge.', timeframe: '3-6 months', priority: 'high' },
          { stakeholder: 'company', title: 'Develop a biodiversity offset plan', description: 'Create a measurable plan to achieve no net loss of biodiversity, including habitat restoration and species protection measures.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Require biodiversity management plan', description: 'Mandate a detailed plan with clear targets, monitoring protocols, and penalties for non-compliance as a permit condition.', timeframe: 'Permitting phase', priority: 'high' },
        ],
        successExample: 'QMM Mine, Madagascar: Established long-term conservation and reforestation program monitored by third-party biodiversity experts.',
      },
      medium: {
        actions: [
          { stakeholder: 'community', title: 'Participate in environmental surveys', description: 'Share local knowledge about wildlife patterns, important plant species, and ecologically sensitive areas with survey teams.', timeframe: '1-3 months', priority: 'medium' },
          { stakeholder: 'company', title: 'Conduct species surveys before clearing', description: 'Complete seasonal biodiversity surveys covering wet and dry periods before any vegetation clearing.', timeframe: 'Pre-construction', priority: 'medium' },
          { stakeholder: 'government', title: 'Include biodiversity conditions in permits', description: 'Set specific and measurable conditions for habitat protection and restoration in project approvals.', timeframe: 'Permitting phase', priority: 'medium' },
        ],
        successExample: 'Cerrejón Mine, Colombia: Community-led biological monitoring program trained local youth as wildlife monitors.',
      },
      low: {
        actions: [
          { stakeholder: 'community', title: 'Report unusual environmental changes', description: 'Keep records of any noticeable changes in local wildlife or plant health and report to environmental authorities.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'company', title: 'Follow standard biodiversity protocols', description: 'Implement industry-standard mitigation measures and publish regular monitoring reports.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'government', title: 'Monitor compliance with conditions', description: 'Schedule periodic inspections to verify biodiversity management commitments are being met.', timeframe: 'Annually', priority: 'low' },
        ],
      },
    },
    'community-displacement': {
      critical: {
        actions: [
          { stakeholder: 'community', title: 'Organize a unified community position', description: 'Bring together all affected households and villages to develop shared priorities and demands before any resettlement negotiations begin. Hire a community lawyer.', timeframe: '1-3 months', priority: 'high' },
          { stakeholder: 'community', title: 'Document land rights and livelihoods', description: 'Create a detailed inventory of all land holdings (formal and customary), housing, crops, businesses, and community infrastructure that would be affected.', timeframe: '2-4 months', priority: 'high' },
          { stakeholder: 'company', title: 'Follow IFC Performance Standard 5 on resettlement', description: 'Develop a Resettlement Action Plan that ensures improved or restored livelihoods, with fair compensation at full replacement cost.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Establish independent resettlement oversight', description: 'Appoint an independent monitor to oversee the resettlement process and ensure affected families receive promised compensation and support.', timeframe: 'Pre-permitting', priority: 'high' },
        ],
        successExample: 'Ahafo Mine, Ghana: Community negotiated a comprehensive resettlement agreement including replacement housing, livelihood restoration, and 10-year monitoring.',
        expertHelpCta: 'Connect with a resettlement specialist or community rights lawyer',
      },
      high: {
        actions: [
          { stakeholder: 'community', title: 'Form a community negotiation committee', description: 'Elect representatives from each affected area to negotiate collectively with the company on compensation and benefit-sharing.', timeframe: '1-2 months', priority: 'high' },
          { stakeholder: 'company', title: 'Develop a Community Development Agreement', description: 'Negotiate a binding agreement covering compensation, local employment, infrastructure improvements, and long-term benefit-sharing.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Require livelihood restoration plans', description: 'Mandate that permits include binding commitments to restore or improve livelihoods of all affected community members.', timeframe: 'Permitting phase', priority: 'high' },
        ],
        successExample: 'Ramu Nickel, PNG: Community Benefit Sharing Agreement ensures 2% of revenue goes directly to landowner groups.',
      },
      medium: {
        actions: [
          { stakeholder: 'community', title: 'Document baseline living conditions', description: 'Record current housing, income sources, and community services to establish a baseline for measuring future impacts.', timeframe: '2-4 months', priority: 'medium' },
          { stakeholder: 'company', title: 'Conduct social impact assessment', description: 'Commission a thorough study of potential direct and indirect impacts on livelihoods, services, and social cohesion.', timeframe: 'Pre-feasibility', priority: 'medium' },
          { stakeholder: 'government', title: 'Ensure community consultation records', description: 'Require companies to document and publish records of all community consultations with community sign-off on accuracy.', timeframe: 'Permitting phase', priority: 'medium' },
        ],
        successExample: 'Newmont Ahafo: Social Responsibility Forum established with community, company, and government representatives for ongoing dialogue.',
      },
      low: {
        actions: [
          { stakeholder: 'community', title: 'Stay engaged in project updates', description: 'Attend information sessions and monitor any project changes that could affect nearby communities.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'company', title: 'Maintain open communication channels', description: 'Provide regular project updates and accessible grievance mechanisms for community members.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'government', title: 'Monitor community wellbeing indicators', description: 'Track changes in local employment, housing, and service access near the project area.', timeframe: 'Annually', priority: 'low' },
        ],
      },
    },
    'indigenous-lands': {
      critical: {
        actions: [
          { stakeholder: 'community', title: 'Assert FPIC rights immediately', description: 'Formally notify the company and government that Free, Prior and Informed Consent is required. Document all traditional land use, sacred sites, and cultural practices tied to the project area.', timeframe: '1-2 months', priority: 'high' },
          { stakeholder: 'community', title: 'Engage indigenous rights legal support', description: 'Connect with indigenous rights organizations (e.g., IWGIA, Forest Peoples Programme) for legal guidance on land rights and FPIC processes.', timeframe: '1-3 months', priority: 'high' },
          { stakeholder: 'company', title: 'Halt activities until FPIC is obtained', description: 'Suspend all project activities on indigenous lands and begin a culturally appropriate consultation process led by indigenous leadership.', timeframe: 'Immediate', priority: 'high' },
          { stakeholder: 'government', title: 'Enforce FPIC requirements under national law', description: 'Ensure FPIC compliance as a mandatory permit condition, consistent with ILO Convention 169 and UNDRIP.', timeframe: 'Pre-permitting', priority: 'high' },
        ],
        successExample: 'Tampakan Project, Philippines: Indigenous communities successfully asserted FPIC rights, leading to project redesign with community-defined exclusion zones.',
        expertHelpCta: 'Connect with an indigenous rights specialist or FPIC facilitator',
      },
      high: {
        actions: [
          { stakeholder: 'community', title: 'Document traditional land use and sacred sites', description: 'Create a community-controlled cultural mapping of areas with ancestral significance, traditional resource use, and ceremonial sites.', timeframe: '2-4 months', priority: 'high' },
          { stakeholder: 'company', title: 'Engage qualified FPIC facilitators', description: 'Hire independent facilitators experienced in indigenous consultation to lead a meaningful consent process.', timeframe: 'Pre-feasibility', priority: 'high' },
          { stakeholder: 'government', title: 'Recognize customary land rights', description: 'Ensure that customary and ancestral land claims are recognized in the permitting process, even where formal titles may not exist.', timeframe: 'Permitting phase', priority: 'high' },
        ],
        successExample: 'Argyle Diamond Mine, Australia: Traditional Owner agreement included cultural heritage protections, employment targets, and revenue sharing.',
      },
      medium: {
        actions: [
          { stakeholder: 'community', title: 'Engage with the FPIC process', description: 'Participate actively in consultation processes and ensure all discussions are documented and translated into local languages.', timeframe: '2-4 months', priority: 'medium' },
          { stakeholder: 'company', title: 'Conduct cultural heritage assessment', description: 'Commission a heritage impact assessment with meaningful participation of indigenous knowledge holders.', timeframe: 'Pre-feasibility', priority: 'medium' },
          { stakeholder: 'government', title: 'Provide mediation support', description: 'Offer neutral mediation services to facilitate productive dialogue between indigenous communities and the project proponent.', timeframe: 'Permitting phase', priority: 'medium' },
        ],
        successExample: 'Voisey\'s Bay, Canada: Innu and Inuit Impact and Benefit Agreements included environmental monitoring roles and revenue sharing.',
      },
      low: {
        actions: [
          { stakeholder: 'community', title: 'Maintain cultural heritage records', description: 'Keep updated documentation of cultural practices and heritage sites that may be indirectly affected.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'company', title: 'Respect cultural exclusion zones', description: 'Maintain buffer zones around identified cultural and ceremonial sites.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'government', title: 'Monitor FPIC compliance', description: 'Periodically verify that ongoing operations respect the terms of any indigenous community agreements.', timeframe: 'Annually', priority: 'low' },
        ],
      },
    },
    'food-security': {
      critical: {
        actions: [
          { stakeholder: 'community', title: 'Map all agricultural land at risk', description: 'Create a detailed inventory of farmland, grazing areas, fisheries, and forest food sources within the project impact zone. Calculate the percentage of local food production affected.', timeframe: '2-4 months', priority: 'high' },
          { stakeholder: 'community', title: 'Demand agricultural protection guarantees', description: 'Insist that no productive agricultural land is converted without a binding replacement plan that ensures equivalent or improved food production capacity.', timeframe: '1-3 months', priority: 'high' },
          { stakeholder: 'company', title: 'Fund agricultural livelihood restoration', description: 'Establish a funded program to replace lost agricultural capacity through alternative land, irrigation, training, and market access support.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Protect food-producing land in zoning', description: 'Designate prime agricultural land as protected from conversion and require food security impact assessments before approving land use changes.', timeframe: 'Pre-permitting', priority: 'high' },
        ],
        successExample: 'Ok Tedi, PNG: Agricultural rehabilitation program replaced affected gardens with improved farming techniques, increasing food yields for 3,000 families.',
        expertHelpCta: 'Connect with a food security or agricultural development specialist',
      },
      high: {
        actions: [
          { stakeholder: 'community', title: 'Assess food security baseline', description: 'Document current food sources, nutrition levels, and food supply chains to measure any future changes.', timeframe: '2-4 months', priority: 'high' },
          { stakeholder: 'company', title: 'Minimize agricultural land conversion', description: 'Redesign the project footprint to avoid prime agricultural land and implement dust/contamination controls to protect crops on adjacent land.', timeframe: 'Pre-construction', priority: 'high' },
          { stakeholder: 'government', title: 'Require food security impact assessment', description: 'Mandate a detailed assessment of how the project will affect local food production, supply, and prices.', timeframe: 'Permitting phase', priority: 'high' },
        ],
        successExample: 'Lihir Gold Mine, PNG: Community agricultural program provided alternative food production areas and improved farming techniques.',
      },
      medium: {
        actions: [
          { stakeholder: 'community', title: 'Monitor agricultural impacts', description: 'Track any changes in crop yields, water availability for irrigation, or livestock health near the project area.', timeframe: 'Ongoing', priority: 'medium' },
          { stakeholder: 'company', title: 'Implement dust and contamination controls', description: 'Install measures to prevent mining dust and runoff from affecting nearby farmland and water sources used for agriculture.', timeframe: 'Pre-construction', priority: 'medium' },
          { stakeholder: 'government', title: 'Include agricultural protections in permits', description: 'Add conditions requiring regular monitoring of agricultural land quality and crop productivity near the mine site.', timeframe: 'Permitting phase', priority: 'medium' },
        ],
        successExample: 'Geita Gold Mine, Tanzania: Agricultural development program supported 2,000 smallholder farmers with improved seeds and techniques.',
      },
      low: {
        actions: [
          { stakeholder: 'community', title: 'Maintain food production records', description: 'Keep records of agricultural output and food sources as a reference for detecting future changes.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'company', title: 'Support local food systems', description: 'Source food for mine operations locally where possible and support agricultural development programs in surrounding communities.', timeframe: 'Ongoing', priority: 'low' },
          { stakeholder: 'government', title: 'Track regional food prices', description: 'Monitor food prices and availability in communities near mining operations to detect early signs of food insecurity.', timeframe: 'Annually', priority: 'low' },
        ],
      },
    },
  };

  return mitigationData[category]?.[level] ?? { actions: [] };
};

export const getRiskAssessments = (project: MiningProject): RiskAssessment[] => {
  const size = project.size ?? 'medium';
  const communityDistance = project.communityDistance ?? 'medium';
  const hasProtectedAreas = project.hasProtectedAreas ?? null;
  const waterSource = project.waterSource ?? 'unknown';

  const waterLevel: RiskAssessment['level'] = 'high';
  const biodiversityLevel: RiskAssessment['level'] = hasProtectedAreas ? 'critical' : 'medium';
  const displacementLevel: RiskAssessment['level'] = communityDistance === 'near' ? 'high' : 'medium';
  const indigenousLevel: RiskAssessment['level'] = 'high';
  const foodLevel: RiskAssessment['level'] = size === 'large' ? 'high' : 'medium';

  const baseRisks: RiskAssessment[] = [
    {
      category: 'water',
      level: waterLevel,
      title: 'Water Resource Depletion Risk',
      summary: 'Mining operations may significantly impact local water availability',
      details: `Based on hydrological modeling, the proposed ${project.mineralType} extraction could reduce groundwater levels by 15-30% within a 10km radius. This poses risks to local agriculture and community water access. Current water stress index shows the region is already experiencing moderate scarcity.`,
      dataSource: 'WRI Aqueduct 4.0 + Local Basin Study 2023',
      confidence: 'high',
      lastUpdated: '2024-01-15',
      mitigation: getMitigationForRisk('water', waterLevel),
    },
    {
      category: 'biodiversity',
      level: biodiversityLevel,
      title: 'Biodiversity and Habitat Impact',
      summary: hasProtectedAreas
        ? 'Project overlaps with protected areas and critical habitats'
        : 'Some endemic species habitats may be affected',
      details: hasProtectedAreas
        ? 'The project area overlaps with a Key Biodiversity Area (KBA) and is within 5km of a protected reserve. Three endangered species have been documented in the impact zone.'
        : 'While no protected areas directly overlap, the project may fragment wildlife corridors. Environmental assessment should include detailed species surveys.',
      dataSource: 'IBAT Alliance + National Environmental Registry',
      confidence: 'medium',
      lastUpdated: '2024-01-10',
      mitigation: getMitigationForRisk('biodiversity', biodiversityLevel),
    },
    {
      category: 'community-displacement',
      level: displacementLevel,
      title: 'Community Displacement Concerns',
      summary: communityDistance === 'near'
        ? 'Multiple communities within direct impact zone'
        : 'Indirect impacts on nearby communities likely',
      details: communityDistance === 'near'
        ? 'Approximately 1,200 households in 3 villages are within the proposed project footprint. Resettlement planning and fair compensation negotiations will be critical.'
        : 'While no direct displacement is anticipated, noise, dust, and traffic impacts will affect communities. Benefit-sharing agreements should be established.',
      dataSource: 'Community Mapping Initiative 2023',
      confidence: 'high',
      lastUpdated: '2024-01-20',
      mitigation: getMitigationForRisk('community-displacement', displacementLevel),
    },
    {
      category: 'indigenous-lands',
      level: indigenousLevel,
      title: 'Indigenous Territory Overlap',
      summary: 'Project area includes traditional indigenous lands',
      details: 'Historical and current maps indicate this area is part of traditional indigenous territory. Free, Prior, and Informed Consent (FPIC) processes must be initiated before any project activities. Local indigenous groups have ancestral ties and ongoing use of these lands for cultural practices.',
      dataSource: 'LandMark Indigenous Mapping + Local Records',
      confidence: 'high',
      lastUpdated: '2024-01-18',
      mitigation: getMitigationForRisk('indigenous-lands', indigenousLevel),
    },
    {
      category: 'food-security',
      level: foodLevel,
      title: 'Agricultural Land and Food Security',
      summary: 'Mining may impact local food production capacity',
      details: size === 'large'
        ? 'The project would convert approximately 2,000 hectares of agricultural land. This represents 15% of the district\'s arable land, potentially affecting food security for 5,000+ people.'
        : 'Some agricultural lands will be affected. Compensation should include support for alternative livelihoods and food security programs.',
      dataSource: 'Agricultural Census 2022 + Satellite Analysis',
      confidence: 'medium',
      lastUpdated: '2024-01-12',
      mitigation: getMitigationForRisk('food-security', foodLevel),
    }
  ];

  // Adjust risks based on specific mineral types
  if (project.mineralType === 'lithium' && waterSource !== 'unknown') {
    const waterRisk = baseRisks.find(r => r.category === 'water');
    if (waterRisk) {
      waterRisk.level = 'critical';
      waterRisk.details = 'Lithium extraction requires massive amounts of water (2 million liters per ton of lithium). In this arid region, this will severely impact water availability for communities and ecosystems. Alternative brine processing methods should be mandated.';
      waterRisk.mitigation = getMitigationForRisk('water', 'critical');
    }
  }

  return baseRisks;
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
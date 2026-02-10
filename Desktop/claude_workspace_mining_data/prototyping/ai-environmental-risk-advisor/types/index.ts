export type MineralType = 'copper' | 'nickel' | 'lithium' | 'cobalt';

export type ProjectStage = 
  | 'exploration' 
  | 'feasibility' 
  | 'environmental-assessment'
  | 'permitting' 
  | 'construction';

export type ProjectSize = 'small' | 'medium' | 'large';

export type WaterSource = 'groundwater' | 'surface' | 'both' | 'unknown';

export type CommunityDistance = 'near' | 'medium' | 'far';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskCategory = 
  | 'water'
  | 'biodiversity'
  | 'community-displacement'
  | 'indigenous-lands'
  | 'food-security';

export interface MiningProject {
  id: string;
  mineralType: MineralType;
  stage?: ProjectStage;
  location: {
    country: string;
    region: string;
    nearestCity: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  size?: ProjectSize;
  waterSource?: WaterSource;
  communityDistance?: CommunityDistance;
  hasProtectedAreas?: boolean | null;
  companyName?: string;
  projectName?: string;
}

export interface RiskAssessment {
  category: RiskCategory;
  level: RiskLevel;
  title: string;
  summary: string;
  details: string;
  dataSource: string;
  confidence: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface ProjectPhase {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  estimatedDate: string;
  description: string;
  communityActions: string[];
  documentsNeeded: string[];
  rights: string[];
}

export interface TechnicalDocument {
  id: string;
  title: string;
  type: 'water-quality' | 'eia' | 'geological' | 'social-impact';
  technicalContent: string;
  simplifiedContent: string;
  keyConcerns: string[];
  recommendations: string[];
}
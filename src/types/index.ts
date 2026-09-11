export interface Scheme {
  name: string;
  description: string;
  matchPercentage: number;
  eligibilityFactors: string[];
  documents: string[];
  missingRequirements: string[];
}

export interface TrendingItem {
  name: string;
  trend: 'UP' | 'DOWN';
  reason: string;
}

export interface RealityCheckScores {
  demand: number;
  competition: number;
  infra: number;
  risk: number;
  overall?: number;
}

export interface UserProfile {
  hasBusiness: boolean | null;
  businessIdea: string;
  location: string;
  capital: string;
  infrastructure: string;
  experience: string;
}

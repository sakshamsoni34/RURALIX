'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Scheme, TrendingItem, RealityCheckScores, UserProfile } from '../types';

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  customers: number;
  setCustomers: (customers: number) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (isOpen: boolean) => void;
  schemes: Scheme[];
  setSchemes: (schemes: Scheme[]) => void;
  trendingItems: TrendingItem[];
  setTrendingItems: (items: TrendingItem[]) => void;
  realityScores: RealityCheckScores;
  setRealityScores: (scores: RealityCheckScores) => void;
  isLoaded: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultUserProfile: UserProfile = {
  hasBusiness: null,
  businessIdea: '',
  location: '',
  capital: '',
  infrastructure: '',
  experience: ''
};

const defaultRealityScores: RealityCheckScores = {
  demand: 82,
  competition: 65,
  infra: 88,
  risk: 32,
  overall: 78
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [realityScores, setRealityScores] = useState<RealityCheckScores>(defaultRealityScores);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount to prevent SSR hydration mismatch
  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('ruralix_user_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      const savedScores = localStorage.getItem('ruralix_reality_scores');
      if (savedScores) {
        setRealityScores(JSON.parse(savedScores));
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage on change only after initial hydration load
  React.useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ruralix_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to save userProfile to localStorage:', e);
    }
  }, [userProfile, isLoaded]);

  const [customers, setCustomers] = useState(25);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  
  const [schemes, setSchemes] = useState<Scheme[]>([
    {
      name: "PMEGP (Prime Minister's Employment Gen.)",
      description: "Subsidy up to 35% for rural businesses",
      matchPercentage: 92,
      eligibilityFactors: ["Location Eligible", "Business Type Eligible"],
      documents: [],
      missingRequirements: []
    },
    {
      name: "MUDRA Loan (Shishu/Kishor)",
      description: "Collateral-free loan up to ₹10 lakh",
      matchPercentage: 85,
      eligibilityFactors: ["Easy Process", "Rural Focused"],
      documents: [],
      missingRequirements: []
    }
  ]);
  
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([
    { name: "Packaging & Supplies", trend: "UP", reason: "Rising local commercial demand" },
    { name: "Seasonal Goods", trend: "UP", reason: "Approaching market cycle" }
  ]);

  React.useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ruralix_reality_scores', JSON.stringify(realityScores));
    } catch (e) {}
  }, [realityScores, isLoaded]);

  return (
    <DashboardContext.Provider value={{
      activeTab, setActiveTab,
      userProfile, setUserProfile,
      customers, setCustomers,
      isVoiceModalOpen, setIsVoiceModalOpen,
      schemes, setSchemes,
      trendingItems, setTrendingItems,
      realityScores, setRealityScores,
      isLoaded,
      isMenuOpen, setIsMenuOpen
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ruralix_user_profile');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Failed to load userProfile from localStorage:', e);
      }
    }
    return {
      hasBusiness: null,
      businessIdea: '',
      location: '',
      capital: '',
      infrastructure: '',
      experience: ''
    };
  });

  // Sync to localStorage on change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ruralix_user_profile', JSON.stringify(userProfile));
      } catch (e) {
        console.error('Failed to save userProfile to localStorage:', e);
      }
    }
  }, [userProfile]);

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
  
  const [realityScores, setRealityScores] = useState<RealityCheckScores>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ruralix_reality_scores');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      demand: 82,
      competition: 65,
      infra: 88,
      risk: 32,
      overall: 78
    };
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ruralix_reality_scores', JSON.stringify(realityScores));
      } catch (e) {}
    }
  }, [realityScores]);

  return (
    <DashboardContext.Provider value={{
      activeTab, setActiveTab,
      userProfile, setUserProfile,
      customers, setCustomers,
      isVoiceModalOpen, setIsVoiceModalOpen,
      schemes, setSchemes,
      trendingItems, setTrendingItems,
      realityScores, setRealityScores
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

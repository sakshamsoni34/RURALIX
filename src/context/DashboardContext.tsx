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
  const [userProfile, setUserProfile] = useState<UserProfile>({
    hasBusiness: null,
    businessIdea: '',
    location: '',
    capital: '',
    infrastructure: '',
    experience: ''
  });
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
  
  const [realityScores, setRealityScores] = useState<RealityCheckScores>({
    demand: 82,
    competition: 65,
    infra: 88,
    risk: 32,
    overall: 78
  });

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

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
  voiceInitialQuery: string;
  setVoiceInitialQuery: (query: string) => void;
  openVoiceAssistantWithQuery: (query: string) => void;
  schemes: Scheme[];
  setSchemes: (schemes: Scheme[]) => void;
  trendingItems: TrendingItem[];
  setTrendingItems: (items: TrendingItem[]) => void;
  realityScores: RealityCheckScores;
  setRealityScores: (scores: RealityCheckScores) => void;
  isLoaded: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDashboardUnlocked: boolean;
  setIsDashboardUnlocked: (unlocked: boolean) => void;
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
  demand: 0,
  competition: 0,
  infra: 0,
  risk: 0,
  overall: 0
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState('ai-recommendation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [realityScores, setRealityScores] = useState<RealityCheckScores>(defaultRealityScores);
  const [isDashboardUnlocked, setIsDashboardUnlockedState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('ruralix_active_tab', tab);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {}
  };

  const setIsDashboardUnlocked = (unlocked: boolean) => {
    setIsDashboardUnlockedState(unlocked);
    try {
      localStorage.setItem('ruralix_dashboard_unlocked', unlocked ? 'true' : 'false');
    } catch (e) {}
  };

  // Load from localStorage on client mount to prevent SSR hydration mismatch
  React.useEffect(() => {
    try {
      const savedProfileStr = localStorage.getItem('ruralix_user_profile');
      let parsedProfile: UserProfile = defaultUserProfile;
      if (savedProfileStr) {
        parsedProfile = JSON.parse(savedProfileStr);
        setUserProfile(parsedProfile);
      }

      setIsDashboardUnlockedState(true);

      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const urlTab = urlParams ? urlParams.get('tab') : null;

      const savedTab = localStorage.getItem('ruralix_active_tab');
      const validTabs = ['ai-recommendation', 'reality-check', 'demand'];
      if (urlTab && validTabs.includes(urlTab)) {
        setActiveTabState(urlTab);
      } else if (savedTab && validTabs.includes(savedTab)) {
        setActiveTabState(savedTab);
      } else {
        setActiveTabState('ai-recommendation');
      }

      const savedScores = localStorage.getItem('ruralix_reality_scores');
      if (savedScores) {
        setRealityScores(JSON.parse(savedScores));
      }
      const savedCustomers = localStorage.getItem('ruralix_customers');
      if (savedCustomers) {
        setCustomers(Number(savedCustomers));
      }
      const savedSchemes = localStorage.getItem('ruralix_schemes');
      if (savedSchemes) {
        setSchemes(JSON.parse(savedSchemes));
      }
      const savedTrending = localStorage.getItem('ruralix_trending_items');
      if (savedTrending) {
        setTrendingItems(JSON.parse(savedTrending));
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

  const [customers, setCustomers] = useState<number>(0);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceInitialQuery, setVoiceInitialQuery] = useState('');

  const openVoiceAssistantWithQuery = (query: string) => {
    setVoiceInitialQuery(query);
    setIsVoiceModalOpen(true);
  };

  const setSchemes = (newSchemes: Scheme[]) => {
    setSchemesState(newSchemes);
    try {
      localStorage.setItem('ruralix_schemes', JSON.stringify(newSchemes));
    } catch (e) {}
  };
  const [schemes, setSchemesState] = useState<Scheme[]>([]);

  const setTrendingItems = (newTrending: TrendingItem[]) => {
    setTrendingItemsState(newTrending);
    try {
      localStorage.setItem('ruralix_trending_items', JSON.stringify(newTrending));
    } catch (e) {}
  };
  const [trendingItems, setTrendingItemsState] = useState<TrendingItem[]>([]);

  const setRealityScoresWrapper = (newScores: RealityCheckScores) => {
    setRealityScores(newScores);
    try {
      localStorage.setItem('ruralix_reality_scores', JSON.stringify(newScores));
    } catch (e) {}
  };

  return (
    <DashboardContext.Provider value={{
      activeTab,
      setActiveTab,
      userProfile,
      setUserProfile,
      customers,
      setCustomers,
      isVoiceModalOpen,
      setIsVoiceModalOpen,
      voiceInitialQuery,
      setVoiceInitialQuery,
      openVoiceAssistantWithQuery,
      schemes,
      setSchemes,
      trendingItems,
      setTrendingItems,
      realityScores,
      setRealityScores: setRealityScoresWrapper,
      isLoaded,
      isMenuOpen,
      setIsMenuOpen,
      isDashboardUnlocked,
      setIsDashboardUnlocked
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

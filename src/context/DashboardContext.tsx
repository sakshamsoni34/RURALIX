'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Scheme, TrendingItem, RealityCheckScores, UserProfile } from '../types';

export interface ToastInfo {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
}

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string, forced?: boolean) => void;
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
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'info' | 'warning' | 'success') => void;
  clearToast: () => void;
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

const VALID_TABS = ['dashboard', 'ai-recommendation', 'reality-check', 'demand', 'map', 'help', 'schemes'];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState('ai-recommendation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [realityScores, setRealityScores] = useState<RealityCheckScores>(defaultRealityScores);
  const [isDashboardUnlocked, setIsDashboardUnlockedState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const clearToast = () => setToast(null);

  const showToast = (message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(current => current && current.id === id ? null : current);
    }, 4500);
  };

  const setActiveTab = (tab: string, forced: boolean = false) => {
    let targetTab = tab;

    // Rule 1: 'map', 'help', and 'schemes' are ALWAYS accessible anytime
    if (targetTab === 'map' || targetTab === 'help' || targetTab === 'schemes') {
      setActiveTabState(targetTab);
      try {
        localStorage.setItem('ruralix_active_tab', targetTab);
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('tab', targetTab);
          window.history.pushState({}, '', url.toString());
        }
      } catch (e) {}
      return;
    }

    // Check current state or localStorage fallback to handle immediate sequential clicks
    const profile = userProfile?.businessIdea?.trim() ? userProfile : (() => {
      try {
        const saved = localStorage.getItem('ruralix_user_profile');
        return saved ? JSON.parse(saved) : userProfile;
      } catch {
        return userProfile;
      }
    })();

    const scores = (realityScores?.overall && realityScores.overall > 0) ? realityScores : (() => {
      try {
        const saved = localStorage.getItem('ruralix_reality_scores');
        return saved ? JSON.parse(saved) : realityScores;
      } catch {
        return realityScores;
      }
    })();

    const trending = (trendingItems && trendingItems.length > 0) ? trendingItems : (() => {
      try {
        const saved = localStorage.getItem('ruralix_trending_items');
        return saved ? JSON.parse(saved) : trendingItems;
      } catch {
        return trendingItems;
      }
    })();

    const isStep1Done = Boolean(profile?.businessIdea?.trim());
    const isStep2Done = Boolean(scores?.overall && scores.overall > 0);
    const isStep3Done = Boolean(trending && trending.length > 0);

    // Rule 2: Gating for Step 2 (Reality Check)
    if (!forced && targetTab === 'reality-check' && !isStep1Done) {
      targetTab = 'ai-recommendation';
      showToast('Please complete Step 1 (AI Business Planner) first before running Reality Check.', 'warning');
    }

    // Rule 3: Gating for Step 3 (Demand Predictor)
    if (!forced && targetTab === 'demand') {
      if (!isStep1Done) {
        targetTab = 'ai-recommendation';
        showToast('Please complete Step 1 (AI Business Planner) first before forecasting Demand.', 'warning');
      } else if (!isStep2Done) {
        targetTab = 'reality-check';
        showToast('Please complete Step 2 (Reality Check) first before forecasting Demand.', 'warning');
      }
    }

    // Rule 4: Gating for Dashboard - ONLY accessible after Step 1, Step 2, AND Step 3!
    if (!forced && targetTab === 'dashboard') {
      if (!isStep1Done) {
        targetTab = 'ai-recommendation';
        showToast('Please complete Step 1 (AI Business Planner) first to begin unlocking your Dashboard.', 'warning');
      } else if (!isStep2Done) {
        targetTab = 'reality-check';
        showToast('Please complete Step 2 (Reality Check) first to continue unlocking your Dashboard.', 'warning');
      } else if (!isStep3Done) {
        targetTab = 'demand';
        showToast('Please complete Step 3 (Demand Predictor) to finish unlocking your Dashboard.', 'warning');
      }
    }

    if (!VALID_TABS.includes(targetTab)) {
      targetTab = 'ai-recommendation';
    }

    setActiveTabState(targetTab);
    try {
      localStorage.setItem('ruralix_active_tab', targetTab);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', targetTab);
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
      let hasIdea = false;
      if (savedProfileStr) {
        parsedProfile = JSON.parse(savedProfileStr);
        setUserProfile(parsedProfile);
        hasIdea = Boolean(parsedProfile?.businessIdea?.trim());
      }

      const savedScoresStr = localStorage.getItem('ruralix_reality_scores');
      let parsedScores: RealityCheckScores = defaultRealityScores;
      let hasScores = false;
      if (savedScoresStr) {
        parsedScores = JSON.parse(savedScoresStr);
        setRealityScores(parsedScores);
        hasScores = Boolean(parsedScores?.overall && parsedScores.overall > 0);
      }

      const savedTrendingStr = localStorage.getItem('ruralix_trending_items');
      let hasTrending = false;
      if (savedTrendingStr) {
        const parsedTrending = JSON.parse(savedTrendingStr);
        setTrendingItemsState(parsedTrending);
        hasTrending = Boolean(parsedTrending && parsedTrending.length > 0);
      }

      const isAll3Done = hasIdea && hasScores && hasTrending;
      setIsDashboardUnlockedState(isAll3Done);

      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const urlTab = urlParams ? urlParams.get('tab') : null;
      const savedTab = localStorage.getItem('ruralix_active_tab');

      let initialTab = 'ai-recommendation';
      const candidateTab = (urlTab && VALID_TABS.includes(urlTab)) ? urlTab : ((savedTab && VALID_TABS.includes(savedTab)) ? savedTab : 'ai-recommendation');

      // Opportunity map, Help, and Schemes can be loaded anytime
      if (candidateTab === 'map' || candidateTab === 'help' || candidateTab === 'schemes') {
        initialTab = candidateTab;
      } else if (candidateTab === 'dashboard') {
        initialTab = isAll3Done ? 'dashboard' : (!hasIdea ? 'ai-recommendation' : (!hasScores ? 'reality-check' : 'demand'));
      } else if (candidateTab === 'demand') {
        initialTab = (hasIdea && hasScores) ? 'demand' : (!hasIdea ? 'ai-recommendation' : 'reality-check');
      } else if (candidateTab === 'reality-check') {
        initialTab = hasIdea ? 'reality-check' : 'ai-recommendation';
      } else {
        initialTab = 'ai-recommendation';
      }

      setActiveTabState(initialTab);

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
      setIsDashboardUnlocked,
      toast,
      showToast,
      clearToast
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

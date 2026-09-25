'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  AlertTriangle, 
  Check, 
  Info, 
  X, 
  ArrowRight,
  TrendingUp,
  Target,
  BarChart3,
  Compass
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import HorizontalStepper from '../../components/dashboard/HorizontalStepper';
import styles from './page.module.css';

import KpiCards from '../../components/dashboard/KpiCards';
import SimulatorWidget from '../../components/dashboard/widgets/SimulatorWidget';
import LoanReadinessWidget from '../../components/dashboard/widgets/LoanReadinessWidget';
import CashFlowWidget from '../../components/dashboard/widgets/CashFlowWidget';
import WeatherWidget from '../../components/dashboard/widgets/WeatherWidget';

import AdvisoryModal from '../../components/AdvisoryModal';
import RealityCheckModal from '../../components/RealityCheckModal';
import DemandPredictorModal from '../../components/DemandPredictorModal';
import OpportunityMap from '../../components/OpportunityMap';
import HelpSupportSection from '../../components/dashboard/HelpSupportSection';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import ChatbotWidget from '../../components/ChatbotWidget';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    activeTab, 
    setActiveTab,
    userProfile,
    realityScores,
    trendingItems,
    isVoiceModalOpen, 
    setIsVoiceModalOpen,
    voiceInitialQuery,
    setTrendingItems,
    setRealityScores,
    toast,
    clearToast
  } = useDashboard();

  useEffect(() => {
    if (activeTab === 'schemes' || tabParam === 'schemes') {
      router.push('/government-schemes');
    }
  }, [activeTab, tabParam, router]);

  const isStep1Done = mounted && Boolean(userProfile?.businessIdea?.trim());
  const isStep2Done = mounted && Boolean(realityScores?.overall && realityScores.overall > 0);
  const isStep3Done = mounted && Boolean(trendingItems && trendingItems.length > 0);
  const isDashboardUnlocked = isStep1Done && isStep2Done && isStep3Done;



  return (
    <div className={styles.container}>
      {/* Toast Notification Alert */}
      {toast && (
        <div 
          className={`
            ${styles.toastContainer} 
            ${toast.type === 'warning' ? styles.toastWarning : toast.type === 'success' ? styles.toastSuccess : styles.toastInfo}
          `}
        >
          {toast.type === 'warning' && <AlertTriangle size={18} color="#d97706" />}
          {toast.type === 'success' && <Check size={18} color="#059669" />}
          {toast.type === 'info' && <Info size={18} color="#2563eb" />}
          <span>{toast.message}</span>
          <button 
            type="button"
            onClick={clearToast} 
            className={styles.toastCloseBtn}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <Sidebar />

      <main className={styles.mainWrapper}>
        <Header />

        <div className={styles.content}>
          
          {/* Horizontal 3-Step Visualizer: Visible only during the 3-Step Enterprise Formulation */}
          {['ai-recommendation', 'reality-check', 'demand'].includes(activeTab) && (
            <HorizontalStepper />
          )}

          {/* TAB 1: FULL DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && isDashboardUnlocked && (
            <div style={{ display: 'block' }}>
              {/* Hero Banner */}
              <div className={styles.hero}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <Image src="/dashboard-hero.jpg" alt="Rural Entrepreneur" fill style={{ objectFit: 'cover' }} priority />
                </div>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                  <p>{userProfile.hasBusiness ? "Welcome to your active enterprise hub!" : "Welcome back, Entrepreneur!"}</p>
                  <h1 style={{ fontSize: userProfile.businessIdea ? '2.1rem' : '2.5rem' }}>
                    {userProfile.businessIdea ? `Your ${userProfile.businessIdea} Hub` : "Rural Enterprise Hub"}
                  </h1>
                  <div className={styles.heroQuote}>
                    "छोटे कदम, बड़ी सफलता की ओर"
                  </div>
                  <p style={{ marginTop: '0.5rem', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                    Location: <strong>{userProfile.location || 'Local Area'}</strong> • Capital: <strong>₹{userProfile.capital || '1,50,000'}</strong>
                  </p>
                </div>
              </div>

              {/* KPI Metrics */}
              <KpiCards />

              {/* Interactive Enterprise Management Widgets */}
              <div className={styles.mainGrid}>
                <div className={styles.leftCol}>
                  <SimulatorWidget />
                  <LoanReadinessWidget />
                </div>

                <div className={styles.rightCol}>
                  <CashFlowWidget />
                  <WeatherWidget />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI BUSINESS PLANNER (Step 1) */}
          <div style={{ display: activeTab === 'ai-recommendation' ? 'block' : 'none' }}>
            <AdvisoryModal isOpen={true} onClose={() => {}} inline={true} />
          </div>

          {/* TAB 3: REALITY CHECK (Step 2) */}
          <div style={{ display: activeTab === 'reality-check' ? 'block' : 'none' }}>
            <RealityCheckModal isOpen={true} onClose={() => {}} onCheckComplete={setRealityScores} inline={true} />
          </div>

          {/* TAB 4: DEMAND PREDICTOR (Step 3) */}
          <div style={{ display: activeTab === 'demand' ? 'block' : 'none' }}>
            <DemandPredictorModal isOpen={true} onClose={() => {}} onPredictionComplete={setTrendingItems} inline={true} />
          </div>

          {/* TAB 5: OPPORTUNITY MAPS */}
          <div style={{ display: activeTab === 'map' ? 'block' : 'none' }}>
            {activeTab === 'map' && (
              <OpportunityMap location={userProfile.location || "Bhind, Madhya Pradesh"} />
            )}
          </div>

          {/* TAB 6: HELP & SUPPORT */}
          <div style={{ display: activeTab === 'help' ? 'block' : 'none' }}>
            {activeTab === 'help' && (
              <HelpSupportSection />
            )}
          </div>

        </div>
      </main>
      
      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen}
        initialQuery={voiceInitialQuery}
        onClose={() => setIsVoiceModalOpen(false)}
      />
      <ChatbotWidget />
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          height: '100vh', 
          width: '100vw', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'var(--background)', 
          color: 'var(--text-main)', 
          fontSize: '1.1rem',
          fontWeight: 600
        }}>
          Loading GrameenSathi Enterprise Studio...
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </DashboardProvider>
  );
}

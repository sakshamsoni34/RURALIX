'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Check, 
  Lightbulb, 
  Target, 
  BarChart3, 
  ChevronRight,
  Lock
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import styles from './page.module.css';

import AdvisoryModal from '../../components/AdvisoryModal';
import RealityCheckModal from '../../components/RealityCheckModal';
import DemandPredictorModal from '../../components/DemandPredictorModal';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import ChatbotWidget from '../../components/ChatbotWidget';

function DashboardContent() {
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
    setRealityScores
  } = useDashboard();

  const isStep1Done = mounted && Boolean(userProfile?.businessIdea?.trim());
  const isStep2Done = mounted && Boolean(realityScores?.overall && realityScores.overall > 0);
  const isStep3Done = mounted && Boolean(trendingItems && trendingItems.length > 0);

  // Sync tab from URL search param and ensure user always stays within valid steps
  useEffect(() => {
    const validTabs = ['ai-recommendation', 'reality-check', 'demand'];
    if (tabParam && validTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    } else if (!validTabs.includes(activeTab)) {
      setActiveTab('ai-recommendation');
    }
  }, [tabParam, activeTab]);

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainWrapper}>
        <Header />

        <div className={styles.content}>
          {/* 3-Step Enterprise Launchpad Hub Bar */}
          <div className={styles.moduleHubContainer} suppressHydrationWarning>
            <div className={styles.moduleHubTop}>
              <div className={styles.hubTitleGroup}>
                <div className={styles.hubBadge}>
                  <Sparkles size={13} />
                  <span>3-Step Enterprise Launchpad</span>
                </div>
                <h2 className={styles.hubHeading}>
                  {activeTab === 'ai-recommendation' && 'Step 1: AI Business Plan Studio'}
                  {activeTab === 'reality-check' && 'Step 2: Feasibility & Reality Diagnostics'}
                  {activeTab === 'demand' && 'Step 3: Market Demand & Inventory Forecast'}
                  {!['ai-recommendation', 'reality-check', 'demand'].includes(activeTab) && 'AI Business Plan Studio'}
                </h2>
              </div>

              {mounted && userProfile?.businessIdea && (
                <div 
                  className={styles.activeIdeaPill} 
                  onClick={() => setActiveTab('ai-recommendation')} 
                  title="Click to modify business plan"
                  suppressHydrationWarning
                >
                  <span className={styles.ideaPillDot}></span>
                  <span className={styles.ideaPillLabel}>Active Focus:</span>
                  <strong className={styles.ideaPillText} suppressHydrationWarning>{userProfile.businessIdea}</strong>
                </div>
              )}
            </div>

            {/* Visual 3-Step Connected Progression */}
            <div className={styles.stepperWrapper}>
              {/* Step 1: AI Business Planner */}
              <button 
                type="button" 
                onClick={() => setActiveTab('ai-recommendation')}
                className={`${styles.stepItem} ${activeTab === 'ai-recommendation' ? styles.stepItemActive : ''} ${isStep1Done ? styles.stepItemCompleted : ''}`}
                suppressHydrationWarning
              >
                <div className={`${styles.stepCircle} ${activeTab === 'ai-recommendation' ? styles.stepCircleActive : isStep1Done ? styles.stepCircleCompleted : styles.stepCircleUpcoming}`}>
                  {isStep1Done ? <Check size={18} /> : '1'}
                </div>
                <div className={styles.stepInfo}>
                  <div className={styles.stepTagRow}>
                    <span className={styles.stepTag}>Step 1</span>
                    {isStep1Done && <span className={styles.stepBadgePill}>Selected</span>}
                  </div>
                  <h3 className={styles.stepTitle}>AI Business Planner</h3>
                  <span className={styles.stepSubtitle}>Model & Capital</span>
                </div>
              </button>

              {/* Connector 1 -> 2 */}
              <div className={`${styles.stepConnector} ${isStep1Done ? styles.stepConnectorActive : ''}`}>
                <ChevronRight size={22} />
              </div>

              {/* Step 2: Reality Check */}
              <button 
                type="button" 
                onClick={() => {
                  if (isStep1Done) {
                    setActiveTab('reality-check');
                  }
                }}
                disabled={!isStep1Done}
                title={!isStep1Done ? 'Complete Step 1 (AI Business Planner) first to unlock' : 'Feasibility & Reality Diagnostics'}
                className={`${styles.stepItem} ${activeTab === 'reality-check' ? styles.stepItemActive : ''} ${isStep2Done ? styles.stepItemCompleted : ''} ${!isStep1Done ? styles.stepItemLocked : ''}`}
                suppressHydrationWarning
              >
                <div className={`${styles.stepCircle} ${activeTab === 'reality-check' ? styles.stepCircleActive : !isStep1Done ? styles.stepCircleLocked : isStep2Done ? styles.stepCircleCompleted : styles.stepCircleUpcoming}`}>
                  {!isStep1Done ? <Lock size={15} /> : isStep2Done ? <Check size={18} /> : '2'}
                </div>
                <div className={styles.stepInfo}>
                  <div className={styles.stepTagRow}>
                    <span className={styles.stepTag}>Step 2</span>
                    {isStep2Done && <span className={styles.stepBadgePill}>{realityScores.overall}% Viability</span>}
                  </div>
                  <h3 className={styles.stepTitle}>Reality Check</h3>
                  <span className={styles.stepSubtitle}>Risk & Stress-Testing</span>
                </div>
              </button>

              {/* Connector 2 -> 3 */}
              <div className={`${styles.stepConnector} ${isStep2Done ? styles.stepConnectorActive : ''}`}>
                <ChevronRight size={22} />
              </div>

              {/* Step 3: Demand Predictor */}
              <button 
                type="button" 
                onClick={() => {
                  if (isStep2Done) {
                    setActiveTab('demand');
                  }
                }}
                disabled={!isStep2Done}
                title={!isStep2Done ? 'Complete Step 2 (Reality Check) first to unlock' : 'Market Demand & Stocking Forecast'}
                className={`${styles.stepItem} ${activeTab === 'demand' ? styles.stepItemActive : ''} ${isStep3Done ? styles.stepItemCompleted : ''} ${!isStep2Done ? styles.stepItemLocked : ''}`}
                suppressHydrationWarning
              >
                <div className={`${styles.stepCircle} ${activeTab === 'demand' ? styles.stepCircleActive : !isStep2Done ? styles.stepCircleLocked : isStep3Done ? styles.stepCircleCompleted : styles.stepCircleUpcoming}`}>
                  {!isStep2Done ? <Lock size={15} /> : isStep3Done ? <Check size={18} /> : '3'}
                </div>
                <div className={styles.stepInfo}>
                  <div className={styles.stepTagRow}>
                    <span className={styles.stepTag}>Step 3</span>
                    {isStep3Done && <span className={styles.stepBadgePill}>Predicted</span>}
                  </div>
                  <h3 className={styles.stepTitle}>Demand Predictor</h3>
                  <span className={styles.stepSubtitle}>Market & Inventory Forecast</span>
                </div>
              </button>
            </div>
          </div>

          {/* Step 1 Component */}
          <div style={{ display: activeTab === 'ai-recommendation' ? 'block' : 'none' }}>
            <AdvisoryModal isOpen={true} onClose={() => {}} inline={true} />
          </div>

          {/* Step 2 Component */}
          <div style={{ display: activeTab === 'reality-check' ? 'block' : 'none' }}>
            <RealityCheckModal isOpen={true} onClose={() => {}} onCheckComplete={setRealityScores} inline={true} />
          </div>

          {/* Step 3 Component */}
          <div style={{ display: activeTab === 'demand' ? 'block' : 'none' }}>
            <DemandPredictorModal isOpen={true} onClose={() => {}} onPredictionComplete={setTrendingItems} inline={true} />
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
      <Suspense fallback={<div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', color: 'var(--text-main)', fontSize: '1.1rem' }}>Loading GrameenSathi...</div>}>
        <DashboardContent />
      </Suspense>
    </DashboardProvider>
  );
}

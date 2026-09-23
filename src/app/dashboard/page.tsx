'use client';

import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import KpiCards from '../../components/dashboard/KpiCards';
import SimulatorWidget from '../../components/dashboard/widgets/SimulatorWidget';
import LoanReadinessWidget from '../../components/dashboard/widgets/LoanReadinessWidget';
import CashFlowWidget from '../../components/dashboard/widgets/CashFlowWidget';
import WeatherWidget from '../../components/dashboard/widgets/WeatherWidget';

import Image from 'next/image';
import styles from './page.module.css';

import AdvisoryModal from '../../components/AdvisoryModal';
import RealityCheckModal from '../../components/RealityCheckModal';
import SchemeMatcherModal from '../../components/SchemeMatcherModal';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import DemandPredictorModal from '../../components/DemandPredictorModal';
import OpportunityMap from '../../components/OpportunityMap';
import AIBusinessMentorModal from '../../components/AIBusinessMentorModal';
import OnboardingModal from '../../components/OnboardingModal';
import ChatbotWidget from '../../components/ChatbotWidget';

function DashboardContent() {
  const { 
    activeTab, 
    userProfile,
    isVoiceModalOpen, setIsVoiceModalOpen,
    setSchemes,
    setTrendingItems,
    setRealityScores
  } = useDashboard();

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainWrapper}>
        <Header />

        <div className={styles.content}>
          <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
            <div className={styles.hero}>
              <div style={{position: 'absolute', inset: 0, zIndex: 0}}>
                <Image src="/dashboard-hero.jpg" alt="Farmer" fill style={{objectFit: 'cover'}} priority />
              </div>
              <div className={styles.heroOverlay}></div>
              <div className={styles.heroContent}>
                <p>{userProfile.hasBusiness ? "Welcome to your dashboard!" : "Welcome back,"}</p>
                <h1 style={{ fontSize: userProfile.businessIdea ? '2rem' : '2.5rem' }}>
                  {userProfile.businessIdea ? `Your ${userProfile.businessIdea} Journey` : "Entrepreneur!"}
                </h1>
                <div className={styles.heroQuote}>
                  "छोटे कदम, बड़ी सफलता की ओर"
                </div>
                <p style={{marginTop: '0.5rem', color: 'var(--text-main)'}}>Let's grow your business, together.</p>
              </div>
            </div>

            <KpiCards />

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

          <div style={{ display: activeTab === 'ai-recommendation' ? 'block' : 'none' }}>
            <AdvisoryModal isOpen={true} onClose={() => {}} inline={true} />
          </div>
          <div style={{ display: activeTab === 'reality-check' ? 'block' : 'none' }}>
            <RealityCheckModal isOpen={true} onClose={() => {}} onCheckComplete={setRealityScores} inline={true} />
          </div>
          <div style={{ display: activeTab === 'schemes' ? 'block' : 'none', height: '100%' }}>
            <SchemeMatcherModal isOpen={true} onClose={() => {}} onMatchComplete={setSchemes} inline={true} />
          </div>
          <div style={{ display: activeTab === 'demand' ? 'block' : 'none' }}>
            <DemandPredictorModal isOpen={true} onClose={() => {}} onPredictionComplete={setTrendingItems} inline={true} />
          </div>
          <div style={{ display: activeTab === 'mentor' ? 'block' : 'none' }}>
            <AIBusinessMentorModal isOpen={true} onClose={() => {}} inline={true} />
          </div>
          <div style={{ display: activeTab === 'map' ? 'block' : 'none' }}>
            {activeTab === 'map' && (
              <OpportunityMap location={userProfile.location || "Bhind, Madhya Pradesh"} />
            )}
          </div>

        </div>
      </main>
      
      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
      <OnboardingModal />
      <ChatbotWidget />
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}

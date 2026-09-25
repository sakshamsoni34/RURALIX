'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Lightbulb, 
  Target, 
  BarChart3, 
  Sprout,
  Lock,
  Check,
  Sparkles
} from 'lucide-react';
import styles from '../../app/dashboard/page.module.css';
import { useDashboard } from '../../context/DashboardContext';

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    isMenuOpen, 
    setIsMenuOpen,
    userProfile,
    realityScores,
    trendingItems
  } = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isStep1Done = mounted && Boolean(userProfile?.businessIdea?.trim());
  const isStep2Done = mounted && Boolean(realityScores?.overall && realityScores.overall > 0);
  const isStep3Done = mounted && Boolean(trendingItems && trendingItems.length > 0);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    if (pathname !== '/dashboard') {
      router.push(`/dashboard?tab=${tab}`);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`${styles.drawerOverlay} ${isMenuOpen ? styles.drawerOverlayOpen : ''}`} 
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Hamburger Slide-over Drawer */}
      <aside 
        className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ''}`}
        aria-label="Navigation drawer"
      >
        <div className={styles.drawerHeader}>
          <div 
            className={styles.logo} 
            onClick={() => handleSelectTab('ai-recommendation')}
            style={{ cursor: 'pointer' }}
          >
            <Sprout size={28} color="#10b981" />
            <span>Grameen<span style={{ color: '#10b981' }}>Sathi</span></span>
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem 0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={12} color="#10b981" />
          <span>Enterprise Planning Journey</span>
        </div>

        <nav className={styles.nav}>
          {/* Step 1 */}
          <button 
            type="button"
            onClick={() => handleSelectTab('ai-recommendation')} 
            className={`${styles.navItem} ${activeTab === 'ai-recommendation' ? styles.navItemActive : ''}`}
          >
            <Lightbulb size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase' }}>Step 1</span>
              <span>AI Business Planner</span>
            </div>
            {isStep1Done && <Check size={16} color="#10b981" />}
          </button>

          {/* Step 2 */}
          <button 
            type="button"
            onClick={() => {
              if (isStep1Done) {
                handleSelectTab('reality-check');
              }
            }} 
            disabled={!isStep1Done}
            title={!isStep1Done ? 'Complete Step 1 (AI Business Planner) first' : 'Feasibility & Reality Diagnostics'}
            className={`${styles.navItem} ${activeTab === 'reality-check' ? styles.navItemActive : ''} ${!isStep1Done ? styles.navItemLocked : ''}`}
            style={{ opacity: !isStep1Done ? 0.45 : 1, cursor: !isStep1Done ? 'not-allowed' : 'pointer' }}
          >
            <Target size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase' }}>Step 2</span>
              <span>Reality Check & Risk</span>
            </div>
            {!isStep1Done ? (
              <Lock size={15} color="rgba(255,255,255,0.4)" />
            ) : isStep2Done ? (
              <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                {realityScores.overall}%
              </span>
            ) : null}
          </button>

          {/* Step 3 */}
          <button 
            type="button"
            onClick={() => {
              if (isStep2Done) {
                handleSelectTab('demand');
              }
            }} 
            disabled={!isStep2Done}
            title={!isStep2Done ? 'Complete Step 2 (Reality Check) first' : 'Market Demand & Stocking Forecast'}
            className={`${styles.navItem} ${activeTab === 'demand' ? styles.navItemActive : ''} ${!isStep2Done ? styles.navItemLocked : ''}`}
            style={{ opacity: !isStep2Done ? 0.45 : 1, cursor: !isStep2Done ? 'not-allowed' : 'pointer' }}
          >
            <BarChart3 size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase' }}>Step 3</span>
              <span>Demand Predictor</span>
            </div>
            {!isStep2Done ? (
              <Lock size={15} color="rgba(255,255,255,0.4)" />
            ) : isStep3Done ? (
              <Check size={16} color="#10b981" />
            ) : null}
          </button>
        </nav>

        <div className={styles.sidebarIllustration}>
          <Sprout size={30} style={{margin: '0 auto 8px', color: '#10b981'}} />
          <h4>3-Step Enterprise Pipeline</h4>
          <p>Plan • Stress-Test • Forecast</p>
        </div>
      </aside>
    </>
  );
}

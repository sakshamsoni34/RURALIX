'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Lightbulb, 
  Target, 
  BarChart3, 
  Compass,
  HelpCircle,
  Sprout,
  Lock,
  Check,
  X,
  Sparkles,
  ShieldAlert,
  Landmark
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
    trendingItems,
    showToast
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

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    if (pathname !== '/dashboard') {
      router.push(`/dashboard?tab=${tab}`);
    }
  };

  const isDashboardAccessible = isStep1Done && isStep2Done && isStep3Done;

  // Handler 1: Dashboard
  const handleDashboardClick = () => {
    if (!isStep1Done) {
      showToast('Please complete Step 1 (AI Business Planner) to begin unlocking your Dashboard.', 'warning');
      navigateToTab('ai-recommendation');
    } else if (!isStep2Done) {
      showToast('Please complete Step 2 (Reality Check) to continue unlocking your Dashboard.', 'warning');
      navigateToTab('reality-check');
    } else if (!isStep3Done) {
      showToast('Please complete Step 3 (Demand Predictor) to finish unlocking your Dashboard.', 'warning');
      navigateToTab('demand');
    } else {
      navigateToTab('dashboard');
    }
  };

  // Handler 2: AI Business Planner
  const handleAIBusinessPlannerClick = () => {
    navigateToTab('ai-recommendation');
  };

  // Handler 3: Reality Check
  const handleRealityCheckClick = () => {
    if (!isStep1Done) {
      showToast('Please complete Step 1 (AI Business Planner) first before running Reality Check.', 'warning');
      navigateToTab('ai-recommendation');
    } else {
      navigateToTab('reality-check');
    }
  };

  // Handler 4: Demand Predictor
  const handleDemandPredictorClick = () => {
    if (!isStep1Done) {
      showToast('Please complete Step 1 (AI Business Planner) first before forecasting Demand.', 'warning');
      navigateToTab('ai-recommendation');
    } else if (!isStep2Done) {
      showToast('Please complete Step 2 (Reality Check) first before forecasting Demand.', 'warning');
      navigateToTab('reality-check');
    } else {
      navigateToTab('demand');
    }
  };

  // Handler 5: Opportunity Maps (Available anytime on dedicated page)
  const handleOpportunityMapsClick = () => {
    setIsMenuOpen(false);
    router.push('/opportunity-map');
  };

  // Handler 6: Government Schemes & Subsidies (Available anytime on dedicated page)
  const handleGovernmentSchemesClick = () => {
    setIsMenuOpen(false);
    router.push('/government-schemes');
  };

  // Handler 7: Help & Resources (Available anytime)
  const handleHelpClick = () => {
    navigateToTab('help');
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
            onClick={handleAIBusinessPlannerClick}
            style={{ cursor: 'pointer' }}
          >
            <Sprout size={28} color="#10b981" />
            <span>Grameen<span style={{ color: '#10b981' }}>Sathi</span></span>
          </div>
          <button 
            type="button"
            className={styles.closeDrawerBtn}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ 
          padding: '1rem 1.5rem 0.5rem', 
          color: 'rgba(255,255,255,0.6)', 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem' 
        }}>
          <Sparkles size={13} color="#10b981" />
          <span>Enterprise Menu</span>
        </div>

        <nav className={styles.nav}>
          {/* 1. Dashboard */}
          <button 
            type="button"
            onClick={handleDashboardClick}
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`}
            title={!isDashboardAccessible ? 'Complete Steps 1, 2, and 3 to unlock Dashboard' : 'Open Dashboard'}
            style={{ opacity: !isDashboardAccessible ? 0.75 : 1 }}
          >
            <LayoutDashboard size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Overview</span>
              <span>1. Dashboard</span>
            </div>
            {!isDashboardAccessible ? (
              <span title="Locked - Complete Steps 1-3 to unlock" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                <Lock size={12} color="#fca5a5" /> Locked
              </span>
            ) : (
              <Check size={16} color="#10b981" />
            )}
          </button>

          {/* 2. AI Business Planner */}
          <button 
            type="button"
            onClick={handleAIBusinessPlannerClick} 
            className={`${styles.navItem} ${activeTab === 'ai-recommendation' ? styles.navItemActive : ''}`}
          >
            <Lightbulb size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Step 1 • Model & Capital</span>
              <span>2. AI Business Planner</span>
            </div>
            {isStep1Done && <Check size={16} color="#10b981" />}
          </button>

          {/* 3. Reality Check */}
          <button 
            type="button"
            onClick={handleRealityCheckClick} 
            className={`${styles.navItem} ${activeTab === 'reality-check' ? styles.navItemActive : ''}`}
            title={!isStep1Done ? 'Complete Step 1 (AI Business Planner) first to unlock Reality Check' : 'Feasibility & Reality Diagnostics'}
            style={{ opacity: !isStep1Done ? 0.75 : 1 }}
          >
            <Target size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Step 2 • Risk Analysis</span>
              <span>3. Reality Check</span>
            </div>
            {!isStep1Done ? (
              <span title="Locked - Complete Step 1 First" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                <Lock size={12} color="#fca5a5" /> Locked
              </span>
            ) : isStep2Done ? (
              <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                {realityScores.overall}%
              </span>
            ) : null}
          </button>

          {/* 4. Demand Predictor */}
          <button 
            type="button"
            onClick={handleDemandPredictorClick} 
            className={`${styles.navItem} ${activeTab === 'demand' ? styles.navItemActive : ''}`}
            title={!isStep2Done ? 'Complete Step 2 (Reality Check) first to unlock Demand Predictor' : 'Market Demand & Stocking Forecast'}
            style={{ opacity: !isStep2Done ? 0.75 : 1 }}
          >
            <BarChart3 size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Step 3 • Market Forecast</span>
              <span>4. Demand Predictor</span>
            </div>
            {!isStep2Done ? (
              <span title="Locked - Complete Steps 1 & 2 First" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                <Lock size={12} color="#fca5a5" /> Locked
              </span>
            ) : isStep3Done ? (
              <Check size={16} color="#10b981" />
            ) : null}
          </button>

          {/* 5. Opportunity Maps (Anytime) */}
          <button 
            type="button"
            onClick={handleOpportunityMapsClick} 
            className={`${styles.navItem} ${pathname === '/opportunity-map' || activeTab === 'map' ? styles.navItemActive : ''}`}
            title="Interactive Local Map & Commercial Shops (Accessible Anytime)"
          >
            <Compass size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Geospatial GIS • Always Open</span>
              <span>5. Opportunity Maps</span>
            </div>
          </button>

          {/* 6. Govt Schemes & Subsidies (Anytime) */}
          <button 
            type="button"
            onClick={handleGovernmentSchemesClick} 
            className={`${styles.navItem} ${pathname === '/government-schemes' || activeTab === 'schemes' ? styles.navItemActive : ''}`}
            title="Central & State Schemes, Subsidies & Direct Application (Accessible Anytime)"
          >
            <Landmark size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Subsidies & Grants • Always Open</span>
              <span>6. Govt Schemes</span>
            </div>
          </button>

          {/* 7. Help & Resources (Anytime) */}
          <button 
            type="button"
            onClick={handleHelpClick} 
            className={`${styles.navItem} ${activeTab === 'help' ? styles.navItemActive : ''}`}
            title="Helplines, Contact Us, and FAQs (Accessible Anytime)"
            style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.9rem' }}
          >
            <HelpCircle size={20} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Support & Contact • Always Open</span>
              <span>7. Help & Resources</span>
            </div>
          </button>
        </nav>

        <div className={styles.sidebarIllustration}>
          <Sprout size={28} style={{margin: '0 auto 6px', color: '#10b981'}} />
          <h4>Empowering Rural India</h4>
          <p>Plan • Stress-Test • Forecast • Scale</p>
        </div>
      </aside>
    </>
  );
}

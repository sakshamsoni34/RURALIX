'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Target, 
  BarChart3, 
  BrainCircuit,
  Map as MapIcon,
  Sprout,
  Mic,
  X,
  Building2,
  Compass
} from 'lucide-react';
import styles from '../../app/dashboard/page.module.css';
import { useDashboard } from '../../context/DashboardContext';

function LandmarkIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

export default function Sidebar() {
  const { activeTab, setActiveTab, isMenuOpen, setIsMenuOpen, setIsVoiceModalOpen } = useDashboard();
  const router = useRouter();
  const pathname = usePathname();

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
      router.push('/dashboard');
    }
  };

  const handleOpenVoice = () => {
    setIsVoiceModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
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
            onClick={() => handleSelectTab('dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <Sprout size={28} color="#10b981" />
            <span>Grameen<span style={{ color: '#10b981' }}>Sathi</span></span>
          </div>
          <button 
            className={styles.closeDrawerBtn}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <button 
            onClick={() => handleSelectTab('dashboard')} 
            className={`${styles.navItem} ${pathname === '/dashboard' && activeTab === 'dashboard' ? styles.navItemActive : ''}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          <button 
            onClick={() => handleNavigate('/existing-business')} 
            className={`${styles.navItem} ${pathname === '/existing-business' ? styles.navItemActive : ''}`}
          >
            <Building2 size={20} /> My Business Hub
          </button>

          <button 
            onClick={handleOpenVoice} 
            className={styles.navItem} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mic size={20} color="var(--primary)" /> Voice Assistant (आवाज़)
            </div>
            <span style={{ fontSize: '0.68rem', background: 'rgba(5, 150, 105, 0.12)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>LIVE</span>
          </button>
          <button 
            onClick={() => handleSelectTab('ai-recommendation')} 
            className={`${styles.navItem} ${activeTab === 'ai-recommendation' ? styles.navItemActive : ''}`}
          >
            <Lightbulb size={20} /> AI Business Recommendation
          </button>
          <button 
            onClick={() => handleSelectTab('reality-check')} 
            className={`${styles.navItem} ${activeTab === 'reality-check' ? styles.navItemActive : ''}`}
          >
            <Target size={20} /> Reality Check
          </button>
          <button 
            onClick={() => handleSelectTab('schemes')} 
            className={`${styles.navItem} ${activeTab === 'schemes' ? styles.navItemActive : ''}`}
          >
            <LandmarkIcon size={20} /> Government Schemes
          </button>
          <button 
            onClick={() => handleSelectTab('demand')} 
            className={`${styles.navItem} ${activeTab === 'demand' ? styles.navItemActive : ''}`}
          >
            <BarChart3 size={20} /> Demand Predictor
          </button>
          <button 
            onClick={() => handleSelectTab('mentor')} 
            className={`${styles.navItem} ${activeTab === 'mentor' ? styles.navItemActive : ''}`}
          >
            <BrainCircuit size={20} /> Continuous AI Mentor
          </button>
          <button 
            onClick={() => handleSelectTab('map')} 
            className={`${styles.navItem} ${activeTab === 'map' ? styles.navItemActive : ''}`}
          >
            <MapIcon size={20} /> Market Opportunity Map
          </button>

          <button 
            onClick={() => handleNavigate('/onboarding')} 
            className={`${styles.navItem} ${pathname === '/onboarding' ? styles.navItemActive : ''}`}
            style={{ marginTop: '0.5rem', opacity: 0.85, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem' }}
          >
            <Compass size={20} /> Change Path (Onboarding)
          </button>
        </nav>

        <div className={styles.sidebarIllustration}>
          <Sprout size={30} style={{margin: '0 auto 8px', color: '#10b981'}} />
          <h4>Stronger Businesses<br/>Brighter Villages</h4>
          <p>Empowering Rural India</p>
        </div>
      </aside>
    </>
  );
}

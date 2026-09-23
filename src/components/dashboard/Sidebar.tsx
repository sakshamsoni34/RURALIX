'use client';

import { 
  LayoutDashboard, 
  Lightbulb, 
  Target, 
  BarChart3, 
  BrainCircuit,
  Sprout,
  Mic
} from 'lucide-react';
import styles from '../../app/dashboard/page.module.css';
import { useDashboard } from '../../context/DashboardContext';

function LandmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
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
  const { activeTab, setActiveTab, setIsVoiceModalOpen } = useDashboard();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Sprout size={28} />
        Grameen<span>Sathi</span>
      </div>
      <nav className={styles.nav}>
        <button onClick={() => setActiveTab('dashboard')} className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`} style={{border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', background: activeTab === 'dashboard' ? '#fff' : 'transparent', cursor: 'pointer'}}>
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button onClick={() => setIsVoiceModalOpen(true)} className={styles.navItem} style={{border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mic size={20} color="var(--primary)" /> Voice Assistant (आवाज़)
          </div>
          <span style={{ fontSize: '0.68rem', background: 'rgba(5, 150, 105, 0.12)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>LIVE</span>
        </button>
        <button onClick={() => setActiveTab('ai-recommendation')} className={`${styles.navItem} ${activeTab === 'ai-recommendation' ? styles.navItemActive : ''}`} style={{border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', background: activeTab === 'ai-recommendation' ? '#fff' : 'transparent', cursor: 'pointer'}}>
          <Lightbulb size={20} /> AI Business Recommendation
        </button>
        <button onClick={() => setActiveTab('reality-check')} className={`${styles.navItem} ${activeTab === 'reality-check' ? styles.navItemActive : ''}`} style={{border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', background: activeTab === 'reality-check' ? '#fff' : 'transparent', cursor: 'pointer'}}>
          <Target size={20} /> Reality Check
        </button>
        <button onClick={() => setActiveTab('schemes')} className={`${styles.navItem} ${activeTab === 'schemes' ? styles.navItemActive : ''}`} style={{border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', background: activeTab === 'schemes' ? '#fff' : 'transparent', cursor: 'pointer'}}>
          <LandmarkIcon size={20} /> Government Schemes
        </button>
        <button onClick={() => setActiveTab('demand')} className={`${styles.navItem} ${activeTab === 'demand' ? styles.navItemActive : ''}`} style={{border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', background: activeTab === 'demand' ? '#fff' : 'transparent', cursor: 'pointer'}}>
          <BarChart3 size={20} /> Demand Predictor
        </button>
        <button onClick={() => setActiveTab('mentor')} className={`${styles.navItem} ${activeTab === 'mentor' ? styles.navItemActive : ''}`} style={{border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', background: activeTab === 'mentor' ? '#fff' : 'transparent', cursor: 'pointer'}}>
          <BrainCircuit size={20} /> Continuous AI Mentor
        </button>
      </nav>
      <div className={styles.sidebarIllustration}>
        <Sprout size={32} style={{margin: '0 auto 10px'}} />
        <h4>Stronger Businesses<br/>Brighter Villages</h4>
        <p>Empowering Rural India</p>
      </div>
    </aside>
  );
}

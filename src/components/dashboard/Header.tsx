'use client';

import { Search, Mic, MapPin, Bell } from 'lucide-react';
import styles from '../../app/dashboard/page.module.css';
import { useDashboard } from '../../context/DashboardContext';

export default function Header() {
  const { setIsVoiceModalOpen } = useDashboard();

  return (
    <header className={styles.header}>
      <div style={{display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '600px', alignItems: 'center'}}>
        <div className={styles.searchBar} style={{flex: 1, maxWidth: 'none', margin: 0}}>
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Ask anything... (e.g. 'Is dairy good here?')" />
        </div>
        <button 
          onClick={() => setIsVoiceModalOpen(true)}
          style={{background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)', transition: 'transform 0.2s'}}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Mic size={20} />
        </button>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.locationBadge}>
          <MapPin size={16} /> Bhind, Madhya Pradesh
        </div>
        <div className={styles.notification}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </div>
        <div className={styles.profile}>
          <div className={styles.avatarInfo}>
            <div className={styles.avatarText} style={{textAlign: 'right'}}>
              <h4>Ramesh Kumar</h4>
              <p>Dairy Business</p>
            </div>
            <div className={styles.avatar}>R</div>
          </div>
        </div>
      </div>
    </header>
  );
}

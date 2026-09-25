'use client';

import { useState, useEffect } from 'react';
import { Search, Mic, MapPin, Bell, LogOut, Briefcase, IndianRupee, Menu, Sprout } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../../app/dashboard/page.module.css';
import { useDashboard } from '../../context/DashboardContext';

export default function Header() {
  const { 
    setIsVoiceModalOpen, 
    openVoiceAssistantWithQuery, 
    userProfile, 
    setIsMenuOpen, 
    setActiveTab
  } = useDashboard();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (searchText.trim()) {
      openVoiceAssistantWithQuery(searchText.trim());
      setSearchText('');
    } else {
      setIsVoiceModalOpen(true);
    }
  };

  const displayLocation = mounted && userProfile.location ? userProfile.location : 'Location Not Set';
  const displayIdea = mounted && userProfile.businessIdea ? userProfile.businessIdea : 'No Idea Selected';

  return (
    <header className={styles.header}>
      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flex: 1, maxWidth: '780px' }}>
        <button 
          onClick={() => setIsMenuOpen(prev => !prev)}
          className={styles.hamburgerBtn}
          aria-label="Toggle navigation menu"
          title="Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div 
          className={styles.brandTitle}
          onClick={() => {
            const hasIdea = Boolean(userProfile?.businessIdea?.trim());
            const target = hasIdea ? 'dashboard' : 'ai-recommendation';
            setActiveTab(target);
            router.push(`/dashboard?tab=${target}`);
          }}
          title="GrameenSathi - Rural Business Guide"
          style={{ cursor: 'pointer' }}
        >
          <Sprout size={24} color="#059669" />
          <span>Grameen<strong>Sathi</strong></span>
        </div>

        <div className={styles.searchBar} style={{ flex: 1, margin: 0 }}>
          <Search size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={handleSearchSubmit} />
          <input 
            type="text" 
            placeholder="Ask anything... (e.g. 'Dairy business profit', 'Mudra loan')" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        <button 
          onClick={() => {
            if (searchText.trim()) {
              openVoiceAssistantWithQuery(searchText.trim());
              setSearchText('');
            } else {
              setIsVoiceModalOpen(true);
            }
          }}
          style={{
            background: 'var(--primary)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '42px', 
            height: '42px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            cursor: 'pointer', 
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)', 
            transition: 'transform 0.2s',
            flexShrink: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Voice Assistant"
        >
          <Mic size={20} />
        </button>
      </div>

      <div className={styles.headerActions}>
        <button 
          className={styles.locationBadge}
          onClick={() => {
            router.push('/opportunity-map');
          }}
          title="Open Village Opportunity Map"
          style={{ cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'inherit' }}
          suppressHydrationWarning
        >
          <MapPin size={16} /> <span suppressHydrationWarning>{displayLocation}</span>
        </button>

        <div className={styles.notification}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </div>
        
        <div className={styles.profile} style={{ position: 'relative' }}>
          <div 
            className={styles.avatarInfo} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.avatarText} style={{ textAlign: 'right' }} suppressHydrationWarning>
              <h4>User Profile</h4>
              <p suppressHydrationWarning>{displayIdea}</p>
            </div>
            <div className={styles.avatar}>U</div>
          </div>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              width: '280px',
              padding: '1rem',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.25rem' }}>Your Business Profile</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>View and manage your business details.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }} suppressHydrationWarning>
                <Briefcase size={16} color="var(--primary)" />
                <strong>Idea:</strong> <span suppressHydrationWarning>{mounted && userProfile.businessIdea ? userProfile.businessIdea : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }} suppressHydrationWarning>
                <MapPin size={16} color="var(--primary)" />
                <strong>Location:</strong> <span suppressHydrationWarning>{mounted && userProfile.location ? userProfile.location : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }} suppressHydrationWarning>
                <IndianRupee size={16} color="var(--primary)" />
                <strong>Capital:</strong> <span suppressHydrationWarning>₹{mounted && userProfile.capital ? userProfile.capital : '0'}</span>
              </div>

              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push('/existing-business');
                }}
                style={{
                  marginTop: '0.25rem',
                  width: '100%',
                  padding: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'var(--primary-glow)',
                  color: 'var(--primary-dark)',
                  border: '1px solid rgba(5, 150, 105, 0.2)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <Briefcase size={15} />
                Edit Business Details
              </button>

              <button 
                onClick={handleSignOut}
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--accent-red)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

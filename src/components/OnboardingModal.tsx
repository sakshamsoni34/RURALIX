'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, Lightbulb } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function OnboardingModal() {
  const router = useRouter();
  const { userProfile, setUserProfile, setActiveTab, isLoaded } = useDashboard();

  // If not loaded yet from localStorage or user already completed onboarding, don't show
  if (!isLoaded || userProfile.hasBusiness !== null) return null;

  const handleHaveBusiness = () => {
    router.push('/have-business');
  };

  const handleNoBusiness = () => {
    setUserProfile(prev => ({ ...prev, hasBusiness: false }));
    setActiveTab('ai-recommendation');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '620px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: 800 }}>
            Welcome to GrameenSathi!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.5 }}>
            To tailor your financial roadmap and AI diagnostic advisory, tell us where you are in your journey:
          </p>
          
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <button 
              type="button"
              onClick={handleHaveBusiness}
              style={{
                display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem',
                background: 'var(--background)', border: '2px solid var(--primary)', 
                borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                color: 'var(--text-main)', textAlign: 'left'
              }}
            >
              <div style={{ background: 'var(--primary-glow)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', flexShrink: 0 }}>
                <Briefcase size={30} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', fontWeight: 700 }}>I already have a business / idea</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Open full dedicated page to enter details, test feasibility, and get subsidy schemes.</p>
              </div>
            </button>

            <button 
              type="button"
              onClick={handleNoBusiness}
              style={{
                display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem',
                background: 'var(--background)', border: '2px solid var(--border)', 
                borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                color: 'var(--text-main)', textAlign: 'left'
              }}
            >
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-orange)', flexShrink: 0 }}>
                <Lightbulb size={30} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', fontWeight: 700 }}>I need a business idea</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Open idea generator to explore hyper-local micro-enterprises for your area.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

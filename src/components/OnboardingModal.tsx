'use client';

import { useState } from 'react';
import { Briefcase, Lightbulb, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../context/DashboardContext';

export default function OnboardingModal() {
  const router = useRouter();
  const { userProfile, setUserProfile, setActiveTab, isLoaded } = useDashboard();
  const [step, setStep] = useState<'initial' | 'manual'>('initial');
  
  // Local state for manual business entry
  const [formData, setFormData] = useState({
    businessIdea: '',
    location: '',
    capital: '',
    infrastructure: '',
    experience: ''
  });

  // If not loaded yet from localStorage or user already completed onboarding, don't show
  if (!isLoaded || userProfile.hasBusiness !== null) return null;

  const handleNoBusiness = () => {
    // They don't have a business, want an AI recommendation
    setUserProfile(prev => ({ ...prev, hasBusiness: false }));
    setActiveTab('ai-recommendation');
  };

  const handleSelectExisting = () => {
    setUserProfile(prev => ({ ...prev, hasBusiness: true }));
    router.push('/existing-business');
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      hasBusiness: true,
      ...formData
    });
    // Go to dashboard with the data saved
    setActiveTab('dashboard');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: '16px', padding: '2.5rem',
        width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {step === 'initial' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Welcome to GrameenSathi!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              To give you the best experience, we need to know where you are in your journey.
            </p>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <button 
                onClick={() => setStep('manual')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem',
                  background: 'var(--background)', border: '1px solid var(--primary)', 
                  borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  color: 'var(--text-main)', textAlign: 'left'
                }}
              >
                <div style={{ background: 'var(--primary-glow)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                  <Briefcase size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>I already have a business / idea</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Enter your details to track progress and get reality checks.</p>
                </div>
              </button>

              <button 
                onClick={handleNoBusiness}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem',
                  background: 'var(--background)', border: '1px solid var(--border)', 
                  borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  color: 'var(--text-main)', textAlign: 'left'
                }}
              >
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-orange)' }}>
                  <Lightbulb size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>I need a business idea</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Let our AI recommend hyper-local businesses for your area.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'manual' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={24} color="var(--primary)" /> Tell us about your business
            </h2>
            <form onSubmit={handleSaveManual} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Business Idea / Name</label>
                <input required type="text" placeholder="e.g., Dairy Farming" value={formData.businessIdea} onChange={e => setFormData({...formData, businessIdea: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Location</label>
                  <input required type="text" placeholder="e.g., Satara, MH" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Available Capital (₹)</label>
                  <input required type="number" placeholder="e.g., 50000" value={formData.capital} onChange={e => setFormData({...formData, capital: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Infrastructure Available</label>
                  <input required type="text" placeholder="e.g., 24/7 Electricity, own shop" value={formData.infrastructure} onChange={e => setFormData({...formData, infrastructure: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Experience</label>
                  <input required type="text" placeholder="e.g., 2 years in retail" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setStep('initial')} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>Back</button>
                <button type="submit" style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>Save & Continue <ArrowRight size={18} /></button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

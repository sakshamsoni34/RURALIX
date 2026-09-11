'use client';

import { useState } from 'react';
import { 
  X, 
  Sprout, 
  MapPin, 
  IndianRupee, 
  Lightbulb, 
  Zap,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import styles from './AdvisoryModal.module.css';
import { useDashboard } from '../context/DashboardContext';

interface AdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

interface AdvisoryResult {
  recommendation: string;
  viabilityScore: number;
  analysis: string;
  actionSteps: string[];
}

const POPULAR_LOCATIONS = [
  'Delhi, India',
  'Bhopal, MP',
  'Satara, Maharashtra',
  'Bhind, MP',
  'Jaipur, Rajasthan',
  'Patna, Bihar',
  'Pune, Maharashtra',
  'Indore, MP'
];

const CAPITAL_PRESETS = [
  { label: '₹50,000 (Micro)', value: '50000' },
  { label: '₹1,50,000 (Small)', value: '150000' },
  { label: '₹3,00,000 (Medium)', value: '300000' },
  { label: '₹8,00,000+ (Commercial)', value: '800000' }
];

const SECTOR_TAGS = [
  '🛒 Retail & Supermart',
  '🌾 Agri & Cold Storage',
  '🚚 Logistics & Delivery Point',
  '💻 Digital & CSC Services',
  '🛠️ Hardware & Tools',
  '🏭 Processing & Flour Mill'
];

const INFRASTRUCTURE_TAGS = [
  '⚡ 24/7 Power Supply',
  '🚛 Highway & Road Access',
  '🏪 Own Commercial Shop',
  '💧 Water & Borewell',
  '📶 4G/5G Internet'
];

export default function AdvisoryModal({ isOpen, onClose, inline = false }: AdvisoryModalProps) {
  const { setUserProfile, setActiveTab } = useDashboard();
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  
  const [formData, setFormData] = useState({
    location: '',
    capital: '',
    interests: '',
    infrastructure: ''
  });

  const [result, setResult] = useState<AdvisoryResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!res.ok) throw new Error('Failed to fetch address');
        const data = await res.json();
        
        const address = data.address;
        const place = address.village || address.town || address.city || address.county || '';
        const state = address.state || '';
        const finalLocation = [place, state, 'India'].filter(Boolean).join(', ');
        
        setFormData(prev => ({ ...prev, location: finalLocation || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
      } catch (err) {
        console.error(err);
        alert('Failed to detect exact address, please enter manually.');
      } finally {
        setIsDetecting(false);
      }
    }, () => {
      alert('Unable to retrieve your location. Please check your browser permissions.');
      setIsDetecting(false);
    });
  };

  const handleTagToggle = (field: 'interests' | 'infrastructure', tag: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(tag)) {
        const updated = current.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim();
        return { ...prev, [field]: updated };
      } else {
        const updated = current ? `${current}, ${tag}` : tag;
        return { ...prev, [field]: updated };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    try {
      const response = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setResult(data);
      setStep('result');
    } catch (error) {
      setStep('input');
      alert('Failed to generate business plan. Please try again.');
    }
  };

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.modal} ${inline ? styles.inlineModal : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badge}>
            <Sparkles size={13} /> AI Hyper-Local GIS Engine
          </div>
          <h2 className={styles.title}>
            <Sprout color="#059669" size={26} />
            AI Business Recommendation & Viability
          </h2>
          <p className={styles.subtitle}>
            Discover high-margin, market-verified business opportunities tailored to your regional demographics and capital.
          </p>
        </div>
        {!inline && (
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        )}
      </div>

      <div className={styles.content}>
        {step === 'input' && (
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* 1. Location Section */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <MapPin size={17} color="#059669" />
                  Target Location / Village / City
                </label>
                <button 
                  type="button" 
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className={styles.locationDetectBtn}
                >
                  <MapPin size={13} />
                  {isDetecting ? 'Detecting GPS...' : 'Auto-Detect Location'}
                </button>
              </div>

              <div className={styles.inputWrapper}>
                <MapPin size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., Satara, Maharashtra or Delhi, India"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>

              {/* Location Suggestions */}
              <div className={styles.chipGroup}>
                {POPULAR_LOCATIONS.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.location === loc ? styles.chipActive : ''}`}
                    onClick={() => setFormData({ ...formData, location: loc })}
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Capital Section */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <IndianRupee size={17} color="#059669" />
                  Available Working Capital (₹)
                </label>
                <span className={styles.helperText}>
                  ✨ Eligible for up to 35% PMEGP / MUDRA Govt Subsidies
                </span>
              </div>

              <div className={styles.inputWrapper}>
                <IndianRupee size={18} className={styles.inputIcon} />
                <input 
                  type="number" 
                  className={styles.input}
                  placeholder="e.g., 150000"
                  value={formData.capital}
                  onChange={(e) => setFormData({...formData, capital: e.target.value})}
                  required
                />
              </div>

              {/* Capital Presets */}
              <div className={styles.chipGroup}>
                {CAPITAL_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.capital === preset.value ? styles.chipActive : ''}`}
                    onClick={() => setFormData({ ...formData, capital: preset.value })}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Assets & Sector Interests */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <Lightbulb size={17} color="#059669" />
                  Assets, Background & Preferred Sectors
                </label>
                <span className={styles.helperText}>Select multiple or type details</span>
              </div>

              {/* Sector Tags */}
              <div className={styles.chipGroup} style={{ marginBottom: '0.4rem' }}>
                {SECTOR_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.interests.includes(tag) ? styles.chipActive : ''}`}
                    onClick={() => handleTagToggle('interests', tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <input 
                type="text" 
                className={`${styles.input} ${styles.inputNoIcon}`}
                placeholder="e.g., Have 2 acres commercial land, 500 sq ft shop front, interested in cold supply"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                required
              />
            </div>

            {/* 4. Infrastructure & Capabilities */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <Zap size={17} color="#059669" />
                  Available Infrastructure & Utilities
                </label>
                <span className={styles.helperText}>Select available assets</span>
              </div>

              {/* Infrastructure Tags */}
              <div className={styles.chipGroup} style={{ marginBottom: '0.4rem' }}>
                {INFRASTRUCTURE_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.infrastructure.includes(tag) ? styles.chipActive : ''}`}
                    onClick={() => handleTagToggle('infrastructure', tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <input 
                type="text" 
                className={`${styles.input} ${styles.inputNoIcon}`}
                placeholder="e.g., 24/7 3-phase electricity, good heavy transport road connectivity"
                value={formData.infrastructure}
                onChange={(e) => setFormData({...formData, infrastructure: e.target.value})}
                required
              />
            </div>

            {/* Submit Action */}
            <button type="submit" className={styles.submitBtn}>
              <BrainCircuit size={22} />
              Generate Hyper-Local Business Plan & Viability Report
            </button>
          </form>
        )}

        {/* Loading State */}
        {step === 'loading' && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <h3 className={styles.loadingTitle}>
              Synthesizing Demographics & GIS Analytics...
            </h3>
            <p className={styles.loadingText}>
              Evaluating market voids, consumer purchasing power, transport access, and commercial viability for <strong>{formData.location || 'your area'}</strong>...
            </p>
          </div>
        )}

        {/* Results Screen */}
        {step === 'result' && result && (
          <div className={styles.resultContainer}>
            {/* Hero Result Banner */}
            <div className={styles.resultHeroCard}>
              <div className={styles.resultHeroDetails}>
                <h3>✨ Top Recommended Enterprise</h3>
                <h2>{result.recommendation}</h2>
                <p>📍 Optimized for {formData.location} with ₹{Number(formData.capital).toLocaleString('en-IN')} working capital</p>
              </div>

              <div className={styles.scoreGaugeBox}>
                <div className={styles.scoreGaugeValue}>{result.viabilityScore}%</div>
                <div className={styles.scoreGaugeLabel}>Viability Rating</div>
              </div>
            </div>

            {/* Strategic Analysis */}
            <div className={styles.cardSection}>
              <h4 className={styles.sectionTitle}>
                <BrainCircuit size={20} color="#059669" />
                Comprehensive Market Analysis & Regional Fit
              </h4>
              <p className={styles.analysisText}>{result.analysis}</p>
            </div>

            {/* Immediate Action Steps */}
            <div className={styles.cardSection}>
              <h4 className={styles.sectionTitle}>
                <CheckCircle2 size={20} color="#059669" />
                Step-by-Step Execution Roadmap
              </h4>
              <ul className={styles.actionList}>
                {result.actionSteps.map((action, idx) => (
                  <li key={idx} className={styles.actionItem}>
                    <CheckCircle2 size={20} className={styles.actionIcon} />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className={styles.secondaryBtn}
              >
                ← Adjust Inputs & Re-run
              </button>
              <button 
                type="button"
                onClick={() => {
                  setUserProfile({
                    hasBusiness: true,
                    businessIdea: result.recommendation,
                    location: formData.location,
                    capital: formData.capital,
                    infrastructure: formData.infrastructure,
                    experience: formData.interests
                  });
                  setActiveTab('reality-check');
                }} 
                className={styles.primaryBtn}
              >
                Apply Idea & Launch Reality Check
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <div className={styles.overlay}>
      {content}
    </div>
  );
}

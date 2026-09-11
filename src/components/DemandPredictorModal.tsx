'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  Search, 
  BarChart3, 
  Sparkles, 
  MapPin, 
  CloudSun, 
  Calendar, 
  Store, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import styles from './DemandPredictorModal.module.css';
import { useDashboard } from '../context/DashboardContext';

export interface TrendingItem {
  name: string;
  trend: 'UP' | 'DOWN';
  reason: string;
}

interface DemandPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPredictionComplete: (items: TrendingItem[]) => void;
  inline?: boolean;
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

const SEASONS = [
  { label: '🌧️ Monsoon / Rainy', value: 'Monsoon' },
  { label: '☀️ Summer Peak', value: 'Summer' },
  { label: '❄️ Winter Season', value: 'Winter' },
  { label: '🌾 Harvest Surge (Kharif/Rabi)', value: 'Harvest Season' },
  { label: '🌱 Sowing & Cultivation', value: 'Sowing Season' }
];

const FESTIVAL_PRESETS = [
  '🪔 Diwali & Festive Gifting',
  '🌾 Navratri & Dussehra Mela',
  '🎨 Holi & Spring Markets',
  '🎪 Weekly Haat / Mandi Day',
  '💒 Wedding & Shaadi Season',
  '🏫 School / College Session'
];

const BUSINESS_SECTORS = [
  '🛒 Retail & General Grocery',
  '🌾 Agro-Processing & Cold Storage',
  '🛠️ Hardware & Electricals',
  '🚚 Logistics & Delivery Point',
  '💻 Digital CSC & Online Services'
];

export default function DemandPredictorModal({ isOpen, onClose, onPredictionComplete, inline = false }: DemandPredictorModalProps) {
  const { userProfile } = useDashboard();
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [formData, setFormData] = useState({
    location: userProfile.location || '',
    season: 'Monsoon',
    festival: '',
    businessIdea: userProfile.businessIdea || ''
  });

  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (userProfile.location || userProfile.businessIdea) {
      setFormData(prev => ({
        ...prev,
        location: userProfile.location || prev.location,
        businessIdea: userProfile.businessIdea || prev.businessIdea
      }));
    }
  }, [userProfile]);

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

  const [result, setResult] = useState<{ trendingItems: TrendingItem[], analysis: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    try {
      const response = await fetch('/api/demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();
      setResult(data);
      setStep('result');
      onPredictionComplete(data.trendingItems);
    } catch (error) {
      alert("Failed to predict demand. Please try again.");
      setStep('input');
    }
  };

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.modal} ${inline ? styles.inlineModal : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badge}>
            <Sparkles size={13} /> Seasonal & Event AI Forecasting
          </div>
          <h2 className={styles.title}>
            <BarChart3 color="#059669" size={26} />
            Hyper-Local Demand & Inventory Forecasting
          </h2>
          <p className={styles.subtitle}>
            Anticipate local customer surges, high-velocity inventory trends, and festive spikes before stocking goods.
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
                  Target Catchment / Village / District
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

              {/* Quick Location Chips */}
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

            {/* 2. Season & Climate Cycle */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <CloudSun size={17} color="#059669" />
                  Current Season & Agricultural Cycle
                </label>
                <span className={styles.helperText}>Select active weather cycle</span>
              </div>

              <div className={styles.chipGroup}>
                {SEASONS.map((season, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.season === season.value ? styles.chipActive : ''}`}
                    onClick={() => setFormData({ ...formData, season: season.value })}
                  >
                    {season.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Local Festivals, Events & Mandis */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <Calendar size={17} color="#059669" />
                  Upcoming Local Festival, Haat or Commercial Event
                </label>
                <span className={styles.helperText}>Click preset or type custom event</span>
              </div>

              <div className={styles.chipGroup} style={{ marginBottom: '0.4rem' }}>
                {FESTIVAL_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.festival === preset ? styles.chipActive : ''}`}
                    onClick={() => setFormData({ ...formData, festival: preset })}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <input 
                type="text" 
                className={`${styles.input} ${styles.inputNoIcon}`}
                placeholder="e.g. Diwali Gifting, Weekly Gram Panchayat Haat, Wedding Season"
                value={formData.festival}
                onChange={(e) => setFormData({...formData, festival: e.target.value})}
              />
            </div>

            {/* 4. Target Enterprise Focus */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <Store size={17} color="#059669" />
                  Business Type / Product Focus (Optional)
                </label>
              </div>

              <div className={styles.chipGroup} style={{ marginBottom: '0.4rem' }}>
                {BUSINESS_SECTORS.map((sector, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.businessIdea === sector ? styles.chipActive : ''}`}
                    onClick={() => setFormData({ ...formData, businessIdea: sector })}
                  >
                    {sector}
                  </button>
                ))}
              </div>

              <input 
                type="text" 
                className={`${styles.input} ${styles.inputNoIcon}`}
                placeholder="e.g. Retail Grocery Store, Cold Storage Unit, Hardware Shop"
                value={formData.businessIdea}
                onChange={(e) => setFormData({...formData, businessIdea: e.target.value})}
              />
            </div>

            {/* Submit Action */}
            <button type="submit" className={styles.submitBtn}>
              <Search size={20} />
              Run AI Hyper-Local Demand Prediction & Inventory Forecast
            </button>
          </form>
        )}

        {/* Loading State */}
        {step === 'loading' && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <h3 className={styles.loadingTitle}>
              Correlating Regional Demand Drivers...
            </h3>
            <p className={styles.loadingText}>
              Cross-referencing consumer purchasing patterns in <strong>{formData.location || 'your area'}</strong> with <strong>{formData.season}</strong> climate trends and <strong>{formData.festival || 'upcoming seasonal cycles'}</strong>...
            </p>
          </div>
        )}

        {/* Results Screen */}
        {step === 'result' && result && (
          <div className={styles.resultContainer}>
            {/* Strategic Analysis Box */}
            <div className={styles.analysisBox}>
              <h4><Sparkles size={16} /> Market Demand Intelligence & Timing Analysis</h4>
              <p>{result.analysis}</p>
            </div>

            {/* Trending Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 className={styles.sectionTitle}>
                <Flame size={20} color="#059669" />
                Top High-Velocity Trending Demand Spikes
              </h3>

              <div className={styles.trendList}>
                {result.trendingItems.map((item, idx) => (
                  <div key={idx} className={styles.trendCard}>
                    <div className={styles.trendIcon}>
                      <TrendingUp size={24} />
                    </div>
                    <div className={styles.trendInfo}>
                      <div className={styles.trendHeaderRow}>
                        <h4>{item.name}</h4>
                        <span className={styles.trendBadge}>
                          🔥 Demand Surge
                        </span>
                      </div>
                      <p>{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Done Action */}
            <button 
              type="button"
              onClick={() => {
                setStep('input');
                onClose();
              }} 
              className={styles.doneBtn}
            >
              <CheckCircle2 size={18} />
              Sync Trends to Main Dashboard & Close
            </button>
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

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
  ShieldCheck,
  ChevronDown,
  Compass,
  Check,
  RotateCcw
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
  'Indore, MP',
  'Varanasi, UP',
  'Ludhiana, Punjab',
  'Coimbatore, Tamil Nadu',
  'Ahmednagar, Maharashtra'
];

const CAPITAL_OPTIONS = [
  { value: '50000', label: '₹50,000 - Micro Enterprise (MUDRA Shishu Loan)' },
  { value: '150000', label: '₹1,50,000 - Small Business (PMEGP 35% Subsidy)' },
  { value: '300000', label: '₹3,00,000 - Medium Venture (MUDRA Kishore)' },
  { value: '800000', label: '₹8,00,000+ - Commercial Hub (Agri-Infra Fund)' }
];

const SECTOR_OPTIONS = [
  '🛒 Retail & Supermart',
  '🌾 Agri & Cold Storage',
  '🚚 Logistics & Delivery Point',
  '💻 Digital & CSC Services',
  '🛠️ Hardware & Tools',
  '🏭 Processing & Flour Mill',
  '🐄 Dairy & Livestock Production',
  '☀️ Solar & Renewable Energy Hub',
  '🧵 Handloom, Textile & Craft',
  '🏥 Rural Health & Pharmacy Outlet'
];

const INFRASTRUCTURE_OPTIONS = [
  '⚡ 24/7 Power Supply (3-Phase)',
  '🚛 Highway & Road Access',
  '🏪 Own Commercial Shop / Pucca Building',
  '💧 Water Supply & Borewell',
  '📶 4G/5G Internet Connectivity',
  '🏭 Covered Warehouse / Shed',
  '🚚 Heavy Vehicle Loading & Parking',
  '🚜 Tractor & Transport Machinery'
];

export default function AdvisoryModal({ isOpen, onClose, inline = false }: AdvisoryModalProps) {
  const { setUserProfile, setActiveTab } = useDashboard();
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  
  // Exactly 1 state variable per parameter
  const [location, setLocation] = useState('');
  const [capital, setCapital] = useState('');
  const [sectorAndExperience, setSectorAndExperience] = useState('');
  const [infraDetails, setInfraDetails] = useState('');

  const [result, setResult] = useState<AdvisoryResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Reliable Auto-detect location (GPS with Nominatim reverse-geocode + IP fallback)
  const detectLocation = async () => {
    setIsDetecting(true);

    const applyDetectedLocation = async (coords?: { lat: number; lon: number }) => {
      try {
        const res = await fetch('/api/detect-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coords || {})
        });
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (data.location) {
          setLocation(data.location);
        } else {
          setLocation('Delhi, India');
        }
      } catch (err) {
        console.warn('Location detection fallback:', err);
        setLocation('Delhi, India');
      } finally {
        setIsDetecting(false);
      }
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyDetectedLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => {
          console.log('GPS error/permission fallback to IP:', err);
          applyDetectedLocation();
        },
        { timeout: 6000, enableHighAccuracy: false }
      );
    } else {
      applyDetectedLocation();
    }
  };

  const handleSectorSelect = (sector: string) => {
    if (!sector) return;
    setSectorAndExperience(prev => {
      if (!prev.trim()) return sector;
      if (prev.includes(sector)) return prev;
      return `${prev}, ${sector}`;
    });
  };

  const handleInfraSelect = (infra: string) => {
    if (!infra) return;
    setInfraDetails(prev => {
      if (!prev.trim()) return infra;
      if (prev.includes(infra)) return prev;
      return `${prev}, ${infra}`;
    });
  };

  const handleReset = () => {
    setLocation('');
    setCapital('');
    setSectorAndExperience('');
    setInfraDetails('');
    if (!inline) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    try {
      const response = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          capital,
          interests: sectorAndExperience,
          infrastructure: infraDetails
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setResult(data);
      setStep('result');
    } catch {
      setStep('input');
      alert('Failed to generate business plan. Please try again.');
    }
  };

  const formatIndianCurrency = (numStr: string) => {
    const num = parseInt(numStr, 10);
    if (isNaN(num) || num <= 0) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.modalCardWrapper} ${inline ? styles.inlineCardWrapper : ''}`}>
      <div className={styles.formCard}>
        {/* Header Block (Form Top) */}
        <div className={styles.formCardHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.formBadge}>
              <Sparkles size={13} /> OFFICIAL INTAKE FORM &bull; AI GIS ENGINE
            </div>
            <h2 className={styles.formTitle}>
              <Sprout color="#059669" size={26} />
              Enterprise Feasibility Assessment Form
            </h2>
            <p className={styles.formSubtitle}>
              Please provide your 4 regional parameters below. All fields are evaluated concurrently by our GIS engine.
            </p>
          </div>
          <div className={styles.headerRight}>
            {!inline && (
              <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
                <X size={20} />
              </button>
            )}
            <div className={styles.requiredIndicator}>
              <span className={styles.requiredStar}>*</span> Required fields for evaluation
            </div>
          </div>
        </div>

        {/* Form Body - Exactly 1 Box Per Parameter with Dropdown Arrow */}
        {step === 'input' && (
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {/* 1. Target Location */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionTitleBlock}>
                  <h3 className={styles.sectionHeading}>
                    <span className={styles.sectionStepNum}>1</span>
                    Target Location / Village / City
                    <span className={styles.requiredStar}>*</span>
                  </h3>
                  <p className={styles.sectionDescription}>
                    Type your specific village, taluka, city or click the dropdown arrow to select popular trade centers.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className={styles.locationDetectBtn}
                  title="Detect your location via GPS or network IP"
                >
                  <Compass size={14} className={isDetecting ? styles.spinIcon : ''} />
                  {isDetecting ? 'Detecting Location...' : 'Auto-Detect Location'}
                </button>
              </div>

              {/* Single Unified Location Box */}
              <div className={styles.formField}>
                <div className={styles.unifiedLocationBox}>
                  <MapPin size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.unifiedLocationInput}
                    placeholder="e.g., Satara, Maharashtra or Bhind, MP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    list="popular-locations-list"
                    required
                  />
                  <div className={styles.dropdownArrowBtnWrapper} title="Open regional hubs list">
                    <select 
                      className={styles.dropdownArrowSelect}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) setLocation(e.target.value);
                      }}
                      title="Choose from Popular Regional Hubs"
                    >
                      <option value="" disabled hidden>-- Select Hub --</option>
                      {POPULAR_LOCATIONS.map((loc, idx) => (
                        <option key={idx} value={loc}>📍 {loc}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className={styles.dropdownArrowIcon} />
                  </div>
                </div>

                <datalist id="popular-locations-list">
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc} />
                  ))}
                </datalist>

                {location && (
                  <div className={styles.activeSelectionBanner}>
                    <Check size={14} color="#059669" />
                    <span>Selected Target: <strong>{location}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Available Working Capital - ONLY ONE BOX */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionTitleBlock}>
                  <h3 className={styles.sectionHeading}>
                    <span className={styles.sectionStepNum}>2</span>
                    Available Working Capital (₹)
                    <span className={styles.requiredStar}>*</span>
                  </h3>
                  <p className={styles.sectionDescription}>
                    Enter your exact available working / seed capital or click the dropdown arrow to select an investment tier.
                  </p>
                </div>
                <div className={styles.subsidyCallout}>
                  <Sparkles size={13} color="#059669" />
                  <span>Eligible for up to 35% PMEGP / MUDRA Subsidies</span>
                </div>
              </div>

              {/* Single Unified Capital Box */}
              <div className={styles.formField}>
                <div className={styles.fieldLabelRow}>
                  <label className={styles.fieldLabel}>
                    Working Capital Amount:
                  </label>
                  {capital && (
                    <span className={styles.capitalFormattedBadge}>
                      {formatIndianCurrency(capital)}
                    </span>
                  )}
                </div>
                <div className={styles.unifiedLocationBox}>
                  <IndianRupee size={18} className={styles.inputIcon} />
                  <input 
                    type="number" 
                    className={styles.unifiedLocationInput}
                    placeholder="e.g., 150000"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    required
                    min="1000"
                  />
                  <div className={styles.dropdownArrowBtnWrapper} title="Select an investment tier">
                    <select 
                      className={styles.dropdownArrowSelect}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) setCapital(e.target.value);
                      }}
                      title="Select investment scale tier"
                    >
                      <option value="" disabled hidden>-- Select Tier --</option>
                      {CAPITAL_OPTIONS.map((tier, idx) => (
                        <option key={idx} value={tier.value}>{tier.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className={styles.dropdownArrowIcon} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Assets, Background & Preferred Sector - ONLY ONE BOX */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionTitleBlock}>
                  <h3 className={styles.sectionHeading}>
                    <span className={styles.sectionStepNum}>3</span>
                    Assets, Background & Preferred Sector
                    <span className={styles.requiredStar}>*</span>
                  </h3>
                  <p className={styles.sectionDescription}>
                    Type your commercial space, land front, or domain experience, or click the dropdown arrow to select sectors.
                  </p>
                </div>
              </div>

              {/* Single Unified Box */}
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>
                  Commercial Space, Land, Experience & Preferred Sectors:
                </label>
                <div className={styles.unifiedLocationBox}>
                  <Lightbulb size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.unifiedLocationInput}
                    placeholder="e.g., Have 2 acres land, 500 sq ft shop, farming experience"
                    value={sectorAndExperience}
                    onChange={(e) => setSectorAndExperience(e.target.value)}
                    list="sector-options-list"
                    required
                  />
                  <div className={styles.dropdownArrowBtnWrapper} title="Select preferred sector">
                    <select 
                      className={styles.dropdownArrowSelect}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) handleSectorSelect(e.target.value);
                      }}
                      title="Choose from industry sectors"
                    >
                      <option value="" disabled hidden>-- Select Sector --</option>
                      {SECTOR_OPTIONS.map((tag, idx) => (
                        <option key={idx} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className={styles.dropdownArrowIcon} />
                  </div>
                </div>

                <datalist id="sector-options-list">
                  {SECTOR_OPTIONS.map((tag, idx) => (
                    <option key={idx} value={tag} />
                  ))}
                </datalist>
                <span className={styles.fieldHint}>
                  Type custom details or click the arrow to append industry sectors (Retail, Cold Storage, Processing, Dairy, etc.).
                </span>
              </div>
            </div>

            {/* 4. Available Infrastructure & Utilities - ONLY ONE BOX */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionTitleBlock}>
                  <h3 className={styles.sectionHeading}>
                    <span className={styles.sectionStepNum}>4</span>
                    Available Infrastructure & Utilities
                    <span className={styles.requiredStar}>*</span>
                  </h3>
                  <p className={styles.sectionDescription}>
                    Type machinery, power, or road details, or click the dropdown arrow to select available utilities.
                  </p>
                </div>
              </div>

              {/* Single Unified Box */}
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>
                  Specific Machinery, Road, Power & Utilities:
                </label>
                <div className={styles.unifiedLocationBox}>
                  <Zap size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.unifiedLocationInput}
                    placeholder="e.g., 24/7 3-phase electricity, highway road connectivity, 15 HP tube-well"
                    value={infraDetails}
                    onChange={(e) => setInfraDetails(e.target.value)}
                    list="infra-options-list"
                    required
                  />
                  <div className={styles.dropdownArrowBtnWrapper} title="Select available utility">
                    <select 
                      className={styles.dropdownArrowSelect}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) handleInfraSelect(e.target.value);
                      }}
                      title="Choose from available utilities"
                    >
                      <option value="" disabled hidden>-- Select Utility --</option>
                      {INFRASTRUCTURE_OPTIONS.map((infra, idx) => (
                        <option key={idx} value={infra}>{infra}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className={styles.dropdownArrowIcon} />
                  </div>
                </div>

                <datalist id="infra-options-list">
                  {INFRASTRUCTURE_OPTIONS.map((infra, idx) => (
                    <option key={idx} value={infra} />
                  ))}
                </datalist>
                <span className={styles.fieldHint}>
                  Type machinery specifications or click the arrow to append utilities (3-Phase Power, Highway Access, Warehouse, etc.).
                </span>
              </div>
            </div>

            {/* GIS Synchronization Alert Banner */}
            <div className={styles.infoBanner}>
              <div className={styles.infoBannerIcon}>
                <ShieldCheck size={20} color="#059669" />
              </div>
              <div className={styles.infoBannerText}>
                Synchronized with National GIS Demographics, Census Clusters & Micro-Enterprise Subsidy Portals
              </div>
            </div>

            {/* Action Footer */}
            <div className={styles.formActionFooter}>
              <button 
                type="button" 
                onClick={handleReset}
                className={styles.cancelBtn}
              >
                <RotateCcw size={16} />
                <span>Reset Form</span>
              </button>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={!location || !capital}
              >
                <BrainCircuit size={20} />
                <span>Generate Hyper-Local Business Plan & Viability Report</span>
                <ArrowRight size={18} />
              </button>
            </div>
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
              Evaluating market voids, consumer purchasing power, transport access, and commercial viability for <strong>{location || 'your area'}</strong>...
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
                <p>📍 Optimized for {location} with ₹{Number(capital).toLocaleString('en-IN')} working capital</p>
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
                    location: location,
                    capital: capital,
                    infrastructure: infraDetails,
                    experience: sectorAndExperience
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

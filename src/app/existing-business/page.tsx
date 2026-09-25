'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  LayoutDashboard,
  AlertCircle,
  X,
  Loader2,
  Navigation,
  Layers,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Award,
  Check,
  Info
} from 'lucide-react';
import styles from './page.module.css';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import ChatbotWidget from '../../components/ChatbotWidget';

function ExistingBusinessContent() {
  const router = useRouter();
  const { 
    userProfile, 
    setUserProfile, 
    realityScores, 
    setActiveTab,
    setIsDashboardUnlocked
  } = useDashboard();

  // Local form state - clean and empty by default
  const [formData, setFormData] = useState({
    businessIdea: '',
    category: 'Agriculture & Allied',
    location: '',
    capital: '',
    monthlyRevenue: '',
    infrastructure: '',
    experience: '',
    priority: 'Government Subsidy & Capital'
  });

  // Validation and UI feedback states
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [topAlert, setTopAlert] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectSuccess, setDetectSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Field element refs for cursor focus
  const businessNameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const capitalRef = useRef<HTMLInputElement>(null);
  const infraRef = useRef<HTMLSelectElement>(null);
  const expRef = useRef<HTMLSelectElement>(null);

  // Initialize from userProfile if user previously saved details
  useEffect(() => {
    if (userProfile && userProfile.hasBusiness) {
      setFormData(prev => ({
        ...prev,
        businessIdea: userProfile.businessIdea || '',
        location: userProfile.location || '',
        capital: userProfile.capital ? String(userProfile.capital) : '',
        infrastructure: userProfile.infrastructure || '',
        experience: userProfile.experience || ''
      }));
    }
  }, [userProfile]);

  // Validation function with precise cursor targeting
  const validateForm = (): boolean => {
    const errors: { field: string; label: string; ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null> }[] = [];

    if (!formData.businessIdea.trim()) {
      errors.push({ field: 'businessIdea', label: 'Business / Unit Name', ref: businessNameRef });
    }
    if (!formData.location.trim()) {
      errors.push({ field: 'location', label: 'Location / Village, District', ref: locationRef });
    }
    if (!formData.capital.trim() || isNaN(Number(formData.capital)) || Number(formData.capital) <= 0) {
      errors.push({ field: 'capital', label: 'Total Capital / Working Investment', ref: capitalRef });
    }
    if (!formData.infrastructure.trim()) {
      errors.push({ field: 'infrastructure', label: 'Infrastructure Available', ref: infraRef });
    }
    if (!formData.experience.trim()) {
      errors.push({ field: 'experience', label: 'Years of Experience', ref: expRef });
    }

    if (errors.length > 0) {
      const missingList = errors.map(e => e.label).join(', ');
      setTopAlert(`Please fill in the compulsory details before proceeding: ${missingList}`);
      setInvalidFields(errors.map(e => e.field));

      // Scroll and point cursor directly into the first missing field
      const firstError = errors[0];
      if (firstError.ref.current) {
        firstError.ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.ref.current.focus();
      }
      return false;
    }

    setTopAlert(null);
    setInvalidFields([]);
    return true;
  };

  // Auto-detect location via GPS and reverse geocoding API
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setDetectSuccess(false);

    const applyLocation = async (coords?: { lat: number; lon: number }) => {
      try {
        const res = await fetch('/api/detect-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coords || {})
        });
        if (res.ok) {
          const data = await res.json();
          if (data.location) {
            setFormData(prev => ({ ...prev, location: data.location }));
            setInvalidFields(prev => prev.filter(f => f !== 'location'));
            setDetectSuccess(true);
            setTimeout(() => setDetectSuccess(false), 3500);
            return;
          }
        }
        setFormData(prev => ({ ...prev, location: 'Pune, Maharashtra, India' }));
      } catch (err) {
        console.warn('Location detection fallback:', err);
        setFormData(prev => ({ ...prev, location: 'Pune, Maharashtra, India' }));
      } finally {
        setIsDetectingLocation(false);
      }
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => {
          console.log('GPS permission fallback:', err);
          applyLocation();
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      applyLocation();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setUserProfile(prev => ({
      ...prev,
      hasBusiness: true,
      businessIdea: formData.businessIdea.trim(),
      location: formData.location.trim(),
      capital: formData.capital.trim(),
      infrastructure: formData.infrastructure.trim(),
      experience: formData.experience.trim()
    }));

    setIsDashboardUnlocked(true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleNavigateToPlanner = () => {
    if (!validateForm()) {
      return;
    }

    const updatedProfile = {
      hasBusiness: true,
      businessIdea: formData.businessIdea.trim(),
      location: formData.location.trim(),
      capital: formData.capital.trim(),
      infrastructure: formData.infrastructure.trim(),
      experience: formData.experience.trim()
    };

    setUserProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));

    try {
      localStorage.setItem('ruralix_user_profile', JSON.stringify(updatedProfile));
    } catch (e) {}

    setActiveTab('ai-recommendation');
    router.push('/dashboard?tab=ai-recommendation');
  };

  const clearFieldError = (fieldName: string) => {
    setInvalidFields(prev => prev.filter(f => f !== fieldName));
    if (invalidFields.length <= 1) {
      setTopAlert(null);
    }
  };

  const capitalVal = parseInt(formData.capital) || (parseInt(userProfile.capital as string) || 0);
  const revenueVal = parseInt(formData.monthlyRevenue) || (capitalVal > 0 ? Math.round(capitalVal * 0.35) : 0);
  const viabilityScore = formData.businessIdea && formData.capital ? (realityScores?.overall || 82) : 0;

  // Form completion progress
  const completedFieldsCount = [
    formData.businessIdea.trim(),
    formData.location.trim(),
    formData.capital.trim(),
    formData.infrastructure.trim(),
    formData.experience.trim()
  ].filter(Boolean).length;
  const completionPercentage = Math.round((completedFieldsCount / 5) * 100);

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainWrapper}>
        <Header />

        <div className={styles.content}>
          {/* Top Compulsory Popup Alert Banner */}
          {topAlert && (
            <div className={styles.topAlertBanner} role="alert">
              <div className={styles.alertLeft}>
                <div className={styles.alertIconPulse}>
                  <AlertCircle size={22} />
                </div>
                <div>
                  <div className={styles.alertTitle}>Mandatory Form Completion Required</div>
                  <div className={styles.alertText}>{topAlert}</div>
                </div>
              </div>
              <button 
                type="button" 
                className={styles.alertCloseBtn} 
                onClick={() => setTopAlert(null)}
                aria-label="Dismiss alert"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Header Title Bar */}
          <div className={styles.pageHeader}>
            <div className={styles.titleArea}>
              <h1>
                <span className={styles.titleIcon}>
                  <Building2 size={26} />
                </span>
                Existing Business Hub
              </h1>
              <p className={styles.subtitle}>
                Manage your enterprise profile, check loan & subsidy eligibility, evaluate operational risks, and simulate revenue growth.
              </p>
            </div>

            <div className={styles.headerActions}>
              <button 
                type="button" 
                className={styles.secondaryBtn}
                onClick={() => router.push('/onboarding')}
              >
                Change Path
              </button>
              <button 
                type="button" 
                className={styles.dashboardBtn}
                onClick={handleNavigateToPlanner}
              >
                <Sparkles size={18} /> Proceed to AI Business Planner
              </button>
            </div>
          </div>

          {/* 2-Column Grid: Form + Enterprise Diagnostics */}
          <div className={styles.layoutGrid}>
            {/* Left Column: Business Setup Form */}
            <div className={styles.card}>
              <div className={styles.cardTitleRow}>
                <div className={styles.cardTitle}>
                  <Building2 size={22} color="var(--primary)" />
                  Enterprise Details & Operations
                </div>
                <div className={styles.progressPill}>
                  <span className={styles.progressDot} style={{ background: completionPercentage === 100 ? '#10b981' : '#f59e0b' }}></span>
                  {completionPercentage}% Complete
                </div>
              </div>
              
              <p className={styles.cardSubtitle}>
                Please fill in all compulsory details marked with (*) for accurate AI financial predictions, bank loan readiness, and scheme matching.
              </p>

              <form onSubmit={handleSave} className={styles.formGrid}>
                {/* Row 1: Business Name & Category */}
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span>Business Name / Unit Name <strong className={styles.requiredStar}>*</strong></span>
                    </label>
                    <input 
                      ref={businessNameRef}
                      type="text" 
                      className={`${styles.input} ${invalidFields.includes('businessIdea') ? styles.inputError : ''}`} 
                      placeholder="e.g., Kisan Dairy Farm & Ghee Unit"
                      value={formData.businessIdea}
                      onChange={e => {
                        setFormData({ ...formData, businessIdea: e.target.value });
                        if (e.target.value.trim()) clearFieldError('businessIdea');
                      }}
                    />
                    {invalidFields.includes('businessIdea') && (
                      <span className={styles.fieldErrorText}>
                        <AlertCircle size={13} /> Business Name is required
                      </span>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span>Business Category / Sector <strong className={styles.requiredStar}>*</strong></span>
                    </label>
                    <select 
                      className={styles.select}
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Agriculture & Allied">Agriculture & Allied (Dairy, Poultry, Fishery)</option>
                      <option value="Food Processing">Food Processing & Agro-Products</option>
                      <option value="Retail & Trade">Village Retail / Kirana & Hardware</option>
                      <option value="Handicraft & Textiles">Handicrafts, Textiles & Weaving</option>
                      <option value="Rural Services">Machinery, Repair & Logistics Services</option>
                      <option value="Renewable & Solar">Solar & Biomass Solutions</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Location with Auto-Detect & Total Capital */}
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelWithAction}>
                      <label className={styles.label}>
                        <span>Location / Village, District <strong className={styles.requiredStar}>*</strong></span>
                      </label>
                      <button
                        type="button"
                        className={styles.autoDetectBtn}
                        onClick={handleDetectLocation}
                        disabled={isDetectingLocation}
                        title="Auto-detect current location via GPS"
                      >
                        {isDetectingLocation ? (
                          <>
                            <Loader2 size={13} className={styles.spinning} />
                            <span>Detecting...</span>
                          </>
                        ) : detectSuccess ? (
                          <>
                            <Check size={13} color="#059669" />
                            <span style={{ color: '#059669' }}>Detected!</span>
                          </>
                        ) : (
                          <>
                            <MapPin size={13} />
                            <span>Auto Detect</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className={styles.inputWithIconWrapper}>
                      <input 
                        ref={locationRef}
                        type="text" 
                        className={`${styles.input} ${invalidFields.includes('location') ? styles.inputError : ''}`} 
                        placeholder="e.g., Satara, Maharashtra"
                        value={formData.location}
                        onChange={e => {
                          setFormData({ ...formData, location: e.target.value });
                          if (e.target.value.trim()) clearFieldError('location');
                        }}
                      />
                    </div>
                    {invalidFields.includes('location') && (
                      <span className={styles.fieldErrorText}>
                        <AlertCircle size={13} /> Location is compulsory
                      </span>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span>Total Capital / Working Investment (₹) <strong className={styles.requiredStar}>*</strong></span>
                    </label>
                    <input 
                      ref={capitalRef}
                      type="number" 
                      className={`${styles.input} ${invalidFields.includes('capital') ? styles.inputError : ''}`} 
                      placeholder="e.g., 150000"
                      value={formData.capital}
                      onChange={e => {
                        setFormData({ ...formData, capital: e.target.value });
                        if (e.target.value.trim()) clearFieldError('capital');
                      }}
                    />
                    {invalidFields.includes('capital') && (
                      <span className={styles.fieldErrorText}>
                        <AlertCircle size={13} /> Valid investment capital is compulsory
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 3: Estimated Monthly Turnover & Top Priority */}
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span>Estimated Monthly Turnover (₹)</span>
                      <span className={styles.labelHint}>Optional</span>
                    </label>
                    <input 
                      type="number" 
                      className={styles.input} 
                      placeholder="e.g., 45000"
                      value={formData.monthlyRevenue}
                      onChange={e => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span>Current Top Priority / Goal</span>
                    </label>
                    <select 
                      className={styles.select}
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Government Subsidy & Capital">Get PMEGP / Mudra Loan & Subsidy</option>
                      <option value="Demand Expansion">Increase Local Sales & Customers</option>
                      <option value="Cost Optimization">Reduce Input Costs & Electricity Bill</option>
                      <option value="Risk Mitigation">Protect Against Seasonal Price Drops</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Infrastructure Available (Dropdown) */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span>Infrastructure Available <strong className={styles.requiredStar}>*</strong></span>
                    <span className={styles.labelHint}>Select the primary facility available</span>
                  </label>
                  <select
                    ref={infraRef}
                    className={`${styles.select} ${invalidFields.includes('infrastructure') ? styles.inputError : ''}`}
                    value={formData.infrastructure}
                    onChange={e => {
                      setFormData({ ...formData, infrastructure: e.target.value });
                      if (e.target.value.trim()) clearFieldError('infrastructure');
                    }}
                  >
                    <option value="">-- Select Available Infrastructure --</option>
                    <option value="Dedicated Work Shed / Commercial Shop">🏬 Dedicated Work Shed / Commercial Shop</option>
                    <option value="3-Phase Commercial Power & Electric Connection">⚡ 3-Phase Commercial Power & High-Load Electricity</option>
                    <option value="24/7 Water Supply & Borewell / Irrigation">💧 24/7 Water Supply & Borewell / Irrigation</option>
                    <option value="Cold Storage & Packaging / Warehouse Unit">❄️ Cold Storage & Packaging / Ambient Warehouse Unit</option>
                    <option value="Highway Frontage & Road Access for Heavy Logistics">🚛 Highway Frontage & Easy Road Access for Vehicles</option>
                    <option value="High-Speed Internet, Computer & Digital POS Setup">📶 High-Speed Internet, Computer & Digital POS Setup</option>
                    <option value="Basic Machinery, Processing Tools & Equipment">🚜 Basic Machinery, Processing Tools & Equipment</option>
                    <option value="Open Farmland / Rural Homestead (Minimal Infra)">🌾 Open Farmland / Rural Homestead (Minimal Infra)</option>
                    <option value="Fully Equipped Processing & Packaging Facility">🏭 Fully Equipped Commercial Processing Facility</option>
                  </select>
                  {invalidFields.includes('infrastructure') && (
                    <span className={styles.fieldErrorText}>
                      <AlertCircle size={13} /> Infrastructure selection is compulsory
                    </span>
                  )}
                </div>

                {/* Row 5: Years of Experience (Dropdown) */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span>Years of Experience & Key Skills <strong className={styles.requiredStar}>*</strong></span>
                    <span className={styles.labelHint}>Select your operating experience</span>
                  </label>
                  <select
                    ref={expRef}
                    className={`${styles.select} ${invalidFields.includes('experience') ? styles.inputError : ''}`}
                    value={formData.experience}
                    onChange={e => {
                      setFormData({ ...formData, experience: e.target.value });
                      if (e.target.value.trim()) clearFieldError('experience');
                    }}
                  >
                    <option value="">-- Select Years of Experience --</option>
                    <option value="Fresher / Starting New (< 1 Year)">🌱 Fresher / Starting New (&lt; 1 Year)</option>
                    <option value="1 - 3 Years (Early Stage Enterprise)">📈 1 - 3 Years (Early Stage Enterprise)</option>
                    <option value="3 - 5 Years (Established Micro-Business)">🏆 3 - 5 Years (Established Micro-Business)</option>
                    <option value="5 - 10 Years (Experienced Operator)">🎖️ 5 - 10 Years (Experienced Operator)</option>
                    <option value="10+ Years (Senior / Veteran Operator)">👑 10+ Years (Senior / Veteran Operator)</option>
                  </select>
                  {invalidFields.includes('experience') && (
                    <span className={styles.fieldErrorText}>
                      <AlertCircle size={13} /> Experience level is compulsory
                    </span>
                  )}
                </div>

                <button type="submit" className={styles.saveBtn}>
                  <CheckCircle2 size={20} /> Save Business Profile & Sync Diagnostics
                </button>

                {savedSuccess && (
                  <div className={styles.successToast}>
                    <CheckCircle2 size={18} />
                    <span>Business profile successfully verified & saved! Live dashboard metrics synchronized.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: AI Health Radar & Profile Diagnostics (Growth Toolkit removed) */}
            <div className={styles.sidebarCol}>
              {/* Business Health Score Card */}
              <div className={styles.healthCard}>
                <div className={styles.healthBadge}>
                  <Sparkles size={14} /> AI Enterprise Health Score
                </div>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreValue}>{viabilityScore || '--'}</span>
                  <span className={styles.scoreUnit}>{viabilityScore ? '/ 100' : ''}</span>
                </div>
                <div className={styles.scoreStatus}>
                  {viabilityScore >= 80 
                    ? '🟢 Strong Viability & Bank-Ready' 
                    : viabilityScore > 0 
                    ? '🟡 Moderate Risk • Growth Potential'
                    : '⚪ Fill in business details to calculate score'}
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Est. Monthly Run-Rate</span>
                    <span className={styles.metricVal}>
                      {revenueVal > 0 ? `₹ ${revenueVal.toLocaleString('en-IN')}` : '₹ --'}
                    </span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>PMEGP Match Potential</span>
                    <span className={styles.metricVal}>
                      {capitalVal > 0 ? 'Up to 35%' : '--'}
                    </span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Capital Base</span>
                    <span className={styles.metricVal}>
                      {capitalVal > 0 ? `₹ ${capitalVal.toLocaleString('en-IN')}` : '₹ --'}
                    </span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Local Demand Index</span>
                    <span className={styles.metricVal}>
                      {formData.location ? 'High (82%)' : '--'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Profile Diagnostics & Loan Readiness Card */}
              <div className={styles.diagnosticsCard}>
                <div className={styles.diagnosticsHeader}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  <span>Enterprise Profile Readiness</span>
                </div>
                <p className={styles.diagnosticsDesc}>
                  Live check for government subsidy eligibility, PMEGP grant compliance, and loan approval factors.
                </p>

                <div className={styles.checklistGrid}>
                  <div className={`${styles.checkItem} ${formData.businessIdea ? styles.checkItemActive : ''}`}>
                    <div className={styles.checkIcon}>
                      {formData.businessIdea ? <Check size={14} color="#059669" /> : <div className={styles.emptyCircle} />}
                    </div>
                    <div>
                      <div className={styles.checkTitle}>Business Identity</div>
                      <div className={styles.checkSub}>{formData.businessIdea || 'Awaiting unit title'}</div>
                    </div>
                  </div>

                  <div className={`${styles.checkItem} ${formData.location ? styles.checkItemActive : ''}`}>
                    <div className={styles.checkIcon}>
                      {formData.location ? <Check size={14} color="#059669" /> : <div className={styles.emptyCircle} />}
                    </div>
                    <div>
                      <div className={styles.checkTitle}>Territory & Mandi Mapping</div>
                      <div className={styles.checkSub}>{formData.location || 'Location not specified'}</div>
                    </div>
                  </div>

                  <div className={`${styles.checkItem} ${formData.capital ? styles.checkItemActive : ''}`}>
                    <div className={styles.checkIcon}>
                      {formData.capital ? <Check size={14} color="#059669" /> : <div className={styles.emptyCircle} />}
                    </div>
                    <div>
                      <div className={styles.checkTitle}>Capital Adequacy (Capex)</div>
                      <div className={styles.checkSub}>{formData.capital ? `₹ ${parseInt(formData.capital).toLocaleString('en-IN')}` : 'Working capital pending'}</div>
                    </div>
                  </div>

                  <div className={`${styles.checkItem} ${formData.infrastructure ? styles.checkItemActive : ''}`}>
                    <div className={styles.checkIcon}>
                      {formData.infrastructure ? <Check size={14} color="#059669" /> : <div className={styles.emptyCircle} />}
                    </div>
                    <div>
                      <div className={styles.checkTitle}>Infrastructure Fit</div>
                      <div className={styles.checkSub}>{formData.infrastructure || 'Facility not chosen'}</div>
                    </div>
                  </div>

                  <div className={`${styles.checkItem} ${formData.experience ? styles.checkItemActive : ''}`}>
                    <div className={styles.checkIcon}>
                      {formData.experience ? <Check size={14} color="#059669" /> : <div className={styles.emptyCircle} />}
                    </div>
                    <div>
                      <div className={styles.checkTitle}>Operator Track Record</div>
                      <div className={styles.checkSub}>{formData.experience || 'Experience level pending'}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.diagnosticsFooter}>
                  <Info size={16} color="var(--primary)" />
                  <span>Completing all 5 compulsory fields unlocks the live analytics dashboard and personalized AI mentor insights.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
}

export default function ExistingBusinessPage() {
  return (
    <DashboardProvider>
      <ExistingBusinessContent />
    </DashboardProvider>
  );
}

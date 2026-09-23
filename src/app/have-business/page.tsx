'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sprout, 
  ArrowLeft, 
  ArrowRight, 
  Briefcase, 
  IndianRupee, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Award, 
  HelpCircle,
  Building2,
  Zap,
  Droplets,
  Truck,
  Wifi,
  Wrench,
  Store,
  ShieldCheck,
  Layers,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import styles from './page.module.css';

interface QuickIdea {
  title: string;
  category: string;
  defaultCapital: string;
  icon: string;
  infra: string[];
}

const POPULAR_IDEAS: QuickIdea[] = [
  {
    title: 'Dairy Farming & Milk Chilling Unit',
    category: 'Livestock & Agriculture',
    defaultCapital: '150000',
    icon: '🥛',
    infra: ['land', 'electricity', 'water', 'transport']
  },
  {
    title: 'Cold Press Mustard & Oil Mill (Kacchi Ghani)',
    category: 'Food Processing',
    defaultCapital: '200000',
    icon: '🛢️',
    infra: ['shop', 'electricity', 'machinery']
  },
  {
    title: 'Mini Flour Mill & Spice Grinding (Chakki)',
    category: 'Food Processing',
    defaultCapital: '80000',
    icon: '🌾',
    infra: ['shop', 'electricity', 'machinery']
  },
  {
    title: 'Broiler / Kadaknath Poultry Farm',
    category: 'Livestock & Agriculture',
    defaultCapital: '120000',
    icon: '🐔',
    infra: ['land', 'electricity', 'water']
  },
  {
    title: 'Vermicompost & Organic Bio-Fertilizer',
    category: 'Organic Agri-inputs',
    defaultCapital: '45000',
    icon: '🌱',
    infra: ['land', 'water']
  },
  {
    title: 'Rural Kirana & Daily Needs Supermart',
    category: 'Retail & Trading',
    defaultCapital: '100000',
    icon: '🛒',
    infra: ['shop', 'electricity', 'internet']
  },
  {
    title: 'Solar Water Pump Installation & Repair',
    category: 'Green Tech & Services',
    defaultCapital: '75000',
    icon: '☀️',
    infra: ['transport', 'machinery', 'internet']
  },
  {
    title: 'Apparel Tailoring & Readymade Garment Unit',
    category: 'Rural Manufacturing',
    defaultCapital: '60000',
    icon: '🧵',
    infra: ['shop', 'electricity', 'machinery']
  }
];

const INFRASTRUCTURE_OPTIONS = [
  { id: 'land', label: 'Own Land / Open Plot (जमीन)', icon: '🏡' },
  { id: 'shop', label: 'Commercial Shop / Room (दुकान)', icon: '🏪' },
  { id: 'electricity', label: '24/7 or 3-Phase Power (बिजली)', icon: '⚡' },
  { id: 'water', label: 'Borewell / Continuous Water (पानी)', icon: '💧' },
  { id: 'transport', label: 'Two-Wheeler / Loading Tempo (वाहन)', icon: '🚚' },
  { id: 'internet', label: '4G / Stable Internet (इंटरनेट)', icon: '📶' },
  { id: 'machinery', label: 'Existing Tools / Equipment (औजार)', icon: '⚙️' }
];

const STAGE_OPTIONS = [
  { id: 'idea', title: 'Conceptual Stage', desc: 'Planning feasibility and arranging resources', icon: '💡' },
  { id: 'launching', title: 'Ready to Launch', desc: 'Starting within the next 30-60 days', icon: '🚀' },
  { id: 'operating', title: 'Already Operating', desc: 'Running for under 2 years, seeking growth', icon: '📈' },
  { id: 'scaling', title: 'Established & Scaling', desc: '2+ years in business, adding new lines', icon: '🏆' }
];

const CAPITAL_PRESETS = ['25000', '50000', '100000', '250000', '500000', '1000000'];

export default function HaveBusinessPage() {
  const router = useRouter();
  const { userProfile, setUserProfile, setActiveTab, setRealityScores } = useDashboard();

  // Form states
  const [businessIdea, setBusinessIdea] = useState(userProfile.businessIdea || 'Dairy Farming & Milk Chilling Unit');
  const [category, setCategory] = useState('Livestock & Agriculture');
  const [stage, setStage] = useState('launching');
  const [location, setLocation] = useState(userProfile.location || 'Satara, Maharashtra');
  const [capital, setCapital] = useState(userProfile.capital || '150000');
  const [targetRevenue, setTargetRevenue] = useState('45000');
  const [selectedInfra, setSelectedInfra] = useState<string[]>(['land', 'electricity', 'water', 'transport']);
  const [experience, setExperience] = useState(userProfile.experience || '2 years of practical experience');
  const [workingHours, setWorkingHours] = useState('Full-time (8-10 hrs/day)');
  const [keyNeed, setKeyNeed] = useState('Government Subsidy & Bank Loan');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Select an Idea
  const handleSelectQuickIdea = (item: QuickIdea) => {
    setBusinessIdea(item.title);
    setCategory(item.category);
    setCapital(item.defaultCapital);
    setSelectedInfra(item.infra);
  };

  const toggleInfra = (id: string) => {
    setSelectedInfra(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Dynamic Live Feasibility Calculation
  const liveScores = useMemo(() => {
    const numCap = parseInt(capital) || 0;
    let capScore = Math.min(95, Math.max(30, Math.floor((numCap / 200000) * 80) + 20));
    let infraScore = Math.min(95, Math.max(25, selectedInfra.length * 14 + 10));
    let expScore = experience.toLowerCase().includes('year') || experience.toLowerCase().includes('seasoned') ? 85 : 50;
    let demandScore = category.includes('Livestock') || category.includes('Food') ? 88 : 78;
    
    let overall = Math.floor((capScore * 0.3) + (infraScore * 0.3) + (expScore * 0.2) + (demandScore * 0.2));
    let riskScore = Math.max(15, 100 - overall);

    return {
      overall,
      capital: capScore,
      infra: infraScore,
      demand: demandScore,
      risk: riskScore
    };
  }, [capital, selectedInfra, experience, category]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const infraText = selectedInfra
      .map(id => INFRASTRUCTURE_OPTIONS.find(o => o.id === id)?.label.split(' ')[0] || id)
      .join(', ');

    const updatedProfile = {
      hasBusiness: true,
      businessIdea,
      location,
      capital,
      infrastructure: infraText,
      experience
    };

    // Save to context & localStorage
    setUserProfile(updatedProfile);
    setRealityScores({
      demand: liveScores.demand,
      competition: 65,
      infra: liveScores.infra,
      risk: liveScores.risk,
      overall: liveScores.overall
    });

    setActiveTab('dashboard');

    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Navbar */}
      <nav className={styles.topNav}>
        <Link href="/dashboard" className={styles.brandLogo}>
          <Sprout size={32} color="#059669" />
          Grameen<span>Sathi</span>
        </Link>

        <div className={styles.badge}>
          <Sparkles size={16} /> AI-Powered Business Diagnostic
        </div>

        <div className={styles.navActions}>
          <Link href="/dashboard" className={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className={styles.container}>
        {/* Hero Section */}
        <header className={styles.heroHeader}>
          <span className={styles.tagline}>Entrepreneur Intake & Diagnostic</span>
          <h1 className={styles.mainTitle}>
            Let’s Build Your <span className={styles.highlight}>Rural Enterprise Roadmap</span>
          </h1>
          <p className={styles.subtitle}>
            Tell us about your business idea or existing setup. We will evaluate your local market demand, capital adequacy, and unlock eligible government subsidies (PMEGP, MUDRA, NABARD).
          </p>
        </header>

        {/* Quick Select Idea Chips */}
        <section className={styles.quickIdeasSection}>
          <div className={styles.quickIdeasHeader}>
            <span className={styles.quickIdeasTitle}>
              <Sparkles size={18} color="var(--primary)" /> Popular High-Demand Rural Ideas (Click to auto-fill)
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>8 Proven Templates</span>
          </div>

          <div className={styles.quickIdeaChips}>
            {POPULAR_IDEAS.map((item, idx) => {
              const isActive = businessIdea === item.title;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickIdea(item)}
                  className={`${styles.ideaChip} ${isActive ? styles.ideaChipActive : ''}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Layout Grid */}
        <div className={styles.layoutGrid}>
          {/* Left Column: Intake Form */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              {/* Section 1: Business Overview */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeading}>
                  <div className={styles.sectionIcon}><Briefcase size={20} /></div>
                  1. Business Identity & Stage
                </h3>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Business Idea / Name</label>
                  <input
                    type="text"
                    required
                    className={styles.textInput}
                    placeholder="e.g., Dairy Farming, Oil Mill, Kirana Store..."
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                  />
                  <p className={styles.inputHelper}>Enter the exact product or service you are providing.</p>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Industry Sector</label>
                    <select
                      className={styles.selectInput}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Livestock & Agriculture">Livestock & Agriculture (पशुपालन व कृषि)</option>
                      <option value="Food Processing">Food Processing & Mills (खाद्य प्रसंस्करण)</option>
                      <option value="Retail & Trading">Retail & Trading (दुकान व व्यापार)</option>
                      <option value="Rural Manufacturing">Rural Manufacturing (कुटीर उद्योग व निर्माण)</option>
                      <option value="Green Tech & Services">Green Tech & Solar Services (सोलर व सेवाएं)</option>
                      <option value="Organic Agri-inputs">Organic Agri-inputs (जैविक खाद व बीज)</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Location (Village/Town, State)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        className={styles.textInput}
                        placeholder="e.g., Satara, Maharashtra"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Current Business Stage</label>
                  <div className={styles.stageGrid}>
                    {STAGE_OPTIONS.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setStage(st.id)}
                        className={`${styles.stageCard} ${stage === st.id ? styles.stageCardActive : ''}`}
                      >
                        <div className={styles.stageTitle}>
                          <span>{st.icon}</span> {st.title}
                        </div>
                        <div className={styles.stageDesc}>{st.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Capital & Financials */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeading}>
                  <div className={styles.sectionIcon}><IndianRupee size={20} /></div>
                  2. Capital & Revenue Goals
                </h3>

                <div className={styles.twoCol}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Available Own Capital (₹)</label>
                    <input
                      type="number"
                      required
                      min="5000"
                      step="5000"
                      className={styles.textInput}
                      placeholder="e.g., 100000"
                      value={capital}
                      onChange={(e) => setCapital(e.target.value)}
                    />
                    <div className={styles.capitalPresets}>
                      {CAPITAL_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCapital(preset)}
                          className={`${styles.presetBtn} ${capital === preset ? styles.presetBtnActive : ''}`}
                        >
                          ₹{(parseInt(preset) / 1000).toLocaleString()}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Target Monthly Income (₹)</label>
                    <input
                      type="number"
                      className={styles.textInput}
                      placeholder="e.g., 40000"
                      value={targetRevenue}
                      onChange={(e) => setTargetRevenue(e.target.value)}
                    />
                    <p className={styles.inputHelper}>Your expected monthly take-home profit goal.</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Physical Infrastructure Available */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeading}>
                  <div className={styles.sectionIcon}><Building2 size={20} /></div>
                  3. Available Infrastructure & Assets
                </h3>
                <p className={styles.inputHelper} style={{ marginBottom: '1rem' }}>
                  Select all assets you currently possess to boost your feasibility score.
                </p>

                <div className={styles.checkboxGrid}>
                  {INFRASTRUCTURE_OPTIONS.map((item) => {
                    const isChecked = selectedInfra.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleInfra(item.id)}
                        className={`${styles.checkboxItem} ${isChecked ? styles.checkboxItemChecked : ''}`}
                      >
                        <span className={styles.checkboxIcon}>{item.icon}</span>
                        <span className={styles.checkboxText}>{item.label}</span>
                        {isChecked && (
                          <CheckCircle2 size={18} color="var(--primary)" style={{ marginLeft: 'auto' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Experience & Support */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeading}>
                  <div className={styles.sectionIcon}><Award size={20} /></div>
                  4. Experience & Primary Requirement
                </h3>

                <div className={styles.twoCol}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Experience / Skill Background</label>
                    <select
                      className={styles.selectInput}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <option value="Beginner (Learning the ropes)">Beginner (New to this field)</option>
                      <option value="1-2 years of practical experience">1-2 years of practical experience</option>
                      <option value="3-5+ years seasoned operator">3-5+ years seasoned operator</option>
                      <option value="Family heritage / Traditional lineage">Family heritage / Traditional business</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Top Support Priority Needed</label>
                    <select
                      className={styles.selectInput}
                      value={keyNeed}
                      onChange={(e) => setKeyNeed(e.target.value)}
                    >
                      <option value="Government Subsidy & Bank Loan">Government Subsidy & Bank Loan (PMEGP/Mudra)</option>
                      <option value="Direct Buyer & Mandi Linkage">Direct Buyer & Mandi Linkage (बाजार पहुंच)</option>
                      <option value="Machinery & Vendor Setup">Machinery & Vendor Setup (मशीन व उपकरण)</option>
                      <option value="Financial & Cashflow Management">Financial & Cashflow Management (वित्तीय प्रबंधन)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className={styles.actionButtons}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.primarySubmitBtn}
                >
                  {isSubmitting ? (
                    'Generating Your Personalized Dashboard...'
                  ) : (
                    <>
                      <span>Launch My Personalized Dashboard</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/need-idea')}
                  className={styles.secondaryActionBtn}
                >
                  <span>Want AI to recommend a fresh idea instead? Click here</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Diagnostic Preview */}
          <aside className={styles.previewSticky}>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div className={styles.previewTitle}>
                  <Sparkles size={20} color="var(--primary)" /> Real-Time AI Diagnostic
                </div>
                <span className={styles.liveBadge}>LIVE PREVIEW</span>
              </div>

              {/* Overall Score */}
              <div className={styles.scoreBanner}>
                <div className={styles.scoreInfo}>
                  <h4>Viability Score</h4>
                  <p>
                    {liveScores.overall >= 80 ? '🔥 Highly Feasible' : liveScores.overall >= 60 ? '⚡ Good Potential' : '⚠️ High Caution Needed'}
                  </p>
                </div>
                <div className={styles.scoreCircle}>
                  <span className={styles.scoreNumber}>{liveScores.overall}</span>
                  <span className={styles.scoreUnit}>/ 100</span>
                </div>
              </div>

              {/* KPI Meters */}
              <div className={styles.kpiMeters}>
                <div className={styles.meterRow}>
                  <div className={styles.meterLabelRow}>
                    <span>Market Demand</span>
                    <span style={{ color: 'var(--primary)' }}>{liveScores.demand}%</span>
                  </div>
                  <div className={styles.meterTrack}>
                    <div 
                      className={styles.meterFill} 
                      style={{ width: `${liveScores.demand}%`, background: '#059669' }} 
                    />
                  </div>
                </div>

                <div className={styles.meterRow}>
                  <div className={styles.meterLabelRow}>
                    <span>Capital Adequacy</span>
                    <span style={{ color: liveScores.capital >= 70 ? '#059669' : '#f59e0b' }}>
                      {liveScores.capital}%
                    </span>
                  </div>
                  <div className={styles.meterTrack}>
                    <div 
                      className={styles.meterFill} 
                      style={{ width: `${liveScores.capital}%`, background: liveScores.capital >= 70 ? '#059669' : '#f59e0b' }} 
                    />
                  </div>
                </div>

                <div className={styles.meterRow}>
                  <div className={styles.meterLabelRow}>
                    <span>Infrastructure Readiness</span>
                    <span style={{ color: liveScores.infra >= 60 ? '#059669' : '#3b82f6' }}>
                      {liveScores.infra}%
                    </span>
                  </div>
                  <div className={styles.meterTrack}>
                    <div 
                      className={styles.meterFill} 
                      style={{ width: `${liveScores.infra}%`, background: '#3b82f6' }} 
                    />
                  </div>
                </div>

                <div className={styles.meterRow}>
                  <div className={styles.meterLabelRow}>
                    <span>Operational Risk</span>
                    <span style={{ color: liveScores.risk > 40 ? '#ef4444' : '#059669' }}>
                      {liveScores.risk}%
                    </span>
                  </div>
                  <div className={styles.meterTrack}>
                    <div 
                      className={styles.meterFill} 
                      style={{ width: `${liveScores.risk}%`, background: liveScores.risk > 40 ? '#ef4444' : '#059669' }} 
                    />
                  </div>
                </div>
              </div>

              {/* Schemes Matched Box */}
              <div className={styles.schemesBox}>
                <div className={styles.schemesBoxTitle}>
                  <ShieldCheck size={16} color="var(--primary)" /> Top Matching Subsidies & Schemes
                </div>

                <div className={styles.schemeList}>
                  <div className={styles.schemeItem}>
                    <CheckCircle2 size={16} className={styles.schemeCheck} />
                    <div>
                      <strong>PMEGP Rural Subsidy:</strong> Up to 35% capex subsidy on manufacturing/service projects.
                    </div>
                  </div>

                  <div className={styles.schemeItem}>
                    <CheckCircle2 size={16} className={styles.schemeCheck} />
                    <div>
                      <strong>MUDRA (Kishor/Tarun):</strong> Collateral-free working capital loan up to ₹10 Lakhs.
                    </div>
                  </div>

                  <div className={styles.schemeItem}>
                    <CheckCircle2 size={16} className={styles.schemeCheck} />
                    <div>
                      <strong>NABARD AHIDF / Agri Fund:</strong> 3% interest subvention for rural infrastructure.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Callout */}
            <div className={styles.needHelpCard}>
              <div className={styles.helpIcon}>
                <HelpCircle size={22} />
              </div>
              <div className={styles.helpText}>
                <h5>Need instant AI voice consultation?</h5>
                <p>
                  Use our GrameenSathi Multilingual Voice Assistant directly from your dashboard anytime!
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  IndianRupee, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Landmark, 
  BarChart3, 
  Mic, 
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Target,
  Users
} from 'lucide-react';
import styles from './page.module.css';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import SchemeMatcherModal from '../../components/SchemeMatcherModal';
import RealityCheckModal from '../../components/RealityCheckModal';
import DemandPredictorModal from '../../components/DemandPredictorModal';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import ChatbotWidget from '../../components/ChatbotWidget';

function ExistingBusinessContent() {
  const router = useRouter();
  const { 
    userProfile, 
    setUserProfile, 
    realityScores, 
    setRealityScores,
    setSchemes,
    setTrendingItems,
    isVoiceModalOpen, 
    setIsVoiceModalOpen,
    voiceInitialQuery,
    openVoiceAssistantWithQuery,
    setActiveTab
  } = useDashboard();

  // Local form state
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

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeModal, setActiveModal] = useState<'schemes' | 'reality' | 'demand' | null>(null);

  // Initialize from existing userProfile if available
  useEffect(() => {
    if (userProfile) {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      hasBusiness: true,
      businessIdea: formData.businessIdea,
      location: formData.location,
      capital: formData.capital,
      infrastructure: formData.infrastructure,
      experience: formData.experience
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleNavigateToDashboard = () => {
    setActiveTab('dashboard');
    router.push('/dashboard');
  };

  const capitalVal = parseInt(formData.capital) || (parseInt(userProfile.capital as string) || 50000);
  const revenueVal = parseInt(formData.monthlyRevenue) || Math.round(capitalVal * 0.38);
  const viabilityScore = realityScores?.overall || (formData.businessIdea ? 84 : 75);

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainWrapper}>
        <Header />

        <div className={styles.content}>
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
                onClick={handleNavigateToDashboard}
              >
                <LayoutDashboard size={18} /> Open Live Dashboard
              </button>
            </div>
          </div>

          {/* 2-Column Grid: Form + Diagnostics Toolkit */}
          <div className={styles.layoutGrid}>
            {/* Left Column: Business Setup Form */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <Building2 size={22} color="var(--primary)" />
                Enterprise Details & Operations
              </div>
              <p className={styles.cardSubtitle}>
                Keep your business details updated for accurate AI predictions, loan readiness, and scheme matching.
              </p>

              <form onSubmit={handleSave} className={styles.formGrid}>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Business Name / Unit Name *
                    </label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="e.g., Kisan Dairy Farm & Ghee Unit"
                      value={formData.businessIdea}
                      onChange={e => setFormData({ ...formData, businessIdea: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Business Category / Sector
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

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Location / Village, District *
                    </label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="e.g., Satara, Maharashtra"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Total Capital / Working Investment (₹) *
                    </label>
                    <input 
                      type="number" 
                      className={styles.input} 
                      placeholder="e.g., 150000"
                      value={formData.capital}
                      onChange={e => setFormData({ ...formData, capital: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Estimated Monthly Turnover (₹)
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
                      Current Top Priority / Goal
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

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Infrastructure Available
                    <span className={styles.labelHint}>Land, Shed, 3-Phase Power, Cold Storage, etc.</span>
                  </label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="e.g., 500 sq.ft Shed, 24/7 Water Supply, Single-phase electricity"
                    value={formData.infrastructure}
                    onChange={e => setFormData({ ...formData, infrastructure: e.target.value })}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Years of Experience & Key Skills
                  </label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="e.g., 3 years in cattle feed and milk distribution"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <button type="submit" className={styles.saveBtn}>
                  <CheckCircle2 size={20} /> Save Business Profile & Sync Diagnostics
                </button>

                {savedSuccess && (
                  <div className={styles.successToast}>
                    <CheckCircle2 size={18} />
                    <span>Business details successfully saved! Live dashboard metrics and AI models updated.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: Live Health Radar & Action Toolkit */}
            <div className={styles.sidebarCol}>
              {/* Business Health Card */}
              <div className={styles.healthCard}>
                <div className={styles.healthBadge}>
                  <Sparkles size={14} /> AI Enterprise Health Score
                </div>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreValue}>{viabilityScore}</span>
                  <span className={styles.scoreUnit}>/ 100</span>
                </div>
                <div className={styles.scoreStatus}>
                  {viabilityScore >= 80 ? '🟢 Strong Viability & Bank-Ready' : '🟡 Moderate Risk • Growth Potential'}
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Est. Monthly Run-Rate</span>
                    <span className={styles.metricVal}>₹ {revenueVal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>PMEGP Match Potential</span>
                    <span className={styles.metricVal}>Up to 35%</span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Capital Base</span>
                    <span className={styles.metricVal}>₹ {capitalVal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Local Demand Index</span>
                    <span className={styles.metricVal}>High (82%)</span>
                  </div>
                </div>
              </div>

              {/* Direct Action Toolkit for Existing Business */}
              <div className={styles.toolsCard}>
                <div className={styles.cardTitle}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  Growth & Advisory Toolkit
                </div>

                <div className={styles.toolsList}>
                  {/* Schemes */}
                  <div 
                    className={styles.toolItem}
                    onClick={() => setActiveModal('schemes')}
                  >
                    <div className={styles.toolInfo}>
                      <div className={styles.toolIcon} style={{ background: 'rgba(5, 150, 105, 0.12)', color: 'var(--primary)' }}>
                        <Landmark size={22} />
                      </div>
                      <div>
                        <div className={styles.toolName}>Govt. Subsidies & Loans</div>
                        <div className={styles.toolDesc}>Match PMEGP, MUDRA & state grants</div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="var(--text-muted)" />
                  </div>

                  {/* Reality Check */}
                  <div 
                    className={styles.toolItem}
                    onClick={() => setActiveModal('reality')}
                  >
                    <div className={styles.toolInfo}>
                      <div className={styles.toolIcon} style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-red)' }}>
                        <Target size={22} />
                      </div>
                      <div>
                        <div className={styles.toolName}>Risk & Reality Check</div>
                        <div className={styles.toolDesc}>Analyze competition, infra & demand</div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="var(--text-muted)" />
                  </div>

                  {/* Demand Predictor */}
                  <div 
                    className={styles.toolItem}
                    onClick={() => setActiveModal('demand')}
                  >
                    <div className={styles.toolInfo}>
                      <div className={styles.toolIcon} style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-orange)' }}>
                        <BarChart3 size={22} />
                      </div>
                      <div>
                        <div className={styles.toolName}>Demand & Price Trends</div>
                        <div className={styles.toolDesc}>Forecast upcoming local spikes</div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="var(--text-muted)" />
                  </div>

                  {/* Voice Assistant */}
                  <div 
                    className={styles.toolItem}
                    onClick={() => openVoiceAssistantWithQuery(`How can I scale my ${formData.businessIdea || 'existing business'} in ${formData.location || 'my village'}?`)}
                  >
                    <div className={styles.toolInfo}>
                      <div className={styles.toolIcon} style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent-blue)' }}>
                        <Mic size={22} />
                      </div>
                      <div>
                        <div className={styles.toolName}>AI Voice Advisor (आवाज़)</div>
                        <div className={styles.toolDesc}>Speak in Hindi / Regional dialect</div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="var(--text-muted)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Embedded Modals */}
      {activeModal === 'schemes' && (
        <SchemeMatcherModal 
          isOpen={true} 
          onClose={() => setActiveModal(null)} 
          onMatchComplete={(s) => { setSchemes(s); }} 
        />
      )}
      {activeModal === 'reality' && (
        <RealityCheckModal 
          isOpen={true} 
          onClose={() => setActiveModal(null)} 
          onCheckComplete={(scores) => { setRealityScores(scores); }} 
        />
      )}
      {activeModal === 'demand' && (
        <DemandPredictorModal 
          isOpen={true} 
          onClose={() => setActiveModal(null)} 
          onPredictionComplete={(items) => { setTrendingItems(items); }} 
        />
      )}
      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen}
        initialQuery={voiceInitialQuery}
        onClose={() => setIsVoiceModalOpen(false)}
      />
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

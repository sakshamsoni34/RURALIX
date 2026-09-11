'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  BrainCircuit, 
  FileText, 
  Sparkles, 
  IndianRupee, 
  Building2, 
  Zap, 
  Award, 
  Clock, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import styles from './RealityCheckModal.module.css';
import { useDashboard } from '../context/DashboardContext';

export interface RealityCheckScores {
  demand: number;
  competition: number;
  capital: number;
  profit: number;
  risk: number;
  infra: number;
  overall: number;
}

interface RealityCheckResult {
  scores: RealityCheckScores;
  explanation: string;
}

interface RealityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckComplete: (scores: RealityCheckScores) => void;
  inline?: boolean;
}

const IDEA_PRESETS = [
  '🛒 Retail & Supermart',
  '🌾 Cold Storage & Agro Unit',
  '🛠️ Hardware & Electricals',
  '🚚 Rural Logistics Depot',
  '🏭 Flour & Oil Mill',
  '💻 Digital CSC Kendra'
];

const CAPITAL_PRESETS = [
  { label: '₹50,000', value: '50000' },
  { label: '₹1,50,000', value: '150000' },
  { label: '₹3,50,000', value: '350000' },
  { label: '₹8,00,000+', value: '800000' }
];

const LAND_PRESETS = [
  '🏪 Own Commercial Shop',
  '🏬 Rented Market Space',
  '🏠 Home-Based / Shed',
  '📍 Highway Commercial Plot'
];

const ELECTRICITY_PRESETS = [
  '⚡ 24/7 3-Phase Commercial',
  '🔋 12-16 hrs + Generator Backup',
  '🔌 Domestic Single-Phase',
  '☀️ Solar Hybrid Power'
];

const EXPERIENCE_PRESETS = [
  '🌟 5+ Years Industry Pro',
  '💼 1-3 Years Experience',
  '📚 Trained / Certified',
  '🚀 First-Time Founder'
];

const HOURS_PRESETS = [
  '⏳ Full-time (8-10 hrs/day)',
  '⏳ Heavy (12-14 hrs/day)',
  '⏳ Part-time (4-6 hrs/day)'
];

const CUSTOMERS_PRESETS = [
  '👥 High Traffic (~500+ daily)',
  '👥 Moderate (~200 daily)',
  '👥 Niche / Village (~50-100)'
];

export default function RealityCheckModal({ isOpen, onClose, onCheckComplete, inline = false }: RealityCheckModalProps) {
  const { userProfile, setRealityScores, setActiveTab } = useDashboard();
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  
  const [formData, setFormData] = useState({
    idea: userProfile.businessIdea || '',
    capital: userProfile.capital || '',
    land: '',
    electricity: userProfile.infrastructure || '',
    experience: userProfile.experience || '',
    hours: '',
    customers: ''
  });

  useEffect(() => {
    if (userProfile.businessIdea) {
      setFormData(prev => ({
        ...prev,
        idea: userProfile.businessIdea || prev.idea,
        capital: userProfile.capital || prev.capital,
        electricity: userProfile.infrastructure || prev.electricity,
        experience: userProfile.experience || prev.experience
      }));
    }
  }, [userProfile]);

  const [result, setResult] = useState<RealityCheckResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    try {
      const response = await fetch('/api/reality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setResult(data);
      onCheckComplete(data.scores);
      setRealityScores(data.scores);
      setStep('result');
    } catch (error) {
      setStep('input');
      alert('Failed to run reality check. Please try again.');
    }
  };

  const renderBar = (label: string, value: number, color: string) => (
    <div className={styles.chartRow} key={label}>
      <div className={styles.chartLabel}>{label}</div>
      <div className={styles.chartBarBg}>
        <div className={styles.chartBarFill} style={{ width: `${value}%`, background: color }}></div>
      </div>
      <div className={styles.chartValue}>{value}/100</div>
    </div>
  );

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.modal} ${inline ? styles.inlineModal : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badge}>
            <Sparkles size={13} /> Uncompromising Risk Engine
          </div>
          <h2 className={styles.title}>
            <Target color="#059669" size={26} />
            Business Feasibility & Financial Reality Check
          </h2>
          <p className={styles.subtitle}>
            Stress-test your business model against realistic market saturation, working capital burn, operational constraints, and customer demand.
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
            {/* 1. Business Idea */}
            <div className={styles.sectionCard}>
              <div className={styles.labelRow}>
                <label className={styles.label}>
                  <Target size={17} color="#059669" />
                  Target Business Venture / Proposed Setup
                </label>
                <span className={styles.helperText}>Select a preset or enter your custom venture</span>
              </div>

              <div className={styles.inputWrapper}>
                <Target size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., Commercial Cold Storage & Flour Processing Unit"
                  value={formData.idea}
                  onChange={(e) => setFormData({...formData, idea: e.target.value})}
                  required
                />
              </div>

              {/* Idea Presets */}
              <div className={styles.chipGroup}>
                {IDEA_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.chip} ${formData.idea === preset ? styles.chipActive : ''}`}
                    onClick={() => setFormData({ ...formData, idea: preset })}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Capital & Real Estate (2-col) */}
            <div className={styles.twoColRow}>
              {/* Capital */}
              <div className={styles.sectionCard}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>
                    <IndianRupee size={17} color="#059669" />
                    Available Capital (₹)
                  </label>
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

              {/* Land / Shop */}
              <div className={styles.sectionCard}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>
                    <Building2 size={17} color="#059669" />
                    Land / Shop Availability
                  </label>
                </div>

                <div className={styles.inputWrapper}>
                  <Building2 size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="e.g., Own 1 room, Rented market space"
                    value={formData.land}
                    onChange={(e) => setFormData({...formData, land: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.chipGroup}>
                  {LAND_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.chip} ${formData.land === preset ? styles.chipActive : ''}`}
                      onClick={() => setFormData({ ...formData, land: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Electricity & Experience (2-col) */}
            <div className={styles.twoColRow}>
              {/* Electricity */}
              <div className={styles.sectionCard}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>
                    <Zap size={17} color="#059669" />
                    Electricity & Power Supply
                  </label>
                </div>

                <div className={styles.inputWrapper}>
                  <Zap size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="e.g., 24/7 3-phase, 18 hrs/day"
                    value={formData.electricity}
                    onChange={(e) => setFormData({...formData, electricity: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.chipGroup}>
                  {ELECTRICITY_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.chip} ${formData.electricity === preset ? styles.chipActive : ''}`}
                      onClick={() => setFormData({ ...formData, electricity: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className={styles.sectionCard}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>
                    <Award size={17} color="#059669" />
                    Founder Domain Experience
                  </label>
                </div>

                <div className={styles.inputWrapper}>
                  <Award size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="e.g., 2 years working in trade"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.chipGroup}>
                  {EXPERIENCE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.chip} ${formData.experience === preset ? styles.chipActive : ''}`}
                      onClick={() => setFormData({ ...formData, experience: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Hours & Customer Traffic (2-col) */}
            <div className={styles.twoColRow}>
              {/* Expected Hours */}
              <div className={styles.sectionCard}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>
                    <Clock size={17} color="#059669" />
                    Daily Working Hours
                  </label>
                </div>

                <div className={styles.inputWrapper}>
                  <Clock size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="e.g., 8-10 hours/day"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.chipGroup}>
                  {HOURS_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.chip} ${formData.hours === preset ? styles.chipActive : ''}`}
                      onClick={() => setFormData({ ...formData, hours: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Traffic */}
              <div className={styles.sectionCard}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>
                    <Users size={17} color="#059669" />
                    Local Customer Reach
                  </label>
                </div>

                <div className={styles.inputWrapper}>
                  <Users size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="e.g., 500 households in village"
                    value={formData.customers}
                    onChange={(e) => setFormData({...formData, customers: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.chipGroup}>
                  {CUSTOMERS_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.chip} ${formData.customers === preset ? styles.chipActive : ''}`}
                      onClick={() => setFormData({ ...formData, customers: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button type="submit" className={styles.submitBtn}>
              <BrainCircuit size={22} />
              Calculate Brutal Reality Check & Feasibility Score
            </button>
          </form>
        )}

        {/* Loading State */}
        {step === 'loading' && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <h3 className={styles.loadingTitle}>
              Simulating Market Stress Test...
            </h3>
            <p className={styles.loadingText}>
              Evaluating fixed capital runway, demand saturation, local utility reliability, and operational failure risks for <strong>{formData.idea}</strong>...
            </p>
          </div>
        )}

        {/* Results Screen */}
        {step === 'result' && result && (
          <div className={styles.resultContainer}>
            {/* Hero Result Banner */}
            <div className={styles.overallScoreCard}>
              <div className={styles.scoreInfo}>
                <h3>✨ Feasibility Verdict</h3>
                <h2>{formData.idea}</h2>
                <p>📍 Evaluated with ₹{Number(formData.capital).toLocaleString('en-IN')} working capital</p>
              </div>

              <div className={styles.scoreGaugeBox}>
                <div className={styles.scoreGaugeValue}>{result.scores.overall}%</div>
                <div className={styles.scoreGaugeLabel}>Viability Rating</div>
              </div>
            </div>

            {/* Breakdown Bars Card */}
            <div className={styles.chartsCard}>
              <h4 className={styles.sectionTitle}>
                <TrendingUp size={20} color="#059669" />
                Key Metric Breakdown & Risk Indicators
              </h4>
              <div className={styles.chartsWrapper}>
                {renderBar('Local Market Demand', result.scores.demand, '#10b981')}
                {renderBar('Competition Resistance', result.scores.competition, '#f59e0b')}
                {renderBar('Capital Sufficiency', result.scores.capital, '#059669')}
                {renderBar('Projected Net Margins', result.scores.profit, '#3b82f6')}
                {renderBar('Infrastructure Fit', result.scores.infra, '#06b6d4')}
                {renderBar('Operational Risk Index', result.scores.risk, '#ef4444')}
              </div>
            </div>

            {/* AI Reality Analysis */}
            <div className={styles.explanationBox}>
              <h4 className={styles.sectionTitle}>
                <FileText size={20} color="#059669" />
                Uncompromising Financial & Operational Analysis
              </h4>
              <p>{result.explanation}</p>
            </div>

            {/* Action Buttons */}
            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className={styles.secondaryBtn}
              >
                ← Adjust Constraints & Re-Test
              </button>
              <button 
                type="button"
                onClick={() => {
                  onClose();
                  setActiveTab('dashboard');
                }} 
                className={styles.primaryBtn}
              >
                Apply Score & Return to Dashboard
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

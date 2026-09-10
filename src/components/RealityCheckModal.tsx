'use client';

import { useState } from 'react';
import { X, Target, BrainCircuit, FileText } from 'lucide-react';
import styles from './RealityCheckModal.module.css';

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

export default function RealityCheckModal({ isOpen, onClose, onCheckComplete, inline = false }: RealityCheckModalProps) {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  
  const [formData, setFormData] = useState({
    idea: '',
    capital: '',
    land: '',
    electricity: '',
    experience: '',
    hours: '',
    customers: ''
  });

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
        <div className={styles.chartBarFill} style={{width: `${value}%`, background: color}}></div>
      </div>
      <div className={styles.chartValue}>{value}/100</div>
    </div>
  );

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.modal} ${inline ? styles.inlineModal : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Target className={styles.icon} size={24} color="var(--primary)" />
          Business Reality Check
        </h2>
        {!inline && (
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        )}
      </div>

        <div className={styles.content}>
          {step === 'input' && (
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Business Idea</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., I want to open a flour mill"
                  value={formData.idea}
                  onChange={(e) => setFormData({...formData, idea: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Available Capital (₹)</label>
                <input 
                  type="number" 
                  className={styles.input}
                  placeholder="e.g., 50000"
                  value={formData.capital}
                  onChange={(e) => setFormData({...formData, capital: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Land / Shop Availability</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., Own 1 room, Rented shop"
                  value={formData.land}
                  onChange={(e) => setFormData({...formData, land: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Electricity Supply</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., 18 hours/day, 3-phase"
                  value={formData.electricity}
                  onChange={(e) => setFormData({...formData, electricity: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Your Experience</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., 2 years working in mill"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Expected Working Hours</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., 8 hours/day"
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Local Customer Base</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., 500 households in village"
                  value={formData.customers}
                  onChange={(e) => setFormData({...formData, customers: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroupFull}>
                <button type="submit" className={styles.submitBtn}>
                  <BrainCircuit size={20} />
                  Calculate Feasibility
                </button>
              </div>
            </form>
          )}

          {step === 'loading' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h3 style={{color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem'}}>
                Evaluating Constraints...
              </h3>
              <p className={styles.loadingText}>
                Analyzing competition, demand, and risk factors...
              </p>
            </div>
          )}

          {step === 'result' && result && (
            <div className={styles.resultContainer}>
              <div className={styles.overallScoreCard}>
                <div className={styles.scoreInfo}>
                  <h3>Overall Feasibility</h3>
                  <p>{formData.idea}</p>
                </div>
                <div className={styles.scoreValue}>
                  {result.scores.overall}<span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/100</span>
                </div>
              </div>

              <div className={styles.chartsWrapper}>
                {renderBar('Local Demand', result.scores.demand, 'var(--primary)')}
                {renderBar('Competition', result.scores.competition, 'var(--accent-orange)')}
                {renderBar('Capital Req.', result.scores.capital, 'var(--primary)')}
                {renderBar('Profit Potential', result.scores.profit, 'var(--primary)')}
                {renderBar('Risk Factor', result.scores.risk, 'var(--accent-red)')}
                {renderBar('Infrastructure', result.scores.infra, 'var(--primary)')}
              </div>

              <div className={styles.explanationBox}>
                <h4><FileText size={18} color="var(--primary)" /> AI Analysis</h4>
                <p>{result.explanation}</p>
              </div>

              <button 
                onClick={() => {
                  setStep('input');
                  onClose();
                }} 
                className={styles.submitBtn} 
                style={{background: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--border)'}}
              >
                Close & Update Dashboard
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

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
  BrainCircuit
} from 'lucide-react';
import styles from './AdvisoryModal.module.css';

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

export default function AdvisoryModal({ isOpen, onClose, inline = false }: AdvisoryModalProps) {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  
  const [formData, setFormData] = useState({
    location: '',
    capital: '',
    interests: '',
    infrastructure: ''
  });

  const [result, setResult] = useState<AdvisoryResult | null>(null);

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
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Sprout className={styles.icon} size={24} />
          Hyper-Local Business Intelligence
        </h2>
        {!inline && (
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        )}
      </div>

        <div className={styles.content}>
          {step === 'input' && (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MapPin size={16} style={{display:'inline', marginRight:'4px'}}/> 
                  Village / District
                </label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., Satara, Maharashtra"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <IndianRupee size={16} style={{display:'inline', marginRight:'4px'}}/> 
                  Available Capital (₹)
                </label>
                <input 
                  type="number" 
                  className={styles.input}
                  placeholder="e.g., 80000"
                  value={formData.capital}
                  onChange={(e) => setFormData({...formData, capital: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Lightbulb size={16} style={{display:'inline', marginRight:'4px'}}/> 
                  Current Assets / Interests
                </label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., Have 2 acres of land, interested in dairy"
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Zap size={16} style={{display:'inline', marginRight:'4px'}}/> 
                  Available Infrastructure
                </label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g., 24/7 Electricity, good road connectivity"
                  value={formData.infrastructure}
                  onChange={(e) => setFormData({...formData, infrastructure: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <BrainCircuit size={20} />
                Generate Viability Report
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h3 style={{color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem'}}>
                Analyzing Local Data...
              </h3>
              <p className={styles.loadingText}>
                Evaluating weather patterns, market demand, and local infrastructure...
              </p>
            </div>
          )}

          {step === 'result' && result && (
            <div className={styles.resultContainer}>
              <div className={styles.scoreCard}>
                <div 
                  className={styles.scoreCircle} 
                  style={{'--score-deg': `${result.viabilityScore * 3.6}deg`} as React.CSSProperties}
                >
                  <span className={styles.scoreValue}>{result.viabilityScore}%</span>
                </div>
                <div>
                  <div className={styles.scoreInfo}>
                    <h3>Viability Score</h3>
                    <p>{result.recommendation}</p>
                  </div>
                </div>
              </div>

              <h4 className={styles.sectionTitle}>
                <BrainCircuit size={20} className={styles.icon} />
                AI Analysis
              </h4>
              <p className={styles.analysisText}>{result.analysis}</p>

              <h4 className={styles.sectionTitle}>
                <CheckCircle2 size={20} className={styles.icon} />
                Immediate Action Steps
              </h4>
              <ul className={styles.actionList}>
                {result.actionSteps.map((step, idx) => (
                  <li key={idx} className={styles.actionItem}>
                    <CheckCircle2 size={18} className={styles.actionIcon} />
                    {step}
                  </li>
                ))}
              </ul>

              <button onClick={() => setStep('input')} className={styles.submitBtn} style={{background: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--border)', marginTop: '2rem'}}>
                Run Another Analysis
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

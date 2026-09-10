'use client';

import { useState } from 'react';
import { X, TrendingUp, Search, BarChart3 } from 'lucide-react';
import styles from './DemandPredictorModal.module.css';

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

export default function DemandPredictorModal({ isOpen, onClose, onPredictionComplete, inline = false }: DemandPredictorModalProps) {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [formData, setFormData] = useState({
    location: '',
    season: 'Monsoon',
    festival: ''
  });
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
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BarChart3 className={styles.icon} size={24} color="var(--primary)" />
          Hyper-Local Demand Predictor
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Location (Village/District)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Bhind, Madhya Pradesh" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Current Season / Weather</label>
                <select 
                  className={styles.input}
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                >
                  <option value="Summer">Summer</option>
                  <option value="Monsoon">Monsoon</option>
                  <option value="Winter">Winter</option>
                  <option value="Harvest Season">Harvest Season</option>
                  <option value="Sowing Season">Sowing Season</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Upcoming Local Festival/Event (Optional)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Diwali, Local Mela" 
                  value={formData.festival}
                  onChange={(e) => setFormData({...formData, festival: e.target.value})}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <Search size={18} />
                Run Local Prediction
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h3 style={{color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem'}}>
                Analyzing Market Data...
              </h3>
              <p className={styles.loadingText}>
                Cross-referencing {formData.location} with seasonal trends...
              </p>
            </div>
          )}

          {step === 'result' && result && (
            <div className={styles.resultContainer}>
              <div className={styles.analysisBox}>
                <h4>Market Analysis</h4>
                <p>{result.analysis}</p>
              </div>

              <h3 style={{marginBottom: '1rem', color: 'var(--text-main)'}}>Top Trending Items</h3>
              <div className={styles.trendList}>
                {result.trendingItems.map((item, idx) => (
                  <div key={idx} className={styles.trendCard}>
                    <div className={styles.trendIcon}>
                      <TrendingUp size={24} />
                    </div>
                    <div className={styles.trendInfo}>
                      <h4>{item.name}</h4>
                      <p>{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setStep('input');
                  onClose();
                }} 
                className={styles.submitBtn}
              >
                Done
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

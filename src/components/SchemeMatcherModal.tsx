'use client';

import { useState } from 'react';
import { X, Search, CheckCircle2, FileText, AlertTriangle, Landmark } from 'lucide-react';
import styles from './SchemeMatcherModal.module.css';

export interface Scheme {
  name: string;
  description: string;
  matchPercentage: number;
  eligibilityFactors: string[];
  documents: string[];
  missingRequirements: string[];
}

interface SchemeMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchComplete: (schemes: Scheme[]) => void;
  inline?: boolean;
}

export default function SchemeMatcherModal({ isOpen, onClose, onMatchComplete, inline = false }: SchemeMatcherModalProps) {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [query, setQuery] = useState('');
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setStep('loading');

    try {
      const response = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setSchemes(data.schemes);
      onMatchComplete(data.schemes);
      setStep('result');
    } catch (error) {
      setStep('input');
      alert('Failed to find schemes. Please try again.');
    }
  };

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.modal} ${inline ? styles.inlineModal : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Landmark className={styles.icon} size={24} color="var(--primary)" />
          Government Scheme Matcher
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
            <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>
              Tell us about yourself, your business, and what you need. Our AI will find the best government schemes for you.
            </p>
              <textarea 
                className={styles.textArea}
                placeholder="e.g., I am a woman running a tailoring business in Uttar Pradesh and I need ₹2 lakh for buying new sewing machines..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                <Search size={20} />
                Find My Schemes
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h3 style={{color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem'}}>
                Scanning Government Databases...
              </h3>
              <p className={styles.loadingText}>
                Matching your profile against 100+ active schemes...
              </p>
            </div>
          )}

          {step === 'result' && (
            <div className={styles.resultContainer}>
              <p style={{color: 'var(--text-main)', fontWeight: 500}}>We found these tailored recommendations for you:</p>
              
              {schemes.map((scheme, idx) => (
                <div key={idx} className={styles.schemeCard}>
                  <div className={styles.schemeHeader}>
                    <h3>{scheme.name}</h3>
                    <div className={styles.matchBadge}>{scheme.matchPercentage}% Match</div>
                  </div>
                  <p className={styles.schemeDescription}>{scheme.description}</p>
                  
                  <div className={styles.sectionTitle}>Why it matches:</div>
                  <ul className={styles.list}>
                    {scheme.eligibilityFactors.map((factor, i) => (
                      <li key={i} className={styles.listItem}>
                        <CheckCircle2 size={16} className={styles.checkIcon} />
                        {factor}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.sectionTitle} style={{marginTop: '1.5rem'}}>Documents Required:</div>
                  <ul className={styles.list}>
                    {scheme.documents.map((doc, i) => (
                      <li key={i} className={styles.listItem}>
                        <FileText size={16} className={styles.docIcon} />
                        {doc}
                      </li>
                    ))}
                  </ul>

                  {scheme.missingRequirements && scheme.missingRequirements.length > 0 && (
                    <div className={styles.warningBox}>
                      <div className={styles.warningTitle}>
                        <AlertTriangle size={16} />
                        Missing Requirements
                      </div>
                      {scheme.missingRequirements.map((req, i) => (
                        <div key={i} className={styles.warningItem}>• {req}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button 
                onClick={() => {
                  setStep('input');
                  setQuery('');
                  onClose();
                }} 
                className={styles.submitBtn} 
                style={{background: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--border)', marginTop: '1rem'}}
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

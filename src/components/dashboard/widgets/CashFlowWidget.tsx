'use client';

import { Wallet, Bot } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';

export default function CashFlowWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}><Wallet size={20} color="var(--primary)"/> Daily Cash-Flow Assistant</div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '0.8rem', color: "var(--text-muted)", marginBottom: '0.25rem'}}>Sales</div>
          <div style={{fontSize: '1.2rem', fontWeight: 700, color: "var(--primary)"}}>₹4,850</div>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '0.8rem', color: "var(--text-muted)", marginBottom: '0.25rem'}}>Expenses</div>
          <div style={{fontSize: '1.2rem', fontWeight: 700, color: "var(--accent-red)"}}>₹2,100</div>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '0.8rem', color: "var(--text-muted)", marginBottom: '0.25rem'}}>Net Cash</div>
          <div style={{fontSize: '1.2rem', fontWeight: 800, color: "var(--text-main)"}}>₹2,750</div>
        </div>
      </div>
      
      <div style={{background: "var(--primary-glow)", padding: '1rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start'}}>
        <Bot size={20} color="var(--primary)" style={{marginTop: '2px', flexShrink: 0}} />
        <p style={{fontSize: '0.85rem', color: "var(--text-main)", lineHeight: 1.5, margin: 0}}>
          "Great job today! Your net cash flow has increased <span style={{fontWeight: 700, color: "var(--primary-dark)"}}>12%</span> this week. Keeping daily expenses under ₹2,500 is significantly improving your margins."
        </p>
      </div>
    </div>
  );
}

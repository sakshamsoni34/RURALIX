'use client';

import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';

export default function LoanReadinessWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}><FileText size={20} color="var(--primary)"/> Loan Readiness</div>
      </div>
      <div className={styles.loanReadiness}>
        <div className={styles.gauge}>
          <span>76<small>/ 100</small></span>
        </div>
        <p style={{fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', color: "var(--primary-dark)"}}>
          You are almost finance-ready!
        </p>
        <ul className={styles.checkList}>
          <li><CheckCircle2 size={16} className={styles.checkIcon}/> Good repayment capacity</li>
          <li><CheckCircle2 size={16} className={styles.checkIcon}/> Stable revenue flow</li>
          <li style={{color: "var(--text-muted)"}}><AlertCircle size={16} color="var(--accent-red)"/> No formal business records</li>
          <li style={{color: "var(--text-muted)"}}><AlertCircle size={16} color="var(--accent-red)"/> Irregular cash flow</li>
        </ul>
        <a href="#" className={styles.cardLink} style={{display: 'block', marginTop: '1rem', textAlign: 'center'}}>View Improvement Tips</a>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';
import { useDashboard } from '../../../context/DashboardContext';

export default function LoanReadinessWidget() {
  const router = useRouter();
  const { userProfile, realityScores, setActiveTab } = useDashboard();

  const capitalNum = parseInt(userProfile.capital as string) || 0;
  const hasGoodCapital = capitalNum >= 50000;
  const hasInfra = !!userProfile.infrastructure && userProfile.infrastructure.length > 3;
  const hasExp = !!userProfile.experience && userProfile.experience.length > 3;

  // Calculate readiness score
  const readinessScore = realityScores?.overall || (hasGoodCapital ? 82 : 68);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}><FileText size={20} color="var(--primary)"/> Loan & Subsidy Readiness</div>
      </div>
      <div className={styles.loanReadiness}>
        <div className={styles.gauge}>
          <span>{readinessScore}<small>/ 100</small></span>
        </div>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', color: readinessScore >= 75 ? "var(--primary-dark)" : "#d97706" }}>
          {readinessScore >= 75 ? "Eligible for loans & subsidies!" : "Good foundation — minor documents needed"}
        </p>
        <ul className={styles.checkList}>
          <li>
            <CheckCircle2 size={16} className={styles.checkIcon}/> 
            {hasGoodCapital ? `Good initial capital (₹${capitalNum.toLocaleString('en-IN')})` : 'Eligible for PMEGP 35% subsidy'}
          </li>
          <li>
            <CheckCircle2 size={16} className={styles.checkIcon}/> 
            {hasInfra ? `Premises/infrastructure noted (${userProfile.infrastructure})` : 'Basic facilities available'}
          </li>
          <li style={{ color: hasExp ? "var(--text-main)" : "var(--text-muted)" }}>
            {hasExp ? (
              <CheckCircle2 size={16} className={styles.checkIcon}/>
            ) : (
              <AlertCircle size={16} color="var(--accent-orange)"/>
            )} 
            {hasExp ? `Prior work experience noted` : 'Basic trade training recommended'}
          </li>
          <li>
            <CheckCircle2 size={16} className={styles.checkIcon}/> 
            Eligible for PM MUDRA & PMEGP schemes
          </li>
        </ul>
        <button 
          onClick={() => router.push('/government-schemes')}
          className={styles.cardLink} 
          style={{ display: 'block', width: '100%', marginTop: '1rem', textAlign: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          View Matched Govt Schemes →
        </button>
      </div>
    </div>
  );
}

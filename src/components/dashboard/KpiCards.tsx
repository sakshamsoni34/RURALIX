'use client';

import { Store, TrendingUp, Users, Target as TargetIcon } from 'lucide-react';
import styles from '../../app/dashboard/page.module.css';
import { useDashboard } from '../../context/DashboardContext';

export default function KpiCards() {
  const { userProfile, customers, realityScores, isLoaded } = useDashboard();

  const capitalNum = isLoaded ? (parseInt(userProfile.capital as string) || 0) : 0;
  const activeCustomers = isLoaded ? (customers || 0) : 0;
  // Estimate monthly revenue dynamically from profile capital scale and customer transactions
  const monthlyRevenue = capitalNum > 0 
    ? Math.round(capitalNum * 0.38 + (activeCustomers * 350))
    : (activeCustomers > 0 ? activeCustomers * 30 * 250 : 0);
  
  const totalMonthlyCustomers = activeCustomers * 30;
  const businessName = isLoaded && userProfile.businessIdea ? userProfile.businessIdea : 'Enterprise Hub';
  const locationName = isLoaded && userProfile.location ? userProfile.location.split(',')[0] : 'Local Area';

  // Calculate goals completed based on real profile & reality check
  const goalsCount = isLoaded && userProfile.businessIdea && userProfile.capital 
    ? (realityScores?.overall && realityScores.overall > 0 ? '5/5' : '4/5') 
    : (isLoaded && userProfile.businessIdea ? '3/5' : '1/5');

  return (
    <div className={styles.kpiRow} suppressHydrationWarning>
      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Store size={24} /></div>
          <div className={styles.kpiInfo}>
            <h3>Business Status</h3>
            <div className={styles.kpiValue} style={{ color: 'var(--primary-dark)' }} suppressHydrationWarning>
              {isLoaded && userProfile.hasBusiness ? 'Active' : 'Planning'}
            </div>
            <div className={styles.kpiTrend} title={businessName} suppressHydrationWarning>
              {businessName.length > 22 ? businessName.slice(0, 20) + '...' : businessName}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><TrendingUp size={24} color="var(--accent-blue)" /></div>
          <div className={styles.kpiInfo}>
            <h3>Est. Monthly Revenue</h3>
            <div className={styles.kpiValue} suppressHydrationWarning>
              ₹ {monthlyRevenue.toLocaleString('en-IN')}
            </div>
            <div className={styles.kpiTrend} suppressHydrationWarning>
              ↑ 14% target in {locationName}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Users size={24} color="var(--accent-orange)" /></div>
          <div className={styles.kpiInfo}>
            <h3>Monthly Footfall</h3>
            <div className={styles.kpiValue} suppressHydrationWarning>
              {totalMonthlyCustomers.toLocaleString('en-IN')}
            </div>
            <div className={styles.kpiTrend} suppressHydrationWarning>
              ~{activeCustomers} active daily visits
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><TargetIcon size={24} color="var(--accent-red)" /></div>
          <div className={styles.kpiInfo}>
            <h3>Milestones Completed</h3>
            <div className={styles.kpiValue} suppressHydrationWarning>{goalsCount}</div>
            <span className={styles.cardLink} style={{ cursor: 'default' }} suppressHydrationWarning>
              Viability: {isLoaded && realityScores?.overall ? realityScores.overall : 78}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

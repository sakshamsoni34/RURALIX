'use client';

import { Store, TrendingUp, Users, Target as TargetIcon, ChevronRight } from 'lucide-react';
import styles from '../../app/dashboard/page.module.css';
import { useDashboard } from '../../context/DashboardContext';

export default function KpiCards() {
  const { userProfile, customers, realityScores } = useDashboard();

  const capitalNum = parseInt(userProfile.capital as string) || 60000;
  // Estimate monthly revenue as ~35%-45% of capital scale or base calculation
  const monthlyRevenue = Math.round(capitalNum * 0.42 + (customers * 350));
  const totalMonthlyCustomers = customers * 14;
  const businessName = userProfile.businessIdea || 'Enterprise Hub';
  const locationName = userProfile.location ? userProfile.location.split(',')[0] : 'Local Area';

  // Calculate goals completed based on profile & reality check
  const goalsCount = userProfile.businessIdea && userProfile.capital ? (realityScores?.overall ? '5/5' : '4/5') : '3/5';

  return (
    <div className={styles.kpiRow}>
      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Store size={24} /></div>
          <div className={styles.kpiInfo}>
            <h3>Business Status</h3>
            <div className={styles.kpiValue} style={{ color: 'var(--primary-dark)' }}>
              {userProfile.hasBusiness ? 'Active' : 'Planning'}
            </div>
            <div className={styles.kpiTrend} title={businessName}>
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
            <div className={styles.kpiValue}>
              ₹ {monthlyRevenue.toLocaleString('en-IN')}
            </div>
            <div className={styles.kpiTrend}>
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
            <div className={styles.kpiValue}>
              {totalMonthlyCustomers.toLocaleString('en-IN')}
            </div>
            <div className={styles.kpiTrend}>
              ~{customers} active daily visits
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><TargetIcon size={24} color="var(--accent-red)" /></div>
          <div className={styles.kpiInfo}>
            <h3>Milestones Completed</h3>
            <div className={styles.kpiValue}>{goalsCount}</div>
            <span className={styles.cardLink} style={{ cursor: 'default' }}>
              Viability: {realityScores?.overall || 78}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

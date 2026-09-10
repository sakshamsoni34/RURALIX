'use client';

import { Store, TrendingUp, Users, Target as TargetIcon, ChevronRight } from 'lucide-react';
import styles from '../../app/dashboard/page.module.css';

export default function KpiCards() {
  return (
    <div className={styles.kpiRow}>
      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Store size={24} /></div>
          <div className={styles.kpiInfo}>
            <h3>Business Status</h3>
            <div className={styles.kpiValue} style={{color: 'var(--primary-dark)'}}>Active</div>
            <div className={styles.kpiTrend}>Dairy & Paneer Unit</div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><TrendingUp size={24} color="var(--accent-blue)" /></div>
          <div className={styles.kpiInfo}>
            <h3>Monthly Revenue</h3>
            <div className={styles.kpiValue}>₹ 48,000</div>
            <div className={styles.kpiTrend}>↑ 12% vs last month</div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><Users size={24} color="var(--accent-orange)" /></div>
          <div className={styles.kpiInfo}>
            <h3>Customers</h3>
            <div className={styles.kpiValue}>320</div>
            <div className={styles.kpiTrend}>↑ 8% vs last month</div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}><TargetIcon size={24} color="var(--accent-red)" /></div>
          <div className={styles.kpiInfo}>
            <h3>Goals Achieved</h3>
            <div className={styles.kpiValue}>3 / 5</div>
            <a href="#" className={styles.cardLink}>View Goals <ChevronRight size={14} style={{display:'inline'}}/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

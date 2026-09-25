'use client';

import { LineChart, Sparkles } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';
import { useDashboard } from '../../../context/DashboardContext';

export default function SimulatorWidget() {
  const { customers, setCustomers, userProfile } = useDashboard();
  
  const capitalNum = parseInt(userProfile.capital as string) || 0;
  const activeCustomers = customers || 0;
  // Dynamic unit economics based on capital scale
  const marginPerTransaction = capitalNum > 0 ? Math.max(150, Math.round(capitalNum * 0.008)) : 250;
  const monthlyProfit = activeCustomers * 30 * marginPerTransaction;
  const businessName = userProfile.businessIdea || 'Your Enterprise';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <LineChart size={20} color="var(--primary)"/> Profit Simulator ({businessName})
        </div>
      </div>
      <div className={styles.simulatorControls}>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Adjust daily customer transactions:
        </div>
        <div className={styles.sliderWrapper}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{customers}</span>
          <input 
            type="range" 
            min="10" 
            max="120" 
            value={customers} 
            onChange={(e) => setCustomers(parseInt(e.target.value))}
            className={styles.slider}
          />
          <span style={{ fontSize: '0.85rem', color: "var(--text-muted)" }}>/ day</span>
        </div>
      </div>
      <div className={styles.simResult}>
        <div>
          <div style={{ fontSize: '0.85rem', color: "var(--primary-dark)" }}>Estimated Monthly Net Profit</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: "var(--text-main)" }}>
            ₹ {monthlyProfit.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ color: "var(--primary)", fontWeight: 600, fontSize: '0.9rem' }}>
          ↑ {Math.round((customers / 40) * 100)}% Capacity
        </div>
      </div>
    </div>
  );
}

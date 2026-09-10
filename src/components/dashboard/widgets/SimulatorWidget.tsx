'use client';

import { LineChart } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';
import { useDashboard } from '../../../context/DashboardContext';

export default function SimulatorWidget() {
  const { customers, setCustomers } = useDashboard();
  
  const baseProfitPerCustomer = 850;
  const estimatedProfit = customers * baseProfitPerCustomer;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}><LineChart size={20} color="var(--primary)"/> What If? Simulator</div>
      </div>
      <div className={styles.simulatorControls}>
        <div style={{fontSize: '0.9rem', fontWeight: 500}}>Adjust customers per day:</div>
        <div className={styles.sliderWrapper}>
          <span style={{fontSize: '0.85rem', fontWeight: 600}}>{customers}</span>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={customers} 
            onChange={(e) => setCustomers(parseInt(e.target.value))}
            className={styles.slider}
          />
          <span style={{fontSize: '0.85rem', color: "var(--text-muted)"}}>/ day</span>
        </div>
      </div>
      <div className={styles.simResult}>
        <div>
          <div style={{fontSize: '0.85rem', color: "var(--primary-dark)"}}>Estimated Monthly Profit</div>
          <div style={{fontSize: '1.5rem', fontWeight: 700, color: "var(--text-main)"}}>₹ {estimatedProfit.toLocaleString()}</div>
        </div>
        <div style={{color: "var(--primary)", fontWeight: 600, fontSize: '0.9rem'}}>
          ↑ {Math.round((customers / 50) * 100)}%
        </div>
      </div>
    </div>
  );
}

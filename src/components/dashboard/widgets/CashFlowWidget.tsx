'use client';

import { Wallet, Bot } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';
import { useDashboard } from '../../../context/DashboardContext';

export default function CashFlowWidget() {
  const { userProfile, customers } = useDashboard();

  const capitalNum = parseInt(userProfile.capital as string) || 60000;
  // Dynamic daily financial projections
  const dailyBase = Math.round((capitalNum * 0.4) / 30);
  const dailySales = Math.max(1200, dailyBase + (customers * 120));
  const dailyExpenses = Math.round(dailySales * 0.45);
  const dailyNetCash = dailySales - dailyExpenses;

  const businessName = userProfile.businessIdea || 'your business';
  const locName = userProfile.location || 'your market';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Wallet size={20} color="var(--primary)"/> Daily Cash-Flow Assistant
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: "var(--text-muted)", marginBottom: '0.25rem' }}>Est. Daily Sales</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: "var(--primary)" }}>
            ₹{dailySales.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: "var(--text-muted)", marginBottom: '0.25rem' }}>Est. Expenses</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: "var(--accent-red)" }}>
            ₹{dailyExpenses.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: "var(--text-muted)", marginBottom: '0.25rem' }}>Net Cash Flow</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: "var(--text-main)" }}>
            ₹{dailyNetCash.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
      
      <div style={{ background: "var(--primary-glow)", padding: '1rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <Bot size={20} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <p style={{ fontSize: '0.85rem', color: "var(--text-main)", lineHeight: 1.5, margin: 0 }}>
          "Healthy margin projection for <strong>{businessName}</strong> in <strong>{locName}</strong>! Keeping fixed operational expenses under ₹{dailyExpenses.toLocaleString('en-IN')}/day will maintain your strong <strong>55% gross cash margin</strong>."
        </p>
      </div>
    </div>
  );
}

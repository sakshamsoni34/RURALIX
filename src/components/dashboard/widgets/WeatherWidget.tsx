'use client';

import { Sun, CheckCircle2, MapPin } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';
import { useDashboard } from '../../../context/DashboardContext';

export default function WeatherWidget() {
  const { userProfile } = useDashboard();

  const locationDisplay = userProfile.location || 'Bhind, MP';
  const businessName = userProfile.businessIdea || 'commercial operations';

  return (
    <div className={styles.card}>
      <div className={styles.weatherWidget}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="var(--primary)" /> {locationDisplay}
          </div>
          <div style={{ fontSize: '0.85rem', color: "var(--text-muted)" }}>Humidity: 45%</div>
        </div>
        <div className={styles.temp}>
          <Sun size={40} color="#f59e0b" /> 31°C
        </div>
        <div style={{ fontSize: '0.9rem', color: "var(--text-muted)", marginBottom: '1rem' }}>
          Optimal Market & Trade Conditions
        </div>
        <div className={styles.weatherInsight}>
          <CheckCircle2 size={16} style={{ display: 'inline', marginBottom: '-3px', marginRight: '4px' }} />
          Footfall and supply chain conditions are highly favorable for <strong>{businessName}</strong> in <strong>{locationDisplay.split(',')[0]}</strong> this week.
        </div>
      </div>
    </div>
  );
}

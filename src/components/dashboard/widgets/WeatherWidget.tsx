'use client';

import { Sun, CheckCircle2 } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';

export default function WeatherWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.weatherWidget}>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem'}}>
          <div style={{fontSize: '0.85rem', fontWeight: 600}}>Bhind, MP</div>
          <div style={{fontSize: '0.85rem', color: "var(--text-muted)"}}>Humidity: 42%</div>
        </div>
        <div className={styles.temp}>
          <Sun size={40} /> 32°C
        </div>
        <div style={{fontSize: '0.9rem', color: "var(--text-muted)", marginBottom: '1rem'}}>Sunny</div>
        <div className={styles.weatherInsight}>
          <CheckCircle2 size={16} style={{display:'inline', marginBottom:'-3px'}}/> Weather conditions are favourable for dairy business this week.
        </div>
      </div>
    </div>
  );
}

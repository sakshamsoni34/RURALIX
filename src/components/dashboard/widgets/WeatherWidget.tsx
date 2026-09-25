'use client';

import { useState, useEffect } from 'react';
import { Sun, CloudRain, Cloud, CheckCircle2, MapPin, RefreshCw } from 'lucide-react';
import styles from '../../../app/dashboard/page.module.css';
import { useDashboard } from '../../../context/DashboardContext';

export default function WeatherWidget() {
  const { userProfile } = useDashboard();
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<string>('Favorable');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const locationDisplay = userProfile.location || 'Local Area';
  const businessName = userProfile.businessIdea || 'commercial operations';

  useEffect(() => {
    let isMounted = true;
    const fetchLiveWeather = async () => {
      setIsLoading(true);
      try {
        // Geocode location string or fallback to default coordinates
        let lat = 26.5645;
        let lon = 78.7842;

        if (userProfile.location) {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(userProfile.location)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'RuralixWeather/1.0 (contact@ruralix.app)' }
          });
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (Array.isArray(geoData) && geoData.length > 0) {
              lat = parseFloat(geoData[0].lat);
              lon = parseFloat(geoData[0].lon);
            }
          }
        }

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`);
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          if (isMounted && wData.current) {
            setTemperature(Math.round(wData.current.temperature_2m));
            setHumidity(Math.round(wData.current.relative_humidity_2m));
            
            const code = wData.current.weather_code;
            if (code >= 51 && code <= 67) {
              setWeatherCondition('Rainy / Monsoon');
            } else if (code >= 1 && code <= 3) {
              setWeatherCondition('Partly Cloudy');
            } else if (code === 0) {
              setWeatherCondition('Clear & Sunny');
            } else {
              setWeatherCondition('Good Weather for Business');
            }
          }
        }
      } catch (e) {
        console.warn('Weather fetch error:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLiveWeather();

    return () => {
      isMounted = false;
    };
  }, [userProfile.location]);

  return (
    <div className={styles.card}>
      <div className={styles.weatherWidget}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="var(--primary)" /> {locationDisplay}
          </div>
          <div style={{ fontSize: '0.85rem', color: "var(--text-muted)" }}>
            {humidity !== null ? `Humidity: ${humidity}%` : 'Live Weather'}
          </div>
        </div>
        <div className={styles.temp}>
          {weatherCondition.includes('Rain') ? (
            <CloudRain size={40} color="#0284c7" />
          ) : weatherCondition.includes('Cloud') ? (
            <Cloud size={40} color="#64748b" />
          ) : (
            <Sun size={40} color="#f59e0b" />
          )}
          {temperature !== null ? `${temperature}°C` : (isLoading ? '--°C' : '28°C')}
        </div>
        <div style={{ fontSize: '0.9rem', color: "var(--text-muted)", marginBottom: '1rem' }}>
          {weatherCondition}
        </div>
        <div className={styles.weatherInsight}>
          <CheckCircle2 size={16} style={{ display: 'inline', marginBottom: '-3px', marginRight: '4px' }} />
          Local customer movement and transport conditions in <strong>{locationDisplay.split(',')[0]}</strong> are currently favorable for <strong>{businessName}</strong>.
        </div>
      </div>
    </div>
  );
}

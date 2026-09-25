'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, RefreshCw, Layers, 
  ExternalLink, TrendingUp, Navigation, Store, 
  Sparkles, X, ShieldAlert, Map as MapIcon
} from 'lucide-react';
import styles from './OpportunityMap.module.css';

interface ShopLocation {
  id: string;
  name: string;
  category: 'Retail' | 'Hardware' | 'Agri-Processing' | 'Logistics' | 'Services' | 'Opportunity-Gap';
  lat: number;
  lng: number;
  address: string;
  rating: number;
  reviewsCount: number;
  footfall: 'High' | 'Medium' | 'Low';
  monthlyRevenueEstimate: string;
  competitionLevel: 'High' | 'Moderate' | 'Low' | 'Untapped Gap';
  opportunityScore: number;
  reason: string;
  actionAdvice: string;
  isOpenNow: boolean;
  distanceKm: number;
}

interface MapPayload {
  center: {
    lat: number;
    lng: number;
    displayName: string;
  };
  shops: ShopLocation[];
  radarStats: {
    scannedRadiusKm: number;
    totalShopsFound: number;
    untappedGapsFound: number;
    averageCompetition: string;
    dominantCategory: string;
    highestOpportunityArea: string;
  };
}

export default function OpportunityMap({ location }: { location: string }) {
  const [mapData, setMapData] = useState<MapPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState<ShopLocation | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const fetchMapData = async () => {
    setIsLoading(true);
    setSelectedShop(null);
    try {
      const response = await fetch('/api/opportunity-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: location || 'Bhind, Madhya Pradesh' }),
      });
      const data: MapPayload = await response.json();
      setMapData(data);
    } catch (error) {
      console.error('Failed to fetch map data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Initialize or update Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import leaflet on client-side
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const centerLat = mapData?.center.lat || 26.5645;
      const centerLng = mapData?.center.lng || 78.7842;

      // Initialize map instance if not already initialized
      if (!leafletMapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomControl: false,
        });

        L.control.zoom({ position: 'bottomleft' }).addTo(map);

        leafletMapRef.current = map;
        markersGroupRef.current = L.layerGroup().addTo(map);
      } else {
        leafletMapRef.current.setView([centerLat, centerLng], 14);
      }

      // Manage Tile Layer based on selected style
      if (tileLayerRef.current) {
        leafletMapRef.current.removeLayer(tileLayerRef.current);
      }

      let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      let attribution = '&copy; OpenStreetMap contributors';

      if (mapLayer === 'satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = '&copy; Esri &mdash; Earthstar Geographics';
      }

      const newTileLayer = L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19,
      }).addTo(leafletMapRef.current);

      tileLayerRef.current = newTileLayer;

      // Add Markers
      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();

        const shopsToDisplay = (mapData?.shops || []).filter(shop => {
          if (activeCategory === 'All') return true;
          if (activeCategory === 'Opportunities') return shop.category === 'Opportunity-Gap';
          return shop.category === activeCategory;
        });

        shopsToDisplay.forEach((shop) => {
          const isGap = shop.category === 'Opportunity-Gap';
          const color = isGap ? '#10b981' : (shop.category === 'Retail' ? '#2563eb' : shop.category === 'Hardware' ? '#d97706' : shop.category === 'Logistics' ? '#7c3aed' : shop.category === 'Agri-Processing' ? '#059669' : '#0891b2');
          const emoji = isGap ? '⭐' : (shop.category === 'Retail' ? '🏪' : shop.category === 'Hardware' ? '🛠️' : shop.category === 'Logistics' ? '🚚' : shop.category === 'Agri-Processing' ? '🏭' : '💻');

          const customIcon = L.divIcon({
            className: 'custom-gis-pin',
            html: `
              <div style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                transform: translate(-50%, -100%);
                cursor: pointer;
              ">
                <div style="
                  background: ${color};
                  color: white;
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 16px;
                  box-shadow: 0 4px 12px ${color}88, 0 0 0 2px white;
                  transition: transform 0.2s ease;
                ">
                  ${emoji}
                </div>
                <div style="
                  background: #1e293b;
                  color: #ffffff;
                  font-size: 11px;
                  font-weight: 600;
                  padding: 2px 7px;
                  border-radius: 4px;
                  white-space: nowrap;
                  margin-top: 4px;
                  border: 1px solid rgba(255,255,255,0.25);
                  box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                ">
                  ${shop.name.length > 20 ? shop.name.slice(0, 19) + '...' : shop.name}
                </div>
              </div>
            `,
            iconSize: [36, 50],
            iconAnchor: [18, 50],
          });

          const marker = L.marker([shop.lat, shop.lng], { icon: customIcon });
          marker.on('click', () => {
            setSelectedShop(shop);
            leafletMapRef.current?.setView([shop.lat, shop.lng], 15, { animate: true });
          });

          markersGroupRef.current.addLayer(marker);
        });
      }
    });

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersGroupRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [mapData, mapLayer, activeCategory]);

  const categories = [
    { label: 'All Locations', value: 'All', count: mapData?.shops.length || 0 },
    { label: '⭐ Untapped Opportunity Voids', value: 'Opportunities', count: mapData?.shops.filter(s => s.category === 'Opportunity-Gap').length || 0 },
    { label: '🏪 Retail & Kirana', value: 'Retail', count: mapData?.shops.filter(s => s.category === 'Retail').length || 0 },
    { label: '🏭 Agro-Processing', value: 'Agri-Processing', count: mapData?.shops.filter(s => s.category === 'Agri-Processing').length || 0 },
    { label: '🛠️ Hardware & Tools', value: 'Hardware', count: mapData?.shops.filter(s => s.category === 'Hardware').length || 0 },
    { label: '🚚 Logistics Hubs', value: 'Logistics', count: mapData?.shops.filter(s => s.category === 'Logistics').length || 0 },
    { label: '💻 Services & CSC', value: 'Services', count: mapData?.shops.filter(s => s.category === 'Services').length || 0 },
  ];

  return (
    <div className={styles.mapWrapper}>
      {/* External Leaflet CSS */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Header */}
      <div className={styles.mapHeader}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>
            <MapIcon color="var(--primary)" size={24} />
            Real-Time World & Local Shop Map
          </h2>
          <p className={styles.subtitle}>
            <MapPin size={14} color="var(--primary)" />
            Live map & verified commercial locations for: <strong>{mapData?.center.displayName || location}</strong>
          </p>
        </div>

        <div className={styles.headerActions}>
          {/* Layer Selector: Clean Street & Satellite */}
          <div className={styles.layerSelector}>
            <button 
              className={`${styles.layerBtn} ${mapLayer === 'street' ? styles.layerBtnActive : ''}`}
              onClick={() => setMapLayer('street')}
            >
              <Store size={14} /> Street Map
            </button>
            <button 
              className={`${styles.layerBtn} ${mapLayer === 'satellite' ? styles.layerBtnActive : ''}`}
              onClick={() => setMapLayer('satellite')}
            >
              <Layers size={14} /> Satellite View
            </button>
          </div>

          <button 
            className={styles.generateBtn} 
            onClick={fetchMapData}
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? styles.spinnerIcon : ''} />
            Refresh Map Data
          </button>
        </div>
      </div>

      {/* Live Area Summary HUD */}
      {mapData && (
        <div className={styles.statsHud}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Area Radius</span>
            <span className={styles.hudValue}>
              <TrendingUp size={15} color="#10b981" /> {mapData.radarStats.scannedRadiusKm} km Radius
            </span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Shops Found</span>
            <span className={styles.hudValue}>
              <Store size={15} color="#2563eb" /> {mapData.radarStats.totalShopsFound} Local Shops
            </span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>High Opportunity Gaps</span>
            <span className={styles.hudValue} style={{ color: '#059669' }}>
              <Sparkles size={15} color="#059669" /> {mapData.radarStats.untappedGapsFound} Business Gaps
            </span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Competition Level</span>
            <span className={styles.hudValue}>
              <ShieldAlert size={15} color="#d97706" /> {mapData.radarStats.averageCompetition}
            </span>
          </div>
        </div>
      )}

      {/* Filter Chips Bar */}
      <div className={styles.filterBar}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`${styles.filterChip} ${activeCategory === cat.value ? styles.filterChipActive : ''}`}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Interactive Map Frame */}
      <div className={styles.mapContainer}>
        {/* Leaflet map container */}
        <div ref={mapContainerRef} className={styles.leafletWrapper} />

        {/* Loading Spinner */}
        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p style={{ fontWeight: 600 }}>Loading local map and shops for {location}...</p>
          </div>
        )}

        {/* Shop Details Panel */}
        {selectedShop && (
          <div className={styles.panelOverlay}>
            <div className={styles.panelHeader}>
              <div>
                <h3>{selectedShop.name}</h3>
                <p>
                  <MapPin size={13} color="var(--primary)" /> 
                  {selectedShop.address} ({selectedShop.distanceKm} km away)
                </p>
              </div>
              <button 
                className={styles.closePanel} 
                onClick={() => setSelectedShop(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.badgeRow}>
              <span className={styles.categoryBadge} style={{
                backgroundColor: selectedShop.category === 'Opportunity-Gap' ? '#d1fae5' : '#e0f2fe',
                color: selectedShop.category === 'Opportunity-Gap' ? '#065f46' : '#0369a1'
              }}>
                {selectedShop.category}
              </span>
              <span className={styles.opportunityBadge}>
                {selectedShop.opportunityScore}/100 Opportunity Score
              </span>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricBox}>
                <label>Estimated Footfall</label>
                <span>{selectedShop.footfall}</span>
              </div>
              <div className={styles.metricBox}>
                <label>Est. Monthly Revenue</label>
                <span>{selectedShop.monthlyRevenueEstimate}</span>
              </div>
              <div className={styles.metricBox}>
                <label>Local Competition</label>
                <span>{selectedShop.competitionLevel}</span>
              </div>
              <div className={styles.metricBox}>
                <label>Customer Rating</label>
                <span>⭐ {selectedShop.rating} ({selectedShop.reviewsCount} reviews)</span>
              </div>
            </div>

            <div className={styles.analysisSection}>
              <h4>Market Insight</h4>
              <p style={{ margin: 0 }}>{selectedShop.reason}</p>
            </div>

            <div className={styles.analysisSection} style={{ backgroundColor: 'var(--primary-glow)', borderColor: 'var(--primary)' }}>
              <h4 style={{ color: 'var(--primary)' }}>Tip for Your Business</h4>
              <p style={{ margin: 0, fontWeight: 500 }}>{selectedShop.actionAdvice}</p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedShop.lat},${selectedShop.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionButton}
            >
              <Navigation size={16} />
              Open in Google Maps
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

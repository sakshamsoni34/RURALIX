'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  Layers, 
  ExternalLink, 
  TrendingUp, 
  Store, 
  Sparkles, 
  X, 
  ShieldAlert, 
  Navigation,
  ArrowLeft,
  Menu,
  Sprout,
  Compass,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import Sidebar from '../../components/dashboard/Sidebar';
import styles from './page.module.css';

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

function OpportunityMapContent() {
  const router = useRouter();
  const { userProfile, setIsMenuOpen, showToast } = useDashboard();
  
  const [searchQuery, setSearchQuery] = useState(userProfile?.location || 'Gurugram, Haryana, India');
  const [activeLocation, setActiveLocation] = useState(userProfile?.location || 'Gurugram, Haryana, India');
  const [mapData, setMapData] = useState<MapPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState<ShopLocation | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [mapMode, setMapMode] = useState<'google-street' | 'google-satellite' | 'google-terrain' | 'google-embed'>('google-street');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const fetchMapData = async (locToFetch: string) => {
    setIsLoading(true);
    setSelectedShop(null);
    try {
      const response = await fetch('/api/opportunity-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: locToFetch || 'Gurugram, Haryana, India' }),
      });
      const data: MapPayload = await response.json();
      setMapData(data);
    } catch (error) {
      console.error('Failed to fetch map data', error);
      showToast('Could not load map radar. Retrying with fallback...', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData(activeLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveLocation(searchQuery.trim());
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      showToast('Detecting your GPS coordinates...', 'info');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          setActiveLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          showToast('GPS location acquired!', 'success');
        },
        () => {
          showToast('GPS access denied. Using Gurugram, Haryana as default.', 'info');
          setActiveLocation('Gurugram, Haryana, India');
        }
      );
    }
  };

  // Initialize or update interactive Leaflet Map with Google Maps Tiles
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapMode === 'google-embed') return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const centerLat = mapData?.center.lat || 28.4595;
      const centerLng = mapData?.center.lng || 77.0266;

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

      // Switch Google Maps Tile Layer
      if (tileLayerRef.current) {
        leafletMapRef.current.removeLayer(tileLayerRef.current);
      }

      // Official Google Maps Tile Server URLs
      let tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'; // Google Street
      let attribution = '&copy; Google Maps contributors';

      if (mapMode === 'google-satellite') {
        tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Google Hybrid / Satellite
      } else if (mapMode === 'google-terrain') {
        tileUrl = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'; // Google Terrain
      }

      const newTileLayer = L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 20,
      }).addTo(leafletMapRef.current);

      tileLayerRef.current = newTileLayer;

      // Render Map Pins
      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();

        const shopsToDisplay = (mapData?.shops || []).filter(shop => {
          if (activeCategory === 'All') return true;
          if (activeCategory === 'Opportunities') return shop.category === 'Opportunity-Gap';
          return shop.category === activeCategory;
        });

        shopsToDisplay.forEach((shop) => {
          const isGap = shop.category === 'Opportunity-Gap';
          const color = isGap ? '#059669' : (shop.category === 'Retail' ? '#2563eb' : shop.category === 'Hardware' ? '#d97706' : shop.category === 'Agri-Processing' ? '#166534' : '#7c3aed');
          const emoji = isGap ? '⭐' : (shop.category === 'Retail' ? '🏪' : shop.category === 'Hardware' ? '🛠️' : shop.category === 'Agri-Processing' ? '🥛' : '🚚');

          const customIcon = L.divIcon({
            className: 'custom-google-pin',
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
                  width: 38px;
                  height: 38px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 17px;
                  box-shadow: 0 4px 14px ${color}99, 0 0 0 3px white;
                  transition: transform 0.2s ease;
                ">
                  ${emoji}
                </div>
                <div style="
                  background: #0f172a;
                  color: #ffffff;
                  font-size: 11px;
                  font-weight: 700;
                  padding: 3px 8px;
                  border-radius: 6px;
                  white-space: nowrap;
                  margin-top: 4px;
                  border: 1px solid rgba(255,255,255,0.3);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                ">
                  ${shop.name.length > 22 ? shop.name.slice(0, 20) + '...' : shop.name}
                </div>
              </div>
            `,
            iconSize: [38, 52],
            iconAnchor: [19, 52],
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
  }, [mapData, mapMode, activeCategory]);

  const categories = [
    { label: 'All Businesses', value: 'All', count: mapData?.shops.length || 0 },
    { label: '⭐ Untapped Gaps', value: 'Opportunities', count: mapData?.shops.filter(s => s.category === 'Opportunity-Gap').length || 0 },
    { label: '🥛 Dairy & Processing', value: 'Agri-Processing', count: mapData?.shops.filter(s => s.category === 'Agri-Processing').length || 0 },
    { label: '🏪 Retail & Kirana', value: 'Retail', count: mapData?.shops.filter(s => s.category === 'Retail').length || 0 },
    { label: '🛠️ Hardware & Tools', value: 'Hardware', count: mapData?.shops.filter(s => s.category === 'Hardware').length || 0 },
    { label: '🚚 Logistics Hubs', value: 'Logistics', count: mapData?.shops.filter(s => s.category === 'Logistics').length || 0 },
    { label: '💻 Services & CSC', value: 'Services', count: mapData?.shops.filter(s => s.category === 'Services').length || 0 },
  ];

  const filteredShops = (mapData?.shops || []).filter(shop => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Opportunities') return shop.category === 'Opportunity-Gap';
    return shop.category === activeCategory;
  });

  return (
    <div className={styles.container}>
      {/* External Leaflet CSS */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <Sidebar />

      <main className={styles.mainWrapper}>
        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              onClick={() => setIsMenuOpen(prev => !prev)}
              className={styles.hamburgerBtn}
              aria-label="Navigation Menu"
            >
              <Menu size={22} />
            </button>

            <div 
              className={styles.brandTitle}
              onClick={() => router.push('/dashboard')}
              title="Return to GrameenSathi Dashboard"
            >
              <Sprout size={24} color="#059669" />
              <span>Grameen<strong>Sathi</strong></span>
            </div>

            {/* Location Search Form */}
            <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search city, district, or village in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button 
                type="button" 
                onClick={handleDetectLocation} 
                className={styles.detectBtn}
                title="Detect GPS Location"
              >
                <LocateFixed size={13} /> GPS
              </button>
            </form>
          </div>

          <div className={styles.headerRight}>
            {/* Google Map Mode Selector */}
            <div className={styles.layerSelector}>
              <button 
                type="button"
                className={`${styles.layerBtn} ${mapMode === 'google-street' ? styles.layerBtnActive : ''}`}
                onClick={() => setMapMode('google-street')}
              >
                🗺️ Google Street
              </button>
              <button 
                type="button"
                className={`${styles.layerBtn} ${mapMode === 'google-satellite' ? styles.layerBtnActive : ''}`}
                onClick={() => setMapMode('google-satellite')}
              >
                🛰️ Satellite
              </button>
              <button 
                type="button"
                className={`${styles.layerBtn} ${mapMode === 'google-embed' ? styles.layerBtnActive : ''}`}
                onClick={() => setMapMode('google-embed')}
              >
                📍 Google Embed
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => router.push('/dashboard')}
              className={styles.backBtn}
            >
              <ArrowLeft size={16} /> Back to Studio
            </button>
          </div>
        </header>

        {/* HUD Telemetry & Filter Bar */}
        <div className={styles.hudBar}>
          <div className={styles.hudStats}>
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Active Radar:</span>
              <span className={styles.hudValue}>
                <MapPin size={14} color="#059669" /> 
                {mapData?.center.displayName || activeLocation}
              </span>
            </div>
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Businesses Found:</span>
              <span className={styles.hudValue}>
                <Store size={14} color="#2563eb" /> 
                {mapData?.radarStats.totalShopsFound || 0} Units
              </span>
            </div>
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>High-Profit Gaps:</span>
              <span className={styles.hudValue} style={{ color: '#059669' }}>
                <Sparkles size={14} color="#059669" /> 
                {mapData?.radarStats.untappedGapsFound || 0} Voids
              </span>
            </div>
          </div>

          {/* Filter Chips */}
          <div className={styles.filterChips}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.chip} ${activeCategory === cat.value ? styles.chipActive : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area (Split List + Interactive Map) */}
        <div className={styles.mapContentArea}>
          
          {/* Left Column: Nearby Businesses List */}
          <aside className={styles.shopsSidebar}>
            <div className={styles.sidebarTitleRow}>
              <h3 className={styles.sidebarHeading}>
                Nearby Businesses ({filteredShops.length})
              </h3>
              <button 
                type="button" 
                onClick={() => fetchMapData(activeLocation)} 
                className={styles.detectBtn}
                title="Refresh Map Telemetry"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            <div className={styles.shopsScrollList}>
              {filteredShops.map((shop) => (
                <div 
                  key={shop.id}
                  onClick={() => {
                    setSelectedShop(shop);
                    if (leafletMapRef.current) {
                      leafletMapRef.current.setView([shop.lat, shop.lng], 15, { animate: true });
                    }
                  }}
                  className={`${styles.shopCardItem} ${selectedShop?.id === shop.id ? styles.shopCardActive : ''}`}
                >
                  <div className={styles.shopTopRow}>
                    <h4 className={styles.shopName}>{shop.name}</h4>
                    <span className={`
                      ${styles.categoryTag} 
                      ${shop.category === 'Opportunity-Gap' ? styles.tagGap : shop.category === 'Retail' ? styles.tagRetail : shop.category === 'Agri-Processing' ? styles.tagAgri : styles.tagHardware}
                    `}>
                      {shop.category}
                    </span>
                  </div>

                  <div className={styles.shopMetaRow}>
                    <span>📍 {shop.distanceKm} km away</span>
                    <span>⭐ {shop.rating} ({shop.reviewsCount} reviews)</span>
                    <span>👥 {shop.footfall} Traffic</span>
                  </div>

                  <div className={styles.shopRevenueRow}>
                    <span style={{ color: 'var(--text-muted)' }}>Est. Monthly:</span>
                    <span className={styles.revenueBadge}>{shop.monthlyRevenueEstimate}</span>
                  </div>

                  <div className={styles.shopActionRow}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name)}+${shop.lat},${shop.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.gmapsDirectBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Navigation size={13} color="#2563eb" /> Open in Google Maps
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Right Column: Google Map Canvas */}
          <div className={styles.mapCanvasContainer}>
            {isLoading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  Loading Google Maps business radar for {activeLocation}...
                </p>
              </div>
            )}

            {mapMode === 'google-embed' ? (
              <iframe 
                src={`https://www.google.com/maps?q=${encodeURIComponent(activeLocation)}+commercial+enterprises&output=embed`}
                className={styles.googleEmbedFrame}
                title="Google Maps Live View"
                loading="lazy"
              />
            ) : (
              <div ref={mapContainerRef} className={styles.leafletMapTarget} />
            )}

            {/* Selected Business Dossier Floating Panel */}
            {selectedShop && (
              <div className={styles.dossierFloatingPanel}>
                <div className={styles.dossierHeader}>
                  <div>
                    <h3 className={styles.dossierTitle}>{selectedShop.name}</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      📍 {selectedShop.address} ({selectedShop.distanceKm} km away)
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedShop(null)} 
                    className={styles.closeDossierBtn}
                    aria-label="Close dossier"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className={styles.dossierGrid}>
                  <div className={styles.dossierItem}>
                    <label>Footfall Traffic</label>
                    <span>{selectedShop.footfall} Daily</span>
                  </div>
                  <div className={styles.dossierItem}>
                    <label>Est. Revenue</label>
                    <span style={{ color: '#059669' }}>{selectedShop.monthlyRevenueEstimate}</span>
                  </div>
                  <div className={styles.dossierItem}>
                    <label>Competition</label>
                    <span>{selectedShop.competitionLevel}</span>
                  </div>
                  <div className={styles.dossierItem}>
                    <label>Opportunity Score</label>
                    <span style={{ color: '#2563eb' }}>{selectedShop.opportunityScore}/100</span>
                  </div>
                </div>

                <div className={styles.dossierAdviceBox}>
                  <strong>Action Strategy:</strong> {selectedShop.actionAdvice}
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedShop.name)}+${selectedShop.lat},${selectedShop.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dossierGmapsAction}
                >
                  <Navigation size={16} />
                  Open Live Location in Google Maps
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function OpportunityMapPage() {
  return (
    <DashboardProvider>
      <Suspense fallback={<div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>Loading Google Maps...</div>}>
        <OpportunityMapContent />
      </Suspense>
    </DashboardProvider>
  );
}

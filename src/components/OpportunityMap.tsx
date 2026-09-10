'use client';

import { useState, useEffect } from 'react';
import { Map, MapPin, X, RefreshCw } from 'lucide-react';
import styles from './OpportunityMap.module.css';

interface MapNode {
  zone: string;
  businessType: string;
  level: 'High' | 'Medium' | 'Low';
  reason: string;
  x: number;
  y: number;
}

export default function OpportunityMap({ location }: { location: string }) {
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  const fetchMapData = async () => {
    setIsLoading(true);
    setSelectedNode(null);
    try {
      const response = await fetch('/api/opportunity-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });
      const data = await response.json();
      setNodes(data);
    } catch (error) {
      console.error('Failed to fetch map data');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getColor = (level: string) => {
    switch (level) {
      case 'High': return '#10b981'; // Green
      case 'Medium': return '#f59e0b'; // Yellow
      case 'Low': return '#ef4444'; // Red
      default: return '#94a3b8';
    }
  };

  const getBadgeStyle = (level: string) => {
    const color = getColor(level);
    return {
      background: `${color}20`, // 20% opacity
      color: color,
      border: `1px solid ${color}40`
    };
  };

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.mapHeader}>
        <h2 className={styles.title}>
          <Map color="var(--primary)" />
          Regional Opportunity Radar
        </h2>
        <button 
          className={styles.generateBtn} 
          onClick={fetchMapData}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? styles.spinnerIcon : ''} />
          Scan Area
        </button>
      </div>

      <div className={styles.mapContainer}>
        <div className={styles.gridOverlay}></div>
        <div className={styles.radarSweep}></div>

        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Scanning geographical data for {location}...</p>
          </div>
        )}

        {!isLoading && nodes.map((node, idx) => (
          <div 
            key={idx} 
            className={styles.node} 
            style={{ left: `${node.x}%`, top: `${node.y}%`, color: getColor(node.level) }}
            onClick={() => setSelectedNode(node)}
          >
            <div className={styles.nodeDot}></div>
            <div className={styles.nodeLabel}>{node.businessType}</div>
          </div>
        ))}

        {selectedNode && (
          <div className={styles.panelOverlay}>
            <div className={styles.panelHeader}>
              <div>
                <h3>{selectedNode.businessType}</h3>
                <p><MapPin size={12} style={{display: 'inline'}}/> {selectedNode.zone}</p>
              </div>
              <button className={styles.closePanel} onClick={() => setSelectedNode(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.levelBadge} style={getBadgeStyle(selectedNode.level)}>
              {selectedNode.level} Opportunity
            </div>

            <p className={styles.panelReason}>
              {selectedNode.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

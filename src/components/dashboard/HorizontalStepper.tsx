'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Lock, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import styles from './HorizontalStepper.module.css';

export default function HorizontalStepper() {
  const { 
    activeTab, 
    setActiveTab, 
    userProfile, 
    realityScores, 
    trendingItems,
    showToast
  } = useDashboard();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTab = mounted ? activeTab : 'ai-recommendation';
  const isStep1Done = mounted && Boolean(userProfile?.businessIdea?.trim());
  const isStep2Done = mounted && Boolean(realityScores?.overall && realityScores.overall > 0);
  const isStep3Done = mounted && Boolean(trendingItems && trendingItems.length > 0);
  const businessIdea = mounted && userProfile?.businessIdea ? userProfile.businessIdea : '';
  const currentViability = mounted && realityScores?.overall ? realityScores.overall : 0;

  const handleStepClick = (stepIndex: 1 | 2 | 3) => {
    if (stepIndex === 1) {
      setActiveTab('ai-recommendation');
    } else if (stepIndex === 2) {
      const hasStep1 = Boolean(userProfile?.businessIdea?.trim());
      if (!hasStep1) {
        showToast('Please complete Step 1 (Business Planning) first to check feasibility.', 'warning');
      } else {
        setActiveTab('reality-check');
      }
    } else if (stepIndex === 3) {
      const hasStep1 = Boolean(userProfile?.businessIdea?.trim());
      const hasStep2 = Boolean(realityScores?.overall && realityScores.overall > 0);
      if (!hasStep1) {
        showToast('Please complete Step 1 (Business Planning) first before checking market demand.', 'warning');
      } else if (!hasStep2) {
        showToast('Please complete Step 2 (Reality Check) first to check market demand.', 'warning');
      } else {
        setActiveTab('demand');
      }
    }
  };

  return (
    <div className={styles.stepperCard} suppressHydrationWarning>
      {/* Top Banner Row */}
      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <div className={styles.badgePill}>
            <Sparkles size={13} />
            <span>3 Simple Steps to Start</span>
          </div>
          <h2 className={styles.stageHeading}>
            {currentTab === 'ai-recommendation' && 'Step 1: Business Idea & Plan'}
            {currentTab === 'reality-check' && 'Step 2: Reality & Feasibility Check'}
            {currentTab === 'demand' && 'Step 3: Local Demand & Stock Planning'}
            {currentTab === 'dashboard' && 'My Business Dashboard'}
            {currentTab === 'map' && 'Village Opportunity Map'}
            {currentTab === 'help' && 'Help & Support'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {isStep1Done && isStep2Done && isStep3Done && currentTab !== 'dashboard' && (
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '30px',
                padding: '0.5rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(5, 150, 105, 0.35)',
                transition: 'transform 0.2s ease'
              }}
              title="All 3 steps complete! Click to view your dashboard"
            >
              <span>🎉 Open Dashboard</span>
              <ChevronRight size={16} />
            </button>
          )}

          {businessIdea && (
            <div 
              className={styles.activeFocusPill} 
              onClick={() => setActiveTab('ai-recommendation')} 
              title="Click to review or modify business idea"
            >
              <span className={styles.focusDot}></span>
              <span className={styles.focusLabel}>Selected Business:</span>
              <strong className={styles.focusText}>
                {businessIdea}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Connected Step Progression */}
      <div className={styles.stepperTrack}>
        
        {/* STEP 1: AI Business Planner */}
        <div 
          onClick={() => handleStepClick(1)}
          className={[
            styles.stepCard,
            currentTab === 'ai-recommendation' ? styles.stepCardActive : '',
            isStep1Done ? styles.stepCompleted : ''
          ].filter(Boolean).join(' ')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStepClick(1)}
        >
          {/* 3D Glossy Blue Circular Badge */}
          <div className={styles.glossyNode}>
            <div className={`${styles.glossyInnerDisk} ${styles.diskBlue}`}>
              <div className={styles.glassReflection}></div>
              <span className={styles.stepLabelTop}>STEP</span>
              <span className={styles.stepNumberMain}>1</span>
            </div>
            {isStep1Done && (
              <div className={styles.nodeCheckMark} title="Step 1 Completed">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className={styles.stepInfo}>
            <div className={styles.metaRow}>
              <span className={styles.stepCategoryTag}>Step 1</span>
              {isStep1Done ? (
                <span className={`${styles.statusPill} ${styles.statusPillDone}`}>Completed ✓</span>
              ) : currentTab === 'ai-recommendation' ? (
                <span className={`${styles.statusPill} ${styles.statusPillActive}`}>In Progress</span>
              ) : (
                <span className={`${styles.statusPill} ${styles.statusPillActive}`}>Start Here</span>
              )}
            </div>
            <h3 className={styles.cardTitle}>Business Idea & Plan</h3>
            <span className={styles.cardSubtitle}>Plan your budget & business idea</span>
          </div>
        </div>

        {/* Curved 3D Arrow 1 -> 2 */}
        <div className={styles.arrowConnector} aria-hidden="true">
          <svg className={styles.curvedArrowSvg} viewBox="0 0 60 40" fill="none">
            {/* 3D Curved Arrow Shape */}
            <path
              d="M 6 30 C 14 10, 32 8, 48 18 L 45 10 L 56 21 L 43 28 L 47 21 C 32 12, 16 15, 8 32 Z"
              className={isStep1Done ? styles.arrowPathActive : styles.arrowPathInactive}
            />
          </svg>
        </div>

        {/* STEP 2: Reality Check */}
        <div 
          onClick={() => handleStepClick(2)}
          className={[
            styles.stepCard,
            currentTab === 'reality-check' ? styles.stepCardActive : '',
            isStep2Done ? styles.stepCompleted : '',
            !isStep1Done ? styles.stepLocked : ''
          ].filter(Boolean).join(' ')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStepClick(2)}
          title={!isStep1Done ? 'Complete Step 1 (Business Planning) to unlock' : 'Reality & Feasibility Check'}
        >
          {/* 3D Glossy Red/Crimson Circular Badge */}
          <div className={styles.glossyNode}>
            <div className={`${styles.glossyInnerDisk} ${!isStep1Done ? styles.diskLocked : styles.diskRed}`}>
              <div className={styles.glassReflection}></div>
              <span className={styles.stepLabelTop}>STEP</span>
              <span className={styles.stepNumberMain}>2</span>
            </div>
            {!isStep1Done ? (
              <div className={styles.nodeLockBadge} title="Locked - Requires Step 1">
                <Lock size={12} strokeWidth={2.5} />
              </div>
            ) : isStep2Done ? (
              <div className={styles.nodeCheckMark} title="Step 2 Completed">
                <Check size={14} strokeWidth={3} />
              </div>
            ) : null}
          </div>

          {/* Details Column */}
          <div className={styles.stepInfo}>
            <div className={styles.metaRow}>
              <span className={styles.stepCategoryTag}>Step 2</span>
              {!isStep1Done ? (
                <span className={`${styles.statusPill} ${styles.statusPillLocked}`}>🔒 Locked</span>
              ) : isStep2Done ? (
                <span className={`${styles.statusPill} ${styles.statusPillDone}`}>{currentViability}% Viable</span>
              ) : (
                <span className={`${styles.statusPill} ${styles.statusPillActive}`}>Ready</span>
              )}
            </div>
            <h3 className={styles.cardTitle}>Reality Check</h3>
            <span className={styles.cardSubtitle}>Check risks & ground realities</span>
          </div>
        </div>

        {/* Curved 3D Arrow 2 -> 3 */}
        <div className={styles.arrowConnector} aria-hidden="true">
          <svg className={styles.curvedArrowSvg} viewBox="0 0 60 40" fill="none">
            <path
              d="M 6 30 C 14 10, 32 8, 48 18 L 45 10 L 56 21 L 43 28 L 47 21 C 32 12, 16 15, 8 32 Z"
              className={isStep2Done ? styles.arrowPathActive : styles.arrowPathInactive}
            />
          </svg>
        </div>

        {/* STEP 3: Demand Predictor */}
        <div 
          onClick={() => handleStepClick(3)}
          className={[
            styles.stepCard,
            currentTab === 'demand' ? styles.stepCardActive : '',
            isStep3Done ? styles.stepCompleted : '',
            !isStep2Done ? styles.stepLocked : ''
          ].filter(Boolean).join(' ')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStepClick(3)}
          title={!isStep2Done ? 'Complete Step 2 (Reality Check) to unlock' : 'Local Demand & Stock Planning'}
        >
          {/* 3D Glossy Green Circular Badge */}
          <div className={styles.glossyNode}>
            <div className={`${styles.glossyInnerDisk} ${!isStep2Done ? styles.diskLocked : styles.diskGreen}`}>
              <div className={styles.glassReflection}></div>
              <span className={styles.stepLabelTop}>STEP</span>
              <span className={styles.stepNumberMain}>3</span>
            </div>
            {!isStep2Done ? (
              <div className={styles.nodeLockBadge} title="Locked">
                <Lock size={12} strokeWidth={2.5} />
              </div>
            ) : isStep3Done ? (
              <div className={styles.nodeCheckMark} title="Step 3 Completed">
                <Check size={14} strokeWidth={3} />
              </div>
            ) : null}
          </div>

          {/* Details Column */}
          <div className={styles.stepInfo}>
            <div className={styles.metaRow}>
              <span className={styles.stepCategoryTag}>Step 3</span>
              {!isStep2Done ? (
                <span className={`${styles.statusPill} ${styles.statusPillLocked}`}>🔒 Locked</span>
              ) : isStep3Done ? (
                <span className={`${styles.statusPill} ${styles.statusPillDone}`}>Completed ✓</span>
              ) : (
                <span className={`${styles.statusPill} ${styles.statusPillActive}`}>Ready</span>
              )}
            </div>
            <h3 className={styles.cardTitle}>Demand Forecast</h3>
            <span className={styles.cardSubtitle}>Check local demand & stock needs</span>
          </div>
        </div>

      </div>
    </div>
  );
}

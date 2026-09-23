'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Briefcase, Lightbulb, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function OnboardingPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.brandLogo}>
          <Sprout size={36} color="#059669" />
          Grameen<span>Sathi</span>
        </div>

        <h1 className={styles.title}>Where are you in your journey?</h1>
        <p className={styles.subtitle}>
          Select an option below to tailor your personalized AI financial advisor and hyper-local business roadmap.
        </p>

        <div className={styles.optionsGrid}>
          {/* Option 1: I already have a business / idea */}
          <Link href="/have-business" className={`${styles.optionCard} ${styles.optionCardPrimary}`}>
            <div className={styles.iconWrapperPrimary}>
              <Briefcase size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.optionTitle}>I already have a business / idea</div>
              <p className={styles.optionDesc}>Enter your venture details to track progress, calculate feasibility, and unlock government subsidies.</p>
            </div>
            <ArrowRight size={20} color="var(--primary)" />
          </Link>

          {/* Option 2: I need a business idea */}
          <Link href="/need-idea" className={`${styles.optionCard} ${styles.optionCardSecondary}`}>
            <div className={styles.iconWrapperSecondary}>
              <Lightbulb size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.optionTitle}>I need a business idea</div>
              <p className={styles.optionDesc}>Discover high-profit, localized rural ventures matching your budget and available space.</p>
            </div>
            <ArrowRight size={20} color="var(--accent-orange)" />
          </Link>
        </div>
      </div>
    </div>
  );
}

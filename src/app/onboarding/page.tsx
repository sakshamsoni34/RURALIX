'use client';

import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Lightbulb, 
  ArrowRight, 
  Sprout, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Compass,
  Coins
} from 'lucide-react';
import styles from './page.module.css';

export default function Onboarding() {
  const router = useRouter();

  const handleSelectExisting = () => {
    try {
      localStorage.setItem('ruralix_user_profile', JSON.stringify({
        hasBusiness: true,
        businessIdea: '',
        location: '',
        capital: '',
        infrastructure: '',
        experience: ''
      }));
    } catch (e) {
      console.error('Error saving onboarding choice:', e);
    }
    router.push('/existing-business');
  };

  const handleSelectNewIdea = () => {
    try {
      localStorage.setItem('ruralix_user_profile', JSON.stringify({
        hasBusiness: false,
        businessIdea: '',
        location: '',
        capital: '',
        infrastructure: '',
        experience: ''
      }));
      localStorage.setItem('ruralix_dashboard_unlocked', 'false');
      localStorage.setItem('ruralix_active_tab', 'ai-recommendation');
    } catch (e) {
      console.error('Error saving onboarding choice:', e);
    }
    router.push('/dashboard?tab=ai-recommendation');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brandTitle}>
          <Sprout size={28} color="#059669" />
          <span>Grameen<strong>Sathi</strong></span>
        </div>
        <div className={styles.badge}>
          <ShieldCheck size={16} color="#059669" />
          <span>Rural Enterprise Assistant</span>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.container}>
        <div className={styles.headingSection}>
          <div className={styles.stepIndicator}>Step 1 of 2 • Getting Started</div>
          <h1 className={styles.title}>
            What brings you to <span className={styles.titleHighlight}>GrameenSathi</span>?
          </h1>
          <p className={styles.subtitle}>
            अपनी आवश्यकता के अनुसार सही विकल्प चुनें ताकि हम आपके लिए सर्वोत्तम AI मार्गदर्शन तैयार कर सकें।
          </p>
        </div>

        {/* 2 Interactive Cards */}
        <div className={styles.cardGrid}>
          {/* Card 1: Existing Business */}
          <div 
            className={`${styles.optionCard} ${styles.cardExisting}`}
            onClick={handleSelectExisting}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectExisting(); }}
          >
            <div>
              <div className={`${styles.cardTag} ${styles.cardTagExisting}`}>
                Growth & Scale • विस्तार व मूल्यांकन
              </div>

              <div className={`${styles.cardIconWrapper} ${styles.iconExisting}`}>
                <Briefcase size={36} />
              </div>

              <h2 className={styles.cardTitle}>I Already Have a Business</h2>
              <div className={styles.cardHindiTitle}>मेरे पास पहले से व्यवसाय / विचार है</div>
              
              <p className={styles.cardDescription}>
                Evaluate business viability, check eligibility for government subsidies & MUDRA loans, forecast cashflow, and diagnose risks.
              </p>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={`${styles.featureCheck} ${styles.checkExisting}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Real-time Risk & Reality Diagnostics</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={`${styles.featureCheck} ${styles.checkExisting}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>PMEGP & Govt. Subsidy Matcher</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={`${styles.featureCheck} ${styles.checkExisting}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Financial Planning & Profit Simulator</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className={`${styles.actionBtn} ${styles.actionBtnExisting}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectExisting();
              }}
            >
              Continue with My Business <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: Need Business Idea */}
          <div 
            className={`${styles.optionCard} ${styles.cardNew}`}
            onClick={handleSelectNewIdea}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectNewIdea(); }}
          >
            <div>
              <div className={`${styles.cardTag} ${styles.cardTagNew}`}>
                Explore & Start • नए अवसर
              </div>

              <div className={`${styles.cardIconWrapper} ${styles.iconNew}`}>
                <Lightbulb size={36} />
              </div>

              <h2 className={styles.cardTitle}>I Need a Business Idea</h2>
              <div className={`${styles.cardHindiTitle} ${styles.cardHindiTitleNew}`}>मुझे नया बिजनेस आइडिया चाहिए</div>
              
              <p className={styles.cardDescription}>
                Let our hyper-local AI recommend profitable micro-enterprises tailored to your village, available budget, and local market demand.
              </p>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={`${styles.featureCheck} ${styles.checkNew}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Hyper-Local AI Business Recommendations</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={`${styles.featureCheck} ${styles.checkNew}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Village Market Opportunity & Competition Map</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={`${styles.featureCheck} ${styles.checkNew}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Interactive Voice Advisory (आवाज़ में सहायता)</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className={`${styles.actionBtn} ${styles.actionBtnNew}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectNewIdea();
              }}
            >
              Explore Business Ideas <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        GrameenSathi AI • Empowering Sustainable Rural Entrepreneurship across India
      </footer>
    </div>
  );
}

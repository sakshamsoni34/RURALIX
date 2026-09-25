'use client';

import { useState } from 'react';
import { 
  Landmark, 
  ExternalLink, 
  Calendar, 
  IndianRupee, 
  FileText, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import styles from './SchemeMatcherModal.module.css';
import { useDashboard } from '../context/DashboardContext';

export interface Scheme {
  name: string;
  description: string;
  matchPercentage: number;
  eligibilityFactors: string[];
  documents: string[];
  missingRequirements: string[];
}

interface SchemeMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchComplete: (schemes: Scheme[]) => void;
  inline?: boolean;
}

type SchemeCategory = 'active' | 'upcoming' | 'applied' | 'closed';

interface GovtScheme {
  id: string;
  name: string;
  description: string;
  category: SchemeCategory;
  url: string;
  imageUrl: string;
  amount?: string;
  deadline?: string;
  documents: string[];
  eligibility: string[];
}

const GOVERNMENT_SCHEMES: GovtScheme[] = [
  {
    id: '1',
    name: 'PM-Kisan Samman Nidhi',
    description: 'Direct income support of ₹6,000/- per year in three equal installments provided directly to all landholding farmer families.',
    category: 'active',
    url: 'https://pmkisan.gov.in/',
    imageUrl: '/pm-kisan.jpg',
    amount: '₹6,000 / year',
    deadline: 'Ongoing',
    documents: ['Aadhaar Card', 'Land holding papers / Khasra', 'Bank account details'],
    eligibility: ['Small and marginal farmer families', 'Cultivable landholding ownership in India']
  },
  {
    id: '2',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    description: 'Collateral-free business loans up to ₹10 Lakh for non-corporate, non-farm small and micro enterprises (Shishu, Kishore, Tarun).',
    category: 'active',
    url: 'https://www.mudra.org.in/',
    imageUrl: '/mudra-loan.jpg',
    amount: 'Up to ₹10 Lakh',
    deadline: 'Ongoing',
    documents: ['Identity & Address Proof', 'Business Registration Proof', '6-Month Bank Statement'],
    eligibility: ['Non-Corporate Small Business', 'Micro Enterprise & Shopkeepers', 'Manufacturing & Retail Units']
  },
  {
    id: '3',
    name: 'PM Formalisation of Micro Food Processing (PMFME)',
    description: 'Capital subsidy up to 35% with financial, technical, and business incubation support for micro food and agro processing enterprises.',
    category: 'upcoming',
    url: 'https://pmfme.mofpi.gov.in/',
    imageUrl: '/pmfme.jpg',
    amount: '35% Subsidy (Up to ₹10L)',
    deadline: 'Opens 1st of Next Month',
    documents: ['Detailed Project Report (DPR)', 'Aadhaar & PAN Card', 'Quotation of Machinery & Equipments'],
    eligibility: ['Individual micro food processing units', 'FPOs / Farmer Producer Groups', 'Self Help Groups (SHGs)']
  },
  {
    id: '4',
    name: 'Kisan Credit Card (KCC)',
    description: 'Institutional credit support with highly subsidized interest rates (4%) for agricultural operational needs and farm machinery.',
    category: 'applied',
    url: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card',
    imageUrl: '/kcc.jpg',
    amount: 'Credit up to ₹3 Lakh',
    deadline: 'Submitted on 12 Aug 2026',
    documents: ['Duly Filled Application Form', 'ID & Residence Proof', 'Land Revenue Records'],
    eligibility: ['Individual / Joint Borrowers', 'Owner Cultivators & Dairy Farmers', 'Tenant Farmers & SHGs']
  },
  {
    id: '5',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Comprehensive nationwide crop insurance coverage against non-preventable natural risks from pre-sowing to post-harvest.',
    category: 'closed',
    url: 'https://pmfby.gov.in/',
    imageUrl: '/pmfby.jpg',
    amount: 'Full Crop Loss Coverage',
    deadline: 'Cycle Closed on 31 Jul 2026',
    documents: ['Bank Passbook', 'Land Revenue Record / RoR', 'Sowing Certificate from Panchayat'],
    eligibility: ['Farmers growing notified crops in notified areas', 'Sharecroppers and tenant farmers']
  }
];

export default function SchemeMatcherModal({ isOpen, onClose, inline = false }: SchemeMatcherModalProps) {
  const { setActiveTab: setDashboardTab } = useDashboard();
  const [activeTab, setActiveTab] = useState<SchemeCategory>('active');
  const [selectedScheme, setSelectedScheme] = useState<GovtScheme | null>(null);

  if (!isOpen && !inline) return null;

  const filteredSchemes = GOVERNMENT_SCHEMES.filter(s => s.category === activeTab);

  const handleApply = (url: string) => {
    window.open(url, '_blank');
  };

  const content = (
    <div className={`${styles.container} ${inline ? styles.inlineModal : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badge}>
            <Sparkles size={13} /> Official Govt Portals
          </div>
          <h2 className={styles.title}>
            <Landmark size={26} color="#059669" />
            Central & State Government Schemes
          </h2>
          <p className={styles.subtitle}>
            Verified national subsidies, collateral-free credit programs, and direct benefit transfer portals for your enterprise.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Schemes ({GOVERNMENT_SCHEMES.filter(s => s.category === 'active').length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({GOVERNMENT_SCHEMES.filter(s => s.category === 'upcoming').length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'applied' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('applied')}
        >
          Applied ({GOVERNMENT_SCHEMES.filter(s => s.category === 'applied').length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'closed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('closed')}
        >
          Closed ({GOVERNMENT_SCHEMES.filter(s => s.category === 'closed').length})
        </button>
      </div>

      {/* Grid of Scheme Cards with Images */}
      <div className={styles.content}>
        {filteredSchemes.length === 0 && (
          <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', marginTop: '2rem' }}>
            No schemes found in this category.
          </p>
        )}
        {filteredSchemes.map(scheme => (
          <div key={scheme.id} className={styles.schemeCard} onClick={() => setSelectedScheme(scheme)}>
            {/* Scheme Image Banner */}
            <div className={styles.imageWrapper}>
              <img 
                src={scheme.imageUrl} 
                alt={scheme.name} 
                className={styles.schemeImage}
              />
              <div className={styles.imageOverlay} />
              <span className={`${styles.statusBadge} ${
                scheme.category === 'active' ? styles.statusActive : 
                scheme.category === 'upcoming' ? styles.statusUpcoming : 
                scheme.category === 'applied' ? styles.statusApplied : styles.statusClosed
              }`}>
                {scheme.category}
              </span>
            </div>

            {/* Scheme Card Body */}
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{scheme.name}</h3>
              <p className={styles.cardDesc}>{scheme.description}</p>
              
              <div className={styles.cardMeta}>
                {scheme.amount && (
                  <div className={styles.metaItem}>
                    <IndianRupee size={14} color="#059669" /> {scheme.amount}
                  </div>
                )}
                {scheme.deadline && (
                  <div className={styles.metaItem}>
                    <Calendar size={14} color="#d97706" /> {scheme.deadline}
                  </div>
                )}
              </div>

              <div className={styles.viewDetailsHint}>
                View Full Scheme Details & Apply <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guided Next Step Banner */}
      <div className={styles.guidedFooterBar}>
        <div className={styles.guidedFooterLeft}>
          <span className={styles.guidedStepBadge}>Step 3 of 4 Completed</span>
          <p className={styles.guidedStepText}>
            Subsidies & schemes reviewed. Next, predict seasonal demand surges & product spikes.
          </p>
        </div>
        <button 
          type="button"
          className={styles.proceedNextBtn}
          onClick={() => setDashboardTab('demand')}
        >
          Proceed to Step 4: Demand Predictor <ArrowRight size={18} />
        </button>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className={styles.modalOverlay} onClick={() => setSelectedScheme(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {/* Banner Image in Modal Header */}
            <div className={styles.modalImageBanner}>
              <img 
                src={selectedScheme.imageUrl} 
                alt={selectedScheme.name} 
                className={styles.modalImage}
              />
              <div className={styles.modalImageOverlay} />
              <button className={styles.closeBtn} onClick={() => setSelectedScheme(null)} aria-label="Close">
                <X size={18} />
              </button>
              <div className={styles.modalHeaderContent}>
                <span className={`${styles.statusBadge} ${
                  selectedScheme.category === 'active' ? styles.statusActive : 
                  selectedScheme.category === 'upcoming' ? styles.statusUpcoming : 
                  selectedScheme.category === 'applied' ? styles.statusApplied : styles.statusClosed
                }`} style={{ position: 'static', display: 'inline-block', marginBottom: '0.4rem' }}>
                  {selectedScheme.category}
                </span>
                <h3 className={styles.modalTitle}>{selectedScheme.name}</h3>
              </div>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                {selectedScheme.description}
              </p>

              {/* Key Highlights */}
              <div className={styles.metaGrid}>
                {selectedScheme.amount && (
                  <div className={styles.metaBox}>
                    <label>Financial Benefit / Subsidy</label>
                    <span>
                      <IndianRupee size={16} color="#059669" /> {selectedScheme.amount}
                    </span>
                  </div>
                )}
                {selectedScheme.deadline && (
                  <div className={styles.metaBox}>
                    <label>Application Timeline</label>
                    <span>
                      <Calendar size={16} color="#d97706" /> {selectedScheme.deadline}
                    </span>
                  </div>
                )}
              </div>

              {/* Eligibility */}
              <div className={styles.detailSection}>
                <h4><CheckCircle2 size={18} color="#059669" /> Who is Eligible</h4>
                <ul>
                  {selectedScheme.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              {/* Documents */}
              <div className={styles.detailSection}>
                <h4><FileText size={18} color="#2563eb" /> Mandatory Documents Required</h4>
                <ul>
                  {selectedScheme.documents.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.applyBtn} 
                onClick={() => handleApply(selectedScheme.url)}
                disabled={selectedScheme.category === 'closed'}
              >
                {selectedScheme.category === 'applied' ? 'Track Application on Portal' : 'Apply on Official Govt Portal'}
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return content;
}

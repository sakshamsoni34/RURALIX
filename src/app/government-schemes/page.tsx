'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Landmark, 
  ExternalLink, 
  Search, 
  ArrowLeft, 
  Menu, 
  Sprout, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  IndianRupee, 
  Percent, 
  Building, 
  HelpCircle, 
  X, 
  Calculator, 
  Clock, 
  Award,
  ChevronRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import Sidebar from '../../components/dashboard/Sidebar';
import styles from './page.module.css';

interface GovtSchemeRecord {
  id: string;
  name: string;
  shortName: string;
  ministry: string;
  type: 'subsidy' | 'loan' | 'guarantee' | 'registration';
  maxBenefit: string;
  subsidyRate?: string;
  interestRate?: string;
  applyUrl: string;
  summary: string;
  matchScore: number;
  whyMatch: string;
  eligibility: string[];
  documents: string[];
  targetCategories: string[];
  stepsToApply: string[];
}

const MASTER_SCHEMES: GovtSchemeRecord[] = [
  {
    id: 'pmsuryaghar',
    name: 'PM Surya Ghar: Muft Bijli Yojana & Solar Vendor Enterprise Scheme',
    shortName: 'PM Surya Ghar',
    ministry: 'Ministry of New & Renewable Energy (MNRE)',
    type: 'subsidy',
    maxBenefit: '₹78,000 Subsidy + 7% IREDA Vendor Loan',
    subsidyRate: 'Direct Central Financial Assistance up to ₹78,000',
    interestRate: 'Concessional 7% p.a. through PSU Banks',
    applyUrl: 'https://pmsuryaghar.gov.in/',
    summary: 'Direct central financial support for rooftop solar systems, solar micro-enterprises, rural hardware vendors, electrical contractors, and registered DISCOM vendors.',
    matchScore: 98,
    whyMatch: 'Perfect match for Solar Equipment, Electrical Supplies, and Clean Energy enterprises.',
    eligibility: [
      'Micro-enterprises selling solar panels, inverters, wiring, and electrical hardware',
      'Electrical service technicians and contractors registering as DISCOM vendors',
      'Individual homeowners and commercial rural units installing up to 3kW to 10kW systems'
    ],
    documents: [
      'Aadhaar Card of Entrepreneur',
      'PAN Card & Active Bank Account',
      'Shop & Establishment License / Udyam Certificate',
      'Electricity Bill / Trade premises ownership or rent deed'
    ],
    targetCategories: ['solar', 'hardware', 'electrical', 'energy'],
    stepsToApply: [
      'Register company / vendor profile on National Portal (pmsuryaghar.gov.in)',
      'Link bank account and submit Udyam MSME certification',
      'Select local power distribution company (DISCOM) for vendor onboarding',
      'Submit consumer installation or inventory finance claim for direct DBT subsidy disbursement'
    ]
  },
  {
    id: 'pmegp',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    shortName: 'PMEGP Scheme',
    ministry: 'Ministry of Micro, Small and Medium Enterprises (MoMSME)',
    type: 'subsidy',
    maxBenefit: '35% Rural Capital Subsidy (Up to ₹17.5 Lakhs)',
    subsidyRate: '35% Margin Money Grant for Rural Areas (25% Urban)',
    interestRate: 'Standard MSME Bank Lending Rate (8.5% - 10.5%)',
    applyUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    summary: 'The flagship credit-linked capital subsidy scheme for setting up new micro-enterprises in rural India. Project cost up to ₹50 Lakhs for Manufacturing and ₹20 Lakhs for Trading/Services.',
    matchScore: 96,
    whyMatch: 'Highest capital subsidy grant for setting up manufacturing, trading shops, or service points in rural areas.',
    eligibility: [
      'Any individual entrepreneur above 18 years of age',
      'Minimum 8th standard pass for manufacturing projects above ₹10 Lakhs and services above ₹5 Lakhs',
      'Self-Help Groups (SHGs) and institutions registered under Societies Registration Act'
    ],
    documents: [
      'Detailed Project Report (DPR) with capital cost breakdown',
      'Aadhaar Card & PAN Card',
      'Rural Area Certificate from Gram Panchayat / Patwari',
      'Educational Qualification Certificate',
      'EDP (Entrepreneurship Development Programme) completion certificate (can do online post sanction)'
    ],
    targetCategories: ['all', 'solar', 'dairy', 'food', 'hardware', 'retail', 'manufacturing'],
    stepsToApply: [
      'Fill online application on KVIC portal (kviconline.gov.in)',
      'Upload DPR, Aadhaar, and photo; choose preferred financing bank branch',
      'District Task Force Committee (DTFC) reviews and forwards to bank',
      'Bank sanctions loan and KVIC deposits 35% margin money directly into 3-year escrow subsidy account'
    ]
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    shortName: 'PM MUDRA Loan',
    ministry: 'Department of Financial Services, Ministry of Finance',
    type: 'loan',
    maxBenefit: 'Up to ₹10 Lakhs (Zero Collateral)',
    subsidyRate: 'Collateral-Free Institutional Lending',
    interestRate: '8.40% - 11.15% (Bank Concessional)',
    applyUrl: 'https://www.mudra.org.in/',
    summary: 'Collateral-free institutional business loans for small shopkeepers, traders, hardware retailers, dairy suppliers, and micro enterprises under Shishu (up to ₹50K), Kishore (₹50K to ₹5L), and Tarun (₹5L to ₹10L).',
    matchScore: 94,
    whyMatch: 'Instant collateral-free working capital loan for shop inventory, tooling, and machinery purchases.',
    eligibility: [
      'Any Indian citizen having a business idea or active non-corporate micro enterprise',
      'Shopkeepers, repair contractors, hardware dealers, artisans, fruit/food vendors',
      'No collateral security or third-party guarantee required'
    ],
    documents: [
      'Proof of Identity (Aadhaar / Voter ID / Driving License)',
      'Proof of Residence / Business Address',
      'Quotation of machinery/stock items to be purchased',
      'Last 6 months bank statement (if existing account holder)'
    ],
    targetCategories: ['all', 'solar', 'dairy', 'food', 'hardware', 'retail'],
    stepsToApply: [
      'Apply directly on JanSamarth Portal (jansamarth.in) or visit nearest commercial/Gramin bank',
      'Select MUDRA category (Shishu, Kishore, or Tarun) based on capital required',
      'Submit vendor quotations and identity KYC documents',
      'Bank issues MUDRA RuPay Debit Card for seamless drawal of working capital'
    ]
  },
  {
    id: 'nlm',
    name: 'National Livestock Mission (NLM) & AHIDF Subsidies',
    shortName: 'NLM Livestock & Dairy',
    ministry: 'Department of Animal Husbandry and Dairying',
    type: 'subsidy',
    maxBenefit: '50% Direct Capital Subsidy (Up to ₹50 Lakhs)',
    subsidyRate: '50% Capital Grant for Cattle, Poultry & Fodder units',
    interestRate: '3% Interest Subvention for Animal Husbandry Infrastructure',
    applyUrl: 'https://nlm.udyamimitra.in/',
    summary: 'Huge 50% non-repayable capital subsidy for rural dairy enterprises, high-yield milch cattle breeding, sheep/goat farms, fodder seed production, and chilling milk collection hubs.',
    matchScore: 98,
    whyMatch: 'Top tier match for Modern Dairy, Milk Collection, Chilling Units, and Animal Husbandry.',
    eligibility: [
      'Individual rural entrepreneurs, dairy farmers, and self-help groups',
      'Must have adequate land ownership or minimum 10-year registered lease deed',
      'Commitment to scientific animal housing and livestock insurance'
    ],
    documents: [
      'Land revenue document (Khasra/Khatauni or Registered Lease)',
      'Detailed Technical Livestock DPR',
      'Bank in-principle loan sanction letter',
      'Training certificate in animal husbandry / dairy technology'
    ],
    targetCategories: ['dairy', 'livestock', 'milk', 'cattle', 'poultry'],
    stepsToApply: [
      'Register on UdyamMitra NLM portal (nlm.udyamimitra.in)',
      'Upload comprehensive livestock project DPR and land papers',
      'State Livestock Mission reviews technical parameters and issues in-principle clearance',
      'Subsidy credited in 2 tranches directly to lending bank account during construction'
    ]
  },
  {
    id: 'pmfme',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    shortName: 'PMFME Scheme',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    type: 'subsidy',
    maxBenefit: '35% Credit-linked Subsidy (Up to ₹10 Lakhs)',
    subsidyRate: '35% of eligible project cost as capital grant',
    interestRate: 'Standard Priority Sector Agri Loan Rate',
    applyUrl: 'https://pmfme.mofpi.gov.in/',
    summary: 'Comprehensive capital and technical upgrade grant for micro food processing units including dairy value-added items (paneer, ghee, curd, flavored milk), flour mills, mustard/cold-press oil, and spice packaging.',
    matchScore: 95,
    whyMatch: 'Direct 35% cash subsidy for packaging, chilling, and processing equipment for food/milk products.',
    eligibility: [
      'Existing or new micro food processing and dairy value-addition enterprises',
      'Farmer Producer Organizations (FPOs), SHGs, and individual micro entrepreneurs',
      'Alignment with One District One Product (ODOP) is prioritized'
    ],
    documents: [
      'Detailed Project Report (DPR) detailing processing machinery',
      'Aadhaar, PAN & Bank Details',
      'Machinery Quotations from registered equipment suppliers',
      'Basic FSSAI Registration / Application number'
    ],
    targetCategories: ['food', 'dairy', 'milk', 'processing', 'flour', 'oil', 'spices'],
    stepsToApply: [
      'Register online at pmfme.mofpi.gov.in',
      'District Resource Person (DRP) assists in drafting DPR free of cost',
      'Application forwarded digitally to designated lending bank',
      'Upon sanction, MoFPI deposits 35% capital grant directly to bank'
    ]
  },
  {
    id: 'jansamarth',
    name: 'Jan Samarth Portal - Unified National Credit Platform',
    shortName: 'Jan Samarth Portal',
    ministry: 'Ministry of Finance & Partner Banks',
    type: 'loan',
    maxBenefit: 'Instant Digital Approval across 13 Central Schemes',
    subsidyRate: 'Integrated DBT Subsidies for MSME & Livelihood',
    interestRate: 'Direct competitive offers from 125+ Banks',
    applyUrl: 'https://www.jansamarth.in/',
    summary: 'The official Government of India single-window clearance portal connecting entrepreneurs directly to 125+ commercial banks, RRBs, and cooperative banks for instant in-principle approval under PMEGP, MUDRA, and Agri loans.',
    matchScore: 95,
    whyMatch: 'One single digital application checks eligibility and matches loans across all national schemes simultaneously.',
    eligibility: [
      'All Indian residents starting or expanding micro, small, or medium enterprises',
      'Farmers, artisans, traders, solar vendors, food processors'
    ],
    documents: [
      'Aadhaar Number (e-KYC verified)',
      'PAN Card',
      'Digital Bank Account Statement (last 6 months in PDF)',
      'Basic business location and activity details'
    ],
    targetCategories: ['all', 'solar', 'dairy', 'food', 'hardware', 'retail'],
    stepsToApply: [
      'Visit jansamarth.in and select "Business Activity Loan"',
      'Answer 4 simple questions on location, capital required, and business category',
      'Portal computes eligibility across PMEGP, MUDRA, and Stand-Up India',
      'Receive instant digital In-Principle Approval letter to present at chosen bank'
    ]
  },
  {
    id: 'cgtmse',
    name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
    shortName: 'CGTMSE Guarantee',
    ministry: 'Ministry of MSME & SIDBI',
    type: 'guarantee',
    maxBenefit: 'Collateral-Free Credit Guarantee up to ₹5 Crore',
    subsidyRate: '75% - 85% Government Guarantee Coverage to Bank',
    interestRate: 'Priority Sector MSME Interest Rates',
    applyUrl: 'https://www.cgtmse.in/',
    summary: 'Enables entrepreneurs to obtain substantial business bank loans without providing third-party collateral or land mortgages. The government trust guarantees up to 85% of the loan amount to the bank in case of unforeseen default.',
    matchScore: 90,
    whyMatch: 'Solves the collateral barrier when expanding store inventory or purchasing high-value commercial machinery.',
    eligibility: [
      'New and existing Micro and Small Enterprises (MSEs) in manufacturing and service sectors',
      'Retail trade and educational institutions also eligible up to ₹2 Crore'
    ],
    documents: [
      'Udyam Registration Certificate',
      'Audited Financial Statements or Projected Balance Sheet',
      'Formal Bank Loan Application'
    ],
    targetCategories: ['all', 'solar', 'hardware', 'retail', 'manufacturing'],
    stepsToApply: [
      'Approach any scheduled commercial bank or eligible NBFC',
      'Request loan under CGTMSE collateral-free guarantee scheme',
      'Bank evaluates credit proposal and sanctions loan without requiring collateral pledge',
      'Bank pays nominal annual guarantee fee to CGTMSE trust directly'
    ]
  },
  {
    id: 'standup',
    name: 'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
    shortName: 'Stand-Up India',
    ministry: 'Department of Financial Services, Ministry of Finance',
    type: 'loan',
    maxBenefit: 'Bank Loans from ₹10 Lakhs to ₹1 Crore',
    subsidyRate: 'Finances up to 85% of Greenfield Enterprise Cost',
    interestRate: 'Lowest applicable rate of bank (Base Rate + 3% + Tenor Premium)',
    applyUrl: 'https://www.standupmitra.in/',
    summary: 'Facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.',
    matchScore: 88,
    whyMatch: 'High-capital funding window for women or SC/ST entrepreneurs starting brand new retail, service, or agro units.',
    eligibility: [
      'SC/ST and/or Woman entrepreneur above 18 years of age',
      'Loan available only for greenfield (first-time venture) enterprise',
      'In non-individual enterprises, 51% shareholding must be held by SC/ST or woman'
    ],
    documents: [
      'Proof of Identity and SC/ST caste certificate (if applicable)',
      'Detailed Project Feasibility Report',
      'Land / Lease documents for commercial premises',
      'Bank statements and quotation of plant/machinery'
    ],
    targetCategories: ['all', 'solar', 'dairy', 'hardware', 'retail'],
    stepsToApply: [
      'Register at standupmitra.in portal',
      'Choose whether to apply directly or seek handholding support through SIDBI centers',
      'Portal matches project with local bank branch',
      'Branch processes application with dedicated priority manager'
    ]
  },
  {
    id: 'vishwakarma',
    name: 'PM Vishwakarma Scheme for Traditional Artisans & Craftspersons',
    shortName: 'PM Vishwakarma',
    ministry: 'Ministry of MSME',
    type: 'subsidy',
    maxBenefit: '₹15,000 Free Toolkit + ₹3 Lakh Loan at 5% Interest',
    subsidyRate: '₹15,000 Direct Digital Voucher + 8% Interest Subvention',
    interestRate: 'Subsidized Concessional 5% Fixed Interest',
    applyUrl: 'https://pmvishwakarma.gov.in/',
    summary: 'Comprehensive financial, skilling, and marketing ecosystem for 18 traditional trades including blacksmiths, carpenters, armourers, locksmiths, potters, sculptors, and tailors.',
    matchScore: 86,
    whyMatch: 'Direct ₹15,000 equipment incentive plus lowest 5% interest rate business credit.',
    eligibility: [
      'Artisan or craftsperson working with hands and tools in one of 18 notified family trades',
      'Minimum age 18 years; benefits restricted to one member per family'
    ],
    documents: [
      'Aadhaar Card with linked mobile number',
      'Bank Account details (Passbook / Cancelled Cheque)',
      'Gram Panchayat / Urban Local Body trade verification'
    ],
    targetCategories: ['hardware', 'craft', 'artisan', 'all'],
    stepsToApply: [
      'Visit nearest Common Service Center (CSC) with Aadhaar and bank details',
      'Complete Aadhaar biometric verification on pmvishwakarma.gov.in',
      'Gram Panchayat or ULB conducts verification',
      'Receive PM Vishwakarma Digital ID Card and e-voucher for modern toolkits'
    ]
  },
  {
    id: 'udyam',
    name: 'Udyam MSME Registration (Mandatory Zero-Cost Gateway)',
    shortName: 'Udyam Registration',
    ministry: 'Ministry of MSME, Govt of India',
    type: 'registration',
    maxBenefit: '100% Free Official MSME Certificate',
    subsidyRate: 'Gateway to all MSME Bank Subsidies & Govt Tenders',
    interestRate: 'Unlocks 1% - 2% Bank Interest Subvention',
    applyUrl: 'https://udyamregistration.gov.in/',
    summary: 'The official Government of India paperless registration portal. Having an Udyam certificate is mandatory to claim PMEGP, MUDRA priority status, 50% discount on patents, and protection against delayed payments.',
    matchScore: 100,
    whyMatch: 'Mandatory prerequisite for obtaining government loans, trade credit, and industrial power subsidies.',
    eligibility: [
      'Any individual or partnership operating a micro, small, or medium enterprise',
      'Micro: Investment up to ₹1 Crore and Turnover up to ₹5 Crore',
      'Zero government fee — completely free of cost'
    ],
    documents: [
      'Aadhaar Card of the proprietor/partner',
      'PAN Card of proprietor or business entity',
      'Active mobile number linked with Aadhaar for OTP verification'
    ],
    targetCategories: ['all', 'solar', 'dairy', 'food', 'hardware', 'retail'],
    stepsToApply: [
      'Visit official portal: udyamregistration.gov.in (never pay any fees to third-party sites)',
      'Enter Aadhaar and validate with OTP',
      'Fill business enterprise name, bank account, and NIC trade classification code',
      'Instant digital Udyam Registration Certificate generated with lifetime validity QR code'
    ]
  }
];

function GovernmentSchemesContent() {
  const router = useRouter();
  const { userProfile, setIsMenuOpen } = useDashboard();
  const [mounted, setMounted] = useState(false);

  // Fallback to localStorage if context is still hydrating
  const activeProfile = useMemo(() => {
    if (mounted) {
      if (userProfile?.businessIdea?.trim()) {
        return userProfile;
      }
      try {
        const saved = localStorage.getItem('ruralix_user_profile');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return userProfile;
  }, [mounted, userProfile]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'matched' | 'subsidy' | 'loan' | 'solar' | 'dairy'>('matched');
  const [activeModalScheme, setActiveModalScheme] = useState<GovtSchemeRecord | null>(null);

  // Calculator State
  const initialCapNum = parseInt(String(activeProfile?.capital || '').replace(/[^0-9]/g, '')) || 350000;
  const [calcCapital, setCalcCapital] = useState<number>(initialCapNum > 10000 ? initialCapNum : 350000);
  const [isRuralArea, setIsRuralArea] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const businessName = activeProfile?.businessIdea?.trim() || 'Rural Enterprise Hub';
  const locationName = activeProfile?.location?.trim() || 'Local Area';
  const capitalDisplay = activeProfile?.capital ? `₹${activeProfile.capital}` : '₹3,50,000';

  // Dynamic Matching Logic based on user's specific business idea
  const matchedSchemes = useMemo(() => {
    const ideaLower = businessName.toLowerCase();
    const isSolar = ideaLower.includes('solar') || ideaLower.includes('electric') || ideaLower.includes('hardware') || ideaLower.includes('energy');
    const isDairy = ideaLower.includes('dairy') || ideaLower.includes('milk') || ideaLower.includes('cattle') || ideaLower.includes('livestock') || ideaLower.includes('poultry') || ideaLower.includes('animal');
    const isFood = ideaLower.includes('food') || ideaLower.includes('flour') || ideaLower.includes('oil') || ideaLower.includes('chakki') || ideaLower.includes('spice') || ideaLower.includes('agro') || ideaLower.includes('bakery');

    return MASTER_SCHEMES.map(scheme => {
      let score = scheme.matchScore;
      let why = scheme.whyMatch;

      if (isSolar && (scheme.id === 'pmsuryaghar' || scheme.id === 'mudra' || scheme.id === 'pmegp' || scheme.id === 'jansamarth')) {
        score = scheme.id === 'pmsuryaghar' ? 98 : scheme.id === 'mudra' ? 96 : 93;
        why = `Directly matches your ${businessName} plan in ${locationName}. Ideal for solar dealership, hardware inventory, and vendor accreditation.`;
      } else if (isDairy && (scheme.id === 'nlm' || scheme.id === 'pmfme' || scheme.id === 'pmegp' || scheme.id === 'mudra')) {
        score = scheme.id === 'nlm' ? 99 : scheme.id === 'pmfme' ? 96 : 94;
        why = `Directly matches your dairy & livestock enterprise in ${locationName}. Eligible for 50% NLM subsidy + milk chilling infrastructure credit.`;
      } else if (isFood && (scheme.id === 'pmfme' || scheme.id === 'pmegp' || scheme.id === 'mudra')) {
        score = scheme.id === 'pmfme' ? 98 : 94;
        why = `Eligible for 35% food processing machinery subsidy under One District One Product (ODOP).`;
      }

      return {
        ...scheme,
        computedScore: score,
        computedWhy: why
      };
    }).sort((a, b) => b.computedScore - a.computedScore);
  }, [businessName, locationName]);

  // Filtering
  const filteredSchemes = useMemo(() => {
    return matchedSchemes.filter(scheme => {
      // Search text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          scheme.name.toLowerCase().includes(q) ||
          scheme.shortName.toLowerCase().includes(q) ||
          scheme.ministry.toLowerCase().includes(q) ||
          scheme.summary.toLowerCase().includes(q) ||
          scheme.targetCategories.some(cat => cat.includes(q));
        if (!matchesText) return false;
      }

      // Filter tabs
      if (selectedFilter === 'matched') {
        return scheme.computedScore >= 88;
      }
      if (selectedFilter === 'subsidy') {
        return scheme.type === 'subsidy';
      }
      if (selectedFilter === 'loan') {
        return scheme.type === 'loan' || scheme.type === 'guarantee';
      }
      if (selectedFilter === 'solar') {
        return scheme.targetCategories.includes('solar') || scheme.targetCategories.includes('hardware');
      }
      if (selectedFilter === 'dairy') {
        return scheme.targetCategories.includes('dairy') || scheme.targetCategories.includes('food');
      }
      return true; // 'all'
    });
  }, [matchedSchemes, searchQuery, selectedFilter]);

  // Calculator computations
  const subsidyPercent = isRuralArea ? 0.35 : 0.25;
  const subsidyAmount = Math.round(calcCapital * subsidyPercent);
  const promoterContribution = Math.round(calcCapital * 0.05); // 5% for special/rural
  const bankLoanAmount = Math.max(0, calcCapital - subsidyAmount - promoterContribution);
  // Estimate monthly EMI at 9.5% p.a. for 5 years (60 months)
  const monthlyRate = 0.095 / 12;
  const estimatedEMI = bankLoanAmount > 0 
    ? Math.round((bankLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, 60)) / (Math.pow(1 + monthlyRate, 60) - 1))
    : 0;

  const handleOpenDirectApply = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard?tab=dashboard');
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainWrapper}>
        {/* Top Sticky Header */}
        <header className={styles.topNav}>
          <div className={styles.topNavLeft}>
            <button 
              type="button" 
              className={styles.menuBtn}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Drawer"
            >
              <Menu size={20} />
            </button>

            <div className={styles.brandLink} onClick={() => router.push('/dashboard')}>
              <Sprout size={26} color="#059669" />
              <span>Grameen<span style={{ color: '#059669' }}>Sathi</span></span>
            </div>

            <button 
              type="button" 
              onClick={handleBackToDashboard}
              className={styles.backBtn}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>

          <div className={styles.topNavRight}>
            <div className={styles.profileBadge}>
              <Award size={16} color="#059669" />
              <span>Suggested for: <strong>{businessName}</strong></span>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {/* Hero Banner */}
          <div className={styles.heroCard}>
            <div className={styles.heroGlow} />
            <div className={styles.heroTag}>
              <Sparkles size={14} /> Government Schemes & Subsidies
            </div>
            <h1 className={styles.heroTitle}>
              Government Subsidies & Loans
            </h1>
            <p className={styles.heroSubtitle}>
              Find verified central and state government schemes, subsidies, and bank loan programs matched to your business idea. Check eligibility and apply on official portals.
            </p>

            <div className={styles.profilePillRow}>
              <div className={styles.pillItem}>
                <span>Business:</span>
                <strong>{businessName}</strong>
              </div>
              <div className={styles.pillItem}>
                <span>Location:</span>
                <strong>{locationName}</strong>
              </div>
              <div className={styles.pillItem}>
                <span>Budget:</span>
                <strong>{capitalDisplay}</strong>
              </div>
              <div className={styles.pillItem}>
                <span>Status:</span>
                <strong>Subsidy & Loan Eligible</strong>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: '#ecfdf5', color: '#059669' }}>
                <Landmark size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Available Schemes</span>
                <span className={styles.statValue}>10 Verified Schemes</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Percent size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Max Rural Subsidy</span>
                <span className={styles.statValue}>35% to 50% Subsidy</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: '#fef3c7', color: '#d97706' }}>
                <ShieldCheck size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Collateral-Free Limit</span>
                <span className={styles.statValue}>Up to ₹10 Lakhs (MUDRA)</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: '#faf5ff', color: '#7c3aed' }}>
                <CheckCircle2 size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Official Portals</span>
                <span className={styles.statValue}>Direct .gov.in Links</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className={styles.controlsRow}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} size={18} />
              <input 
                type="text"
                placeholder="Search schemes by name, keyword, or subsidy type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterTabs}>
              <button 
                type="button"
                className={`${styles.filterBtn} ${selectedFilter === 'matched' ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedFilter('matched')}
              >
                🎯 Top Matched for You ({matchedSchemes.filter(s => s.computedScore >= 88).length})
              </button>
              <button 
                type="button"
                className={`${styles.filterBtn} ${selectedFilter === 'all' ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All Schemes ({MASTER_SCHEMES.length})
              </button>
              <button 
                type="button"
                className={`${styles.filterBtn} ${selectedFilter === 'subsidy' ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedFilter('subsidy')}
              >
                Capital Subsidies (PMEGP / NLM)
              </button>
              <button 
                type="button"
                className={`${styles.filterBtn} ${selectedFilter === 'loan' ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedFilter('loan')}
              >
                Collateral-Free Loans (MUDRA)
              </button>
              <button 
                type="button"
                className={`${styles.filterBtn} ${selectedFilter === 'solar' ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedFilter('solar')}
              >
                Solar & Hardware
              </button>
              <button 
                type="button"
                className={`${styles.filterBtn} ${selectedFilter === 'dairy' ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedFilter('dairy')}
              >
                Dairy & Food
              </button>
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div className={styles.schemesGrid}>
            {filteredSchemes.map((scheme, index) => {
              const isTop = index === 0 || scheme.computedScore >= 95;
              return (
                <div 
                  key={scheme.id} 
                  className={`${styles.schemeCard} ${isTop ? styles.schemeCardFeatured : ''}`}
                  onClick={() => setActiveModalScheme(scheme)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardTopHeader}>
                    <div className={styles.ministryTag}>
                      <Building size={14} />
                      <span>{scheme.ministry}</span>
                    </div>
                    <div className={styles.matchPill}>
                      <Sparkles size={12} /> {scheme.computedScore}% Match
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.schemeName}>{scheme.name}</h3>
                    <p className={styles.schemeSummary}>{scheme.summary}</p>

                    {/* Benefit Highlight Box */}
                    <div className={styles.benefitBox}>
                      <div className={styles.benefitLabel}>
                        <IndianRupee size={13} /> Financial Benefit & Subsidy
                      </div>
                      <div className={styles.benefitAmount}>
                        {scheme.maxBenefit}
                      </div>
                    </div>

                    {/* Why it matches */}
                    <div className={styles.whyMatched}>
                      <strong>Why this matches:</strong> {scheme.computedWhy}
                    </div>

                    {/* Mandatory documents required */}
                    <div className={styles.docSection}>
                      <div className={styles.docTitle}>
                        <FileText size={13} /> Key Documents Required:
                      </div>
                      <div className={styles.docChips}>
                        {scheme.documents.slice(0, 3).map((doc, i) => (
                          <span key={i} className={styles.docChip}>
                            {doc}
                          </span>
                        ))}
                        {scheme.documents.length > 3 && (
                          <span className={styles.docChip} style={{ color: '#059669', fontWeight: 700 }}>
                            +{scheme.documents.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter} onClick={e => e.stopPropagation()}>
                    <button 
                      type="button" 
                      className={styles.applyBtn}
                      onClick={(e) => handleOpenDirectApply(scheme.applyUrl, e)}
                      title={`Open official portal: ${scheme.applyUrl}`}
                    >
                      <span>Apply on Official Portal</span>
                      <ExternalLink size={16} />
                    </button>
                    <button 
                      type="button"
                      className={styles.detailsBtn}
                      onClick={() => setActiveModalScheme(scheme)}
                      title="View full scheme breakdown"
                    >
                      <span>Details</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Rural Subsidy Calculator */}
          <section className={styles.interactiveSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.statIconWrap} style={{ background: '#ecfdf5', color: '#059669' }}>
                <Calculator size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Interactive PMEGP / Rural Subsidy Calculator
                </h2>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                  Simulate your government capital grant and bank loan distribution in real time.
                </p>
              </div>
            </div>

            <div className={styles.calcGrid}>
              <div className={styles.calcInputs}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputLabel}>
                    <span>Total Project Cost / Capital:</span>
                    <strong style={{ color: '#059669', fontSize: '1.1rem' }}>₹{calcCapital.toLocaleString('en-IN')}</strong>
                  </div>
                  <input 
                    type="range"
                    min={50000}
                    max={2500000}
                    step={25000}
                    value={calcCapital}
                    onChange={e => setCalcCapital(Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                  <div className={styles.presetBtns}>
                    {[100000, 350000, 500000, 1000000, 2000000].map(amt => (
                      <button 
                        key={amt}
                        type="button"
                        className={styles.presetBtn}
                        onClick={() => setCalcCapital(amt)}
                      >
                        ₹{(amt / 100000).toFixed(amt % 100000 === 0 ? 0 : 1)} Lakh
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputLabel}>
                    <span>Location Type (PMEGP Grant Tier):</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      type="button"
                      className={`${styles.filterBtn} ${isRuralArea ? styles.filterBtnActive : ''}`}
                      onClick={() => setIsRuralArea(true)}
                      style={{ flex: 1 }}
                    >
                      Rural Area (35% Grant)
                    </button>
                    <button 
                      type="button"
                      className={`${styles.filterBtn} ${!isRuralArea ? styles.filterBtnActive : ''}`}
                      onClick={() => setIsRuralArea(false)}
                      style={{ flex: 1 }}
                    >
                      Urban Area (25% Grant)
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.calcResults}>
                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>Government Capital Subsidy Grant:</span>
                  <span className={styles.resultVal} style={{ color: '#059669' }}>
                    ₹{subsidyAmount.toLocaleString('en-IN')} ({Math.round(subsidyPercent * 100)}%)
                  </span>
                </div>

                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>Your Contribution (Promoter Equity 5%):</span>
                  <span className={styles.resultVal} style={{ color: '#0284c7' }}>
                    ₹{promoterContribution.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>Bank Loan Component (Principal):</span>
                  <span className={styles.resultVal} style={{ color: '#475569' }}>
                    ₹{bankLoanAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className={styles.resultRow}>
                  <div>
                    <span className={styles.resultLabel} style={{ fontWeight: 700, color: '#0f172a' }}>
                      Estimated Monthly EMI (5 Years):
                    </span>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Calculated at standard 9.5% p.a. bank MSME interest rate
                    </p>
                  </div>
                  <span className={styles.resultVal} style={{ fontSize: '1.35rem', color: '#047857' }}>
                    ~₹{estimatedEMI.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4-Step Application Walkthrough */}
          <section className={styles.interactiveSection} style={{ marginTop: '2rem' }}>
            <div className={styles.sectionHeader}>
              <div className={styles.statIconWrap} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Direct 4-Step Application Walkthrough
                </h2>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                  Follow this standardized route to secure your in-principle sanction smoothly.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'inline-flex', padding: '0.25rem 0.6rem', background: '#ecfdf5', color: '#059669', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  STEP 1
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 700 }}>Get Free Udyam ID</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Register on udyamregistration.gov.in using Aadhaar. It takes only 5 minutes and is 100% free of cost.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'inline-flex', padding: '0.25rem 0.6rem', background: '#eff6ff', color: '#2563eb', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  STEP 2
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 700 }}>Prepare Project DPR</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Draft your business plan with equipment quotations. You can download the financial projection from GrameenSathi.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'inline-flex', padding: '0.25rem 0.6rem', background: '#fef3c7', color: '#d97706', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  STEP 3
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 700 }}>Apply on Jan Samarth</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Submit the online application on jansamarth.in or kviconline.gov.in. Digital portal links your preferred bank branch.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'inline-flex', padding: '0.25rem 0.6rem', background: '#faf5ff', color: '#7c3aed', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  STEP 4
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 700 }}>Sanction & DBT Credit</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Bank disburses working capital and loan. Government deposits 35% margin subsidy directly into your bank loan account.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Scheme Detail Modal */}
      {activeModalScheme && (
        <div className={styles.modalOverlay} onClick={() => setActiveModalScheme(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  {activeModalScheme.ministry}
                </span>
                <h3 style={{ margin: '0.3rem 0 0 0', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeModalScheme.name}
                </h3>
              </div>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setActiveModalScheme(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.benefitBox}>
                <div className={styles.benefitLabel}>
                  <IndianRupee size={14} /> Maximum Subsidy & Benefit
                </div>
                <div className={styles.benefitAmount} style={{ fontSize: '1.2rem' }}>
                  {activeModalScheme.maxBenefit}
                </div>
                {activeModalScheme.subsidyRate && (
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#166534' }}>
                    <strong>Subsidy Terms:</strong> {activeModalScheme.subsidyRate}
                  </p>
                )}
                {activeModalScheme.interestRate && (
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#166534' }}>
                    <strong>Interest Rate:</strong> {activeModalScheme.interestRate}
                  </p>
                )}
              </div>

              <div className={styles.detailBlock}>
                <h4><CheckCircle2 size={16} color="#059669" /> Who is Eligible:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {activeModalScheme.eligibility.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.detailBlock}>
                <h4><FileText size={16} color="#2563eb" /> Mandatory Documents Required:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {activeModalScheme.documents.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.detailBlock}>
                <h4><ShieldCheck size={16} color="#d97706" /> Step-by-Step Application Guide:</h4>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {activeModalScheme.stepsToApply.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button"
                className={styles.detailsBtn}
                onClick={() => setActiveModalScheme(null)}
              >
                Close
              </button>
              <button 
                type="button"
                className={styles.applyBtn}
                onClick={() => handleOpenDirectApply(activeModalScheme.applyUrl)}
              >
                <span>Open & Apply on {activeModalScheme.shortName} Portal</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GovernmentSchemesPage() {
  return (
    <DashboardProvider>
      <Suspense fallback={
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          Loading Government Schemes & Subsidies...
        </div>
      }>
        <GovernmentSchemesContent />
      </Suspense>
    </DashboardProvider>
  );
}

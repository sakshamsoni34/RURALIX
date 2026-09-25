'use client';

import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Building,
  Headphones
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import styles from './HelpSupportSection.module.css';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    q: 'Why are Dashboard, Reality Check, and Demand Predictor locked?',
    a: 'GrameenSathi generates accurate financial simulations, viability checks, and seasonal stocking estimates specifically for your enterprise. Completing Step 1 (AI Business Planner) provides the necessary business type, capital budget, and location coordinates to unlock these features.'
  },
  {
    q: 'How does the AI Business Planner generate business models?',
    a: 'The planner evaluates your input location, available capital, land, 3-phase power, road access, and skill background. It matches your profile with high-margin rural micro-enterprises and calculates realistic startup capital and unit economics.'
  },
  {
    q: 'What does the Reality Check Viability Score mean?',
    a: 'The Reality Check engine stress-tests your venture against 4 pillars: Customer Demand (0-100), Local Competition Saturation (0-100), Infrastructure Constraints, and Financial Working Capital Burn. A score above 75% indicates a highly viable venture eligible for commercial bank lending.'
  },
  {
    q: 'How can I apply for PMEGP, Mudra, or NABARD capital subsidies?',
    a: 'Under PMEGP (Prime Minister Employment Generation Programme), rural beneficiaries receive 25% to 35% capital subsidy. You can use your GrameenSathi AI Business Plan and Viability Score directly as your Preliminary Project Report (PPR) when filing at kviconline.gov.in or your local District Industries Centre (DIC).'
  },
  {
    q: 'How does the Market Opportunity Map discover local shops and gaps?',
    a: 'The Opportunity Map utilizes OpenStreetMap GIS data combined with real-time geospatial analysis within a 4.5km radius. It highlights active competitor retail shops and identifies untapped high-demand voids (such as cold storage or processing units).'
  },
  {
    q: 'How does the Demand Predictor forecast inventory?',
    a: 'It combines seasonal harvest cycles (Kharif, Rabi, Zaid), local festival spikes (Diwali, Eid, Holi, Wedding season), and weather patterns to project which goods will turn over quickest in your tehsil or panchayat.'
  }
];

export default function HelpSupportSection() {
  const { userProfile, showToast } = useDashboard();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Business Planning & Idea Consultation',
    message: ''
  });

  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`, 'success');
    } catch {
      showToast(`${label}: ${text}`, 'info');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      showToast('Please fill in your name, phone number, and query details.', 'warning');
      return;
    }
    const ticketId = `GS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);
    showToast(`Advisory ticket #${ticketId} submitted successfully!`, 'success');
    setFormData({
      name: '',
      phone: '',
      category: 'Business Planning & Idea Consultation',
      message: ''
    });
  };

  return (
    <div className={styles.helpWrapper}>
      {/* Hero Header */}
      <div className={styles.heroCard}>
        <div className={styles.badge}>
          <Headphones size={13} />
          <span>GrameenSathi Help Desk</span>
        </div>
        <h1 className={styles.heroTitle}>Help & Support Center</h1>
        <p className={styles.heroSubtitle}>
          Have questions or need guidance with your business plan, government schemes, or subsidies? We are here to help.
        </p>
      </div>

      {/* 4 Direct Contact Cards */}
      <div className={styles.contactGrid}>
        {/* Helpline */}
        <div className={styles.contactCard}>
          <div className={`${styles.cardIconWrap} ${styles.iconCall}`}>
            <PhoneCall size={26} />
          </div>
          <span className={styles.cardTag}>Toll-Free Helpline</span>
          <h3 className={styles.cardHeading}>Toll-Free Helpline</h3>
          <p className={styles.cardValue}>1800-889-2040</p>
          <p className={styles.cardDesc}>
            Speak directly with a support officer. Mon – Sat (8:00 AM – 8:00 PM IST). Multi-lingual assistance.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <a href="tel:18008892040" className={`${styles.actionBtn} ${styles.btnPrimary}`}>
              <PhoneCall size={14} /> Call Now
            </a>
            <button 
              type="button"
              onClick={() => handleCopy('1800-889-2040', 'Helpline')} 
              className={`${styles.actionBtn} ${styles.btnOutline}`}
              title="Copy number"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* WhatsApp */}
        <div className={styles.contactCard}>
          <div className={`${styles.cardIconWrap} ${styles.iconWhatsapp}`}>
            <MessageSquare size={26} />
          </div>
          <span className={styles.cardTag}>WhatsApp Support</span>
          <h3 className={styles.cardHeading}>WhatsApp Helpline</h3>
          <p className={styles.cardValue}>+91 98765 43210</p>
          <p className={styles.cardDesc}>
            Chat for document checklists, government subsidy guidelines, and quick answers.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <a 
              href="https://wa.me/919876543210?text=Namaste%20GrameenSathi,%20I%20need%20help%20with%20my%20rural%20business%20plan." 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.actionBtn} ${styles.btnWhatsapp}`}
            >
              <MessageSquare size={14} /> WhatsApp
            </a>
            <button 
              type="button"
              onClick={() => handleCopy('+91 98765 43210', 'WhatsApp Number')} 
              className={`${styles.actionBtn} ${styles.btnOutline}`}
              title="Copy WhatsApp"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Email */}
        <div className={styles.contactCard}>
          <div className={`${styles.cardIconWrap} ${styles.iconEmail}`}>
            <Mail size={26} />
          </div>
          <span className={styles.cardTag}>Official Support</span>
          <h3 className={styles.cardHeading}>Official Email</h3>
          <p className={styles.cardValue} style={{ fontSize: '0.95rem', wordBreak: 'break-all' }}>
            advisory@grameensathi.in
          </p>
          <p className={styles.cardDesc}>
            Send queries regarding detailed business project reports, bank sanctions, or technical platform issues.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <a href="mailto:advisory@grameensathi.in" className={`${styles.actionBtn} ${styles.btnPrimary}`}>
              <Mail size={14} /> Email Us
            </a>
            <button 
              type="button"
              onClick={() => handleCopy('advisory@grameensathi.in', 'Email')} 
              className={`${styles.actionBtn} ${styles.btnOutline}`}
              title="Copy email"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* District Center */}
        <div className={styles.contactCard}>
          <div className={`${styles.cardIconWrap} ${styles.iconLocation}`}>
            <Building size={26} />
          </div>
          <span className={styles.cardTag}>On-Ground Support</span>
          <h3 className={styles.cardHeading}>District Centers</h3>
          <p className={styles.cardValue} style={{ fontSize: '0.95rem' }}>
            DIC & KVK Locator
          </p>
          <p className={styles.cardDesc}>
            Locate your nearest District Industries Centre (DIC) or Krishi Vigyan Kendra (KVK) for physical document stamping.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <button 
              type="button"
              onClick={() => showToast(`Locating centers in ${userProfile?.location || 'your area'}...`, 'info')} 
              className={`${styles.actionBtn} ${styles.btnOutline}`}
            >
              <MapPin size={14} /> Find Nearest DIC
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column: Query Form & FAQs */}
      <div className={styles.contentRow}>
        
        {/* Direct Advisory Form */}
        <div className={styles.formBox}>
          <div className={styles.boxHeader}>
            <h2 className={styles.boxTitle}>
              <Send size={20} color="#059669" /> Submit Advisory Query
            </h2>
            <p className={styles.boxSubtitle}>
              Receive an official response and tailored guidance from our rural enterprise panel within 4 business hours.
            </p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Your Full Name *</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Ramesh Kumar Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mobile / WhatsApp Number *</label>
              <input 
                type="tel" 
                required 
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Query Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={styles.select}
              >
                <option value="Business Planning & Idea Consultation">AI Business Planning & Idea Consultation</option>
                <option value="Feasibility & Reality Check Risk">Feasibility & Reality Check Risk</option>
                <option value="Government Subsidy (PMEGP / Mudra / AIF)">Government Subsidy (PMEGP / Mudra / AIF)</option>
                <option value="Market Demand & Stocking Forecast">Market Demand & Stocking Forecast</option>
                <option value="Opportunity Map & Shop Data">Opportunity Map & Shop Data</option>
                <option value="Technical Support">Technical Support / Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Describe your Question or Request *</label>
              <textarea 
                required 
                placeholder="Describe your enterprise idea, location, loan requirement, or question in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <Send size={16} /> Submit Advisory Query
            </button>
          </form>

          {submittedTicket && (
            <div className={styles.successBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Ticket Registered: #{submittedTicket}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                Your request has been forwarded to the District Enterprise Officer. You will receive an SMS and WhatsApp confirmation shortly.
              </p>
            </div>
          )}
        </div>

        {/* FAQs Box */}
        <div className={styles.faqBox}>
          <div className={styles.boxHeader}>
            <h2 className={styles.boxTitle}>
              <HelpCircle size={20} color="#059669" /> Frequently Asked Questions
            </h2>
            <p className={styles.boxSubtitle}>
              Quick answers to common questions about using GrameenSathi and scaling rural ventures.
            </p>
          </div>

          <div className={styles.faqList}>
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                  <button 
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)} 
                    className={styles.faqQuestion}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={18} color="#059669" /> : <ChevronDown size={18} color="#64748b" />}
                  </button>
                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Emergency Government Helplines */}
      <div className={styles.hotlineBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
          <ShieldCheck size={18} color="#059669" />
          <span>National Government Enterprise & Farmer Helplines</span>
        </div>
        <div className={styles.hotlineGrid}>
          <div className={styles.hotlineItem}>
            <span className={styles.hotlineLabel}>Kisan Call Centre (Agri/Livestock)</span>
            <span className={styles.hotlineNum}>1800-180-1551</span>
          </div>
          <div className={styles.hotlineItem}>
            <span className={styles.hotlineLabel}>MSME Udyam National Assistance</span>
            <span className={styles.hotlineNum}>1800-572-8733</span>
          </div>
          <div className={styles.hotlineItem}>
            <span className={styles.hotlineLabel}>National Agriculture Market (e-NAM)</span>
            <span className={styles.hotlineNum}>1800-270-0224</span>
          </div>
          <div className={styles.hotlineItem}>
            <span className={styles.hotlineLabel}>Women Entrepreneurship (NITI Aayog)</span>
            <span className={styles.hotlineNum}>011-2309-6500</span>
          </div>
        </div>
      </div>
    </div>
  );
}

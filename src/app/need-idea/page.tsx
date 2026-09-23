'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sprout, ArrowLeft } from 'lucide-react';
import AdvisoryModal from '../../components/AdvisoryModal';

export default function NeedIdeaPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, rgba(5, 150, 105, 0.08) 0%, rgba(248, 250, 252, 1) 90%)' }}>
      {/* Top Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
          <Sprout size={32} color="#059669" />
          Grameen<span style={{ color: 'var(--primary)' }}>Sathi</span>
        </Link>

        <Link href="/dashboard" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </nav>

      <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <AdvisoryModal isOpen={true} onClose={() => router.push('/dashboard')} inline={true} />
      </main>
    </div>
  );
}

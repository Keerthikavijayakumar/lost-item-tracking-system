'use client';

import Link from 'next/link';
import Navbar from '@/Frontend/Components/Navbar';
import { Users, Building2, Trophy, BookOpen, ArrowRight, Search, FilePlus, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section - Asymmetric Grid Layout */}
        <section className="container" style={{
          padding: 'var(--space-16) var(--space-4)',
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr',
          gap: '60px',
          alignItems: 'center',
          marginBottom: 'var(--space-8)'
        }}>

          {/* Left Content: Text */}
          <div className="hero-text-content">
            <h1 style={{
              fontSize: '3.5rem',
              color: 'var(--kec-blue)',
              marginBottom: 'var(--space-6)',
              lineHeight: '1.1',
              fontWeight: '800',
              letterSpacing: '-1px'
            }}>
              KEC Lost & Found <br />
              <span style={{ color: 'var(--kec-orange)' }}>Recovery Portal</span>
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-8)',
              lineHeight: '1.6',
              fontSize: '1.2rem',
              maxWidth: '90%'
            }}>
              Welcome to the official lost and found recovery system for Kongu Engineering College.
              This platform empowers students and staff to easily report lost items and browse found belongings,
              creating a connected and supportive campus community.
            </p>
          </div>

          {/* Right Content: Campus Image */}
          <div className="hero-image" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '4px solid white',
              transform: 'rotate(2deg)'
            }}>
              <img
                src="/kec-campus.png"
                alt="KEC Campus IT Park"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Floating Badge */}
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              right: '-10px',
              background: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              borderLeft: '4px solid var(--kec-green)',
              transform: 'rotate(-2deg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--kec-green)', padding: '8px', borderRadius: '50%', color: 'white' }}>
                  <Trophy size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--kec-blue)' }}>95%</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recovery Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow & Actions Section */}
        <section className="container" style={{ padding: '0 var(--space-4) var(--space-20)' }}>
          {/* Workflow Cards */}
          <div className="grid grid-3" style={{ gap: '30px', marginBottom: 'var(--space-16)' }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--kec-orange)' }}>
              <div style={{ background: 'var(--primary-50)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--kec-orange)' }}>
                <Search size={32} />
              </div>
              <h3 style={{ marginBottom: '10px', color: 'var(--kec-blue)' }}>1. Browse Items</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Check our extensive database of found items. Filter by category, date,/location to find your missing belonging quickly.</p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--kec-green)' }}>
              <div style={{ background: 'var(--primary-50)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--kec-green)' }}>
                <FilePlus size={32} />
              </div>
              <h3 style={{ marginBottom: '10px', color: 'var(--kec-blue)' }}>2. Report Lost Item</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Can't find what you're looking for? Submit a detailed report so others can help you recover it if found.</p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--kec-blue)' }}>
              <div style={{ background: 'var(--primary-50)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--kec-blue)' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ marginBottom: '10px', color: 'var(--kec-blue)' }}>3. Recover</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Connect with the finder securely through our platform and arrange a safe pickup on campus.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link href="/LostItems" className="btn" style={{
              background: 'var(--kec-blue)',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px 40px',
              fontSize: '1.1rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-lg)',
              transition: 'transform 0.2s'
            }}>
              <Search size={20} /> BROWSE ITEMS
            </Link>

            <Link href="/LostItems/New" className="btn" style={{
              background: 'white',
              color: 'var(--kec-green)',
              border: '2px solid var(--kec-green)',
              fontWeight: 'bold',
              padding: '14px 40px',
              fontSize: '1.1rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s'
            }}>
              <FilePlus size={20} /> REPORT ITEM
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

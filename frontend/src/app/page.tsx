'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Track Your Scores',
    description: 'Log your Stableford scores after every round. We keep your 5 most recent results to power the draw.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Monthly Prize Draws',
    description: 'Every subscriber enters a prize draw each month. More consistent scores = better odds. Real cash prizes await.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Give to Charity',
    description: 'Choose a charity and allocate 10–30% of your winnings to a cause you care about. Golf with a purpose.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Simple Subscription',
    description: 'Monthly or yearly plans. Powered by Stripe — cancel anytime. No hidden fees, just fair play.',
  },
];

const stats = [
  { value: '£500+', label: 'Monthly Prize Pool' },
  { value: '100%', label: 'Secure Payments' },
  { value: '5+', label: 'Charity Partners' },
  { value: '3 tiers', label: 'Prize Tiers' },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxX = (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * 30;
  const parallaxY = (mousePos.y / (typeof window !== 'undefined' ? window.innerHeight : 1) - 0.5) * 30;

  return (
    <div className="dh-home">
      {/* Hero */}
      <section className="dh-hero" ref={heroRef}>
        <div className="dh-orb dh-orb-1" style={{ transform: `translate(${parallaxX * 0.4}px, ${parallaxY * 0.4}px)` }} />
        <div className="dh-orb dh-orb-2" style={{ transform: `translate(${-parallaxX * 0.2}px, ${-parallaxY * 0.2}px)` }} />
        <div className="dh-orb dh-orb-3" style={{ transform: `translate(${parallaxX * 0.6}px, ${parallaxY * 0.3}px)` }} />

        <div className="dh-hero-content">
          <div className="dh-badge">
            <span className="dh-badge-dot" />
            Live Monthly Draws
          </div>

          <h1 className="dh-hero-title">
            Golf Scores.<br />
            Real Prizes.<br />
            <span className="dh-gradient-text">Real Impact.</span>
          </h1>

          <p className="dh-hero-sub">
            Digital Heroes turns your Stableford score into prize money and charity donations.
            Subscribe, play, and make every round count.
          </p>

          <div className="dh-hero-actions">
            <Link href="/register" className="dh-btn-hero">
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/winners" className="dh-btn-ghost">
              View Winners
            </Link>
          </div>

          <div className="dh-golf-ball" style={{ transform: `translate(${parallaxX * 0.8}px, ${parallaxY * 0.5}px)` }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="url(#ballGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              <circle cx="22" cy="20" r="3" fill="rgba(255,255,255,0.15)"/>
              <circle cx="35" cy="17" r="2" fill="rgba(255,255,255,0.1)"/>
              <circle cx="40" cy="27" r="3" fill="rgba(255,255,255,0.15)"/>
              <circle cx="20" cy="33" r="2.5" fill="rgba(255,255,255,0.1)"/>
              <circle cx="32" cy="38" r="3" fill="rgba(255,255,255,0.15)"/>
              <circle cx="42" cy="38" r="2" fill="rgba(255,255,255,0.1)"/>
              <defs>
                <radialGradient id="ballGrad" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#34d399"/>
                  <stop offset="100%" stopColor="#059669"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="dh-scroll-indicator">
          <div className="dh-scroll-dot" />
        </div>
      </section>

      {/* Stats */}
      <section className="dh-stats">
        {stats.map((s) => (
          <div key={s.label} className="dh-stat-item">
            <div className="dh-stat-value">{s.value}</div>
            <div className="dh-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="dh-section">
        <div className="dh-section-inner">
          <div className="dh-section-header">
            <p className="dh-section-tag">Simple Process</p>
            <h2 className="dh-section-title">How It Works</h2>
            <p className="dh-section-sub">Three easy steps to start winning prizes and giving back.</p>
          </div>

          <div className="dh-steps">
            {[
              { num: '01', title: 'Subscribe', desc: 'Pick a monthly or yearly plan and join the community of golf heroes.' },
              { num: '02', title: 'Play & Submit', desc: 'Log your Stableford scores after each round. We track your best 5.' },
              { num: '03', title: 'Win & Give', desc: 'Enter the monthly draw automatically. Winners receive cash — and donate to charity.' },
            ].map((step) => (
              <div key={step.num} className="dh-step">
                <div className="dh-step-num">{step.num}</div>
                <h3 className="dh-step-title">{step.title}</h3>
                <p className="dh-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="dh-section dh-features-section">
        <div className="dh-section-inner">
          <div className="dh-section-header">
            <p className="dh-section-tag">Platform Features</p>
            <h2 className="dh-section-title">Everything You Need</h2>
            <p className="dh-section-sub">A complete platform built for golfers who want to compete and contribute.</p>
          </div>

          <div className="dh-features-grid">
            {features.map((f) => (
              <div key={f.title} className="dh-feature-card">
                <div className="dh-feature-icon">{f.icon}</div>
                <h3 className="dh-feature-title">{f.title}</h3>
                <p className="dh-feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Tiers */}
      <section className="dh-section">
        <div className="dh-section-inner">
          <div className="dh-section-header">
            <p className="dh-section-tag">Prize Structure</p>
            <h2 className="dh-section-title">Three Ways to Win</h2>
            <p className="dh-section-sub">Match more numbers in the draw for bigger prizes.</p>
          </div>

          <div className="dh-tiers">
            {[
              { tier: '3-Number Match', pct: '10%', label: 'of the prize pool', colorVar: '#60a5fa', glowVar: 'rgba(96,165,250,0.2)', featured: false },
              { tier: '4-Number Match', pct: '20%', label: 'of the prize pool', colorVar: '#a78bfa', glowVar: 'rgba(167,139,250,0.2)', featured: true },
              { tier: '5-Number Match', pct: '70%', label: 'of the prize pool', colorVar: '#10b981', glowVar: 'rgba(16,185,129,0.2)', featured: false },
            ].map((t) => (
              <div
                key={t.tier}
                className={`dh-tier-card${t.featured ? ' dh-tier-featured' : ''}`}
                style={{ '--tier-color': t.colorVar, '--tier-glow': t.glowVar } as React.CSSProperties}
              >
                {t.featured && <div className="dh-tier-badge">Most Common Win</div>}
                <div className="dh-tier-pct" style={{ color: t.colorVar }}>{t.pct}</div>
                <div className="dh-tier-label">{t.label}</div>
                <div className="dh-tier-name">{t.tier}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dh-cta">
        <div className="dh-cta-orb" />
        <div className="dh-cta-inner">
          <h2 className="dh-cta-title">Ready to Become a Digital Hero?</h2>
          <p className="dh-cta-sub">
            Join today — your next round could win you a prize <em>and</em> support a great cause.
          </p>
          <div className="dh-hero-actions">
            <Link href="/register" className="dh-btn-hero">
              Sign Up Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/login" className="dh-btn-ghost">
              Already a member? Log in
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .dh-home { overflow-x: hidden; }

        /* Hero */
        .dh-hero {
          position: relative;
          min-height: calc(100vh - 61px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 80px 24px 120px;
        }
        .dh-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          transition: transform 0.1s ease-out;
        }
        .dh-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%);
          top: -100px; left: -150px;
        }
        .dh-orb-2 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
          bottom: -200px; right: -200px;
        }
        .dh-orb-3 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
          top: 30%; right: 10%;
        }
        .dh-hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 780px;
        }
        .dh-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.3);
          color: #34d399;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .dh-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: dh-pulse 2s ease-in-out infinite;
        }
        @keyframes dh-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #10b981; }
          50% { opacity: 0.5; box-shadow: 0 0 20px #10b981; }
        }
        .dh-hero-title {
          font-size: clamp(2.8rem, 7vw, 5rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin: 0 0 24px 0;
          color: var(--text-primary);
        }
        .dh-gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #34d399 40%, #60a5fa 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dh-hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--text-secondary);
          max-width: 540px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }
        .dh-hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .dh-btn-hero {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 100px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 0 30px rgba(16,185,129,0.3);
        }
        .dh-btn-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(16,185,129,0.5);
          background: linear-gradient(135deg, #059669, #047857);
        }
        .dh-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .dh-btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          color: var(--text-primary);
        }
        .dh-golf-ball {
          position: absolute;
          right: 8%;
          top: 20%;
          opacity: 0.7;
          animation: dh-float 6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes dh-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        .dh-scroll-indicator {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px; height: 42px;
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: 13px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 7px;
        }
        .dh-scroll-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent-primary);
          animation: dh-scroll 2s ease-in-out infinite;
        }
        @keyframes dh-scroll {
          0% { opacity: 1; transform: translateY(0); }
          80% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 0; transform: translateY(0); }
        }

        /* Stats */
        .dh-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          background: rgba(16,185,129,0.06);
          border-top: 1px solid rgba(16,185,129,0.15);
          border-bottom: 1px solid rgba(16,185,129,0.15);
        }
        .dh-stat-item {
          padding: 32px 24px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.06);
          transition: background 0.2s;
        }
        .dh-stat-item:last-child { border-right: none; }
        .dh-stat-item:hover { background: rgba(16,185,129,0.08); }
        .dh-stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #10b981;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .dh-stat-label {
          font-size: 0.82rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Sections */
        .dh-section { padding: 100px 24px; }
        .dh-features-section { background: rgba(255,255,255,0.02); }
        .dh-section-inner { max-width: 1100px; margin: 0 auto; }
        .dh-section-header { text-align: center; margin-bottom: 64px; }
        .dh-section-tag {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #10b981;
          margin: 0 0 12px 0;
        }
        .dh-section-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
          color: var(--text-primary);
        }
        .dh-section-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Steps */
        .dh-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 48px;
        }
        .dh-step { text-align: center; }
        .dh-step-num {
          font-size: 4rem;
          font-weight: 900;
          color: rgba(16,185,129,0.12);
          line-height: 1;
          margin-bottom: 16px;
        }
        .dh-step-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: var(--text-primary);
        }
        .dh-step-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Features */
        .dh-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .dh-feature-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px 28px;
          transition: all 0.3s ease;
          cursor: default;
        }
        .dh-feature-card:hover {
          border-color: rgba(16,185,129,0.4);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(16,185,129,0.08);
        }
        .dh-feature-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        .dh-feature-card:hover .dh-feature-icon {
          background: rgba(16,185,129,0.2);
          box-shadow: 0 0 20px rgba(16,185,129,0.2);
        }
        .dh-feature-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }
        .dh-feature-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Tiers */
        .dh-tiers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }
        .dh-tier-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 36px 24px;
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }
        .dh-tier-card:hover {
          transform: translateY(-4px);
          border-color: var(--tier-color, #10b981);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 30px var(--tier-glow, rgba(16,185,129,0.1));
        }
        .dh-tier-featured {
          border-color: rgba(167,139,250,0.4);
          box-shadow: 0 0 40px rgba(167,139,250,0.1);
        }
        .dh-tier-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 14px;
          border-radius: 100px;
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }
        .dh-tier-pct {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }
        .dh-tier-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .dh-tier-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        /* CTA */
        .dh-cta {
          position: relative;
          padding: 120px 24px;
          text-align: center;
          overflow: hidden;
          border-top: 1px solid var(--border-color);
        }
        .dh-cta-orb {
          position: absolute;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .dh-cta-inner {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }
        .dh-cta-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 20px 0;
          color: var(--text-primary);
        }
        .dh-cta-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0 0 40px 0;
        }
        .dh-cta-sub em {
          color: #10b981;
          font-style: normal;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .dh-golf-ball { display: none; }
          .dh-scroll-indicator { display: none; }
        }
      `}</style>
    </div>
  );
}

// client/src/components/HeroSection.jsx
import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import {
  Fingerprint,
  Users,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';

export default function HeroSection({
  stats,
  onNavigate,
  onOpenPtm,
  selectedCountry
}) {
  // React Spring entrance animations
  const titleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 150,
    config: config.molasses
  });

  const subtitleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(25px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300,
    config: config.molasses
  });

  const cardsSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.92)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay: 450,
    config: config.gentle
  });

  return (
    <section className="hero-section">
      <div className="container">
        {/* GCC Region Banner */}
        <div className="region-pill-box">
          <span className="badge badge-emerald">
            <Sparkles size={13} />
            Unified Gulf Educational Ecosystem
          </span>
          <span className="region-list">
            🇦🇪 United Arab Emirates • 🇸🇦 Saudi Arabia • 🇧🇭 Bahrain • 🇰🇼 Kuwait
          </span>
        </div>

        {/* Hero Title */}
        <animated.div style={titleSpring} className="hero-header">
          <h1 className="hero-title">
            The World’s Most Advanced <br />
            <span className="gradient-text">GCC Biometric School Network</span>
          </h1>
        </animated.div>

        {/* Hero Subtitle */}
        <animated.div style={subtitleSpring} className="hero-description">
          <p>
            Seamlessly integrating smart optical thumb machine attendance, daily nutritional food menus
            for parents, automated OTP-verified teacher consultations, and dynamic campus news across
            1,000s of students from over 45 international nationalities.
          </p>
        </animated.div>

        {/* CTA Actions */}
        <div className="hero-cta-group">
          <button className="btn-primary" onClick={() => onNavigate('biometric')}>
            <Fingerprint size={18} />
            Launch Biometric Thumb Scanner
          </button>
          <button className="btn-gold" onClick={onOpenPtm}>
            <Clock size={18} />
            Book Teacher Meeting (OTP)
          </button>
          <button className="btn-secondary" onClick={() => onNavigate('menu')}>
            <UtensilsCrossed size={18} />
            View Student Menu
          </button>
        </div>

        {/* Interactive Stats Grid */}
        <animated.div style={cardsSpring} className="stats-grid">
          <div className="stat-card glass-panel" onClick={() => onNavigate('directory')}>
            <div className="stat-icon-wrapper emerald">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalStudents ? stats.totalStudents.toLocaleString() : '1,200+'}</span>
              <span className="stat-label">Enrolled Students</span>
              <span className="stat-sub">Across 45+ Nationalities</span>
            </div>
          </div>

          <div className="stat-card glass-panel" onClick={() => onNavigate('directory')}>
            <div className="stat-icon-wrapper blue">
              <ShieldCheck size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalTeachers ? stats.totalTeachers : '120'}</span>
              <span className="stat-label">Certified Faculty</span>
              <span className="stat-sub">STEM, Arts & GCC Heritage</span>
            </div>
          </div>

          <div className="stat-card glass-panel" onClick={() => onNavigate('biometric')}>
            <div className="stat-icon-wrapper gold">
              <Fingerprint size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">Instant 0.2s</span>
              <span className="stat-label">Thumb Machine Sync</span>
              <span className="stat-sub">Live Time-In & Time-Out</span>
            </div>
          </div>

          <div className="stat-card glass-panel" onClick={() => onNavigate('news')}>
            <div className="stat-icon-wrapper purple">
              <Compass size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">6 Campuses</span>
              <span className="stat-label">GCC Educational Hubs</span>
              <span className="stat-sub">Dubai, Riyadh, Manama, Kuwait</span>
            </div>
          </div>
        </animated.div>
      </div>

      <style>{`
        .hero-section {
          padding: 40px 0 60px;
          text-align: center;
          position: relative;
        }

        .region-pill-box {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          padding: 8px 18px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .region-list {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .hero-title {
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          line-height: 1.15;
          margin-bottom: 20px;
          font-weight: 900;
        }

        .gradient-text {
          background: linear-gradient(135deg, #34d399 0%, #10b981 30%, #fbbf24 85%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          max-width: 820px;
          margin: 0 auto 36px;
        }

        .hero-description p {
          font-size: 1.12rem;
          color: #94a3b8;
          line-height: 1.7;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 60px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          text-align: left;
        }

        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(16, 185, 129, 0.4);
        }

        .stat-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-wrapper.emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .stat-icon-wrapper.blue {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .stat-icon-wrapper.gold {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .stat-icon-wrapper.purple {
          background: rgba(139, 92, 246, 0.15);
          color: #c084fc;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.55rem;
          font-weight: 800;
          color: #ffffff;
        }

        .stat-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .stat-sub {
          font-size: 0.76rem;
          color: #64748b;
        }
      `}</style>
    </section>
  );
}

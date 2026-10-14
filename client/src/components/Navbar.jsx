// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import {
  School,
  Fingerprint,
  Newspaper,
  Utensils,
  CalendarCheck,
  Users,
  Menu as MenuIcon,
  X,
  Globe2,
  ChevronDown,
  UserCheck
} from 'lucide-react';

const COUNTRIES = [
  { code: 'ALL', name: 'All GCC Campuses', flag: '🌍' },
  { code: 'UAE', name: 'UAE (Dubai / Abu Dhabi)', flag: '🇦🇪' },
  { code: 'KSA', name: 'Saudi Arabia (Riyadh / Jeddah)', flag: '🇸🇦' },
  { code: 'BHR', name: 'Bahrain (Manama)', flag: '🇧🇭' },
  { code: 'KWT', name: 'Kuwait (Kuwait City)', flag: '🇰🇼' }
];

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedCountry,
  setSelectedCountry,
  onOpenAuth,
  onOpenPtmModal,
  currentUser,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const navSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 20 }
  });

  const selectedCountryObj = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <animated.header style={navSpring} className="navbar-wrapper">
      <div className="container">
        <div className="nav-container glass-panel">
          {/* Logo & Brand */}
          <div className="logo-group" onClick={() => handleNavClick('home')}>
            <div className="logo-icon-box">
              <School className="logo-icon" size={24} />
            </div>
            <div className="logo-text">
              <span className="brand-title">GCC INTERNATIONAL</span>
              <span className="brand-subtitle">Schools of the Gulf • Dubai • Riyadh • Manama</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <button
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button
              className={`nav-link ${activeTab === 'biometric' ? 'active' : ''}`}
              onClick={() => handleNavClick('biometric')}
            >
              <Fingerprint size={16} />
              Thumb Machine
            </button>
            <button
              className={`nav-link ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => handleNavClick('news')}
            >
              <Newspaper size={16} />
              News
            </button>
            <button
              className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => handleNavClick('menu')}
            >
              <Utensils size={16} />
              Student Menu
            </button>
            <button
              className="nav-link nav-link-highlight"
              onClick={onOpenPtmModal}
            >
              <CalendarCheck size={16} />
              Book PTM
            </button>
            <button
              className={`nav-link ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => handleNavClick('directory')}
            >
              <Users size={16} />
              Directory
            </button>

          </nav>

          {/* GCC Country Selector & Auth */}
          <div className="nav-actions">
            {/* Country Selector */}
            <div className="country-dropdown-wrapper">
              <button
                className="country-btn"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              >
                <span>{selectedCountryObj.flag}</span>
                <span className="country-label">{selectedCountryObj.code}</span>
                <ChevronDown size={14} />
              </button>

              {countryDropdownOpen && (
                <div className="country-dropdown-menu glass-panel">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      className={`country-item ${selectedCountry === country.code ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setCountryDropdownOpen(false);
                      }}
                    >
                      <span className="item-flag">{country.flag}</span>
                      <span className="item-name">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin badge shown only when logged in via /admin */}
            {currentUser && (
              <div className="user-profile-badge">
                <div className="user-avatar-tag">
                  <UserCheck size={16} />
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser.fullName || currentUser.username}</span>
                  <span className="user-role">{currentUser.role === 'superadmin' ? 'Superadmin' : 'Admin'}</span>
                </div>
                <button className="btn-logout" onClick={onLogout} title="Sign Out">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu glass-panel">
            <button className="mobile-nav-link" onClick={() => handleNavClick('home')}>
              Home
            </button>
            <button className="mobile-nav-link" onClick={() => handleNavClick('biometric')}>
              <Fingerprint size={18} /> Thumb Machine Biometrics
            </button>
            <button className="mobile-nav-link" onClick={() => handleNavClick('news')}>
              <Newspaper size={18} /> Campus News
            </button>
            <button className="mobile-nav-link" onClick={() => handleNavClick('menu')}>
              <Utensils size={18} /> Student Daily Menu
            </button>
            <button className="mobile-nav-link" onClick={() => { onOpenPtmModal(); setMobileMenuOpen(false); }}>
              <CalendarCheck size={18} /> Book PTM with OTP
            </button>
            <button className="mobile-nav-link" onClick={() => handleNavClick('directory')}>
              <Users size={18} /> Students & Faculty Directory
            </button>

          </div>
        )}
      </div>

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 16px;
          z-index: 100;
          margin-bottom: 24px;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .logo-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981 0%, #047857 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          background: linear-gradient(90deg, #ffffff, #a7f3d0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-subtitle {
          font-size: 0.72rem;
          color: #94a3b8;
          letter-spacing: 0.02em;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #94a3b8;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-link.active {
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          font-weight: 600;
        }

        .nav-link-highlight {
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .nav-link-highlight:hover {
          background: rgba(245, 158, 11, 0.2);
          color: #fde68a;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .country-dropdown-wrapper {
          position: relative;
        }

        .country-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          color: #f8fafc;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .country-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .country-dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 250px;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
          z-index: 200;
        }

        .country-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          text-align: left;
          color: #e2e8f0;
          font-size: 0.86rem;
          transition: background 0.15s ease;
        }

        .country-item:hover {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .country-item.selected {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-weight: 600;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 9999px;
        }

        .user-avatar-tag {
          color: #34d399;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .user-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .user-role {
          font-size: 0.68rem;
          color: #10b981;
          text-transform: uppercase;
        }

        .btn-logout {
          color: #94a3b8;
          padding: 2px;
          border-radius: 50%;
          transition: color 0.2s ease;
        }

        .btn-logout:hover {
          color: #ef4444;
        }

        .mobile-toggle {
          display: none;
          color: #ffffff;
        }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          margin-top: 10px;
          border-radius: 20px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.03);
          text-align: left;
        }

        .mobile-nav-link:hover {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .mobile-auth-btn {
          width: 100%;
          margin-top: 8px;
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </animated.header>
  );
}

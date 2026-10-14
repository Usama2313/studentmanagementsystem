// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BiometricThumbMachine from './components/BiometricThumbMachine';
import NewsSection from './components/NewsSection';
import StudentMenuSection from './components/StudentMenuSection';
import StudentTeacherDirectory from './components/StudentTeacherDirectory';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import PTMBookingModal from './components/PTMBookingModal';
import { fetchHealth, fetchAdminMe } from './api';
import { School, MapPin, ShieldCheck, Heart, Sparkles, Phone, Mail, Globe } from 'lucide-react';

export default function App() {
  const isInitialAdminPath = window.location.pathname === '/admin';
  const [activeTab, setActiveTab] = useState(isInitialAdminPath ? 'admin' : 'home');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [stats, setStats] = useState({
    totalStudents: 1200,
    totalTeachers: 120,
    totalNews: 4,
    menuDaysAvailable: 5,
    biometricLogsCount: 3
  });

  const [ptmModalOpen, setPtmModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadHealthStats();
    restoreAdminSession();

    const handlePopState = () => {
      setActiveTab(window.location.pathname === '/admin' ? 'admin' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const restoreAdminSession = async () => {
    const token = localStorage.getItem('gcc_admin_token');
    const storedUser = localStorage.getItem('gcc_admin_user');
    if (token) {
      if (storedUser) {
        try { setCurrentUser(JSON.parse(storedUser)); } catch (e) {}
      }
      try {
        const data = await fetchAdminMe(token);
        if (data?.user) {
          setCurrentUser(data.user);
          localStorage.setItem('gcc_admin_user', JSON.stringify(data.user));
        }
      } catch (e) {
        localStorage.removeItem('gcc_admin_token');
        localStorage.removeItem('gcc_admin_user');
        setCurrentUser(null);
      }
    }
  };

  const loadHealthStats = async () => {
    try {
      const data = await fetchHealth();
      if (data) {
        setStats(data);
      }
    } catch (e) {
      console.log('Using local fallback stats', e);
    }
  };

  const handleTabChange = (tab) => {
    // Admin is ONLY accessible via direct /admin URL — never from public nav
    if (tab === 'admin') return;
    setActiveTab(tab);
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setActiveTab('admin');
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('gcc_admin_token');
    localStorage.removeItem('gcc_admin_user');
    setCurrentUser(null);
  };

  return (
    <div className="app-root">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onOpenPtmModal={() => setPtmModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="main-content-flow">
        {activeTab === 'home' && (
          <>
            <HeroSection
              stats={stats}
              onNavigate={(tab) => handleTabChange(tab)}
              onOpenPtm={() => setPtmModalOpen(true)}
              selectedCountry={selectedCountry}
            />

            {/* Interactive Biometric Thumb Station Showcase */}
            <BiometricThumbMachine onStatusUpdate={loadHealthStats} />

            {/* Student Daily Food Menu Showcase */}
            <StudentMenuSection onOpenAdmin={navigateToAdmin} />

            {/* Live Campus News Section */}
            <NewsSection
              selectedCountry={selectedCountry}
              onOpenAdmin={navigateToAdmin}
            />

            {/* Directory Showcase */}
            <StudentTeacherDirectory selectedCountry={selectedCountry} />
          </>
        )}

        {activeTab === 'biometric' && (
          <div style={{ paddingTop: 20 }}>
            <BiometricThumbMachine onStatusUpdate={loadHealthStats} />
          </div>
        )}

        {activeTab === 'news' && (
          <div style={{ paddingTop: 20 }}>
            <NewsSection
              selectedCountry={selectedCountry}
              onOpenAdmin={navigateToAdmin}
            />
          </div>
        )}

        {activeTab === 'menu' && (
          <div style={{ paddingTop: 20 }}>
            <StudentMenuSection onOpenAdmin={navigateToAdmin} />
          </div>
        )}

        {activeTab === 'directory' && (
          <div style={{ paddingTop: 20 }}>
            <StudentTeacherDirectory selectedCountry={selectedCountry} />
          </div>
        )}

        {/* Dedicated Admin Portal at /admin */}
        {activeTab === 'admin' && (
          <div style={{ paddingTop: 20 }}>
            {currentUser ? (
              <AdminPanel
                currentUser={currentUser}
                onLogout={handleLogout}
                onRefreshData={loadHealthStats}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={(user) => setCurrentUser(user)}
                onGoHome={() => {
                  setActiveTab('home');
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* PTM Booking Modal with SMS / OTP */}
      <PTMBookingModal
        isOpen={ptmModalOpen}
        onClose={() => setPtmModalOpen(false)}
      />

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col-brand">
              <div className="footer-logo">
                <div className="f-logo-icon">
                  <School size={20} />
                </div>
                <span className="f-logo-title">GCC INTERNATIONAL SCHOOLS</span>
              </div>
              <p className="footer-tagline">
                Pioneering optical biometric security, clinical pediatric nutrition, and transparent parent-teacher
                consultation throughout the Arabian Gulf.
              </p>
              <div className="gcc-flags-row">
                <span title="United Arab Emirates">🇦🇪 UAE</span>
                <span title="Saudi Arabia">🇸🇦 KSA</span>
                <span title="Bahrain">🇧🇭 BHR</span>
                <span title="Kuwait">🇰🇼 KWT</span>
                <span title="Qatar">🇶🇦 QAT</span>
                <span title="Oman">🇴🇲 OMN</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Campus Network</h4>
              <ul className="footer-links">
                <li><MapPin size={13} /> Dubai Academic City (UAE)</li>
                <li><MapPin size={13} /> Riyadh Elite Academy (KSA)</li>
                <li><MapPin size={13} /> Manama Capital Hub (Bahrain)</li>
                <li><MapPin size={13} /> Kuwait City Global Wing (Kuwait)</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Digital Systems</h4>
              <ul className="footer-links">
                <li onClick={() => setActiveTab('biometric')}>• Biometric Thumb Scanner</li>
                <li onClick={() => setActiveTab('menu')}>• Student Dining Nutrition</li>
                <li onClick={() => setPtmModalOpen(true)}>• PTM Consultation (SMS / OTP)</li>
                <li onClick={() => setActiveTab('news')}>• Directorate Dispatches</li>
                <li onClick={() => setActiveTab('directory')}>• 1,000s Students Directory</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Central Directorate</h4>
              <p className="footer-contact-item">
                <Mail size={14} /> info@gccschools.edu
              </p>
              <p className="footer-contact-item">
                <Phone size={14} /> +971 4 800 GCC (422)
              </p>
              <div className="academic-badge">
                <ShieldCheck size={16} className="text-emerald" />
                <span>IB World School & Cambridge Certified</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p>© 2026 GCC International Schools Network. All rights reserved.</p>
            <p className="zero-money-note">
              Dedicated purely to academic excellence, student wellbeing, and parent partnership.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content-flow {
          flex: 1;
        }

        .footer-wrapper {
          background: #090d16;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 60px 0 30px;
          margin-top: 60px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 36px;
          margin-bottom: 40px;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .f-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .f-logo-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          color: #ffffff;
        }

        .footer-tagline {
          font-size: 0.86rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .gcc-flags-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 0.78rem;
          color: #cbd5e1;
        }

        .footer-heading {
          font-size: 0.95rem;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: 0.02em;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .footer-links li {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .footer-links li:hover {
          color: #34d399;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 10px;
        }

        .academic-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-size: 0.78rem;
          font-weight: 600;
          margin-top: 10px;
        }

        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.78rem;
          color: #64748b;
        }

        .zero-money-note {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

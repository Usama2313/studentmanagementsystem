// client/src/components/AuthModal.jsx
import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';
import {
  X,
  User,
  Mail,
  Lock,
  Globe,
  MapPin,
  GraduationCap,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone
} from 'lucide-react';
import { loginUser, registerUser } from '../api';

const NATIONALITIES_OPTIONS = [
  'Emirati', 'Saudi', 'Bahraini', 'Kuwaiti', 'Qatari', 'Omani',
  'British', 'American', 'Canadian', 'Australian',
  'Indian', 'Pakistani', 'Egyptian', 'Jordanian', 'Lebanese',
  'French', 'German', 'Spanish', 'South African', 'Turkish'
];

const GCC_LOCATIONS = [
  'United Arab Emirates (Dubai / Abu Dhabi)',
  'Saudi Arabia (Riyadh / Jeddah)',
  'Bahrain (Manama / Riffa)',
  'Kuwait (Kuwait City / Salmiya)',
  'Qatar (Doha)',
  'Oman (Muscat)'
];

const GRADES_OPTIONS = [
  'Kindergarten 1', 'Kindergarten 2',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12'
];

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('Student'); // 'Student' or 'Parent'

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');

  // Register inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('Emirati');
  const [country, setCountry] = useState(GCC_LOCATIONS[0]);
  const [grade, setGrade] = useState('Grade 9');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 22 }
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your Student ID, Faculty ID, or Username.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginUser(loginIdentifier, role);
      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login credentials not recognized.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await registerUser({
        fullName,
        email,
        role,
        nationality,
        country,
        grade,
        parentName,
        phone
      });

      if (res.success) {
        setSuccessResult(res.user);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#10b981', '#34d399', '#fbbf24']
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <animated.div style={modalSpring} className="modal-content auth-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="badge badge-emerald" style={{ marginBottom: 8 }}>
            <Sparkles size={14} />
            <span>GCC International Academic Access</span>
          </div>
          <h2 className="auth-headline">
            {mode === 'login' ? 'Campus Portal Sign In' : 'International Student & Parent Registration'}
          </h2>
          <p className="auth-subtext">
            Supporting multinational families across Bahrain, Saudi Arabia, Kuwait, and UAE.
          </p>

          {/* Mode Switcher */}
          <div className="auth-mode-tabs">
            <button
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessResult(null);
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessResult(null);
              }}
            >
              Register New Student / Parent
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success confirmation card for newly registered user */}
        {successResult ? (
          <div className="registration-success-card">
            <div className="reg-success-icon">
              <CheckCircle2 size={40} className="text-emerald" />
            </div>
            <h3>Registration Complete!</h3>
            <p className="reg-welcome-msg">
              Welcome to GCC International Schools, <strong>{successResult.name}</strong>!
            </p>

            <div className="assigned-credentials-box">
              <div className="cred-row">
                <span>Assigned Student ID:</span>
                <strong>{successResult.id}</strong>
              </div>
              <div className="cred-row">
                <span>Biometric Thumbprint ID:</span>
                <strong className="text-emerald">
                  <Fingerprint size={14} /> {successResult.thumbprintId}
                </strong>
              </div>
              <div className="cred-row">
                <span>Nationality & Country:</span>
                <span>{successResult.nationality} ({successResult.country.split('(')[0]})</span>
              </div>
            </div>

            <p className="biometric-note">
              ℹ️ Your thumbprint ID is activated! You may now immediately use the <strong>Biometric Thumb Machine</strong> on the website or gates to log Time In and Time Out.
            </p>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: 16 }}
              onClick={() => {
                onAuthSuccess(successResult);
                onClose();
              }}
            >
              Enter Campus Portal
            </button>
          </div>
        ) : mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="role-pills-row">
                <button
                  type="button"
                  className={`role-pill ${role === 'Student' ? 'active' : ''}`}
                  onClick={() => setRole('Student')}
                >
                  <GraduationCap size={15} /> Student
                </button>
                <button
                  type="button"
                  className={`role-pill ${role === 'Parent' ? 'active' : ''}`}
                  onClick={() => setRole('Parent')}
                >
                  <User size={15} /> Parent
                </button>
                <button
                  type="button"
                  className={`role-pill ${role === 'Admin' ? 'active' : ''}`}
                  onClick={() => setRole('Admin')}
                >
                  👑 Admin
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Student ID / Faculty ID / Admin Username *</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  className="form-input icon-padded"
                  placeholder="e.g. GCC-STU-5001 or admin"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                />
              </div>
              <span className="demo-hint">Demo tip: enter "admin" for Director Access, or any student name/ID.</span>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM (Multinational & GCC) */
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Registration Category</label>
              <div className="role-pills-row">
                <button
                  type="button"
                  className={`role-pill ${role === 'Student' ? 'active' : ''}`}
                  onClick={() => setRole('Student')}
                >
                  <GraduationCap size={15} /> New Student
                </button>
                <button
                  type="button"
                  className={`role-pill ${role === 'Parent' ? 'active' : ''}`}
                  onClick={() => setRole('Parent')}
                >
                  <User size={15} /> Parent Guardian
                </button>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Tariq Al-Dosari"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="tariq@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              {/* International Nationality Selector */}
              <div className="form-group">
                <label className="form-label">
                  <Globe size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Nationality (All Nationalities Welcome) *
                </label>
                <select
                  className="form-select"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                >
                  {NATIONALITIES_OPTIONS.map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
              </div>

              {/* GCC Country */}
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                  GCC Country of Residence *
                </label>
                <select
                  className="form-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {GCC_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Academic Grade</label>
                <select
                  className="form-select"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  {GRADES_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Parent / Guardian Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Saud Al-Dosari"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              <Fingerprint size={18} />
              <span>{loading ? 'Creating Biometric Profile...' : 'Complete Registration & Generate Thumb ID'}</span>
            </button>
          </form>
        )}
      </animated.div>

      <style>{`
        .auth-modal {
          max-width: 580px;
          padding: 32px;
          position: relative;
        }

        .auth-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #94a3b8;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .auth-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .auth-modal-header {
          margin-bottom: 24px;
        }

        .auth-headline {
          font-size: 1.55rem;
          margin-bottom: 6px;
        }

        .auth-subtext {
          color: #94a3b8;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .auth-mode-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 4px;
          margin-top: 18px;
        }

        .auth-tab-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #94a3b8;
          transition: all 0.2s ease;
        }

        .auth-tab-btn.active {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }

        .role-pills-row {
          display: flex;
          gap: 10px;
        }

        .role-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 0.84rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .role-pill.active {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #34d399;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .icon-padded {
          padding-left: 44px;
        }

        .demo-hint {
          font-size: 0.74rem;
          color: #64748b;
          margin-top: 6px;
        }

        .auth-submit-btn {
          width: 100%;
          margin-top: 16px;
          padding: 14px;
        }

        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .registration-success-card {
          text-align: center;
          padding: 10px 0;
        }

        .reg-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }

        .reg-welcome-msg {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 20px;
        }

        .assigned-credentials-box {
          text-align: left;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .cred-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.86rem;
          color: #cbd5e1;
        }

        .cred-row strong {
          color: #ffffff;
          font-family: var(--font-heading);
        }

        .biometric-note {
          font-size: 0.82rem;
          color: #94a3b8;
          line-height: 1.5;
          text-align: left;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 12px 14px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

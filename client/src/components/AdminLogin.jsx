// client/src/components/AdminLogin.jsx
import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  AlertCircle,
  Sparkles,
  ArrowRight,
  School,
  Database,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { adminLogin } from '../api';

export default function AdminLogin({ onLoginSuccess, onGoHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const data = await adminLogin(username.trim(), password);
      if (data?.token && data?.user) {
        localStorage.setItem('gcc_admin_token', data.token);
        localStorage.setItem('gcc_admin_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else {
        setErrorMsg('Authentication did not return a valid session token.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (role) => {
    if (role === 'superadmin') {
      setUsername('superadmin');
      setPassword('SuperAdmin@GCC2026!');
    } else {
      setUsername('admin');
      setPassword('Admin@GCC2026!');
    }
    setErrorMsg('');
  };

  return (
    <div className="admin-login-fullscreen">
      <div className="admin-login-card glass-panel">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-badge-icon">
            <ShieldCheck size={36} className="text-gold" />
          </div>
          <h2>Executive Admin Gateway</h2>
          <p className="admin-subtext">
            GCC International Schools Central Directorate • Multi-Campus Operations
          </p>
        </div>

        {/* Security Shield Notice */}
        <div className="admin-security-banner">
          <div className="sec-banner-item">
            <Cpu size={14} /> <span>AES-256-GCM Encrypted</span>
          </div>
          <div className="sec-banner-item">
            <Database size={14} /> <span>SQL Injection Immune</span>
          </div>
          <div className="sec-banner-item">
            <Lock size={14} /> <span>Bcrypt-12 Salted Hashing</span>
          </div>
        </div>

        {errorMsg && (
          <div className="admin-error-box">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>
              <User size={15} /> Administrator Username or Email
            </label>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. admin or superadmin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <KeyRound size={15} /> Security Password
            </label>
            <input
              type="password"
              className="admin-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-admin-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-label">Authenticating Session...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Buttons for Testing */}
        <div className="quick-test-section">
          <div className="quick-test-label">
            <Sparkles size={14} /> One-Click Role Testing:
          </div>
          <div className="quick-test-buttons">
            <button
              type="button"
              className="btn-quick-fill superadmin"
              onClick={() => fillQuickDemo('superadmin')}
            >
              👑 Fill Superadmin
            </button>
            <button
              type="button"
              className="btn-quick-fill admin"
              onClick={() => fillQuickDemo('admin')}
            >
              🎓 Fill Campus Admin
            </button>
          </div>
          <p className="quick-test-hint">
            Per strict requirements, student & teacher logins are disabled. Only authorized administrators can access this portal.
          </p>
        </div>

        <div className="admin-card-footer">
          <button type="button" className="btn-back-home" onClick={onGoHome}>
            ← Back to Public School Portal
          </button>
        </div>
      </div>
    </div>
  );
}

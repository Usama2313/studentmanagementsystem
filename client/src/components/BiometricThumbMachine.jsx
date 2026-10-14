// client/src/components/BiometricThumbMachine.jsx
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';
import {
  Fingerprint,
  ThumbsUp,
  LogIn,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
  Activity,
  Search
} from 'lucide-react';
import { scanBiometric, fetchBiometricLogs } from '../api';

export default function BiometricThumbMachine({ onStatusUpdate }) {
  const [identifier, setIdentifier] = useState('');
  const [terminal, setTerminal] = useState('Gate 1 - North Biometric Portal');
  const [roleMode, setRoleMode] = useState('Student'); // 'Student' or 'Teacher'
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [recentLogs, setRecentLogs] = useState([]);

  // React Spring scanner pulse animation
  const scannerSpring = useSpring({
    transform: scanning ? 'scale(1.08)' : 'scale(1)',
    boxShadow: scanning
      ? '0 0 50px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4)'
      : '0 0 20px rgba(16, 185, 129, 0.15)',
    config: { tension: 300, friction: 15 }
  });

  const resultSpring = useSpring({
    opacity: scanResult ? 1 : 0,
    transform: scanResult ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 260, friction: 20 }
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchBiometricLogs();
      if (data && data.data) {
        setRecentLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch biometric logs', err);
    }
  };

  const executeThumbScan = async (targetId) => {
    const idToUse = targetId || identifier;
    if (!idToUse.trim()) {
      setErrorMsg('Please enter or select a Student / Teacher ID or Name.');
      return;
    }

    setScanning(true);
    setErrorMsg('');
    setScanResult(null);

    try {
      // Simulate realistic biometric laser scan delay
      setTimeout(async () => {
        try {
          const res = await scanBiometric(idToUse, terminal);
          setScanning(false);
          setScanResult(res);
          loadLogs();
          if (onStatusUpdate) onStatusUpdate();

          // Confetti celebration on successful thumb read!
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: res.eventType === 'TIME_IN' ? ['#10b981', '#34d399', '#6ee7b7'] : ['#f59e0b', '#fbbf24', '#fde68a']
          });
        } catch (err) {
          setScanning(false);
          setErrorMsg(err.message || 'Thumbprint unrecognized. Please try again.');
        }
      }, 700);
    } catch (err) {
      setScanning(false);
      setErrorMsg('Biometric hardware communication error.');
    }
  };

  // Sample quick test profiles for rapid demonstration
  const quickTestStudents = [
    { name: 'Mohammed Al-Maktoum', id: 'GCC-STU-5001', country: 'Dubai, UAE' },
    { name: 'Ali Al-Saud', id: 'GCC-STU-5002', country: 'Riyadh, Saudi Arabia' },
    { name: 'Noor Al-Khalifa', id: 'GCC-STU-5003', country: 'Manama, Bahrain' },
    { name: 'Hamad Al-Sabah', id: 'GCC-STU-5004', country: 'Kuwait City, Kuwait' }
  ];

  const quickTestTeachers = [
    { name: 'Dr. Tariq Al-Mansoor', id: 'TCH-1001', subject: 'Robotics & AI' },
    { name: 'Prof. Maryam Al-Hashemi', id: 'TCH-1002', subject: 'Aerospace Physics' },
    { name: 'Ustadh Omar Al-Ghamdi', id: 'TCH-1003', subject: 'Arabic Literature' },
    { name: 'Ms. Sarah Johnson', id: 'TCH-1004', subject: 'Calculus' }
  ];

  return (
    <div className="biometric-station-container">
      <div className="container">
        {/* Section Header */}
        <div className="station-header">
          <div className="station-badge">
            <Fingerprint size={16} />
            <span>Biometric Hardware Terminal • Model GCC-BIO-X9</span>
          </div>
          <h2 className="station-title">
            Smart Optical <span className="text-emerald">Thumb Machine</span>
          </h2>
          <p className="station-desc">
            Students and Teachers perform a simple thumbs up scan on the terminal. The intelligent engine automatically records
            <strong> TIME IN</strong> (morning arrival) or <strong>TIME OUT</strong> (departure) with 100% precision.
          </p>
        </div>

        <div className="station-grid">
          {/* Main Interactive Scanner Console */}
          <div className="scanner-console glass-panel">
            <div className="console-top-bar">
              <div className="live-indicator">
                <span className="live-dot"></span>
                <span>TERMINAL ONLINE</span>
              </div>
              <div className="terminal-selector">
                <select
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                  className="terminal-select"
                >
                  <option value="Gate 1 - North Biometric Portal">Gate 1 - North Portal (Dubai)</option>
                  <option value="Gate 2 - South Scanner">Gate 2 - South Scanner (Riyadh)</option>
                  <option value="Gate 3 - Academic Wing">Gate 3 - Academic Wing (Manama)</option>
                  <option value="Gate 4 - Senior High Hub">Gate 4 - Senior High Hub (Kuwait)</option>
                </select>
              </div>
            </div>

            {/* Role Mode Selector */}
            <div className="role-switch-container">
              <button
                className={`role-tab ${roleMode === 'Student' ? 'active' : ''}`}
                onClick={() => setRoleMode('Student')}
              >
                <GraduationCap size={16} />
                Student Thumbs Up
              </button>
              <button
                className={`role-tab ${roleMode === 'Teacher' ? 'active' : ''}`}
                onClick={() => setRoleMode('Teacher')}
              >
                <Briefcase size={16} />
                Teacher Thumbs Up
              </button>
            </div>

            {/* Interactive Fingerprint Scanner Ring */}
            <div className="scanner-center-area">
              <animated.div
                style={scannerSpring}
                className={`fingerprint-target ${scanning ? 'is-scanning' : ''}`}
                onClick={() => executeThumbScan()}
                title="Click or tap to scan thumb"
              >
                {scanning && <div className="scanning-laser"></div>}
                <div className="concentric-ring ring-1"></div>
                <div className="concentric-ring ring-2"></div>
                <Fingerprint size={86} className="fingerprint-graphic" />
                <div className="scan-prompt-text">
                  <ThumbsUp size={16} className="thumb-icon-pulse" />
                  <span>{scanning ? 'READING THUMB...' : 'THUMBS UP TO SCAN'}</span>
                </div>
              </animated.div>
            </div>

            {/* Manual Identification input or preset selection */}
            <div className="manual-input-box">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder={`Search or enter ${roleMode} ID or Name...`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeThumbScan()}
                  className="form-input search-field"
                />
              </div>
              <button
                className="btn-primary scan-now-btn"
                onClick={() => executeThumbScan()}
                disabled={scanning}
              >
                <ThumbsUp size={18} />
                <span>{scanning ? 'Scanning...' : 'Thumb Check'}</span>
              </button>
            </div>

            {/* Quick Demo Test Bar */}
            <div className="quick-test-presets">
              <span className="presets-label">⚡ 1-Click Test Scenarios:</span>
              <div className="presets-chips">
                {(roleMode === 'Student' ? quickTestStudents : quickTestTeachers).map((item) => (
                  <button
                    key={item.id}
                    className="preset-chip"
                    onClick={() => {
                      setIdentifier(item.name);
                      executeThumbScan(item.name);
                    }}
                  >
                    <span>{item.name}</span>
                    <span className="chip-sub">({item.id})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scan Feedback Result Card */}
            {errorMsg && (
              <div className="scan-alert alert-error">
                <AlertCircle size={20} />
                <span>{errorMsg}</span>
              </div>
            )}

            {scanResult && (
              <animated.div style={resultSpring} className="scan-success-card">
                <div className="success-header">
                  <div className={`event-badge ${scanResult.eventType === 'TIME_IN' ? 'badge-timein' : 'badge-timeout'}`}>
                    {scanResult.eventType === 'TIME_IN' ? <LogIn size={18} /> : <LogOut size={18} />}
                    <span>{scanResult.eventType === 'TIME_IN' ? 'TIME IN RECORDED' : 'TIME OUT RECORDED'}</span>
                  </div>
                  <span className="event-timestamp">
                    <Clock size={15} />
                    {scanResult.log?.timestamp || 'Just now'}
                  </span>
                </div>

                <div className="person-summary">
                  <div className="person-avatar-circle">
                    {scanResult.person.role === 'Student' ? <GraduationCap size={24} /> : <Briefcase size={24} />}
                  </div>
                  <div className="person-details">
                    <h3 className="person-name">{scanResult.person.name}</h3>
                    <p className="person-role-tag">
                      {scanResult.person.role} • {scanResult.person.grade || scanResult.person.campus}
                    </p>
                    <p className="person-status-line">
                      Status: <strong className="text-emerald">{scanResult.person.status}</strong>
                    </p>
                  </div>
                </div>

                <div className="time-in-out-summary-box">
                  <div className="time-tile time-in-tile">
                    <span className="tile-label">First Time-In</span>
                    <span className="tile-time">{scanResult.person.timeIn || '—'}</span>
                  </div>
                  <div className="time-tile time-out-tile">
                    <span className="tile-label">Latest Time-Out</span>
                    <span className="tile-time">{scanResult.person.timeOut || 'Inside Campus'}</span>
                  </div>
                </div>

                <p className="feedback-message">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>{scanResult.message}</span>
                </p>
              </animated.div>
            )}
          </div>

          {/* Live Biometric Activity Feed */}
          <div className="feed-panel glass-panel">
            <div className="feed-header">
              <div className="feed-title-group">
                <Activity size={20} className="text-emerald" />
                <h3>Live Thumb Machine Log Feed</h3>
              </div>
              <span className="badge badge-emerald">Real-Time Sync</span>
            </div>

            <div className="logs-stream">
              {recentLogs.length === 0 ? (
                <div className="empty-logs">No biometric events recorded yet. Perform a thumb scan to start!</div>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="log-item">
                    <div className={`log-event-icon ${log.eventType === 'TIME_IN' ? 'in' : 'out'}`}>
                      {log.eventType === 'TIME_IN' ? <LogIn size={16} /> : <LogOut size={16} />}
                    </div>

                    <div className="log-content">
                      <div className="log-top">
                        <span className="log-person-name">{log.name}</span>
                        <span className={`log-tag ${log.eventType === 'TIME_IN' ? 'tag-in' : 'tag-out'}`}>
                          {log.eventType === 'TIME_IN' ? 'TIME IN' : 'TIME OUT'}
                        </span>
                      </div>
                      <div className="log-sub">
                        <span>{log.role}</span> • <span>{log.details}</span> • <span className="log-term">{log.terminal}</span>
                      </div>
                    </div>

                    <div className="log-time">
                      <Clock size={13} />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .biometric-station-container {
          padding: 30px 0 60px;
        }

        .station-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 40px;
        }

        .station-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .station-title {
          font-size: clamp(2rem, 3.5vw, 3rem);
          margin-bottom: 12px;
        }

        .text-emerald {
          color: #10b981;
        }

        .station-desc {
          color: #94a3b8;
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .station-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 28px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .station-grid {
            grid-template-columns: 1fr;
          }
        }

        .scanner-console {
          padding: 30px;
          border-radius: 28px;
          position: relative;
          border: 1px solid rgba(16, 185, 129, 0.2);
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 14, 23, 0.95) 100%);
        }

        .console-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #34d399;
          letter-spacing: 0.06em;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: thumbPulse 2s infinite;
        }

        .terminal-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.8rem;
          outline: none;
        }

        .role-switch-container {
          display: flex;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 30px;
        }

        .role-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #94a3b8;
          transition: all 0.2s ease;
        }

        .role-tab.active {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }

        .scanner-center-area {
          display: flex;
          justify-content: center;
          margin: 10px 0 35px;
        }

        .fingerprint-target {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 70%);
          border: 2px solid rgba(16, 185, 129, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          user-select: none;
          transition: border-color 0.3s ease;
        }

        .fingerprint-target:hover {
          border-color: #34d399;
        }

        .fingerprint-graphic {
          color: #34d399;
          filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6));
          margin-bottom: 8px;
          transition: transform 0.2s ease;
        }

        .fingerprint-target:hover .fingerprint-graphic {
          transform: scale(1.05);
        }

        .concentric-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(16, 185, 129, 0.3);
          pointer-events: none;
        }

        .ring-1 {
          width: 170px;
          height: 170px;
        }

        .ring-2 {
          width: 250px;
          height: 250px;
          opacity: 0.4;
        }

        .scan-prompt-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #a7f3d0;
          letter-spacing: 0.08em;
        }

        .thumb-icon-pulse {
          color: #fbbf24;
        }

        .manual-input-box {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-field {
          padding-left: 42px;
        }

        .scan-now-btn {
          white-space: nowrap;
          padding: 12px 20px;
        }

        .quick-test-presets {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .presets-label {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .presets-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preset-chip {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          font-size: 0.78rem;
          color: #e2e8f0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .preset-chip:hover {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #34d399;
          transform: translateY(-1px);
        }

        .chip-sub {
          font-size: 0.7rem;
          color: #64748b;
        }

        .scan-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.88rem;
          margin-top: 14px;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .scan-success-card {
          margin-top: 20px;
          padding: 20px;
          border-radius: 18px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .success-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .event-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .badge-timein {
          background: #10b981;
          color: #ffffff;
        }

        .badge-timeout {
          background: #f59e0b;
          color: #0f172a;
        }

        .event-timestamp {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.82rem;
          color: #94a3b8;
        }

        .person-summary {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .person-avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .person-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }

        .person-role-tag {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .time-in-out-summary-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }

        .time-tile {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
        }

        .tile-label {
          font-size: 0.74rem;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .tile-time {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .feedback-message {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: #cbd5e1;
          margin: 0;
        }

        /* Feed Panel */
        .feed-panel {
          padding: 24px;
          border-radius: 28px;
          max-height: 700px;
          display: flex;
          flex-direction: column;
        }

        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 16px;
        }

        .feed-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feed-title-group h3 {
          font-size: 1.15rem;
        }

        .logs-stream {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 4px;
        }

        .log-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: background 0.15s ease;
        }

        .log-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .log-event-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .log-event-icon.in {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .log-event-icon.out {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .log-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .log-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .log-person-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #ffffff;
        }

        .log-tag {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .tag-in {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .tag-out {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }

        .log-sub {
          font-size: 0.74rem;
          color: #94a3b8;
        }

        .log-term {
          color: #64748b;
        }

        .log-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
        }

        .empty-logs {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

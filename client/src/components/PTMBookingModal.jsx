// client/src/components/PTMBookingModal.jsx
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';
import {
  CalendarCheck,
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { fetchTeachers, requestPtmOtp, verifyPtmOtp } from '../api';

const GCC_DIAL_CODES = [
  { country: 'UAE (Dubai / Abu Dhabi)', dial: '+971', flag: '🇦🇪' },
  { country: 'Saudi Arabia (Riyadh / Jeddah)', dial: '+966', flag: '🇸🇦' },
  { country: 'Bahrain (Manama)', dial: '+973', flag: '🇧🇭' },
  { country: 'Kuwait (Kuwait City)', dial: '+965', flag: '🇰🇼' },
  { country: 'Qatar (Doha)', dial: '+974', flag: '🇶🇦' },
  { country: 'Oman (Muscat)', dial: '+968', flag: '🇴🇲' }
];

export default function PTMBookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Teacher & Slot, 2: Parent details, 3: OTP verification, 4: Confirmed
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [dialCode, setDialCode] = useState('+971');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [meetingDate, setMeetingDate] = useState('Thursday, Oct 22, 2026');

  // OTP State
  const [bookingRef, setBookingRef] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [simulatedSms, setSimulatedSms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 22 }
  });

  const smsBannerSpring = useSpring({
    from: { transform: 'translateY(-30px)', opacity: 0 },
    to: { transform: simulatedSms ? 'translateY(0px)' : 'translateY(-30px)', opacity: simulatedSms ? 1 : 0 }
  });

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
      resetForm();
    }
  }, [isOpen]);

  const loadTeachers = async () => {
    try {
      const data = await fetchTeachers();
      if (data && data.data) {
        setTeachers(data.data.slice(0, 15));
        setSelectedTeacher(data.data[0]);
        if (data.data[0].availableSlots?.length) {
          setSelectedSlot(data.data[0].availableSlots[0]);
        }
      }
    } catch (err) {
      console.error('Failed loading teachers', err);
    }
  };

  const resetForm = () => {
    setStep(1);
    setOtpValue('');
    setSimulatedSms(null);
    setErrorMsg('');
    setConfirmedBooking(null);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!parentName.trim() || !phoneNumber.trim()) {
      setErrorMsg('Please enter parent name and contact number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await requestPtmOtp({
        teacherId: selectedTeacher.id,
        timeSlot: selectedSlot,
        parentName,
        studentName,
        countryCode: dialCode,
        phoneNumber,
        meetingDate
      });

      setBookingRef(res.bookingRef);
      setSimulatedSms({
        to: `${dialCode} ${phoneNumber}`,
        otp: res.demoOtp,
        teacher: selectedTeacher.name,
        slot: selectedSlot
      });
      setStep(3); // Go to OTP verification step
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch SMS OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await verifyPtmOtp(bookingRef, otpValue);
      setConfirmedBooking(res.booking);
      setStep(4); // Confirmed!

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#10b981', '#3b82f6', '#f59e0b']
      });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code. Please verify the SMS alert.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <animated.div style={modalSpring} className="modal-content ptm-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="ptm-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="ptm-header">
          <div className="badge badge-gold" style={{ marginBottom: 8 }}>
            <CalendarCheck size={14} />
            <span>Secure SMS / OTP Verified Consultation</span>
          </div>
          <h2 className="ptm-title">Book Parent-Teacher Meeting (PTM)</h2>
          <p className="ptm-subtitle">
            Directly reserve dedicated one-on-one consultation slots with educators across Bahrain, Saudi Arabia, Kuwait, and UAE.
          </p>

          {/* Stepper Indicator */}
          <div className="ptm-stepper">
            <span className={`step-pill ${step >= 1 ? 'active' : ''}`}>1. Select Faculty</span>
            <ChevronRight size={14} className="step-arrow" />
            <span className={`step-pill ${step >= 2 ? 'active' : ''}`}>2. Parent Info</span>
            <ChevronRight size={14} className="step-arrow" />
            <span className={`step-pill ${step >= 3 ? 'active' : ''}`}>3. SMS OTP</span>
            <ChevronRight size={14} className="step-arrow" />
            <span className={`step-pill ${step >= 4 ? 'active' : ''}`}>4. Confirmed</span>
          </div>
        </div>

        {/* Step 1: Select Teacher & Slot */}
        {step === 1 && (
          <div className="ptm-step-content">
            <div className="form-group">
              <label className="form-label">Select Educator / Subject Lead</label>
              <select
                className="form-select"
                value={selectedTeacher?.id || ''}
                onChange={(e) => {
                  const t = teachers.find((tch) => tch.id === e.target.value);
                  setSelectedTeacher(t);
                  if (t?.availableSlots?.length) setSelectedSlot(t.availableSlots[0]);
                }}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.subject} ({t.campus})
                  </option>
                ))}
              </select>
            </div>

            {selectedTeacher && (
              <div className="teacher-info-preview">
                <div className="teacher-avatar-circle">
                  <GraduationCap size={28} className="text-emerald" />
                </div>
                <div className="teacher-details">
                  <h4>{selectedTeacher.name}</h4>
                  <p className="subject-line">{selectedTeacher.subject}</p>
                  <p className="campus-line">📍 {selectedTeacher.campus} ({selectedTeacher.country})</p>
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Choose Consultation Slot</label>
              <div className="slots-grid">
                {selectedTeacher?.availableSlots?.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`slot-chip ${selectedSlot === s ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(s)}
                  >
                    <Clock size={14} />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-btn-row">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => setStep(2)}>
                Next: Enter Parent Details
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Parent Details & GCC Phone */}
        {step === 2 && (
          <form onSubmit={handleRequestOtp} className="ptm-step-content">
            <div className="form-group">
              <label className="form-label">Parent / Guardian Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g., Sheikh Mansoor Al-Nahyan"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student Name (Enrolled Child)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Zayed Al-Nahyan"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GCC Country Mobile Number (for SMS OTP) *</label>
              <div className="phone-input-row">
                <select
                  className="form-select phone-code-select"
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                >
                  {GCC_DIAL_CODES.map((item) => (
                    <option key={item.dial} value={item.dial}>
                      {item.flag} {item.dial} ({item.country.split('(')[0]})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  className="form-input phone-number-input"
                  placeholder="50 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <span className="form-hint">A one-time 6-digit SMS verification code will be sent to this number.</span>
            </div>

            {errorMsg && (
              <div className="form-error-banner">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="modal-btn-row">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" className="btn-gold" disabled={loading}>
                <MessageSquare size={16} />
                <span>{loading ? 'Sending SMS...' : 'Send SMS Verification OTP'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Enter OTP */}
        {step === 3 && (
          <div className="ptm-step-content">
            {/* Simulated Incoming SMS Toast */}
            {simulatedSms && (
              <animated.div style={smsBannerSpring} className="simulated-sms-box">
                <div className="sms-top">
                  <div className="sms-badge">
                    <MessageSquare size={14} />
                    <span>GCC SCHOOLS SMS DISPATCH</span>
                  </div>
                  <span className="sms-timestamp">Just now</span>
                </div>
                <div className="sms-body">
                  "Your GCC Schools PTM verification OTP is{' '}
                  <strong className="sms-otp-highlight">{simulatedSms.otp}</strong>. Confirm meeting with{' '}
                  {simulatedSms.teacher} for {simulatedSms.slot}."
                </div>
                <button
                  type="button"
                  className="sms-auto-fill-btn"
                  onClick={() => setOtpValue(simulatedSms.otp)}
                >
                  <Copy size={13} />
                  <span>Click to Auto-fill Code ({simulatedSms.otp})</span>
                </button>
              </animated.div>
            )}

            <form onSubmit={handleVerifyOtp} className="otp-form">
              <label className="form-label text-center">
                Enter the 6-Digit Verification Code sent to {dialCode} {phoneNumber}
              </label>

              <input
                type="text"
                maxLength={6}
                required
                className="otp-code-input"
                placeholder="• • • • • •"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />

              {errorMsg && (
                <div className="form-error-banner">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="modal-btn-row">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                  Change Phone Number
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  <ShieldCheck size={18} />
                  <span>{loading ? 'Verifying...' : 'Verify OTP & Confirm Slot'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Booking Confirmed Pass */}
        {step === 4 && confirmedBooking && (
          <div className="ptm-step-content ptm-confirmed-view">
            <div className="confirmed-icon-circle">
              <CheckCircle2 size={42} className="text-emerald" />
            </div>

            <h3 className="confirmed-title">Meeting Successfully Confirmed!</h3>
            <p className="confirmed-subtitle">
              Your consultation pass has been recorded and verified via GCC SMS/OTP.
            </p>

            <div className="booking-pass-card">
              <div className="pass-row">
                <span className="pass-label">Booking Reference</span>
                <span className="pass-val text-gold">{confirmedBooking.bookingId}</span>
              </div>
              <div className="pass-row">
                <span className="pass-label">Educator</span>
                <span className="pass-val">{confirmedBooking.teacherName} ({confirmedBooking.subject})</span>
              </div>
              <div className="pass-row">
                <span className="pass-label">Parent & Student</span>
                <span className="pass-val">{confirmedBooking.parentName} (for {confirmedBooking.studentName})</span>
              </div>
              <div className="pass-row">
                <span className="pass-label">Reserved Time</span>
                <span className="pass-val text-emerald">{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
              </div>
              <div className="pass-row">
                <span className="pass-label">Campus Location</span>
                <span className="pass-val">{confirmedBooking.country} Campus Consultation Suite</span>
              </div>
              <div className="pass-row">
                <span className="pass-label">Authentication</span>
                <span className="pass-val">✅ Verified via SMS / OTP ({confirmedBooking.phone})</span>
              </div>
            </div>

            <div className="modal-btn-row" style={{ marginTop: 24 }}>
              <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
                Done & Return to Campus Portal
              </button>
            </div>
          </div>
        )}
      </animated.div>

      <style>{`
        .ptm-modal {
          max-width: 620px;
          padding: 32px;
          position: relative;
        }

        .ptm-close-btn {
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

        .ptm-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .ptm-header {
          margin-bottom: 24px;
        }

        .ptm-title {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }

        .ptm-subtitle {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .ptm-stepper {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          overflow-x: auto;
        }

        .step-pill {
          font-size: 0.76rem;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
        }

        .step-pill.active {
          color: #34d399;
        }

        .step-arrow {
          color: #475569;
        }

        .teacher-info-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          margin-top: 10px;
        }

        .teacher-avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .teacher-details h4 {
          font-size: 1.05rem;
          color: #ffffff;
        }

        .subject-line {
          font-size: 0.85rem;
          color: #10b981;
          font-weight: 500;
        }

        .campus-line {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 10px;
        }

        .slot-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .slot-chip:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .slot-chip.selected {
          background: rgba(245, 158, 11, 0.15);
          border-color: #f59e0b;
          color: #fbbf24;
        }

        .phone-input-row {
          display: flex;
          gap: 10px;
        }

        .phone-code-select {
          width: 170px;
          flex-shrink: 0;
        }

        .phone-number-input {
          flex: 1;
        }

        .form-hint {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 4px;
        }

        .modal-btn-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .simulated-sms-box {
          padding: 16px;
          border-radius: 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          margin-bottom: 24px;
        }

        .sms-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .sms-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #60a5fa;
          letter-spacing: 0.06em;
        }

        .sms-timestamp {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .sms-body {
          font-size: 0.9rem;
          color: #e2e8f0;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .sms-otp-highlight {
          color: #fbbf24;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
        }

        .sms-auto-fill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #38bdf8;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(56, 189, 248, 0.1);
        }

        .otp-form {
          text-align: center;
        }

        .otp-code-input {
          width: 240px;
          margin: 16px auto;
          text-align: center;
          letter-spacing: 0.5em;
          font-size: 2rem;
          font-weight: 800;
          padding: 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          font-family: var(--font-heading);
        }

        .otp-code-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }

        .form-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          font-size: 0.85rem;
          margin-top: 12px;
        }

        .ptm-confirmed-view {
          text-align: center;
        }

        .confirmed-icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirmed-title {
          font-size: 1.5rem;
          margin-bottom: 6px;
        }

        .confirmed-subtitle {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        .booking-pass-card {
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pass-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          padding-bottom: 8px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
        }

        .pass-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .pass-label {
          color: #94a3b8;
        }

        .pass-val {
          font-weight: 600;
          color: #f8fafc;
        }
      `}</style>
    </div>
  );
}

// client/src/components/StudentTeacherDirectory.jsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  Fingerprint,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles
} from 'lucide-react';
import { fetchStudents, fetchTeachers } from '../api';

const NATIONALITIES_LIST = [
  'All Nationalities',
  'Emirati', 'Saudi', 'Bahraini', 'Kuwaiti', 'Qatari', 'Omani',
  'British', 'American', 'Canadian', 'Australian',
  'Indian', 'Pakistani', 'Egyptian', 'Jordanian', 'Lebanese',
  'French', 'German'
];

export default function StudentTeacherDirectory({ selectedCountry }) {
  const [viewType, setViewType] = useState('students'); // 'students' or 'teachers'
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('All Nationalities');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (viewType === 'students') {
      loadStudents();
    } else {
      loadTeachers();
    }
  }, [viewType, page, searchQuery, gradeFilter, nationalityFilter, statusFilter, selectedCountry]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search: searchQuery,
        grade: gradeFilter,
        nationality: nationalityFilter === 'All Nationalities' ? '' : nationalityFilter,
        status: statusFilter,
        country: selectedCountry === 'ALL' ? '' : selectedCountry
      };
      const res = await fetchStudents(params);
      if (res && res.data) {
        setStudents(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalStudents(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,
        country: selectedCountry === 'ALL' ? '' : selectedCountry
      };
      const res = await fetchTeachers(params);
      if (res && res.data) {
        setTeachers(res.data);
      }
    } catch (err) {
      console.error('Failed to load teachers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="directory-section">
      <div className="container">
        {/* Header */}
        <div className="directory-header">
          <div className="badge badge-emerald" style={{ marginBottom: 10 }}>
            <Sparkles size={14} />
            <span>Unified GCC Directory System</span>
          </div>
          <h2 className="directory-title">
            1,000s of <span className="text-emerald">Students & Faculty</span>
          </h2>
          <p className="directory-desc">
            Explore live biometric attendance, nationalities, and academic cohorts across Dubai, Riyadh, Manama, and Kuwait City.
          </p>

          {/* Toggle Students vs Teachers */}
          <div className="view-toggle-bar">
            <button
              className={`toggle-btn ${viewType === 'students' ? 'active' : ''}`}
              onClick={() => {
                setViewType('students');
                setPage(1);
              }}
            >
              <GraduationCap size={18} />
              <span>Students Directory ({totalStudents ? totalStudents.toLocaleString() : '1,200+'})</span>
            </button>
            <button
              className={`toggle-btn ${viewType === 'teachers' ? 'active' : ''}`}
              onClick={() => {
                setViewType('teachers');
                setPage(1);
              }}
            >
              <Briefcase size={18} />
              <span>Faculty & Leadership (120)</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-controls-card glass-panel">
          <div className="search-bar-wrap">
            <Search size={18} className="search-ico" />
            <input
              type="text"
              placeholder={viewType === 'students' ? 'Search by student name, ID, or parent...' : 'Search faculty name or subject...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="form-input search-input"
            />
          </div>

          {viewType === 'students' && (
            <div className="filters-row">
              {/* Nationality Filter */}
              <select
                className="form-select filter-select"
                value={nationalityFilter}
                onChange={(e) => {
                  setNationalityFilter(e.target.value);
                  setPage(1);
                }}
              >
                {NATIONALITIES_LIST.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>

              {/* Grade Filter */}
              <select
                className="form-select filter-select"
                value={gradeFilter}
                onChange={(e) => {
                  setGradeFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Grades</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Kindergarten 1">Kindergarten 1</option>
              </select>

              {/* Biometric Status */}
              <select
                className="form-select filter-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Attendance States</option>
                <option value="Inside Campus">Checked In (Inside Campus)</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Not Present">Not Present Yet</option>
              </select>
            </div>
          )}
        </div>

        {/* Table / Cards */}
        {loading ? (
          <div className="loading-box">Querying GCC Database...</div>
        ) : viewType === 'students' ? (
          <div className="table-responsive glass-panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>ID & Biometric Thumb</th>
                  <th>Grade & Section</th>
                  <th>Nationality</th>
                  <th>GCC Campus</th>
                  <th>Attendance State</th>
                  <th>Time-In / Out</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <div className="person-col">
                        <div className="avatar-tag">{(st.name || '?').charAt(0)}</div>
                        <div className="name-box">
                          <span className="p-name">{st.name}</span>
                          <span className="p-parent">Parent: {st.parentName}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="id-col">
                        <span className="id-badge">{st.id}</span>
                        <span className="thumb-id">
                          <Fingerprint size={12} /> {st.thumbprintId}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="grade-badge">{st.grade} ({st.section})</span>
                    </td>
                    <td>
                      <span className="nat-badge">
                        <Globe size={13} /> {st.nationality}
                      </span>
                    </td>
                    <td>
                      <span className="campus-badge">📍 {st.campus}</span>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          (st.attendanceStatus || '').includes('Inside')
                            ? 'status-in'
                            : (st.attendanceStatus || '').includes('Checked Out')
                            ? 'status-out'
                            : 'status-absent'
                        }`}
                      >
                        {st.attendanceStatus}
                      </span>
                    </td>
                    <td>
                      <div className="timestamps-col">
                        <span>In: <strong>{st.timeIn || '—'}</strong></span>
                        <span>Out: <strong>{st.timeOut || '—'}</strong></span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Teachers Cards Grid */
          <div className="teachers-grid">
            {teachers.map((tch) => (
              <div key={tch.id} className="teacher-card glass-panel">
                <div className="teacher-top">
                  <div className="tch-avatar">{(tch.name || '?').charAt(0)}</div>
                  <div className="tch-title-box">
                    <h4 className="tch-name">{tch.name}</h4>
                    <span className="tch-subj">{tch.subject}</span>
                  </div>
                </div>

                <div className="tch-meta">
                  <div className="tch-meta-line">
                    <MapPin size={14} />
                    <span>{tch.campus} ({tch.country})</span>
                  </div>
                  <div className="tch-meta-line">
                    <Globe size={14} />
                    <span>Nationality: {tch.nationality}</span>
                  </div>
                  <div className="tch-meta-line">
                    <Fingerprint size={14} />
                    <span>Thumbprint: {tch.thumbprintId}</span>
                  </div>
                </div>

                <div className="tch-slots">
                  <span className="slots-label">Available PTM Slots:</span>
                  <div className="slots-pills">
                    {tch.availableSlots?.slice(0, 2).map((s) => (
                      <span key={s} className="mini-slot-pill">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar for Students */}
        {viewType === 'students' && totalPages > 1 && (
          <div className="pagination-bar">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="page-indicator">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalStudents.toLocaleString()} Students)
            </span>
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .directory-section {
          padding: 60px 0;
        }

        .directory-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 36px;
        }

        .directory-title {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          margin-bottom: 8px;
        }

        .directory-desc {
          color: #94a3b8;
          font-size: 1.05rem;
          margin-bottom: 24px;
        }

        .view-toggle-bar {
          display: inline-flex;
          background: rgba(255, 255, 255, 0.04);
          padding: 4px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #94a3b8;
          transition: all 0.2s ease;
        }

        .toggle-btn.active {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }

        .filter-controls-card {
          padding: 20px;
          border-radius: 20px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .search-bar-wrap {
          position: relative;
        }

        .search-ico {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-input {
          padding-left: 44px;
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-select {
          flex: 1;
          min-width: 200px;
        }

        .table-responsive {
          border-radius: 20px;
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          font-size: 0.78rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.88rem;
        }

        .person-col {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-tag {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .name-box {
          display: flex;
          flex-direction: column;
        }

        .p-name {
          font-weight: 700;
          color: #ffffff;
        }

        .p-parent {
          font-size: 0.75rem;
          color: #64748b;
        }

        .id-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .id-badge {
          font-family: monospace;
          font-size: 0.82rem;
          color: #38bdf8;
        }

        .thumb-id {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: #10b981;
        }

        .grade-badge {
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          font-size: 0.82rem;
          color: #e2e8f0;
        }

        .nat-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #cbd5e1;
        }

        .campus-badge {
          font-size: 0.82rem;
          color: #94a3b8;
        }

        .status-pill {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 700;
        }

        .status-in {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-out {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .status-absent {
          background: rgba(148, 163, 184, 0.12);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .timestamps-col {
          display: flex;
          flex-direction: column;
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .timestamps-col strong {
          color: #f1f5f9;
        }

        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .teacher-card {
          padding: 22px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .teacher-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .tch-avatar {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #10b981 0%, #047857 100%);
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tch-name {
          font-size: 1.1rem;
          color: #ffffff;
        }

        .tch-subj {
          font-size: 0.82rem;
          color: #34d399;
          font-weight: 500;
        }

        .tch-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.84rem;
          color: #94a3b8;
        }

        .tch-meta-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tch-slots {
          padding-top: 12px;
          border-top: 1px dashed rgba(255, 255, 255, 0.08);
        }

        .slots-label {
          font-size: 0.74rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .slots-pills {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }

        .mini-slot-pill {
          font-size: 0.76rem;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          color: #cbd5e1;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          padding: 16px 20px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
        }

        .page-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .page-btn:hover:not(:disabled) {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-indicator {
          font-size: 0.86rem;
          color: #94a3b8;
        }
      `}</style>
    </section>
  );
}

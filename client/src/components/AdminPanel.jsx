// client/src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  GraduationCap,
  Utensils,
  Fingerprint,
  CalendarCheck,
  Newspaper,
  UserPlus,
  Trash2,
  Edit3,
  Send,
  CheckCircle2,
  Activity,
  Layers,
  Save,
  Clock,
  Sparkles,
  MapPin,
  Users,
  Search,
  Filter,
  LogOut,
  Bell,
  Cpu,
  Lock,
  X,
  Phone,
  Mail,
  BookOpen
} from 'lucide-react';
import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  fetchMenu,
  updateMenu,
  broadcastMealUpdate,
  fetchMealHistory,
  fetchNews,
  createNews,
  deleteNews,
  fetchBiometricLogs,
  fetchPtmBookings,
  fetchAdminUsers,
  createAdminUser
} from '../api';

export default function AdminPanel({ currentUser, onLogout, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('teachers'); // 'teachers', 'meals', 'news', 'biometrics', 'ptm', 'superadmin'

  // Teacher Management State
  const [teachersList, setTeachersList] = useState([]);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState('ALL');
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    gender: 'Female',
    subject: 'Mathematics',
    grade: 'Grade 9 - 12',
    campus: 'Dubai Academic City Campus (UAE)',
    country: 'United Arab Emirates',
    nationality: 'Emirati',
    phone: '+971 501234567',
    email: ''
  });
  const [teacherMsg, setTeacherMsg] = useState('');
  const [teacherLoading, setTeacherLoading] = useState(false);

  // Meal Broadcast & Menu State
  const [menuDays, setMenuDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [currentEditMenu, setCurrentEditMenu] = useState(null);
  const [mealHistory, setMealHistory] = useState([]);
  const [broadcastTarget, setBroadcastTarget] = useState('ALL Campuses');
  const [customDietaryNotice, setCustomDietaryNotice] = useState('All ingredients are 100% Halal certified and prepared fresh in campus facilities.');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [mealMsg, setMealMsg] = useState('');

  // News State
  const [newsList, setNewsList] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('STEM & Innovation');
  const [newsCampus, setNewsCampus] = useState('All GCC Campuses');
  const [newsContent, setNewsContent] = useState('');
  const [newsCover, setNewsCover] = useState('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80');
  const [newsMsg, setNewsMsg] = useState('');

  // Biometrics & PTM State
  const [bioLogs, setBioLogs] = useState([]);
  const [ptmBookings, setPtmBookings] = useState([]);

  // Superadmin State
  const [adminUsers, setAdminUsers] = useState([]);
  const [newAdminForm, setNewAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    fullName: '',
    badge: 'ADM-CAMPUS-2026'
  });
  const [superAdminMsg, setSuperAdminMsg] = useState('');

  useEffect(() => {
    loadTeachers();
    loadMenuAndBroadcasts();
    loadNewsData();
    loadBioData();
    loadPtmData();
    if (currentUser?.role === 'superadmin') {
      loadAdminUsers();
    }
  }, [currentUser]);

  const token = localStorage.getItem('gcc_admin_token');

  // --- TEACHERS ---
  const loadTeachers = async () => {
    try {
      setTeacherLoading(true);
      const res = await fetchTeachers({ search: teacherSearch, subject: teacherSubjectFilter });
      if (res?.data) setTeachersList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setTeacherLoading(false);
    }
  };

  const handleSaveTeacher = async (e) => {
    e?.preventDefault();
    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, teacherFormData, token);
        setTeacherMsg(`Teacher ${teacherFormData.name} updated successfully.`);
      } else {
        await createTeacher(teacherFormData, token);
        setTeacherMsg(`New faculty member ${teacherFormData.name} registered.`);
      }
      setTeacherModalOpen(false);
      setEditingTeacher(null);
      loadTeachers();
      setTimeout(() => setTeacherMsg(''), 4000);
    } catch (err) {
      setTeacherMsg('Error saving teacher: ' + err.message);
    }
  };

  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the faculty registry?`)) return;
    try {
      await deleteTeacher(id, token);
      setTeacherMsg(`Teacher ${name} removed.`);
      loadTeachers();
      setTimeout(() => setTeacherMsg(''), 4000);
    } catch (err) {
      setTeacherMsg('Error deleting: ' + err.message);
    }
  };

  const openAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherFormData({
      name: '',
      gender: 'Female',
      subject: 'Mathematics',
      grade: 'Grade 9 - 12',
      campus: 'Dubai Academic City Campus (UAE)',
      country: 'United Arab Emirates',
      nationality: 'Emirati',
      phone: '+971 501234567',
      email: ''
    });
    setTeacherModalOpen(true);
  };

  const openEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherFormData({
      name: teacher.name,
      gender: teacher.gender || 'Female',
      subject: teacher.subject,
      grade: teacher.grade || 'High School',
      campus: teacher.campus,
      country: teacher.country,
      nationality: teacher.nationality || 'Emirati',
      phone: teacher.phone || '',
      email: teacher.email || ''
    });
    setTeacherModalOpen(true);
  };

  // --- MEALS & BROADCASTS ---
  const loadMenuAndBroadcasts = async () => {
    try {
      const res = await fetchMenu();
      if (res?.days) {
        setMenuDays(res.days);
        const cur = res.days.find((d) => d.day.toLowerCase() === selectedDay.toLowerCase()) || res.days[0];
        setCurrentEditMenu(JSON.parse(JSON.stringify(cur)));
      }
      const hRes = await fetchMealHistory(token);
      if (hRes?.history) setMealHistory(hRes.history);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDaySelect = (dayName) => {
    setSelectedDay(dayName);
    const cur = menuDays.find((d) => d.day.toLowerCase() === dayName.toLowerCase());
    if (cur) setCurrentEditMenu(JSON.parse(JSON.stringify(cur)));
  };

  const handleSaveMenu = async () => {
    if (!currentEditMenu) return;
    try {
      await updateMenu(currentEditMenu.day, currentEditMenu, token);
      setMealMsg(`Weekly menu for ${currentEditMenu.day} updated in Supabase.`);
      loadMenuAndBroadcasts();
      setTimeout(() => setMealMsg(''), 4000);
    } catch (err) {
      setMealMsg('Failed to update menu: ' + err.message);
    }
  };

  const handleBroadcastMealToParents = async () => {
    if (!currentEditMenu) return;
    setBroadcastLoading(true);
    setMealMsg('');
    try {
      const res = await broadcastMealUpdate({
        day: currentEditMenu.day,
        theme: currentEditMenu.theme,
        targetCampus: broadcastTarget,
        customNotice: customDietaryNotice,
        mealsSummary: {
          breakfast: currentEditMenu.breakfast?.main || 'Nutrition Breakfast',
          lunch: currentEditMenu.lunch?.main || 'Balanced Lunch',
          nutrition: `Calories: ${currentEditMenu.lunch?.calories || '650 kcal'} | 100% Halal`
        }
      }, token);

      setMealMsg(`🚀 ${res.message}`);
      loadMenuAndBroadcasts();
      setTimeout(() => setMealMsg(''), 6000);
    } catch (err) {
      setMealMsg('Broadcast failed: ' + err.message);
    } finally {
      setBroadcastLoading(false);
    }
  };

  // --- NEWS ---
  const loadNewsData = async () => {
    try {
      const res = await fetchNews();
      if (res?.data) setNewsList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishNews = async (e) => {
    e?.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;
    try {
      await createNews({
        title: newsTitle,
        category: newsCategory,
        campus: newsCampus,
        content: newsContent,
        coverImage: newsCover,
        featured: true
      }, token);
      setNewsMsg('Official announcement broadcasted.');
      setNewsTitle('');
      setNewsContent('');
      loadNewsData();
      setTimeout(() => setNewsMsg(''), 4000);
    } catch (err) {
      setNewsMsg('Failed: ' + err.message);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await deleteNews(id, token);
      loadNewsData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- BIOMETRICS & PTM ---
  const loadBioData = async () => {
    try {
      const res = await fetchBiometricLogs();
      if (res?.data) setBioLogs(res.data);
    } catch (e) {}
  };

  const loadPtmData = async () => {
    try {
      const res = await fetchPtmBookings();
      if (res?.data) setPtmBookings(res.data);
    } catch (e) {}
  };

  // --- SUPERADMIN ---
  const loadAdminUsers = async () => {
    try {
      const res = await fetchAdminUsers(token);
      if (res?.users) setAdminUsers(res.users);
    } catch (e) {}
  };

  const handleCreateAdmin = async (e) => {
    e?.preventDefault();
    try {
      await createAdminUser(newAdminForm, token);
      setSuperAdminMsg(`Admin account "${newAdminForm.username}" successfully provisioned.`);
      setNewAdminForm({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        fullName: '',
        badge: 'ADM-CAMPUS-2026'
      });
      loadAdminUsers();
      setTimeout(() => setSuperAdminMsg(''), 4000);
    } catch (err) {
      setSuperAdminMsg('Error: ' + err.message);
    }
  };

  const isSuperadmin = currentUser?.role === 'superadmin';

  return (
    <div className="admin-dashboard-root">
      {/* Top Admin Bar */}
      <div className="admin-topbar glass-panel">
        <div className="admin-brand-info">
          <div className="brand-badge-box">
            <ShieldAlert size={22} className={isSuperadmin ? 'text-gold' : 'text-emerald'} />
          </div>
          <div>
            <div className="admin-title-row">
              <span className="admin-portal-label">GCC Executive Directorate Console</span>
              <span className={`role-badge ${isSuperadmin ? 'role-superadmin' : 'role-admin'}`}>
                {isSuperadmin ? '👑 SUPERADMIN (REGIONAL)' : '🎓 CAMPUS ADMIN'}
              </span>
            </div>
            <div className="admin-meta-sub">
              <span>User: <strong>{currentUser?.fullName || currentUser?.username}</strong></span>
              <span className="dot-divider">•</span>
              <span>AES-256-GCM Active</span>
              <span className="dot-divider">•</span>
              <span className="live-pill">Live Supabase Cloud</span>
            </div>
          </div>
        </div>

        <div className="admin-top-actions">
          <button className="btn-admin-logout" onClick={onLogout} title="Sign Out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => { setActiveTab('teachers'); loadTeachers(); }}
        >
          <GraduationCap size={18} />
          <span>Faculty & Teachers</span>
          <span className="tab-count">{teachersList.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => { setActiveTab('meals'); loadMenuAndBroadcasts(); }}
        >
          <Utensils size={18} />
          <span>Student Meals & Parent Updates</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'biometrics' ? 'active' : ''}`}
          onClick={() => { setActiveTab('biometrics'); loadBioData(); }}
        >
          <Fingerprint size={18} />
          <span>Biometric Logs</span>
          <span className="tab-count">{bioLogs.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => { setActiveTab('news'); loadNewsData(); }}
        >
          <Newspaper size={18} />
          <span>Campus News</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'ptm' ? 'active' : ''}`}
          onClick={() => { setActiveTab('ptm'); loadPtmData(); }}
        >
          <CalendarCheck size={18} />
          <span>Parent Consultations (PTM)</span>
        </button>

        {isSuperadmin && (
          <button
            className={`tab-btn superadmin-tab ${activeTab === 'superadmin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('superadmin'); loadAdminUsers(); }}
          >
            <Lock size={18} />
            <span>Superadmin Access Control</span>
          </button>
        )}
      </div>

      {/* Main Admin Tab Content */}
      <div className="admin-body">
        {/* ======================================= */}
        {/* TAB 1: TEACHER MANAGEMENT (ADMIN MANAGED) */}
        {/* ======================================= */}
        {activeTab === 'teachers' && (
          <div className="admin-section">
            <div className="section-header-row">
              <div>
                <h2>Faculty Registry & Teacher Management</h2>
                <p>Manage, onboard, and assign biometric credentials to GCC international educators.</p>
              </div>
              <button className="btn-add-primary" onClick={openAddTeacher}>
                <UserPlus size={18} />
                <span>Onboard New Teacher</span>
              </button>
            </div>

            {teacherMsg && (
              <div className="alert-banner-success">
                <CheckCircle2 size={18} />
                <span>{teacherMsg}</span>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="table-filter-bar glass-panel">
              <div className="search-input-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search faculty by name, ID, or subject..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadTeachers()}
                />
              </div>

              <div className="filter-select-box">
                <Filter size={16} />
                <select
                  value={teacherSubjectFilter}
                  onChange={(e) => {
                    setTeacherSubjectFilter(e.target.value);
                  }}
                >
                  <option value="ALL">All Disciplines</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics & Robotics">Physics & Robotics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Arabic & Islamic Studies">Arabic & Islamic Studies</option>
                  <option value="Computer Science & AI">Computer Science & AI</option>
                </select>
                <button className="btn-filter-apply" onClick={loadTeachers}>Filter</button>
              </div>
            </div>

            {/* Teachers Table */}
            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Subject & Grade</th>
                    <th>Campus & Country</th>
                    <th>Biometric Thumb ID</th>
                    <th>Contact Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachersList.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="teacher-cell-name">
                          <span className="t-name">{t.name}</span>
                          <span className="t-id">{t.id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="teacher-cell-subject">
                          <span className="subject-pill">{t.subject}</span>
                          <span className="grade-sub">{t.grade || 'All Grades'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="campus-cell">
                          <span>{t.campus}</span>
                          <span className="country-sub">{t.country}</span>
                        </div>
                      </td>
                      <td>
                        <span className="thumb-id-pill">
                          <Fingerprint size={13} />
                          {t.thumbprint_id || t.thumbprintId || 'FP-AUTO'}
                        </span>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span><Phone size={12} /> {t.phone || 'N/A'}</span>
                          <span><Mail size={12} /> {t.email || `${t.id.toLowerCase()}@gccschools.edu`}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-action-icon edit"
                            onClick={() => openEditTeacher(t)}
                            title="Edit Teacher"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="btn-action-icon delete"
                            onClick={() => handleDeleteTeacher(t.id, t.name)}
                            title="Remove Teacher"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {teachersList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty-row">
                        No teachers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STUDENT MEALS & PARENT BROADCASTS (ADMIN MANAGED) */}
        {/* ======================================================== */}
        {activeTab === 'meals' && (
          <div className="admin-section">
            <div className="section-header-row">
              <div>
                <h2>Student Nutrition & Parent Meal Broadcast System</h2>
                <p>Plan weekly menus and dispatch instant dietary & nutritional updates to parents via SMS and Portal.</p>
              </div>
            </div>

            {mealMsg && (
              <div className="alert-banner-success">
                <CheckCircle2 size={18} />
                <span>{mealMsg}</span>
              </div>
            )}

            <div className="meals-grid-layout">
              {/* Left Column: Parent Broadcast Dispatcher */}
              <div className="broadcast-card glass-panel">
                <div className="broadcast-header">
                  <div className="icon-circle gold">
                    <Send size={20} />
                  </div>
                  <div>
                    <h3>Dispatch Meal Update to Parents</h3>
                    <p>Sends official SMS & App notification to parent contacts.</p>
                  </div>
                </div>

                <div className="broadcast-form">
                  <div className="form-group">
                    <label>Target Academic Campus</label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value)}
                      className="admin-input"
                    >
                      <option value="ALL Campuses">All GCC Campuses (1,240 Parents)</option>
                      <option value="Dubai Academic City Campus (UAE)">Dubai Campus (UAE - 310 Parents)</option>
                      <option value="Riyadh Diplomatic Quarter Campus (KSA)">Riyadh Campus (KSA - 320 Parents)</option>
                      <option value="Bahrain International Campus (Manama)">Manama Campus (Bahrain - 240 Parents)</option>
                      <option value="Kuwait City Campus">Kuwait Campus (Kuwait - 210 Parents)</option>
                      <option value="Doha Education City Campus (Qatar)">Doha Campus (Qatar - 160 Parents)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Selected Meal Day</label>
                    <div className="day-pill-selector">
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                          onClick={() => handleDaySelect(day)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentEditMenu && (
                    <div className="meal-preview-box">
                      <div className="preview-tag">Previewing {currentEditMenu.day} Menu</div>
                      <div className="preview-theme">Theme: <strong>{currentEditMenu.theme}</strong></div>
                      <div className="preview-items">
                        <div><strong>Breakfast:</strong> {currentEditMenu.breakfast?.main || 'Oats & Fruits'}</div>
                        <div><strong>Lunch:</strong> {currentEditMenu.lunch?.main || 'Chicken & Rice'}</div>
                        <div><strong>Nutrition:</strong> {currentEditMenu.lunch?.calories || '620 kcal'} • 100% Halal Certified</div>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Dietary Advisory / Custom Notice to Parents</label>
                    <textarea
                      rows="3"
                      className="admin-textarea"
                      value={customDietaryNotice}
                      onChange={(e) => setCustomDietaryNotice(e.target.value)}
                      placeholder="Special note regarding allergens, hydration, fresh organic ingredients..."
                    />
                  </div>

                  <button
                    className="btn-dispatch-broadcast"
                    onClick={handleBroadcastMealToParents}
                    disabled={broadcastLoading}
                  >
                    {broadcastLoading ? (
                      <span>Dispatching to Parent Mobile Phones...</span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Broadcast Meal Update to Parents</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Menu Day Editor & History */}
              <div className="menu-editor-column">
                {currentEditMenu && (
                  <div className="menu-editor-card glass-panel">
                    <div className="card-top-action">
                      <h3>Edit {currentEditMenu.day} Nutritional Data</h3>
                      <button className="btn-save-inline" onClick={handleSaveMenu}>
                        <Save size={15} /> Save Changes
                      </button>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Day Theme</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={currentEditMenu.theme}
                          onChange={(e) => setCurrentEditMenu({ ...currentEditMenu, theme: e.target.value })}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>Calories</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={currentEditMenu.lunch?.calories || ''}
                          onChange={(e) => setCurrentEditMenu({
                            ...currentEditMenu,
                            lunch: { ...currentEditMenu.lunch, calories: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Breakfast Dish</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={currentEditMenu.breakfast?.main || ''}
                        onChange={(e) => setCurrentEditMenu({
                          ...currentEditMenu,
                          breakfast: { ...currentEditMenu.breakfast, main: e.target.value }
                        })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Lunch Dish</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={currentEditMenu.lunch?.main || ''}
                        onChange={(e) => setCurrentEditMenu({
                          ...currentEditMenu,
                          lunch: { ...currentEditMenu.lunch, main: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}

                {/* Broadcast History Log */}
                <div className="history-card glass-panel">
                  <div className="history-title">
                    <Clock size={16} /> Recent Parent Meal Broadcasts
                  </div>
                  <div className="history-list">
                    {mealHistory.map((h, i) => (
                      <div key={h.id || i} className="history-item">
                        <div className="h-left">
                          <span className="h-day">{h.day} Meal Update</span>
                          <span className="h-campus">{h.target_campus || h.targetCampus}</span>
                        </div>
                        <div className="h-right">
                          <span className="h-recipients">{h.recipients_count || h.recipientsCount} Parents Notified</span>
                          <span className="h-status">{h.status || 'Delivered'}</span>
                        </div>
                      </div>
                    ))}
                    {mealHistory.length === 0 && (
                      <div className="history-empty">No recent broadcasts recorded. Broadcasts will appear here.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: BIOMETRIC LOGS                   */}
        {/* ======================================= */}
        {activeTab === 'biometrics' && (
          <div className="admin-section">
            <div className="section-header-row">
              <div>
                <h2>Live Biometric Attendance Portal Scans</h2>
                <p>Audited thumbprint scans from North & South gate terminals across GCC campuses.</p>
              </div>
            </div>

            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Person Name</th>
                    <th>Role</th>
                    <th>Details</th>
                    <th>Event</th>
                    <th>Timestamp</th>
                    <th>Terminal</th>
                    <th>Campus</th>
                  </tr>
                </thead>
                <tbody>
                  {bioLogs.map((log) => (
                    <tr key={log.id}>
                      <td><span className="t-id">{log.id}</span></td>
                      <td><strong>{log.name}</strong></td>
                      <td>
                        <span className={`role-pill ${log.role === 'Teacher' ? 'faculty' : 'student'}`}>
                          {log.role}
                        </span>
                      </td>
                      <td>{log.details}</td>
                      <td>
                        <span className={`event-pill ${log.eventType === 'TIME_IN' || log.event_type === 'TIME_IN' ? 'in' : 'out'}`}>
                          {log.eventType || log.event_type}
                        </span>
                      </td>
                      <td>{log.timestamp}</td>
                      <td>{log.terminal}</td>
                      <td>{log.campus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: CAMPUS NEWS                      */}
        {/* ======================================= */}
        {activeTab === 'news' && (
          <div className="admin-section">
            <div className="section-header-row">
              <div>
                <h2>Campus Announcements & News Publisher</h2>
                <p>Publish official academic notices, events, and STEM tournament victories.</p>
              </div>
            </div>

            {newsMsg && (
              <div className="alert-banner-success">
                <CheckCircle2 size={18} />
                <span>{newsMsg}</span>
              </div>
            )}

            <div className="news-admin-grid">
              {/* News Publisher Form */}
              <form onSubmit={handlePublishNews} className="news-form-card glass-panel">
                <h3>Draft Announcement</h3>
                <div className="form-group">
                  <label>Headline</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. GCC Robotics Championship 2026 Winners"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Category</label>
                    <select
                      className="admin-input"
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                    >
                      <option>STEM & Innovation</option>
                      <option>Academic Notice</option>
                      <option>Sports & Athletics</option>
                      <option>Cultural Arts</option>
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label>Campus</label>
                    <select
                      className="admin-input"
                      value={newsCampus}
                      onChange={(e) => setNewsCampus(e.target.value)}
                    >
                      <option>All GCC Campuses</option>
                      <option>Dubai Campus (UAE)</option>
                      <option>Riyadh Campus (KSA)</option>
                      <option>Manama Campus (Bahrain)</option>
                      <option>Kuwait City Campus</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    rows="4"
                    className="admin-textarea"
                    placeholder="Write announcement body..."
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-add-primary">
                  <Newspaper size={16} /> Broadcast Announcement
                </button>
              </form>

              {/* News List */}
              <div className="news-items-list glass-panel">
                <h3>Published News Articles ({newsList.length})</h3>
                <div className="news-scroll-list">
                  {newsList.map((n) => (
                    <div key={n.id} className="news-admin-item">
                      <div className="n-info">
                        <h4>{n.title}</h4>
                        <div className="n-meta">
                          <span>{n.category}</span> • <span>{n.campus}</span> • <span>{n.date}</span>
                        </div>
                      </div>
                      <button
                        className="btn-action-icon delete"
                        onClick={() => handleDeleteNews(n.id)}
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 5: PTM BOOKINGS                     */}
        {/* ======================================= */}
        {activeTab === 'ptm' && (
          <div className="admin-section">
            <div className="section-header-row">
              <div>
                <h2>Parent-Teacher Meeting (PTM) Consultations</h2>
                <p>Appointments booked by parents verified through encrypted SMS OTP.</p>
              </div>
            </div>

            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking Ref</th>
                    <th>Parent Name</th>
                    <th>Student Name</th>
                    <th>Faculty Member</th>
                    <th>Date & Slot</th>
                    <th>Phone (SMS Verified)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ptmBookings.map((b) => (
                    <tr key={b.booking_id || b.bookingId}>
                      <td><span className="t-id">{b.booking_id || b.bookingId}</span></td>
                      <td><strong>{b.parent_name || b.parentName}</strong></td>
                      <td>{b.student_name || b.studentName}</td>
                      <td>{b.teacher_name || b.teacherName}</td>
                      <td>{b.date} • {b.time_slot || b.timeSlot}</td>
                      <td>{b.phone}</td>
                      <td>
                        <span className="status-confirmed-pill">
                          <CheckCircle2 size={13} /> {b.status || 'Confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 6: SUPERADMIN ACCESS CONTROL        */}
        {/* ======================================= */}
        {activeTab === 'superadmin' && isSuperadmin && (
          <div className="admin-section">
            <div className="section-header-row">
              <div>
                <h2>Superadmin Central Governance & Access Control</h2>
                <p>Grant administrative clearance, manage roles, and review security audit logs.</p>
              </div>
            </div>

            {superAdminMsg && (
              <div className="alert-banner-success">
                <CheckCircle2 size={18} />
                <span>{superAdminMsg}</span>
              </div>
            )}

            <div className="superadmin-grid">
              {/* Provision Admin Form */}
              <form onSubmit={handleCreateAdmin} className="superadmin-card glass-panel">
                <h3>Provision Administrator Account</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={newAdminForm.fullName}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                    placeholder="e.g. Tariq Al-Hashimi"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Username</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newAdminForm.username}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                      placeholder="e.g. thashimi"
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Role</label>
                    <select
                      className="admin-input"
                      value={newAdminForm.role}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    >
                      <option value="admin">Campus Admin</option>
                      <option value="superadmin">Regional Superadmin</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="admin@gccschools.edu"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Temporary Password (Bcrypt Encrypted)</label>
                  <input
                    type="password"
                    className="admin-input"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    placeholder="Minimum 8 characters with symbols"
                    required
                  />
                </div>

                <button type="submit" className="btn-add-primary">
                  <Lock size={16} /> Create Administrator Account
                </button>
              </form>

              {/* Existing Admins List */}
              <div className="superadmin-users-card glass-panel">
                <h3>Authorized Administrators ({adminUsers.length})</h3>
                <div className="admin-users-table-box">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Administrator</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.full_name || u.username}</strong>
                            <div className="t-id">@{u.username}</div>
                          </td>
                          <td>
                            <span className={`role-badge ${u.role === 'superadmin' ? 'role-superadmin' : 'role-admin'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>{u.email}</td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Teacher Add / Edit Modal */}
      {teacherModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-card glass-panel">
            <div className="modal-header">
              <h3>{editingTeacher ? `Edit Faculty: ${editingTeacher.name}` : 'Onboard New Teacher'}</h3>
              <button className="btn-close-modal" onClick={() => setTeacherModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="modal-body-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={teacherFormData.name}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                    placeholder="e.g. Dr. Mariam Al-Qasimi"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Gender</label>
                  <select
                    className="admin-input"
                    value={teacherFormData.gender}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, gender: e.target.value })}
                  >
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Primary Discipline / Subject</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={teacherFormData.subject}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, subject: e.target.value })}
                    placeholder="e.g. Physics & Robotics"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Assigned Grade</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={teacherFormData.grade}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, grade: e.target.value })}
                    placeholder="e.g. Grade 10 - 12"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Campus</label>
                  <select
                    className="admin-input"
                    value={teacherFormData.campus}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, campus: e.target.value })}
                  >
                    <option>Dubai Academic City Campus (UAE)</option>
                    <option>Riyadh Diplomatic Quarter Campus (KSA)</option>
                    <option>Bahrain International Campus (Manama)</option>
                    <option>Kuwait City Campus</option>
                    <option>Doha Education City Campus (Qatar)</option>
                    <option>Muscat Knowledge Oasis Campus (Oman)</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Country</label>
                  <select
                    className="admin-input"
                    value={teacherFormData.country}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, country: e.target.value })}
                  >
                    <option>United Arab Emirates</option>
                    <option>Saudi Arabia</option>
                    <option>Bahrain</option>
                    <option>Kuwait</option>
                    <option>Qatar</option>
                    <option>Oman</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={teacherFormData.phone}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                    placeholder="+971 501234567"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Faculty Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={teacherFormData.email}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                    placeholder="faculty@gccschools.edu"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setTeacherModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-add-primary">
                  {editingTeacher ? 'Update Faculty Member' : 'Register Faculty & Assign Biometrics'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

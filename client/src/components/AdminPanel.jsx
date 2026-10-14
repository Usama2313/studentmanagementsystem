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
  BookOpen,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Globe,
  Database,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Sliders,
  Check,
  Eye,
  Camera,
  Crown
} from 'lucide-react';

import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchParents,
  createParent,
  updateParent,
  deleteParent,
  fetchStats,
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

const GCC_CAMPUSES = [
  'Dubai Academic City Campus (UAE)',
  'Riyadh Diplomatic Quarter Campus (KSA)',
  'Bahrain International Campus (Manama)',
  'Kuwait City Campus',
  'Doha Education City Campus (Qatar)',
  'Muscat Knowledge Oasis Campus (Oman)'
];

const GCC_COUNTRIES_LIST = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Bahrain',
  'Kuwait',
  'Qatar',
  'Oman'
];

const SAMPLE_PARENT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80'
];

export default function AdminPanel({ currentUser, onLogout, onRefreshData }) {
  // Navigation & Drawer
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'students', 'teachers', 'parents', 'meals', 'news', 'biometrics', 'ptm', 'roles', 'superadmin'
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [simulatedRole, setSimulatedRole] = useState(currentUser?.role || 'superadmin');

  // Stats
  const [stats, setStats] = useState({
    studentsCount: 1200,
    teachersCount: 28,
    parentsCount: 1200,
    campusesCount: 6,
    countriesCount: 6
  });

  // Students State
  const [studentsList, setStudentsList] = useState([]);
  const [studentsTotal, setStudentsTotal] = useState(1200);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentCountryFilter, setStudentCountryFilter] = useState('ALL');
  const [studentGradeFilter, setStudentGradeFilter] = useState('ALL');
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentMsg, setStudentMsg] = useState('');
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    gender: 'Male',
    grade: 'Grade 9',
    section: 'A',
    campus: GCC_CAMPUSES[0],
    country: GCC_COUNTRIES_LIST[0],
    nationality: 'Emirati',
    parentName: '',
    parentPhone: '+971 501234567',
    parentEmail: ''
  });

  // Teachers State
  const [teachersList, setTeachersList] = useState([]);
  const [teachersTotal, setTeachersTotal] = useState(28);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState('ALL');
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherTotalPages, setTeacherTotalPages] = useState(1);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    gender: 'Female',
    subject: 'Mathematics',
    grade: 'Grade 9 - 12',
    campus: GCC_CAMPUSES[0],
    country: GCC_COUNTRIES_LIST[0],
    nationality: 'Emirati',
    phone: '+971 501234567',
    email: ''
  });
  const [teacherMsg, setTeacherMsg] = useState('');
  const [teacherLoading, setTeacherLoading] = useState(false);

  // Parents State (with Pictures)
  const [parentsList, setParentsList] = useState([]);
  const [parentsTotal, setParentsTotal] = useState(1200);
  const [parentSearch, setParentSearch] = useState('');
  const [parentCountryFilter, setParentCountryFilter] = useState('ALL');
  const [parentPage, setParentPage] = useState(1);
  const [parentTotalPages, setParentTotalPages] = useState(1);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [parentMsg, setParentMsg] = useState('');
  const [parentLoading, setParentLoading] = useState(false);
  const [parentFormData, setParentFormData] = useState({
    name: '',
    relationship: 'Mother',
    studentName: '',
    studentGrade: 'Grade 9',
    phone: '+971 501234567',
    email: '',
    country: GCC_COUNTRIES_LIST[0],
    campus: GCC_CAMPUSES[0],
    avatar: SAMPLE_PARENT_AVATARS[0],
    preferredChannel: 'WhatsApp & SMS'
  });

  // Meals & Menu State
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

  const token = localStorage.getItem('gcc_admin_token');
  const isSuperadmin = simulatedRole === 'superadmin';

  // Initial Data Loading
  useEffect(() => {
    loadAllStats();
    loadTeachersData(1);
    loadStudentsData(1);
    loadParentsData(1);
    loadMenuAndBroadcasts();
    loadNewsData();
    loadBioData();
    loadPtmData();
    if (currentUser?.role === 'superadmin') {
      loadAdminUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    loadStudentsData(studentPage);
  }, [studentPage]);

  useEffect(() => {
    loadTeachersData(teacherPage);
  }, [teacherPage]);

  useEffect(() => {
    loadParentsData(parentPage);
  }, [parentPage]);

  const loadAllStats = async () => {
    try {
      const res = await fetchStats();
      if (res) {
        setStats(res);
        if (res.studentsCount) setStudentsTotal(res.studentsCount);
        if (res.teachersCount) setTeachersTotal(res.teachersCount);
        if (res.parentsCount) setParentsTotal(res.parentsCount);
      }
    } catch (e) {
      console.warn('Stats fallback active');
    }
  };

  // --- STUDENTS ---
  const loadStudentsData = async (targetPage = studentPage) => {
    try {
      setStudentLoading(true);
      const res = await fetchStudents({
        page: targetPage,
        limit: 15,
        search: studentSearch,
        country: studentCountryFilter,
        grade: studentGradeFilter
      });
      if (res?.data) {
        setStudentsList(res.data);
        if (res.total !== undefined) {
          setStudentsTotal(res.total);
          setStudentTotalPages(res.totalPages || Math.ceil(res.total / 15) || 1);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStudentLoading(false);
    }
  };

  const handleEnrollStudent = async (e) => {
    e?.preventDefault();
    try {
      await createStudent(studentFormData, token);
      setStudentMsg(`Student ${studentFormData.name} enrolled with Biometric Thumbprint ID!`);
      setStudentModalOpen(false);
      loadStudentsData();
      loadAllStats();
      loadParentsData();
      setTimeout(() => setStudentMsg(''), 5000);
    } catch (err) {
      setStudentMsg('Error enrolling student: ' + err.message);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove student ${name} (${id})?`)) return;
    try {
      await deleteStudent(id, token);
      setStudentMsg(`Student ${name} archived from records.`);
      loadStudentsData();
      loadAllStats();
      setTimeout(() => setStudentMsg(''), 4000);
    } catch (err) {
      setStudentMsg('Error removing student: ' + err.message);
    }
  };

  // --- TEACHERS ---
  const loadTeachersData = async (targetPage = teacherPage) => {
    try {
      setTeacherLoading(true);
      const res = await fetchTeachers({ search: teacherSearch, subject: teacherSubjectFilter });
      if (res?.data) {
        const all = res.data;
        const total = res.total || all.length;
        setTeachersTotal(total);
        const limit = 12;
        const totalP = Math.ceil(total / limit) || 1;
        setTeacherTotalPages(totalP);
        const start = (targetPage - 1) * limit;
        setTeachersList(all.slice(start, start + limit));
      }
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
      loadTeachersData(teacherPage);
      loadAllStats();
      setTimeout(() => setTeacherMsg(''), 4000);
    } catch (err) {
      setTeacherMsg('Error saving teacher: ' + err.message);
    }
  };

  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from faculty registry?`)) return;
    try {
      await deleteTeacher(id, token);
      setTeacherMsg(`Teacher ${name} removed.`);
      loadTeachersData(teacherPage);
      loadAllStats();
      setTimeout(() => setTeacherMsg(''), 4000);
    } catch (err) {
      setTeacherMsg('Error removing teacher: ' + err.message);
    }
  };

  // --- PARENTS (WITH PICTURES) ---
  const loadParentsData = async (targetPage = parentPage) => {
    try {
      setParentLoading(true);
      const res = await fetchParents({
        search: parentSearch,
        country: parentCountryFilter,
        page: targetPage,
        limit: 15
      });
      if (res?.data) {
        setParentsList(res.data);
        if (res.total !== undefined) {
          setParentsTotal(res.total);
          setParentTotalPages(res.totalPages || Math.ceil(res.total / 15) || 1);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setParentLoading(false);
    }
  };

  const handleRegisterParent = async (e) => {
    e?.preventDefault();
    try {
      await createParent(parentFormData, token);
      setParentMsg(`Parent ${parentFormData.name} registered with photo profile!`);
      setParentModalOpen(false);
      loadParentsData();
      loadAllStats();
      setTimeout(() => setParentMsg(''), 5000);
    } catch (err) {
      setParentMsg('Error registering parent: ' + err.message);
    }
  };

  const handleDeleteParent = async (id, name) => {
    if (!window.confirm(`Remove parent ${name} from school contact registry?`)) return;
    try {
      await deleteParent(id, token);
      setParentMsg(`Parent ${name} removed.`);
      loadParentsData();
      loadAllStats();
      setTimeout(() => setParentMsg(''), 4000);
    } catch (err) {
      setParentMsg('Error: ' + err.message);
    }
  };

  // --- MEALS & BROADCASTS ---
  const loadMenuAndBroadcasts = async () => {
    try {
      const menuRes = await fetchMenu();
      if (menuRes?.days) {
        setMenuDays(menuRes.days);
        const cur = menuRes.days.find(d => d.day.toLowerCase() === selectedDay.toLowerCase()) || menuRes.days[0];
        setCurrentEditMenu(cur);
      }
      const historyRes = await fetchMealHistory(token);
      if (historyRes?.history) setMealHistory(historyRes.history);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendBroadcast = async () => {
    if (!currentEditMenu) return;
    setBroadcastLoading(true);
    setMealMsg('');
    try {
      const res = await broadcastMealUpdate({
        day: currentEditMenu.day,
        theme: currentEditMenu.theme,
        targetCampus: broadcastTarget,
        customNote: customDietaryNotice,
        menuSnapshot: currentEditMenu
      }, token);

      setMealMsg(`🚀 Broadcast sent! ${res.recipientsCount} Parents notified across ${broadcastTarget} via SMS & Portal.`);
      loadMenuAndBroadcasts();
      setTimeout(() => setMealMsg(''), 6000);
    } catch (err) {
      setMealMsg('Failed to broadcast: ' + err.message);
    } finally {
      setBroadcastLoading(false);
    }
  };

  // --- NEWS ---
  const loadNewsData = async () => {
    try {
      const res = await fetchNews();
      if (res?.articles) setNewsList(res.articles);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;
    try {
      await createNews({
        title: newsTitle,
        category: newsCategory,
        campus: newsCampus,
        content: newsContent,
        coverImage: newsCover
      }, token);
      setNewsMsg('Announcement published across GCC portals.');
      setNewsTitle('');
      setNewsContent('');
      loadNewsData();
      setTimeout(() => setNewsMsg(''), 4000);
    } catch (err) {
      setNewsMsg('Failed: ' + err.message);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Delete this article from campus boards?')) return;
    try {
      await deleteNews(id, token);
      loadNewsData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- BIOMETRICS & PTM ---
  const loadBioData = async () => {
    try {
      const res = await fetchBiometricLogs();
      if (res?.logs) setBioLogs(res.logs);
    } catch (e) {
      console.error(e);
    }
  };

  const loadPtmData = async () => {
    try {
      const res = await fetchPtmBookings();
      if (res?.bookings) setPtmBookings(res.bookings);
    } catch (e) {
      console.error(e);
    }
  };

  // --- ADMIN USERS (SUPERADMIN ONLY) ---
  const loadAdminUsers = async () => {
    try {
      const res = await fetchAdminUsers(token);
      if (res?.users) setAdminUsers(res.users);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
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

  return (
    <div className={`admin-portal-wrapper ${drawerOpen ? 'drawer-expanded' : 'drawer-collapsed'}`}>
      {/* ========================================================= */}
      {/* 🧭 SIDE DRAWER (ADMIN & SUPER ADMIN NAVIGATION)            */}
      {/* ========================================================= */}
      <aside className={`admin-side-drawer ${drawerOpen ? 'open' : 'collapsed'}`}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="brand-crest">
              <ShieldAlert size={20} className={isSuperadmin ? 'text-gold' : 'text-emerald'} />
            </div>
            {drawerOpen && (
              <div className="brand-titles">
                <span className="brand-title-main">GCC Directorate</span>
                <span className="brand-title-sub">International Schools</span>
              </div>
            )}
          </div>
          <button
            className="drawer-toggle-btn"
            onClick={() => setDrawerOpen(!drawerOpen)}
            title={drawerOpen ? 'Collapse Navigation' : 'Expand Navigation'}
          >
            {drawerOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Card & Role Switcher */}
        {drawerOpen && (
          <div className="drawer-user-card glass-panel">
            <div className="user-avatar-badge">
              <div className="avatar-img-circle">
                {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'A'}
              </div>
              <div className="user-meta">
                <span className="user-name">{currentUser?.fullName || currentUser?.username || 'Executive Admin'}</span>
                <span className={`user-role-chip ${isSuperadmin ? 'superadmin' : 'campus-admin'}`}>
                  {isSuperadmin ? '👑 Regional Super Admin' : '🛡️ Campus Administrator'}
                </span>
              </div>
            </div>

            {/* Role Simulation Switcher (Lets user experience difference) */}
            <div className="role-switch-container">
              <span className="role-switch-label">Clearance Mode:</span>
              <div className="role-switch-pills">
                <button
                  className={`pill-btn ${simulatedRole === 'superadmin' ? 'active gold' : ''}`}
                  onClick={() => setSimulatedRole('superadmin')}
                  title="Super Admin has multi-country sovereignty & master access"
                >
                  👑 Super Admin
                </button>
                <button
                  className={`pill-btn ${simulatedRole === 'admin' ? 'active emerald' : ''}`}
                  onClick={() => setSimulatedRole('admin')}
                  title="Campus Admin has single-branch operations access"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Navigation Links */}
        <nav className="drawer-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            title="Overview & Metrics"
          >
            <Activity size={18} />
            {drawerOpen && <span>Executive Overview</span>}
          </button>

          <button
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => { setActiveTab('students'); loadStudentsData(); }}
            title="Students Directory"
          >
            <GraduationCap size={18} />
            {drawerOpen && (
              <>
                <span>Students Directory</span>
                <span className="nav-badge emerald">{studentsTotal}</span>
              </>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('teachers'); loadTeachersData(); }}
            title="Faculty & Teachers"
          >
            <Users size={18} />
            {drawerOpen && (
              <>
                <span>Faculty & Teachers</span>
                <span className="nav-badge gold">{teachersTotal}</span>
              </>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'parents' ? 'active' : ''}`}
            onClick={() => { setActiveTab('parents'); loadParentsData(); }}
            title="Parents & Guardians (With Photos)"
          >
            <BookOpen size={18} />
            {drawerOpen && (
              <>
                <span>Parents & Guardians</span>
                <span className="nav-badge cyan">{parentsTotal}</span>
              </>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'meals' ? 'active' : ''}`}
            onClick={() => { setActiveTab('meals'); loadMenuAndBroadcasts(); }}
            title="Meal Broadcasts"
          >
            <Utensils size={18} />
            {drawerOpen && <span>Meal Broadcasts</span>}
          </button>

          <button
            className={`nav-item ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => { setActiveTab('news'); loadNewsData(); }}
            title="Campus News"
          >
            <Newspaper size={18} />
            {drawerOpen && <span>Campus News</span>}
          </button>

          <button
            className={`nav-item ${activeTab === 'biometrics' ? 'active' : ''}`}
            onClick={() => { setActiveTab('biometrics'); loadBioData(); }}
            title="Biometric Gate Logs"
          >
            <Fingerprint size={18} />
            {drawerOpen && (
              <>
                <span>Biometric Gate</span>
                <span className="nav-badge purple">{bioLogs.length}</span>
              </>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'ptm' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ptm'); loadPtmData(); }}
            title="Parent Consultations"
          >
            <CalendarCheck size={18} />
            {drawerOpen && (
              <>
                <span>PTM Consultations</span>
                <span className="nav-badge blue">{ptmBookings.length}</span>
              </>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
            title="Admin vs Super Admin Role Matrix"
          >
            <ShieldCheck size={18} />
            {drawerOpen && <span>Roles & Permissions</span>}
          </button>

          {isSuperadmin && (
            <button
              className={`nav-item superadmin-highlight ${activeTab === 'superadmin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('superadmin'); loadAdminUsers(); }}
              title="Superadmin Governance"
            >
              <Lock size={18} />
              {drawerOpen && <span>Superadmin Security</span>}
            </button>
          )}
        </nav>

        {/* Drawer Bottom Actions */}
        <div className="drawer-footer">
          <button className="btn-drawer-logout" onClick={onLogout} title="Sign Out">
            <LogOut size={16} />
            {drawerOpen && <span>Sign Out Portal</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 🚀 MAIN ADMIN PORTAL CONTENT AREA                         */}
      {/* ========================================================= */}
      <main className="admin-main-container">
        {/* Top Header Bar */}
        <header className="admin-top-bar glass-panel">
          <div className="top-bar-left">
            <button
              className="drawer-mobile-btn"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="title-row-flex">
                <h1 className="portal-main-heading">
                  {activeTab === 'overview' && 'Executive Directorate Command Center'}
                  {activeTab === 'students' && 'Students Academic & Biometric Directory'}
                  {activeTab === 'teachers' && 'Faculty Registry & Teacher Management'}
                  {activeTab === 'parents' && 'Parents & Legal Guardians Registry'}
                  {activeTab === 'meals' && 'Student Nutrition & Parent Meal Broadcasts'}
                  {activeTab === 'news' && 'GCC Campus Announcements & Bulletins'}
                  {activeTab === 'biometrics' && 'Live Biometric Gate & Attendance Logs'}
                  {activeTab === 'ptm' && 'Parent-Teacher Conference (PTM) Reservations'}
                  {activeTab === 'roles' && 'Access Control: Admin vs. Super Admin Roles'}
                  {activeTab === 'superadmin' && 'Sovereign Superadmin Cryptographic Console'}
                </h1>
                <span className={`badge-role-pill ${isSuperadmin ? 'gold-glow' : 'emerald-glow'}`}>
                  {isSuperadmin ? '👑 Super Admin (Full GCC Jurisdiction)' : '🎓 Campus Admin (Local Scope)'}
                </span>
              </div>
              <p className="portal-subtext">
                Live synchronization across 6 GCC hubs • AES-256 encrypted • Connected to PostgreSQL Database
              </p>
            </div>
          </div>

          <div className="top-bar-right">
            <button className="btn-refresh-data" onClick={() => {
              loadAllStats();
              loadTeachersData();
              loadStudentsData();
              loadParentsData();
            }} title="Refresh Live Database">
              <RefreshCw size={15} />
              <span>Sync DB</span>
            </button>
            <button className="btn-top-logout" onClick={onLogout}>
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Global Prominent Stats Cards: Displaying Total Counts */}
        <section className="stats-metric-strip">
          <div className="stat-card glass-panel emerald-border" onClick={() => { setActiveTab('students'); loadStudentsData(); }}>
            <div className="stat-icon-wrap emerald">
              <GraduationCap size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Students Enrolled</span>
              <strong className="stat-val emerald">{studentsTotal}</strong>
              <span className="stat-sub">Across 6 GCC Countries</span>
            </div>
          </div>

          <div className="stat-card glass-panel gold-border" onClick={() => { setActiveTab('teachers'); loadTeachersData(); }}>
            <div className="stat-icon-wrap gold">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Faculty & Teachers</span>
              <strong className="stat-val gold">{teachersTotal}</strong>
              <span className="stat-sub">Certified International Educators</span>
            </div>
          </div>

          <div className="stat-card glass-panel cyan-border" onClick={() => { setActiveTab('parents'); loadParentsData(); }}>
            <div className="stat-icon-wrap cyan">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Registered Parents</span>
              <strong className="stat-val cyan">{parentsTotal}</strong>
              <span className="stat-sub">Verified with Photo ID & WhatsApp</span>
            </div>
          </div>

          <div className="stat-card glass-panel purple-border">
            <div className="stat-icon-wrap purple">
              <Globe size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">GCC Campuses & Hubs</span>
              <strong className="stat-val purple">6 Hubs</strong>
              <span className="stat-sub">🇦🇪 🇸🇦 🇧🇭 🇰🇼 🇶🇦 🇴🇲</span>
            </div>
          </div>
        </section>

        {/* Notification / Success Banners */}
        {studentMsg && (
          <div className="alert-banner-success">
            <CheckCircle2 size={18} />
            <span>{studentMsg}</span>
          </div>
        )}
        {teacherMsg && (
          <div className="alert-banner-success">
            <CheckCircle2 size={18} />
            <span>{teacherMsg}</span>
          </div>
        )}
        {parentMsg && (
          <div className="alert-banner-success">
            <CheckCircle2 size={18} />
            <span>{parentMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW                                  */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="tab-pane-container">
            <div className="overview-grid">
              {/* Left Column: Quick Actions & Live Campus Status */}
              <div className="overview-card glass-panel">
                <div className="card-heading-row">
                  <h3>🏫 GCC Regional Campus Network</h3>
                  <span className="live-indicator"><span className="pulse-dot"></span> Live Operations</span>
                </div>
                <div className="campus-status-list">
                  {GCC_CAMPUSES.map((c, i) => (
                    <div key={c} className="campus-row-item">
                      <div className="campus-badge-circle">{i + 1}</div>
                      <div className="campus-info">
                        <strong>{c}</strong>
                        <span>Biometric Gates Online • Halal Dining Active</span>
                      </div>
                      <span className="status-pill operational">Operational</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Roles Matrix Brief & Live Feeds */}
              <div className="overview-card glass-panel">
                <div className="card-heading-row">
                  <h3>🛡️ Active Role Clearance & Authority</h3>
                  <button className="btn-link" onClick={() => setActiveTab('roles')}>
                    View Full Matrix <ChevronRight size={14} />
                  </button>
                </div>
                <div className="role-summary-box">
                  <div className={`role-highlight-banner ${isSuperadmin ? 'gold-grad' : 'emerald-grad'}`}>
                    <div className="role-icon">
                      {isSuperadmin ? <Crown size={32} /> : <ShieldAlert size={32} />}
                    </div>
                    <div>
                      <h4>{isSuperadmin ? 'Super Admin Mode: Sovereign Regional Director' : 'Admin Mode: Campus Operations Manager'}</h4>
                      <p>
                        {isSuperadmin
                          ? 'You possess full master control over all 6 GCC countries, database CRUD, promoting admins, and Twilio/WhatsApp gateways.'
                          : 'You possess branch-level authority: managing local students, faculty, daily meals, and gate attendance.'}
                      </p>
                    </div>
                  </div>

                  <div className="quick-action-strip">
                    <button className="btn-quick" onClick={() => { setActiveTab('students'); setStudentModalOpen(true); }}>
                      <UserPlus size={15} /> Enroll Student
                    </button>
                    <button className="btn-quick" onClick={() => { setActiveTab('teachers'); setTeacherModalOpen(true); }}>
                      <Users size={15} /> Onboard Teacher
                    </button>
                    <button className="btn-quick" onClick={() => { setActiveTab('parents'); setParentModalOpen(true); }}>
                      <Camera size={15} /> Register Parent
                    </button>
                    <button className="btn-quick" onClick={() => setActiveTab('meals')}>
                      <Utensils size={15} /> Send Meal Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: STUDENTS DIRECTORY (DEDICATED TAB)                  */}
        {/* ========================================================= */}
        {activeTab === 'students' && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>🎓 Student Directory & Biometric Profiles</h2>
                <p>Showing <strong>{studentsTotal} total students</strong> registered in the database across all GCC branches.</p>
              </div>
              <button className="btn-add-primary" onClick={() => setStudentModalOpen(true)}>
                <UserPlus size={18} />
                <span>Enroll New Student</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="table-filter-bar glass-panel">
              <div className="search-input-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search students by name, ID, or parent..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadStudentsData()}
                />
              </div>

              <div className="filter-select-box">
                <Filter size={16} />
                <select
                  value={studentCountryFilter}
                  onChange={(e) => setStudentCountryFilter(e.target.value)}
                >
                  <option value="ALL">All GCC Countries</option>
                  {GCC_COUNTRIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button className="btn-filter-apply" onClick={() => { setStudentPage(1); loadStudentsData(1); }}>Apply Filters</button>
            </div>

            {/* Students Table */}
            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Photo & ID</th>
                    <th>Grade & Section</th>
                    <th>Campus & Country</th>
                    <th>Biometric Gate Status</th>
                    <th>Parent / Guardian</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map((st) => (
                    <tr key={st.id}>
                      <td>
                        <div className="entity-cell">
                          <img
                            src={st.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80`}
                            alt={st.name}
                            className="avatar-img-table"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80';
                            }}
                          />
                          <div>
                            <span className="entity-name">{st.name}</span>
                            <span className="entity-sub">{st.id} • {st.nationality || 'GCC'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="grade-pill">{st.grade} - Sec {st.section || 'A'}</span>
                      </td>
                      <td>
                        <div className="campus-cell">
                          <span>{st.campus}</span>
                          <span className="country-sub">{st.country}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${st.attendance_status?.includes('Inside') || st.attendanceStatus?.includes('Inside') ? 'operational' : 'offline'}`}>
                          <Fingerprint size={12} />
                          {st.attendance_status || st.attendanceStatus || 'Checked Out'}
                        </span>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span>👤 {st.parent_name || st.parentName || 'Guardian'}</span>
                          <span>📞 {st.parent_phone || st.parentPhone || '+971 5000000'}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-action-icon delete"
                          onClick={() => handleDeleteStudent(st.id, st.name)}
                          title="Remove student record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Students Universal Pagination Bar */}
            <div className="pagination-bar">
              <div className="pagination-info">
                <span>Showing page <strong>{studentPage}</strong> of <strong>{studentTotalPages}</strong> ({studentsTotal.toLocaleString()} Enrolled Students)</span>
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={studentPage === 1}
                  onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div className="page-numbers-group">
                  {studentPage > 2 && (
                    <button className="page-num-btn" onClick={() => setStudentPage(1)}>1</button>
                  )}
                  {studentPage > 3 && <span style={{ color: '#64748b' }}>...</span>}
                  {studentPage > 1 && (
                    <button className="page-num-btn" onClick={() => setStudentPage(studentPage - 1)}>{studentPage - 1}</button>
                  )}
                  <button className="page-num-btn active">{studentPage}</button>
                  {studentPage < studentTotalPages && (
                    <button className="page-num-btn" onClick={() => setStudentPage(studentPage + 1)}>{studentPage + 1}</button>
                  )}
                  {studentPage < studentTotalPages - 2 && <span style={{ color: '#64748b' }}>...</span>}
                  {studentPage < studentTotalPages - 1 && (
                    <button className="page-num-btn" onClick={() => setStudentPage(studentTotalPages)}>{studentTotalPages}</button>
                  )}
                </div>
                <button
                  className="page-btn"
                  disabled={studentPage === studentTotalPages}
                  onClick={() => setStudentPage(p => Math.min(studentTotalPages, p + 1))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TEACHERS & FACULTY (DEDICATED TAB)                  */}
        {/* ========================================================= */}
        {activeTab === 'teachers' && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>👨‍🏫 Faculty & Teachers Registry</h2>
                <p>Showing <strong>{teachersTotal} certified educators</strong> with assigned biometric thumb credentials.</p>
              </div>
              <button className="btn-add-primary" onClick={() => { setEditingTeacher(null); setTeacherModalOpen(true); }}>
                <UserPlus size={18} />
                <span>Onboard New Teacher</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="table-filter-bar glass-panel">
              <div className="search-input-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search faculty by name, discipline, or ID..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadTeachersData()}
                />
              </div>

              <div className="filter-select-box">
                <Filter size={16} />
                <select
                  value={teacherSubjectFilter}
                  onChange={(e) => setTeacherSubjectFilter(e.target.value)}
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
              </div>

              <button className="btn-filter-apply" onClick={() => { setTeacherPage(1); loadTeachersData(1); }}>Apply Filter</button>
            </div>

            {/* Teachers Table */}
            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Teacher Name & ID</th>
                    <th>Academic Subject</th>
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
                        <div className="entity-cell">
                          <img
                            src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                            alt={t.name}
                            className="avatar-img-table"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'; }}
                          />
                          <div>
                            <span className="entity-name">{t.name}</span>
                            <span className="entity-sub">{t.id} • {t.gender || 'Faculty'}</span>
                          </div>
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
                          {t.thumbprint_id || t.thumbprintId || `FP-${t.id}`}
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
                            onClick={() => {
                              setEditingTeacher(t);
                              setTeacherFormData({
                                name: t.name,
                                gender: t.gender || 'Female',
                                subject: t.subject,
                                grade: t.grade || 'Grade 9 - 12',
                                campus: t.campus,
                                country: t.country,
                                nationality: t.nationality || 'Emirati',
                                phone: t.phone || '',
                                email: t.email || ''
                              });
                              setTeacherModalOpen(true);
                            }}
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
                </tbody>
              </table>
            </div>

            {/* Teachers Universal Pagination Bar */}
            {teacherTotalPages > 1 && (
              <div className="pagination-bar">
                <div className="pagination-info">
                  <span>Showing page <strong>{teacherPage}</strong> of <strong>{teacherTotalPages}</strong> ({teachersTotal} Faculty Members)</span>
                </div>
                <div className="pagination-controls">
                  <button
                    className="page-btn"
                    disabled={teacherPage === 1}
                    onClick={() => setTeacherPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <div className="page-numbers-group">
                    {Array.from({ length: teacherTotalPages }, (_, i) => i + 1).map(pNum => (
                      <button
                        key={pNum}
                        className={`page-num-btn ${teacherPage === pNum ? 'active' : ''}`}
                        onClick={() => setTeacherPage(pNum)}
                      >
                        {pNum}
                      </button>
                    ))}
                  </div>
                  <button
                    className="page-btn"
                    disabled={teacherPage === teacherTotalPages}
                    onClick={() => setTeacherPage(p => Math.min(teacherTotalPages, p + 1))}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PARENTS & GUARDIANS (WITH PICTURES - DEDICATED)     */}
        {/* ========================================================= */}
        {activeTab === 'parents' && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>👨‍👩‍👧‍👦 Parents & Legal Guardians Directory</h2>
                <p>Showing <strong>{parentsTotal} registered parents</strong> with verified photo profiles, linked students, and alert subscriptions.</p>
              </div>
              <button className="btn-add-primary" onClick={() => setParentModalOpen(true)}>
                <UserPlus size={18} />
                <span>Register New Parent</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="table-filter-bar glass-panel">
              <div className="search-input-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search parents by name, linked student, or phone..."
                  value={parentSearch}
                  onChange={(e) => setParentSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadParentsData()}
                />
              </div>

              <div className="filter-select-box">
                <Filter size={16} />
                <select
                  value={parentCountryFilter}
                  onChange={(e) => setParentCountryFilter(e.target.value)}
                >
                  <option value="ALL">All GCC Countries</option>
                  {GCC_COUNTRIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button className="btn-filter-apply" onClick={() => { setParentPage(1); loadParentsData(1); }}>Apply Filter</button>
            </div>

            {/* Parents Cards & Table */}
            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Parent Photo & Name</th>
                    <th>Relationship</th>
                    <th>Linked Student Ward</th>
                    <th>Campus & Country</th>
                    <th>Contact Phone & Email</th>
                    <th>Meal Alerts Channel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parentsList.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="entity-cell">
                          <img
                            src={p.avatar || SAMPLE_PARENT_AVATARS[0]}
                            alt={p.name}
                            className="avatar-img-table parent-photo"
                            onError={(e) => { e.target.src = SAMPLE_PARENT_AVATARS[1]; }}
                          />
                          <div>
                            <span className="entity-name">{p.name}</span>
                            <span className="entity-sub">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-pill-badge">{p.relationship || 'Guardian'}</span>
                      </td>
                      <td>
                        <div className="student-linked-cell">
                          <strong>{p.student_name || p.studentName || 'Student Ward'}</strong>
                          <span className="grade-sub">{p.student_grade || p.studentGrade || 'Grade 9'} • {p.student_id || p.studentId || 'GCC-STU'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="campus-cell">
                          <span>{p.campus}</span>
                          <span className="country-sub">{p.country}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span><Phone size={12} /> {p.phone}</span>
                          <span><Mail size={12} /> {p.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="status-pill operational">
                          <CheckCircle2 size={12} />
                          {p.preferred_channel || p.preferredChannel || 'WhatsApp & SMS'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-action-icon delete"
                          onClick={() => handleDeleteParent(p.id, p.name)}
                          title="Remove parent profile"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Parents Universal Pagination Bar */}
            <div className="pagination-bar">
              <div className="pagination-info">
                <span>Showing page <strong>{parentPage}</strong> of <strong>{parentTotalPages}</strong> ({parentsTotal.toLocaleString()} Registered Parents)</span>
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={parentPage === 1}
                  onClick={() => setParentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div className="page-numbers-group">
                  {parentPage > 2 && (
                    <button className="page-num-btn" onClick={() => setParentPage(1)}>1</button>
                  )}
                  {parentPage > 3 && <span style={{ color: '#64748b' }}>...</span>}
                  {parentPage > 1 && (
                    <button className="page-num-btn" onClick={() => setParentPage(parentPage - 1)}>{parentPage - 1}</button>
                  )}
                  <button className="page-num-btn active">{parentPage}</button>
                  {parentPage < parentTotalPages && (
                    <button className="page-num-btn" onClick={() => setParentPage(parentPage + 1)}>{parentPage + 1}</button>
                  )}
                  {parentPage < parentTotalPages - 2 && <span style={{ color: '#64748b' }}>...</span>}
                  {parentPage < parentTotalPages - 1 && (
                    <button className="page-num-btn" onClick={() => setParentPage(parentTotalPages)}>{parentTotalPages}</button>
                  )}
                </div>
                <button
                  className="page-btn"
                  disabled={parentPage === parentTotalPages}
                  onClick={() => setParentPage(p => Math.min(parentTotalPages, p + 1))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ROLE COMPARISON MATRIX (ADMIN VS SUPER ADMIN)       */}
        {/* ========================================================= */}
        {activeTab === 'roles' && (
          <div className="tab-pane-container">
            <div className="roles-matrix-wrapper">
              <div className="section-header-row">
                <div>
                  <h2>🛡️ Security & Role Governance Matrix</h2>
                  <p>Comprehensive architectural breakdown between <strong>Campus Administrator</strong> and <strong>GCC Super Admin</strong> roles.</p>
                </div>
              </div>

              {/* Side-by-side Role Comparison Cards */}
              <div className="role-comparison-cards">
                {/* CAMPUS ADMIN CARD */}
                <div className={`role-spec-card glass-panel ${!isSuperadmin ? 'highlighted-active' : ''}`}>
                  <div className="card-top-header emerald-bg">
                    <ShieldAlert size={28} />
                    <div>
                      <h3>🎓 Campus Administrator</h3>
                      <span>Operational Scope: Branch Level (Single Campus)</span>
                    </div>
                  </div>
                  <div className="spec-body">
                    <p className="spec-desc">
                      Assigned to specific campus operations (e.g. Dubai, Riyadh, Manama, Kuwait City, Doha, or Muscat). Focuses on day-to-day student care, faculty coordination, and parent notifications.
                    </p>
                    <ul className="spec-checklist">
                      <li><Check size={16} className="text-emerald" /> <strong>Student Enrollment:</strong> Enroll and update student profiles in designated branch.</li>
                      <li><Check size={16} className="text-emerald" /> <strong>Faculty Supervision:</strong> Monitor local faculty schedules and assigned subjects.</li>
                      <li><Check size={16} className="text-emerald" /> <strong>Meal Updates:</strong> Dispatch daily lunch menu notifications to local parents.</li>
                      <li><Check size={16} className="text-emerald" /> <strong>Biometric Gate:</strong> Monitor student check-in / check-out at campus gates.</li>
                      <li><Check size={16} className="text-emerald" /> <strong>PTM Appointments:</strong> Facilitate parent-teacher consultation booking slots.</li>
                      <li className="spec-disabled"><X size={16} className="text-red" /> <strong>No Cross-Border Access:</strong> Cannot modify or view other countries' master records.</li>
                      <li className="spec-disabled"><X size={16} className="text-red" /> <strong>No Admin Management:</strong> Cannot create, promote, or demote other administrators.</li>
                      <li className="spec-disabled"><X size={16} className="text-red" /> <strong>No Infrastructure Control:</strong> Cannot configure Twilio API keys or purge audit trails.</li>
                    </ul>
                  </div>
                </div>

                {/* SUPER ADMIN CARD */}
                <div className={`role-spec-card glass-panel ${isSuperadmin ? 'highlighted-active gold-ring' : ''}`}>
                  <div className="card-top-header gold-bg">
                    <Crown size={28} />
                    <div>
                      <h3>👑 Regional Super Admin</h3>
                      <span>Executive Scope: Pan-GCC Multi-Country Sovereign</span>
                    </div>
                  </div>
                  <div className="spec-body">
                    <p className="spec-desc">
                      Possesses ultimate authority over the entire GCC International School network across the UAE, Saudi Arabia, Bahrain, Kuwait, Qatar, and Oman. Full database and cryptographic authority.
                    </p>
                    <ul className="spec-checklist">
                      <li><Check size={16} className="text-gold" /> <strong>Multi-Campus Sovereignty:</strong> Unrestricted master CRUD across all 6 countries.</li>
                      <li><Check size={16} className="text-gold" /> <strong>Admin Provisioning:</strong> Create, promote, suspend, or revoke Campus Admin accounts.</li>
                      <li><Check size={16} className="text-gold" /> <strong>Pan-GCC Emergency Broadcasts:</strong> Dispatch multi-country SMS / WhatsApp alerts.</li>
                      <li><Check size={16} className="text-gold" /> <strong>Twilio & WhatsApp Gateways:</strong> Modify API keys, Webhooks, and SMS sender IDs.</li>
                      <li><Check size={16} className="text-gold" /> <strong>Full Database Master Access:</strong> Direct SQL migration, backup export, and record recovery.</li>
                      <li><Check size={16} className="text-gold" /> <strong>Biometric Protocol Overrides:</strong> Global security lockdown and gate bypass authorization.</li>
                      <li><Check size={16} className="text-gold" /> <strong>Audit Trail Transparency:</strong> Inspect immutable timestamped security access logs.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Comparative Feature Matrix Table */}
              <div className="matrix-table-card glass-panel">
                <h3>Detailed Capabilities Matrix</h3>
                <table className="admin-table matrix-table">
                  <thead>
                    <tr>
                      <th>Feature & Governance Capability</th>
                      <th>🎓 Campus Administrator</th>
                      <th>👑 Regional Super Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Multi-Country Scope</strong></td>
                      <td>Single Campus Assigned</td>
                      <td><span className="text-gold font-bold">All 6 GCC Nations (Global)</span></td>
                    </tr>
                    <tr>
                      <td><strong>Student & Teacher Directory</strong></td>
                      <td>Local Branch Only</td>
                      <td><span className="text-gold font-bold">Full Database CRUD</span></td>
                    </tr>
                    <tr>
                      <td><strong>Parents & Guardian Registry</strong></td>
                      <td>Campus Parents Only</td>
                      <td><span className="text-gold font-bold">Pan-GCC Master Roster</span></td>
                    </tr>
                    <tr>
                      <td><strong>Daily Meal Notification Dispatch</strong></td>
                      <td>Campus Broadcast</td>
                      <td><span className="text-gold font-bold">Multi-Campus Simultaneous Blast</span></td>
                    </tr>
                    <tr>
                      <td><strong>SMS & WhatsApp Gateway Keys (Twilio)</strong></td>
                      <td><span className="text-red">❌ Locked</span></td>
                      <td><span className="text-gold font-bold">👑 Full Gateway Master Config</span></td>
                    </tr>
                    <tr>
                      <td><strong>Create / Revoke Admin Credentials</strong></td>
                      <td><span className="text-red">❌ Forbidden</span></td>
                      <td><span className="text-gold font-bold">👑 Unlimited Provisioning</span></td>
                    </tr>
                    <tr>
                      <td><strong>Security Audit Log Purge / Inspection</strong></td>
                      <td>Read-only Local</td>
                      <td><span className="text-gold font-bold">Full Cryptographic Audit</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: MEAL BROADCASTS & MENUS                             */}
        {/* ========================================================= */}
        {activeTab === 'meals' && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>🍱 Student Nutrition & Daily Meal Broadcasts</h2>
                <p>Send instant SMS & WhatsApp notifications to parents with today's Halal-certified menu and dietary facts.</p>
              </div>
            </div>

            {mealMsg && (
              <div className="alert-banner-success">
                <CheckCircle2 size={18} />
                <span>{mealMsg}</span>
              </div>
            )}

            <div className="broadcast-composer-grid">
              <div className="broadcast-config-card glass-panel">
                <h3>🚀 Dispatch Meal Update to Parents</h3>
                <div className="form-group">
                  <label>Select Target Campuses</label>
                  <select
                    className="admin-input"
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                  >
                    <option value="ALL Campuses">All 6 GCC Campuses ({parentsTotal} Parents)</option>
                    <option value="Dubai Academic City Campus (UAE)">Dubai Academic City Campus (UAE)</option>
                    <option value="Riyadh Diplomatic Quarter Campus (KSA)">Riyadh Diplomatic Quarter Campus (KSA)</option>
                    <option value="Bahrain International Campus (Manama)">Bahrain International Campus (Manama)</option>
                    <option value="Kuwait City Campus">Kuwait City Campus</option>
                    <option value="Doha Education City Campus (Qatar)">Doha Education City Campus (Qatar)</option>
                    <option value="Muscat Knowledge Oasis Campus (Oman)">Muscat Knowledge Oasis Campus (Oman)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Day of the Week</label>
                  <select
                    className="admin-input"
                    value={selectedDay}
                    onChange={(e) => {
                      setSelectedDay(e.target.value);
                      const m = menuDays.find(d => d.day.toLowerCase() === e.target.value.toLowerCase());
                      if (m) setCurrentEditMenu(m);
                    }}
                  >
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Dietary & Allergen Notice</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    value={customDietaryNotice}
                    onChange={(e) => setCustomDietaryNotice(e.target.value)}
                  />
                </div>

                <button
                  className="btn-admin-submit gold-glow"
                  onClick={handleSendBroadcast}
                  disabled={broadcastLoading}
                >
                  <Send size={18} />
                  <span>{broadcastLoading ? 'Broadcasting to Parents...' : 'Broadcast Daily Menu via SMS & WhatsApp'}</span>
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="broadcast-preview-card glass-panel">
                <h3>📱 Parent Phone Live Preview</h3>
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="sms-bubble">
                      <strong>🍽️ GCC International Schools Daily Meal</strong>
                      <p>Dear Parent, today's lunch for your student at <em>{broadcastTarget}</em>:</p>
                      <p><strong>Main:</strong> {currentEditMenu?.lunch?.dish || 'Fresh Oven Roasted Herb Chicken with Turmeric Rice'}</p>
                      <p><strong>Allergens:</strong> {currentEditMenu?.lunch?.allergens?.join(', ') || 'Halal Certified, Nut-Free'}</p>
                      <p className="sms-meta">Sent via Automated Parent Dispatch • 100% Halal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: CAMPUS NEWS & ANNOUNCEMENTS                         */}
        {/* ========================================================= */}
        {activeTab === 'news' && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>📰 Campus Bulletins & News Center</h2>
                <p>Publish news, STEM accolades, and GCC event highlights to the student and parent portal.</p>
              </div>
            </div>

            {newsMsg && (
              <div className="alert-banner-success">
                <CheckCircle2 size={18} />
                <span>{newsMsg}</span>
              </div>
            )}

            <div className="news-management-grid">
              <form onSubmit={handleCreateNews} className="news-form glass-panel">
                <h3>Post New Announcement</h3>
                <div className="form-group">
                  <label>Article Headline *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. GCC Robotics Team Triumphs in Dubai..."
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
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
                      <option>Sports & Athletics</option>
                      <option>Academic Accolades</option>
                      <option>Arts & Heritage</option>
                      <option>Campus Life</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label>Target Hub</label>
                    <select
                      className="admin-input"
                      value={newsCampus}
                      onChange={(e) => setNewsCampus(e.target.value)}
                    >
                      <option>All GCC Campuses</option>
                      {GCC_CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Article Body Content *</label>
                  <textarea
                    required
                    rows={4}
                    className="admin-input"
                    placeholder="Provide full description of the accomplishment or announcement..."
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-add-primary">
                  <Send size={16} />
                  <span>Publish Announcement</span>
                </button>
              </form>

              {/* Published News List */}
              <div className="news-cards-list glass-panel">
                <h3>Live Bulletins ({newsList.length})</h3>
                <div className="articles-scroll">
                  {newsList.map(a => (
                    <div key={a.id} className="news-item-row">
                      <img src={a.cover_image || a.coverImage} alt={a.title} className="news-thumb" />
                      <div className="news-item-content">
                        <span className="news-cat-pill">{a.category}</span>
                        <h4>{a.title}</h4>
                        <span className="news-campus-sub">{a.campus}</span>
                      </div>
                      <button
                        className="btn-action-icon delete"
                        onClick={() => handleDeleteNews(a.id)}
                        title="Delete announcement"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: BIOMETRIC GATE LOGS                                 */}
        {/* ========================================================= */}
        {activeTab === 'biometrics' && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>🖐️ Live Biometric Gate & Attendance Logs</h2>
                <p>Real-time audit log of student & faculty thumbprint scans at campus entry/exit points.</p>
              </div>
            </div>

            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Log ID & Timestamp</th>
                    <th>Individual Scanned</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Terminal / Gate</th>
                    <th>Campus</th>
                  </tr>
                </thead>
                <tbody>
                  {bioLogs.slice(0, 20).map((log, idx) => (
                    <tr key={log.id || idx}>
                      <td>
                        <span className="entity-name">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent Scan'}</span>
                        <span className="entity-sub">{log.id || `LOG-${idx + 1}`}</span>
                      </td>
                      <td><strong>{log.name || log.student_name}</strong></td>
                      <td><span className="role-pill-badge">{log.role || 'Student'}</span></td>
                      <td>
                        <span className={`status-pill ${log.action?.includes('In') ? 'operational' : 'offline'}`}>
                          {log.action || 'Time In'}
                        </span>
                      </td>
                      <td>{log.terminal || 'Terminal 1 - Main Turnstile'}</td>
                      <td>{log.campus || 'Dubai Academic City'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: PTM CONSULTATIONS                                   */}
        {/* ========================================================= */}
        {activeTab === 'ptm' && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>📅 Parent-Teacher Consultation (PTM) Roster</h2>
                <p>Active 1-on-1 parent appointments verified via SMS One-Time Passcode (OTP).</p>
              </div>
            </div>

            <div className="data-table-container glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking Ref</th>
                    <th>Teacher</th>
                    <th>Student Ward</th>
                    <th>Parent Guardian</th>
                    <th>Date & Time Slot</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ptmBookings.map((b) => (
                    <tr key={b.bookingId || b.booking_id}>
                      <td><strong>{b.bookingId || b.booking_id}</strong></td>
                      <td>{b.teacherName || b.teacher_name} ({b.subject})</td>
                      <td>{b.studentName || b.student_name}</td>
                      <td>
                        <span>{b.parentName || b.parent_name}</span>
                        <span className="entity-sub">{b.phone}</span>
                      </td>
                      <td>
                        <strong>{b.date}</strong>
                        <span className="entity-sub">{b.timeSlot || b.time_slot}</span>
                      </td>
                      <td>
                        <span className="status-pill operational">
                          <CheckCircle2 size={12} /> {b.status || 'Confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: SUPERADMIN GOVERNANCE (RESTRICTED)                 */}
        {/* ========================================================= */}
        {activeTab === 'superadmin' && isSuperadmin && (
          <div className="tab-pane-container">
            <div className="section-header-flex">
              <div>
                <h2>👑 Superadmin Security & Admin Management</h2>
                <p>Provision and govern Campus Administrator accounts across all GCC regions.</p>
              </div>
            </div>

            {superAdminMsg && (
              <div className="alert-banner-success">
                <CheckCircle2 size={18} />
                <span>{superAdminMsg}</span>
              </div>
            )}

            <div className="superadmin-grid">
              {/* Form to provision new Admin */}
              <form onSubmit={handleCreateAdmin} className="superadmin-card glass-panel">
                <h3>Provision New Administrator</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Dr. Tariq Al-Hashimi"
                    value={newAdminForm.fullName}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Username *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="e.g. admin_manama"
                      value={newAdminForm.username}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Assigned Role *</label>
                    <select
                      className="admin-input"
                      value={newAdminForm.role}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    >
                      <option value="admin">Campus Administrator (Branch Scope)</option>
                      <option value="superadmin">Regional Super Admin (Full GCC Scope)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Official Email *</label>
                  <input
                    type="email"
                    required
                    className="admin-input"
                    placeholder="admin@gccschools.edu"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Initial Secure Password *</label>
                  <input
                    type="password"
                    required
                    className="admin-input"
                    placeholder="Min 8 characters (e.g. GCC2026!Secure)"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-admin-submit gold-glow">
                  <ShieldCheck size={18} />
                  <span>Create Admin Account</span>
                </button>
              </form>

              {/* Active Admin Accounts Roster */}
              <div className="superadmin-card glass-panel">
                <h3>Provisioned Administrators ({adminUsers.length})</h3>
                <div className="admin-users-list">
                  {adminUsers.map(u => (
                    <div key={u.id} className="admin-user-row">
                      <div className="user-icon-badge">
                        {u.role === 'superadmin' ? '👑' : '🛡️'}
                      </div>
                      <div className="user-text">
                        <strong>{u.full_name || u.username}</strong>
                        <span>{u.email} • Role: <em>{u.role}</em></span>
                      </div>
                      <span className={`status-pill ${u.role === 'superadmin' ? 'gold' : 'operational'}`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 📝 MODAL: ENROLL NEW STUDENT                               */}
      {/* ========================================================= */}
      {studentModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-window glass-panel">
            <div className="modal-header">
              <h3>🎓 Enroll New Student</h3>
              <button className="btn-close-modal" onClick={() => setStudentModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEnrollStudent} className="modal-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Student Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Khalid Al-Mutawa"
                    value={studentFormData.name}
                    onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Gender</label>
                  <select
                    className="admin-input"
                    value={studentFormData.gender}
                    onChange={(e) => setStudentFormData({ ...studentFormData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Grade Level *</label>
                  <select
                    className="admin-input"
                    value={studentFormData.grade}
                    onChange={(e) => setStudentFormData({ ...studentFormData, grade: e.target.value })}
                  >
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Class Section</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. A"
                    value={studentFormData.section}
                    onChange={(e) => setStudentFormData({ ...studentFormData, section: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Campus *</label>
                  <select
                    className="admin-input"
                    value={studentFormData.campus}
                    onChange={(e) => setStudentFormData({ ...studentFormData, campus: e.target.value })}
                  >
                    {GCC_CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Country *</label>
                  <select
                    className="admin-input"
                    value={studentFormData.country}
                    onChange={(e) => setStudentFormData({ ...studentFormData, country: e.target.value })}
                  >
                    {GCC_COUNTRIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Parent / Guardian Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Saud Al-Mutawa"
                    value={studentFormData.parentName}
                    onChange={(e) => setStudentFormData({ ...studentFormData, parentName: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Parent Contact Phone</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="+971 501234567"
                    value={studentFormData.parentPhone}
                    onChange={(e) => setStudentFormData({ ...studentFormData, parentPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setStudentModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-add-primary">Complete Enrollment & Generate Thumb ID</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📝 MODAL: ONBOARD / EDIT TEACHER                           */}
      {/* ========================================================= */}
      {teacherModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-window glass-panel">
            <div className="modal-header">
              <h3>{editingTeacher ? '✏️ Edit Faculty Record' : '👨‍🏫 Onboard New Teacher'}</h3>
              <button className="btn-close-modal" onClick={() => setTeacherModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveTeacher} className="modal-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Sarah Al-Sabah"
                    value={teacherFormData.name}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Gender</label>
                  <select
                    className="admin-input"
                    value={teacherFormData.gender}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, gender: e.target.value })}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Academic Subject *</label>
                  <select
                    className="admin-input"
                    value={teacherFormData.subject}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, subject: e.target.value })}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics & Robotics">Physics & Robotics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Arabic & Islamic Studies">Arabic & Islamic Studies</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Grade Level</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Grade 9 - 12"
                    value={teacherFormData.grade}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, grade: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Campus *</label>
                  <select
                    className="admin-input"
                    value={teacherFormData.campus}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, campus: e.target.value })}
                  >
                    {GCC_CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Country *</label>
                  <select
                    className="admin-input"
                    value={teacherFormData.country}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, country: e.target.value })}
                  >
                    {GCC_COUNTRIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="+971 501234567"
                    value={teacherFormData.phone}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Official Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="faculty@gccschools.edu"
                    value={teacherFormData.email}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setTeacherModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-add-primary">
                  {editingTeacher ? 'Save Changes' : 'Register Faculty & Issue Biometrics'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 📝 MODAL: REGISTER PARENT (WITH PHOTO)                     */}
      {/* ========================================================= */}
      {parentModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-window glass-panel">
            <div className="modal-header">
              <h3>👨‍👩‍👧‍👦 Register Parent / Legal Guardian</h3>
              <button className="btn-close-modal" onClick={() => setParentModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRegisterParent} className="modal-form">
              {/* Photo Preview & Avatar Selector */}
              <div className="avatar-picker-section">
                <label className="picker-label">Parent Photo Preview:</label>
                <div className="picker-preview-row">
                  <img
                    src={parentFormData.avatar}
                    alt="Selected Avatar"
                    className="avatar-large-preview"
                  />
                  <div className="picker-options">
                    <span className="picker-hint">Choose professional portrait:</span>
                    <div className="avatar-thumbnails">
                      {SAMPLE_PARENT_AVATARS.map((av, idx) => (
                        <img
                          key={idx}
                          src={av}
                          alt={`Avatar ${idx + 1}`}
                          className={`thumb-choice ${parentFormData.avatar === av ? 'selected' : ''}`}
                          onClick={() => setParentFormData({ ...parentFormData, avatar: av })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Parent Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Fatima Al-Zahra"
                    value={parentFormData.name}
                    onChange={(e) => setParentFormData({ ...parentFormData, name: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Relationship *</label>
                  <select
                    className="admin-input"
                    value={parentFormData.relationship}
                    onChange={(e) => setParentFormData({ ...parentFormData, relationship: e.target.value })}
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Linked Student Ward Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Zaid Al-Mutawa"
                    value={parentFormData.studentName}
                    onChange={(e) => setParentFormData({ ...parentFormData, studentName: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Student Grade</label>
                  <select
                    className="admin-input"
                    value={parentFormData.studentGrade}
                    onChange={(e) => setParentFormData({ ...parentFormData, studentGrade: e.target.value })}
                  >
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Contact Phone (WhatsApp) *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="+971 501234567"
                    value={parentFormData.phone}
                    onChange={(e) => setParentFormData({ ...parentFormData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="parent@gccparents.com"
                    value={parentFormData.email}
                    onChange={(e) => setParentFormData({ ...parentFormData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Country *</label>
                  <select
                    className="admin-input"
                    value={parentFormData.country}
                    onChange={(e) => setParentFormData({ ...parentFormData, country: e.target.value })}
                  >
                    {GCC_COUNTRIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Campus *</label>
                  <select
                    className="admin-input"
                    value={parentFormData.campus}
                    onChange={(e) => setParentFormData({ ...parentFormData, campus: e.target.value })}
                  >
                    {GCC_CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Notifications Channel</label>
                <select
                  className="admin-input"
                  value={parentFormData.preferredChannel}
                  onChange={(e) => setParentFormData({ ...parentFormData, preferredChannel: e.target.value })}
                >
                  <option value="WhatsApp & SMS">WhatsApp & SMS (Recommended)</option>
                  <option value="SMS Only">SMS Only</option>
                  <option value="Email & Portal">Email & Portal</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setParentModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-add-primary">Save Parent Record to Database</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

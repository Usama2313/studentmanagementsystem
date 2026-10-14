// client/src/api.js
const API_BASE = '/api';

function getAuthHeaders(token) {
  const t = token || localStorage.getItem('gcc_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {})
  };
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchConfig() {
  const res = await fetch(`${API_BASE}/config`);
  return res.json();
}

// Admin / Superadmin Authentication
export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Admin authentication failed.');
  }
  return data;
}

export async function fetchAdminMe(token) {
  const res = await fetch(`${API_BASE}/admin/me`, {
    headers: getAuthHeaders(token)
  });
  if (!res.ok) throw new Error('Invalid session');
  return res.json();
}

export async function fetchAdminUsers(token) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: getAuthHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch admin users');
  return data;
}

export async function createAdminUser(userData, token) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create admin user');
  return data;
}

// Teacher Management (Admin Managed)
export async function fetchTeachers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/teachers?${query}`);
  return res.json();
}

export async function createTeacher(teacherData, token) {
  const res = await fetch(`${API_BASE}/admin/teachers`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(teacherData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add teacher');
  return data;
}

export async function updateTeacher(id, teacherData, token) {
  const res = await fetch(`${API_BASE}/admin/teachers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(teacherData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update teacher');
  return data;
}

export async function deleteTeacher(id, token) {
  const res = await fetch(`${API_BASE}/admin/teachers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete teacher');
  return data;
}

// Student Meal Updates & Parent Broadcasts
export async function fetchMenu() {
  const res = await fetch(`${API_BASE}/menu`);
  return res.json();
}

export async function updateMenu(day, menuData, token) {
  const res = await fetch(`${API_BASE}/menu/${day}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(menuData)
  });
  return res.json();
}

export async function broadcastMealUpdate(payload, token) {
  const res = await fetch(`${API_BASE}/admin/meals/broadcast`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to dispatch meal update');
  return data;
}

export async function fetchMealHistory(token) {
  const res = await fetch(`${API_BASE}/admin/meals/history`, {
    headers: getAuthHeaders(token)
  });
  return res.json();
}

// Students & Biometrics
export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

export async function fetchStudents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/students?${query}`);
  return res.json();
}

export async function createStudent(studentData, token) {
  const res = await fetch(`${API_BASE}/admin/students`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(studentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to enroll student');
  return data;
}

export async function updateStudent(id, studentData, token) {
  const res = await fetch(`${API_BASE}/admin/students/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(studentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update student');
  return data;
}

export async function deleteStudent(id, token) {
  const res = await fetch(`${API_BASE}/admin/students/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete student');
  return data;
}

// Parents Directory & Management
export async function fetchParents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/parents?${query}`);
  return res.json();
}

export async function createParent(parentData, token) {
  const res = await fetch(`${API_BASE}/admin/parents`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(parentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to register parent');
  return data;
}

export async function updateParent(id, parentData, token) {
  const res = await fetch(`${API_BASE}/admin/parents/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(parentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update parent');
  return data;
}

export async function deleteParent(id, token) {
  const res = await fetch(`${API_BASE}/admin/parents/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete parent');
  return data;
}


export async function scanBiometric(identifier, terminal) {
  const res = await fetch(`${API_BASE}/biometric/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, terminal })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to scan biometric fingerprint');
  }
  return data;
}

export async function fetchBiometricLogs() {
  const res = await fetch(`${API_BASE}/biometric/logs`);
  return res.json();
}

// News
export async function fetchNews() {
  const res = await fetch(`${API_BASE}/news`);
  return res.json();
}

export async function createNews(article, token) {
  const res = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(article)
  });
  return res.json();
}

export async function deleteNews(id, token) {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return res.json();
}

// PTM Booking (Parents verify via SMS OTP)
export async function requestPtmOtp(details) {
  const res = await fetch(`${API_BASE}/ptm/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to request OTP');
  }
  return data;
}

export async function verifyPtmOtp(bookingRef, otp) {
  const res = await fetch(`${API_BASE}/ptm/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingRef, otp })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'OTP verification failed');
  }
  return data;
}

export async function fetchPtmBookings() {
  const res = await fetch(`${API_BASE}/ptm/bookings`);
  return res.json();
}

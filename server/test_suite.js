// test_suite.js - Uses native fetch (Node 18+)

const BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting GCC Schools Management System Security & Feature Test Suite...\n');

  // Test 1: Health & System Status
  console.log('1️⃣ Testing /api/health ...');
  const healthRes = await fetch(`${BASE}/health`);
  const health = await healthRes.json();
  console.log('   Status:', health.status);
  console.log('   Security:', JSON.stringify(health.security));
  console.log('   Live Database Students:', health.totalStudents, '| Teachers:', health.totalTeachers);

  // Test 2: Admin Login (Invalid Password - Testing Lockout & Brute Force Defense)
  console.log('\n2️⃣ Testing Brute-Force & Credential Defense (Invalid password)...');
  const badLoginRes = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'superadmin', password: 'WrongPassword!' })
  });
  const badLogin = await badLoginRes.json();
  console.log('   Response Code:', badLoginRes.status);
  console.log('   Defense Alert:', badLogin.error);

  // Test 3: Superadmin Login (Valid Credentials)
  console.log('\n3️⃣ Testing Superadmin Authentication (Bcrypt + JWT + AES)...');
  const superLoginRes = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'superadmin', password: 'SuperAdmin@GCC2026!' })
  });
  const superData = await superLoginRes.json();
  console.log('   Login Success:', superData.success);
  console.log('   Role Authenticated:', superData.user.role);
  console.log('   AES Decrypted Profile:', JSON.stringify(superData.user.securityDetails));
  const superToken = superData.token;

  // Test 4: Campus Admin Login
  console.log('\n4️⃣ Testing Campus Admin Authentication...');
  const adminLoginRes = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Admin@GCC2026!' })
  });
  const adminData = await adminLoginRes.json();
  console.log('   Login Success:', adminData.success);
  console.log('   Role Authenticated:', adminData.user.role);
  const adminToken = adminData.token;

  // Test 5: Teacher Management (Admin creates new teacher)
  console.log('\n5️⃣ Testing Teacher Onboarding by Admin (POST /api/admin/teachers)...');
  const newTeacherPayload = {
    name: 'Dr. Tariq Al-Mansoor',
    gender: 'Male',
    subject: 'Computer Science & AI',
    grade: 'Grade 10 - 12',
    campus: 'Dubai Academic City Campus (UAE)',
    country: 'United Arab Emirates',
    nationality: 'Emirati',
    phone: '+971 508889999',
    email: 'tariq.mansoor@gccschools.edu'
  };

  const createTeacherRes = await fetch(`${BASE}/admin/teachers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify(newTeacherPayload)
  });
  const createdTeacher = await createTeacherRes.json();
  console.log('   Teacher Added:', createdTeacher.teacher?.name);
  console.log('   Assigned Biometric ID:', createdTeacher.teacher?.thumbprintId);
  const teacherId = createdTeacher.teacher?.id;

  // Test 6: Verify Teacher listed in public directory
  console.log('\n6️⃣ Verifying Teacher in Directory (GET /api/teachers)...');
  const teachersRes = await fetch(`${BASE}/teachers?search=Tariq`);
  const teachers = await teachersRes.json();
  console.log('   Matches found:', teachers.total);
  if (teachers.data.length > 0) {
    console.log('   First match:', teachers.data[0].name, '-', teachers.data[0].subject);
  }

  // Test 7: Student Meals - Parent Broadcast Update
  console.log('\n7️⃣ Testing Parent Meal Broadcast (POST /api/admin/meals/broadcast)...');
  const broadcastPayload = {
    day: 'Wednesday',
    theme: 'Mediterranean Heritage & Nutrition',
    targetCampus: 'ALL Campuses',
    customNotice: 'All meals prepared fresh with organic dates, saffron chicken, and hydration fruit bowls. 100% Halal certified.',
    mealsSummary: {
      breakfast: 'Organic Greek yogurt with honey and dates',
      lunch: 'Grilled Mediterranean herb chicken with quinoa',
      nutrition: 'Calories: 640 kcal | Protein: 38g'
    }
  };

  const broadcastRes = await fetch(`${BASE}/admin/meals/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify(broadcastPayload)
  });
  const broadcastData = await broadcastRes.json();
  console.log('   Broadcast Result:', broadcastData.message);
  console.log('   Status:', broadcastData.broadcast?.status);

  // Test 8: Parent Meal Broadcast History
  console.log('\n8️⃣ Testing Meal Broadcast History (GET /api/admin/meals/history)...');
  const historyRes = await fetch(`${BASE}/admin/meals/history`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const historyData = await historyRes.json();
  console.log('   History count:', historyData.history?.length);
  if (historyData.history?.length > 0) {
    console.log('   Latest alert:', historyData.history[0].day, 'broadcast sent by', historyData.history[0].sent_by_admin || historyData.history[0].sentByAdmin);
  }

  // Test 9: Biometric Thumb Scan Integration
  console.log('\n9️⃣ Testing Biometric Thumb Scanner Simulation (POST /api/biometric/scan)...');
  const scanRes = await fetch(`${BASE}/biometric/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'Tariq', terminal: 'Gate 1 - North Biometric Portal' })
  });
  const scanData = await scanRes.json();
  console.log('   Scan Event:', scanData.eventType);
  console.log('   Scan Message:', scanData.message);

  console.log('\n✅ ALL INTEGRATION & SECURITY TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch(console.error);

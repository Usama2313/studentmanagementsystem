// server/migrate.js
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { generateTeachers, generateStudents, INITIAL_NEWS, INITIAL_MENU } from './data.js';
import { encryptAES } from './cryptoUtils.js';

dotenv.config();

const { Client } = pg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let rawConn =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

// Strip sslmode query param so pg respects ssl: { rejectUnauthorized: false }
if (rawConn && rawConn.includes('?')) {
  rawConn = rawConn.split('?')[0];
}

console.log('Connecting to Supabase PostgreSQL at:', rawConn ? rawConn.replace(/:[^:]*@/, ':****@') : 'NONE');

const client = new Client({
  connectionString: rawConn,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    await client.connect();
    console.log(' Successfully connected to Supabase PostgreSQL!');

    // 1. Admin Users Table (Role-based access: admin / superadmin)
    console.log('Creating admin_users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'superadmin')),
        full_name TEXT,
        encrypted_details TEXT,
        last_login TIMESTAMP WITH TIME ZONE,
        failed_attempts INT DEFAULT 0,
        lockout_until TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Students Table
    console.log('Creating students table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        gender TEXT,
        grade TEXT NOT NULL,
        section TEXT NOT NULL,
        campus TEXT NOT NULL,
        country TEXT NOT NULL,
        country_code TEXT NOT NULL,
        nationality TEXT NOT NULL,
        thumbprint_id TEXT UNIQUE,
        parent_name TEXT,
        parent_phone TEXT,
        parent_email TEXT,
        encrypted_contact TEXT,
        attendance_status TEXT DEFAULT 'Not Present Yet',
        time_in TEXT,
        time_out TEXT,
        emergency_contact TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Teachers Table
    console.log('Creating teachers table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        gender TEXT,
        subject TEXT NOT NULL,
        grade TEXT,
        campus TEXT NOT NULL,
        country TEXT NOT NULL,
        country_code TEXT NOT NULL,
        nationality TEXT NOT NULL,
        phone TEXT,
        email TEXT UNIQUE,
        thumbprint_id TEXT UNIQUE,
        avatar TEXT,
        available_slots JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Biometric Attendance Logs
    console.log('Creating biometric_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS biometric_logs (
        id TEXT PRIMARY KEY,
        person_id TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        details TEXT,
        event_type TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        terminal TEXT NOT NULL,
        campus TEXT,
        country TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. News & Announcements
    console.log('Creating news_announcements table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS news_announcements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        campus TEXT NOT NULL,
        date TEXT NOT NULL,
        author TEXT,
        summary TEXT,
        content TEXT NOT NULL,
        cover_image TEXT,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. Student Nutrition & Food Menu
    console.log('Creating student_menu table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_menu (
        id SERIAL PRIMARY KEY,
        day TEXT NOT NULL UNIQUE,
        theme TEXT NOT NULL,
        breakfast JSONB NOT NULL,
        snack JSONB NOT NULL,
        lunch JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 7. Meal Notifications Log (Parent meal broadcasts sent by Admin)
    console.log('Creating meal_notifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS meal_notifications (
        id TEXT PRIMARY KEY,
        day TEXT NOT NULL,
        theme TEXT NOT NULL,
        meals_summary JSONB NOT NULL,
        sent_by_admin TEXT NOT NULL,
        target_campus TEXT DEFAULT 'ALL',
        recipients_count INT NOT NULL,
        status TEXT DEFAULT 'Delivered',
        channel TEXT DEFAULT 'SMS & Parent Portal Broadcast',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 8. PTM Bookings Table
    console.log('Creating ptm_bookings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ptm_bookings (
        booking_id TEXT PRIMARY KEY,
        teacher_id TEXT NOT NULL,
        teacher_name TEXT NOT NULL,
        subject TEXT,
        student_name TEXT NOT NULL,
        parent_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        country TEXT NOT NULL,
        date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        verified_via TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create Indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_students_country ON students(country_code);
      CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
      CREATE INDEX IF NOT EXISTS idx_biometric_timestamp ON biometric_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
    `);

    // Seed default Admin & Superadmin if not exists
    console.log('Checking Admin accounts...');
    const adminCheck = await client.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(adminCheck.rows[0].count, 10) === 0) {
      console.log('Seeding initial Superadmin and Admin accounts...');

      const saltRounds = 12;
      const superadminHash = await bcrypt.hash('SuperAdmin@GCC2026!', saltRounds);
      const adminHash = await bcrypt.hash('Admin@GCC2026!', saltRounds);

      const encSuperadminDetails = encryptAES({
        badge: 'SA-GCC-001',
        clearanceLevel: 'Level 5 (Unrestricted GCC Regional Oversight)',
        mfaConfigured: true,
        emergencyPhone: '+971 4 800 9000'
      });

      const encAdminDetails = encryptAES({
        badge: 'ADM-GCC-104',
        clearanceLevel: 'Level 3 (Campus Operations & Faculty Management)',
        mfaConfigured: true,
        emergencyPhone: '+966 11 400 8000'
      });

      await client.query(`
        INSERT INTO admin_users (id, username, email, password_hash, role, full_name, encrypted_details)
        VALUES 
          ('usr_superadmin', 'superadmin', 'superadmin@gccschools.edu', $1, 'superadmin', 'Chief Regional Director', $2),
          ('usr_admin', 'admin', 'admin@gccschools.edu', $3, 'admin', 'Campus Academic Administrator', $4)
      `, [superadminHash, encSuperadminDetails, adminHash, encAdminDetails]);

      console.log(' Admin and Superadmin seeded successfully.');
    } else {
      console.log('ℹ️ Admin accounts already exist.');
    }

    // Seed Weekly Menu if empty
    console.log('Checking student_menu...');
    const menuCheck = await client.query('SELECT COUNT(*) FROM student_menu');
    if (parseInt(menuCheck.rows[0].count, 10) === 0) {
      console.log('Seeding 5-day student nutritional menu...');
      for (const m of INITIAL_MENU) {
        await client.query(`
          INSERT INTO student_menu (day, theme, breakfast, snack, lunch)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (day) DO NOTHING
        `, [m.day, m.theme, JSON.stringify(m.breakfast), JSON.stringify(m.snack), JSON.stringify(m.lunch)]);
      }
      console.log(' Nutritional menus seeded.');
    }

    // Seed Initial News if empty
    console.log('Checking news_announcements...');
    const newsCheck = await client.query('SELECT COUNT(*) FROM news_announcements');
    if (parseInt(newsCheck.rows[0].count, 10) === 0) {
      console.log('Seeding initial news...');
      for (const n of INITIAL_NEWS) {
        await client.query(`
          INSERT INTO news_announcements (id, title, category, campus, date, author, summary, content, cover_image, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING
        `, [n.id, n.title, n.category, n.campus, n.date, n.author, n.summary, n.content, n.coverImage, n.featured]);
      }
      console.log(' News seeded.');
    }

    // Seed initial batch of Teachers if empty (first 30 teachers)
    console.log('Checking teachers...');
    const teachersCheck = await client.query('SELECT COUNT(*) FROM teachers');
    if (parseInt(teachersCheck.rows[0].count, 10) === 0) {
      console.log('Seeding initial teachers...');
      const teachers = generateTeachers();
      for (const t of teachers.slice(0, 30)) {
        await client.query(`
          INSERT INTO teachers (id, name, gender, subject, grade, campus, country, country_code, nationality, phone, email, thumbprint_id, avatar, available_slots)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING
        `, [t.id, t.name, t.gender, t.subject, t.grade, t.campus, t.country, t.countryCode, t.nationality, t.phone, t.email, t.thumbprintId, t.avatar, JSON.stringify(t.availableSlots)]);
      }
      console.log(' Teachers seeded.');
    }

    // Seed initial batch of Students if empty (first 50 students)
    console.log('Checking students...');
    const studentsCheck = await client.query('SELECT COUNT(*) FROM students');
    if (parseInt(studentsCheck.rows[0].count, 10) === 0) {
      console.log('Seeding initial students...');
      const students = generateStudents();
      for (const s of students.slice(0, 50)) {
        const encContact = encryptAES({
          parentPhone: s.parentPhone,
          parentEmail: s.parentEmail,
          emergencyContact: s.emergencyContact
        });

        await client.query(`
          INSERT INTO students (id, name, gender, grade, section, campus, country, country_code, nationality, thumbprint_id, parent_name, parent_phone, parent_email, encrypted_contact, attendance_status, time_in, time_out, emergency_contact)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) DO NOTHING
        `, [s.id, s.name, s.gender, s.grade, s.section, s.campus, s.country, s.countryCode, s.nationality, s.thumbprintId, s.parentName, s.parentPhone, s.parentEmail, encContact, s.attendanceStatus, s.timeIn, s.timeOut, s.emergencyContact]);
      }
      console.log(' Students seeded.');
    }

    console.log(' Migration and database setup completed successfully!');
  } catch (err) {
    console.error(' Migration Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

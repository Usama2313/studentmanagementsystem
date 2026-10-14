-- Supabase Database Schema for GCC International Schools System
-- Covers Bahrain, Saudi Arabia, Kuwait, UAE (Dubai), Qatar, Oman
-- ZERO MONETARY DATA: Focused purely on Academics, Biometric Attendance, Nutrition & PTM Consultations

-- 1. Students Table
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
  attendance_status TEXT DEFAULT 'Not Present Yet',
  time_in TEXT,
  time_out TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Teachers Table
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

-- 3. Biometric Attendance Logs (Thumbs Up / Thumb Machine Scans)
CREATE TABLE IF NOT EXISTS biometric_logs (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'Student' or 'Teacher'
  details TEXT,
  event_type TEXT NOT NULL, -- 'TIME_IN' or 'TIME_OUT'
  timestamp TEXT NOT NULL,
  terminal TEXT NOT NULL,
  campus TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. News and Announcements (Managed from Admin Panel, displayed publicly)
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

-- 5. Student Nutrition & Food Menu
CREATE TABLE IF NOT EXISTS student_menu (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL UNIQUE, -- 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'
  theme TEXT NOT NULL,
  breakfast JSONB NOT NULL,
  snack JSONB NOT NULL,
  lunch JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Parent-Teacher Meetings (PTM) with OTP / SMS Verification
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

-- Indices for rapid querying across 1000s of students
CREATE INDEX IF NOT EXISTS idx_students_country ON students(country_code);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_students_thumbprint ON students(thumbprint_id);
CREATE INDEX IF NOT EXISTS idx_biometric_timestamp ON biometric_logs(created_at DESC);

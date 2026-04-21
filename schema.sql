-- =============================================
-- Orbit Education — Full Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Members (Admin users)
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- News & Notices
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(100) DEFAULT 'General',
  badge_text VARCHAR(100),
  badge_color VARCHAR(50) DEFAULT '#2D7D6F',
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time VARCHAR(50),
  location VARCHAR(255),
  image_url TEXT,
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Programmes
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  icon VARCHAR(100),
  color VARCHAR(50) DEFAULT '#2D7D6F',
  features TEXT[],
  normal_fee VARCHAR(100),
  addon_fee VARCHAR(100),
  addon_courses TEXT[],
  seats INTEGER,
  tags TEXT[],
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they don't exist (for existing databases)
ALTER TABLE programs ADD COLUMN IF NOT EXISTS normal_fee VARCHAR(100);
ALTER TABLE programs ADD COLUMN IF NOT EXISTS addon_fee VARCHAR(100);
ALTER TABLE programs ADD COLUMN IF NOT EXISTS addon_courses TEXT[];
ALTER TABLE programs ADD COLUMN IF NOT EXISTS seats INTEGER;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT,
  file_path VARCHAR(500),
  category VARCHAR(100) DEFAULT 'Campus Life',
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add file_path column if it doesn't exist (for existing databases)
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS file_path VARCHAR(500);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Seed Data (optional — remove if not needed)
-- =============================================

-- Sample programmes
INSERT INTO programs (title, description, duration, icon, color, features, sort_order) VALUES
('Business & Management', 'Learn modern business strategy, leadership, and entrepreneurship with real-world case studies.', '3 Years', '💼', '#2D7D6F', ARRAY['Industry Mentorship','Live Projects','MBA Pathway','Career Placement'], 1),
('Psychology', 'Explore human behaviour, counselling techniques, and mental health with expert faculty.', '3 Years', '🧠', '#7c3aed', ARRAY['Clinical Placements','Research Projects','Certified Counselling','Internships'], 2),
('Banking & Finance', 'Master financial markets, investment strategies, and banking operations from industry veterans.', '3 Years', '🏦', '#0284c7', ARRAY['CFA Prep','Stock Market Lab','Industry Visits','Placement Drive'], 3),
('Artificial Intelligence', 'Build tomorrow''s technology with Python, ML, deep learning, and AI ethics modules.', '4 Years', '🤖', '#dc2626', ARRAY['GPU Lab Access','Kaggle Projects','Industry Hackathons','Tech Placements'], 4);

-- Sample gallery
INSERT INTO gallery (title, image_url, category, sort_order) VALUES
('Students in Lecture Hall', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80', 'Campus Life', 1),
('Library & Study Spaces', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80', 'Facilities', 2),
('Science Laboratory', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80', 'Facilities', 3),
('Campus Grounds', 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', 'Campus Life', 4),
('Student Collaboration', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80', 'Campus Life', 5),
('Graduation Ceremony', 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&q=80', 'Graduation', 6);

-- Sample testimonials
INSERT INTO testimonials (name, role, content, rating) VALUES
('Priya Menon', 'BSc Business Management, Batch 2024', 'Orbit Education transformed my life. The faculty are world-class, and the campus support network is unlike anything I''d experienced before. I landed my dream job before graduation!', 5),
('Arjun Sharma', 'BTech Artificial Intelligence, Batch 2023', 'The AI programme here is cutting-edge. We had access to real GPUs, worked on live industry projects, and the placement team helped me get into a top tech firm.', 5),
('Sarah Thomas', 'BSc Psychology, Batch 2024', 'The counselling resources and the quality of teaching in the Psychology department are exceptional. I felt supported at every step of my journey.', 5),
('Rahul Kumar', 'BBA Banking & Finance, Batch 2023', 'The industry exposure here is incredible. Guest lectures from bankers, stock market simulations, and live trading labs — truly a career-defining experience.', 4);

-- Sample events
INSERT INTO events (title, description, event_date, event_time, location, category, is_featured) VALUES
('Annual Heritage Jazz Ensemble', 'Experience the magic of jazz performed by our talented music students and faculty at the iconic heritage auditorium.', '2026-05-15', '6:00 PM', 'Heritage Auditorium', 'Cultural', true),
('Graduate Open House & Forum', 'Join us for an evening of networking, programme presentations, and one-on-one counselling with our admissions team.', '2026-04-20', '10:00 AM', 'Main Campus Hall', 'Academic', false),
('Symposium on Neural Ethics', 'A thought-provoking academic symposium exploring the ethical dimensions of artificial intelligence and neural networks.', '2026-04-28', '9:00 AM', 'Tech Block Auditorium', 'Seminar', false);

-- Sample news
INSERT INTO news (title, excerpt, category, badge_text, badge_color) VALUES
('Exams Schedule Released — B.Tech S3/S5/S7 Exam', 'The examination department has released the schedule for all B.Tech odd semester examinations. Students must check their hall tickets.', 'Academic', 'Exam Notice', '#dc2626'),
('Guest Admission - B.Tech/M.Tech/MBA', 'Applications are now open for lateral entry admissions across all programmes. Eligible candidates can apply online through the admissions portal.', 'Admissions', 'Admissions', '#2D7D6F'),
('Scholarship Applications Open for 2026 Batch', 'Merit-based and need-based scholarship applications are now being accepted. Up to 80% fee waiver available for qualifying students.', 'Academic', 'Scholarship', '#d97706');

-- =============================================
-- Create your first admin account
-- Step 1: Get a bcrypt hash from https://bcrypt.online (cost 10)
-- Step 2: Replace the hash below and run
-- =============================================

-- INSERT INTO members (name, email, password_hash, role)
-- VALUES ('Admin Name', 'admin@orbitedu.com', '$2a$10$YOUR_HASH_HERE', 'admin');

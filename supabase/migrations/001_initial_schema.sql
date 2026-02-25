-- ============================================
-- ColegiosRD.com - Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE school_type AS ENUM ('Privado', 'Público');
CREATE TYPE school_level AS ENUM ('Pre-escolar', 'Primaria', 'Secundaria', 'K-12', 'Técnico-Profesional');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE subscription_tier AS ENUM ('basico', 'verificado', 'premium', 'elite');
CREATE TYPE user_role AS ENUM ('admin', 'school_admin', 'parent', 'viewer');

-- ============================================
-- PROVINCES TABLE
-- ============================================
CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  zone TEXT NOT NULL, -- 'Santo Domingo', 'Santiago', 'Norte', 'Sur', 'Este', 'Cibao Central', 'Nordeste'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCHOOLS TABLE
-- ============================================
CREATE TABLE schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  minerd_code TEXT UNIQUE, -- Official MINERD identifier
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly name
  province_id INTEGER REFERENCES provinces(id),
  type school_type NOT NULL,
  level school_level NOT NULL DEFAULT 'Secundaria',

  -- MINERD Data (NOT editable by schools)
  prueba_nacional DECIMAL(5,2), -- Pruebas Nacionales score
  enrollment INTEGER, -- Official student count
  minerd_data JSONB DEFAULT '{}', -- Additional MINERD data
  minerd_last_updated TIMESTAMPTZ,

  -- Calculated
  rating DECIMAL(3,1), -- 0-10 composite rating
  students_per_class INTEGER,

  -- School-editable fields (only when verified)
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  logo_url TEXT,
  founded INTEGER,
  tuition_min INTEGER, -- Monthly in RD$
  tuition_max INTEGER,

  -- Arrays
  extracurriculars TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  infrastructure TEXT[] DEFAULT '{}',

  -- Media (Premium+)
  photos TEXT[] DEFAULT '{}',
  video_url TEXT,
  social_links JSONB DEFAULT '{}', -- { facebook, instagram, twitter, youtube }

  -- Verification & Subscription
  verification_status verification_status DEFAULT 'unverified',
  subscription_tier subscription_tier DEFAULT 'basico',
  verified_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,

  -- Flags
  is_top_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE, -- For search highlighting (Premium+)
  hide_competitor_ads BOOLEAN DEFAULT FALSE, -- Premium+

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_schools_province ON schools(province_id);
CREATE INDEX idx_schools_type ON schools(type);
CREATE INDEX idx_schools_rating ON schools(rating DESC);
CREATE INDEX idx_schools_prueba ON schools(prueba_nacional DESC);
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_name_trgm ON schools USING gin(name gin_trgm_ops);
CREATE INDEX idx_schools_verification ON schools(verification_status);
CREATE INDEX idx_schools_tier ON schools(subscription_tier);
CREATE INDEX idx_schools_top_public ON schools(is_top_public) WHERE is_top_public = TRUE;

-- ============================================
-- OPEN HOUSE EVENTS
-- ============================================
CREATE TABLE open_house_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE, -- Paid highlight
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_openhouse_date ON open_house_events(event_date);
CREATE INDEX idx_openhouse_school ON open_house_events(school_id);

-- ============================================
-- SCHOOL VERIFICATION REQUESTS
-- ============================================
CREATE TABLE verification_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

  -- Contact info
  director_name TEXT NOT NULL,
  director_phone TEXT NOT NULL,
  requester_role TEXT NOT NULL, -- Director, Subdirector, Admisiones, etc.
  official_contact_email TEXT NOT NULL, -- Contact for ColegiosRD communications

  -- Verification
  email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'institutional' or 'personal'
  documents TEXT[] DEFAULT '{}', -- URLs to uploaded documents (for personal email)

  -- Status
  status verification_status DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_status ON verification_requests(status);
CREATE INDEX idx_verification_school ON verification_requests(school_id);

-- ============================================
-- CONTACT/LEAD REQUESTS
-- ============================================
CREATE TABLE contact_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'info', 'visit', 'openhouse'
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_school ON contact_requests(school_id);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'website', -- 'website', 'openhouse', 'contact'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(subscribed) WHERE subscribed = TRUE;

-- ============================================
-- AD INQUIRY REQUESTS
-- ============================================
CREATE TABLE ad_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT,
  inquiry_type TEXT DEFAULT 'general', -- 'banner', 'school_package', 'general'
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DATA IMPORT LOG (for MINERD data tracking)
-- ============================================
CREATE TABLE data_imports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source TEXT NOT NULL, -- 'minerd', 'manual', 'school_update'
  records_processed INTEGER DEFAULT 0,
  records_added INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_excluded INTEGER DEFAULT 0, -- e.g., 0-score exclusions
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- ANALYTICS (basic page views per school)
-- ============================================
CREATE TABLE school_views (
  id BIGSERIAL PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  viewed_at DATE DEFAULT CURRENT_DATE,
  view_count INTEGER DEFAULT 1
);

CREATE UNIQUE INDEX idx_school_views_unique ON school_views(school_id, viewed_at);
CREATE INDEX idx_school_views_school ON school_views(school_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_house_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_views ENABLE ROW LEVEL SECURITY;

-- Public read access to schools
CREATE POLICY "Schools are viewable by everyone" ON schools
  FOR SELECT USING (true);

-- Public read access to open house events
CREATE POLICY "Open house events are viewable by everyone" ON open_house_events
  FOR SELECT USING (true);

-- Anyone can submit contact requests
CREATE POLICY "Anyone can create contact requests" ON contact_requests
  FOR INSERT WITH CHECK (true);

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Anyone can submit ad inquiries
CREATE POLICY "Anyone can submit ad inquiries" ON ad_inquiries
  FOR INSERT WITH CHECK (true);

-- School views - public insert, admin read
CREATE POLICY "Anyone can log views" ON school_views
  FOR INSERT WITH CHECK (true);

-- Verification requests - anyone can create, only admin can read
CREATE POLICY "Anyone can submit verification" ON verification_requests
  FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate composite rating
CREATE OR REPLACE FUNCTION calculate_rating(
  p_prueba DECIMAL,
  p_students_per_class INTEGER,
  p_infrastructure TEXT[],
  p_extracurriculars TEXT[],
  p_languages TEXT[],
  p_certifications TEXT[],
  p_founded INTEGER,
  p_is_verified BOOLEAN
) RETURNS DECIMAL AS $$
DECLARE
  score DECIMAL := 0;
  infra_score DECIMAL;
  extra_score DECIMAL;
  lang_score DECIMAL;
  age_score DECIMAL;
BEGIN
  -- Pruebas Nacionales: 40% (scale 0-100 to 0-10)
  IF p_prueba IS NOT NULL AND p_prueba > 0 THEN
    score := score + (p_prueba / 100.0 * 10) * 0.40;
  END IF;

  -- Students per class: 15% (lower is better, ideal < 20)
  IF p_students_per_class IS NOT NULL AND p_students_per_class > 0 THEN
    score := score + LEAST(10, GREATEST(0, (40 - p_students_per_class) / 3.0)) * 0.15;
  END IF;

  -- Infrastructure: 10% (count of items, max 10)
  infra_score := LEAST(10, COALESCE(array_length(p_infrastructure, 1), 0) * 1.5);
  score := score + infra_score * 0.10;

  -- Extracurriculars: 10%
  extra_score := LEAST(10, COALESCE(array_length(p_extracurriculars, 1), 0) * 1.2);
  score := score + extra_score * 0.10;

  -- Languages & certifications: 10%
  lang_score := LEAST(10, (COALESCE(array_length(p_languages, 1), 0) * 2.5 + COALESCE(array_length(p_certifications, 1), 0) * 2));
  score := score + lang_score * 0.10;

  -- Founded/age: 5% (older = more established)
  IF p_founded IS NOT NULL THEN
    age_score := LEAST(10, (EXTRACT(YEAR FROM NOW()) - p_founded) / 8.0);
    score := score + age_score * 0.05;
  END IF;

  -- Verification bonus: 5%
  IF p_is_verified THEN
    score := score + 10 * 0.05;
  END IF;

  -- Complementary data: 5% (based on completeness)
  score := score + 5 * 0.05; -- Base 5 for existing data

  RETURN ROUND(LEAST(10, GREATEST(0, score)), 1);
END;
$$ LANGUAGE plpgsql;

-- Increment school view count (upsert)
CREATE OR REPLACE FUNCTION increment_school_view(p_school_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO school_views (school_id, viewed_at, view_count)
  VALUES (p_school_id, CURRENT_DATE, 1)
  ON CONFLICT (school_id, viewed_at)
  DO UPDATE SET view_count = school_views.view_count + 1;
END;
$$ LANGUAGE plpgsql;

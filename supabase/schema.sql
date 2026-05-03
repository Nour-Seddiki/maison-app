-- ============================================================
-- MAISON & CO. — SUPABASE SCHEMA
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('client', 'seller', 'admin');
CREATE TYPE property_status AS ENUM ('draft', 'pending_review', 'active', 'sold', 'rented', 'off_market');
CREATE TYPE property_type AS ENUM ('penthouse', 'townhouse', 'villa', 'apartment', 'estate', 'mews', 'manor');
CREATE TYPE listing_type AS ENUM ('sale', 'rent', 'off_market');
CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'viewing_scheduled', 'negotiating', 'closed', 'declined');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
-- Run this migration if upgrading an existing database:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS national_id TEXT;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  nationality TEXT,
  national_id TEXT,
  preferred_currency TEXT DEFAULT 'GBP',
  bio TEXT,
  company_name TEXT,
  license_number TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  nda_signed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEIGHBORHOODS
-- ============================================================

CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United Kingdom',
  description TEXT,
  cover_image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROPERTIES
-- ============================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  property_type property_type NOT NULL,
  listing_type listing_type NOT NULL DEFAULT 'sale',
  status property_status NOT NULL DEFAULT 'draft',
  full_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT,
  neighborhood_id UUID REFERENCES neighborhoods(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price BIGINT NOT NULL,
  price_per_week BIGINT,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  sq_ft INTEGER,
  floors INTEGER,
  year_built INTEGER,
  is_freehold BOOLEAN DEFAULT TRUE,
  is_grade_listed BOOLEAN DEFAULT FALSE,
  grade_listing TEXT,
  description TEXT,
  narrative TEXT,
  editorial_accent_color TEXT DEFAULT '#C9A96E',
  cover_image_url TEXT,
  features TEXT[],
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_off_market BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROPERTY IMAGES
-- ============================================================

CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAVED PROPERTIES (Wishlist)
-- ============================================================

CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ============================================================
-- INQUIRIES
-- ============================================================

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  message TEXT,
  preferred_viewing_date DATE,
  status inquiry_status DEFAULT 'new',
  seller_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONCIERGES
-- ============================================================

CREATE TABLE concierges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialization TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MARKET INSIGHTS (Blog Articles)
-- ============================================================

CREATE TABLE market_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEWSLETTER SUBSCRIPTIONS
-- ============================================================

CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_confirmed BOOLEAN DEFAULT FALSE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVESTMENT CALCULATOR SESSIONS
-- ============================================================

CREATE TABLE calculator_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  investment_amount BIGINT,
  interest_rate DECIMAL(5,2),
  duration_years INTEGER,
  projected_return BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_properties_seller ON properties(seller_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood_id);
CREATE INDEX idx_properties_featured ON properties(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_inquiries_seller ON inquiries(seller_id);
CREATE INDEX idx_inquiries_client ON inquiries(client_id);
CREATE INDEX idx_saved_user ON saved_properties(user_id);
CREATE INDEX idx_insights_published ON market_insights(is_published, published_at DESC);

-- ============================================================
-- TRIGGERS — updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER insights_updated_at BEFORE UPDATE ON market_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER — auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierges ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (get_user_role() = 'admin');
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (get_user_role() = 'admin');

-- PROPERTIES
CREATE POLICY "Anyone can read active properties" ON properties FOR SELECT USING (status = 'active' AND is_off_market = FALSE);
CREATE POLICY "NDA clients can read off-market" ON properties FOR SELECT USING (is_off_market = TRUE AND auth.uid() IN (SELECT id FROM profiles WHERE nda_signed = TRUE));
CREATE POLICY "Sellers can read own listings" ON properties FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Sellers can insert listings" ON properties FOR INSERT WITH CHECK (seller_id = auth.uid() AND get_user_role() = 'seller');
CREATE POLICY "Sellers can update own listings" ON properties FOR UPDATE USING (seller_id = auth.uid());
CREATE POLICY "Sellers can delete own draft listings" ON properties FOR DELETE USING (seller_id = auth.uid() AND status = 'draft');
CREATE POLICY "Admins full access properties" ON properties FOR ALL USING (get_user_role() = 'admin');

-- PROPERTY IMAGES
CREATE POLICY "Anyone can view images of active properties" ON property_images FOR SELECT USING (property_id IN (SELECT id FROM properties WHERE status = 'active'));
CREATE POLICY "Sellers can manage own property images" ON property_images FOR ALL USING (property_id IN (SELECT id FROM properties WHERE seller_id = auth.uid()));
CREATE POLICY "Admins full access images" ON property_images FOR ALL USING (get_user_role() = 'admin');

-- SAVED PROPERTIES
CREATE POLICY "Users manage own saved properties" ON saved_properties FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can read saved properties" ON saved_properties FOR SELECT USING (get_user_role() = 'admin');

-- INQUIRIES
CREATE POLICY "Clients see own inquiries" ON inquiries FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Clients can create inquiries" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Sellers see inquiries on their properties" ON inquiries FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Sellers can update inquiry status" ON inquiries FOR UPDATE USING (seller_id = auth.uid());
CREATE POLICY "Admins full access inquiries" ON inquiries FOR ALL USING (get_user_role() = 'admin');

-- CONCIERGES
CREATE POLICY "Anyone can read active concierges" ON concierges FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage concierges" ON concierges FOR ALL USING (get_user_role() = 'admin');

-- MARKET INSIGHTS
CREATE POLICY "Anyone can read published insights" ON market_insights FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins full access insights" ON market_insights FOR ALL USING (get_user_role() = 'admin');

-- NEWSLETTER
CREATE POLICY "Anyone can subscribe" ON newsletter_subscriptions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can read subscriptions" ON newsletter_subscriptions FOR SELECT USING (get_user_role() = 'admin');

-- ============================================================
-- SEED DATA — Neighborhoods
-- ============================================================

INSERT INTO neighborhoods (name, city, country, slug) VALUES
  ('Mayfair', 'London', 'United Kingdom', 'mayfair'),
  ('Chelsea', 'London', 'United Kingdom', 'chelsea'),
  ('Belgravia', 'London', 'United Kingdom', 'belgravia'),
  ('Knightsbridge', 'London', 'United Kingdom', 'knightsbridge'),
  ('Kensington', 'London', 'United Kingdom', 'kensington'),
  ('Notting Hill', 'London', 'United Kingdom', 'notting-hill'),
  ('Southbank', 'London', 'United Kingdom', 'southbank'),
  ('Marylebone', 'London', 'United Kingdom', 'marylebone');

-- ============================================================
-- HELPER: Increment view count
-- ============================================================

CREATE OR REPLACE FUNCTION increment_view_count(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties SET view_count = view_count + 1 WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

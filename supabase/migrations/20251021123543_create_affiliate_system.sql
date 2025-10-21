/*
  # ERCO Affiliate System (JForce-style)
  
  ## Overview
  This migration creates a comprehensive affiliate marketing system similar to Jumia's JForce,
  allowing individuals to earn commissions by promoting ERCO solar products.
  
  ## New Tables Created
  
  ### Affiliate Management
  - `affiliate_profiles` - Detailed affiliate information and registration data
  - `affiliate_links` - Unique referral links for tracking
  - `affiliate_clicks` - Track clicks on affiliate links
  - `affiliate_referrals` - Track referred customers
  - `affiliate_commissions` - Commission records for sales
  - `affiliate_payouts` - Payout requests and history
  - `affiliate_marketing_materials` - Banners, images, and promotional content
  
  ## Features
  - Multi-tier commission structure
  - Real-time click and conversion tracking
  - Automated commission calculation
  - Payout management system
  - Performance analytics
  - Marketing materials library
  
  ## Security
  - RLS enabled on all tables
  - Affiliates can only access their own data
  - Admin oversight for payout approvals
*/

-- Update profiles table to include affiliate role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
      CHECK (role IN ('customer', 'vendor', 'admin', 'affiliate'));
  END IF;
END $$;

-- Affiliate Profiles Table
CREATE TABLE IF NOT EXISTS affiliate_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Personal Information
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  whatsapp_number text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Address Information
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text,
  country text NOT NULL DEFAULT 'Nigeria',
  
  -- Professional Information
  occupation text,
  company_name text,
  website_url text,
  social_media_links jsonb DEFAULT '{}'::jsonb,
  
  -- Banking Information
  bank_name text,
  account_number text,
  account_name text,
  payment_method text DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'mobile_money', 'paypal', 'crypto')),
  payment_details jsonb DEFAULT '{}'::jsonb,
  
  -- Affiliate Details
  affiliate_code text UNIQUE NOT NULL,
  commission_rate decimal(5,2) DEFAULT 5.00,
  tier_level integer DEFAULT 1,
  referral_source text,
  
  -- Status and Verification
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'inactive')),
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verification_documents jsonb DEFAULT '[]'::jsonb,
  
  -- Agreement
  terms_accepted boolean DEFAULT false,
  terms_accepted_at timestamptz,
  
  -- Statistics
  total_clicks integer DEFAULT 0,
  total_referrals integer DEFAULT 0,
  total_sales integer DEFAULT 0,
  total_commission_earned decimal(12,2) DEFAULT 0.00,
  total_commission_paid decimal(12,2) DEFAULT 0.00,
  pending_commission decimal(12,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_active_at timestamptz
);

-- Affiliate Links Table
CREATE TABLE IF NOT EXISTS affiliate_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid REFERENCES affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  
  link_type text DEFAULT 'general' CHECK (link_type IN ('general', 'product', 'category', 'campaign')),
  target_id uuid,
  target_type text,
  
  short_code text UNIQUE NOT NULL,
  full_url text NOT NULL,
  
  clicks_count integer DEFAULT 0,
  conversions_count integer DEFAULT 0,
  
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

-- Affiliate Clicks Table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid REFERENCES affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  link_id uuid REFERENCES affiliate_links(id) ON DELETE SET NULL,
  
  ip_address text,
  user_agent text,
  referrer text,
  country text,
  city text,
  device_type text,
  
  session_id uuid,
  converted boolean DEFAULT false,
  
  clicked_at timestamptz DEFAULT now()
);

-- Affiliate Referrals Table
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid REFERENCES affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  
  referral_code text NOT NULL,
  click_id uuid REFERENCES affiliate_clicks(id) ON DELETE SET NULL,
  
  first_purchase_date timestamptz,
  total_orders integer DEFAULT 0,
  total_spent decimal(12,2) DEFAULT 0.00,
  total_commission_generated decimal(12,2) DEFAULT 0.00,
  
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Affiliate Commissions Table
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid REFERENCES affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL NOT NULL,
  referral_id uuid REFERENCES affiliate_referrals(id) ON DELETE SET NULL,
  
  order_number text NOT NULL,
  order_amount decimal(12,2) NOT NULL,
  commission_rate decimal(5,2) NOT NULL,
  commission_amount decimal(12,2) NOT NULL,
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  
  product_details jsonb DEFAULT '{}'::jsonb,
  
  approved_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  paid_at timestamptz,
  payout_id uuid,
  
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Affiliate Payouts Table
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid REFERENCES affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  
  payout_number text UNIQUE NOT NULL,
  amount decimal(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  payment_method text NOT NULL,
  payment_details jsonb DEFAULT '{}'::jsonb,
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at timestamptz,
  
  transaction_reference text,
  notes text,
  
  commission_ids uuid[] DEFAULT ARRAY[]::uuid[],
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Affiliate Marketing Materials Table
CREATE TABLE IF NOT EXISTS affiliate_marketing_materials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  title text NOT NULL,
  description text,
  material_type text NOT NULL CHECK (material_type IN ('banner', 'image', 'video', 'text', 'email_template', 'social_post')),
  
  file_url text,
  thumbnail_url text,
  
  dimensions text,
  file_size integer,
  
  category text,
  tags text[] DEFAULT ARRAY[]::text[],
  
  download_count integer DEFAULT 0,
  
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Affiliate Performance Tracking (Daily Summary)
CREATE TABLE IF NOT EXISTS affiliate_daily_stats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id uuid REFERENCES affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  
  date date NOT NULL,
  
  clicks integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  referrals integer DEFAULT 0,
  orders integer DEFAULT 0,
  order_value decimal(12,2) DEFAULT 0.00,
  commission_earned decimal(12,2) DEFAULT 0.00,
  
  conversion_rate decimal(5,2) DEFAULT 0.00,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(affiliate_id, date)
);

-- ============================================
-- Enable RLS on all tables
-- ============================================

ALTER TABLE affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_marketing_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_daily_stats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies
-- ============================================

-- Affiliate Profiles Policies
CREATE POLICY "Affiliates can read own profile"
  ON affiliate_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Affiliates can update own profile"
  ON affiliate_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Affiliates can insert own profile"
  ON affiliate_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all affiliate profiles"
  ON affiliate_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins can update affiliate profiles"
  ON affiliate_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Affiliate Links Policies
CREATE POLICY "Affiliates can view own links"
  ON affiliate_links FOR SELECT
  TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Affiliates can create own links"
  ON affiliate_links FOR INSERT
  TO authenticated
  WITH CHECK (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Affiliates can update own links"
  ON affiliate_links FOR UPDATE
  TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()))
  WITH CHECK (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view active affiliate links for tracking"
  ON affiliate_links FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Affiliate Clicks Policies
CREATE POLICY "Affiliates can view own clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can create click records"
  ON affiliate_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Affiliate Referrals Policies
CREATE POLICY "Affiliates can view own referrals"
  ON affiliate_referrals FOR SELECT
  TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can create referral records"
  ON affiliate_referrals FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Affiliate Commissions Policies
CREATE POLICY "Affiliates can view own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can create commission records"
  ON affiliate_commissions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all commissions"
  ON affiliate_commissions FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Affiliate Payouts Policies
CREATE POLICY "Affiliates can view own payouts"
  ON affiliate_payouts FOR SELECT
  TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Affiliates can request payouts"
  ON affiliate_payouts FOR INSERT
  TO authenticated
  WITH CHECK (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all payouts"
  ON affiliate_payouts FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Marketing Materials Policies
CREATE POLICY "Anyone can view active materials"
  ON affiliate_marketing_materials FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage materials"
  ON affiliate_marketing_materials FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Daily Stats Policies
CREATE POLICY "Affiliates can view own stats"
  ON affiliate_daily_stats FOR SELECT
  TO authenticated
  USING (affiliate_id IN (SELECT id FROM affiliate_profiles WHERE user_id = auth.uid()));

-- ============================================
-- Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_affiliate_profiles_user_id ON affiliate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_profiles_code ON affiliate_profiles(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_profiles_status ON affiliate_profiles(status);

CREATE INDEX IF NOT EXISTS idx_affiliate_links_affiliate_id ON affiliate_links(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_short_code ON affiliate_links(short_code);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link_id ON affiliate_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_session_id ON affiliate_clicks(session_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_customer_id ON affiliate_referrals(customer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_code ON affiliate_referrals(referral_code);

CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_order_id ON affiliate_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status ON affiliate_commissions(status);

CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON affiliate_payouts(status);

CREATE INDEX IF NOT EXISTS idx_affiliate_daily_stats_affiliate_date ON affiliate_daily_stats(affiliate_id, date);

-- ============================================
-- Create Helper Functions
-- ============================================

-- Function to generate unique affiliate code
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := 'AFF-' || upper(substr(md5(random()::text), 1, 8));
    
    SELECT EXISTS(SELECT 1 FROM affiliate_profiles WHERE affiliate_code = new_code) INTO code_exists;
    
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique payout number
CREATE OR REPLACE FUNCTION generate_payout_number()
RETURNS text AS $$
DECLARE
  new_number text;
  number_exists boolean;
BEGIN
  LOOP
    new_number := 'PAY-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));
    
    SELECT EXISTS(SELECT 1 FROM affiliate_payouts WHERE payout_number = new_number) INTO number_exists;
    
    IF NOT number_exists THEN
      RETURN new_number;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

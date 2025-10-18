/*
  # ERCO Solar Marketplace Platform - Complete Database Schema
  
  ## Overview
  This migration creates the complete database structure for the ERCO AI-powered solar e-commerce marketplace,
  supporting customers, vendors, and admin users with comprehensive product management, order processing,
  and AI-powered features.
  
  ## New Tables Created
  
  ### User Management
  - `profiles` - Extended user profiles with role differentiation (customer, vendor, admin)
  - `vendor_profiles` - Detailed vendor business information and verification status
  
  ### Product Management
  - `product_categories` - Solar product categories (panels, inverters, batteries, kits, accessories)
  - `products` - Main product catalog with solar-specific specifications
  - `product_images` - Multiple images per product
  - `product_tags` - AI-generated and manual tags for products
  
  ### Shopping & Orders
  - `cart_items` - Persistent shopping cart for logged-in users
  - `orders` - Order records with payment and fulfillment status
  - `order_items` - Line items for each order
  - `reviews` - Product reviews and ratings from verified purchases
  
  ### AI Features
  - `ai_recommendations` - History of AI-generated product recommendations
  - `ai_chat_sessions` - Chat history with AI assistant
  - `ai_product_tags` - AI-generated product categorization and metadata
  
  ### Analytics & Business Intelligence
  - `vendor_analytics` - Daily vendor performance metrics
  - `product_views` - Product view tracking for analytics
  - `admin_logs` - Audit trail of admin actions
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Comprehensive policies for role-based access control
  - Customers can only access their own data
  - Vendors can only manage their own products and orders
  - Admin has oversight access to all data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: Create all tables without RLS policies
-- ============================================

-- User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vendor Profiles Table
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name text NOT NULL,
  business_description text,
  business_address text,
  business_phone text,
  business_email text,
  tax_id text,
  logo_url text,
  banner_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
  verification_documents jsonb DEFAULT '[]'::jsonb,
  rating_average decimal(3,2) DEFAULT 0.00,
  rating_count integer DEFAULT 0,
  total_sales integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  parent_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  specifications jsonb DEFAULT '{}'::jsonb,
  price decimal(12,2) NOT NULL,
  compare_at_price decimal(12,2),
  capacity text,
  voltage text,
  warranty_years integer DEFAULT 1,
  brand text,
  stock_quantity integer DEFAULT 0,
  sku text,
  weight_kg decimal(8,2),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Product Tags Table
CREATE TABLE IF NOT EXISTS product_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL,
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),
  confidence_score decimal(3,2),
  created_at timestamptz DEFAULT now()
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  subtotal decimal(12,2) NOT NULL,
  tax decimal(12,2) DEFAULT 0.00,
  shipping_cost decimal(12,2) DEFAULT 0.00,
  discount decimal(12,2) DEFAULT 0.00,
  total decimal(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL NOT NULL,
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE SET NULL NOT NULL,
  product_name text NOT NULL,
  product_sku text,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(12,2) NOT NULL,
  subtotal decimal(12,2) NOT NULL,
  fulfillment_status text DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  is_verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, customer_id, order_id)
);

-- AI Recommendations Table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id uuid NOT NULL,
  quiz_data jsonb NOT NULL,
  recommended_products jsonb NOT NULL,
  explanation text,
  created_at timestamptz DEFAULT now()
);

-- AI Chat Sessions Table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id uuid NOT NULL,
  messages jsonb DEFAULT '[]'::jsonb,
  context text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Product Tags
CREATE TABLE IF NOT EXISTS ai_product_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  detected_category text,
  detected_specs jsonb DEFAULT '{}'::jsonb,
  confidence_score decimal(3,2),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Vendor Analytics Table
CREATE TABLE IF NOT EXISTS vendor_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  total_views integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_revenue decimal(12,2) DEFAULT 0.00,
  total_products_sold integer DEFAULT 0,
  average_order_value decimal(12,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  UNIQUE(vendor_id, date)
);

-- Product Views Tracking
CREATE TABLE IF NOT EXISTS product_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id uuid,
  viewed_at timestamptz DEFAULT now()
);

-- Admin Logs Table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- STEP 2: Enable RLS on all tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create RLS Policies
-- ============================================

-- Profiles Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Vendor Profiles Policies
CREATE POLICY "Vendors can read own profile"
  ON vendor_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Vendors can update own profile"
  ON vendor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Vendors can insert own profile"
  ON vendor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view approved vendors"
  ON vendor_profiles FOR SELECT
  TO anon
  USING (verification_status = 'approved');

-- Product Categories Policies
CREATE POLICY "Anyone can view categories"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Products Policies
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Vendors can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()))
  WITH CHECK (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()));

-- Product Images Policies
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Vendors can manage own product images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (product_id IN (
    SELECT p.id FROM products p
    JOIN vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  ));

CREATE POLICY "Vendors can update own product images"
  ON product_images FOR UPDATE
  TO authenticated
  USING (product_id IN (
    SELECT p.id FROM products p
    JOIN vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  ))
  WITH CHECK (product_id IN (
    SELECT p.id FROM products p
    JOIN vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  ));

CREATE POLICY "Vendors can delete own product images"
  ON product_images FOR DELETE
  TO authenticated
  USING (product_id IN (
    SELECT p.id FROM products p
    JOIN vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  ));

-- Product Tags Policies
CREATE POLICY "Anyone can view product tags"
  ON product_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Vendors can manage own product tags"
  ON product_tags FOR INSERT
  TO authenticated
  WITH CHECK (product_id IN (
    SELECT p.id FROM products p
    JOIN vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  ));

-- Cart Items Policies
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert to own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Orders Policies
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- Order Items Policies
CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));

CREATE POLICY "Vendors can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can update own order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()))
  WITH CHECK (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()));

-- Reviews Policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid() AND
    order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
  );

CREATE POLICY "Customers can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- AI Recommendations Policies
CREATE POLICY "Users can view own recommendations"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own recommendations"
  ON ai_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- AI Chat Sessions Policies
CREATE POLICY "Users can view own chat sessions"
  ON ai_chat_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own chat sessions"
  ON ai_chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions"
  ON ai_chat_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- AI Product Tags Policies
CREATE POLICY "Vendors can view own product AI tags"
  ON ai_product_tags FOR SELECT
  TO authenticated
  USING (product_id IN (
    SELECT p.id FROM products p
    JOIN vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  ));

-- Vendor Analytics Policies
CREATE POLICY "Vendors can view own analytics"
  ON vendor_analytics FOR SELECT
  TO authenticated
  USING (vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid()));

-- Product Views Policies
CREATE POLICY "Anyone can create product views"
  ON product_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin Logs Policies
CREATE POLICY "Only admins can view logs"
  ON admin_logs FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- ============================================
-- STEP 4: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_user_id ON vendor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_status ON vendor_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON order_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_analytics_vendor_date ON vendor_analytics(vendor_id, date);

-- ============================================
-- STEP 5: Insert Default Data
-- ============================================

INSERT INTO product_categories (name, slug, description, icon, display_order) VALUES
  ('Solar Panels', 'solar-panels', 'High-efficiency solar panels for residential and commercial use', 'Sun', 1),
  ('Inverters', 'inverters', 'Convert DC power to AC power for home and business use', 'Zap', 2),
  ('Batteries', 'batteries', 'Energy storage solutions for backup and off-grid systems', 'Battery', 3),
  ('Solar Kits', 'solar-kits', 'Complete solar power system packages', 'Package', 4),
  ('Accessories', 'accessories', 'Mounting hardware, cables, and other solar accessories', 'Wrench', 5)
ON CONFLICT (slug) DO NOTHING;

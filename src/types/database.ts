export type UserRole = 'customer' | 'vendor' | 'admin' | 'affiliate';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type AffiliateStatus = 'pending' | 'active' | 'suspended' | 'inactive';

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  tax_id?: string;
  logo_url?: string;
  banner_url?: string;
  verification_status: VerificationStatus;
  verification_documents: any[];
  rating_average: number;
  rating_count: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string;
  specifications: Record<string, any>;
  price: number;
  compare_at_price?: number;
  capacity?: string;
  voltage?: string;
  warranty_years: number;
  brand?: string;
  stock_quantity: number;
  sku?: string;
  weight_kg?: number;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  vendor_profile?: VendorProfile;
  category?: ProductCategory;
  images?: ProductImage[];
  tags?: ProductTag[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductTag {
  id: string;
  product_id: string;
  tag: string;
  source: 'manual' | 'ai';
  confidence_score?: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  currency: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  fulfillment_status: FulfillmentStatus;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  customer?: Profile;
}

export interface AIRecommendation {
  id: string;
  user_id?: string;
  session_id: string;
  quiz_data: QuizData;
  recommended_products: any[];
  explanation?: string;
  created_at: string;
}

export interface QuizData {
  budget?: number;
  home_size?: string;
  energy_consumption?: string;
  location?: string;
  use_case?: string;
  backup_needed?: boolean;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  user_id?: string;
  session_id: string;
  messages: AIChatMessage[];
  context?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorAnalytics {
  id: string;
  vendor_id: string;
  date: string;
  total_views: number;
  total_orders: number;
  total_revenue: number;
  total_products_sold: number;
  average_order_value: number;
  created_at: string;
}

export interface ProductView {
  id: string;
  product_id: string;
  user_id?: string;
  session_id?: string;
  viewed_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details: Record<string, any>;
  created_at: string;
}

export interface AffiliateProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  whatsapp_number?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  occupation?: string;
  company_name?: string;
  website_url?: string;
  social_media_links: Record<string, string>;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  payment_method: 'bank_transfer' | 'mobile_money' | 'paypal' | 'crypto';
  payment_details: Record<string, any>;
  affiliate_code: string;
  commission_rate: number;
  tier_level: number;
  referral_source?: string;
  status: AffiliateStatus;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  verification_documents: any[];
  terms_accepted: boolean;
  terms_accepted_at?: string;
  total_clicks: number;
  total_referrals: number;
  total_sales: number;
  total_commission_earned: number;
  total_commission_paid: number;
  pending_commission: number;
  created_at: string;
  updated_at: string;
  last_active_at?: string;
}

export interface AffiliateLink {
  id: string;
  affiliate_id: string;
  link_type: 'general' | 'product' | 'category' | 'campaign';
  target_id?: string;
  target_type?: string;
  short_code: string;
  full_url: string;
  clicks_count: number;
  conversions_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface AffiliateClick {
  id: string;
  affiliate_id: string;
  link_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: string;
  session_id?: string;
  converted: boolean;
  clicked_at: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  customer_id: string;
  referral_code: string;
  click_id?: string;
  first_purchase_date?: string;
  total_orders: number;
  total_spent: number;
  total_commission_generated: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AffiliateCommission {
  id: string;
  affiliate_id: string;
  order_id: string;
  referral_id?: string;
  order_number: string;
  order_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: CommissionStatus;
  product_details: Record<string, any>;
  approved_at?: string;
  approved_by?: string;
  paid_at?: string;
  payout_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  payout_number: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_details: Record<string, any>;
  status: PayoutStatus;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  completed_at?: string;
  transaction_reference?: string;
  notes?: string;
  commission_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface AffiliateMarketingMaterial {
  id: string;
  title: string;
  description?: string;
  material_type: 'banner' | 'image' | 'video' | 'text' | 'email_template' | 'social_post';
  file_url?: string;
  thumbnail_url?: string;
  dimensions?: string;
  file_size?: number;
  category?: string;
  tags: string[];
  download_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AffiliateDailyStats {
  id: string;
  affiliate_id: string;
  date: string;
  clicks: number;
  unique_visitors: number;
  referrals: number;
  orders: number;
  order_value: number;
  commission_earned: number;
  conversion_rate: number;
  created_at: string;
}
